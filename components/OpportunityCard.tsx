'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AIBadge from './AIBadge';
import { OpportunityData, formatImpact, formatUrgency } from '../lib/mockRecommendations';

interface OpportunityCardProps {
  opportunity: OpportunityData;
  delay?: number;
  isVisible?: boolean;
}

export default function OpportunityCard({ opportunity, delay = 0, isVisible = true }: OpportunityCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleBuildCampaign = () => {
    // Navigate to chat with recommendation context
    router.push(`/chat?rec=${opportunity.id}`);
  };

  const getUrgencyColor = () => {
    switch (opportunity.urgency.level) {
      case 'high': return 'text-[#ff6b6b]';
      case 'medium': return 'text-[#ffa726]';
      case 'low': return 'text-[#66bb6a]';
    }
  };

  const getImpactColor = () => {
    switch (opportunity.impact.type) {
      case 'revenue': return 'text-[#007a47]';
      case 'retention': return 'text-[#ff6b6b]';
      case 'upsell': return 'text-[#4c65f0]';
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
        border: isHovered ? '2px solid transparent' : '2px solid rgba(0,0,0,0.08)',
        backgroundImage: isHovered
          ? 'linear-gradient(white, white), linear-gradient(135deg, #4c65f0 0%, #657dff 50%, #ccff00 100%)'
          : 'none',
        backgroundOrigin: 'border-box',
        backgroundClip: isHovered ? 'padding-box, border-box' : 'padding-box',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Badge and Confidence */}
      <div className="flex items-start justify-between mb-4">
        <AIBadge />
        <div className="flex items-center gap-1">
          <div className="relative w-10 h-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#007a47"
                strokeWidth="3"
                strokeDasharray={`${opportunity.confidence * 1.005} 100.5`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-[#007a47]">{opportunity.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-black tracking-tight mb-2">
        {opportunity.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight mb-4">
        {opportunity.description}
      </p>

      {/* Impact & Urgency Row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col gap-1">
          <span className={`text-xl font-bold tracking-tight ${getImpactColor()}`}>
            {formatImpact(opportunity.impact).split(' ')[0]}
          </span>
          <span className="text-xs text-[rgba(0,0,0,0.5)] tracking-tight">
            {formatImpact(opportunity.impact).split(' ').slice(1).join(' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {opportunity.urgency.daysRemaining !== undefined && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={getUrgencyColor()}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          <span className={`text-sm font-semibold tracking-tight ${getUrgencyColor()}`}>
            {formatUrgency(opportunity.urgency)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleBuildCampaign}
        className="w-full bg-gradient-to-r from-[#4c65f0] to-[#657dff] hover:from-[#3d52c9] hover:to-[#5468d9] text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 tracking-tight"
        style={{
          boxShadow: isHovered ? '0 8px 20px rgba(76, 101, 240, 0.3)' : '0 4px 12px rgba(76, 101, 240, 0.2)'
        }}
      >
        Build Campaign
      </button>
    </div>
  );
}
