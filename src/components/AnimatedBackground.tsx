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
  const frameIdRef = useRef<number | undefined>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  // Scene objects
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const lettersRef = useRef<THREE.Mesh[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track mouse and scroll
  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create floating particles
  const createParticleSystem = useCallback((scene: THREE.Scene) => {
    const count = isMobile ? 60 : 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

      // Color variation between green and cyan
      const hue = 0.5 + Math.random() * 0.15; // Green to cyan range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 4 + 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        scroll: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        uniform float scroll;
        attribute float size;
        attribute vec3 color;  // Add missing color attribute
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Gentle floating animation
          pos.x += sin(time * 0.5 + position.y * 0.01) * 20.0;
          pos.y += cos(time * 0.3 + position.x * 0.01) * 15.0;
          pos.z += sin(time * 0.4 + position.x * 0.005) * 10.0;
          
          // Mouse interaction
          vec2 mouseWorld = (mouse - 0.5) * 1000.0;
          float mouseDistance = distance(mouseWorld, pos.xy);
          float mouseEffect = smoothstep(200.0, 0.0, mouseDistance);
          
          // Push away from mouse
          if (mouseEffect > 0.0) {
            vec2 direction = normalize(pos.xy - mouseWorld);
            pos.xy += direction * mouseEffect * 60.0;
          }
          
          // Subtle parallax with scroll
          float depth = (position.z + 200.0) / 400.0; // 0 to 1
          pos.y -= scroll * 0.2 * depth;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + mouseEffect);
          
          vAlpha = 0.8 - depth * 0.3 + mouseEffect * 0.4;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, dist);
          float glow = 1.0 - smoothstep(0.0, 0.7, dist);
          
          vec3 finalColor = vColor;
          float finalAlpha = (strength * 0.8 + glow * 0.2) * vAlpha;
          
          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;
  }, [isMobile]);

  // Create floating geometric shapes
  const createGeometries = useCallback((scene: THREE.Scene) => {
    const shapes = [];
    const shapeCount = isMobile ? 8 : 12;

    for (let i = 0; i < shapeCount; i++) {
      let geometry: THREE.BufferGeometry;
      
      // Different geometric shapes
      const shapeType = i % 3;
      if (shapeType === 0) {
        geometry = new THREE.BoxGeometry(30, 30, 30);
      } else if (shapeType === 1) {
        geometry = new THREE.SphereGeometry(20, 16, 12);
      } else {
        geometry = new THREE.ConeGeometry(15, 40, 6);
      }

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.52 + Math.random() * 0.1, 0.7, 0.5),
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 300
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Store animation data
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        originalY: mesh.position.y
      };

      scene.add(mesh);
      shapes.push(mesh);
    }

    geometriesRef.current = shapes;
  }, [isMobile]);

  // Create floating letters
  const createLetters = useCallback((scene: THREE.Scene) => {
    const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
    const letterMeshes: THREE.Mesh[] = [];

    // Create text texture
    const createTextTexture = (text: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 256;

      // Clear canvas
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, 256, 256);

      // Draw text with glow
      ctx.fillStyle = '#64ffda';
      ctx.font = 'bold 140px Inter, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#64ffda';
      ctx.shadowBlur = 20;
      ctx.fillText(text, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    letters.forEach((letter, index) => {
      const geometry = new THREE.PlaneGeometry(60, 60);
      const material = new THREE.MeshBasicMaterial({
        map: createTextTexture(letter),
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Arrange in a circle
      const angle = (index / letters.length) * Math.PI * 2;
      const radius = isMobile ? 150 : 200;
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 100
      );

      // Store animation data
      mesh.userData = {
        originalPos: mesh.position.clone(),
        floatOffset: index * 1.2,
        angle: angle
      };

      scene.add(mesh);
      letterMeshes.push(mesh);
    });

    lettersRef.current = letterMeshes;
  }, [isMobile]);

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !isInitialized) {
      return;
    }

    try {
      const time = Date.now() * 0.001;
      const mouse = {
        x: mouseRef.current.x / window.innerWidth,
        y: 1 - mouseRef.current.y / window.innerHeight
      };

    // Update particles
    if (particlesRef.current?.material) {
      const material = particlesRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = time;
      material.uniforms.mouse.value.set(mouse.x, mouse.y);
      material.uniforms.scroll.value = scrollRef.current;
    }

    // Animate geometric shapes
    geometriesRef.current.forEach((shape, idx) => {
      // Rotation
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.rotation.z += shape.userData.rotationSpeed.z;

      // Floating motion
      const floatY = Math.sin(time * shape.userData.floatSpeed + idx) * 30;
      shape.position.y = shape.userData.originalY + floatY;

      // Mouse interaction
      const mouseWorldX = (mouse.x - 0.5) * 1000;
      const mouseWorldY = (mouse.y - 0.5) * 800;
      const distance = Math.sqrt(
        Math.pow(shape.position.x - mouseWorldX, 2) +
        Math.pow(shape.position.y - mouseWorldY, 2)
      );

      if (distance < 150) {
        const force = (150 - distance) / 150;
        const dirX = (shape.position.x - mouseWorldX) / distance;
        const dirY = (shape.position.y - mouseWorldY) / distance;
        shape.position.x += dirX * force * 40;
        shape.position.y += dirY * force * 40;
      }
    });

    // Animate letters
    lettersRef.current.forEach((letter) => {
      const data = letter.userData;
      
      // Gentle floating
      const floatX = Math.cos(time * 0.5 + data.floatOffset) * 40;
      const floatY = Math.sin(time * 0.3 + data.floatOffset) * 30;
      const floatZ = Math.sin(time * 0.4 + data.floatOffset) * 20;
      
      letter.position.x = data.originalPos.x + floatX;
      letter.position.y = data.originalPos.y + floatY;
      letter.position.z = data.originalPos.z + floatZ;

      // Subtle rotation
      letter.rotation.z = Math.sin(time * 0.2 + data.floatOffset) * 0.3;

      // Mouse interaction
      const mouseWorldX = (mouse.x - 0.5) * 800;
      const mouseWorldY = (mouse.y - 0.5) * 600;
      const distance = Math.sqrt(
        Math.pow(letter.position.x - mouseWorldX, 2) +
        Math.pow(letter.position.y - mouseWorldY, 2)
      );

      if (distance < 100) {
        const force = (100 - distance) / 100;
        const dirX = (letter.position.x - mouseWorldX) / distance;
        const dirY = (letter.position.y - mouseWorldY) / distance;
        letter.position.x += dirX * force * 50;
        letter.position.y += dirY * force * 50;
      }
    });

    // Camera gentle movement
    const targetX = (mouse.x - 0.5) * 100;
    const targetY = (mouse.y - 0.5) * 50;
    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
    
    // Subtle parallax with scroll
    cameraRef.current.position.z = 400 + Math.sin(scrollRef.current * 0.001) * 20;
    
    cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Animation error:', error);
      // Stop animation on error
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = undefined;
      }
    }
  }, []);

  // Initialize Three.js
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || isInitialized || !isActive) return;

    console.log('🚀 Initializing Modern Three.js Background...');

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);

      camera.position.z = 400;

      mountRef.current.appendChild(renderer.domElement);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      // Create all elements
      createParticleSystem(scene);
      createGeometries(scene);
      createLetters(scene);

      setIsInitialized(true);
      
      // Start animation after everything is set up
      const startAnimation = () => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

        const animateLoop = () => {
          if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
            return;
          }

          try {
            const time = Date.now() * 0.001;
            const mouse = {
              x: mouseRef.current.x / window.innerWidth,
              y: 1 - mouseRef.current.y / window.innerHeight
            };

            // Update particles
            if (particlesRef.current?.material) {
              const material = particlesRef.current.material as THREE.ShaderMaterial;
              material.uniforms.time.value = time;
              material.uniforms.mouse.value.set(mouse.x, mouse.y);
              material.uniforms.scroll.value = scrollRef.current;
            }

            // Animate geometric shapes
            geometriesRef.current.forEach((shape, idx) => {
              // Rotation
              shape.rotation.x += shape.userData.rotationSpeed.x;
              shape.rotation.y += shape.userData.rotationSpeed.y;
              shape.rotation.z += shape.userData.rotationSpeed.z;

              // Floating motion
              const floatY = Math.sin(time * shape.userData.floatSpeed + idx) * 30;
              shape.position.y = shape.userData.originalY + floatY;

              // Mouse interaction
              const mouseWorldX = (mouse.x - 0.5) * 1000;
              const mouseWorldY = (mouse.y - 0.5) * 800;
              const distance = Math.sqrt(
                Math.pow(shape.position.x - mouseWorldX, 2) +
                Math.pow(shape.position.y - mouseWorldY, 2)
              );

              if (distance < 150) {
                const force = (150 - distance) / 150;
                const dirX = (shape.position.x - mouseWorldX) / distance;
                const dirY = (shape.position.y - mouseWorldY) / distance;
                shape.position.x += dirX * force * 40;
                shape.position.y += dirY * force * 40;
              }
            });

            // Animate letters
            lettersRef.current.forEach((letter) => {
              const data = letter.userData;
              
              // Gentle floating
              const floatX = Math.cos(time * 0.5 + data.floatOffset) * 40;
              const floatY = Math.sin(time * 0.3 + data.floatOffset) * 30;
              const floatZ = Math.sin(time * 0.4 + data.floatOffset) * 20;
              
              letter.position.x = data.originalPos.x + floatX;
              letter.position.y = data.originalPos.y + floatY;
              letter.position.z = data.originalPos.z + floatZ;

              // Subtle rotation
              letter.rotation.z = Math.sin(time * 0.2 + data.floatOffset) * 0.3;

              // Mouse interaction
              const mouseWorldX = (mouse.x - 0.5) * 800;
              const mouseWorldY = (mouse.y - 0.5) * 600;
              const distance = Math.sqrt(
                Math.pow(letter.position.x - mouseWorldX, 2) +
                Math.pow(letter.position.y - mouseWorldY, 2)
              );

              if (distance < 100) {
                const force = (100 - distance) / 100;
                const dirX = (letter.position.x - mouseWorldX) / distance;
                const dirY = (letter.position.y - mouseWorldY) / distance;
                letter.position.x += dirX * force * 50;
                letter.position.y += dirY * force * 50;
              }
            });

            // Camera gentle movement
            const targetX = (mouse.x - 0.5) * 100;
            const targetY = (mouse.y - 0.5) * 50;
            cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
            cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
            
            // Subtle parallax with scroll
            cameraRef.current.position.z = 400 + Math.sin(scrollRef.current * 0.001) * 20;
            
            cameraRef.current.lookAt(0, 0, 0);

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            frameIdRef.current = requestAnimationFrame(animateLoop);
          } catch (error) {
            console.error('Animation error:', error);
            if (frameIdRef.current) {
              cancelAnimationFrame(frameIdRef.current);
              frameIdRef.current = undefined;
            }
          }
        };

        animateLoop();
      };

      startAnimation();

      console.log('✅ Modern Three.js Background Ready!');
    } catch (error) {
      console.error('❌ Three.js initialization failed:', error);
      setIsInitialized(false);
    }
  }, [isMobile, isInitialized, isActive, createParticleSystem, createGeometries, createLetters]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }

    if (rendererRef.current && mountRef.current) {
      // Safely remove DOM element
      try {
        if (rendererRef.current.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      } catch (error) {
        console.warn('DOM cleanup warning:', error);
      }
      rendererRef.current.dispose();
    }

    // Dispose all materials and geometries
    geometriesRef.current.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        (mesh.material as THREE.Material).dispose();
      }
    });

    lettersRef.current.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        const material = mesh.material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose(); // Dispose texture
        material.dispose();
      }
    });

    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        (particlesRef.current.material as THREE.ShaderMaterial).dispose();
      }
    }

    // Clear arrays
    geometriesRef.current = [];
    lettersRef.current = [];
    particlesRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;

    setIsInitialized(false);
  }, []);

  // Main effect
  useEffect(() => {
    if (isActive && !isInitialized) {
      const timer = setTimeout(() => {
        initThreeJS();
      }, 100); // Small delay to ensure DOM is ready

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isActive, isInitialized, initThreeJS]);

  // Separate effect for resize and cleanup
  useEffect(() => {
    if (isInitialized) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isInitialized) {
        cleanup();
      }
    };
  }, [isInitialized, handleResize, cleanup]);

  if (!isActive) return null;

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedBackground;