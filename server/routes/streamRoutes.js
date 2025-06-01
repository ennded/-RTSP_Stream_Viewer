const express = require("express");
const streamController = require("../controllers/streamController");

module.exports = (io) => {
  const router = express.Router();

  router.post("/", streamController.addStream(io));
  router.get("/", streamController.getStreams);
  router.delete("/:id", streamController.deleteStream(io));

  return router;
};
