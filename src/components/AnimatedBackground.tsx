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
  const frameIdRef = useRef<number>();
  const isInitializedRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection - Only once
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update mouse position smoothly
  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up Three.js resources...');
    
    // Stop animation
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }

    // Dispose geometries and materials
    if (particlesRef.current) {
      if (particlesRef.current.geometry) {
        particlesRef.current.geometry.dispose();
      }
      if (particlesRef.current.material) {
        if (Array.isArray(particlesRef.current.material)) {
          particlesRef.current.material.forEach(material => material.dispose());
        } else {
          (particlesRef.current.material as THREE.Material).dispose();
        }
      }
    }

    // Dispose renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      if (mountRef.current && rendererRef.current.domElement.parentNode) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    // Clear references
    sceneRef.current = null;
    rendererRef.current = null;
    cameraRef.current = null;
    particlesRef.current = null;
    isInitializedRef.current = false;
  }, []);

  // Initialize Three.js - ONLY ONCE
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || !isActive || isMobile || isInitializedRef.current) {
      return;
    }

    console.log('Initializing Three.js...');
    
    try {
      const container = mountRef.current;
      const { clientWidth: width, clientHeight: height } = container;

      if (width === 0 || height === 0) {
        console.warn('Container has no dimensions');
        return;
      }

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
      camera.position.z = 100;
      cameraRef.current = camera;

      // Renderer with minimal settings
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false,
        powerPreference: "low-power",
        stencil: false,
        depth: false
      });
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Simple particles without complex shaders
      const particleCount = Math.min(50, Math.floor(width * height / 10000));
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // Safe position values
        positions[i * 3] = (Math.random() - 0.5) * width * 0.8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * height * 0.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        // Green-cyan colors
        colors[i * 3] = 0.4 + Math.random() * 0.2;     // R
        colors[i * 3 + 1] = 1.0;                       // G  
        colors[i * 3 + 2] = 0.85 - Math.random() * 0.2; // B
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      isInitializedRef.current = true;
      console.log('Three.js initialized successfully');

    } catch (error) {
      console.error('Three.js initialization error:', error);
      cleanup();
    }
  }, [isActive, isMobile, cleanup]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !particlesRef.current) {
      return;
    }

    try {
      const time = Date.now() * 0.001;
      const particles = particlesRef.current;
      const positions = particles.geometry.attributes.position.array as Float32Array;

      // Simple wave animation
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = positions[i];
        const originalY = positions[i + 1];
        
        positions[i] = originalX + Math.sin(time + i * 0.01) * 2;
        positions[i + 1] = originalY + Math.cos(time + i * 0.015) * 1.5;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Simple camera movement
      const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 20;
      const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 20;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (mouseInfluenceY - cameraRef.current.position.y) * 0.02;
      cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);

    } catch (error) {
      console.error('Animation error:', error);
      cleanup();
    }
  }, [cleanup]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

    const { clientWidth: width, clientHeight: height } = mountRef.current;
    
    if (width > 0 && height > 0) {
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }
  }, []);

  // Main effect - Initialize and start animation
  useEffect(() => {
    if (isActive && !isMobile && !isInitializedRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initThreeJS();
        if (isInitializedRef.current) {
          animate();
          window.addEventListener('resize', handleResize);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        cleanup();
      };
    }

    return cleanup;
  }, [isActive, isMobile, initThreeJS, animate, handleResize, cleanup]);

  // Cleanup on component unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Don't render on mobile or if not active
  if (isMobile || !isActive) {
    return null;
  }

  return (
    <div 
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: 1
      }}
    />
  );
};

export default AnimatedBackground;