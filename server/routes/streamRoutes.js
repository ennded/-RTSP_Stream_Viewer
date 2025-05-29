const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

module.exports = (io) => {
  // Add new stream
  router.post("/", streamController.addStream(io));

  // Get all streams
  router.get("/", streamController.getStreams);

  // Delete stream
  router.delete("/:id", streamController.deleteStream(io));

  return router;
};
