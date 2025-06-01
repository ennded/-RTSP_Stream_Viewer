import { useState } from "react";
import { FiTrash2, FiInfo } from "react-icons/fi";
import { deleteStream } from "../lib/api";
import { Stream } from "../types/stream";
import VideoPlayer from "./VideoPlayer";

interface StreamCardProps {
  stream: Stream;
  onDelete: (id: string) => void; // <-- callback prop to notify parent
}

export default function StreamCard({ stream, onDelete }: StreamCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStream(stream._id);
      onDelete(stream._id); // Notify parent to remove stream from list
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting stream:", error.message);
      } else {
        console.error("Error deleting stream:", error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <VideoPlayer
          streamId={stream._id}
          url={stream.url}
          currentFrame={stream.currentFrame}
          error={stream.error}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h3 className="font-medium text-gray-800 truncate">
              {stream.url.split("@")[1]?.split("/")[0] || "RTSP Stream"}
            </h3>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              aria-label={
                showInfo ? "Hide stream details" : "Show stream details"
              }
            >
              <FiInfo size={14} />
              {showInfo ? "Hide details" : "Show details"}
            </button>
            {showInfo && (
              <p className="mt-1 text-xs text-gray-500 break-all">
                {stream.url}
              </p>
            )}
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Delete stream"
            aria-label="Delete stream"
          >
            {isDeleting ? (
              <>
                <span className="sr-only">Deleting stream...</span>
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></span>
              </>
            ) : (
              <FiTrash2 />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
