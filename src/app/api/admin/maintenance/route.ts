import { NextResponse } from 'next/server';
import { scheduleNetworkMaintenance } from '@/lib/network-monitor';
import { z } from 'zod';

// Schema for validation
const maintenanceSchema = z.object({
  message: z.string().min(5, 'Please enter a message describing the maintenance'),
  details: z.string().optional(),
  startTime: z.string().datetime('Please provide a valid start time'),
  endTime: z.string().datetime('Please provide a valid end time'),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime']
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = maintenanceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { message, details, startTime, endTime } = validationResult.data;
    
    // Schedule maintenance
    const success = await scheduleNetworkMaintenance(
      new Date(startTime),
      new Date(endTime),
      details ? `${message} - ${details}` : message
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to schedule maintenance' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Maintenance scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    return NextResponse.json(
      { error: 'Failed to schedule maintenance' },
      { status: 500 }
    );
  }
} 