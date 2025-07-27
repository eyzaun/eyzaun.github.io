import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

interface LetterObject {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
  letter: string;
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
  const lettersRef = useRef<LetterObject[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const frameIdRef = useRef<number | undefined>();
  const isInitializedRef = useRef<boolean>(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<number>(0);
  const viewportRef = useRef({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobile detection
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

  // Update mouse and scroll
  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate viewport in world space
  const calculateViewport = useCallback((camera: THREE.PerspectiveCamera, screenWidth: number, screenHeight: number) => {
    const fov = camera.fov * Math.PI / 180; // Convert to radians
    const distance = camera.position.z;
    const height = 2 * Math.tan(fov / 2) * distance;
    const width = height * (screenWidth / screenHeight);
    
    viewportRef.current = { width, height };
    return { width, height };
  }, []);

  // Convert mouse coordinates to world space
  const mouseToWorld = useCallback((mouseX: number, mouseY: number, screenWidth: number, screenHeight: number) => {
    const x = (mouseX / screenWidth - 0.5) * viewportRef.current.width;
    const y = -(mouseY / screenHeight - 0.5) * viewportRef.current.height;
    return { x, y };
  }, []);

  // Create text texture for letters
  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 128;

    // Clear background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling
    context.fillStyle = '#64ffda';
    context.font = 'bold 90px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Strong glow effect
    context.shadowColor = '#64ffda';
    context.shadowBlur = 25;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Additional glow layers
    context.shadowBlur = 15;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    context.shadowBlur = 0;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up Three.js resources...');
    
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }

    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        (particlesRef.current.material as THREE.Material).dispose();
      }
    }

    lettersRef.current.forEach(letterObj => {
      if (letterObj.mesh.geometry) letterObj.mesh.geometry.dispose();
      if (letterObj.mesh.material) {
        const material = letterObj.mesh.material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      }
    });

    if (linesRef.current) {
      if (linesRef.current.geometry) linesRef.current.geometry.dispose();
      if (linesRef.current.material) {
        (linesRef.current.material as THREE.Material).dispose();
      }
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      if (mountRef.current && rendererRef.current.domElement.parentNode) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    sceneRef.current = null;
    rendererRef.current = null;
    cameraRef.current = null;
    particlesRef.current = null;
    linesRef.current = null;
    lettersRef.current = [];
    isInitializedRef.current = false;
  }, []);

