import React from 'react'

import State from './State.tsx';
import Flight from './Flight.tsx';

function Actions() {
    return (
        <div className="actions container">
            <State />
            <div className="actions scroll">
                <div className="actions sign">Outbound:</div>
                <Flight />
            </div>
        </div>
    )
}

export default Actions