import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

function GameEarth() {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    console.log('Earth component mounted');
    if (globeEl.current) {
      console.log('Globe ref initialized');
      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  return (
    <div className="globe">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
      />
    </div>
  );
}

export default GameEarth;