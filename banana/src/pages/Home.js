import React from 'react'

import { Link } from 'react-router-dom';

import NavBar from './../components/NavBar.tsx';
import MenuEarth from '../components/MenuEarth.tsx';

function Home() {
    return (
        <div>
            <div className="menu background">
                <MenuEarth/>
            </div>
            <NavBar />
            <Link to="/game"><button style={{pointerEvents: 'auto'}}>Start Game</button></Link>
            <div className="menu container">
                <div className="menu left">
                    <div className="menu control">
                        <button>Play</button>
                        <div className="menu gameSettings">

                        </div>
                        <div className="menu profile">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home