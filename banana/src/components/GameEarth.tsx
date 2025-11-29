import React, { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';


interface Route {
  lat: number;
  lng: number;
  name?: string;
}

interface Player {
  id: string;
  lat: number;
  lng: number;
  color?: string;
  name?: string;
  routes?: Route[];
}

interface EarthProps {
  players?: Player[];
}

function GameEarth({ players = [] }: EarthProps) {

  const globeEl = useRef<any>(null);

  // Map input players to points data
  const pointsData = useMemo(() => {
    return players.map(player => ({
      lat: player.lat,
      lng: player.lng,
      size: 0.5,
      color: player.color || 'orange',
      name: player.name || 'Unknown Player'
    }));
  }, [players]);

  // Compute Arcs (Routes) from Player -> Destination
  const arcsData = useMemo(() => {
    return players.flatMap(player => 
      (player.routes || []).map(route => ({
        startLat: player.lat,
        startLng: player.lng,
        endLat: route.lat,
        endLng: route.lng,
        color: [player.color || 'orange', 'rgba(255,255,255,0.5)'], // Gradient: Player Color -> Fade
        name: `${player.name} -> ${route.name || 'Destination'}`
      }))
    );
  }, [players]);

  // Compute Rings at Destination Points
  const ringsData = useMemo(() => {
    return players.flatMap(player => 
      (player.routes || []).map(route => ({
        lat: route.lat,
        lng: route.lng,
        maxR: 5,
        propagationSpeed: 5,
        repeatPeriod: 800,
        color: player.color // Optional: Ring matches player color
      }))
    );
  }, [players]);

  useEffect(() => {
    if (globeEl.current) {
      // Set initial point of view
      globeEl.current.pointOfView({ lat: 40, lng: -74, altitude: 2.5 });

      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  

  return (
    <div className="globe">
      <Globe
        ref={globeEl}

        // Night texture for the "GitHub" look
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Aesthetic: Atmosphere glow
        showAtmosphere={true}
        atmosphereColor="#3a228a" // Cyberpunk/GitHub-ish purple-blue
        atmosphereAltitude={0.25}
        
        // Player Points
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.1}
        pointRadius="size"

        // Flight Routes (Arcs)
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.5}
        arcDashGap={0.5}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        // arcLabel="name" // Optional: show tooltip on hover
        
        // Target Rings
        ringsData={ringsData}
        ringColor="color" // Use the color property from the data item
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
}

export default GameEarth;