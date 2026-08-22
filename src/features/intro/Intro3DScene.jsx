import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Голографическое 3D-ядро, меняющее форму и вращение
function MorphingCore({ mode }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const outerRingRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Скорость вращения зависит от сцены
    const speedMultiplier = mode === 'supernova' || mode === 'warp' ? 4.5 : 1.2;
    meshRef.current.rotation.x += delta * 0.3 * speedMultiplier;
    meshRef.current.rotation.y += delta * 0.4 * speedMultiplier;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6 * speedMultiplier;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime) * 0.2;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y -= delta * 0.5 * speedMultiplier;
      outerRingRef.current.rotation.z = Math.PI / 4;
    }
  });

  // Цвет ядра плавно переходит от золотистого к ярко-неоновому оранжевому
  const isIntense = mode === 'supernova' || mode === 'heroine' || mode === 'launch';
  const coreColor = isIntense ? '#ff4500' : '#ff9100';
  const ringColor = isIntense ? '#ffa726' : '#ff6b00';

  return (
    <group>
      {/* Внутренний икосаэдр */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, mode === 'supernova' ? 2 : 1]} />
        <meshBasicMaterial 
          color={coreColor} 
          wireframe={true} 
          transparent 
          opacity={0.65} 
        />
      </mesh>

      {/* Внутреннее голографическое кольцо */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.4} />
      </mesh>

      {/* Внешнее орбитальное кольцо */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.1, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ffb74d" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// 2. Облако частиц (Gold & Cyber Orange Nebulae)
function ParticleCloud({ count = 1200, mode }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const orange = new THREE.Color('#ff6b00');
    const gold = new THREE.Color('#ffb300');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 15 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.4 ? orange : (Math.random() > 0.5 ? gold : white);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const accel = mode === 'warp' ? 6 : 1;
    pointsRef.current.rotation.y += delta * 0.05 * accel;
    pointsRef.current.rotation.x += delta * 0.02 * accel;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Intro3DScene({ mode }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <MorphingCore mode={mode} />
        <ParticleCloud count={1400} mode={mode} />
      </Canvas>
    </div>
  );
}
