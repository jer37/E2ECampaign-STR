// Mock data service for AI-recommended campaigns

export interface OpportunityData {
  id: string;
  type: 'underperforming_inventory' | 'at_risk_segment' | 'conversion_opportunity';
  title: string;
  description: string;
  metrics: {
    current: number;
    target: number;
    gap: number;
    unit: string;
  };
  impact: {
    value: number;
    currency: string;
    type: 'revenue' | 'retention' | 'upsell';
  };
  urgency: {
    level: 'high' | 'medium' | 'low';
    deadline?: string;
    daysRemaining?: number;
  };
  confidence: number;
  suggestedAction: string;
  chatPrompt: string;
  event: {
    type: 'game' | 'deadline' | 'opportunity';
    title: string;
    date: string;
  };
  relatedData: {
    eventId?: string;
    segmentId?: string;
    inventorySnapshot?: object;
  };
}

const mockRecommendations: OpportunityData[] = [
  {
    id: 'rec-1',
    type: 'conversion_opportunity',
    title: 'Playoff Priority Access Campaign',
    description: '2,840 season ticket holders eligible for playoff priority',
    metrics: {
      current: 2840,
      target: 3500,
      gap: 660,
      unit: 'renewal targets'
    },
    impact: {
      value: 4200000,
      currency: 'USD',
      type: 'revenue'
    },
    urgency: {
      level: 'high',
      deadline: 'Mar 1, 2026',
      daysRemaining: 47
    },
    confidence: 92,
    suggestedAction: 'Launch playoff priority campaign to drive early season ticket renewals with exclusive playoff access',
    chatPrompt: 'Create a campaign offering priority playoff ticket access to season ticket holders who renew by March 1. Emphasize exclusive benefits, early bird pricing, and guaranteed playoff seats.',
    event: {
      type: 'deadline',
      title: 'Playoff Priority Deadline',
      date: 'Mar 1, 2026'
    },
    relatedData: {
      segmentId: 'segment-sth-playoff-priority',
      inventorySnapshot: {
        totalSeasonTicketHolders: 2840,
        targetRenewals: 3500,
        avgAccountValue: 4800,
        playoffInterestScore: 0.89
      }
    }
  },
  {
    id: 'rec-2',
    type: 'at_risk_segment',
    title: 'Retain At-Risk Season Ticket Holders',
    description: '847 accounts showing low engagement',
    metrics: {
      current: 847,
      target: 0,
      gap: 847,
      unit: 'at-risk accounts'
    },
    impact: {
      value: 2100000,
      currency: 'USD',
      type: 'retention'
    },
    urgency: {
      level: 'high',
      deadline: 'Feb 1, 2026',
      daysRemaining: 20
    },
    confidence: 89,
    suggestedAction: 'Launch personalized retention campaign with exclusive perks and early renewal incentives',
    chatPrompt: 'Create a retention campaign for 847 season ticket holders showing low engagement. Offer exclusive perks, VIP experiences, and early renewal discounts to prevent churn before Feb 1 deadline.',
    event: {
      type: 'deadline',
      title: 'Season Ticket Renewals',
      date: 'Feb 1, 2026'
    },
    relatedData: {
      segmentId: 'segment-atrisk-sth',
      inventorySnapshot: {
        totalAccounts: 847,
        avgAccountValue: 2480,
        riskScore: 'high'
      }
    }
  },
  {
    id: 'rec-3',
    type: 'conversion_opportunity',
    title: 'Convert Flex to Half Season Plans',
    description: '1,240 flex plan holders with 8+ game purchases',
    metrics: {
      current: 1240,
      target: 500,
      gap: 740,
      unit: 'conversion targets'
    },
    impact: {
      value: 620000,
      currency: 'USD',
      type: 'upsell'
    },
    urgency: {
      level: 'medium',
      deadline: 'Prime conversion window',
      daysRemaining: undefined
    },
    confidence: 87,
    suggestedAction: 'Create upsell campaign highlighting cost savings and premium benefits of half season plans',
    chatPrompt: 'Create an upsell campaign targeting 1,240 flex plan holders who have purchased 8+ games. Show them cost savings and exclusive benefits of upgrading to half season membership.',
    event: {
      type: 'opportunity',
      title: 'Flex Plan Conversions',
      date: 'Ongoing'
    },
    relatedData: {
      segmentId: 'segment-flex-heavy-users',
      inventorySnapshot: {
        totalFlexHolders: 1240,
        avgGamesAttended: 9.2,
        conversionRate: 0.42
      }
    }
  }
];

export function getActiveRecommendations(): OpportunityData[] {
  // Return all recommendations sorted by urgency and confidence
  return mockRecommendations.sort((a, b) => {
    // Sort by urgency first
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    const urgencyDiff = urgencyOrder[a.urgency.level] - urgencyOrder[b.urgency.level];
    if (urgencyDiff !== 0) return urgencyDiff;

    // Then by confidence
    return b.confidence - a.confidence;
  });
}

export function getRecommendationById(id: string): OpportunityData | null {
  return mockRecommendations.find(rec => rec.id === id) || null;
}

export function formatImpact(impact: OpportunityData['impact']): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: impact.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(impact.value);

  const typeLabels = {
    revenue: 'potential revenue',
    retention: 'churn risk',
    upsell: 'upsell revenue'
  };

  return `${formatted} ${typeLabels[impact.type]}`;
}

export function formatUrgency(urgency: OpportunityData['urgency']): string {
  if (urgency.daysRemaining !== undefined) {
    const days = urgency.daysRemaining;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  }
  return urgency.deadline || 'Prime opportunity';
}
