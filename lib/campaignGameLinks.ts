import { getCampaigns, Campaign } from './campaignsStore';

export interface GameCampaignInfo {
  campaign: Campaign;
  estimatedImpact: number;
  impactPercentage: number;
  impactDirection: 'positive' | 'negative' | 'neutral';
}

/**
 * Get all active campaigns linked to a specific game
 */
export function getCampaignsForGame(gameId: string): GameCampaignInfo[] {
  const allCampaigns = getCampaigns();
  const activeCampaigns = allCampaigns.filter(c => c.status === 'Active');

  const linkedCampaigns: GameCampaignInfo[] = [];

  for (const campaign of activeCampaigns) {
    if (campaign.linkedGames) {
      const linkedGame = campaign.linkedGames.find(lg => lg.gameId === gameId);
      if (linkedGame) {
        // Determine impact direction based on campaign performance
        const performanceRatio = campaign.actualRevenue / campaign.projectedRevenue;
        let impactDirection: 'positive' | 'negative' | 'neutral' = 'neutral';

        if (performanceRatio >= 1.0) impactDirection = 'positive';
        else if (performanceRatio < 0.7) impactDirection = 'negative';

        linkedCampaigns.push({
          campaign,
          estimatedImpact: linkedGame.estimatedImpact || 0,
          impactPercentage: linkedGame.impactPercentage || 0,
          impactDirection
        });
      }
    }
  }

  return linkedCampaigns;
}

/**
 * Calculate total campaign impact for a game
 */
export function getTotalCampaignImpact(gameId: string): {
  totalPercentage: number;
  netDirection: 'positive' | 'negative' | 'neutral';
  campaignCount: number;
} {
  const campaigns = getCampaignsForGame(gameId);

  const totalPercentage = campaigns.reduce((sum, c) => {
    return sum + (c.impactDirection === 'positive' ? c.impactPercentage : -c.impactPercentage);
  }, 0);

  return {
    totalPercentage,
    netDirection: totalPercentage > 0 ? 'positive' : totalPercentage < 0 ? 'negative' : 'neutral',
    campaignCount: campaigns.length
  };
}
