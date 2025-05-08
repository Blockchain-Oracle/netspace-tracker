import { NextResponse } from 'next/server';
import { checkNetworkStatus } from '@/lib/network-monitor';

export async function POST() {
  try {
    // Trigger a network status check
    await checkNetworkStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Network status check initiated successfully'
    });
  } catch (error) {
    console.error('Error checking network status:', error);
    return NextResponse.json(
      { error: 'Failed to check network status' },
      { status: 500 }
    );
  }
} 