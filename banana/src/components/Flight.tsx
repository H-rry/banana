import React from 'react'

interface Route {
    name: string; // IATA
    city: string;
    country?: string;
    distance?: number;
}

interface FlightProps {
    route: Route;
    onTravel: (iata: string) => void;
}

function Flight({ route, onTravel }: FlightProps) {
    return (
        <div className="flight container" onClick={() => onTravel(route.name)} style={{ cursor: 'pointer' }}>
            <div className="flight line">
                
            </div>

            <div className="flight title">
                {route.city} ({route.name})
            </div>
            
            <div className="flight details">
                {route.country} {route.distance ? `- ${Math.round(route.distance)}km` : ''}
            </div>
            
        </div>
    )
}

export default Flight