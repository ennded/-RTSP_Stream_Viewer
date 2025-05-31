import React from "react";
import StreamGrid from "./components/StreamGrid";
import DebugPanel from "./components/DebugPanel";

function App() {
  return (
    <div className="min-h-screen">
      <header className="header">
        <h1 className="header-title">CP IP Cam</h1>
      </header>
      <main className="container">
        <StreamGrid />
      </main>
      <DebugPanel />
    </div>
  );
}

export default App;
