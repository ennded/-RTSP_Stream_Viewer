const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const ffmpegStatic = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegStatic);
const activeStreams = new Map();

const startFFmpegStream = (io, streamId, rtspUrl) => {
  if (activeStreams.has(streamId)) return; // already streaming

  const mjpegStream = new PassThrough();
  let buffer = Buffer.alloc(0);

  const command = ffmpeg(rtspUrl)
    .inputOptions(["-rtsp_transport", "tcp", "-timeout", "5000000"])
    .outputOptions(["-q:v", "2", "-f", "mjpeg"])
    .on("start", (cmd) => console.log(`Started: ${cmd}`))
    .on("error", (err) => {
      console.error(`FFmpeg error: ${err.message}`);
      io.to(streamId).emit("stream-error", { streamId, message: err.message });
      // Retry after delay
      console.log(`Retrying stream ${streamId} in 5s...`);
      stopFFmpegStream(streamId);
      setTimeout(() => startFFmpegStream(io, streamId, rtspUrl), 5000);
    })
    .on("end", () => {
      console.log(`Stream ended: ${streamId}`);
      console.log(`Reconnecting stream ${streamId} in 5s...`);
      stopFFmpegStream(streamId);
      setTimeout(() => startFFmpegStream(io, streamId, rtspUrl), 5000);
    });

  // Pipe the output of ffmpeg to mjpegStream
  const ffmpegOutput = command.pipe(mjpegStream);

  mjpegStream.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    // JPEG frame ends with 0xFFD9
    const jpegEnd = buffer.indexOf(Buffer.from([0xff, 0xd9]));
    if (jpegEnd !== -1) {
      const jpegData = buffer.slice(0, jpegEnd + 2);
      buffer = buffer.slice(jpegEnd + 2);

      const base64 = jpegData.toString("base64");
      io.to(streamId).emit("video-frame", {
        streamId,
        frame: `data:image/jpeg;base64,${base64}`,
      });
    }
  });

  // Save command to map for stopping later
  activeStreams.set(streamId, command);
};

const stopFFmpegStream = (streamId) => {
  if (!activeStreams.has(streamId)) return;

  const command = activeStreams.get(streamId);
  if (command && command.ffmpegProc && !command.ffmpegProc.killed) {
    command.ffmpegProc.kill("SIGKILL");
    console.log(`Stopped stream ${streamId}`);
  }
  activeStreams.delete(streamId);
};

module.exports = { startFFmpegStream, stopFFmpegStream };
