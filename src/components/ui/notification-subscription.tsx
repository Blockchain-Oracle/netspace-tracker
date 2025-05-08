"use client"

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export function NotificationSubscription() {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [browserEnabled, setBrowserEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle email subscription form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email',
          email: email
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      toast.success("You've been subscribed to network status updates!");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle webhook subscription form submission
  const handleWebhookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }
    
    if (!/^https?:\/\//.test(webhookUrl)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'webhook',
          url: webhookUrl
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      toast.success("Webhook has been subscribed to network status updates!");
      setWebhookUrl("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle browser notification toggle
  const handleBrowserToggle = async (checked: boolean) => {
    setBrowserEnabled(checked);
    
    if (checked) {
      // Check if browser supports notifications
      if (!("Notification" in window)) {
        toast.error("This browser does not support desktop notifications");
        setBrowserEnabled(false);
        return;
      }
      
      try {
        // Request permission
        const permission = await Notification.requestPermission();
        
        if (permission !== "granted") {
          toast.error("Permission for notifications was denied");
          setBrowserEnabled(false);
          return;
        }
        
        // If we can, register with our API
        try {
          // In a real app, we would use the Push API and service workers here
          // For this demo, we'll just simulate it
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'browser',
              endpoint: 'https://fcm.googleapis.com/fcm/send/example-endpoint',
              keys: {
                auth: 'auth-secret',
                p256dh: 'p256dh-key'
              }
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to register for browser notifications');
          }
          
          // Show a test notification
          new Notification("Network Status Subscribed", {
            body: "You'll now receive notifications when network status changes",
            icon: "/favicon.ico"
          });
          
          toast.success("Browser notifications enabled successfully!");
        } catch (error) {
          console.error("Browser notification error:", error);
          toast.error("Failed to enable browser notifications");
          setBrowserEnabled(false);
        }
      } catch (error) {
        console.error("Permission request error:", error);
        toast.error("Error requesting notification permission");
        setBrowserEnabled(false);
      }
    } else {
      toast.success("Browser notifications disabled");
    }
  };

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="webhook">Webhook</TabsTrigger>
        <TabsTrigger value="browser">Browser</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="mt-4">
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="webhook" className="mt-4">
        <form onSubmit={handleWebhookSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://your-app.com/api/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="browser" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts directly in your browser
              </p>
            </div>
            <Switch 
              checked={browserEnabled} 
              onCheckedChange={handleBrowserToggle} 
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Browser notifications will be sent when:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Network status changes to degraded or down</li>
              <li>Scheduled maintenance is announced</li>
              <li>A resolved outage is confirmed</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
} 