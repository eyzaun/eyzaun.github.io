import { useState, useEffect, useCallback, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
}

export const useCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false
  });

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const rafId = useRef<number | undefined>();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      setCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    });
  }, []);

  // Check if element is interactive
  const isInteractiveElement = useCallback((element: Element | null): boolean => {
    if (!element) return false;
    
    const interactiveSelectors = [
      'a', 'button', 'input', 'textarea', 'select', 'label',
      '[role="button"]', '[role="link"]', '[tabindex]',
      '.cursor-hover', '.clickable'
    ];
    
    return interactiveSelectors.some(selector => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch {
        return false;
      }
    });
  }, []);

  // Mouse over handler with event delegation
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    const isInteractive = isInteractiveElement(target);
    
    setCursor(prev => ({
      ...prev,
      isHovering: isInteractive
    }));
  }, [isInteractiveElement]);

  // Mouse down handler
  const handleMouseDown = useCallback(() => {
    setCursor(prev => ({ ...prev, isClicking: true }));
  }, []);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setCursor(prev => ({ ...prev, isClicking: false }));
  }, []);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setCursor(prev => ({ ...prev, isHovering: false }));
  }, []);

  // Touch handlers for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        setCursor(prev => ({
          ...prev,
          x: touch.clientX,
          y: touch.clientY
        }));
      });
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setCursor(prev => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        isClicking: true
      }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setCursor(prev => ({ ...prev, isClicking: false }));
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Add touch event listeners for mobile
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }

        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    } else {
      // Add mouse event listeners for desktop
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseover', handleMouseOver, { passive: true });
      document.addEventListener('mousedown', handleMouseDown, { passive: true });
      document.addEventListener('mouseup', handleMouseUp, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isMobile, handleMouseMove, handleMouseOver, handleMouseDown, handleMouseUp, handleMouseLeave, handleTouchMove, handleTouchStart, handleTouchEnd]);

  return {
    cursor,
    isActive: true // Mobile'da da Three.js aktif olsun
  };
};