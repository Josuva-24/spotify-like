"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePlayer } from "@/context/PlayerContext";

interface VinylVisualizer3DProps {
  className?: string;
}

export function VinylVisualizer3D({ className }: VinylVisualizer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentSong, isPlaying, getFrequencyData } = usePlayer();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vinylGroupRef = useRef<THREE.Group | null>(null);
  const tonearmGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlePositionsRef = useRef<Float32Array | null>(null);
  const centerLabelMeshRef = useRef<THREE.Mesh | null>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Load and update album artwork texture on the center label
  useEffect(() => {
    if (!centerLabelMeshRef.current || !currentSong?.cover_url) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";
    textureLoader.load(
      currentSong.cover_url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        if (centerLabelMeshRef.current) {
          centerLabelMeshRef.current.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.1,
          });
        }
      },
      undefined,
      (err) => {
        console.warn("Failed to load album cover for 3D label, using fallback:", err);
      }
    );
  }, [currentSong?.cover_url]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00ffa3, 2.5);
    dirLight1.position.set(5, 8, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.2);
    dirLight2.position.set(-5, 4, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 3, 1);
    scene.add(pointLight);

    // 4. Procedural Vinyl Grooves Canvas Texture
    const grooveCanvas = document.createElement("canvas");
    grooveCanvas.width = 512;
    grooveCanvas.height = 512;
    const ctx = grooveCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#111113";
      ctx.fillRect(0, 0, 512, 512);

      // Draw subtle concentric grooves
      for (let r = 80; r < 250; r += 2.5) {
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(35, 35, 42, ${0.4 + (r % 5) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Specular sheen accents
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      grad.addColorStop(0.5, "transparent");
      grad.addColorStop(1, "rgba(255, 255, 255, 0.06)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    const grooveTexture = new THREE.CanvasTexture(grooveCanvas);

    // 5. Vinyl Disc Mesh Group
    const vinylGroup = new THREE.Group();
    scene.add(vinylGroup);
    vinylGroupRef.current = vinylGroup;

    // Disc geometry
    const discGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.06, 64);
    const discMat = new THREE.MeshStandardMaterial({
      map: grooveTexture,
      color: 0x141416,
      roughness: 0.25,
      metalness: 0.85,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    vinylGroup.add(discMesh);

    // Center Label (Album Art Placeholder)
    const labelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.07, 48);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.4,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    vinylGroup.add(labelMesh);
    centerLabelMeshRef.current = labelMesh;

    // Center spindle hole
    const spindleHoleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
    const spindleHoleMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.9,
    });
    const spindleHole = new THREE.Mesh(spindleHoleGeo, spindleHoleMat);
    vinylGroup.add(spindleHole);

    // 6. 3D Tonearm Assembly
    const tonearmGroup = new THREE.Group();
    tonearmGroup.position.set(2.4, 0.2, -1.8);
    scene.add(tonearmGroup);
    tonearmGroupRef.current = tonearmGroup;

    // Tonearm Base / Pivot
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.25, 24);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    tonearmGroup.add(baseMesh);

    // Tonearm Arm Pipe
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 16);
    const armMesh = new THREE.Mesh(armGeo, metalMat);
    armMesh.position.set(-0.6, 0.25, 0.9);
    armMesh.rotation.z = Math.PI / 2.3;
    armMesh.rotation.y = -Math.PI / 6;
    tonearmGroup.add(armMesh);

    // Cartridge / Needle Head
    const headGeo = new THREE.BoxGeometry(0.16, 0.1, 0.25);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(-1.6, 0.05, 1.8);
    tonearmGroup.add(headMesh);

    // 7. Audio-Reactive Ambient Particles Ring
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalRadii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.8 + Math.random() * 0.9;
      originalRadii[i] = radius;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlePositionsRef.current = positions;

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. Animation Loop
    let animationFrameId: number;
    let rotationAngle = 0;
    let currentArmAngle = 0;
    const targetArmAnglePlaying = 0.42;
    const targetArmAnglePaused = 0.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Get live frequency data from player context
      const freqData = getFrequencyData();
      const bassFrequency = (freqData[1] || 0) / 255;
      const midFrequency = (freqData[8] || 0) / 255;

      // Rotate Vinyl
      if (isPlayingRef.current) {
        rotationAngle -= 0.035;
        currentArmAngle += (targetArmAnglePlaying - currentArmAngle) * 0.05;
      } else {
        currentArmAngle += (targetArmAnglePaused - currentArmAngle) * 0.05;
      }

      if (vinylGroupRef.current) {
        vinylGroupRef.current.rotation.y = rotationAngle;
      }

      if (tonearmGroupRef.current) {
        tonearmGroupRef.current.rotation.y = currentArmAngle;
      }

      // Audio-reactive pulse on particle ring
      if (particlesRef.current && particlePositionsRef.current) {
        particlesRef.current.rotation.y += 0.005;
        const posAttr = particlesRef.current.geometry.attributes.position;
        const count = particleCount;

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const freqIndex = i % 16;
          const reactiveVal = (freqData[freqIndex] || 0) / 255;
          const r = originalRadii[i] + reactiveVal * 0.75;

          posAttr.setX(i, Math.cos(angle) * r);
          posAttr.setY(i, Math.sin(angle * 3 + rotationAngle) * (0.2 + bassFrequency * 0.5));
          posAttr.setZ(i, Math.sin(angle) * r);
        }
        posAttr.needsUpdate = true;
      }

      // Subtle light pulse with bass
      pointLight.intensity = 1.2 + bassFrequency * 2.0;
      dirLight1.intensity = 2.0 + midFrequency * 2.0;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [getFrequencyData]);

  return (
    <div className={className || "relative w-full h-[360px] md:h-[440px] flex items-center justify-center"}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
