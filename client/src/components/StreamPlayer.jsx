import React, { useState, useEffect, useRef } from "react";
import { joinStreamRoom, leaveStreamRoom, socket } from "../services/socket";

const StreamPlayer = ({ streamId, url }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState("");
  const imgRef = useRef(null);

  useEffect(() => {
    // Join socket room
    joinStreamRoom(streamId);

    const handleFrame = (data) => {
      if (data.streamId === streamId && imgRef.current && isPlaying) {
        imgRef.current.src = data.frame;
      }
    };

    const handleError = (data) => {
      if (data.streamId === streamId) {
        setError(data.message);
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

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {error ? (
        <div className="p-4 bg-red-900 text-white">
          <p className="font-medium">Stream Error</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <img
          ref={imgRef}
          alt={`Stream from ${url}`}
          className={`w-full h-48 object-cover ${isPlaying ? "" : "hidden"}`}
        />
      )}

      <div className="p-3 bg-gray-900 flex justify-between items-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <p className="text-gray-300 text-xs truncate max-w-xs" title={url}>
          {url}
        </p>
      </div>
    </div>
  );
};

export default StreamPlayer;
