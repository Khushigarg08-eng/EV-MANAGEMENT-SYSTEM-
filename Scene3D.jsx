import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import { useRef } from 'react';

function GlowingCore() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if(meshRef.current) {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshStandardMaterial 
          color="#00F0FF" 
          emissive="#00BAFF" 
          emissiveIntensity={1.5} 
          wireframe={true} 
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#00F0FF" intensity={2} />
      <GlowingCore />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      <Environment preset="city" />
    </Canvas>
  );
}
