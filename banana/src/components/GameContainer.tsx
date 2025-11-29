import React from 'react'

import Chat from './Chat.tsx';
import Actions from './Actions.tsx';

function Container() {
    return (
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
    )
}

export default Container