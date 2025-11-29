import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Default state matches the python structure
  const [game, setGame] = useState({ story: [], options: [], location: "" });

  // 1. Get Data on load
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(data => setGame(data));
  }, []);

  // 2. Handle Travel (Update Data)
  const travel = (dest) => {
    fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: dest })
    })
    .then(res => res.json())
    .then(data => setGame(data));
  }

  return (
    <div className="app-container">
      {/* Left: Story */}
      <div className="col left">
        <h3>Story</h3>
        {game.story.map((text, i) => <p key={i}>{text}</p>)}
      </div>

      {/* Center: Globe */}
      <div className="col center">
        <h1>{game.location}</h1>
        <div className="globe-box">Globe Goes Here</div>
      </div>

      {/* Right: Options */}
      <div className="col right">
        <h3>Travel To:</h3>
        {game.options.map(opt => (
          <button key={opt} onClick={() => travel(opt)}>{opt}</button>
        ))}
      </div>
    </div>
  );
}
export default App;
