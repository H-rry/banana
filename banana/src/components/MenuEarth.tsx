import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

function MenuEarth() {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    console.log('Earth component mounted');
    if (globeEl.current) {
      console.log('Globe ref initialized');
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const width = window.innerWidth * 3
  const height = window.innerHeight * 3

  return (
    <div className="globe">
      <Globe

        width={width}
        height={height}
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
      />
    </div>
  );
}

export default MenuEarth;