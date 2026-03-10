// Scene.jsx
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import RotatingRing from "./3d/RotatingRing";
import ScrollSections from "./ScrollSections";
import { Suspense } from "react";

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.5} />
      {/* Directional light for depth shadows */}
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      <Suspense fallback={null}>
        {/* pages={3} creates a scrollable area 3x the viewport height.
          damping={0.2} adds weight to the scroll bar itself.
        */}
        <ScrollControls pages={3} damping={0.2}>
          
          {/* The 3D Content */}
          <RotatingRing />
          
          {/* The HTML Overlay Content */}
          <ScrollSections />
          
        </ScrollControls>
      </Suspense>
      
      {/* Optional fog to blend distant images into background */}
      <fog attach="fog" args={["#f0f0f0", 5, 12]} />
    </Canvas>
  );
}