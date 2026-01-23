'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHomeGames, GameSchedule } from '../lib/mockGameSchedule';
import { getCampaignsForGame, getTotalCampaignImpact } from '../lib/campaignGameLinks';
import { Campaign } from '../lib/campaignsStore';

// NBA team colors and abbreviations
const teamInfo: Record<string, { abbr: string; primary: string; secondary: string }> = {
  'Los Angeles Lakers': { abbr: 'LAL', primary: '#552583', secondary: '#FDB927' },
  'Denver Nuggets': { abbr: 'DEN', primary: '#0E2240', secondary: '#FEC524' },
  'Indiana Pacers': { abbr: 'IND', primary: '#002D62', secondary: '#FDBB30' },
  'Chicago Bulls': { abbr: 'CHI', primary: '#CE1141', secondary: '#000000' },
  'Dallas Mavericks': { abbr: 'DAL', primary: '#00538C', secondary: '#002B5E' },
  'Phoenix Suns': { abbr: 'PHX', primary: '#1D1160', secondary: '#E56020' },
  'Golden State Warriors': { abbr: 'GSW', primary: '#1D428A', secondary: '#FFC72C' },
  'Sacramento Kings': { abbr: 'SAC', primary: '#5A2D81', secondary: '#63727A' },
  'Houston Rockets': { abbr: 'HOU', primary: '#CE1141', secondary: '#000000' },
  'Portland Trail Blazers': { abbr: 'POR', primary: '#E03A3E', secondary: '#000000' },
  'Miami Heat': { abbr: 'MIA', primary: '#98002E', secondary: '#F9A01B' },
  'Boston Celtics': { abbr: 'BOS', primary: '#007A33', secondary: '#BA9653' },
  'Oklahoma City Thunder': { abbr: 'OKC', primary: '#007AC1', secondary: '#EF3B24' },
  'New Orleans Pelicans': { abbr: 'NOP', primary: '#0C2340', secondary: '#C8102E' },
  'Memphis Grizzlies': { abbr: 'MEM', primary: '#5D76A9', secondary: '#12173F' },
  'Atlanta Hawks': { abbr: 'ATL', primary: '#E03A3E', secondary: '#C1D32F' },
  'Milwaukee Bucks': { abbr: 'MIL', primary: '#00471B', secondary: '#EEE1C6' },
  'Cleveland Cavaliers': { abbr: 'CLE', primary: '#860038', secondary: '#041E42' },
  'Philadelphia 76ers': { abbr: 'PHI', primary: '#006BB6', secondary: '#ED174C' },
  'Brooklyn Nets': { abbr: 'BKN', primary: '#000000', secondary: '#FFFFFF' },
  'Toronto Raptors': { abbr: 'TOR', primary: '#CE1141', secondary: '#000000' },
  'Los Angeles Clippers': { abbr: 'LAC', primary: '#C8102E', secondary: '#1D428A' },
  'San Antonio Spurs': { abbr: 'SAS', primary: '#C4CED4', secondary: '#000000' },
  'Utah Jazz': { abbr: 'UTA', primary: '#002B5C', secondary: '#00471B' },
  'Washington Wizards': { abbr: 'WAS', primary: '#002B5C', secondary: '#E31837' },
  'Detroit Pistons': { abbr: 'DET', primary: '#C8102E', secondary: '#1D42BA' },
  'New York Knicks': { abbr: 'NYK', primary: '#006BB6', secondary: '#F58426' },
  'Charlotte Hornets': { abbr: 'CHA', primary: '#1D1160', secondary: '#00788C' },
  'Orlando Magic': { abbr: 'ORL', primary: '#0077C0', secondary: '#C4CED4' },
};

