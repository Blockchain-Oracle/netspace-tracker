"use client"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChartLegendProps {
  activeMetric: string;
}

export function ChartLegend({ activeMetric }: ChartLegendProps) {
  return (
    <div className="flex items-center justify-between mb-2 text-sm">
      <div className="flex items-center gap-2">
        {activeMetric === 'netspace' && (
          <>
            <span className="inline-flex items-center">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
              Netspace (PiB)
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center text-muted-foreground">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="sr-only">Explain PiB unit</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs font-normal">
                    <span className="font-semibold">PiB (Pebibyte)</span>: 1 PiB = 2^50 bytes = 1,125,899,906,842,624 bytes.
                    Raw values from telemetry data are converted from bytes to PiB for readability.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        
        {activeMetric === 'blockHeight' && (
          <span className="inline-flex items-center">
            <span className="h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
            Block Height
          </span>
        )}
        
        {activeMetric === 'difficulty' && (
          <span className="inline-flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
            Difficulty
          </span>
        )}
        
        {activeMetric === 'nodeCount' && (
          <span className="inline-flex items-center">
            <span className="h-3 w-3 rounded-full bg-amber-500 mr-1"></span>
            Node Count
          </span>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {activeMetric === 'netspace' && "Pledged storage in Pebibytes (binary)"}
        {activeMetric === 'blockHeight' && "Estimated block height progression"}
        {activeMetric === 'difficulty' && "Network difficulty factor"}
        {activeMetric === 'nodeCount' && "Active validator nodes"}
      </div>
    </div>
  );
} 