import React, { useState, useEffect, useRef } from "react";
import { joinStreamRoom, leaveStreamRoom, socket } from "../services/socket";

const StreamPlayer = ({ streamId, url, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("connecting");
  const imgRef = useRef(null);

  useEffect(() => {
    joinStreamRoom(streamId);
    setStatus("connecting");

    const handleFrame = (data) => {
      if (data.streamId === streamId && imgRef.current && isPlaying) {
        imgRef.current.src = data.frame;
        setStatus("live");
      }
    };

    const handleError = (data) => {
      if (data.streamId === streamId) {
        setError(data.message);
        setStatus("error");
      }
    };

    socket.on("video-frame", handleFrame);
    socket.on("stream-error", handleError);

    return () => {
      leaveStreamRoom(streamId);
      socket.off("video-frame", handleFrame);
      socket.off("stream-error", handleError);
    };
  }, [streamId, isPlaying]);

  const getStatusDotClass = () => {
    switch (status) {
      case "live":
        return "status-dot live";
      case "error":
        return "status-dot error";
      default:
        return "status-dot connecting";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "live":
        return "LIVE";
      case "error":
        return "ERROR";
      default:
        return "CONNECTING...";
    }
  };

  return (
    <div className="stream-player">
      <div className="stream-status">
        <div className="status-indicator">
          <div className={getStatusDotClass()}></div>
          <span className="status-text">{getStatusText()}</span>
        </div>
        <div className="timestamp">{new Date().toLocaleString()}</div>
      </div>

      <div className="video-container">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="error-message">{error}</div>
          </div>
        ) : (
          <img
            ref={imgRef}
            alt={`Stream from ${url}`}
            className={`video-image ${isPlaying ? "" : "hidden"}`}
          />
        )}

        {!isPlaying && !error && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
              <span className="mt-1 block">Paused</span>
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <div className="control-buttons">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`control-button ${
              isPlaying ? "play-button" : "play-button"
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onDelete}
            className="control-button delete-button"
            title="Delete stream"
          >
            Delete
          </button>
        </div>
        <div className="stream-url" title={url}>
          {url}
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
