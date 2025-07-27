import { useState, useEffect, useCallback, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isHovering: boolean;
  isClicking: boolean;
}

export const useCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovering: false,
    isClicking: false
  });

  const [isMobile, setIsMobile] = useState(false);
  const animationIdRef = useRef<number | null>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth cursor animation
  const animateCursor = useCallback(() => {
    setCursor(prev => {
      const lerpFactor = 0.15;
      const newX = prev.x + (prev.targetX - prev.x) * lerpFactor;
      const newY = prev.y + (prev.targetY - prev.y) * lerpFactor;
      
      return {
        ...prev,
        x: newX,
        y: newY
      };
    });

    animationIdRef.current = requestAnimationFrame(animateCursor);
  }, []);

  // Update cursor target position
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setCursor(prev => ({
      ...prev,
      targetX: e.clientX,
      targetY: e.clientY
    }));
  }, []);

  // Handle hover states
  const handleMouseEnter = useCallback(() => {
    setCursor(prev => ({ ...prev, isHovering: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursor(prev => ({ ...prev, isHovering: false }));
  }, []);

  // Handle click states
  const handleMouseDown = useCallback(() => {
    setCursor(prev => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursor(prev => ({ ...prev, isClicking: false }));
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Start smooth animation
    animateCursor();

    // Add global mouse move listener
    document.addEventListener('mousemove', updateCursorPosition, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, .cursor-hover'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isMobile, animateCursor, updateCursorPosition, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  return {
    cursor,
    isMobile,
    isActive: !isMobile
  };
};
