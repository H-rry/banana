import React from 'react'

import { Link } from 'react-router-dom';

import Background from './../components/Background.tsx';
import Container from './../components/Container.tsx';
import NavBar from './../components/NavBar.tsx';

function Home() {
    return (
        <div>
            <Background />
            <NavBar />
            <Link to="/game">
                <button>Start Game</button>
            </Link>
            <Container />
        </div>
    )
}

export default Home