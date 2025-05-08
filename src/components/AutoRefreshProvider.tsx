'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useNetspaceStore } from '@/lib/store';

interface AutoRefreshProviderProps {
  children: ReactNode;
}

export function AutoRefreshProvider({ children }: AutoRefreshProviderProps) {
  const { 
    autoRefreshEnabled, 
    autoRefreshInterval, 
    fetchNetspaceData, 
    timeRange 
  } = useNetspaceStore();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Set up auto-refresh timer if enabled
    if (autoRefreshEnabled) {
      timerRef.current = setInterval(() => {
        fetchNetspaceData(timeRange);
      }, autoRefreshInterval * 1000); // Convert to milliseconds
    }

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoRefreshEnabled, autoRefreshInterval, fetchNetspaceData, timeRange]);

  return <>{children}</>;
} 