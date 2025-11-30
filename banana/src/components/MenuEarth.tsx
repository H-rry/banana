import React, { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';

// Player data
const menuPlayers = [
  { id: 'player1', lat: 40.7128, lng: -74.0060, color: 'cyan', name: 'Agent Smith', routes: [
    { lat: 51.5074, lng: -0.1278, name: 'London' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }]}, // NY
  { id: 'player2', lat: 34.0522, lng: -118.2437, color: 'lime', name: 'Agent Johnson' }, // LA
  { id: 'player3', lat: -33.8688, lng: 151.2093, color: 'magenta', name: 'Agent Brown' }, // Sydney
  { id: 'player4', lat: 48.8566, lng: 2.3522, color: 'orange', name: 'Agent Dubois', routes: [
    { lat: 41.9028, lng: 12.4964, name: 'Rome' },
    { lat: 52.5200, lng: 13.4050, name: 'Berlin' }]}, // Paris
  { id: 'player5', lat: -23.5505, lng: -46.6333,color: 'pink', name: 'Agent Silva', routes: [
    { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires' },
    { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' }]},  // São Paulo
  { id: 'player6', lat: 55.7558, lng: 37.6173, color: 'red', name: 'Agent Ivanov',routes: [
    { lat: 59.9343, lng: 30.3351, name: 'Saint Petersburg' }]}
];// Moscow

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

function MenuEarth() {
  const globeEl = useRef<any>(null);

  // Points for players
  const pointsData = useMemo(() => 
    menuPlayers.map(player => ({
      lat: player.lat,
      lng: player.lng,
      size: 0.5,
      color: player.color || 'orange',
      name: player.name || 'Unknown Player'
    }))
  , []);

  // Arcs for routes
  const arcsData = useMemo(() =>
    menuPlayers.flatMap(player =>
      (player.routes || []).map(route => ({
        startLat: player.lat,
        startLng: player.lng,
        endLat: route.lat,
        endLng: route.lng,
        color: [player.color || 'orange', 'rgba(255,255,255,0.5)'],
        name: `${player.name} -> ${route.name || 'Destination'}`
      }))
    )
  , []);

  // Rings at destinations
  const ringsData = useMemo(() =>
    menuPlayers.flatMap(player =>
      (player.routes || []).map(route => ({
        lat: route.lat,
        lng: route.lng,
        maxR: 5,
        propagationSpeed: 5,
        repeatPeriod: 800,
        color: player.color
      }))
    )
  , []);

  // Set globe rotation and initial point of view
  useEffect(() => {
    if (!globeEl.current) return;
    globeEl.current.pointOfView({ lat: 40, lng: -74, altitude: 2.5 });
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
  }, []);


  return (
    <div className="globe">
      <Globe
        width={window.innerWidth * 3}
        height={window.innerHeight * 3}
        ref={globeEl}

        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        showAtmosphere={true}
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.25}

        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.1}
        pointRadius="size"

        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.5}
        arcDashGap={0.5}
        arcDashAnimateTime={2000}
        arcStroke={0.5}

        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
}

export default MenuEarth;