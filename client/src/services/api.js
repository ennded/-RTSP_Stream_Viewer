import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// Create axios instance with error handling
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const getStreams = async () => {
  try {
    const response = await api.get("/streams");
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to fetch streams");
  }
};

export const addStream = async (url) => {
  try {
    const response = await api.post("/streams", { url });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to add stream");
  }
};

export const deleteStream = async (id) => {
  try {
    await api.delete(`/streams/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to delete stream");
  }
};
