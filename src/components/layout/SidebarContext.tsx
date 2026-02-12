/**
 * Sidebar Context
 * Manages sidebar open/close state for mobile responsiveness
 */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => {
      console.log('[SidebarContext] Toggling sidebar to', !prev);
      return !prev;
    });
  }, []);
  
  const closeSidebar = useCallback(() => {
    console.log('[SidebarContext] Closing sidebar');
    setIsSidebarOpen(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};
