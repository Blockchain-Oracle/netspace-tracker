"use client"

import { useNetspaceStore } from '@/lib/store';
import { NetworkType } from '@/app/network-status/data/netspace-data';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface NetworkInfo {
  id: NetworkType;
  name: string;
  description: string;
  status: 'active' | 'testnet' | 'upcoming';
  statusText: string;
}

const NETWORKS: NetworkInfo[] = [
  {
    id: 'mainnet',
    name: 'Autonomys Mainnet',
    description: 'The primary production network for Autonomys Protocol',
    status: 'active',
    statusText: 'Live Network'
  },
  {
    id: 'gemini',
    name: 'Gemini Testnet',
    description: 'The public testnet for Autonomys - mature testing environment',
    status: 'testnet',
    statusText: 'Public Testnet'
  },
  {
    id: 'taurus',
    name: 'Taurus Network',
    description: 'The next generation development network with new features',
    status: 'upcoming',
    statusText: 'Development Network'
  }
];

export function NetworkSelector() {
  const { networkType, setNetworkType } = useNetspaceStore();
  
  // Find the currently selected network info
  const currentNetwork = NETWORKS.find(net => net.id === networkType) || NETWORKS[0];
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{currentNetwork.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              currentNetwork.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
              currentNetwork.status === 'testnet' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {currentNetwork.statusText}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{currentNetwork.description}</p>
        </div>
        
        <div>
          <Select
            value={networkType}
            onValueChange={(value) => setNetworkType(value as NetworkType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Production</SelectLabel>
                <SelectItem value="mainnet">Mainnet</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Test Networks</SelectLabel>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="taurus">Taurus</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
} 