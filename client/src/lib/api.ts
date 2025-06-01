import axios from "axios";
import { Stream } from "../types/stream";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_ENDPOINT = `${API_BASE_URL}/api/streams`;

console.log("API_BASE_URL:", API_BASE_URL);
console.log("Delete URL:", `${API_ENDPOINT}/someId`);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // important if you use credentials
});

export const getStreams = async (): Promise<Stream[]> => {
  try {
    const res = await axiosInstance.get("/api/streams");
    console.log("getStreams response:", res);
    return res.data;
  } catch (error) {
    console.error("getStreams error:", error);
    throw error;
  }
};

export const addStream = async (url: string): Promise<Stream> => {
  try {
    const res = await axiosInstance.post("/api/streams", { url });
    return res.data;
  } catch (error) {
    console.error("addStream error:", error);
    throw error;
  }
};

export const deleteStream = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/api/streams/${id}`);
    return res.data;
  } catch (error) {
    console.error("deleteStream error:", error);
    throw error;
  }
};
