import React, { useState, useEffect } from "react";
import StreamPlayer from "./StreamPlayer";
import AddStreamForm from "./AddStreamForm";
import { getStreams, addStream, deleteStream } from "../services/api";

const StreamGrid = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const data = await getStreams();
      setStreams(data);
    } catch (err) {
      console.error("Failed to load streams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStream = async (url) => {
    try {
      const newStream = await addStream(url);
      setStreams([...streams, newStream]);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStream(id);
      setStreams(streams.filter((stream) => stream._id !== id));
    } catch (err) {
      console.error("Failed to delete stream:", err);
    }
  };

  return (
    <div>
      <AddStreamForm onSubmit={handleAddStream} />

      {loading ? (
        <div className="text-center py-8">Loading streams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {streams.map((stream) => (
            <div key={stream._id} className="relative">
              <StreamPlayer streamId={stream._id} url={stream.url} />
              <button
                onClick={() => handleDelete(stream._id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                title="Delete stream"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamGrid;
