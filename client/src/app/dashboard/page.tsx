"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StreamCard from "../../components/StreamCard";
import AddStreamModal from "../../components/AddStreamModal";
import { getStreams } from "../../lib/api";
import { Stream } from "../../types/stream";
import { initSocket } from "../../lib/socket";

export default function Dashboard() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await getStreams();
        setStreams(data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    const socket = initSocket();

    socket.on("video-frame", (data: { streamId: string; frame: string }) => {
      setStreams((prev) =>
        prev.map((stream) =>
          stream._id === data.streamId
            ? { ...stream, currentFrame: data.frame }
            : stream
        )
      );
    });

    socket.on("stream-error", (data: { streamId: string; message: string }) => {
      setStreams((prev) =>
        prev.map((stream) =>
          stream._id === data.streamId
            ? { ...stream, error: data.message }
            : stream
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDeleteFromList = (deletedId: string) => {
    setStreams((prev) => prev.filter((stream) => stream._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-green-500">
        Tailwind is working!
      </h1>

      <Header onAddStream={() => setIsModalOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <StreamCard
              key={stream._id}
              stream={stream}
              onDelete={handleDeleteFromList} // Pass callback here
            />
          ))}
        </div>
      </main>

      <AddStreamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStreamAdded={(newStream) =>
          setStreams((prev) => [...prev, newStream])
        }
      />
    </div>
  );
}
