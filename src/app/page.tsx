import { NetspaceChart } from "@/components/NetspaceChart";
import { EnhancedNetspaceChart } from "@/components/EnhancedNetspaceChart";
import { NetworkStats } from "@/components/NetworkStats";
import { ControlPanel } from "@/components/ControlPanel";
import { AutoRefreshProvider } from "@/components/AutoRefreshProvider";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container px-4 mx-auto py-6 sm:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-8 sm:mb-12">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                  Autonomys Netspace Tracker
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
                  Real-time visualization and analysis of the Autonomys network's growth and performance
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/community">
                      Join the Community
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-full max-w-[400px] h-[300px] rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                  <NetworkGraphIcon className="w-36 sm:w-48 h-36 sm:h-48 text-primary/30" />
                </div>
              </div>
            </div>
            
            <AutoRefreshProvider>
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Network Overview</h2>
                <NetworkStats />
              </div>
              
              <ControlPanel />
              
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Network Metrics</h2>
                <EnhancedNetspaceChart />
              </div>
            </AutoRefreshProvider>
            
            <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <FeatureCard 
                title="Comprehensive Metrics" 
                description="Track netspace, block height, and difficulty metrics all in one place."
                icon={<GraphIcon className="h-6 w-6" />}
              />
              <FeatureCard 
                title="Community Insights" 
                description="Share observations and discuss trends with other network participants."
                icon={<UsersIcon className="h-6 w-6" />}
              />
              <FeatureCard 
                title="Export & Analyze" 
                description="Download the data in various formats for your own research and analysis."
                icon={<DownloadIcon className="h-6 w-6" />}
              />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-4 sm:py-6">
        <div className="container px-4 mx-auto flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
           Autonomys Netspace Tracker
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
              Community
            </Link>
            <Link href="https://github.com/autonomys/netspace-tracker" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function NetworkGraphIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="2" />
      <circle cx="4" cy="4" r="2" />
      <circle cx="20" cy="4" r="2" />
      <circle cx="4" cy="20" r="2" />
      <circle cx="20" cy="20" r="2" />
      <line x1="12" y1="10" x2="4" y2="6" />
      <line x1="12" y1="10" x2="20" y2="6" />
      <line x1="12" y1="14" x2="4" y2="18" />
      <line x1="12" y1="14" x2="20" y2="18" />
    </svg>
  );
}

function GraphIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
