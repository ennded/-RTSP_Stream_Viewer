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

    // Basic URL validation
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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="rtsp-url"
            className="block text-sm font-medium text-gray-700"
          >
            RTSP Stream URL
          </label>
          <input
            type="text"
            id="rtsp-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="rtsp://username:password@ip:port/path"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Adding Stream..." : "Add Stream"}
        </button>
      </form>
    </div>
  );
};

export default AddStreamForm;
