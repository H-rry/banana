import React from 'react'

import Background from './../components/Background.tsx';
import Container from './../components/Container.tsx';
import NavBar from './../components/NavBar.tsx';

function Game() {
    return (
        <div>
            <Background />
            <NavBar />
            <Link to=""><button>Back to Home</button></Link>
        </div>
    )
}

export default Game