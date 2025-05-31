const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const ffmpegStatic = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegStatic);

const activeStreams = new Map();

const startFFmpegStream = (io, streamId, rtspUrl) => {
  console.log(`Starting stream ${streamId} with URL: ${rtspUrl}`); // Debug log

  if (activeStreams.has(streamId)) return;

  const mjpegStream = new PassThrough();
  let buffer = Buffer.alloc(0);

  const formattedUrl =
    process.platform === "win32" ? rtspUrl.replace(/\\/g, "/") : rtspUrl;

  // FIX 1: Remove stimeout option and add TCP timeout alternative
  const command = ffmpeg()
    .input(formattedUrl)
    .inputOptions([
      "-rtsp_transport",
      "tcp",
      "-timeout",
      "5000000", // Use standard timeout option
    ])
    .outputOptions(["-q:v", "2", "-f", "mjpeg"])
    .on("start", (cmd) => console.log(`FFmpeg started: ${cmd}`))
    .on("error", (err) => {
      console.error(`FFmpeg error: ${err.message}`);
      io.to(streamId).emit("stream-error", { streamId, message: err.message });
      stopFFmpegStream(streamId);
    })
    .on("end", () => {
      console.log(`FFmpeg stream ended: ${streamId}`);
      stopFFmpegStream(streamId);
    })
    .pipe(mjpegStream, { end: true });

  mjpegStream.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    const jpegEnd = buffer.indexOf(Buffer.from([0xff, 0xd9]));

    if (jpegEnd !== -1) {
      const jpegData = buffer.subarray(0, jpegEnd + 2);
      buffer = buffer.subarray(jpegEnd + 2);

      const base64Frame = jpegData.toString("base64");
      io.to(streamId).emit("video-frame", {
        streamId,
        frame: `data:image/jpeg;base64,${base64Frame}`,
      });
    }
  });

  // FIX 2: Store the actual child process
  activeStreams.set(streamId, {
    command: command,
    childProcess: command.ffmpegProc,
  });
};

const stopFFmpegStream = (streamId) => {
  if (activeStreams.has(streamId)) {
    const { childProcess } = activeStreams.get(streamId);

    // FIX 3: Properly kill the process
    if (childProcess && !childProcess.killed) {
      process.kill(childProcess.pid, "SIGKILL");
    }

    activeStreams.delete(streamId);
    console.log(`Stopped FFmpeg process for stream ${streamId}`);
  }
};

module.exports = { startFFmpegStream, stopFFmpegStream };
