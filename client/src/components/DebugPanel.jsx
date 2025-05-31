import React from "react";
import { socket } from "../services/socket";

export default function DebugPanel() {
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const log = (msg) => {
      setLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()}: ${msg}`,
      ]);
    };

    socket.on("connect", () => log("Socket connected"));
    socket.on("disconnect", () => log("Socket disconnected"));
    socket.on("connect_error", (err) => log(`Error: ${err.message}`));
    socket.on("video-frame", (data) =>
      log(`Frame received for ${data.streamId}`)
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("video-frame");
    };
  }, []);

  return (
    <div className="debug-panel">
      <h3>Connection Debug</h3>
      <div className="debug-logs">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
