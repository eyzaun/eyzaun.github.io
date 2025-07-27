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

  // Mobile detection but still allow Three.js
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

    // Text styling - mobile için daha küçük font
    context.fillStyle = '#64ffda';
    context.font = `bold ${isMobile ? '60px' : '90px'} Arial`; // Mobile için daha küçük font
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add glow effect - mobile için daha az glow
    context.shadowColor = '#64ffda';
    context.shadowBlur = isMobile ? 8 : 15;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Second pass for more glow (only on desktop)
    if (!isMobile) {
      context.shadowBlur = 5;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }

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
    if (!mountRef.current || !isActive || isInitializedRef.current) {
      return;
    }

    console.log(`Initializing Three.js with E-Y-Z-A-U-N Letters... (${isMobile ? 'Mobile' : 'Desktop'} Mode)`);
    
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
      camera.position.z = isMobile ? 150 : 200; // Mobile'da daha yakın kamera
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: !isMobile, // Mobile'da antialiasing kapalı (performance)
        powerPreference: isMobile ? "low-power" : "high-performance"
      });
      
      renderer.setSize(screenWidth, screenHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)); // Mobile'da daha düşük pixel ratio
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // === PARTICLES SYSTEM (Mobile Optimized) ===
      const particleCount = isMobile ? 80 : 200; // Mobile'da çok daha az particle
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Position within smaller visible area for mobile
        const widthMultiplier = isMobile ? 0.5 : 0.6;
        const heightMultiplier = isMobile ? 0.5 : 0.6;
        
        positions[i * 3] = (Math.random() - 0.5) * screenWidth * widthMultiplier;
        positions[i * 3 + 1] = (Math.random() - 0.5) * screenHeight * heightMultiplier;
        positions[i * 3 + 2] = (Math.random() - 0.5) * (isMobile ? 50 : 100);

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

        // Size - smaller on mobile
        sizes[i] = (Math.random() * 6 + 2) * (isMobile ? 0.8 : 1);
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Mobile optimized vs Desktop full-featured shader
      const particleMaterial = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uScrollY: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uIsMobile: { value: isMobile ? 1.0 : 0.0 }
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uScrollY;
          uniform float uPixelRatio;
          uniform float uIsMobile;
          
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Simplified mouse interaction for mobile
            vec2 mousePos = uMouse * 2.0 - 1.0;
            float mouseDistance = distance(mousePos, modelPosition.xy / 500.0);
            float mouseInfluence = smoothstep(0.8, 0.0, mouseDistance);
            
            // Reduced wave motion for mobile performance
            float waveIntensity = uIsMobile > 0.5 ? 10.0 : 20.0;
            modelPosition.x += sin(uTime * 0.7 + position.y * 0.01) * waveIntensity;
            modelPosition.y += cos(uTime * 0.5 + position.x * 0.01) * (waveIntensity * 0.75);
            
            if (uIsMobile < 0.5) {
              modelPosition.z += sin(uTime * 0.3 + position.x * 0.005) * 10.0;
            }
            
            // Tighter boundary wrapping for mobile
            float maxX = uIsMobile > 0.5 ? 300.0 : 400.0;
            float maxY = uIsMobile > 0.5 ? 200.0 : 300.0;
            
            if (modelPosition.x > maxX) modelPosition.x = -maxX;
            if (modelPosition.x < -maxX) modelPosition.x = maxX;
            if (modelPosition.y > maxY) modelPosition.y = -maxY;
            if (modelPosition.y < -maxY) modelPosition.y = maxY;
            
            // Reduced mouse repulsion for mobile
            vec2 mouseDirection = normalize(modelPosition.xy - mousePos * 500.0);
            float repulsionForce = uIsMobile > 0.5 ? 40.0 : 80.0;
            modelPosition.xy += mouseDirection * mouseInfluence * repulsionForce;
            
            // Scroll parallax - reduced for mobile
            modelPosition.y += uScrollY * (uIsMobile > 0.5 ? 0.2 : 0.3);
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size and alpha
            float baseSize = size * (400.0 / -viewPosition.z);
            float sizeMultiplier = uIsMobile > 0.5 ? 1.2 : 1.5;
            gl_PointSize = baseSize * (sizeMultiplier + mouseInfluence * 2.0) * uPixelRatio;
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

      // === 3D LETTERS (E-Y-Z-A-U-N) - Mobile Optimized ===
      const letters = isMobile ? ['E', 'Y', 'Z'] : ['E', 'Y', 'Z', 'A', 'U', 'N']; // Mobile'da daha az harf
      const letterMeshes: THREE.Mesh[] = [];

      letters.forEach((letter, index) => {
        const letterSize = isMobile ? 25 : 40; // Mobile'da daha küçük harfler
        const geometry = new THREE.PlaneGeometry(letterSize, letterSize);
        const texture = createTextTexture(letter);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: isMobile ? 0.7 : 0.9, // Mobile'da biraz daha transparan
          side: THREE.DoubleSide
        });

        const letterMesh = new THREE.Mesh(geometry, material);
        
        // Position letters - mobile için daha küçük radius
        const angle = (index / letters.length) * Math.PI * 2;
        const radiusX = Math.min(screenWidth * (isMobile ? 0.12 : 0.15), isMobile ? 120 : 200);
        const radiusY = Math.min(screenHeight * (isMobile ? 0.12 : 0.15), isMobile ? 100 : 150);
        
        letterMesh.position.set(
          Math.cos(angle) * radiusX,
          Math.sin(angle) * radiusY,
          (Math.random() - 0.5) * (isMobile ? 30 : 50)
        );
        
        letterMesh.rotation.set(
          Math.random() * 0.2,
          Math.random() * 0.2,
          Math.random() * 0.2
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
  }, [isActive, cleanup, createTextTexture]);

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
        material.uniforms.uScrollY.value = scrollRef.current * (isMobile ? 0.3 : 0.5);
      }

      // Animate letters - simplified for mobile
      lettersRef.current.forEach((letter, index) => {
        // Rotation - slower on mobile
        const rotationSpeed = isMobile ? 0.5 : 1;
        letter.rotation.x += (0.003 + index * 0.001) * rotationSpeed;
        letter.rotation.y += (0.005 + index * 0.0015) * rotationSpeed;
        letter.rotation.z += (0.002 + index * 0.0008) * rotationSpeed;
        
        // Very gentle floating motion
        const baseX = letter.position.x;
        const baseY = letter.position.y;
        
        // Much smaller floating range for mobile
        const floatIntensity = isMobile ? 0.15 : 0.3;
        letter.position.y += Math.sin(time * 0.3 + index) * floatIntensity;
        letter.position.x += Math.cos(time * 0.2 + index) * (floatIntensity * 0.7);
        letter.position.z += Math.sin(time * 0.4 + index * 0.5) * (floatIntensity * 0.7);
        
        // Strict boundary checks
        const maxX = screenWidth * (isMobile ? 0.15 : 0.2);
        const maxY = screenHeight * (isMobile ? 0.15 : 0.2);
        
        if (Math.abs(letter.position.x) > maxX) {
          letter.position.x = baseX * 0.5;
        }
        if (Math.abs(letter.position.y) > maxY) {
          letter.position.y = baseY * 0.5;
        }
        
        // Keep Z very close
        const maxZ = isMobile ? 20 : 30;
        if (letter.position.z > maxZ) letter.position.z = maxZ;
        if (letter.position.z < -maxZ) letter.position.z = -maxZ;
        
        // Mouse interaction - reduced for mobile
        if (!isMobile || true) { // Keep mouse interaction on mobile but reduced
          const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * (isMobile ? 20 : 30);
          const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * (isMobile ? 20 : 30);
          
          const distanceToMouse = Math.sqrt(
            Math.pow(letter.position.x - mouseInfluenceX, 2) + 
            Math.pow(letter.position.y - mouseInfluenceY, 2)
          );
          
          const interactionDistance = isMobile ? 60 : 80;
          if (distanceToMouse < interactionDistance) {
            const pushForce = (interactionDistance - distanceToMouse) / interactionDistance;
            const pushX = (letter.position.x - mouseInfluenceX) * pushForce * (isMobile ? 0.005 : 0.01);
            const pushY = (letter.position.y - mouseInfluenceY) * pushForce * (isMobile ? 0.005 : 0.01);
            
            const newX = letter.position.x + pushX;
            const newY = letter.position.y + pushY;
            
            if (Math.abs(newX) < maxX) letter.position.x = newX;
            if (Math.abs(newY) < maxY) letter.position.y = newY;
          }
        }
      });

      // Camera movement - reduced for mobile
      const cameraInfluence = isMobile ? 15 : 30;
      const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * cameraInfluence;
      const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * cameraInfluence;
      const scrollInfluence = scrollRef.current * (isMobile ? 0.03 : 0.05);
      
      const cameraSpeed = isMobile ? 0.005 : 0.01;
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * cameraSpeed;
      cameraRef.current.position.y += (mouseInfluenceY + scrollInfluence - cameraRef.current.position.y) * cameraSpeed;
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
    if (isActive && !isInitializedRef.current) {
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
  }, [isActive, initThreeJS, animate, handleResize, cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!isActive) {
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