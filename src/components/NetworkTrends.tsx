"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNetspaceStore } from "@/lib/store";
import { NetworkType } from "@/app/network-status/data/netspace-data";
import { formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, BarChart4, Users, HardDrive, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendInsight {
  phase: string;
  period: string;
  nodeGrowth: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
  };
  spaceGrowth: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
  };
  osDistribution: {
    linux: number;
    windows: number;
    macos: number;
    description: string;
  };
  nodeTypes: {
    spaceAcres: number;
    cli: number;
    description: string;
  };
}

// Taurus network insights
const TAURUS_INSIGHTS: TrendInsight[] = [
  {
    phase: "Launch",
    period: "Oct 28 - Nov 14, 2024",
    nodeGrowth: {
      value: 83,
      trend: 'up',
      description: "Initial wave of early adopters with steady onboarding"
    },
    spaceGrowth: {
      value: 127,
      trend: 'up',
      description: "Rapid expansion as validators secure network slots"
    },
    osDistribution: {
      linux: 68,
      windows: 27,
      macos: 5,
      description: "Linux dominance typical of technical early adopters"
    },
    nodeTypes: {
      spaceAcres: 42,
      cli: 58,
      description: "CLI users leading initial deployment phase"
    }
  },
  {
    phase: "Early Adopters",
    period: "Nov 15 - Dec 15, 2024",
    nodeGrowth: {
      value: 65,
      trend: 'up',
      description: "Continued growth with core community expansion"
    },
    spaceGrowth: {
      value: 152,
      trend: 'up',
      description: "Space commitment accelerating beyond node growth"
    },
    osDistribution: {
      linux: 62,
      windows: 31,
      macos: 7,
      description: "Increasing Windows participation as tooling matures"
    },
    nodeTypes: {
      spaceAcres: 53,
      cli: 47,
      description: "Space Acres gaining popularity for ease of use"
    }
  },
  {
    phase: "Protocol Update",
    period: "Dec 16 - Jan 31, 2025",
    nodeGrowth: {
      value: 28,
      trend: 'down',
      description: "Temporary slowdown during protocol upgrade period"
    },
    spaceGrowth: {
      value: 47,
      trend: 'up',
      description: "Existing validators increasing commitments while new joins slow"
    },
    osDistribution: {
      linux: 59,
      windows: 33,
      macos: 8,
      description: "Small shift toward consumer platforms continues"
    },
    nodeTypes: {
      spaceAcres: 61,
      cli: 39,
      description: "Significant shift to Space Acres following UI improvements"
    }
  },
  {
    phase: "Expansion",
    period: "Feb 1 - Mar 31, 2025",
    nodeGrowth: {
      value: 178,
      trend: 'up',
      description: "Explosive growth following protocol stability & marketing push"
    },
    spaceGrowth: {
      value: 215,
      trend: 'up',
      description: "Record space commitment surge with enterprise adoption"
    },
    osDistribution: {
      linux: 55,
      windows: 37,
      macos: 8,
      description: "Windows market share increasing with mainstream adoption"
    },
    nodeTypes: {
      spaceAcres: 68,
      cli: 32,
      description: "GUI solutions dominating as network reaches broader audience"
    }
  },
  {
    phase: "Consolidation",
    period: "Apr 1 - May 9, 2025",
    nodeGrowth: {
      value: -5,
      trend: 'down',
      description: "Slight consolidation as smaller nodes merge resources"
    },
    spaceGrowth: {
      value: 37,
      trend: 'up',
      description: "Continued space growth despite node consolidation"
    },
    osDistribution: {
      linux: 52,
      windows: 39,
      macos: 9,
      description: "Platform distribution stabilizing with mature ecosystem"
    },
    nodeTypes: {
      spaceAcres: 72,
      cli: 28,
      description: "Space Acres dominance reflecting mainstream preference"
    }
  }
];

