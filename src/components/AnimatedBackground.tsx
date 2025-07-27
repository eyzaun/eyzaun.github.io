import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

interface LetterPhysics {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
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
  const lettersRef = useRef<LetterPhysics[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const frameIdRef = useRef<number | undefined>();
  const isInitializedRef = useRef<boolean>(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Screen bounds for bouncing
  const boundsRef = useRef({
    left: -400,
    right: 400,
    top: 300,
    bottom: -300,
    front: 100,
    back: -100
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    
    checkMobile();
    const handleResize = () => {
      checkMobile();
      // Update bounds based on screen size
      const w = window.innerWidth;
      const h = window.innerHeight;
      boundsRef.current = {
        left: -w * 0.4,
        right: w * 0.4,
        top: h * 0.3,
        bottom: -h * 0.3,
        front: 80,
        back: -80
      };
    };
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

  // Create text texture - 1.5x büyük ve parlak
  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 128;

    // Clear background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling - Çok büyük ve parlak
    context.fillStyle = '#64ffda';
    context.font = 'bold 95px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Triple glow for maximum visibility
    context.shadowColor = '#64ffda';
    context.shadowBlur = 25;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    context.shadowBlur = 15;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    context.shadowBlur = 5;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Final pass without shadow for sharpness
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
        const material = particlesRef.current.material as THREE.Material;
        material.dispose();
      }
    }

    lettersRef.current.forEach(letterPhysics => {
      if (letterPhysics.mesh.geometry) letterPhysics.mesh.geometry.dispose();
      if (letterPhysics.mesh.material) {
        const material = letterPhysics.mesh.material as THREE.MeshBasicMaterial;
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

    console.log('Initializing Three.js with Bouncing E-Y-Z-A-U-N Letters...');
    
    try {
      const container = mountRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Update bounds
      boundsRef.current = {
        left: -screenWidth * 0.4,
        right: screenWidth * 0.4,
        top: screenHeight * 0.3,
        bottom: -screenHeight * 0.3,
        front: 80,
        back: -80
      };

      // === SCENE SETUP ===
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 1, 1500);
      camera.position.z = 250;
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
      const particleCount = 150;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Position within visible bounds
        positions[i * 3] = (Math.random() - 0.5) * screenWidth * 0.7;
        positions[i * 3 + 1] = (Math.random() - 0.5) * screenHeight * 0.7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

        // Colors
        const colorType = Math.random();
        if (colorType < 0.4) {
          colors[i * 3] = 0.39; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.85;
        } else if (colorType < 0.7) {
          colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
        }

        sizes[i] = Math.random() * 5 + 3;
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
            
            // Wave motion
            modelPosition.x += sin(uTime * 0.4 + position.y * 0.01) * 10.0;
            modelPosition.y += cos(uTime * 0.3 + position.x * 0.01) * 8.0;
            
            // Mouse interaction
            vec2 mousePos = uMouse * 2.0 - 1.0;
            float mouseDistance = distance(mousePos, modelPosition.xy / 400.0);
            float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance);
            
            vec2 mouseDirection = normalize(modelPosition.xy - mousePos * 400.0);
            modelPosition.xy += mouseDirection * mouseInfluence * 50.0;
            
            // Scroll effect
            modelPosition.y += uScrollY * 0.1;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            
            float baseSize = size * (250.0 / -viewPosition.z);
            gl_PointSize = baseSize * (1.5 + mouseInfluence * 1.5) * uPixelRatio;
            vAlpha = smoothstep(0.0, 0.5, size / 6.0) * (0.8 + mouseInfluence * 0.4);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            float glow = 1.0 - smoothstep(0.0, 0.6, distanceToCenter);
            
            vec3 finalColor = vColor;
            float finalAlpha = strength * vAlpha * 1.2 + glow * vAlpha * 0.5;
            
            gl_FragColor = vec4(finalColor, finalAlpha);
          }
        `
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // === 3D LETTERS WITH PHYSICS ===
      const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
      const letterPhysics: LetterPhysics[] = [];

      letters.forEach((letter, index) => {
        // 1.5x büyük geometry
        const geometry = new THREE.PlaneGeometry(50, 50); // 45x45'den 50x50'ye
        const texture = createTextTexture(letter);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 1.0, // Tam parlak
          side: THREE.DoubleSide
        });

        const letterMesh = new THREE.Mesh(geometry, material);
        
        // Fixed initial positions in circle - Garantili görünür alanda
        const angle = (index / letters.length) * Math.PI * 2;
        const radius = Math.min(screenWidth * 0.15, 180); // Küçük radius
        
        const initialX = Math.cos(angle) * radius;
        const initialY = Math.sin(angle) * radius;
        const initialZ = (Math.random() - 0.5) * 40;
        
        letterMesh.position.set(initialX, initialY, initialZ);
        
        // Initial rotation
        letterMesh.rotation.set(
          Math.random() * 0.4,
          Math.random() * 0.4,
          Math.random() * 0.4
        );

        // Physics properties
        const physics: LetterPhysics = {
          mesh: letterMesh,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 2, // Initial velocity
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1
          ),
          basePosition: new THREE.Vector3(initialX, initialY, initialZ)
        };

        scene.add(letterMesh);
        letterPhysics.push(physics);
      });

      lettersRef.current = letterPhysics;

      // === CONNECTION LINES ===
      const createConnectionLines = () => {
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        
        for (let i = 0; i < particleCount && linePositions.length < 300; i++) {
          for (let j = i + 1; j < particleCount && linePositions.length < 300; j++) {
            const distance = new THREE.Vector3(
              positions[i * 3] - positions[j * 3],
              positions[i * 3 + 1] - positions[j * 3 + 1],
              positions[i * 3 + 2] - positions[j * 3 + 2]
            ).length();

            if (distance < 80) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
              
              const alpha = 1.0 - (distance / 80);
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
            opacity: 0.4,
            blending: THREE.AdditiveBlending
          });

          const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(lines);
          linesRef.current = lines;
        }
      };

      createConnectionLines();
      isInitializedRef.current = true;
      console.log('Three.js with Bouncing Letters initialized successfully');

    } catch (error) {
      console.error('Three.js initialization error:', error);
      cleanup();
    }
  }, [isActive, isMobile, cleanup, createTextTexture]);

  // Animation loop with physics
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    try {
      const time = Date.now() * 0.001;
      const deltaTime = 0.016; // 60fps
      
      // Update particle shader
      if (particlesRef.current && particlesRef.current.material) {
        const material = particlesRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = time;
        material.uniforms.uMouse.value.set(
          mouseRef.current.x / window.innerWidth,
          1.0 - mouseRef.current.y / window.innerHeight
        );
        material.uniforms.uScrollY.value = scrollRef.current * 0.2;
      }

      // Physics-based letter animation
      lettersRef.current.forEach((letterPhysics, index) => {
        const letter = letterPhysics.mesh;
        const velocity = letterPhysics.velocity;
        const bounds = boundsRef.current;
        
        // Rotation
        letter.rotation.x += 0.01;
        letter.rotation.y += 0.015;
        letter.rotation.z += 0.005;
        
        // Mouse interaction - Pull/Push effect
        const mouseWorldX = (mouseRef.current.x / window.innerWidth - 0.5) * window.innerWidth * 0.8;
        const mouseWorldY = -(mouseRef.current.y / window.innerHeight - 0.5) * window.innerHeight * 0.6;
        
        const distanceToMouse = Math.sqrt(
          Math.pow(letter.position.x - mouseWorldX, 2) + 
          Math.pow(letter.position.y - mouseWorldY, 2)
        );
        
        // Mouse influence
        if (distanceToMouse < 120) {
          const influence = (120 - distanceToMouse) / 120;
          const forceX = (letter.position.x - mouseWorldX) * influence * 0.1;
          const forceY = (letter.position.y - mouseWorldY) * influence * 0.1;
          
          velocity.x += forceX;
          velocity.y += forceY;
        }
        
        // Scroll influence
        const scrollInfluence = (scrollRef.current - (scrollRef.current % 100)) * 0.001;
        velocity.y += scrollInfluence;
        
        // Gravity towards center (subtle)
        const centerForce = 0.02;
        velocity.x -= letter.position.x * centerForce * deltaTime;
        velocity.y -= letter.position.y * centerForce * deltaTime;
        velocity.z -= letter.position.z * centerForce * deltaTime;
        
        // Apply velocity
        letter.position.x += velocity.x * deltaTime * 60;
        letter.position.y += velocity.y * deltaTime * 60;
        letter.position.z += velocity.z * deltaTime * 60;
        
        // Boundary bouncing
        if (letter.position.x > bounds.right) {
          letter.position.x = bounds.right;
          velocity.x = -Math.abs(velocity.x) * 0.8; // Bounce with damping
        }
        if (letter.position.x < bounds.left) {
          letter.position.x = bounds.left;
          velocity.x = Math.abs(velocity.x) * 0.8;
        }
        
        if (letter.position.y > bounds.top) {
          letter.position.y = bounds.top;
          velocity.y = -Math.abs(velocity.y) * 0.8;
        }
        if (letter.position.y < bounds.bottom) {
          letter.position.y = bounds.bottom;
          velocity.y = Math.abs(velocity.y) * 0.8;
        }
        
        if (letter.position.z > bounds.front) {
          letter.position.z = bounds.front;
          velocity.z = -Math.abs(velocity.z) * 0.8;
        }
        if (letter.position.z < bounds.back) {
          letter.position.z = bounds.back;
          velocity.z = Math.abs(velocity.z) * 0.8;
        }
        
        // Friction
        velocity.multiplyScalar(0.98);
        
        // Prevent getting stuck
        if (velocity.length() < 0.1) {
          velocity.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.2
          ));
        }
      });

      // Camera movement
      const mouseInfluenceX = (mouseRef.current.x / window.innerWidth - 0.5) * 30;
      const mouseInfluenceY = -(mouseRef.current.y / window.innerHeight - 0.5) * 30;
      const scrollInfluence = scrollRef.current * 0.03;
      
      cameraRef.current.position.x += (mouseInfluenceX - cameraRef.current.position.x) * 0.01;
      cameraRef.current.position.y += (mouseInfluenceY + scrollInfluence - cameraRef.current.position.y) * 0.01;
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
    
    // Update bounds
    boundsRef.current = {
      left: -width * 0.4,
      right: width * 0.4,
      top: height * 0.3,
      bottom: -height * 0.3,
      front: 80,
      back: -80
    };
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