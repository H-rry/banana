import React, { useRef, useEffect, useMemo, useState } from 'react';
import Globe from 'react-globe.gl';


interface Route {
  lat: number;
  lng: number;
  name?: string;
  city?: string;
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
  lat: number;
  lng: number;
  color?: string;
  name?: string;
  routes?: Route[];
  target?: Target;
}

interface EarthProps {
  players?: Player[];
  myId?: string | null;
}

function GameEarth({ players = [], myId }: EarthProps) {

  const globeEl = useRef<any>(null);
  const prevLat = useRef<number | null>(null);
  const prevLng = useRef<number | null>(null);
  const [countries, setCountries] = useState({ features: [] });

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

  // Map routes to labels data
  const labelsData = useMemo(() => {
    const routeLabels = players.flatMap(player => 
      (player.routes || []).map(route => ({
        lat: route.lat,
        lng: route.lng,
        text: route.city || 'DEST',
        color: 'white',
        size: 0.5
      }))
    );

    const targetLabels = players
      .filter(p => p.target)
      .map(p => ({
        lat: p.target!.lat,
        lng: p.target!.lng,
        text: `TARGET: ${p.target!.city}`,
        color: 'red',
        size: 0.7
      }));

    return [...routeLabels, ...targetLabels];
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
    const routeRings = players.flatMap(player => 
      (player.routes || []).map(route => ({
        lat: route.lat,
        lng: route.lng,
        maxR: 2,
        propagationSpeed: 1,
        repeatPeriod: 1500,
        color: player.color // Optional: Ring matches player color
      }))
    );

    const targetRings = players
      .filter(p => p.target)
      .map(p => ({
        lat: p.target!.lat,
        lng: p.target!.lng,
        maxR: 5,
        propagationSpeed: 2,
        repeatPeriod: 1000,
        color: 'red'
      }));

    return [...routeRings, ...targetRings];
  }, [players]);

  // Effect to center camera on player when they move
  useEffect(() => {
    if (!globeEl.current || !myId) return;

    const me = players.find(p => p.id === myId);
    if (me) {
        // Only move camera if position changed significantly
        if (prevLat.current !== me.lat || prevLng.current !== me.lng) {
            globeEl.current.pointOfView({
                lat: me.lat,
                lng: me.lng,
                altitude: 2.5
            }, 1000); // 1 second smooth transition

            prevLat.current = me.lat;
            prevLng.current = me.lng;
        }
    }
  }, [players, myId]);

  useEffect(() => {
    if (globeEl.current) {
      // Set initial point of view
      globeEl.current.pointOfView({ lat: 40, lng: -74, altitude: 2.5 });

      globeEl.current.controls().autoRotate = false;
    }
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  return (
    <div className="globe">
      <Globe
        ref={globeEl}

        // Night texture for the "GitHub" look
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        //globeImageUrl={null}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        // Vectorised countries
        polygonsData={countries.features}
      
        // 4. Style the Vector Polygons
        polygonCapColor={() => 'rgba(39, 69, 39, 0.0)'} // The fill color
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'} // The 3D thickness color
        polygonStrokeColor={() => '#003300'} // The border line color, changed to yellow
        polygonAltitude={0.001} // Slight elevation to create depth, increased to make sides more visible


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
        pointRadius={0.5}

        // Labels (Destinations)
        labelsData={labelsData}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize={1.2}
        labelDotRadius={0.4}
        labelAltitude={0.01}

        // Flight Routes (Arcs)
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={1}
        arcDashGap={0.0}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        
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
