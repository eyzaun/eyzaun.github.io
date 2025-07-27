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
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const frameIdRef = useRef<number | undefined>();
  const isInitializedRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up Three.js resources...');
    
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }

    // Dispose all geometries and materials
    if (particlesRef.current) {
      if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
      if (particlesRef.current.material) {
        if (Array.isArray(particlesRef.current.material)) {
          particlesRef.current.material.forEach(mat => mat.dispose());
        } else {
          (particlesRef.current.material as THREE.Material).dispose();
        }
      }
    }

    if (linesRef.current) {
      if (linesRef.current.geometry) linesRef.current.geometry.dispose();
      if (linesRef.current.material) (linesRef.current.material as THREE.Material).dispose();
    }

    geometriesRef.current.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose());
        } else {
          (mesh.material as THREE.Material).dispose();
        }
      }
    });

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
    geometriesRef.current = [];
    isInitializedRef.current = false;
  }, []);

  // Initialize Three.js
  const initThreeJS = useCallback(() => {
    if (!mountRef.current || !isActive || isMobile || isInitializedRef.current) {
      return;
    }

    console.log('Initializing Enhanced Three.js Background...');
    
    try {
      const container = mountRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
      camera.position.z = 300;
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // === PARTICLES SYSTEM ===
      const particleCount = 200; // Daha fazla particle
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * width * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * height * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

        // Colors - Site theme colors
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

        // Size - Daha büyük particle'lar
        sizes[i] = Math.random() * 8 + 3; // 3-11 arasında

        // Velocity
        velocities[i * 3] = (Math.random() - 0.5) * 0.5;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
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
            
            // Mouse repulsion/attraction
            vec2 mouseDirection = normalize(modelPosition.xy - mousePos * 500.0);
            modelPosition.xy += mouseDirection * mouseInfluence * 80.0;
            
            // Scroll parallax
            modelPosition.y += uScrollY * 0.3;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size based on distance and mouse interaction
            float baseSize = size * (400.0 / -viewPosition.z); // Daha büyük base size
            gl_PointSize = baseSize * (1.5 + mouseInfluence * 3.0) * uPixelRatio; // Daha büyük multiplier
            
            // Alpha based on distance and mouse - Daha parlak
            vAlpha = smoothstep(0.0, 0.5, size / 8.0) * (0.8 + mouseInfluence * 0.6);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            // Soft glow effect
            float glow = 1.0 - smoothstep(0.0, 0.8, distanceToCenter);
            
            vec3 finalColor = vColor;
            float finalAlpha = strength * vAlpha * 1.2 + glow * vAlpha * 0.4; // Daha parlak
            
            gl_FragColor = vec4(finalColor, finalAlpha);
          }
        `
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // === FLOATING GEOMETRIES ===
      const geometryCount = 20; // Daha fazla geometri
      const geometries: THREE.Mesh[] = [];

      for (let i = 0; i < geometryCount; i++) {
        let geometry: THREE.BufferGeometry;
        const shapeType = Math.random();
        
        if (shapeType < 0.33) {
          // Triangle - Daha büyük
          geometry = new THREE.ConeGeometry(8 + Math.random() * 15, 15 + Math.random() * 25, 3);
        } else if (shapeType < 0.66) {
          // Cube - Daha büyük
          geometry = new THREE.BoxGeometry(12 + Math.random() * 18, 12 + Math.random() * 18, 12 + Math.random() * 18);
        } else {
          // Sphere - Daha büyük
          geometry = new THREE.SphereGeometry(6 + Math.random() * 12, 8, 6);
        }

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + Math.random() * 0.15, 0.8, 0.7),
          transparent: true,
          opacity: 0.15 + Math.random() * 0.25, // Daha parlak
          wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * width * 1.5,
          (Math.random() - 0.5) * height * 1.5,
          (Math.random() - 0.5) * 300
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        scene.add(mesh);
        geometries.push(mesh);
      }
      geometriesRef.current = geometries;

      // === CONNECTION LINES ===
      const createConnectionLines = () => {
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const distance = new THREE.Vector3(
              positions[i * 3] - positions[j * 3],
              positions[i * 3 + 1] - positions[j * 3 + 1],
              positions[i * 3 + 2] - positions[j * 3 + 2]
            ).length();

            if (distance < 150) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
              
              // Line color - green theme
              const alpha = 1.0 - (distance / 150);
              lineColors.push(0.39, 1.0, 0.85, alpha);
              lineColors.push(0.39, 1.0, 0.85, alpha);
            }
          }
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

        const lineMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.5, // Daha parlak çizgiler
          blending: THREE.AdditiveBlending
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);
        linesRef.current = lines;
      };

      createConnectionLines();
      isInitializedRef.current = true;
      console.log('Enhanced Three.js initialized successfully');

    } catch (error) {
      console.error('Three.js initialization error:', error);
      cleanup();
    }
  }, [isActive, isMobile, cleanup]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    try {
      const time = Date.now() * 0.001;
      
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

      // Animate floating geometries
      geometriesRef.current.forEach((mesh, index) => {
        mesh.rotation.x += 0.005 + index * 0.001;
        mesh.rotation.y += 0.008 + index * 0.0015;
        mesh.rotation.z += 0.003 + index * 0.0008;
        
        // Floating motion
        mesh.position.y += Math.sin(time * 0.5 + index) * 0.5;
        mesh.position.x += Math.cos(time * 0.3 + index) * 0.3;
      });

      // Camera movement based on mouse and scroll
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
        zIndex: 5, // Biraz artırdım ama content'in altında
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

export default AnimatedBackground;