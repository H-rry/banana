import React from 'react'

import Background from './../components/Background.tsx';
import Container from './../components/Container.tsx';
import NavBar from './../components/NavBar.tsx';

function Home() {
    return (
        <div>
            <Background />
            <NavBar />
            <button onClick={() => navigate("/game")}>Start Game</button>
            <Container />
        </div>
    )
}

export default Home