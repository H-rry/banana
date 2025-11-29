import React from 'react'

import { Link } from 'react-router-dom';

import Background from './../components/Background.tsx';
import GameContainer from '../components/GameContainer.tsx';
import NavBar from './../components/NavBar.tsx';

function Game() {
    return (
        <div>
            <Background />
            <NavBar />
            <Link to="/"><button>Back to Home</button></Link>
            <GameContainer />
        </div>
    )
}

export default Game