import React from 'react'
import Earth from './Earth.tsx'

function Background() {
    const examplePlayers = [
        { 
            id: 'player1', 
            lat: 40.7128, 
            lng: -74.0060, // NYC
            color: 'cyan', 
            name: 'Agent Smith',
            routes: [
                { lat: 51.5074, lng: -0.1278, name: 'London' },
                { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }
            ]
        }, 
        { id: 'player2', lat: 34.0522, lng: -118.2437, color: 'lime', name: 'Agent Johnson' }, // LA
        { id: 'player3', lat: -33.8688, lng: 151.2093, color: 'magenta', name: 'Agent Brown' } // Sydney
    ];

    return (
        <div className="background">
            <Earth players={examplePlayers} />
        </div>
    )
}

export default Background