import React from 'react';

import State from './State.tsx';
import Flight from './Flight.tsx';

interface Route {
    name: string; // IATA
    city: string;
    country?: string;
    lat: number;
    lng: number;
    distance?: number;
}

interface Target {
    iata: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
}

interface Player {
    id: string;
    name: string;
    city: string;
    country?: string;
    airport: string;
    routes: Route[];
    target?: Target;
}

interface ActionsProps {
    currentPlayer?: Player;
}

function Actions({ currentPlayer }: ActionsProps) {

    const handleTravel = async (destinationIata: string) => {
        try {
            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'move',
                    destination: destinationIata,
                    userid: currentPlayer?.id // Explicitly send the user ID
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                console.log(data.message);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Travel failed", err);
        }
    };

    if (!currentPlayer) {
        return <div className="contents actions" style={{ padding: '20px', color: 'white' }}>Loading player data...</div>;
    }

    return (
        <div className="actions container">
            <State player={currentPlayer} />
            
            {currentPlayer.target && (
                <div className="actions sign" style={{ marginTop: '10px', color: '#FFD700', border: '1px solid #FFD700', padding: '5px' }}>
                    Target: {currentPlayer.target.city} ({currentPlayer.target.iata})
                </div>
            )}
            
            <div className="actions scroll">
                <div className="actions sign">Outbound:</div>
                {currentPlayer.routes.map((route) => (
                    <Flight 
                        key={route.name} 
                        route={route} 
                        onTravel={handleTravel} 
                    />
                ))}
                {currentPlayer.routes.length === 0 && (
                    <div style={{ padding: '10px', color: '#aaa' }}>No flights available</div>
                )}
            </div>
        </div>
    )
}

export default Actions