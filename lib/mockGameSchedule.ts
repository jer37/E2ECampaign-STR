// Mock data for home game schedule with performance tracking

export interface GameSchedule {
  id: string;
  opponent: string;
  date: string;
  dayOfWeek: string;
  time: string;
  capacitySold: number; // percentage 0-100
  performanceStatus: 'ahead' | 'behind' | 'on-track';
  performanceDetail: string;
  performanceInsight: string; // Why is this game performing this way?
  actions: Array<{
    type: 'campaign' | 'shift' | 'insight';
    label: string;
    description?: string;
    cta?: string;
    shiftType?: 'group-sales-surge' | 'selling-fast' | 'premium-demand' | 'family-surge';
  }>;
}

export const homeGames: GameSchedule[] = [
  {
    id: 'game-1',
    opponent: 'Los Angeles Lakers',
    date: 'Oct 24, 2025',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 89,
    performanceStatus: 'ahead',
    performanceDetail: '12% ahead of schedule',
    performanceInsight: 'LeBron effect driving strong demand across all price points',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' },
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-2',
    opponent: 'Denver Nuggets',
    date: 'Oct 28, 2025',
    dayOfWeek: 'Tuesday',
    time: '7:30 PM',
    capacitySold: 67,
    performanceStatus: 'on-track',
    performanceDetail: 'On pace with projections',
    performanceInsight: 'Standard sales velocity for mid-week divisional matchup',
    actions: []
  },
  {
    id: 'game-3',
    opponent: 'Indiana Pacers',
    date: 'Nov 1, 2025',
    dayOfWeek: 'Saturday',
    time: '6:00 PM',
    capacitySold: 45,
    performanceStatus: 'behind',
    performanceDetail: '18% behind schedule',
    performanceInsight: 'Low engagement from casual fans, competing with college football',
    actions: [
      { type: 'campaign', label: 'Flash Sale', cta: 'Create flash sale campaign' },
      { type: 'campaign', label: 'Family Pack', cta: 'Launch family bundle offer' }
    ]
  },
  {
    id: 'game-4',
    opponent: 'Chicago Bulls',
    date: 'Nov 7, 2025',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 78,
    performanceStatus: 'ahead',
    performanceDetail: '8% ahead of schedule',
    performanceInsight: 'Strong organic demand for Friday night game against historic franchise',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-5',
    opponent: 'Dallas Mavericks',
    date: 'Nov 12, 2025',
    dayOfWeek: 'Wednesday',
    time: '7:30 PM',
    capacitySold: 71,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting targets',
    performanceInsight: 'Group bookings driving solid mid-week performance',
    actions: []
  },
  {
    id: 'game-6',
    opponent: 'Phoenix Suns',
    date: 'Nov 17, 2025',
    dayOfWeek: 'Monday',
    time: '7:00 PM',
    capacitySold: 52,
    performanceStatus: 'behind',
    performanceDetail: '15% behind schedule',
    performanceInsight: 'Monday game struggling with weekday crowd despite quality opponent',
    actions: [
      { type: 'campaign', label: 'Flash Sale', cta: 'Launch $20 upper bowl flash sale' },
      { type: 'campaign', label: 'Weekday Warriors', cta: 'Create Monday night discount bundle' }
    ]
  },
  {
    id: 'game-7',
    opponent: 'Golden State Warriors',
    date: 'Nov 21, 2025',
    dayOfWeek: 'Friday',
    time: '7:30 PM',
    capacitySold: 94,
    performanceStatus: 'ahead',
    performanceDetail: '22% ahead of schedule',
    performanceInsight: 'Curry and championship pedigree creating massive demand',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-8',
    opponent: 'Sacramento Kings',
    date: 'Nov 24, 2025',
    dayOfWeek: 'Monday',
    time: '7:00 PM',
    capacitySold: 58,
    performanceStatus: 'on-track',
    performanceDetail: 'On schedule',
    performanceInsight: 'Normal sales velocity for Monday divisional matchup',
    actions: []
  },
  {
    id: 'game-9',
    opponent: 'Houston Rockets',
    date: 'Nov 29, 2025',
    dayOfWeek: 'Saturday',
    time: '6:30 PM',
    capacitySold: 49,
    performanceStatus: 'behind',
    performanceDetail: '21% behind schedule',
    performanceInsight: 'Low family engagement and weak opponent brand affecting Saturday sales',
    actions: [
      { type: 'campaign', label: 'Family Pack', cta: 'Create 4-ticket family bundle with concessions' },
      { type: 'campaign', label: 'Kids Giveaway Night', cta: 'Launch jersey giveaway promotion' }
    ]
  },
  {
    id: 'game-10',
    opponent: 'Portland Trail Blazers',
    date: 'Dec 3, 2025',
    dayOfWeek: 'Wednesday',
    time: '7:30 PM',
    capacitySold: 63,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting expectations',
    performanceInsight: 'Steady pace for mid-week game against conference opponent',
    actions: []
  },
  {
    id: 'game-11',
    opponent: 'Miami Heat',
    date: 'Dec 8, 2025',
    dayOfWeek: 'Monday',
    time: '7:00 PM',
    capacitySold: 82,
    performanceStatus: 'ahead',
    performanceDetail: '14% ahead of schedule',
    performanceInsight: 'Premium seat demand from corporate buyers for marquee matchup',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-12',
    opponent: 'Boston Celtics',
    date: 'Dec 12, 2025',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 91,
    performanceStatus: 'ahead',
    performanceDetail: '18% ahead of schedule',
    performanceInsight: 'Championship-caliber matchup driving sales across all sections',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-13',
    opponent: 'Oklahoma City Thunder',
    date: 'Dec 16, 2025',
    dayOfWeek: 'Tuesday',
    time: '7:30 PM',
    capacitySold: 73,
    performanceStatus: 'on-track',
    performanceDetail: 'On pace',
    performanceInsight: 'Young star power keeping pace with Tuesday projections',
    actions: []
  },
  {
    id: 'game-14',
    opponent: 'New Orleans Pelicans',
    date: 'Dec 19, 2025',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 55,
    performanceStatus: 'behind',
    performanceDetail: '12% behind schedule',
    performanceInsight: 'Pre-holiday shopping season competing with Friday night attendance',
    actions: [
      { type: 'campaign', label: 'Holiday Gift Pack', cta: 'Create gift-wrapped ticket packages' },
      { type: 'campaign', label: 'Last-Minute Friday', cta: 'Launch 48-hour flash sale' }
    ]
  },
  {
    id: 'game-15',
    opponent: 'Memphis Grizzlies',
    date: 'Dec 26, 2025',
    dayOfWeek: 'Friday',
    time: '6:00 PM',
    capacitySold: 87,
    performanceStatus: 'ahead',
    performanceDetail: '16% ahead of schedule',
    performanceInsight: 'Post-Christmas family outings driving strong attendance',
    actions: [
      { type: 'shift', label: 'Group Sales Surge', shiftType: 'group-sales-surge' }
    ]
  },
  {
    id: 'game-16',
    opponent: 'Atlanta Hawks',
    date: 'Dec 30, 2025',
    dayOfWeek: 'Tuesday',
    time: '7:30 PM',
    capacitySold: 61,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting targets',
    performanceInsight: 'New Year week maintaining expected trajectory',
    actions: []
  },
  {
    id: 'game-17',
    opponent: 'Milwaukee Bucks',
    date: 'Jan 4, 2026',
    dayOfWeek: 'Sunday',
    time: '5:00 PM',
    capacitySold: 84,
    performanceStatus: 'ahead',
    performanceDetail: '11% ahead of schedule',
    performanceInsight: 'Giannis appeal driving Sunday family crowd attendance',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-18',
    opponent: 'Cleveland Cavaliers',
    date: 'Jan 9, 2026',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 69,
    performanceStatus: 'on-track',
    performanceDetail: 'On schedule',
    performanceInsight: 'Standard Friday performance for Eastern Conference matchup',
    actions: []
  },
  {
    id: 'game-19',
    opponent: 'Indiana Pacers',
    date: 'Jan 15, 2026',
    dayOfWeek: 'Thursday',
    time: '7:30 PM',
    capacitySold: 55,
    performanceStatus: 'behind',
    performanceDetail: '25% behind schedule',
    performanceInsight: 'Mid-week timing and opponent brand creating significant demand gap',
    actions: [
      { type: 'campaign', label: 'Flash Sale', cta: 'Launch 24-hour half-price promotion' },
      { type: 'campaign', label: 'College Night', cta: 'Create student discount campaign' },
      { type: 'campaign', label: 'Group Deal', cta: 'Offer buy-10-get-2-free group package' }
    ]
  },
  {
    id: 'game-20',
    opponent: 'Philadelphia 76ers',
    date: 'Jan 19, 2026',
    dayOfWeek: 'Monday',
    time: '7:00 PM',
    capacitySold: 79,
    performanceStatus: 'ahead',
    performanceDetail: '9% ahead of schedule',
    performanceInsight: 'Core fanbase responding well to marquee Monday matchup',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-21',
    opponent: 'Brooklyn Nets',
    date: 'Jan 23, 2026',
    dayOfWeek: 'Friday',
    time: '7:30 PM',
    capacitySold: 72,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting projections',
    performanceInsight: 'Friday night maintaining steady pace despite mid-tier opponent',
    actions: []
  },
  {
    id: 'game-22',
    opponent: 'Toronto Raptors',
    date: 'Jan 28, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:00 PM',
    capacitySold: 58,
    performanceStatus: 'behind',
    performanceDetail: '14% behind schedule',
    performanceInsight: 'Wednesday game with international opponent not resonating with local fans',
    actions: [
      { type: 'campaign', label: 'Weekday Special', cta: 'Launch $25 Wednesday night tickets' },
      { type: 'campaign', label: 'Canadian Heritage', cta: 'Create cross-border fan promotion' }
    ]
  },
  {
    id: 'game-23',
    opponent: 'Los Angeles Clippers',
    date: 'Feb 2, 2026',
    dayOfWeek: 'Monday',
    time: '7:30 PM',
    capacitySold: 81,
    performanceStatus: 'ahead',
    performanceDetail: '13% ahead of schedule',
    performanceInsight: 'Kawhi and premium matchup overcoming Monday night challenges',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-24',
    opponent: 'San Antonio Spurs',
    date: 'Feb 6, 2026',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    capacitySold: 64,
    performanceStatus: 'on-track',
    performanceDetail: 'On pace',
    performanceInsight: 'Friday slot maintaining baseline despite rebuilding opponent',
    actions: []
  },
  {
    id: 'game-25',
    opponent: 'Utah Jazz',
    date: 'Feb 11, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:30 PM',
    capacitySold: 51,
    performanceStatus: 'behind',
    performanceDetail: '19% behind schedule',
    performanceInsight: 'Small market opponent and mid-week timing creating demand challenges',
    actions: [
      { type: 'campaign', label: 'Flash Sale', cta: 'Launch $20 ticket flash sale' },
      { type: 'campaign', label: 'Value Pack', cta: 'Create ticket + parking bundle' },
      { type: 'campaign', label: 'Fan Appreciation', cta: 'Offer rewards member exclusive pricing' }
    ]
  },
  {
    id: 'game-26',
    opponent: 'Phoenix Suns',
    date: 'Feb 14, 2026',
    dayOfWeek: 'Saturday',
    time: '6:00 PM',
    capacitySold: 88,
    performanceStatus: 'ahead',
    performanceDetail: '15% ahead of schedule',
    performanceInsight: 'Valentine\'s Day date night creating surge in couples attendance',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-27',
    opponent: 'Denver Nuggets',
    date: 'Feb 18, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:00 PM',
    capacitySold: 76,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting targets',
    performanceInsight: 'Rivalry matchup and championship contender maintaining Wednesday momentum',
    actions: []
  },
  {
    id: 'game-28',
    opponent: 'Washington Wizards',
    date: 'Feb 22, 2026',
    dayOfWeek: 'Sunday',
    time: '5:00 PM',
    capacitySold: 59,
    performanceStatus: 'behind',
    performanceDetail: '11% behind schedule',
    performanceInsight: 'Weak opponent brand limiting Sunday family crowd appeal',
    actions: [
      { type: 'campaign', label: 'Family Pack', cta: 'Launch kids-eat-free family bundle' },
      { type: 'campaign', label: 'Sunday Funday', cta: 'Create pre-game entertainment package' }
    ]
  },
  {
    id: 'game-29',
    opponent: 'Detroit Pistons',
    date: 'Feb 26, 2026',
    dayOfWeek: 'Thursday',
    time: '7:30 PM',
    capacitySold: 54,
    performanceStatus: 'behind',
    performanceDetail: '17% behind schedule',
    performanceInsight: 'Rebuilding opponent and Thursday timing depressing demand significantly',
    actions: [
      { type: 'campaign', label: 'Theme Night', cta: 'Create 90s throwback night promotion' },
      { type: 'campaign', label: 'Flash Sale', cta: 'Launch 48-hour BOGO offer' },
      { type: 'campaign', label: 'Local Business', cta: 'Offer corporate group discounts' }
    ]
  },
  {
    id: 'game-30',
    opponent: 'New York Knicks',
    date: 'Mar 2, 2026',
    dayOfWeek: 'Monday',
    time: '7:00 PM',
    capacitySold: 86,
    performanceStatus: 'ahead',
    performanceDetail: '19% ahead of schedule',
    performanceInsight: 'Major market rivalry and national media attention driving strong sales',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-31',
    opponent: 'Charlotte Hornets',
    date: 'Mar 6, 2026',
    dayOfWeek: 'Friday',
    time: '7:30 PM',
    capacitySold: 68,
    performanceStatus: 'on-track',
    performanceDetail: 'On schedule',
    performanceInsight: 'Friday night baseline performance against mid-tier opponent',
    actions: []
  },
  {
    id: 'game-32',
    opponent: 'Orlando Magic',
    date: 'Mar 10, 2026',
    dayOfWeek: 'Tuesday',
    time: '7:00 PM',
    capacitySold: 57,
    performanceStatus: 'behind',
    performanceDetail: '13% behind schedule',
    performanceInsight: 'Tuesday timing and emerging opponent brand limiting casual fan interest',
    actions: [
      { type: 'campaign', label: 'Flash Sale', cta: 'Launch $25 upper bowl flash sale' },
      { type: 'campaign', label: 'Young Fans', cta: 'Create youth basketball night with clinic' }
    ]
  },
  {
    id: 'game-33',
    opponent: 'Los Angeles Lakers',
    date: 'Mar 14, 2026',
    dayOfWeek: 'Saturday',
    time: '6:30 PM',
    capacitySold: 96,
    performanceStatus: 'ahead',
    performanceDetail: '24% ahead of schedule',
    performanceInsight: 'LeBron James and Lakers brand creating near-sellout Saturday demand',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-34',
    opponent: 'Dallas Mavericks',
    date: 'Mar 18, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:30 PM',
    capacitySold: 74,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting expectations',
    performanceInsight: 'Corporate group bookings elevating mid-week performance',
    actions: []
  },
  {
    id: 'game-35',
    opponent: 'Golden State Warriors',
    date: 'Mar 21, 2026',
    dayOfWeek: 'Saturday',
    time: '6:00 PM',
    capacitySold: 93,
    performanceStatus: 'ahead',
    performanceDetail: '21% ahead of schedule',
    performanceInsight: 'Curry\'s star power and prime Saturday slot driving exceptional demand',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  },
  {
    id: 'game-36',
    opponent: 'Houston Rockets',
    date: 'Mar 25, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:00 PM',
    capacitySold: 62,
    performanceStatus: 'on-track',
    performanceDetail: 'On pace',
    performanceInsight: 'Standard mid-week velocity against Southwest division opponent',
    actions: []
  },
  {
    id: 'game-37',
    opponent: 'Sacramento Kings',
    date: 'Mar 28, 2026',
    dayOfWeek: 'Saturday',
    time: '6:30 PM',
    capacitySold: 70,
    performanceStatus: 'on-track',
    performanceDetail: 'Meeting targets',
    performanceInsight: 'Weekend slot maintaining pace for divisional rivalry',
    actions: []
  },
  {
    id: 'game-38',
    opponent: 'Portland Trail Blazers',
    date: 'Apr 1, 2026',
    dayOfWeek: 'Wednesday',
    time: '7:30 PM',
    capacitySold: 65,
    performanceStatus: 'on-track',
    performanceDetail: 'On schedule',
    performanceInsight: 'Playoff race implications keeping interest high for mid-week game',
    actions: []
  },
  {
    id: 'game-39',
    opponent: 'Memphis Grizzlies',
    date: 'Apr 5, 2026',
    dayOfWeek: 'Sunday',
    time: '5:00 PM',
    capacitySold: 81,
    performanceStatus: 'ahead',
    performanceDetail: '12% ahead of schedule',
    performanceInsight: 'Late-season playoff positioning driving elevated Sunday attendance',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-40',
    opponent: 'Oklahoma City Thunder',
    date: 'Apr 9, 2026',
    dayOfWeek: 'Thursday',
    time: '7:00 PM',
    capacitySold: 77,
    performanceStatus: 'ahead',
    performanceDetail: '8% ahead of schedule',
    performanceInsight: 'Playoff intensity and rising young stars overcoming Thursday challenges',
    actions: [
      { type: 'shift', label: 'Premium Demand', shiftType: 'premium-demand' }
    ]
  },
  {
    id: 'game-41',
    opponent: 'Los Angeles Clippers',
    date: 'Apr 12, 2026',
    dayOfWeek: 'Sunday',
    time: '4:00 PM',
    capacitySold: 89,
    performanceStatus: 'ahead',
    performanceDetail: '17% ahead of schedule',
    performanceInsight: 'Season finale emotion and playoff implications creating strong demand',
    actions: [
      { type: 'shift', label: 'Selling Fast', shiftType: 'selling-fast' }
    ]
  }
];

export function getHomeGames(): GameSchedule[] {
  return homeGames;
}

export function getGameById(id: string): GameSchedule | null {
  return homeGames.find(game => game.id === id) || null;
}

export function getGamesByPerformanceStatus(status: 'ahead' | 'behind' | 'on-track'): GameSchedule[] {
  return homeGames.filter(game => game.performanceStatus === status);
}

export function getGamesNeedingCampaigns(): GameSchedule[] {
  return homeGames.filter(game =>
    game.actions.some(action => action.type === 'campaign')
  );
}
