'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarButton } from '@/components/ui/calendar-button';
import { generateCommunityCallEvent } from '@/lib/calendar-utils';
import { format, addWeeks } from 'date-fns';

export function CommunityCalls() {
  const [expanded, setExpanded] = useState(false);

  // Generate the next 4 Wednesday community calls
  const upcomingCalls = Array.from({ length: expanded ? 4 : 2 }, (_, index) => {
    const baseEvent = generateCommunityCallEvent();
    const startTime = addWeeks(baseEvent.startTime, index);
    const endTime = addWeeks(baseEvent.endTime, index);
    
    return {
      ...baseEvent,
      startTime,
      endTime,
      date: format(startTime, 'EEEE, MMMM d, yyyy'),
      time: format(startTime, 'HH:mm') + ' - ' + format(endTime, 'HH:mm') + ' UTC',
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Community Calls</CardTitle>
        <CardDescription>
          Join Autonomys weekly community calls every Wed at 17:00 UTC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingCalls.map((call, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">{call.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{call.time}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <CalendarButton 
                buttonText="Add to Calendar"
                buttonSize="sm"
                buttonVariant="outline"
                event={{
                  ...call,
                  recurrence: undefined // No recurrence for the individual events
                }}
                useDefaultEvent={false}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <button 
          className="text-sm text-primary hover:underline flex items-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4" />
              Show more
            </>
          )}
        </button>
        <CalendarButton 
          buttonText="Subscribe to all"
          buttonVariant="default"
          buttonSize="sm"
        />
      </CardFooter>
    </Card>
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

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
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
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
} 