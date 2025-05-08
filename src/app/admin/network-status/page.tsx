"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CalendarIcon, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { NetworkStatus } from '@/lib/network-monitor';

// Define schema for maintenance form
const maintenanceFormSchema = z.object({
  message: z.string().min(5, 'Please enter a message describing the maintenance'),
  details: z.string().optional(),
  startDate: z.date({
    required_error: 'Please select a start date and time',
  }),
  endDate: z.date({
    required_error: 'Please select an end date and time',
  }),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

// Define type for network status history item
interface StatusHistoryItem {
  id: number;
  status: NetworkStatus;
  message: string;
  details?: string;
  timestamp: string;
  source: string;
}

export default function AdminNetworkStatusPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState({
    total: 0,
    email: 0,
    webhook: 0,
    browser: 0
  });

  // Initialize form
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      message: '',
      details: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  // Fetch network status history
  const fetchStatusHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/network-status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      setStatusHistory(data.history || []);
      setSubscriptionStats(data.subscriptionStats || {
        total: 0,
        email: 0,
        webhook: 0,
        browser: 0
      });
    } catch (error) {
      console.error('Error fetching status history:', error);
      toast.error('Failed to load network status history');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchStatusHistory();
  }, []);
  
  // Handle form submission
  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.message,
          details: data.details,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule maintenance');
      }
      
      toast.success('Maintenance scheduled successfully');
      form.reset();
      fetchStatusHistory(); // Refresh history
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to schedule maintenance');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Force a status check
  const handleForceStatusCheck = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/check-status', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check status');
      }
      
      toast.success('Network status check initiated');
      
      // Wait a moment for the check to complete
      setTimeout(fetchStatusHistory, 2000);
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to check network status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to get badge variant based on status
  const getStatusBadge = (status: NetworkStatus) => {
    switch (status) {
      case 'up':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle className="h-3 w-3 mr-1" />Operational</Badge>;
      case 'down':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><XCircle className="h-3 w-3 mr-1" />Outage</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="h-3 w-3 mr-1" />Degraded</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Status Admin</h1>
        <p className="text-muted-foreground mt-2">
          Manage network status, view history, and schedule maintenance.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleForceStatusCheck} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Force Status Check
        </Button>
      </div>
      
      <Tabs defaultValue="history">
        <TabsList className="mb-4">
          <TabsTrigger value="history">Status History</TabsTrigger>
          <TabsTrigger value="maintenance">Schedule Maintenance</TabsTrigger>
          <TabsTrigger value="stats">Subscription Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Network Status History</CardTitle>
              <CardDescription>
                Recent network status events and incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : statusHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No history available</div>
              ) : (
                <div className="space-y-4">
                  {statusHistory.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-4 rounded-lg border shadow-sm"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {getStatusBadge(event.status)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                              Source: {event.source}
                            </span>
                          </div>
                          <p className="font-medium">{event.message}</p>
                          {event.details && (
                            <p className="mt-1 text-sm text-muted-foreground">{event.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Maintenance</CardTitle>
              <CardDescription>
                Set up planned maintenance periods and notify subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="message">Maintenance Message</Label>
                  <Input
                    id="message"
                    placeholder="Network undergoing scheduled maintenance"
                    {...form.register('message')}
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details (Optional)</Label>
                  <Textarea
                    id="details"
                    placeholder="Provide additional information about the maintenance"
                    rows={3}
                    {...form.register('details')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date and Time</Label>
                    <div className="flex flex-col space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !form.getValues('startDate') && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues('startDate') ? (
                              format(form.getValues('startDate'), "PPP p")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.getValues('startDate')}
                            onSelect={(date) => date && form.setValue('startDate', date)}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Input 
                              type="time"
                              onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const date = new Date(form.getValues('startDate'));
                                date.setHours(hours, minutes);
                                form.setValue('startDate', date);
                              }}
                              defaultValue={format(form.getValues('startDate'), "HH:mm")}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.startDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date and Time</Label>
                    <div className="flex flex-col space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !form.getValues('endDate') && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues('endDate') ? (
                              format(form.getValues('endDate'), "PPP p")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.getValues('endDate')}
                            onSelect={(date) => date && form.setValue('endDate', date)}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Input 
                              type="time"
                              onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const date = new Date(form.getValues('endDate'));
                                date.setHours(hours, minutes);
                                form.setValue('endDate', date);
                              }}
                              defaultValue={format(form.getValues('endDate'), "HH:mm")}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.endDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Scheduling...' : 'Schedule Maintenance'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Statistics</CardTitle>
              <CardDescription>
                Overview of notification subscribers by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Total</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">{subscriptionStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total subscribers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Email</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">{subscriptionStats.email}</p>
                    <p className="text-sm text-muted-foreground">Email subscribers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Webhook</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">{subscriptionStats.webhook}</p>
                    <p className="text-sm text-muted-foreground">Webhook integrations</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Browser</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-3xl font-bold">{subscriptionStats.browser}</p>
                    <p className="text-sm text-muted-foreground">Browser subscriptions</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 