  // Initialize Three.js
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || !isActive || isMobile || isInitializedRef.current) {
      return;
    }

    console.log('Initializing Physics-Based Three.js Letters...');
    
    try {
      const container = mountRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // === SCENE SETUP ===
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 1, 1000);
      camera.position.z = 150;
      cameraRef.current = camera;

      // Calculate viewport in world coordinates
      const viewport = calculateViewport(camera, screenWidth, screenHeight);
      console.log('Viewport calculated:', viewport);

      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(screenWidth, screenHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // === PARTICLES SYSTEM ===
      const particleCount = 150;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      // Place particles within viewport bounds
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * viewport.width * 0.8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 0.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        // Colors
        const colorType = Math.random();
        if (colorType < 0.4) {
          colors[i * 3] = 0.39; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.85;
        } else if (colorType < 0.7) {
          colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
        }

        sizes[i] = Math.random() * 4 + 3;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uScrollY: { value: 0 }
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uScrollY;
          
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Gentle wave motion
            modelPosition.x += sin(uTime * 0.3 + position.y * 0.005) * 8.0;
            modelPosition.y += cos(uTime * 0.25 + position.x * 0.005) * 6.0;
            
            // Mouse interaction
            vec2 mouseDistance = modelPosition.xy - uMouse;
            float distance = length(mouseDistance);
            float influence = smoothstep(100.0, 0.0, distance);
            modelPosition.xy += normalize(mouseDistance) * influence * 20.0;
            
            // Scroll parallax
            modelPosition.y += uScrollY * 0.1;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            gl_PointSize = size * (100.0 / -viewPosition.z);
            vAlpha = 0.8;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            gl_FragColor = vec4(vColor, strength * vAlpha);
          }
        `
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // === PHYSICS-BASED LETTERS ===
      const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
      const letterObjects: LetterObject[] = [];

      letters.forEach((letter, index) => {
        // Create letter mesh
        const geometry = new THREE.PlaneGeometry(50, 50);
        const texture = createTextTexture(letter);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Position letters within viewport bounds with spacing
        const angle = (index / letters.length) * Math.PI * 2;
        const radius = Math.min(viewport.width, viewport.height) * 0.25;
        
        const basePosition = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        );
        
        mesh.position.copy(basePosition);
        
        // Initial random velocity
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          0
        );

        const letterObj: LetterObject = {
          mesh,
          velocity,
          basePosition: basePosition.clone(),
          letter
        };

        scene.add(mesh);
        letterObjects.push(letterObj);
      });

      lettersRef.current = letterObjects;

      isInitializedRef.current = true;
      console.log('Physics-based letters initialized successfully');

    } catch (error) {
      console.error('Three.js initialization error:', error);
      cleanup();
    }
  }, [isActive, isMobile, cleanup, createTextTexture, calculateViewport]);

  // Physics and animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    try {
      const time = Date.now() * 0.001;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Update particle shader uniforms
      if (particlesRef.current && particlesRef.current.material) {
        const material = particlesRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = time;
        
        const mouseWorld = mouseToWorld(mouseRef.current.x, mouseRef.current.y, screenWidth, screenHeight);
        material.uniforms.uMouse.value.set(mouseWorld.x, mouseWorld.y);
        material.uniforms.uScrollY.value = scrollRef.current * 0.02;
      }

      // Physics-based letter animation
      lettersRef.current.forEach((letterObj, index) => {
        const { mesh, velocity, basePosition } = letterObj;
        
        // Get viewport bounds
        const bounds = {
          left: -viewportRef.current.width * 0.45,
          right: viewportRef.current.width * 0.45,
          top: viewportRef.current.height * 0.45,
          bottom: -viewportRef.current.height * 0.45
        };

        // Mouse interaction force
        const mouseWorld = mouseToWorld(mouseRef.current.x, mouseRef.current.y, screenWidth, screenHeight);
        const mouseDistance = mesh.position.distanceTo(new THREE.Vector3(mouseWorld.x, mouseWorld.y, 0));
        
        if (mouseDistance < 80) {
          const force = new THREE.Vector3()
            .subVectors(mesh.position, new THREE.Vector3(mouseWorld.x, mouseWorld.y, 0))
            .normalize()
            .multiplyScalar(0.5);
          velocity.add(force);
        }

        // Scroll influence
        velocity.y += scrollRef.current * 0.0001;

        // Gentle attraction to base position
        const attraction = new THREE.Vector3()
          .subVectors(basePosition, mesh.position)
          .multiplyScalar(0.001);
        velocity.add(attraction);

        // Random movement
        velocity.x += (Math.random() - 0.5) * 0.01;
        velocity.y += (Math.random() - 0.5) * 0.01;

        // Boundary collision with bounce
        if (mesh.position.x <= bounds.left || mesh.position.x >= bounds.right) {
          velocity.x *= -0.8; // Bounce with energy loss
          mesh.position.x = Math.max(bounds.left, Math.min(bounds.right, mesh.position.x));
        }
        
        if (mesh.position.y <= bounds.bottom || mesh.position.y >= bounds.top) {
          velocity.y *= -0.8; // Bounce with energy loss
          mesh.position.y = Math.max(bounds.bottom, Math.min(bounds.top, mesh.position.y));
        }

        // Apply velocity with damping
        velocity.multiplyScalar(0.98); // Friction
        mesh.position.add(velocity);

        // Rotation
        mesh.rotation.z += velocity.length() * 0.01;
        mesh.rotation.x += Math.sin(time * 0.5 + index) * 0.001;
        mesh.rotation.y += Math.cos(time * 0.3 + index) * 0.001;
      });

      // Subtle camera movement
      const mouseInfluenceX = (mouseRef.current.x / screenWidth - 0.5) * 20;
      const mouseInfluenceY = -(mouseRef.current.y / screenHeight - 0.5) * 20;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.01;
      cameraRef.current.position.y += (mouseInfluenceY - cameraRef.current.position.y) * 0.01;
      cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);

    } catch (error) {
      console.error('Animation error:', error);
      cleanup();
    }
  }, [cleanup, mouseToWorld]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!rendererRef.current || !cameraRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    
    // Recalculate viewport
    calculateViewport(cameraRef.current, width, height);
  }, [calculateViewport]);

  // Main effect
  useEffect(() => {
    if (isActive && !isMobile && !isInitializedRef.current) {
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

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (isMobile || !isActive) {
    return null;
  }

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 5,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

export default AnimatedBackground;