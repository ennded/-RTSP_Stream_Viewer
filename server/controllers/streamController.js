const Stream = require("../models/Stream");
const {
  startFFmpegStream,
  stopFFmpegStream,
} = require("../ffmpeg/streamProcessor");

/**
 * Add a new RTSP stream and start FFmpeg for MJPEG conversion
 */
exports.addStream = (io) => async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Stream URL is required." });
    }

    // Create and save stream in DB
    const newStream = new Stream({ url });
    await newStream.save();

    // Start FFmpeg process
    try {
      startFFmpegStream(io, newStream._id.toString(), url);
    } catch (err) {
      // Rollback DB entry if FFmpeg fails
      await Stream.findByIdAndDelete(newStream._id);
      return res.status(500).json({ error: "Failed to start FFmpeg stream." });
    }

    res.status(201).json(newStream);
  } catch (err) {
    console.error("Add stream error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all current streams (sorted by newest first)
 */
exports.getStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.json(streams);
  } catch (err) {
    console.error("Get streams error:", err);
    res.status(500).json({ error: "Failed to fetch streams." });
  }
};

/**
 * Delete stream by ID and stop FFmpeg
 */
exports.deleteStream = (io) => async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Trying to delete stream with id:", id);

    // Check if stream exists
    const deleted = await Stream.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Stream not found" });
    }

    // Stop FFmpeg process
    stopFFmpegStream(id);
    io.to(id).emit("stream-stopped", { streamId: id });
    res.json({ message: "Stream deleted successfully" });
  } catch (err) {
    console.error("Delete stream error:", err);
    res.status(500).json({ error: "Failed to delete stream." });
  }
};
