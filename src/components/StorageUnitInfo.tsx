"use client"

import { HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

export function StorageUnitInfo() {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span>1 PiB = 2^50 bytes</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/50">
              <HelpCircle className="h-3 w-3" />
              <span className="sr-only">About storage units</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="text-xs">
                <span className="font-semibold">Byte Conversion:</span> The raw telemetry data contains space pledged in bytes, which is converted to Pebibytes (PiB) for readability.
              </p>
              <div className="text-xs bg-muted p-1.5 rounded">
                <code>1 PiB = 2^50 bytes = 1,125,899,906,842,624 bytes</code>
              </div>
              <p className="text-xs italic">
                Example: 2,884,089,913,802,752 bytes ÷ 1,125,899,906,842,624 ≈ 2.56 PiB
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 