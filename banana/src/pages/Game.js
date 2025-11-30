import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom';

import Earth from '../components/GameEarth.tsx';
import Chat from './../components/Chat.tsx';
import Actions from './../components/Actions.tsx';
import NavBar from './../components/NavBar.tsx';
import { useSocket } from '../context/SocketContext.tsx';

function Game() {
    const [players, setPlayers] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        // Handler for updates
        const handlePlayersUpdate = (updatedPlayers) => {
            setPlayers(updatedPlayers);
        };

        // Listen for events
        socket.on('players_update', handlePlayersUpdate);

        // Cleanup
        return () => {
            socket.off('players_update', handlePlayersUpdate);
        };
    }, [socket]);

    const myId = sessionStorage.getItem('userid');
    const currentPlayer = players.find(p => p.id === myId);
    
    return (
        <div>
            <div className="game background">
                <Earth players={players} myId={myId} />
            </div>
            <NavBar />
            <Link to="/"><button style={{pointerEvents: 'auto'}}>Back to Home</button></Link>
            <div className="game container">
                <div className="game left">
                    <div className="game chat">
                        <Chat />
                    </div>
                </div>
                <div className="game right">
                    <div className="game actions">
                        <Actions currentPlayer={currentPlayer} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game
