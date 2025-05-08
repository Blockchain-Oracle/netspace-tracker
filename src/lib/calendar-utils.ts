/**
 * Calendar integration utilities
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  recurrence?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    dayOfWeek?: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    count?: number; // number of occurrences
    until?: Date; // end date for the recurrence
  };
  url?: string;
}

/**
 * Generate a Google Calendar URL for the event
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const startTime = event.startTime.toISOString().replace(/-|:|\.\d+/g, '');
  const endTime = event.endTime.toISOString().replace(/-|:|\.\d+/g, '');
  
  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title);
  url.searchParams.set('details', event.description);
  url.searchParams.set('dates', `${startTime}/${endTime}`);
  
  if (event.location) {
    url.searchParams.set('location', event.location);
  }
  
  // Add recurrence if specified
  if (event.recurrence) {
    const { frequency, interval = 1, until, count } = event.recurrence;
    
    let recur = `RRULE:FREQ=${frequency};INTERVAL=${interval}`;
    
    if (event.recurrence.dayOfWeek !== undefined) {
      const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      recur += `;BYDAY=${days[event.recurrence.dayOfWeek]}`;
    }
    
    if (until) {
      recur += `;UNTIL=${until.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 8)}`;
    }
    
    if (count) {
      recur += `;COUNT=${count}`;
    }
    
    url.searchParams.set('recur', recur);
  }
  
  return url.toString();
}

/**
 * Generate an iCalendar (.ics) file content
 */
export function generateICalendarContent(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';
  };

  const now = formatDate(new Date());
  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Autonomys//Netspace Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${now}`,
    `UID:${Date.now()}@autonomys.xyz`,
    `CREATED:${now}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LAST-MODIFIED:${now}`,
    `LOCATION:${event.location || ''}`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    `SUMMARY:${event.title}`,
    'TRANSP:OPAQUE'
  ];
  
  // Add recurrence if specified
  if (event.recurrence) {
    const { frequency, interval = 1, until, count } = event.recurrence;
    
    let recur = `RRULE:FREQ=${frequency};INTERVAL=${interval}`;
    
    if (event.recurrence.dayOfWeek !== undefined) {
      const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      recur += `;BYDAY=${days[event.recurrence.dayOfWeek]}`;
    }
    
    if (until) {
      recur += `;UNTIL=${formatDate(until)}`;
    }
    
    if (count) {
      recur += `;COUNT=${count}`;
    }
    
    icsContent.push(recur);
  }
  
  if (event.url) {
    icsContent.push(`URL:${event.url}`);
  }
  
  icsContent = icsContent.concat([
    'END:VEVENT',
    'END:VCALENDAR'
  ]);
  
  return icsContent.join('\r\n');
}

/**
 * Generate a Wednesday 17:00 community event (reusable function for the app)
 */
export function generateCommunityCallEvent(options: { 
  title?: string, 
  description?: string, 
  location?: string 
} = {}): CalendarEvent {
  // Get the next Wednesday at 17:00
  const nextWednesday = getNextDayOfWeek(3); // 3 = Wednesday (0-indexed, 0 = Sunday)
  nextWednesday.setHours(17, 0, 0, 0);
  
  // End time is 1 hour later
  const endTime = new Date(nextWednesday);
  endTime.setHours(endTime.getHours() + 1);
  
  return {
    title: options.title || 'Autonomys Community Call',
    description: options.description || 'Weekly community call to discuss Autonomys network updates, community initiatives, and upcoming events.',
    location: options.location,
    startTime: nextWednesday,
    endTime: endTime,
    recurrence: {
      frequency: 'WEEKLY',
      dayOfWeek: 3, // Wednesday
      interval: 1,
    },
    url: 'https://autonomys.xyz/community'
  };
}

/**
 * Helper function to get the next occurrence of a specific day of the week
 * @param dayOfWeek 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
function getNextDayOfWeek(dayOfWeek: number): Date {
  const today = new Date();
  const result = new Date(today);
  result.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7);
  
  // If today is the desired day but it's past the time, get next week
  if (today.getDay() === dayOfWeek && today.getHours() >= 17) {
    result.setDate(result.getDate() + 7);
  }
  
  return result;
}

/**
 * Download an ICS file
 */
export function downloadICS(event: CalendarEvent): void {
  if (typeof window === 'undefined') return;
  
  const icsContent = generateICalendarContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 