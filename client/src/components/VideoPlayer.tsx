"use client";

import { useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { joinStreamRoom, leaveStreamRoom } from "../lib/socket";

interface VideoPlayerProps {
  streamId: string;
  url: string;
  currentFrame?: string;
  error?: string;
  onRetry?: () => void;
}

export default function VideoPlayer({
  streamId,
  url,
  currentFrame,
  error,
  onRetry,
}: VideoPlayerProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    joinStreamRoom(streamId);
    return () => {
      leaveStreamRoom(streamId);
    };
  }, [streamId]);

  useEffect(() => {
    if (currentFrame && imgRef.current) {
      setIsLoading(false);
    }
  }, [currentFrame]);

  const handleImageError = () => {
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="relative w-full h-full bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Frame */}
      {currentFrame ? (
        <img
          ref={imgRef}
          src={currentFrame}
          alt="Live stream"
          className="w-full h-full object-contain"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          {error ? (
            <div className="text-center p-4">
              <FiAlertCircle className="mx-auto text-red-500 text-3xl mb-2" />
              <p className="text-red-500">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-4 px-3 py-1 bg-gray-700 text-white rounded flex items-center gap-2 mx-auto"
                >
                  <FiRefreshCw /> Retry
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500 mb-2"></div>
              <p>Connecting to stream...</p>
            </div>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Stream info overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-white text-sm truncate" title={url}>
            {url}
          </div>
        </div>
      )}
    </div>
  );
}
