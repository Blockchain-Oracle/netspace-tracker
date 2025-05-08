import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarButton } from "@/components/ui/calendar-button";
import { CommunityCalls } from "@/components/CommunityCalls";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="container px-4 mx-auto py-6 sm:py-10">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Autonomys Community</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Connect with fellow Autonomys enthusiasts, share insights, and learn from the community
        </p>
      </div>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {resources.map((resource, i) => (
            <Card key={i}>
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <ResourceIcon type={resource.type} />
                </div>
                <CardTitle className="text-base sm:text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Link href={resource.link} className="text-primary text-sm hover:underline flex items-center">
                  View Resource
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-12 sm:mt-16 border-t pt-6 sm:pt-10">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Get Involved</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            There are many ways to contribute to the Autonomys network and community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <CodeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Contribute Code</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Help improve Autonomys software, tools, and ecosystem by contributing code
              </p>
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Contribute Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Help improve guides, tutorials, and documentation for new users
              </p>
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
              <a href="https://github.com/autonomys"><Button variant="outline" className="w-full">Learn More</Button></a>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Join Community Events</CardTitle>
              <CardDescription>
                Weekly community calls every Wednesday at 17:00 UTC
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <CommunityCalls />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Resources data
const resources = [
  {
    title: "Getting Started Guide",
    description: "Everything you need to know to get started with Autonomys",
    type: "documentation",
    link: "https://docs.autonomys.xyz/learn/intro"
  },
  {
    title: "Network Architecture",
    description: "Detailed overview of how the Autonomys network operates",
    type: "documentation",
    link: "https://academy.autonomys.xyz/autonomys-network/architecture"
  },
  {
    title: "Development Roadmap",
    description: "See what's coming next for the project",
    type: "roadmap",
    link: "https://develop.autonomys.xyz/introduction"
  },
  {
    title: "Technical Specifications",
    description: "Technical details about the protocol and implementation",
    type: "documentation",
    link: ""
  },
  {
    title: "Community Guidelines",
    description: "Rules and best practices for community interaction",
    type: "community",
    link: "https://www.autonomys.xyz/network-operators"
  },
  {
    title: "Video Tutorials",
    description: "Visual guides to help you understand the network",
    type: "video",
    link: "https://www.youtube.com/@AutonomysNetwork"
  }
];

// Icons
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

function DocumentTextIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
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

function ArrowRightIcon({ className }: { className?: string }) {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ResourceIcon({ type }: { type: string }) {
  const className = "h-6 w-6 text-primary";
  
  switch (type) {
    case 'documentation':
      return <DocumentTextIcon className={className} />;
    case 'video':
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
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'roadmap':
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
    case 'community':
      return <UsersIcon className={className} />;
    default:
      return <DocumentTextIcon className={className} />;
  }
} 