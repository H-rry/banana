import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import './App.css';

import Home from "./pages/Home";
import Game from "./pages/Game";


function App() {
  // Default state matches the python structure
  const [game, setGame] = useState({ story: [], options: [], location: "" }); // update this accordingly

  // 1. Get Data on load
  useEffect(() => {
    fetch('/api/game').then(res => res.json()).then(data => setGame(data));
  }, []);

  // Function to send data back to the backend
  const sendToBackend = (actionType, payload) => {
    fetch('/api/game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: actionType,
        ...payload 
      }),
    })
    .then(res => res.json())
    .then(data => setGame(data)) // Update frontend with new state from backend
    .catch(err => console.error("Error:", err));
  };

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
