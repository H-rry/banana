import React from 'react'

import { Link } from 'react-router-dom';

import Earth from '../components/GameEarth.tsx';
import Chat from './../components/Chat.tsx';
import Actions from './../components/Actions.tsx';
import NavBar from './../components/NavBar.tsx';

function Game() {

    const playButtonPressed = () => {

    } 


    
    return (
        <div>
            <div className="game background">
                <Earth />
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
                        <Actions />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game
