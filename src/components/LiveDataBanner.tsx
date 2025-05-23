import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LiveDataBanner() {
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Currently showing historical telemetry data. Live data updates coming soon!
        <span className="block text-xs mt-1 text-gray-500">
          Gemini data is the most recent (2024), followed by mainnet and Taurus.
        </span>
      </AlertDescription>
    </Alert>
  );
} 