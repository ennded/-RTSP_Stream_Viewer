const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const ffmpegStatic = require("ffmpeg-static");

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Active streams map
const activeStreams = new Map();

const startFFmpegStream = (io, streamId, rtspUrl) => {
  if (activeStreams.has(streamId)) {
    console.log(`Stream ${streamId} already active`);
    return;
  }

  // Create transform stream
  const mjpegStream = new PassThrough();
  let buffer = Buffer.alloc(0);

  // Format URL for Windows if needed
  const formattedUrl =
    process.platform === "win32" ? rtspUrl.replace(/\\/g, "/") : rtspUrl;

  // FFmpeg command setup
  const command = ffmpeg()
    .input(formattedUrl)
    .inputOptions([
      "-rtsp_transport",
      "tcp",
      "-stimeout",
      "5000000", // 5s timeout
    ])
    .outputOptions([
      "-q:v",
      "2", // Quality
      "-f",
      "mjpeg", // Output format
    ])
    .on("start", (cmd) => console.log(`FFmpeg started: ${cmd}`))
    .on("error", (err) => {
      console.error(`FFmpeg error: ${err.message}`);
      io.to(streamId).emit("stream-error", {
        streamId,
        message: err.message,
      });
      stopFFmpegStream(streamId);
    })
    .on("end", () => {
      console.log(`FFmpeg stream ended: ${streamId}`);
      stopFFmpegStream(streamId);
    })
    .pipe(mjpegStream, { end: true });

  // Frame processing
  mjpegStream.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    const jpegEnd = buffer.indexOf(Buffer.from([0xff, 0xd9]));

    if (jpegEnd !== -1) {
      const jpegData = buffer.subarray(0, jpegEnd + 2);
      buffer = buffer.subarray(jpegEnd + 2);

      // Convert to base64 and send
      const base64Frame = jpegData.toString("base64");
      io.to(streamId).emit("video-frame", {
        streamId,
        frame: `data:image/jpeg;base64,${base64Frame}`,
      });
    }
  });

  activeStreams.set(streamId, command);
};

const stopFFmpegStream = (streamId) => {
  if (activeStreams.has(streamId)) {
    const process = activeStreams.get(streamId);
    process.kill("SIGINT");
    activeStreams.delete(streamId);
    console.log(`Stopped FFmpeg process for stream ${streamId}`);
  }
};

module.exports = { startFFmpegStream, stopFFmpegStream };
