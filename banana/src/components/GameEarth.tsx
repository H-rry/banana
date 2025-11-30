import React, { useRef, useEffect, useMemo, useState } from 'react';
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
    return players.flatMap(player => 
      (player.routes || []).map(route => ({
        lat: route.lat,
        lng: route.lng,
        text: route.city || 'DEST',
        color: 'white',
        size: 0.5
      }))
    );
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
        maxR: 2,
        propagationSpeed: 1,
        repeatPeriod: 1500,
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
