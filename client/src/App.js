import React from "react";
import StreamGrid from "./components/StreamGrid";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-blue-500">CP IP Cam</h1>
      </header>
      <main className="container mx-auto p-4">
        <StreamGrid />
      </main>
    </div>
  );
}

export default App;
