import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PillarData {
  name: string;
  color: string;
  orbitRadius: number;
  size: number;
  speed: number;
}

const PILLARS: PillarData[] = [
  { name: 'Zomato', color: '#E23744', orbitRadius: 3, size: 0.4, speed: 0.3 },
  { name: 'Blinkit', color: '#F8CB46', orbitRadius: 4.5, size: 0.5, speed: 0.5 },
  { name: 'District', color: '#8A2BE2', orbitRadius: 2, size: 0.3, speed: 0.4 },
  { name: 'Hyperpure', color: '#2E8B57', orbitRadius: 3.5, size: 0.35, speed: 0.2 },
];

function Planet({ pillar, onClick, isActive }: { pillar: PillarData; onClick: () => void; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += delta * pillar.speed * 0.5;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * pillar.orbitRadius;
      meshRef.current.position.z = Math.sin(angleRef.current) * pillar.orbitRadius;
      meshRef.current.position.y = Math.sin(angleRef.current * 2) * 0.3;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <mesh ref={meshRef} onClick={onClick} scale={isActive ? 1.5 : 1}>
        <sphereGeometry args={[pillar.size, 32, 32]} />
        <meshStandardMaterial
          color={pillar.color}
          emissive={pillar.color}
          emissiveIntensity={isActive ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, opacity: 0.15, transparent: true });
  const lineObject = new THREE.Line(geometry, material);

  return <primitive object={lineObject} />;
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#ffffff" emissive="#E23744" emissiveIntensity={0.4} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export default function EternalConstellation({
  activePillar,
  onPillarClick,
}: {
  activePillar: string | null;
  onPillarClick: (name: string) => void;
}) {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#E23744" />
        <CentralOrb />
        {PILLARS.map((pillar) => (
          <group key={pillar.name}>
            <OrbitRing radius={pillar.orbitRadius} color={pillar.color} />
            <Planet pillar={pillar} isActive={activePillar === pillar.name} onClick={() => onPillarClick(pillar.name)} />
          </group>
        ))}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
      </Canvas>
    </div>
  );
}
