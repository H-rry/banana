import React from 'react'

import { Link } from 'react-router-dom';

import Earth from '../components/GameEarth.tsx';
import Chat from './../components/Chat.tsx';
import Actions from './../components/Actions.tsx';
import NavBar from './../components/NavBar.tsx';

function Game() {


    const examplePlayers = [
        { 
            id: 'player1', 
            lat: 40.7128, 
            lng: -74.0060, // NYC
            color: 'cyan', 
            name: 'Agent Smith',
            routes: [
                { lat: 51.5074, lng: -0.1278, name: 'London' },
                { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }
            ]
        }, 
        { id: 'player2', lat: 34.0522, lng: -118.2437, color: 'lime', name: 'Agent Johnson' }, // LA
        { id: 'player3', lat: -33.8688, lng: 151.2093, color: 'magenta', name: 'Agent Brown' } // Sydney
    ];


    const playButtonPressed = () => {
        alert("play button pressed.")
    } 


    
    return (
        <div>
            <div className="game background">
                <Earth players={examplePlayers}/>
            </div>
            <NavBar />
            
            <div className="game container">
                <div className="game left">
                    <div className="game chat">
                        <Chat />
                    </div>
                </div>
                <div className="game right">
                    <div className="game actions">
                        <Actions />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game