// Gemini network insights
const GEMINI_INSIGHTS: TrendInsight[] = [
  {
    phase: "Alpha Launch",
    period: "Nov 6 - Dec 5, 2024",
    nodeGrowth: {
      value: 52,
      trend: 'up',
      description: "Controlled launch with technical community focus"
    },
    spaceGrowth: {
      value: 78,
      trend: 'up',
      description: "Steady growth as testing protocols are established"
    },
    osDistribution: {
      linux: 75,
      windows: 20,
      macos: 5,
      description: "Strong Linux preference among testing community"
    },
    nodeTypes: {
      spaceAcres: 35,
      cli: 65,
      description: "CLI dominance reflects technical testing audience"
    }
  },
  {
    phase: "Beta Expansion",
    period: "Dec 6 - Jan 31, 2025",
    nodeGrowth: {
      value: 128,
      trend: 'up',
      description: "Wider community invitation with beta program launch"
    },
    spaceGrowth: {
      value: 163,
      trend: 'up',
      description: "Accelerating space commitment following stability improvements"
    },
    osDistribution: {
      linux: 65,
      windows: 28,
      macos: 7,
      description: "Increasing Windows adoption as compatibility improves"
    },
    nodeTypes: {
      spaceAcres: 48,
      cli: 52,
      description: "GUI adoption growing as user experience improves"
    }
  },
  {
    phase: "Quality Assurance",
    period: "Feb 1 - Mar 15, 2025",
    nodeGrowth: {
      value: 14,
      trend: 'down',
      description: "Focus shift from growth to stability and testing"
    },
    spaceGrowth: {
      value: 29,
      trend: 'up',
      description: "Modest growth while test suites are expanded"
    },
    osDistribution: {
      linux: 62,
      windows: 30,
      macos: 8,
      description: "Cross-platform testing initiatives becoming priority"
    },
    nodeTypes: {
      spaceAcres: 54,
      cli: 46,
      description: "Space Acres adoption continues despite testing focus"
    }
  },
  {
    phase: "Pre-Production",
    period: "Mar 16 - May 5, 2025",
    nodeGrowth: {
      value: 85,
      trend: 'up',
      description: "Growth resuming as mainnet preparation begins"
    },
    spaceGrowth: {
      value: 112,
      trend: 'up',
      description: "Strong commitment as value propositions solidify"
    },
    osDistribution: {
      linux: 59,
      windows: 32,
      macos: 9,
      description: "Platform distribution approaching production targets"
    },
    nodeTypes: {
      spaceAcres: 62,
      cli: 38,
      description: "GUI solutions dominant as network approaches maturity"
    }
  }
];

// Mainnet network insights
const MAINNET_INSIGHTS: TrendInsight[] = [
  {
    phase: "Genesis",
    period: "May 15 - June 30, 2025",
    nodeGrowth: {
      value: 250,
      trend: 'up',
      description: "Explosive launch with unprecedented validator participation"
    },
    spaceGrowth: {
      value: 375,
      trend: 'up',
      description: "Record space commitment as production incentives activate"
    },
    osDistribution: {
      linux: 58,
      windows: 35,
      macos: 7,
      description: "Balanced platform distribution at mainnet launch"
    },
    nodeTypes: {
      spaceAcres: 65,
      cli: 35,
      description: "GUI dominance with enterprise tooling integration"
    }
  },
  {
    phase: "Ecosystem Growth",
    period: "July - August 2025",
    nodeGrowth: {
      value: 185,
      trend: 'up',
      description: "Strong continued expansion with application layer growth"
    },
    spaceGrowth: {
      value: 220,
      trend: 'up',
      description: "Space commitment accelerating with economic activity"
    },
    osDistribution: {
      linux: 55,
      windows: 36,
      macos: 9,
      description: "Consumer platform share increases with mainstream adoption"
    },
    nodeTypes: {
      spaceAcres: 70,
      cli: 30,
      description: "Enterprise solutions and managed services gaining traction"
    }
  },
  {
    phase: "Market Correction",
    period: "September 2025",
    nodeGrowth: {
      value: -7,
      trend: 'down',
      description: "Minor correction period with network optimization"
    },
    spaceGrowth: {
      value: 12,
      trend: 'up',
      description: "Space growth continues despite node count optimization"
    },
    osDistribution: {
      linux: 54,
      windows: 37,
      macos: 9,
      description: "Platform distribution stabilizing in mature ecosystem"
    },
    nodeTypes: {
      spaceAcres: 73,
      cli: 27,
      description: "Further consolidation around enterprise-grade solutions"
    }
  },
  {
    phase: "Protocol Upgrade",
    period: "October - November 2025",
    nodeGrowth: {
      value: 42,
      trend: 'up',
      description: "Renewed growth following major protocol enhancements"
    },
    spaceGrowth: {
      value: 95,
      trend: 'up',
      description: "Strong commitment surge with new economic incentives"
    },
    osDistribution: {
      linux: 53,
      windows: 38,
      macos: 9,
      description: "Windows share continues to grow with simplified tooling"
    },
    nodeTypes: {
      spaceAcres: 75,
      cli: 25,
      description: "GUI solutions establishing clear market dominance"
    }
  }
];

