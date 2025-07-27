import React, { useEffect, useMemo } from 'react';
import { useCursor } from '../hooks/useCursor';

const CustomCursor: React.FC = () => {
  const { cursor, isActive } = useCursor();

  // Memoize cursor styles for performance
  const cursorStyle = useMemo(() => ({
    left: cursor.x - (cursor.isHovering ? 12 : 3),
    top: cursor.y - (cursor.isHovering ? 12 : 3),
    transform: `scale(${cursor.isClicking ? 0.75 : 1})`,
  }), [cursor.x, cursor.y, cursor.isHovering, cursor.isClicking]);

  const trailStyle = useMemo(() => ({
    left: cursor.x - 16,
    top: cursor.y - 16,
  }), [cursor.x, cursor.y]);

  // Add global cursor styles
  useEffect(() => {
    if (!isActive) return;

    // Hide default cursor
    const style = document.createElement('style');
    style.id = 'custom-cursor-styles';
    style.textContent = `
      @media (hover: hover) and (pointer: fine) {
        *, *::before, *::after {
          cursor: none !important;
        }
        
        a, button, [role="button"], input, textarea, select, .cursor-hover {
          cursor: none !important;
        }
      }
    `;
    
    if (!document.getElementById('custom-cursor-styles')) {
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('custom-cursor-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={cursorStyle}
      >
        <div
          className={`
            rounded-full border-2 border-green-400 transition-all duration-200 ease-out will-change-transform
            ${cursor.isHovering 
              ? 'w-6 h-6 bg-green-400/10 shadow-lg shadow-green-400/25' 
              : 'w-1.5 h-1.5 bg-green-400'
            }
          `}
        />
      </div>

      {/* Trailing effect for hover state */}
      {cursor.isHovering && (
        <div
          className="fixed pointer-events-none z-[9998] mix-blend-difference will-change-transform"
          style={trailStyle}
        >
          <div className="w-8 h-8 rounded-full border border-green-400/20 animate-pulse" />
        </div>
      )}
    </>
  );
};

export default React.memo(CustomCursor);
