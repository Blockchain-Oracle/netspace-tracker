"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, MailX } from 'lucide-react';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unsubscribe');
      }
      
      setIsUnsubscribed(true);
      toast.success('You have been unsubscribed from network status updates');
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to unsubscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-16 px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
          <MailX className="h-10 w-10 text-orange-600" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Unsubscribe</h1>
        
        <p className="text-lg text-muted-foreground">
          {isUnsubscribed 
            ? 'You have been successfully unsubscribed from network status updates.' 
            : 'Please enter your email address to unsubscribe from network status updates.'}
        </p>
        
        {!isUnsubscribed ? (
          <form onSubmit={handleUnsubscribe} className="w-full max-w-sm space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="unsubscribe-email">Email address</Label>
              <Input
                id="unsubscribe-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? 'Processing...' : 'Unsubscribe'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 p-4 rounded-lg text-left mt-4">
            <AlertTriangle size={20} className="text-orange-500 shrink-0" />
            <p className="text-sm text-orange-700">
              If you change your mind, you can always re-subscribe from the Network Status page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 