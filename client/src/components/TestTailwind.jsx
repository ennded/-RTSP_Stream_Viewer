import React from "react";

export default function TestTailwind() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind Test</h1>
      <div className="mt-4 p-4 bg-green-100 rounded-lg">
        <p className="text-green-800">If this is green, Tailwind is working!</p>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
}
