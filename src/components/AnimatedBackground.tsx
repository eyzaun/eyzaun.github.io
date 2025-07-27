import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  mouseX, 
  mouseY, 
  isActive 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameIdRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Visibility optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Custom shader for particles
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScrollY;
    attribute float aScale;
    attribute vec3 aRandomness;
    varying float vAlpha;
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Mouse interaction
      float mouseDistance = distance(uMouse, modelPosition.xy);
      float mouseInfluence = smoothstep(300.0, 0.0, mouseDistance);
      
      // Wave motion
      modelPosition.x += sin(uTime * 0.5 + aRandomness.x * 6.28) * aRandomness.y * 0.5;
      modelPosition.y += cos(uTime * 0.3 + aRandomness.z * 6.28) * aRandomness.x * 0.3;
      
      // Mouse repulsion
      vec2 mouseDirection = normalize(modelPosition.xy - uMouse);
      modelPosition.xy += mouseDirection * mouseInfluence * 50.0;
      
      // Scroll parallax
      modelPosition.y += uScrollY * aRandomness.y * 0.1;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      gl_PointSize = aScale * (300.0 / -viewPosition.z);
      
      // Varying values
      vAlpha = smoothstep(0.0, 0.3, aScale) * (1.0 - mouseInfluence * 0.5);
      vColor = mix(vec3(0.4, 1.0, 0.85), vec3(0.2, 0.6, 1.0), aRandomness.x);
    }
  `;

  const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;
    
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
      
      vec3 finalColor = vColor;
      float finalAlpha = strength * vAlpha * 0.6;
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  // Initialize Three.js scene
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || !isActive || isMobile) return;

    const container = mountRef.current;
    const { clientWidth: width, clientHeight: height } = container;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 100;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles
    const particleCount = Math.min(width * height / 8000, 150);
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * width * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      // Scale
      scales[i] = Math.random() * 8 + 2;

      // Randomness
      randomness[i * 3] = Math.random();
      randomness[i * 3 + 1] = Math.random();
      randomness[i * 3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometryRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uScrollY: { value: 0 }
      }
    });
    materialRef.current = material;

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

  }, [isActive, isMobile]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current || !isVisible) {
      return;
    }

    const time = Date.now() * 0.001;
    const scrollY = window.scrollY;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(
      mouseX - window.innerWidth / 2,
      -mouseY + window.innerHeight / 2
    );
    materialRef.current.uniforms.uScrollY.value = scrollY * 0.5;

    // Camera movement based on mouse
    if (cameraRef.current) {
      const mouseInfluenceX = (mouseX / window.innerWidth - 0.5) * 10;
      const mouseInfluenceY = (mouseY / window.innerHeight - 0.5) * 10;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (-mouseInfluenceY - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(0, 0, 0);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    frameIdRef.current = requestAnimationFrame(animate);
  }, [mouseX, mouseY, isVisible]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

    const { clientWidth: width, clientHeight: height } = mountRef.current;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Initialize
  useEffect(() => {
    if (isActive && !isMobile) {
      initThreeJS();
      animate();

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
      };
    }
  }, [isActive, isMobile, initThreeJS, animate, handleResize]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Dispose of Three.js objects
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && rendererRef.current.domElement.parentNode) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // Don't render on mobile
  if (isMobile || !isActive) {
    return null;
  }

  return (
    <div 
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default AnimatedBackground;