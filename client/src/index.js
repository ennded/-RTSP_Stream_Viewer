// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Keep this line
import App from "./App";

// Remove this line:
// import 'tailwindcss/tailwind.css'; ❌ DELETE THIS LINE ❌

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
