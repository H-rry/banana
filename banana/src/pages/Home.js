import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Background from './../components/Background.tsx';
import NavBar from './../components/NavBar.tsx';

// function Home() {
//     return (
//         <div>
//             <Background />
//             <NavBar />
//             <Link to="/game"><button>Start Game</button></Link>
//         </div>
//     )
// }

// export default Home

function Home() {
    const [name, setName] = useState(""); // State to store the input name
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleStartGame = () => {
        // Send the name to the backend
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name }),
        })
        .then(res => res.json())
        .then(data => {
            // Once the name is stored in the session, navigate to the game
            console.log("Logged in as:", data.username);
            navigate('/game');
        })
        .catch(err => console.error("Error logging in:", err));
    };

    return (
        <div>
            <Background />
            <NavBar />
            
            <div style={{ zIndex: 10, position: 'relative', textAlign: 'center', marginTop: '20vh' }}>
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <br />
                <button onClick={handleStartGame} style={{ marginTop: '10px' }}>
                    Start Game
                </button>
            </div>
        </div>
    )
}

export default Home;