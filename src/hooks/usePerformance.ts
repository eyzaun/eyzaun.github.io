import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  memoryUsage?: number;
  connectionType?: string;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        
        const performanceMetrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: fcp?.startTime || 0,
        };

        // Check memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          performanceMetrics.memoryUsage = memory.usedJSHeapSize;
        }

        // Check connection type if available
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          performanceMetrics.connectionType = connection.effectiveType;
          
          // Detect slow connections
          setIsSlowConnection(
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.downlink < 1
          );
        }

        setMetrics(performanceMetrics);

        // Log performance in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', performanceMetrics);
        }
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Prefetch critical resources on fast connections
  useEffect(() => {
    if (!isSlowConnection && typeof window !== 'undefined') {
      // Prefetch critical images
      const criticalImages = [
        '/favicon.ico',
        // Add other critical images here
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
      });
    }
  }, [isSlowConnection]);

  return {
    metrics,
    isSlowConnection,
    // Helper function to format bytes
    formatBytes: (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  };
};