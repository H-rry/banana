import React from 'react'

import Chat from './Chat.tsx';
import Actions from './Actions.tsx';

function Container() {
    return (
        <div className="contents container">
            <div className="contents left">
                <div className="contents chat">
                    <Chat />
                </div>
            </div>
            <div className="contents right">
                <div className="contents actions">
                    <Actions />
                </div>
            </div>
        </div>
    )
}

export default Container