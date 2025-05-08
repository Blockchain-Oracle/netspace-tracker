'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useNetspaceStore } from '@/lib/store';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { autoRefreshEnabled, toggleAutoRefresh } = useNetspaceStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container px-4 mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">A</div>
              <span className="hidden md:block font-bold text-base sm:text-lg">Autonomys Netspace</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/network-status" className="text-sm font-medium hover:text-primary">
              Network Status
            </Link>
            <Link href="/community" className="text-sm font-medium hover:text-primary">
              Community
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className={autoRefreshEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : ''}
                onClick={toggleAutoRefresh}
              >
                <RefreshIcon className="h-4 w-4 mr-1 sm:mr-2" />
                {autoRefreshEnabled ? 'Live' : 'Paused'}
              </Button>
              <DarkModeToggle />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-foreground -mr-2"
              aria-label="Toggle menu"
            >
              <MenuIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isMenuOpen ? 'hidden' : 'block'}`} />
              <CloseIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isMenuOpen ? 'block' : 'hidden'}`} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-3 sm:py-4`}>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <Link 
              href="/"
              className="text-base font-medium hover:text-primary px-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/network-status"
              className="text-base font-medium hover:text-primary px-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Network Status
            </Link>
            <Link 
              href="/community"
              className="text-base font-medium hover:text-primary px-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              href="/about"
              className="text-base font-medium hover:text-primary px-1"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className={autoRefreshEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : ''}
                onClick={() => {
                  toggleAutoRefresh();
                  setIsMenuOpen(false);
                }}
              >
                <RefreshIcon className="h-4 w-4 mr-1 sm:mr-2" />
                {autoRefreshEnabled ? 'Live' : 'Paused'}
              </Button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for system preference on initial load (client-side only)
    if (typeof window !== 'undefined') {
      // Check if user has previously set a preference
      const htmlElement = document.documentElement;
      if (htmlElement.classList.contains('dark')) return true;
      if (htmlElement.classList.contains('light')) return false;
      
      // If no preference set, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Apply the correct theme class on component mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </Button>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
} 