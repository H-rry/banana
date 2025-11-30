import React from 'react'

interface StateProps {
    player: {
        city: string;
        airport: string;
        country?: string;
    };
}

function State({ player }: StateProps) {
    return (
        <div className="state container">
            <div className="state title">
                Location: {player.city} ({player.airport})
            </div>
            <div className="state details">
                {player.country || "Unknown Country"}
            </div>
        </div>
    )
}

export default State