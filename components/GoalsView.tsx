'use client';

import { useState, useEffect } from 'react';
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
