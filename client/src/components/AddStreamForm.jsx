import React, { useState } from "react";

const AddStreamForm = ({ onSubmit }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError("URL is required");
      return;
    }

    if (!url.startsWith("rtsp://")) {
      setError("URL must start with rtsp://");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(url);
      setUrl("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add stream");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-stream-form">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="rtsp-url" className="form-label">
            RTSP Stream URL
          </label>
          <input
            type="text"
            id="rtsp-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="rtsp://username:password@ip:port/path"
            className="form-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Adding Stream..." : "Add Stream"}
        </button>
      </form>
    </div>
  );
};

export default AddStreamForm;
