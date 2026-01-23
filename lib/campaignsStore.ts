// Campaign storage utility using localStorage

export interface Campaign {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Draft' | 'Completed';
  segment: string;
  type: string;
  actualRevenue: number;
  projectedRevenue: number;
  delivered: number;
  opened: number;
  converted: number;
  lastEdited: string;
  createdFrom?: string; // recommendation ID this was created from
  linkedGames?: {
    gameId: string;
    estimatedImpact?: number; // Revenue contribution for this game
    impactPercentage?: number; // % of game capacity from this campaign
  }[];
}

const STORAGE_KEY = 'timberwolves_campaigns';

// Mock campaigns with game linkages (fallback if no localStorage campaigns)
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: 'Season ticket renewal campaign',
    description: 'Target current season ticket holders who haven\'t renewed yet with early bird pricing and exclusive perks',
    status: 'Active',
    segment: 'New Fans',
    type: 'Revenue',
    actualRevenue: 425000,
    projectedRevenue: 500000,
    delivered: 100,
    opened: 75,
    converted: 33,
    lastEdited: 'Last Edited Wed, Jul 17 9:44am by Joel Resnicow',
    linkedGames: [
      { gameId: 'game-19', estimatedImpact: 65000, impactPercentage: 4 },
      { gameId: 'game-3', estimatedImpact: 22000, impactPercentage: 1.5 },
    ],
  },
  {
    id: 2,
    title: 'Flex plan to half season membership',
    description: 'Convert flex plan holders to half season using low priced upper bowl inventory',
    status: 'Active',
    segment: 'Group Buyers',
    type: 'Revenue',
    actualRevenue: 280000,
    projectedRevenue: 350000,
    delivered: 100,
    opened: 75,
    converted: 33,
    lastEdited: 'Last Edited Wed, Jul 17 9:44am by Joel Resnicow',
    linkedGames: [
      { gameId: 'game-1', estimatedImpact: 28000, impactPercentage: 2 },
      { gameId: 'game-7', estimatedImpact: 35000, impactPercentage: 3 },
    ],
  },
  {
    id: 3,
    title: 'Fill weekend inventory with families',
    description: 'Convert flex plan holders to half season using low priced upper bowl inventory',
    status: 'Active',
    segment: 'Group Buyers',
    type: 'Fan Engagement',
    actualRevenue: 145000,
    projectedRevenue: 180000,
    delivered: 100,
    opened: 75,
    converted: 33,
    lastEdited: 'Last Edited Wed, Jul 17 9:44am by Joel Resnicow',
    linkedGames: [
      { gameId: 'game-3', estimatedImpact: 45000, impactPercentage: 5 },
      { gameId: 'game-9', estimatedImpact: 52000, impactPercentage: 6 },
    ],
  },
];

/**
 * Get all campaigns from localStorage, merged with mock campaigns
 */
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return mockCampaigns;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedCampaigns = stored ? JSON.parse(stored) : [];

    // Merge stored campaigns with mock campaigns, deduplicating by ID
    // Stored campaigns take priority over mock campaigns with same ID
    const storedIds = new Set(storedCampaigns.map((c: Campaign) => c.id));
    const uniqueMockCampaigns = mockCampaigns.filter(c => !storedIds.has(c.id));

    return [...storedCampaigns, ...uniqueMockCampaigns];
  } catch (error) {
    console.error('Error reading campaigns from localStorage:', error);
    return mockCampaigns;
  }
}

/**
 * Save a new campaign to localStorage
 */
export function saveCampaign(campaign: Omit<Campaign, 'id'>): Campaign {
  const campaigns = getCampaigns();

  // Generate new ID
  const newId = campaigns.length > 0
    ? Math.max(...campaigns.map(c => c.id)) + 1
    : 4; // Start at 4 since mock data has 1, 2, 3

  const newCampaign: Campaign = {
    ...campaign,
    id: newId
  };

  campaigns.push(newCampaign);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    console.error('Error saving campaign to localStorage:', error);
  }

  return newCampaign;
}

/**
 * Update an existing campaign
 */
export function updateCampaign(id: number, updates: Partial<Campaign>): void {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);

  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...updates };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error('Error updating campaign in localStorage:', error);
    }
  }
}

/**
 * Delete a campaign
 */
export function deleteCampaign(id: number): void {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter(c => c.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting campaign from localStorage:', error);
  }
}

/**
 * Clear all campaigns (useful for testing)
 */
export function clearAllCampaigns(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing campaigns from localStorage:', error);
  }
}
