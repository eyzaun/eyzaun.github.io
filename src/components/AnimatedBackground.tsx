import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

interface PerformanceMetrics {
  fps: number;
  quality: 'high' | 'medium' | 'low';
  adaptiveMode: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  mouseX, 
  mouseY, 
  isActive 
}) => {
  // Core Three.js refs
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Scene objects
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const lettersRef = useRef<THREE.Mesh[]>([]);
  const connectionLinesRef = useRef<THREE.LineSegments | null>(null);
  
  // Animation and performance
  const frameIdRef = useRef<number | undefined>();
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const performanceRef = useRef<PerformanceMetrics>({
    fps: 60,
    quality: 'high',
    adaptiveMode: true
  });
  
  // Input tracking
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<number>(0);
  const touchRef = useRef({ x: 0, y: 0, active: false });
  
  // State
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [currentQuality, setCurrentQuality] = useState<'high' | 'medium' | 'low'>('high');

  // Quality settings based on performance
  const qualitySettings = {
    high: { particles: 120, shapes: 12, letters: 6, connectionLines: true },
    medium: { particles: 80, shapes: 8, letters: 6, connectionLines: true },
    low: { particles: 40, shapes: 6, letters: 6, connectionLines: false }
  };

  // === DEVICE DETECTION AND SETUP ===
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
      
      // Set initial quality based on device
      if (mobile) {
        setCurrentQuality('medium');
        performanceRef.current.quality = 'medium';
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // === INPUT TRACKING ===
  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true
        };
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && touchRef.current.active) {
        touchRef.current.x = e.touches[0].clientX;
        touchRef.current.y = e.touches[0].clientY;
      }
    };
    
    const handleTouchEnd = () => {
      touchRef.current.active = false;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // === BOUNDARY MANAGEMENT ===
  const getBoundaries = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      x: width * 0.6,
      y: height * 0.6,
      z: 200
    };
  }, []);

  const constrainPosition = useCallback((position: THREE.Vector3, boundaries: any) => {
    position.x = Math.max(-boundaries.x, Math.min(boundaries.x, position.x));
    position.y = Math.max(-boundaries.y, Math.min(boundaries.y, position.y));
    position.z = Math.max(-boundaries.z, Math.min(boundaries.z, position.z));
    return position;
  }, []);

  // === PERFORMANCE MONITORING ===
  const updatePerformanceMetrics = useCallback((deltaTime: number) => {
    frameCountRef.current++;
    
    if (frameCountRef.current % 60 === 0) { // Check every 60 frames
      const fps = Math.round(1000 / deltaTime);
      performanceRef.current.fps = fps;
      
      // Adaptive quality based on FPS
      if (performanceRef.current.adaptiveMode) {
        if (fps < 30 && currentQuality !== 'low') {
          setCurrentQuality('low');
          console.log('📉 Quality reduced to LOW (FPS:', fps, ')');
        } else if (fps < 45 && currentQuality === 'high') {
          setCurrentQuality('medium');
          console.log('📉 Quality reduced to MEDIUM (FPS:', fps, ')');
        } else if (fps > 55 && currentQuality !== 'high') {
          setCurrentQuality('high');
          console.log('📈 Quality increased to HIGH (FPS:', fps, ')');
        }
      }
    }
  }, [currentQuality]);

  // === TEXT TEXTURE CREATION ===
  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 256;

    // Clear with transparency
    ctx.clearRect(0, 0, 256, 256);

    // Text styling
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 140px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Glow effect
    ctx.shadowColor = '#64ffda';
    ctx.shadowBlur = 25;
    ctx.fillText(text, 128, 128);
    
    // Second pass for stronger glow
    ctx.shadowBlur = 10;
    ctx.fillText(text, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // === PARTICLE SYSTEM ===
  const createParticleSystem = useCallback((scene: THREE.Scene) => {
    const settings = qualitySettings[currentQuality];
    const count = isMobile ? Math.floor(settings.particles * 0.7) : settings.particles;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const boundaries = getBoundaries();

    for (let i = 0; i < count; i++) {
      // Initial positions within boundaries
      positions[i * 3] = (Math.random() - 0.5) * boundaries.x * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boundaries.y * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * boundaries.z;

      // Color variations (green theme)
      const hue = 0.48 + Math.random() * 0.15;
      const saturation = 0.7 + Math.random() * 0.2;
      const lightness = 0.5 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size and velocity
      sizes[i] = Math.random() * 6 + 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uTouch: { value: new THREE.Vector3() },
        uScroll: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec3 uTouch;
        uniform float uScroll;
        uniform float uPixelRatio;
        
        attribute float size;
        attribute vec3 velocity;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Wave motion
          pos.x += sin(uTime * 0.8 + position.y * 0.01) * 25.0;
          pos.y += cos(uTime * 0.6 + position.x * 0.01) * 20.0;
          pos.z += sin(uTime * 0.4 + position.x * 0.005) * 15.0;
          
          // Boundary wrapping
          if (pos.x > 800.0) pos.x = -800.0;
          if (pos.x < -800.0) pos.x = 800.0;
          if (pos.y > 600.0) pos.y = -600.0;
          if (pos.y < -600.0) pos.y = 600.0;
          
          // Mouse/Touch interaction
          vec2 inputPos = uTouch.z > 0.5 ? uTouch.xy : uMouse;
          vec2 inputWorld = (inputPos - 0.5) * vec2(1600.0, 1200.0);
          float inputDistance = distance(inputWorld, pos.xy);
          float inputInfluence = smoothstep(250.0, 0.0, inputDistance);
          
          if (inputInfluence > 0.0) {
            vec2 direction = normalize(pos.xy - inputWorld);
            pos.xy += direction * inputInfluence * 80.0;
          }
          
          // Scroll parallax
          float depth = (position.z + 100.0) / 200.0;
          pos.y -= uScroll * 0.3 * depth;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size and alpha
          float distanceSize = 400.0 / -mvPosition.z;
          gl_PointSize = size * distanceSize * (1.0 + inputInfluence * 2.0) * uPixelRatio;
          vAlpha = smoothstep(0.0, 0.5, size / 8.0) * (0.7 + inputInfluence * 0.5);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, dist);
          float glow = 1.0 - smoothstep(0.0, 0.8, dist);
          
          vec3 finalColor = vColor;
          float finalAlpha = (strength * 0.9 + glow * 0.3) * vAlpha;
          
          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;
  }, [currentQuality, isMobile, getBoundaries]);

  // === CONNECTION LINES ===
  const createConnectionLines = useCallback((scene: THREE.Scene) => {
    if (!qualitySettings[currentQuality].connectionLines || !particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    const particleCount = positions.length / 3;
    
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxConnections = isMobile ? 200 : 400;
    let connectionCount = 0;

    for (let i = 0; i < particleCount && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < particleCount && connectionCount < maxConnections; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 150) {
          // Line positions
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
          
          // Line colors with distance-based alpha
          const alpha = (1.0 - distance / 150) * 0.4;
          lineColors.push(
            colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2], alpha,
            colors[j * 3], colors[j * 3 + 1], colors[j * 3 + 2], alpha
          );
          
          connectionCount++;
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
      connectionLinesRef.current = lines;
    }
  }, [currentQuality, isMobile]);

  // === GEOMETRIC SHAPES ===
  const createGeometricShapes = useCallback((scene: THREE.Scene) => {
    const settings = qualitySettings[currentQuality];
    const shapeCount = isMobile ? Math.floor(settings.shapes * 0.8) : settings.shapes;
    const shapes: THREE.Mesh[] = [];
    const boundaries = getBoundaries();

    for (let i = 0; i < shapeCount; i++) {
      let geometry: THREE.BufferGeometry;
      
      const shapeType = i % 3;
      switch (shapeType) {
        case 0:
          geometry = new THREE.BoxGeometry(25, 25, 25);
          break;
        case 1:
          geometry = new THREE.SphereGeometry(15, 12, 8);
          break;
        default:
          geometry = new THREE.ConeGeometry(12, 35, 6);
      }

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.1, 0.8, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Position within boundaries
      mesh.position.set(
        (Math.random() - 0.5) * boundaries.x,
        (Math.random() - 0.5) * boundaries.y,
        (Math.random() - 0.5) * boundaries.z
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Animation data
      mesh.userData = {
        originalPos: mesh.position.clone(),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        floatSpeed: Math.random() * 0.8 + 0.4,
        floatRange: Math.random() * 40 + 20
      };

      scene.add(mesh);
      shapes.push(mesh);
    }

    geometriesRef.current = shapes;
  }, [currentQuality, isMobile, getBoundaries]);

  // === LETTER SYSTEM ===
  const createLetterSystem = useCallback((scene: THREE.Scene) => {
    const letters = ['E', 'Y', 'Z', 'A', 'U', 'N'];
    const letterMeshes: THREE.Mesh[] = [];
    const boundaries = getBoundaries();

    letters.forEach((letter, index) => {
      const geometry = new THREE.PlaneGeometry(50, 50);
      const material = new THREE.MeshBasicMaterial({
        map: createTextTexture(letter),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Arrange in circle pattern
      const angle = (index / letters.length) * Math.PI * 2;
      const radius = Math.min(boundaries.x * 0.6, 250);
      
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 100
      );

      mesh.userData = {
        originalPos: mesh.position.clone(),
        angle: angle,
        floatOffset: index * 1.5,
        letter: letter
      };

      scene.add(mesh);
      letterMeshes.push(mesh);
    });

    lettersRef.current = letterMeshes;
  }, [createTextTexture, getBoundaries]);

  // === MAIN ANIMATION LOOP ===
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !isInitialized) {
      return;
    }

    try {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      
      // Performance monitoring
      updatePerformanceMetrics(deltaTime);
      
      const time = currentTime * 0.001;
      const boundaries = getBoundaries();

      // Get input position (mouse or touch)
      const inputX = touchRef.current.active ? touchRef.current.x : mouseRef.current.x;
      const inputY = touchRef.current.active ? touchRef.current.y : mouseRef.current.y;
      const inputNormalized = {
        x: inputX / window.innerWidth,
        y: 1 - inputY / window.innerHeight
      };

      // Update particles
      if (particlesRef.current?.material) {
        const material = particlesRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = time;
        material.uniforms.uMouse.value.set(inputNormalized.x, inputNormalized.y);
        material.uniforms.uTouch.value.set(
          inputNormalized.x,
          inputNormalized.y,
          touchRef.current.active ? 1.0 : 0.0
        );
        material.uniforms.uScroll.value = scrollRef.current;
      }

      // Animate geometric shapes
      geometriesRef.current.forEach((shape) => {
        const data = shape.userData;
        
        // Rotation
        shape.rotation.x += data.rotationSpeed.x;
        shape.rotation.y += data.rotationSpeed.y;
        shape.rotation.z += data.rotationSpeed.z;

        // Floating motion
        const floatY = Math.sin(time * data.floatSpeed) * data.floatRange;
        shape.position.y = data.originalPos.y + floatY;

        // Boundary constraints
        constrainPosition(shape.position, boundaries);

        // Input interaction
        const inputWorldX = (inputNormalized.x - 0.5) * boundaries.x * 2;
        const inputWorldY = (inputNormalized.y - 0.5) * boundaries.y * 2;
        const distance = Math.sqrt(
          Math.pow(shape.position.x - inputWorldX, 2) +
          Math.pow(shape.position.y - inputWorldY, 2)
        );

        if (distance < 120) {
          const force = (120 - distance) / 120;
          const direction = new THREE.Vector3()
            .subVectors(shape.position, new THREE.Vector3(inputWorldX, inputWorldY, shape.position.z))
            .normalize();
          shape.position.add(direction.multiplyScalar(force * 30));
        }
      });

      // Animate letters
      lettersRef.current.forEach((letter) => {
        const data = letter.userData;
        
        // Floating motion
        const floatX = Math.cos(time * 0.5 + data.floatOffset) * 30;
        const floatY = Math.sin(time * 0.3 + data.floatOffset) * 25;
        const floatZ = Math.sin(time * 0.4 + data.floatOffset) * 15;
        
        letter.position.x = data.originalPos.x + floatX;
        letter.position.y = data.originalPos.y + floatY;
        letter.position.z = data.originalPos.z + floatZ;

        // Rotation
        letter.rotation.z = Math.sin(time * 0.2 + data.floatOffset) * 0.2;

        // Boundary constraints
        constrainPosition(letter.position, boundaries);

        // Input interaction
        const inputWorldX = (inputNormalized.x - 0.5) * boundaries.x * 2;
        const inputWorldY = (inputNormalized.y - 0.5) * boundaries.y * 2;
        const distance = Math.sqrt(
          Math.pow(letter.position.x - inputWorldX, 2) +
          Math.pow(letter.position.y - inputWorldY, 2)
        );

        if (distance < 100) {
          const force = (100 - distance) / 100;
          const direction = new THREE.Vector3()
            .subVectors(letter.position, new THREE.Vector3(inputWorldX, inputWorldY, letter.position.z))
            .normalize();
          letter.position.add(direction.multiplyScalar(force * 40));
        }
      });

      // Camera movement
      const targetX = (inputNormalized.x - 0.5) * 80;
      const targetY = (inputNormalized.y - 0.5) * 40;
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.025;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.025;
      cameraRef.current.position.z = 400 + Math.sin(scrollRef.current * 0.001) * 25;
      
      cameraRef.current.lookAt(0, 0, 0);

      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);

    } catch (error) {
      console.error('Animation error:', error);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = undefined;
      }
    }
  }, [isInitialized, updatePerformanceMetrics, getBoundaries, constrainPosition]);

  // === INITIALIZATION ===
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || isInitialized || !isActive || isMobile && !touchRef.current) return;

    console.log('🚀 Initializing Enhanced Three.js Background...');
    console.log('📊 Quality:', currentQuality, '| Mobile:', isMobile);

    try {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: currentQuality === 'high',
        powerPreference: currentQuality === 'low' ? 'low-power' : 'high-performance'
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(
        window.devicePixelRatio, 
        currentQuality === 'high' ? 2 : currentQuality === 'medium' ? 1.5 : 1
      ));
      renderer.setClearColor(0x000000, 0);

      camera.position.z = 400;
      mountRef.current.appendChild(renderer.domElement);

      // Store references
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      // Create all systems
      createParticleSystem(scene);
      createGeometricShapes(scene);
      createLetterSystem(scene);
      
      // Create connection lines after particles are ready
      setTimeout(() => {
        createConnectionLines(scene);
      }, 100);

      setIsInitialized(true);
      lastFrameTimeRef.current = performance.now();
      
      console.log('✅ Three.js Enhanced Background Ready!');
      console.log('🎯 Features: Particles, Shapes, Letters, Lines, Touch, Performance Monitor');

    } catch (error) {
      console.error('❌ Three.js initialization failed:', error);
      setIsInitialized(false);
    }
  }, [isActive, isInitialized, isMobile, currentQuality, createParticleSystem, createGeometricShapes, createLetterSystem, createConnectionLines]);

  // === RESIZE HANDLER ===
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // === CLEANUP ===
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up Three.js resources...');
    
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }

    // Dispose particles
    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        (particlesRef.current.material as THREE.ShaderMaterial).dispose();
      }
    }

    // Dispose shapes
    geometriesRef.current.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) (mesh.material as THREE.Material).dispose();
    });

    // Dispose letters
    lettersRef.current.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        const material = mesh.material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      }
    });

    // Dispose connection lines
    if (connectionLinesRef.current) {
      if (connectionLinesRef.current.geometry) connectionLinesRef.current.geometry.dispose();
      if (connectionLinesRef.current.material) {
        (connectionLinesRef.current.material as THREE.Material).dispose();
      }
    }

    // Dispose renderer
    if (rendererRef.current && mountRef.current) {
      try {
        if (rendererRef.current.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      } catch (error) {
        console.warn('DOM cleanup warning:', error);
      }
      rendererRef.current.dispose();
    }

    // Clear references
    particlesRef.current = null;
    geometriesRef.current = [];
    lettersRef.current = [];
    connectionLinesRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;

    setIsInitialized(false);
  }, []);

  // === EFFECTS ===
  useEffect(() => {
    if (isActive && !isInitialized) {
      const timer = setTimeout(initThreeJS, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, isInitialized, initThreeJS]);

  useEffect(() => {
    if (isInitialized) {
      animate();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isInitialized) cleanup();
    };
  }, [isInitialized, animate, handleResize, cleanup]);

  // Quality change effect
  useEffect(() => {
    if (isInitialized) {
      console.log('🔄 Quality changed to:', currentQuality);
      // Recreate systems with new quality settings
      cleanup();
      setTimeout(() => {
        initThreeJS();
      }, 100);
    }
  }, [currentQuality]);

  if (!isActive) return null;

  return (
    <>
      <div 
        ref={mountRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />
      {/* Performance indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/50 text-green-400 p-2 rounded text-xs font-mono z-50">
          FPS: {performanceRef.current.fps} | Quality: {currentQuality}
        </div>
      )}
    </>
  );
};

export default AnimatedBackground;