"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionConfirmedPage() {
  return (
    <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Subscription Confirmed!</h1>
        
        <p className="text-lg text-muted-foreground max-w-xl">
          Thank you for subscribing to network status updates. You will now receive notifications 
          when there are changes to the Autonomys network status.
        </p>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You'll receive updates when:
          </p>
          <ul className="text-sm text-muted-foreground list-disc inline-block text-left">
            <li>Network status changes to degraded or down</li>
            <li>Scheduled maintenance is announced</li>
            <li>A resolved outage is confirmed</li>
          </ul>
        </div>
        
        <div className="pt-6">
          <Link href="/network-status">
            <Button>Return to Network Status</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 