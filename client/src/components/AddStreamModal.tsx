"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCamera } from "react-icons/fi";
import { useState } from "react";
import { addStream } from "../lib/api";
import { Stream } from "../types/stream"; // ✅ Import the Stream type

interface AddStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamAdded: (stream: Stream) => void; // ✅ Expect full Stream object
}

export default function AddStreamModal({
  isOpen,
  onClose,
  onStreamAdded,
}: AddStreamModalProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid RTSP URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newStream: Stream = await addStream(url); // ✅ Typed correctly
      onStreamAdded(newStream); // ✅ Matches callback type
      setUrl("");
      onClose();
    } catch (err) {
      setError("Failed to add stream.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Stream
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RTSP Stream URL
                </label>
                <div className="relative mb-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiCamera className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 w-full border rounded-lg"
                    placeholder="rtsp://username:pass@ip:port/path"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Stream"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
