const Stream = require("../models/Stream");
const {
  startFFmpegStream,
  stopFFmpegStream,
} = require("../ffmpeg/streamProcessor");

exports.addStream = (io) => async (req, res) => {
  try {
    const { url } = req.body;

    // Create new stream document
    const newStream = new Stream({ url });
    await newStream.save();

    try {
      startFFmpegStream(io, newStream._id.toString(), url);
    } catch (ffmpegError) {
      console.error("FFmpeg startup error:", ffmpegError);
      await Stream.findByIdAndDelete(newStream._id);
      throw new Error("Failed to start stream processing");
    }

    res.status(201).json(newStream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStream = (io) => async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Stream.findByIdAndDelete(id);

    if (!stream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    // Stop FFmpeg process
    stopFFmpegStream(id);
    io.to(id).emit("stream-stopped", { streamId: id });

    res.json({ message: "Stream deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
