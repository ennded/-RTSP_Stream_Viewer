import React from "react";
import StreamGrid from "./components/StreamGrid";

function App() {
  return (
    <div className="min-h-screen">
      <header className="header">
        <h1 className="header-title">CP IP Cam</h1>
      </header>
      <main className="container">
        <StreamGrid />
      </main>
    </div>
  );
}

export default App;
