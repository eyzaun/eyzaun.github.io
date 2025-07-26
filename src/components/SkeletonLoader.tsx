import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  variant = 'rectangular'
}) => {
  const baseClasses = 'bg-slate-700/50 animate-pulse';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton 
        key={i}
        height="h-4"
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        variant="text"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ 
  className?: string; 
  style?: React.CSSProperties;
}> = ({ 
  className = '',
  style = {}
}) => (
  <div className={`p-6 border border-slate-700 rounded-lg bg-slate-800/30 ${className}`} style={style}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width="w-12" height="h-12" />
      <div className="flex-1">
        <Skeleton height="h-4" width="w-1/2" className="mb-2" />
        <Skeleton height="h-3" width="w-1/3" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex space-x-2 mt-4">
      <Skeleton height="h-6" width="w-16" variant="rectangular" />
      <Skeleton height="h-6" width="w-20" variant="rectangular" />
      <Skeleton height="h-6" width="w-14" variant="rectangular" />
    </div>
  </div>
);

export default Skeleton;