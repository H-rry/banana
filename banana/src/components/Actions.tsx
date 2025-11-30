import React from 'react';

import State from './State.tsx';
import Flight from './Flight.tsx';

interface Route {
    name: string; // IATA
    city: string;
    lat: number;
    lng: number;
}

interface Player {
    id: string;
    name: string;
    city: string;
    airport: string;
    routes: Route[];
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

/*
    return (
        <div className="contents actions" style={{ padding: '20px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <h2>Current Location</h2>
            <p style={{ fontSize: '1.2em' }}>📍 {currentPlayer.city} ({currentPlayer.airport})</p>
            
            <hr style={{ margin: '20px 0', borderColor: '#555' }} />
            
            <h3>Available Flights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentPlayer.routes.length === 0 ? (
                    <p>No flights available.</p>
                ) : (
                    currentPlayer.routes.map((route) => (
                        <button 
                            key={route.name}
                            onClick={() => handleTravel(route.name)}
                            style={{
                                padding: '10px',
                                backgroundColor: '#333',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                pointerEvents: 'auto'
                            }}
                        >
                            <span> {route.city}</span>
                            <span style={{ fontSize: '0.8em', color: '#aaa' }}>{route.name}</span>
                        </button>
                    ))
                )}
*/



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