'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OpportunityCard from './OpportunityCard';
import { getActiveRecommendations, OpportunityData } from '../lib/mockRecommendations';

export default function GoalsView() {
  const [isVisible, setIsVisible] = useState(false);
  const milestones = getActiveRecommendations();

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

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
    <div className="px-8 py-6">
      {/* Season Ticket Renewal CTA Banner */}
      <div className="pb-6">
        <div
          className="relative overflow-hidden rounded-xl border-2 border-[#4c65f0] p-6 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(76, 101, 240, 0.08) 0%, rgba(204, 255, 0, 0.08) 100%)'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#4c65f0] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4c65f0] text-white text-xs font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <polyline points="17 14 12 14 12 19"/>
                  </svg>
                  Annual Planning Cycle
                </span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight">
                Time to Launch Season Ticket Renewals
              </h3>
              <p className="text-base text-[rgba(0,0,0,0.75)] tracking-tight max-w-2xl">
                Based on your renewal cycle, now is the optimal time to engage season ticket holders.
                Launch a targeted renewal campaign to secure commitments for next season and maximize early bird adoption.
              </p>
            </div>
          </div>
          <Link
            href="/chat?workflow=str"
            className="flex-shrink-0 bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-8 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>Create Campaign</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M7.5 15l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* On-Sale Pricing & Packaging CTA Banner */}
      <div className="pb-6">
        <div
          className="relative overflow-hidden rounded-xl border-2 border-[#4c65f0] p-6 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(76, 101, 240, 0.05) 0%, rgba(76, 101, 240, 0.02) 100%)'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#4c65f0] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="1.5" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4c65f0] text-white text-xs font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <polyline points="17 14 12 14 12 19"/>
                  </svg>
                  Annual Planning Cycle
                </span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight">
                Configure On-Sale Pricing & Packaging
              </h3>
              <p className="text-base text-[rgba(0,0,0,0.75)] tracking-tight max-w-2xl">
                18,200 seats across 41 home games — Set single game pricing, flex plans, mini plans, and
                season packages with AI-optimized game tiering for the 2026-27 on-sale.
              </p>
            </div>
          </div>
          <Link
            href="/chat?workflow=pricing"
            className="flex-shrink-0 bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-8 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>Configure Pricing</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M7.5 15l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

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
    </div>
  );
}
