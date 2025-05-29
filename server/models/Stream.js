const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stream", streamSchema);
