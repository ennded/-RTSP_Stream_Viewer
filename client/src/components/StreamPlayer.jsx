import React, { useState, useEffect, useRef } from "react";
import { joinStreamRoom, leaveStreamRoom, socket } from "../services/socket";

const StreamPlayer = ({ streamId, url, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("connecting");
  const [isDeleting, setIsDeleting] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const handleConnectError = (err) => {
      console.error("Connection error:", err);
      setError("Connection failed. Retrying...");
      setStatus("error");
    };

    const handleFrame = (data) => {
      if (data.streamId === streamId && imgRef.current && isPlaying) {
        imgRef.current.src = data.frame;
        setStatus("live");
        setError("");
      }
    };

    const handleStreamError = (data) => {
      if (data.streamId === streamId) {
        setError(data.message);
        setStatus("error");
      }
    };

    const handleStreamDeleted = (data) => {
      if (data.streamId === streamId) {
        onDelete();
      }
    };

    socket.on("connect_error", handleConnectError);
    socket.on("video-frame", handleFrame);
    socket.on("stream-error", handleStreamError);
    socket.on("stream-deleted", handleStreamDeleted);

    joinStreamRoom(streamId);
    setStatus("connecting");

    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("video-frame", handleFrame);
      socket.on("stream-error", handleStreamError);
      socket.off("stream-deleted", handleStreamDeleted);
      leaveStreamRoom(streamId);
    };
  }, [streamId, isPlaying, onDelete]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      setError("Failed to delete stream");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="stream-player">
      {/* Status bar */}
      <div className="stream-status">
        <div className="status-indicator">
          <div className={`status-dot ${status}`}></div>
          <span className="status-text">{status.toUpperCase()}</span>
        </div>
        <div className="timestamp">{new Date().toLocaleString()}</div>
      </div>

      {/* Video container */}
      <div className="video-container">
        {error ? (
          <div className="error-display">{error}</div>
        ) : (
          <img
            ref={imgRef}
            alt={`Stream from ${url}`}
            className={`video-image ${isPlaying ? "" : "hidden"}`}
          />
        )}
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`control-button ${isPlaying ? "pause" : "play"}`}
          disabled={isDeleting}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleDelete}
          className="control-button delete"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <div className="stream-url" title={url}>
          {url}
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