function getNetworkInsights(network: string): TrendInsight[] {
  switch (network.toLowerCase()) {
    case 'taurus':
      return TAURUS_INSIGHTS;
    case 'gemini':
      return GEMINI_INSIGHTS;
    case 'mainnet':
      return MAINNET_INSIGHTS;
    default:
      return TAURUS_INSIGHTS;
  }
}

export function NetworkTrends() {
  const { networkType } = useNetspaceStore();
  const [activeTab, setActiveTab] = useState<string>("0");
  const [animateIn, setAnimateIn] = useState(false);
  
  const insights = getNetworkInsights(networkType);
  
  useEffect(() => {
    // Reset to first tab when network changes
    setActiveTab("0");
    // Trigger animation
    setAnimateIn(false);
    setTimeout(() => setAnimateIn(true), 50);
  }, [networkType]);

  // Helper to display trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-5 w-5 text-emerald-400" />;
      case 'down':
        return <ArrowDownRight className="h-5 w-5 text-amber-400" />;
      default:
        return <LineChart className="h-5 w-5 text-blue-400" />;
    }
  };

  // Network insights summary
  const getNetworkSummary = () => {
    switch (networkType) {
      case 'taurus':
        return (
          <>
            <h3 className="text-base font-semibold mb-1 text-amber-300">Taurus Network Overview</h3>
            <p className="text-sm text-slate-300 mb-3">
              The Taurus testnet has evolved through several distinct phases since its October 2024 launch, 
              showing strong initial adoption, followed by protocol upgrades and significant 
              growth during February-March 2025. Space Acres adoption increased steadily, eventually 
              becoming the preferred node solution.
            </p>
          </>
        );
      case 'gemini':
        return (
          <>
            <h3 className="text-base font-semibold mb-1 text-blue-300">Gemini Network Overview</h3>
            <p className="text-sm text-slate-300 mb-3">
              Gemini has operated as a controlled testing environment since November 2024, 
              with a focus on quality assurance and pre-production preparation. The network 
              saw strong growth during its Beta phase, while maintaining a consistent focus on 
              cross-platform compatibility and UI improvements.
            </p>
          </>
        );
      default: // mainnet
        return (
          <>
            <h3 className="text-base font-semibold mb-1 text-green-300">Mainnet Overview</h3>
            <p className="text-sm text-slate-300 mb-3">
              Following its May 2025 genesis, Mainnet experienced explosive growth with record 
              validator participation. The production network continued strong expansion throughout 
              mid-2025, with a brief consolidation period in September followed by renewed 
              growth after major protocol upgrades.
            </p>
          </>
        );
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 border-none shadow-lg",
      animateIn ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
      networkType === 'taurus' ? "bg-gradient-to-br from-amber-950/30 to-amber-900/40" : 
      networkType === 'gemini' ? "bg-gradient-to-br from-blue-950/30 to-blue-900/40" :
      "bg-gradient-to-br from-green-950/30 to-green-900/40"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-100">
          <BarChart4 className={cn(
            "h-5 w-5",
            networkType === 'taurus' ? "text-amber-400" : 
            networkType === 'gemini' ? "text-blue-400" : 
            "text-green-400"
          )} />
          {networkType} Network Evolution Trends
        </CardTitle>
        <CardDescription className="text-slate-300">
          Network development phases and key trend insights based on data analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="bg-slate-800/60 rounded-lg p-4 mb-6 shadow-sm border border-slate-700">
          {getNetworkSummary()}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-slate-700/80 rounded text-xs font-medium border border-slate-600 shadow-sm text-slate-200">
              Swipe to explore phases
            </div>
            <div className="text-xs text-slate-400">
              or use tabs below to navigate through network evolution
            </div>
          </div>
        </div>
        
        <Tabs 
          defaultValue="0" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="relative mb-6 overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-slate-900/60 z-10"></div>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-transparent to-slate-900/60 z-10"></div>
            <div className="overflow-x-auto pb-2 -mb-2 hide-scrollbar">
              <TabsList className="inline-flex w-auto min-w-full justify-start md:grid md:grid-cols-5 md:w-full bg-slate-800/60 text-slate-400">
                {insights.map((insight, index) => (
                  <TabsTrigger 
                    key={insight.phase} 
                    value={index.toString()}
                    className={cn(
                      "text-xs md:text-sm transition-colors whitespace-nowrap",
                      networkType === 'taurus' ? "data-[state=active]:bg-amber-900/70 data-[state=active]:text-amber-200" : 
                      networkType === 'gemini' ? "data-[state=active]:bg-blue-900/70 data-[state=active]:text-blue-200" : 
                      "data-[state=active]:bg-green-900/70 data-[state=active]:text-green-200"
                    )}
                  >
                    {insight.phase}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          
          {insights.map((insight, index) => (
            <TabsContent 
              key={index} 
              value={index.toString()}
              className={cn(
                "transition-all duration-300 ease-in-out",
                activeTab === index.toString() ? "opacity-100 transform-none" : "opacity-0"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-slate-800/60 rounded-lg p-4 shadow-sm border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Phase Period</h3>
                    <p className="text-lg font-medium text-slate-200">{insight.period}</p>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-4 shadow-sm border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-400 flex items-center gap-1">
                        <Users className="h-4 w-4" /> Node Growth
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "text-lg font-semibold",
                          insight.nodeGrowth.trend === 'up' ? "text-emerald-400" : 
                          insight.nodeGrowth.trend === 'down' ? "text-amber-400" : 
                          "text-blue-400"
                        )}>
                          {insight.nodeGrowth.value > 0 ? '+' : ''}{insight.nodeGrowth.value}%
                        </span>
                        {getTrendIcon(insight.nodeGrowth.trend)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{insight.nodeGrowth.description}</p>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-4 shadow-sm border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-400 flex items-center gap-1">
                        <HardDrive className="h-4 w-4" /> Space Growth
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "text-lg font-semibold",
                          insight.spaceGrowth.trend === 'up' ? "text-emerald-400" : 
                          insight.spaceGrowth.trend === 'down' ? "text-amber-400" : 
                          "text-blue-400"
                        )}>
                          {insight.spaceGrowth.value > 0 ? '+' : ''}{insight.spaceGrowth.value}%
                        </span>
                        {getTrendIcon(insight.spaceGrowth.trend)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{insight.spaceGrowth.description}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-800/60 rounded-lg p-4 shadow-sm border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Node Types Distribution</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 rounded-full bg-amber-400" style={{ width: `${insight.nodeTypes.spaceAcres}%` }}></div>
                      <div className="h-3 rounded-full bg-blue-400" style={{ width: `${insight.nodeTypes.cli}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mb-3 text-slate-300">
                      <span>Space Acres: {insight.nodeTypes.spaceAcres}%</span>
                      <span>CLI: {insight.nodeTypes.cli}%</span>
                    </div>
                    <p className="text-sm text-slate-300">{insight.nodeTypes.description}</p>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-4 shadow-sm border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">OS Distribution</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 rounded-full bg-green-400" style={{ width: `${insight.osDistribution.linux}%` }}></div>
                      <div className="h-3 rounded-full bg-blue-400" style={{ width: `${insight.osDistribution.windows}%` }}></div>
                      <div className="h-3 rounded-full bg-slate-400" style={{ width: `${insight.osDistribution.macos}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mb-3 text-slate-300">
                      <span>Linux: {insight.osDistribution.linux}%</span>
                      <span>Windows: {insight.osDistribution.windows}%</span>
                      <span>macOS: {insight.osDistribution.macos}%</span>
                    </div>
                    <p className="text-sm text-slate-300">{insight.osDistribution.description}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 