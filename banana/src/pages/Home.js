import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useSocket } from '../context/SocketContext.tsx';

import NavBar from './../components/NavBar.tsx';
import MenuEarth from '../components/MenuEarth.tsx';


function Home() {
    const [name, setName] = useState(""); // State to store the input name
    const navigate = useNavigate(); // Hook to navigate programmatically

    const { socket } = useSocket();

    const [loading, setLoading] = useState(false);

    const handleStartGame = () => {
        setLoading(true);
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
            sessionStorage.setItem('userid', data.userid); // Save User ID

            if (socket) {
                socket.disconnect();
                socket.io.opts.query = { userid: data.userid };
                socket.connect();
            }

            navigate('/game');
        })
        .catch(err => console.error("Error logging in:", err));
    };

    return (
        <div>
            <div className="menu background">
                <MenuEarth/>
            </div>
            <NavBar />

           
            <div className="menu container">
                <div className="menu left">
                    <div className="menu control">

                        JOIN A GAME

                        <div className="menu joiner">
                            <input 
                                className="menu input"
                                type="text" 
                                placeholder="Enter your name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <button onClick={handleStartGame} className="menu button">
                                Play
                            </button>

                            {loading && (
                                <div className="loading">
                                Loading...
                                </div>
                            )}
                        </div>
                            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;