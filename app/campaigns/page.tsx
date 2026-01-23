'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TabBar from '../../components/TabBar';
import ScheduleView from '../../components/ScheduleView';
import GoalsView from '../../components/GoalsView';
import { getCampaigns, Campaign } from '../../lib/campaignsStore';

// Metrics for Active tab
const activeMetrics = [
  { title: 'Total Active Plays', value: '3', subtitle: '+3 this month', isPositive: true },
  { title: 'Active Fans in Campaigns', value: '108.2K', subtitle: 'Across all segments' },
  { title: 'Campaign Revenue (MTD)', value: '$1.2M', subtitle: '+18% vs. last month', isPositive: true },
  { title: 'Avg. Conversion Rate', value: '32.4%', subtitle: '+2.8% MoM', isPositive: true },
];

// Metrics for Game Opportunities tab
const scheduleMetrics = [
  { title: 'Total Home Games', value: '41', subtitle: '2025-26 season' },
  { title: 'Avg. Capacity Sold', value: '71.2%', subtitle: 'Across all games' },
  { title: 'Games Ahead of Schedule', value: '14', subtitle: '34% of total', isPositive: true },
  { title: 'Games Needing Action', value: '11', subtitle: 'Behind projections' },
];

// Metrics for Season Opportunities tab
const goalsMetrics = [
  { title: 'Total Opportunities', value: '3', subtitle: 'High-confidence recommendations' },
  { title: 'Potential Impact', value: '$3.2M+', subtitle: 'Revenue opportunity + risk', isPositive: true },
  { title: 'Avg. Confidence', value: '90%', subtitle: 'AI prediction accuracy', isPositive: true },
  { title: 'Next Deadline', value: '3 days', subtitle: 'Pacers game Jan 15' },
];

function CampaignsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'active' | 'schedule' | 'goals' | null;

  const [activeTab, setActiveTab] = useState<'active' | 'schedule' | 'goals'>(tabParam || 'active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load campaigns from localStorage on mount
  useEffect(() => {
    const allCampaigns = getCampaigns();
    setCampaigns(allCampaigns);
  }, []);

  // Select metrics based on active tab
  const currentMetrics =
    activeTab === 'active' ? activeMetrics :
    activeTab === 'schedule' ? scheduleMetrics :
    goalsMetrics;

  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(c => c.id));
    }
  };

  const handleSelectCampaign = (id: number) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns(selectedCampaigns.filter(cId => cId !== id));
    } else {
      setSelectedCampaigns([...selectedCampaigns, id]);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header Section with Gradient Background */}
      <div
        className="border-b border-[rgba(0,0,0,0.04)] flex flex-col gap-6 px-8 py-8"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%), linear-gradient(90deg, rgba(76, 101, 240, 1) 0%, rgba(76, 101, 240, 1) 100%)'
        }}
      >
        {/* Title and Button */}
        <div className="flex items-center justify-between w-full">
          <h1 className="text-[32px] font-black text-black leading-[36px] tracking-[-0.32px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Campaigns
          </h1>
          <Link
            href="/create-campaign"
            className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-6 h-10 rounded-full flex items-center gap-2 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M10 4.167V15.833M4.167 10h11.666" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-sm tracking-tight">Create Campaign</span>
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4">
          {currentMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              isPositive={metric.isPositive}
            />
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'active' && (
        <>
          {/* Active Tab Content */}
          {/* Search Section */}
          <div className="px-8 py-6">
        <div className="w-[300px]">
          <input
            type="text"
            placeholder="Search campaigns"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[rgba(0,0,0,0.23)] rounded px-3 py-2 text-base text-[rgba(0,0,0,0.6)] focus:outline-none focus:border-[#4c65f0] focus:border-2"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="px-8">
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="flex gap-8 items-center px-4 py-2">
            <div className="w-5">
              <input
                type="checkbox"
                checked={selectedCampaigns.length === campaigns.length}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border border-[rgba(0,0,0,0.15)] cursor-pointer accent-[#4c65f0]"
              />
            </div>
            <div className="flex-1 flex gap-1 items-center text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
              <span>Campaign</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6.667V13.333M6.667 10h6.666" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="w-[120px] flex gap-1 items-center text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight border-l border-[rgba(0,0,0,0.1)] pl-0">
              <span>Type</span>
            </div>
            <div className="w-[109px] flex gap-1 items-center text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight border-l border-[rgba(0,0,0,0.1)] pl-0">
              <span>Status</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6.667V13.333M6.667 10h6.666" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="w-[176px] flex gap-1 items-center text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight border-l border-[rgba(0,0,0,0.1)] pl-0">
              <span>Segments</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6.667V13.333M6.667 10h6.666" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="w-[180px] text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight border-l border-[rgba(0,0,0,0.1)] pl-0">
              Revenue
            </div>
            <div className="flex-1 text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight border-l border-[rgba(0,0,0,0.1)] pl-0">
              Analytics
            </div>
          </div>

          {/* Table Rows */}
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex gap-8 items-center px-4 py-6 border-b border-[rgba(0,0,0,0.1)] hover:bg-[rgba(76,101,240,0.02)] transition-colors cursor-pointer">
              <div className="w-5">
                <input
                  type="checkbox"
                  checked={selectedCampaigns.includes(campaign.id)}
                  onChange={() => handleSelectCampaign(campaign.id)}
                  className="w-5 h-5 rounded border border-[rgba(0,0,0,0.15)] cursor-pointer accent-[#4c65f0]"
                />
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-semibold text-[#4c65f0] tracking-tight cursor-pointer hover:underline">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                    {campaign.description}
                  </p>
                </div>
                <p className="text-xs text-[rgba(0,0,0,0.4)] tracking-tight">
                  {campaign.lastEdited}
                </p>
              </div>

              <div className="w-[120px]">
                <div className="inline-flex items-center justify-center px-3 h-8 rounded bg-transparent">
                  <span className="text-sm font-semibold text-black tracking-tight">
                    {campaign.type}
                  </span>
                </div>
              </div>

              <div className="w-[109px]">
                <div className="inline-flex items-center justify-center px-3 h-8 border border-[rgba(0,0,0,0.15)] rounded bg-transparent">
                  <span className="text-sm font-semibold text-[#007a47] tracking-tight">
                    {campaign.status}
                  </span>
                </div>
              </div>

              <div className="w-[176px]">
                <div className="inline-flex items-center justify-center px-3 h-8 rounded bg-transparent">
                  <span className="text-sm font-semibold text-[#4c65f0] tracking-tight">
                    {campaign.segment}
                  </span>
                </div>
              </div>

              <div className="w-[180px]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-black tracking-tight">
                      ${(campaign.actualRevenue / 1000).toFixed(0)}K
                    </span>
                    <span className="text-xs text-[rgba(0,0,0,0.4)] tracking-tight">
                      / ${(campaign.projectedRevenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(campaign.actualRevenue / campaign.projectedRevenue) * 100}%`,
                        backgroundColor: (campaign.actualRevenue / campaign.projectedRevenue) >= 0.9 ? '#007a47' : (campaign.actualRevenue / campaign.projectedRevenue) >= 0.7 ? '#4c65f0' : '#d32f2f'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-end gap-12">
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-sm font-semibold text-black tracking-tight">{campaign.delivered}%</span>
                  <span className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">Delivered</span>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-sm font-semibold text-black tracking-tight">{campaign.opened}%</span>
                  <span className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">Opened</span>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-sm font-semibold text-black tracking-tight">{campaign.converted}%</span>
                  <span className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">Converted</span>
                </div>
                <button className="ml-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="black">
                    <circle cx="10" cy="4" r="1.5"/>
                    <circle cx="10" cy="10" r="1.5"/>
                    <circle cx="10" cy="16" r="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {activeTab === 'schedule' && <ScheduleView />}

      {activeTab === 'goals' && <GoalsView />}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  isPositive
}: {
  title: string;
  value: string;
  subtitle: string;
  isPositive?: boolean;
}) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 flex flex-col gap-2">
      <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
        {title}
      </div>
      <div className="text-lg font-semibold text-black tracking-tight">
        {value}
      </div>
      <div className={`text-xs tracking-tight ${isPositive ? 'text-[#007a47]' : 'text-[rgba(0,0,0,0.65)]'}`}>
        {subtitle}
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignsPageContent />
    </Suspense>
  );
}
