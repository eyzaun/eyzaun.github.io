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

  // Helper function to create text texture - 1.5x büyüklük
  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 128;

    // Clear background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling - Daha büyük font
    context.fillStyle = '#64ffda';
    context.font = 'bold 90px Arial'; // 80px'den 90px'e
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Strong glow effect
    context.shadowColor = '#64ffda';
    context.shadowBlur = 20;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Double glow
    context.shadowBlur = 10;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Third pass for brightness
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

    // Clean up all resources
    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        const material = particlesRef.current.material as THREE.Material;
        material.dispose();
      }
    }

    lettersRef.current.forEach(letter => {
      if (letter.geometry) letter.geometry.dispose();
      if (letter.material) {
        const material = letter.material as THREE.MeshBasicMaterial;
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

    console.log('Initializing Three.js with Centered E-Y-Z-A-U-N Letters...');
    
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

      // Camera - Daha yakın pozisyon
      const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 1, 1500);
      camera.position.z = 200; // 300'den 200'e
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

      // === PARTICLES SYSTEM - Sıkı boundaries ===
      const particleCount = 180;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      // Visible area hesaplama - Çok daha sıkı
      const visibleWidth = screenWidth * 0.6; // 0.9'dan 0.6'ya
      const visibleHeight = screenHeight * 0.6; // 0.9'dan 0.6'ya

      for (let i = 0; i < particleCount; i++) {
        // Position - Kesinlikle görünür alanda
        positions[i * 3] = (Math.random() - 0.5) * visibleWidth;
        positions[i * 3 + 1] = (Math.random() - 0.5) * visibleHeight;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // 300'den 200'e

        // Colors - Site theme
        const colorType = Math.random();
        if (colorType < 0.4) {
          colors[i * 3] = 0.39;     // Green
          colors[i * 3 + 1] = 1.0;  
          colors[i * 3 + 2] = 0.85; 
        } else if (colorType < 0.7) {
          colors[i * 3] = 0.2;      // Cyan
          colors[i * 3 + 1] = 0.8;  
          colors[i * 3 + 2] = 1.0;  
        } else {
          colors[i * 3] = 0.6;      // Light blue
          colors[i * 3 + 1] = 0.9;  
          colors[i * 3 + 2] = 1.0;  
        }

        sizes[i] = Math.random() * 6 + 4; // Biraz daha büyük
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
            float mouseDistance = distance(mousePos, modelPosition.xy / 400.0);
            float mouseInfluence = smoothstep(0.6, 0.0, mouseDistance);
            
            // Gentle wave motion
            modelPosition.x += sin(uTime * 0.5 + position.y * 0.008) * 15.0;
            modelPosition.y += cos(uTime * 0.4 + position.x * 0.008) * 12.0;
            modelPosition.z += sin(uTime * 0.3 + position.x * 0.004) * 8.0;
            
            // Strong boundary constraints - Keep in center
            float maxX = 500.0; // Daha sıkı
            float maxY = 400.0; // Daha sıkı
            
            if (modelPosition.x > maxX) modelPosition.x = maxX - 50.0;
            if (modelPosition.x < -maxX) modelPosition.x = -maxX + 50.0;
            if (modelPosition.y > maxY) modelPosition.y = maxY - 50.0;
            if (modelPosition.y < -maxY) modelPosition.y = -maxY + 50.0;
            
            // Mouse interaction
            vec2 mouseDirection = normalize(modelPosition.xy - mousePos * 400.0);
            modelPosition.xy += mouseDirection * mouseInfluence * 60.0;
            
            // Scroll parallax
            modelPosition.y += uScrollY * 0.2;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size and alpha
            float baseSize = size * (300.0 / -viewPosition.z);
            gl_PointSize = baseSize * (1.8 + mouseInfluence * 2.0) * uPixelRatio;
            vAlpha = smoothstep(0.0, 0.5, size / 8.0) * (0.9 + mouseInfluence * 0.5);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            float glow = 1.0 - smoothstep(0.0, 0.7, distanceToCenter);
            
            vec3 finalColor = vColor;
            float finalAlpha = strength * vAlpha * 1.4 + glow * vAlpha * 0.6;
            
            gl_FragColor = vec4(finalColor, finalAlpha);
          }
        `
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // === 3D LETTERS (E-Y-Z-A-U-N) - 1.5x büyük ve merkezi ===
      const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
      const letterMeshes: THREE.Mesh[] = [];

      letters.forEach((letter, index) => {
        // 1.5x daha büyük geometry
        const geometry = new THREE.PlaneGeometry(45, 45); // 30x30'dan 45x45'e
        const texture = createTextTexture(letter);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9, // Biraz daha parlak
          side: THREE.DoubleSide
        });

        const letterMesh = new THREE.Mesh(geometry, material);
        
        // Harfleri çok daha merkezi konumlandır
        const angle = (index / letters.length) * Math.PI * 2;
        const radiusX = Math.min(screenWidth * 0.2, 250); // 0.35'den 0.2'ye
        const radiusY = Math.min(screenHeight * 0.2, 200); // 0.35'den 0.2'ye
        
        letterMesh.position.set(
          Math.cos(angle) * radiusX,
          Math.sin(angle) * radiusY,
          (Math.random() - 0.5) * 80 // 150'den 80'e
        );
        
        // Daha az rotasyon
        letterMesh.rotation.set(
          Math.random() * 0.3,
          Math.random() * 0.3,
          Math.random() * 0.3
        );

        scene.add(letterMesh);
        letterMeshes.push(letterMesh);
      });

      lettersRef.current = letterMeshes;

      // === CONNECTION LINES - Optimize edilmiş ===
      const createConnectionLines = () => {
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        
        for (let i = 0; i < particleCount && linePositions.length < 400; i++) {
          for (let j = i + 1; j < particleCount && linePositions.length < 400; j++) {
            const distance = new THREE.Vector3(
              positions[i * 3] - positions[j * 3],
              positions[i * 3 + 1] - positions[j * 3 + 1],
              positions[i * 3 + 2] - positions[j * 3 + 2]
            ).length();

            if (distance < 100) { // Daha yakın mesafe
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
              
              const alpha = 1.0 - (distance / 100);
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
            opacity: 0.6,
            blending: THREE.AdditiveBlending
          });

          const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(lines);
          linesRef.current = lines;
        }
      };

      createConnectionLines();
      isInitializedRef.current = true;
      console.log('Three.js with Centered Letters initialized successfully');

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
        material.uniforms.uScrollY.value = scrollRef.current * 0.3;
      }

      // Animate letters - Sıkı boundary kontrolü
      lettersRef.current.forEach((letter, index) => {
        // Smooth rotation
        letter.rotation.x += 0.002 + index * 0.0008;
        letter.rotation.y += 0.004 + index * 0.001;
        letter.rotation.z += 0.001 + index * 0.0006;
        
        // Base position tracking
        const baseX = letter.position.x;
        const baseY = letter.position.y;
        
        // Gentle floating motion
        letter.position.y += Math.sin(time * 0.2 + index) * 0.6;
        letter.position.x += Math.cos(time * 0.15 + index) * 0.4;
        letter.position.z += Math.sin(time * 0.25 + index * 0.5) * 0.3;
        
        // Very strict boundary enforcement
        const maxX = screenWidth * 0.25; // Çok sıkı
        const maxY = screenHeight * 0.25; // Çok sıkı
        
        if (Math.abs(letter.position.x) > maxX) {
          letter.position.x = baseX * 0.5; // Merkeze çek
        }
        if (Math.abs(letter.position.y) > maxY) {
          letter.position.y = baseY * 0.5; // Merkeze çek
        }
        
        // Z boundary
        if (letter.position.z > 50) letter.position.z = 50;
        if (letter.position.z < -50) letter.position.z = -50;
        
        // Gentle mouse interaction
        const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 30;
        const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 30;
        
        const distanceToMouse = Math.sqrt(
          Math.pow(letter.position.x - mouseInfluenceX, 2) + 
          Math.pow(letter.position.y - mouseInfluenceY, 2)
        );
        
        if (distanceToMouse < 80) {
          const pushForce = (80 - distanceToMouse) / 80;
          const pushX = (letter.position.x - mouseInfluenceX) * pushForce * 0.015;
          const pushY = (letter.position.y - mouseInfluenceY) * pushForce * 0.015;
          
          letter.position.x += pushX;
          letter.position.y += pushY;
        }
      });

      // Subtle camera movement
      const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 50;
      const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 50;
      const scrollInfluence = scrollRef.current * 0.05;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.015;
      cameraRef.current.position.y += (mouseInfluenceY + scrollInfluence - cameraRef.current.position.y) * 0.015;
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