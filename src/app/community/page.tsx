import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="w-full grid grid-cols-3 overflow-x-auto">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">Join the Conversation</CardTitle>
                <CardDescription>
                  Participate in discussions about Autonomys network, netspace trends, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {discussionPosts.map((post, i) => (
                    <div key={i} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold">{post.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{post.excerpt}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2 sm:mt-0">{post.date}</span>
                      </div>
                      <div className="flex items-center mt-3 sm:mt-4 text-sm text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <MessageIcon className="h-4 w-4 mr-1" />
                          {post.comments} comments
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Button variant="outline" className="w-full">View All Discussions</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">Top Contributors</CardTitle>
                <CardDescription>
                  Community members who actively contribute to Autonomys
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {contributors.map((contributor, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{contributor.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{contributor.contributions} contributions</p>
                        </div>
                      </div>
                      <Badge variant={i < 3 ? "default" : "outline"}>
                        #{i + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">Recent Contributions</CardTitle>
                <CardDescription>
                  Latest updates and improvements from the community
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {recentContributions.map((contribution, i) => (
                    <div key={i} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-medium text-sm sm:text-base">{contribution.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{contribution.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2 sm:mt-0">{contribution.date}</span>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {contribution.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-4 sm:mt-6">
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
        </TabsContent>
      </Tabs>

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
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Join Community Events</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Participate in community calls, hackathons, and events
              </p>
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button variant="outline" className="w-full">See Calendar</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Mock data
const discussionPosts = [
  {
    title: "Netspace growth analysis: Last 3 months",
    excerpt: "I've been tracking the netspace growth over the last quarter and noticed some interesting patterns...",
    author: "crypto_analyst",
    date: "2 days ago",
    comments: 24
  },
  {
    title: "Setting up an Autonomys node: Best practices",
    excerpt: "After running my node for several months, I wanted to share some optimizations I've made...",
    author: "node_runner",
    date: "5 days ago",
    comments: 18
  },
  {
    title: "Proposed improvement to difficulty adjustment",
    excerpt: "I think we could improve the network's efficiency with a small change to how difficulty is calculated...",
    author: "dev_contributor",
    date: "1 week ago",
    comments: 32
  }
];

const contributors = [
  { name: "blockchain_dev", contributions: 86 },
  { name: "infra_wizard", contributions: 74 },
  { name: "crypto_analyst", contributions: 53 },
  { name: "node_runner", contributions: 42 },
  { name: "community_mod", contributions: 38 }
];

const recentContributions = [
  {
    title: "Enhanced data visualization",
    description: "Added multiple visualization options for netspace data",
    type: "Feature",
    date: "Yesterday"
  },
  {
    title: "Node monitoring guide",
    description: "Created comprehensive guide for monitoring node performance",
    type: "Documentation",
    date: "3 days ago"
  },
  {
    title: "Bug fix: Export functionality",
    description: "Fixed issue with CSV exports on Firefox",
    type: "Bug Fix",
    date: "1 week ago"
  }
];

const resources = [
  {
    title: "Getting Started Guide",
    description: "Everything you need to know to get started with Autonomys",
    type: "documentation",
    link: "#"
  },
  {
    title: "Network Architecture",
    description: "Detailed overview of how the Autonomys network operates",
    type: "documentation",
    link: "#"
  },
  {
    title: "Development Roadmap",
    description: "See what's coming next for the project",
    type: "roadmap",
    link: "#"
  },
  {
    title: "Technical Specifications",
    description: "Technical details about the protocol and implementation",
    type: "documentation",
    link: "#"
  },
  {
    title: "Community Guidelines",
    description: "Rules and best practices for community interaction",
    type: "community",
    link: "#"
  },
  {
    title: "Video Tutorials",
    description: "Visual guides to help you understand the network",
    type: "video",
    link: "#"
  }
];

// UI Components
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "outline" }) {
  const baseClasses = "text-xs font-medium px-2.5 py-0.5 rounded-full";
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-muted-foreground/30 text-muted-foreground"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

// Icons
function UserIcon({ className }: { className?: string }) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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