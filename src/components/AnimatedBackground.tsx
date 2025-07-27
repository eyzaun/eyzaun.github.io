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
  const lettersRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const frameIdRef = useRef<number | undefined>();
  const isInitializedRef = useRef<boolean>(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<number>(0);
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

  // Update mouse and scroll position
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

  // Helper function to create text texture
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
    context.font = 'bold 80px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add glow effect
    context.shadowColor = '#64ffda';
    context.shadowBlur = 15;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Second pass for more glow
    context.shadowBlur = 5;
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

    // Dispose particles
    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        const material = particlesRef.current.material as THREE.Material;
        material.dispose();
      }
    }

    // Dispose letters
    lettersRef.current.forEach(letter => {
      if (letter.geometry) letter.geometry.dispose();
      if (letter.material) {
        const material = letter.material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      }
    });

    // Dispose lines
    if (linesRef.current) {
      if (linesRef.current.geometry) linesRef.current.geometry.dispose();
      if (linesRef.current.material) {
        (linesRef.current.material as THREE.Material).dispose();
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
    linesRef.current = null;
    lettersRef.current = [];
    isInitializedRef.current = false;
  }, []);

  // Initialize Three.js
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || !isActive || isMobile || isInitializedRef.current) {
      return;
    }

    console.log('Initializing Three.js with E-Y-Z-A-U-N Letters...');
    
    try {
      const container = mountRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (screenWidth === 0 || screenHeight === 0) {
        console.warn('Screen has no dimensions');
        return;
      }

      // === SCENE SETUP ===
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 1, 2000);
      camera.position.z = 300;
      cameraRef.current = camera;

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
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Position within visible area
        positions[i * 3] = (Math.random() - 0.5) * screenWidth * 0.9;
        positions[i * 3 + 1] = (Math.random() - 0.5) * screenHeight * 0.9;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

        // Colors - Site theme
        const colorType = Math.random();
        if (colorType < 0.4) {
          // Green theme #64ffda
          colors[i * 3] = 0.39;     // R
          colors[i * 3 + 1] = 1.0;  // G  
          colors[i * 3 + 2] = 0.85; // B
        } else if (colorType < 0.7) {
          // Cyan
          colors[i * 3] = 0.2;      // R
          colors[i * 3 + 1] = 0.8;  // G  
          colors[i * 3 + 2] = 1.0;  // B
        } else {
          // Light blue
          colors[i * 3] = 0.6;      // R
          colors[i * 3 + 1] = 0.9;  // G  
          colors[i * 3 + 2] = 1.0;  // B
        }

        // Size
        sizes[i] = Math.random() * 8 + 3;
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
          uScrollY: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uScrollY;
          uniform float uPixelRatio;
          
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Mouse interaction
            vec2 mousePos = uMouse * 2.0 - 1.0;
            float mouseDistance = distance(mousePos, modelPosition.xy / 500.0);
            float mouseInfluence = smoothstep(0.8, 0.0, mouseDistance);
            
            // Wave motion
            modelPosition.x += sin(uTime * 0.7 + position.y * 0.01) * 20.0;
            modelPosition.y += cos(uTime * 0.5 + position.x * 0.01) * 15.0;
            modelPosition.z += sin(uTime * 0.3 + position.x * 0.005) * 10.0;
            
            // Boundary wrapping
            float maxX = 800.0;
            float maxY = 600.0;
            
            if (modelPosition.x > maxX) modelPosition.x = -maxX;
            if (modelPosition.x < -maxX) modelPosition.x = maxX;
            if (modelPosition.y > maxY) modelPosition.y = -maxY;
            if (modelPosition.y < -maxY) modelPosition.y = maxY;
            
            // Mouse repulsion
            vec2 mouseDirection = normalize(modelPosition.xy - mousePos * 500.0);
            modelPosition.xy += mouseDirection * mouseInfluence * 80.0;
            
            // Scroll parallax
            modelPosition.y += uScrollY * 0.3;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size and alpha
            float baseSize = size * (400.0 / -viewPosition.z);
            gl_PointSize = baseSize * (1.5 + mouseInfluence * 3.0) * uPixelRatio;
            vAlpha = smoothstep(0.0, 0.5, size / 8.0) * (0.8 + mouseInfluence * 0.6);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            float glow = 1.0 - smoothstep(0.0, 0.8, distanceToCenter);
            
            vec3 finalColor = vColor;
            float finalAlpha = strength * vAlpha * 1.2 + glow * vAlpha * 0.4;
            
            gl_FragColor = vec4(finalColor, finalAlpha);
          }
        `
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // === 3D LETTERS (E-Y-Z-A-U-N) ===
      const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
      const letterMeshes: THREE.Mesh[] = [];

      letters.forEach((letter, index) => {
        const geometry = new THREE.PlaneGeometry(30, 30);
        const texture = createTextTexture(letter);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });

        const letterMesh = new THREE.Mesh(geometry, material);
        
        // Position letters in a circle
        const angle = (index / letters.length) * Math.PI * 2;
        const radiusX = Math.min(screenWidth * 0.35, 400);
        const radiusY = Math.min(screenHeight * 0.35, 300);
        
        letterMesh.position.set(
          Math.cos(angle) * radiusX,
          Math.sin(angle) * radiusY,
          (Math.random() - 0.5) * 150
        );
        
        letterMesh.rotation.set(
          Math.random() * 0.5,
          Math.random() * 0.5,
          Math.random() * 0.5
        );

        scene.add(letterMesh);
        letterMeshes.push(letterMesh);
      });

      lettersRef.current = letterMeshes;

      // === CONNECTION LINES ===
      const createConnectionLines = () => {
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        
        for (let i = 0; i < particleCount && linePositions.length < 600; i++) {
          for (let j = i + 1; j < particleCount && linePositions.length < 600; j++) {
            const distance = new THREE.Vector3(
              positions[i * 3] - positions[j * 3],
              positions[i * 3 + 1] - positions[j * 3 + 1],
              positions[i * 3 + 2] - positions[j * 3 + 2]
            ).length();

            if (distance < 120) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
              
              const alpha = 1.0 - (distance / 120);
              lineColors.push(0.39, 1.0, 0.85, alpha);
              lineColors.push(0.39, 1.0, 0.85, alpha);
            }
          }
        }

        if (linePositions.length > 0) {
          const lineGeometry = new THREE.BufferGeometry();
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
          lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

          const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
          });

          const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(lines);
          linesRef.current = lines;
        }
      };

      createConnectionLines();
      isInitializedRef.current = true;
      console.log('Three.js with 3D Letters initialized successfully');

    } catch (error) {
      console.error('Three.js initialization error:', error);
      cleanup();
    }
  }, [isActive, isMobile, cleanup, createTextTexture]);

  // Animation loop
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
        material.uniforms.uMouse.value.set(
          mouseRef.current.x / window.innerWidth,
          1.0 - mouseRef.current.y / window.innerHeight
        );
        material.uniforms.uScrollY.value = scrollRef.current * 0.5;
      }

      // Animate letters
      lettersRef.current.forEach((letter, index) => {
        // Rotation
        letter.rotation.x += 0.003 + index * 0.001;
        letter.rotation.y += 0.005 + index * 0.0015;
        letter.rotation.z += 0.002 + index * 0.0008;
        
        // Floating motion with boundaries
        const originalX = letter.position.x;
        const originalY = letter.position.y;
        
        letter.position.y += Math.sin(time * 0.3 + index) * 0.8;
        letter.position.x += Math.cos(time * 0.2 + index) * 0.6;
        letter.position.z += Math.sin(time * 0.4 + index * 0.5) * 0.4;
        
        // Boundary checks
        const maxX = screenWidth * 0.4;
        const maxY = screenHeight * 0.4;
        
        if (Math.abs(letter.position.x) > maxX) {
          letter.position.x = originalX * 0.8;
        }
        if (Math.abs(letter.position.y) > maxY) {
          letter.position.y = originalY * 0.8;
        }
        
        if (letter.position.z > 100) letter.position.z = 100;
        if (letter.position.z < -100) letter.position.z = -100;
        
        // Mouse interaction
        const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 50;
        const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 50;
        
        const distanceToMouse = Math.sqrt(
          Math.pow(letter.position.x - mouseInfluenceX, 2) + 
          Math.pow(letter.position.y - mouseInfluenceY, 2)
        );
        
        if (distanceToMouse < 100) {
          const pushForce = (100 - distanceToMouse) / 100;
          const pushX = (letter.position.x - mouseInfluenceX) * pushForce * 0.02;
          const pushY = (letter.position.y - mouseInfluenceY) * pushForce * 0.02;
          
          letter.position.x += pushX;
          letter.position.y += pushY;
        }
      });

      // Camera movement
      const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 100;
      const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 100;
      const scrollInfluence = scrollRef.current * 0.1;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (mouseInfluenceY + scrollInfluence - cameraRef.current.position.y) * 0.02;
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
    if (!rendererRef.current || !cameraRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

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