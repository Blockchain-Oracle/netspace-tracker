'use client';

import * as React from 'react';
import { CalendarEvent, downloadICS, generateGoogleCalendarUrl, generateCommunityCallEvent } from '@/lib/calendar-utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CalendarButtonProps {
  event?: CalendarEvent;
  useDefaultEvent?: boolean;
  className?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  options?: {
    showGoogle?: boolean;
    showICS?: boolean;
    showOutlook?: boolean;
    customOptions?: Array<{
      label: string;
      action: () => void;
    }>;
  };
}

export function CalendarButton({
  event,
  useDefaultEvent = true,
  className,
  buttonText = 'Add to Calendar',
  buttonVariant = 'outline',
  buttonSize = 'default',
  options = {
    showGoogle: true,
    showICS: true,
    showOutlook: false,
    customOptions: [],
  },
}: CalendarButtonProps) {
  // Use the provided event or generate the default Wednesday community call
  const calendarEvent = React.useMemo(() => {
    if (event) return event;
    if (useDefaultEvent) return generateCommunityCallEvent();
    return null;
  }, [event, useDefaultEvent]);

  if (!calendarEvent) {
    return null;
  }

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(calendarEvent), '_blank');
  };

  const handleICSDownload = () => {
    downloadICS(calendarEvent);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.showGoogle && (
          <DropdownMenuItem onClick={handleGoogleCalendar}>
            <GoogleCalendarIcon className="h-4 w-4 mr-2" />
            <span>Google Calendar</span>
          </DropdownMenuItem>
        )}
        {options.showOutlook && (
          <DropdownMenuItem onClick={handleICSDownload}>
            <OutlookIcon className="h-4 w-4 mr-2" />
            <span>Outlook</span>
          </DropdownMenuItem>
        )}
        {options.showICS && (
          <DropdownMenuItem onClick={handleICSDownload}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Download .ics</span>
          </DropdownMenuItem>
        )}
        {options.customOptions?.map((option, index) => (
          <DropdownMenuItem key={index} onClick={option.action}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CalendarIcon({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function GoogleCalendarIcon({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function OutlookIcon({ className }: { className?: string }) {
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
      <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
      <path d="M2 12h10" />
      <path d="M9 18H2V8" />
      <path d="M14 16H8a2 2 0 1 0 0 4h9a3 3 0 0 0 0-6h-5Z" />
    </svg>
  );
} 