import React, { useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

const CustomCursor: React.FC = () => {
  const { cursor, isActive } = useCursor();

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
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999] will-change-transform"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: `translate(-50%, -50%) scale(${cursor.isClicking ? 0.8 : 1})`,
          transition: cursor.isClicking ? 'transform 0.1s ease-out' : 'transform 0.2s ease-out'
        }}
      >
        <div
          className={`
            rounded-full border-2 transition-all duration-300 ease-out
            ${cursor.isHovering 
              ? 'w-8 h-8 border-green-400 bg-green-400/20 shadow-lg shadow-green-400/30' 
              : 'w-2 h-2 border-green-400 bg-green-400'
            }
          `}
        />
      </div>

      {/* Outer ring for hover state */}
      {cursor.isHovering && (
        <div
          className="fixed pointer-events-none z-[9998] will-change-transform"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-12 h-12 rounded-full border border-green-400/40 animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(CustomCursor);