export default function ScheduleView() {
  const [isVisible, setIsVisible] = useState(false);
  const games = getHomeGames();

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="px-8 py-6">
      {/* Section Header */}
      <div
        className="flex items-center justify-between mb-6 transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-black tracking-tight">
            2025-26 Home Games Performance & Opportunities
          </h2>
          <span className="text-sm text-[rgba(0,0,0,0.65)]">
            {games.length} games
          </span>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr,2fr,1.5fr,2fr,2.5fr] gap-4 px-6 py-3 bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)]">
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
            Game
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight text-center">
            Capacity
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
            Performance
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
            Active Campaigns
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight text-center">
            Campaign Impact
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
            Insight
          </div>
          <div className="text-sm font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
            Campaign Actions
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[rgba(0,0,0,0.06)]">
          {games.map((game, index) => (
            <GameRow key={game.id} game={game} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameRow({ game, index, isVisible }: { game: GameSchedule; index: number; isVisible: boolean }) {
  const team = teamInfo[game.opponent];
  const gameCampaigns = getCampaignsForGame(game.id);
  const campaignImpact = getTotalCampaignImpact(game.id);

  const isPacersGame = game.opponent === 'Indiana Pacers';
  const isSunsGame = game.opponent === 'Phoenix Suns';
  const isRocketsGame = game.opponent === 'Houston Rockets';

  return (
    <div
      className="grid grid-cols-[2fr,1fr,1fr,2fr,1.5fr,2fr,2.5fr] gap-4 px-6 py-4 hover:bg-[rgba(76,101,240,0.02)] transition-colors"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-5px)',
        transitionDelay: `${Math.min(index * 30, 500)}ms`,
        transitionDuration: '400ms',
      }}
    >
      {/* Game Info */}
      <div className="flex items-center gap-3">
        {/* Team Logo */}
        {team && (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: team.primary,
              border: `2px solid ${team.secondary}`,
            }}
          >
            <span
              className="text-xs font-bold tracking-tight"
              style={{ color: team.secondary }}
            >
              {team.abbr}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold text-black tracking-tight">
            vs {game.opponent}
          </div>
          <div className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
            {game.date} • {game.dayOfWeek} {game.time}
          </div>
        </div>
      </div>

      {/* Capacity Sold */}
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="text-lg font-semibold text-black tracking-tight">
          {game.capacitySold}%
        </div>
        <div className="w-full h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${game.capacitySold}%`,
              backgroundColor:
                game.performanceStatus === 'ahead' ? '#007a47' :
                game.performanceStatus === 'behind' ? '#d32f2f' :
                '#4c65f0'
            }}
          />
        </div>
      </div>

      {/* Performance Status */}
      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-2">
          {game.performanceStatus === 'ahead' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#007a47">
              <path d="M8 3L12 8L8 8L8 13L4 8L8 8L8 3Z" />
            </svg>
          )}
          {game.performanceStatus === 'behind' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#d32f2f">
              <path d="M8 13L4 8L8 8L8 3L12 8L8 8L8 13Z" />
            </svg>
          )}
          {game.performanceStatus === 'on-track' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#4c65f0">
              <circle cx="8" cy="8" r="2" />
            </svg>
          )}
          <span
            className="text-sm font-semibold tracking-tight"
            style={{
              color:
                game.performanceStatus === 'ahead' ? '#007a47' :
                game.performanceStatus === 'behind' ? '#d32f2f' :
                '#4c65f0'
            }}
          >
            {game.performanceDetail}
          </span>
        </div>
      </div>

      {/* Active Campaigns Column */}
      <div className="flex flex-col gap-1.5 justify-center">
        {gameCampaigns.length === 0 ? (
          <span className="text-sm text-[rgba(0,0,0,0.4)]">-</span>
        ) : (
          gameCampaigns.slice(0, 3).map((campaignInfo) => (
            <CampaignBadge
              key={campaignInfo.campaign.id}
              campaign={campaignInfo.campaign}
              impact={campaignInfo.impactDirection}
            />
          ))
        )}
      </div>

      {/* Campaign Impact Column */}
      <div className="flex items-center justify-center">
        {campaignImpact.campaignCount > 0 ? (
          <CampaignImpactIndicator impact={campaignImpact} />
        ) : (
          <span className="text-sm text-[rgba(0,0,0,0.4)]">-</span>
        )}
      </div>

      {/* Performance Insight */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight leading-relaxed">
          {game.performanceInsight}
        </p>

        {/* Market Shift Indicators */}
        {game.actions.filter(a => a.type === 'shift').length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {game.actions
              .filter(action => action.type === 'shift')
              .map((action, actionIndex) => (
                <div
                  key={actionIndex}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(76,101,240,0.08)] rounded-full"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="#4c65f0">
                    <path d="M6 1.5L7.5 4.5L10.5 6L7.5 7.5L6 10.5L4.5 7.5L1.5 6L4.5 4.5L6 1.5Z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#4c65f0] tracking-tight">
                    {action.label}
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Recommended Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isPacersGame ? (
          <>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Sponsor Upsell
            </Link>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Targeted Demand Shift
            </Link>
          </>
        ) : isSunsGame ? (
          <>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Weather Protection Package
            </Link>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Premium Experience Upsell
            </Link>
          </>
        ) : isRocketsGame ? (
          <>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Local Hero Campaign
            </Link>
            <Link
              href={`/chat?game=${game.id}`}
              className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
            >
              Create Social Amplification Push
            </Link>
          </>
        ) : game.actions.filter(a => a.type === 'campaign').length === 0 ? (
          <span className="text-sm text-[rgba(0,0,0,0.4)] tracking-tight">
            No recommended actions
          </span>
        ) : (
          game.actions
            .filter(action => action.type === 'campaign')
            .map((action, actionIndex) => (
              <Link
                key={actionIndex}
                href={`/chat?game=${game.id}`}
                className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors"
              >
                {action.label}
              </Link>
            ))
        )}
      </div>
    </div>
  );
}

function CampaignBadge({
  campaign,
  impact
}: {
  campaign: Campaign;
  impact: 'positive' | 'negative' | 'neutral'
}) {
  const colors = {
    positive: {
      bg: 'bg-[rgba(0,122,71,0.1)]',
      text: 'text-[#007a47]',
      border: 'border-[#007a47]'
    },
    negative: {
      bg: 'bg-[rgba(211,47,47,0.1)]',
      text: 'text-[#d32f2f]',
      border: 'border-[#d32f2f]'
    },
    neutral: {
      bg: 'bg-[rgba(76,101,240,0.1)]',
      text: 'text-[#4c65f0]',
      border: 'border-[#4c65f0]'
    }
  };

  const style = colors[impact];

  return (
    <Link
      href="/campaigns?tab=active"
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${style.bg} hover:opacity-80 transition-opacity`}
    >
      <span className={`text-xs font-semibold ${style.text} truncate max-w-[140px]`}>
        {campaign.title}
      </span>
    </Link>
  );
}

function CampaignImpactIndicator({
  impact
}: {
  impact: { totalPercentage: number; netDirection: 'positive' | 'negative' | 'neutral'; campaignCount: number }
}) {
  const isPositive = impact.netDirection === 'positive';
  const isNegative = impact.netDirection === 'negative';

  const color = isPositive ? '#007a47' : isNegative ? '#d32f2f' : '#4c65f0';
  const sign = isPositive ? '+' : '';

  return (
    <div className="flex items-center gap-1.5">
      {isPositive && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
          <path d="M8 3L12 8L8 8L8 13L4 8L8 8L8 3Z" />
        </svg>
      )}
      {isNegative && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
          <path d="M8 13L4 8L8 8L8 3L12 8L8 8L8 13Z" />
        </svg>
      )}
      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {sign}{impact.totalPercentage}%
      </span>
    </div>
  );
}
