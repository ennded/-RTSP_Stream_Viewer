import React from "react";
import StreamGrid from "./components/StreamGrid";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">RTSP Stream Viewer</h1>
      </header>
      <main className="container mx-auto p-4">
        <StreamGrid />
      </main>
    </div>
  );
}

export default App;
