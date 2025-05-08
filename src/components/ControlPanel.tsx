'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNetspaceStore } from "@/lib/store";

export function ControlPanel() {
  const { 
    exportData, 
    autoRefreshEnabled, 
    toggleAutoRefresh
  } = useNetspaceStore();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Dashboard Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <p className="text-sm font-medium">Auto-refresh:</p>
            <Button 
              variant={autoRefreshEnabled ? "default" : "outline"} 
              size="sm" 
              onClick={toggleAutoRefresh}
              className="h-8"
            >
              {autoRefreshEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportData('csv')}
              className="flex items-center gap-1"
            >
              <DownloadIcon className="h-4 w-4" /> Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportData('json')}
              className="flex items-center gap-1"
            >
              <DownloadIcon className="h-4 w-4" /> Export JSON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
} 