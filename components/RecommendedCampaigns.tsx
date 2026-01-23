'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHomeGames, GameSchedule } from '../lib/mockGameSchedule';
import { getActiveRecommendations, OpportunityData } from '../lib/mockRecommendations';
import OpportunityCard from './OpportunityCard';

export default function RecommendedCampaigns() {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'games' | 'milestones'>('games');
  const games = getHomeGames();
  const milestones = getActiveRecommendations();

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="px-8 py-6">
      {/* Sub-Navigation */}
      <div
        className="flex items-center gap-6 mb-6 border-b border-[rgba(0,0,0,0.1)] transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        <button
          onClick={() => setView('games')}
          className={`relative pb-3 text-base font-semibold tracking-tight transition-colors ${
            view === 'games'
              ? 'text-[#4c65f0]'
              : 'text-[rgba(0,0,0,0.65)] hover:text-black'
          }`}
        >
          Games
          {view === 'games' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4c65f0] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setView('milestones')}
          className={`relative pb-3 text-base font-semibold tracking-tight transition-colors ${
            view === 'milestones'
              ? 'text-[#4c65f0]'
              : 'text-[rgba(0,0,0,0.65)] hover:text-black'
          }`}
        >
          Season Milestones
          {view === 'milestones' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4c65f0] rounded-t-full" />
          )}
        </button>
      </div>

      {/* View Content */}
      {view === 'games' ? (
        <GamesView games={games} isVisible={isVisible} />
      ) : (
        <MilestonesView milestones={milestones} isVisible={isVisible} />
      )}
    </div>
  );
}

function GamesView({ games, isVisible }: { games: GameSchedule[]; isVisible: boolean }) {
  return (
    <>
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
            2025-26 Home Games Performance
          </h2>
          <span className="text-sm text-[rgba(0,0,0,0.65)]">
            {games.length} games
          </span>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr,1fr,1.5fr,2fr] gap-4 px-6 py-3 bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)]">
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
            Action
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[rgba(0,0,0,0.06)]">
          {games.map((game, index) => (
            <GameRow key={game.id} game={game} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </>
  );
}

function MilestonesView({ milestones, isVisible }: { milestones: OpportunityData[]; isVisible: boolean }) {
  // Group recommendations by event
  const eventGroups = milestones.reduce((groups, rec) => {
    const eventKey = rec.event.title;
    if (!groups[eventKey]) {
      groups[eventKey] = {
        event: rec.event,
        recommendations: []
      };
    }
    groups[eventKey].recommendations.push(rec);
    return groups;
  }, {} as Record<string, { event: OpportunityData['event']; recommendations: OpportunityData[] }>);

  let cardIndex = 0;

  return (
    <>
      {/* Section Header */}
      <div
        className="mb-6 transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        }}
      >
        <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
          Season-Level Opportunities
        </h2>
        <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
          Cross-cutting campaigns and initiatives spanning the entire season
        </p>
      </div>

      {/* Grouped Event Sections */}
      <div className="flex flex-col gap-8">
        {Object.entries(eventGroups).map(([eventTitle, { event, recommendations: groupRecs }], groupIndex) => (
          <div
            key={eventTitle}
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
              transitionDelay: `${groupIndex * 150}ms`,
            }}
          >
            {/* Event Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                {event.type === 'game' && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#4c65f0">
                    <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"/>
                    <circle cx="10" cy="10" r="2.5" fill="#4c65f0"/>
                  </svg>
                )}
                {event.type === 'deadline' && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#4c65f0">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/>
                    <path d="M10 5v5l3.5 2.1" stroke="#4c65f0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                )}
                {event.type === 'opportunity' && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#4c65f0">
                    <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" />
                  </svg>
                )}
                <h3 className="text-lg font-bold text-black tracking-tight">
                  {eventTitle}
                </h3>
              </div>
              <span className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                {event.date}
              </span>
              <div className="flex-1 h-[1px] bg-[rgba(0,0,0,0.1)]"></div>
            </div>

            {/* Opportunity Cards for this Event */}
            <div className="grid grid-cols-3 gap-6">
              {groupRecs.map((opportunity) => {
                const currentIndex = cardIndex++;
                return (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    delay={300 + (currentIndex * 150)}
                    isVisible={isVisible}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function GameRow({ game, index, isVisible }: { game: GameSchedule; index: number; isVisible: boolean }) {
  return (
    <div
      className="grid grid-cols-[2fr,1fr,1.5fr,2fr] gap-4 px-6 py-4 hover:bg-[rgba(76,101,240,0.02)] transition-colors"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-5px)',
        transitionDelay: `${Math.min(index * 30, 500)}ms`,
        transitionDuration: '400ms',
      }}
    >
      {/* Game Info */}
      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold text-black tracking-tight">
          vs {game.opponent}
        </div>
        <div className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
          {game.date} • {game.dayOfWeek} {game.time}
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

      {/* Action */}
      <div className="flex items-center gap-2">
        {game.actions.length === 0 ? (
          <span className="text-sm text-[rgba(0,0,0,0.4)] tracking-tight">
            On track
          </span>
        ) : (
          game.actions.slice(0, 2).map((action, actionIndex) => (
            action.type === 'campaign' ? (
              <Link
                key={actionIndex}
                href={`/chat?game=${game.id}`}
                className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-2 rounded-full text-sm font-semibold tracking-tight transition-colors"
              >
                {action.label}
              </Link>
            ) : (
              <div key={actionIndex} className="flex items-center gap-2 px-3 py-2 bg-[rgba(76,101,240,0.08)] rounded-full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#4c65f0">
                  <path d="M8 2L10 6L14 8L10 10L8 14L6 10L2 8L6 6L8 2Z" />
                </svg>
                <span className="text-sm font-semibold text-[#4c65f0] tracking-tight">
                  {action.label}
                </span>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
}
