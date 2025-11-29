import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

function Earth() {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    console.log('Earth component mounted');
    if (globeEl.current) {
      console.log('Globe ref initialized');
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', border: '2px solid red' }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
        backgroundColor="#000000"
      />
    </div>
  );
}

export default Earth;