import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container px-4 mx-auto py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-6">About Autonomys Netspace Tracker</h1>
        
        <div className="space-y-6 sm:space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Project Overview</h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base mb-3 sm:mb-4">
                  The Autonomys Netspace Tracker is a community-driven tool designed to visualize, analyze, 
                  and track the growth and trends of the Autonomys network. This dashboard provides real-time updates 
                  and historical data about netspace metrics, helping users understand network performance and growth.
                </p>
                <p className="text-sm sm:text-base">
                  Whether you're a node operator, developer, or enthusiast, this tool offers valuable insights into 
                  the Autonomys ecosystem through interactive charts, data tables, and export functionality.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-4 mt-1">
                        <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">How It Works</h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <ol className="space-y-3 sm:space-y-4 list-decimal list-inside text-sm sm:text-base">
                  <li className="pl-2">
                    <span className="font-medium">Data Collection:</span>{" "}
                    <span className="text-muted-foreground">
                      The tracker collects netspace data from the Autonomys blockchain at regular intervals.
                    </span>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Visualization:</span>{" "}
                    <span className="text-muted-foreground">
                      Data is processed and visualized in interactive charts to show trends over time.
                    </span>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Analysis:</span>{" "}
                    <span className="text-muted-foreground">
                      Additional metrics such as block height and difficulty are correlated with netspace data.
                    </span>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Community Insights:</span>{" "}
                    <span className="text-muted-foreground">
                      Users can share insights, discuss trends, and contribute to the tracker's improvement.
                    </span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

// Feature data
const features = [
  {
    title: "Real-time Netspace Visualization",
    description: "Interactive charts showing netspace trends with auto-refreshing capabilities.",
    icon: ChartIcon
  },
  {
    title: "Historical Data Analysis",
    description: "View and analyze netspace data across different time periods.",
    icon: ClockIcon
  },
  {
    title: "Data Export",
    description: "Export charts and data in CSV or JSON formats for further analysis.",
    icon: DownloadIcon
  },
  {
    title: "Community Contributions",
    description: "Share insights and contribute to the project's improvement.",
    icon: UsersIcon
  },
  {
    title: "Responsive Design",
    description: "Access the tracker on any device with a fully responsive layout.",
    icon: DevicesIcon
  },
  {
    title: "Open Source",
    description: "Built with transparency and community collaboration in mind.",
    icon: CodeIcon
  }
];

// Icons
function ChartIcon({ className }: { className?: string }) {
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

function DevicesIcon({ className }: { className?: string }) {
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
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
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
      <path d="M8.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
      <path d="M15.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
      <path d="M8.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
      <path d="M15.5 12a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
      <path d="M19.27 5.33C17.8 4.71 16.19 4.25 14.5 4c-.29.55-.56 1.2-.76 1.97.98.33 1.93.77 2.82 1.36" />
      <path d="M9.5 6c-.2-.77-.47-1.42-.76-1.97-1.68.25-3.29.71-4.77 1.33.89-.59 1.84-1.03 2.82-1.36" />
      <path d="M18.6 5.62A22.03 22.03 0 0 0 14.5 4c-.3.55-.57 1.2-.77 1.97-1.76-.59-3.66-.97-5.73-.97s-3.97.38-5.73.97C2.3 3.06 4.24.5 4.24.5 1.2 2.7.75 5.57.5 8.95c.79-.2 1.61-.3 2.5-.3 3.97 0 7.38 2.08 9 5.35C13.62 10.73 17.03 8.65 21 8.65c.89 0 1.71.1 2.5.3-.25-3.38-.7-6.25-3.74-8.45 0 0-1-2-4-.5" />
      <path d="M12 14c-1.52 0-2.91-.5-4-1.35C6.91 13.5 5.52 14 4 14c-1.38 0-2.67-.4-3.76-1.08-.26 2.7.16 5.12 1.53 6.95C3.17 21.92 5.5 22.75 9 23c.97-.11 1.96-.38 2.93-.84" />
      <path d="M12 14c1.52 0 2.91-.5 4-1.35C17.09 13.5 18.48 14 20 14c1.38 0 2.67-.4 3.76-1.08.26 2.7-.16 5.12-1.53 6.95C20.83 21.92 18.5 22.75 15 23c-.97-.11-1.96-.38-2.93-.84" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
} 