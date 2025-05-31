import React, { useState, useEffect } from "react";
import StreamPlayer from "./StreamPlayer";
import AddStreamForm from "./AddStreamForm";
import { getStreams, addStream, deleteStream } from "../services/api";

const StreamGrid = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const data = await getStreams();
      setStreams(data);
    } catch (err) {
      setError("Failed to load streams");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStream = async (url) => {
    try {
      const newStream = await addStream(url);
      setStreams([...streams, newStream]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStream(id);
      setStreams(streams.filter((stream) => stream._id !== id));
    } catch (err) {
      setError("Failed to delete stream");
    }
  };

  return (
    <div className="stream-grid-container">
      <AddStreamForm onSubmit={handleAddStream} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading streams...</div>
      ) : (
        <div className="stream-grid">
          {streams.map((stream) => (
            <StreamPlayer
              key={stream._id}
              streamId={stream._id}
              url={stream.url}
              onDelete={() => handleDelete(stream._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamGrid;
