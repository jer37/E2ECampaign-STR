// Campaign Content Service
// This file contains all dynamic content for chat campaigns based on recommendations

export interface ThinkingStep {
  genericText: string;
  specificText: string;
  reasoning: string;
  delay: number;
  duration: number;
  transitionDelay: number;
}

export interface DataTableRow {
  segment: string;
  startingPrice: string;
  willTest: string;
  messaging: string;
}

export interface TestingCardItem {
  text: string;
}

export interface SidebarSection {
  icon: string;
  label: string;
  value: string;
}

export interface CampaignContent {
  // Thinking module
  thinkingSteps: ThinkingStep[];

  // AI response sections
  responseIntro: string;

  // Data table
  dataTable: {
    headers: string[];
    rows: DataTableRow[];
  };

  responseStrategy: string;
  responseTesting: string;

  testingCard: {
    title: string;
    items: TestingCardItem[];
    footer: string;
  };

  responseInventory: string;

  optimizationCard: {
    title: string;
    items: TestingCardItem[];
    footer: string;
  };

  responseConclusion: string;

  // Sidebar content
  sidebar: {
    badge: string;
    title: string;
    subtitle: string;
    revenueRange: string;
    revenueLabel: string;
    sections: SidebarSection[];
    keyDecisions: string[];
  };
}

// ===========================================
// REC-1: PLAYOFF PRIORITY ACCESS CAMPAIGN
// ===========================================

const rec1Content: CampaignContent = {
  thinkingSteps: [
    {
      genericText: 'Analyzing renewal patterns and playoff timing',
      specificText: 'Identifying 2,840 season ticket holders eligible for playoff priority access',
      reasoning: 'Playoff push begins in March. Season ticket renewal deadline typically Feb-Mar. Offering playoff priority creates urgency for early renewals, securing $4.2M in commitments before playoff race heats up.',
      delay: 800,
      duration: 1800,
      transitionDelay: 800
    },
    {
      genericText: 'Building audience segmentation model',
      specificText: 'Creating 3 priority tiers → Championship Loyalists, Playoff Enthusiasts, Value Seekers',
      reasoning: 'Segmenting by engagement: high-engagement fans want best seats guarantee, mid-tier fans need playoff access incentive, price-conscious need early bird discount. Total addressable: 2,840 accounts.',
      delay: 2600,
      duration: 1800,
      transitionDelay: 900
    },
    {
      genericText: 'Calculating incentive structure',
      specificText: 'Applying early renewal bonuses: 10-15% discount + guaranteed playoff access',
      reasoning: 'Early bird pricing (10-15% off) drives commitment before playoff race clarity. Playoff seat guarantee creates FOMO. Testing discount depth vs exclusive access as primary motivator.',
      delay: 4400,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Designing messaging variants',
      specificText: 'Testing value angles: "Lock In Playoffs" vs "Early Bird Savings" vs "Championship Access"',
      reasoning: 'Playoff access historically lifts renewal conversion 42-48%. Testing exclusivity (guaranteed seats), value (discount), and emotion (championship journey) angles.',
      delay: 6000,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Projecting campaign performance',
      specificText: 'Targeting 85-90% renewal rate → $3.8M-$4.2M guaranteed revenue',
      reasoning: 'Conservative estimate: 2,400-2,550 renewals at avg $4,800/account. Assumes 55% email open, 38% engagement, 12% immediate conversion. Revenue locked in before playoff uncertainty.',
      delay: 7600,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Setting launch schedule',
      specificText: 'Launching 6-week campaign: Wave 1 immediate, Wave 2 at Feb deadline, Wave 3 final push',
      reasoning: 'Multi-wave approach maintains urgency. Wave 1: Early adopters (immediate). Wave 2: Mid-tier (Feb reminder). Wave 3: Last chance (March 1 deadline). Each wave escalates urgency.',
      delay: 9200,
      duration: 1400,
      transitionDelay: 700
    },
  ],

  responseIntro: `Perfect! I've built a **Playoff Priority Access campaign** to drive early season ticket renewals for **2,840 eligible accounts**. With the March 1st deadline approaching, we're offering guaranteed playoff seat access plus early bird pricing to lock in commitments before the playoff race intensifies. I've created 3 priority tiers with different value propositions tailored to fan engagement levels.`,

  dataTable: {
    headers: ['Segment', 'Avg Account Value', 'Will Test', 'Messaging'],
    rows: [
      {
        segment: 'Championship Loyalists',
        startingPrice: '$6,200/year',
        willTest: 'Seat upgrade priority',
        messaging: 'Exclusivity, legacy'
      },
      {
        segment: 'Playoff Enthusiasts',
        startingPrice: '$4,800/year',
        willTest: 'Playoff guarantee vs discount',
        messaging: 'Access, FOMO'
      },
      {
        segment: 'Value Seekers',
        startingPrice: '$3,200/year',
        willTest: 'Discount depth',
        messaging: 'Savings, value'
      }
    ]
  },

  responseStrategy: `**Championship Loyalists (920 accounts)** are high-value fans who prioritize premium seats and playoff access. Offering first-choice seat upgrades for next season plus guaranteed home playoff tickets. Messaging focuses on legacy building and exclusive access. **Playoff Enthusiasts (1,280 accounts)** are engaged fans who want guaranteed playoff seats but are price-conscious. Testing whether playoff guarantee or 15% early bird discount is stronger motivator. **Value Seekers (640 accounts)** need financial incentive to commit early. Offering 15% discount with payment plan options, emphasizing cost savings over playoff access.`,

  responseTesting: `All segments launch with personalized outreach over 6-week timeline. We're testing four key variables:`,

  testingCard: {
    title: 'Active Testing & Optimization',
    items: [
      { text: 'Value proposition: Playoff access vs early bird discount as primary driver (testing emotional vs rational appeal)' },
      { text: 'Urgency timing: 6-week vs 4-week campaign (testing if extended timeline reduces conversion urgency)' },
      { text: 'Payment options: Full payment vs monthly plans (optimizing for commitment vs cash flow)' },
      { text: 'Messaging tone: Championship journey vs practical benefits (emotion vs value framing)' }
    ],
    footer: 'Auto-adjusting based on renewal velocity. If playoff messaging converts >15% in first 2 weeks, doubling down. If <10%, shifting emphasis to discount.'
  },

  responseInventory: `The 2,840 season ticket accounts span all seating sections, with 32% in premium lower bowl, 48% in mid-tier sections, and 20% in upper bowl. Playoff priority guarantees match regular season seat location, creating natural upgrade incentive for value-tier holders. Premium accounts get first access to courtside playoff seats if team advances.`,

  optimizationCard: {
    title: 'Auto-Optimization Rules',
    items: [
      { text: 'If Championship tier converts >18% week 1 → expand seat upgrade messaging to Enthusiast tier' },
      { text: 'If Value Seeker conversion <8% after 2 weeks → increase discount to 18% and add payment plan' },
      { text: 'Dynamic deadline: If hitting 90% renewal by mid-Feb → extend deadline to capture stragglers' },
      { text: 'Wave 2 trigger: If conversion plateaus week 3 → launch "Last Chance" urgency push' }
    ],
    footer: 'All messaging and incentives auto-adjust weekly based on renewal velocity by tier. Target: 85-90% renewal rate by March 1st deadline.'
  },

  responseConclusion: `Campaign launches immediately with personalized email and direct mail to all 2,840 accounts. Follow-up touchpoints at 2-week intervals with increasing urgency. Final push in last week before March 1st deadline. Projecting **$3.8M-$4.2M in guaranteed revenue** from 2,400-2,550 renewed accounts. Conservative estimate assumes 85-90% renewal rate and accounts for tier mix.`,

  sidebar: {
    badge: 'Priority Access',
    title: 'Playoff Priority Season Ticket Renewal',
    subtitle: 'Mar 1, 2026 Deadline • Guaranteed Playoff Access',
    revenueRange: '$3.8M-4.2M',
    revenueLabel: 'Guaranteed renewal revenue',
    sections: [
      {
        icon: 'users',
        label: 'Target Accounts',
        value: '2,840 STH'
      },
      {
        icon: 'ticket',
        label: 'Playoff Guarantee',
        value: 'Home Games'
      },
      {
        icon: 'dollar',
        label: 'Early Bird Discount',
        value: '10-15% off'
      },
      {
        icon: 'message',
        label: 'Channels',
        value: 'Email, Mail, Phone'
      }
    ],
    keyDecisions: [
      'Identified 2,840 season ticket holders eligible for playoff priority before March 1st deadline',
      'Created 3 priority tiers: Championship Loyalists, Playoff Enthusiasts, Value Seekers',
      'Applied early renewal incentives: 10-15% discount + guaranteed playoff seat access',
      'Multi-wave 6-week campaign: Immediate launch → Feb reminder → Final push',
      'Testing playoff access vs discount as primary motivator across engagement tiers'
    ]
  }
};

// ===========================================
// REC-2: RETAIN AT-RISK SEASON TICKET HOLDERS
// ===========================================

const rec2Content: CampaignContent = {
  thinkingSteps: [
    {
      genericText: 'Analyzing account engagement patterns',
      specificText: 'Identifying 847 at-risk season ticket holders with declining engagement',
      reasoning: 'Tracking attendance drops, no merchandise purchases past 6 months, reduced app logins, no ticket forwards/transfers. Churn signals based on 4-year historical model.',
      delay: 800,
      duration: 1800,
      transitionDelay: 800
    },
    {
      genericText: 'Building churn risk segmentation',
      specificText: 'Creating 3 risk tiers → High-Risk (287), Medium-Risk (358), Renewal-Ready (202)',
      reasoning: 'High-Risk: <30% attendance, no engagement. Medium-Risk: 45-60% attendance, declining. Renewal-Ready: engaged but haven\'t renewed yet. Total exposure: $2.1M in potential churn.',
      delay: 2600,
      duration: 1800,
      transitionDelay: 900
    },
    {
      genericText: 'Designing retention strategy',
      specificText: 'Personalizing offers: VIP experiences + 15% early renewal discount + payment plans',
      reasoning: 'Testing emotional loyalty (VIP perks, exclusive access) vs financial incentives (discounts, payment flexibility). High-risk gets max incentives. Medium-risk gets targeted perks.',
      delay: 4400,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Designing outreach approach',
      specificText: 'Activating personal rep outreach: 1-on-1 calls + VIP event invites + early renewal',
      reasoning: 'At-risk STH respond 3x better to personal touch vs mass email. Assigning dedicated reps for calls, scheduling exclusive meet & greet events, creating urgency with deadline.',
      delay: 6000,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Projecting retention impact',
      specificText: 'Targeting 65-75% save rate → $1.8M-$2.0M in retained revenue',
      reasoning: 'Industry benchmark: 40-50% save rate for at-risk accounts. Our personalized approach + VIP perks + early discount projects 65-75% retention. Conservative $2.1M exposure → $1.8M-$2M saved.',
      delay: 7600,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Setting renewal timeline',
      specificText: 'Launching Jan 12 outreach → Feb 1 early bird deadline with urgency',
      reasoning: '20-day window for personal outreach. Week 1: High-risk calls. Week 2: VIP events. Week 3: Renewal push. Feb 1 deadline creates urgency without rushing relationship building.',
      delay: 9200,
      duration: 1400,
      transitionDelay: 700
    },
  ],

  responseIntro: `Excellent! I've built a **personalized retention campaign** targeting the **847 season ticket holders showing churn risk signals**. These accounts represent **$2.1M in potential lost revenue** if they don't renew by February 1st. I've segmented them into 3 risk tiers with escalating retention offers, VIP experiences, and 1-on-1 rep outreach to rebuild engagement and drive renewals.`,

  dataTable: {
    headers: ['Segment', 'Starting Offer', 'Will Test', 'Outreach'],
    rows: [
      {
        segment: 'High-Risk STH (287)',
        startingPrice: '15% off + VIP perks',
        willTest: 'Payment plans vs upfront discount',
        messaging: 'Personal call, exclusive event'
      },
      {
        segment: 'Medium-Risk STH (358)',
        startingPrice: '10% off + perks',
        willTest: 'Seat upgrades vs discount',
        messaging: 'Rep email + phone follow-up'
      },
      {
        segment: 'Renewal-Ready (202)',
        startingPrice: '5% early bird',
        willTest: 'Loyalty rewards vs standard',
        messaging: 'Email series with urgency'
      }
    ]
  },

  responseStrategy: `**High-Risk STH (287 accounts, avg. $2,850/yr)** get maximum intervention: dedicated rep calls, 15% early renewal discount OR flexible payment plans, and exclusive VIP event invites (meet players, behind-the-scenes tour). Testing whether financial flexibility (payment plans) or upfront savings (discount) works better for retention. **Medium-Risk STH (358 accounts, avg. $2,420/yr)** receive 10% discount plus loyalty perks (priority playoff access, exclusive merchandise). Testing seat upgrades vs straight discounts to find what drives emotional reconnection. **Renewal-Ready (202 accounts, avg. $2,180/yr)** get standard 5% early bird with urgency-driven email series emphasizing deadline and sell-out risk.`,

  responseTesting: `All segments launch January 12th with phased outreach over 20 days. We're testing four key retention variables:`,

  testingCard: {
    title: 'Active Testing & Optimization',
    items: [
      { text: 'Incentive type: Financial (discounts) vs Emotional (VIP experiences, seat upgrades)' },
      { text: 'Payment flexibility: Upfront 15% off vs 0% discount with monthly payment plans' },
      { text: 'Outreach channel: Personal rep calls vs email-only for medium-risk tier' },
      { text: 'VIP event timing: Early week 1 (relationship building) vs week 3 (closing urgency)' }
    ],
    footer: 'Real-time optimization based on renewal rates. If payment plan uptake >60%, promoting it more aggressively. If VIP events drive >40% conversion, expanding to medium-risk tier.'
  },

  responseInventory: `Focus is on relationship rebuilding and urgency creation, not inventory management. The 847 at-risk accounts currently hold seats worth $2.1M annually. We're protecting these revenue streams through personalized engagement. Dedicated account reps assigned to high/medium-risk tiers for 1-on-1 relationship management. VIP experiences scheduled for Jan 19-21 (player meet & greet, practice tour, exclusive dinner).`,

  optimizationCard: {
    title: 'Auto-Optimization Rules',
    items: [
      { text: 'If high-risk renewal rate <50% by Jan 26 → escalate to 20% discount + playoff guarantee' },
      { text: 'If payment plan uptake >65% → reduce discount emphasis, push installment messaging' },
      { text: 'If rep calls convert >40% → expand calling to medium-risk tier (currently email-only)' },
      { text: 'If VIP event attendees renew >60% → create second event week for fence-sitters' }
    ],
    footer: 'Real-time tracking of engagement signals: call connects, email opens, VIP RSVPs, website activity. Auto-escalating offers for non-responders 10 days before deadline.'
  },

  responseConclusion: `Campaign launches January 12th with phased outreach: Week 1 focuses on high-risk personal calls and VIP event invites. Week 2 expands to medium-risk email + phone follow-ups. Week 3 creates urgency push for all tiers emphasizing February 1st early bird deadline. Projecting **$1.8M-$2.0M in retained revenue** through 65-75% save rate across the 847 at-risk accounts. Conservative estimate accounts for tier mix and assumes industry-beating retention through personalization.`,

  sidebar: {
    badge: 'Retention Campaign',
    title: 'Save At-Risk Season Ticket Holders',
    subtitle: '847 Accounts • $2.1M at Risk • Feb 1 Deadline',
    revenueRange: '$1.8M-2.0M',
    revenueLabel: 'Retention value (65-75% save rate)',
    sections: [
      {
        icon: 'users',
        label: 'Risk Tiers',
        value: '3 Segments'
      },
      {
        icon: 'alert',
        label: 'At-Risk Accounts',
        value: '847 STH'
      },
      {
        icon: 'dollar',
        label: 'Max Offer',
        value: '15% discount'
      },
      {
        icon: 'message',
        label: 'Outreach',
        value: 'Personal + VIP'
      }
    ],
    keyDecisions: [
      'Identified 847 at-risk STH using engagement signals (<30-60% attendance, no purchases, app inactivity)',
      'Segmented into 3 risk tiers: High-Risk (287), Medium (358), Renewal-Ready (202)',
      'Personalized retention: 15% discount + payment plans + VIP experiences for high-risk tier',
      'Assigned dedicated reps for 1-on-1 calls and relationship management',
      '20-day phased campaign: Jan 12 launch → Feb 1 deadline with urgency escalation'
    ]
  }
};

// ===========================================
// REC-3: CONVERT FLEX TO HALF SEASON PLANS
// ===========================================

const rec3Content: CampaignContent = {
  thinkingSteps: [
    {
      genericText: 'Analyzing purchase behavior patterns',
      specificText: 'Identifying 1,240 flex plan holders with 8+ game purchases (high-intent)',
      reasoning: 'Filtering flex members by attendance frequency. 8+ games = strong engagement signal. These buyers already demonstrate half-season behavior, just need conversion nudge.',
      delay: 800,
      duration: 1800,
      transitionDelay: 800
    },
    {
      genericText: 'Building conversion segmentation',
      specificText: 'Creating 3 tiers → Super Users (10+ games), Heavy Users (8-9), Ready (6-7)',
      reasoning: 'Super Users (412): Easiest converts, already exceed half-season. Heavy (487): Strong candidates. Ready (341): Need value justification. Total addressable: $620K upsell opportunity.',
      delay: 2600,
      duration: 1800,
      transitionDelay: 900
    },
    {
      genericText: 'Calculating value proposition',
      specificText: 'Showing ROI: Half season saves $18-$32/game vs flex pricing (22-28% savings)',
      reasoning: 'Flex avg: $82/seat. Half season: $58-64/seat. Math makes case itself: 8-game buyer saves $144-256/season. Creating cost calculator tool to personalize savings for each account.',
      delay: 4400,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Designing conversion messaging',
      specificText: 'Testing angles: Cost savings vs Exclusive perks vs Priority access',
      reasoning: 'Some buyers are price-driven (savings calculator). Others want status (VIP perks, playoff priority). Testing which angle converts better by segment: Super Users = perks, Ready = savings.',
      delay: 6000,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Projecting conversion impact',
      specificText: 'Targeting 40-45% conversion → 500-560 upgrades → $520K-$620K revenue',
      reasoning: 'Industry benchmark: 30-35% conversion for targeted upsells. Our tight targeting (8+ games) + strong value prop projects 40-45% success. Avg upsell value: $1,040-$1,110 per account.',
      delay: 7600,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Setting conversion timeline',
      specificText: 'Launching Feb 1 with 3-week campaign + limited-time 10% upgrade bonus',
      reasoning: 'Post-renewal period = perfect timing. Creating urgency with limited seats (half-season inventory finite) and 10% upgrade bonus expires Feb 21. Gives 3 weeks for decision-making.',
      delay: 9200,
      duration: 1400,
      transitionDelay: 700
    },
  ],

  responseIntro: `Perfect! I've built an **upsell conversion campaign** targeting **1,240 flex plan holders** who've already purchased 8+ games this season. These high-engagement members are perfect candidates for half season plans—they're already demonstrating the behavior, they just need the financial case and exclusive perks. I've segmented them by attendance tier and personalized messaging around cost savings vs premium benefits.`,

  dataTable: {
    headers: ['Segment', 'Starting Offer', 'Will Test', 'Messaging'],
    rows: [
      {
        segment: 'Super Users (10+ games)',
        startingPrice: '$58/game + VIP perks',
        willTest: 'Exclusive benefits vs seat upgrades',
        messaging: 'Status, priority access'
      },
      {
        segment: 'Heavy Users (8-9 games)',
        startingPrice: '$61/game + perks',
        willTest: 'Savings emphasis vs perks',
        messaging: 'ROI calculator, value'
      },
      {
        segment: 'Ready-to-Upgrade (6-7)',
        startingPrice: '$64/game + bonus',
        willTest: '10% bonus vs payment plans',
        messaging: 'Financial case, flexibility'
      }
    ]
  },

  responseStrategy: `**Super Users (412 accounts, avg 11.2 games/yr)** already exceed half-season attendance. Focus is on exclusivity and status: VIP perks, playoff priority access, preferred seat selection, behind-the-scenes experiences. Testing whether exclusive benefits or seat upgrades drive better conversion. **Heavy Users (487 accounts, avg 8.8 games)** get balanced messaging: emphasize 22-28% cost savings ($18-32/game cheaper) while highlighting premium perks. ROI calculator personalizes savings for each account. Testing savings-first vs perks-first framing. **Ready-to-Upgrade (341 accounts, 6.4 games)** need stronger financial case: showing break-even at 7 games, offering 10% upgrade bonus, and flexible payment plans. Testing bonus discount vs installment flexibility.`,

  responseTesting: `All segments launch February 1st with 3-week conversion window. We're testing five key variables:`,

  testingCard: {
    title: 'Active Testing & Optimization',
    items: [
      { text: 'Value proposition: Cost savings (ROI calculator) vs Exclusive perks (VIP access, playoff priority)' },
      { text: 'Offer structure: 10% upgrade bonus vs Payment plan flexibility (no bonus but installments)' },
      { text: 'Urgency creation: Limited inventory scarcity vs Time-bound discount expiration' },
      { text: 'Social proof: Testimonials from recent converters vs Data-driven savings comparison' }
    ],
    footer: 'Auto-adjusting messaging based on segment engagement. If ROI calculator clicks >45%, pushing savings angle harder. If playoff priority resonates (>50% click-through), emphasizing access perks.'
  },

  responseInventory: `Half season plans include 20-21 home games (full season is 41). We have 340 half-season seats available across sections—targeting upper sections for Ready-to-Upgrade tier, premium sections for Super Users. Seat selection priority given by conversion tier: Super Users first (weekend games preference), Heavy Users second, Ready third. Reserved 85 premium lower bowl seats exclusively for Super User upgrades.`,

  optimizationCard: {
    title: 'Auto-Optimization Rules',
    items: [
      { text: 'If Super User conversion >55% in week 1 → expand VIP perks to Heavy Users tier' },
      { text: 'If ROI calculator engagement >60% → create personalized savings emails with exact math' },
      { text: 'If conversion <35% after 10 days → add playoff ticket guarantee to all tiers' },
      { text: 'If payment plan uptake >40% → reduce discount emphasis, push installment flexibility' }
    ],
    footer: 'Dynamic seat allocation: If premium sections fill fast, offering seat upgrades to Heavy Users. If upper bowl slow, increasing discount for Ready tier to 15% instead of 10%.'
  },

  responseConclusion: `Campaign launches February 1st with personalized emails showcasing cost savings via ROI calculator. VIP event scheduled Feb 8 for Super Users (exclusive behind-the-scenes tour). Email series runs 3 weeks with urgency building: Week 1 = value prop, Week 2 = social proof, Week 3 = last chance (Feb 21 deadline). Projecting **$520K-$620K in upsell revenue** through 40-45% conversion of 1,240 targeted flex holders (500-560 upgrades at avg $1,040-$1,110 each).`,

  sidebar: {
    badge: 'Upsell Campaign',
    title: 'Flex → Half Season Conversion',
    subtitle: '1,240 High-Intent Flex Holders • 8+ Games Attended',
    revenueRange: '$520K-620K',
    revenueLabel: 'Upsell revenue (40-45% conversion)',
    sections: [
      {
        icon: 'users',
        label: 'Conversion Tiers',
        value: '3 Segments'
      },
      {
        icon: 'ticket',
        label: 'Target Accounts',
        value: '1,240 Flex'
      },
      {
        icon: 'dollar',
        label: 'Avg. Savings',
        value: '$22/game'
      },
      {
        icon: 'message',
        label: 'Tools',
        value: 'ROI Calculator'
      }
    ],
    keyDecisions: [
      'Identified 1,240 flex holders with 8+ games (high-intent behavior signaling upgrade readiness)',
      'Segmented by attendance: Super Users (10+), Heavy (8-9), Ready (6-7 games)',
      'Created personalized ROI calculator showing $18-32/game savings (22-28% cheaper than flex)',
      'Testing cost savings vs exclusive perks (VIP access, playoff priority, seat upgrades)',
      '3-week campaign Feb 1-21 with limited-time 10% upgrade bonus creating urgency'
    ]
  }
};

// ===========================================
// DEFAULT: KEVIN GARNETT CAMPAIGN (MANUAL)
// ===========================================

const defaultContent: CampaignContent = {
  thinkingSteps: [
    {
      genericText: 'Analyzing fan database and engagement patterns',
      specificText: 'Identifying Kevin Garnett superfans from purchase history & engagement data',
      reasoning: 'Cross-referencing merchandise purchases, game attendance during 2007-2016, and social media engagement patterns to isolate true KG fans vs casual attendees',
      delay: 800,
      duration: 1800,
      transitionDelay: 800
    },
    {
      genericText: 'Building audience segmentation model',
      specificText: 'Creating "KG Fans" segment → 44,700 profiles at 94% confidence',
      reasoning: 'High confidence score based on multiple signal correlation. This segment shows 3x higher emotional attachment metrics than general season ticket holders',
      delay: 2600,
      duration: 1800,
      transitionDelay: 900
    },
    {
      genericText: 'Calculating pricing optimization',
      specificText: 'Applying +15% premium pricing strategy for once-in-lifetime event',
      reasoning: 'Historical data shows jersey retirements command 20-30% premiums. Starting conservative at +15% with automated testing to push to +20% if conversion holds above 45%',
      delay: 4400,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Designing messaging variants',
      specificText: 'Designing A/B tests: "You Were There..." vs "One Night Only..." messaging',
      reasoning: 'Testing emotional nostalgia vs scarcity/exclusivity angles. KG era fans likely respond to memory triggers, but will validate with real conversion data',
      delay: 6000,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Projecting campaign performance',
      specificText: 'Optimizing for $4.8-5.2M revenue projection across 134K total reach',
      reasoning: 'Conservative baseline assumes 48% open rate and 32% conversion. Revenue range accounts for dynamic pricing adjustments and premium section velocity',
      delay: 7600,
      duration: 1600,
      transitionDelay: 800
    },
    {
      genericText: 'Setting launch schedule',
      specificText: 'Scheduling Jan 8 @ 10am launch with 7pm send time testing',
      reasoning: '7 days out is historically optimal for event urgency. Testing morning vs evening sends to capture both work-hour browsers and post-work decision makers',
      delay: 9200,
      duration: 1400,
      transitionDelay: 700
    },
  ],

  responseIntro: `Perfect! I've built an end-to-end campaign for **Kevin Garnett's jersey retirement night on January 15th vs. the Pacers**. I've identified three primary segments: **KG Fans** (44,700 die-hard fans from 2007-2016 era), **Young Professionals** (38,900 profiles), and **Group Buyers** (50,400 profiles). Total addressable reach: **134,000 people**. Here's the complete strategy with pricing, messaging, and optimization:`,

  dataTable: {
    headers: ['Segment', 'Starting Price', 'Will Test', 'Messaging'],
    rows: [
      {
        segment: 'KG Fans',
        startingPrice: '$78 (+15%)',
        willTest: '+20% if demand high',
        messaging: 'Emotional, nostalgic'
      },
      {
        segment: 'Young Professionals',
        startingPrice: '$68 (standard)',
        willTest: 'Premium sections',
        messaging: 'Social vs. Cultural'
      },
      {
        segment: 'Group Buyers',
        startingPrice: '$61 (-10%)',
        willTest: 'Discount depth',
        messaging: 'Value vs. Easy'
      }
    ]
  },

  responseStrategy: `**KG Fans (44,700 profiles)** will pay a premium—starting with +15% pricing (avg. $78/ticket) with automated testing to bump to +20% if conversion rate stays above 45%. We're testing two headline variants: *"You Were There When He Changed Everything"* (emotional nostalgia) vs. *"One Night Only: Be Part of History"* (scarcity/exclusivity). **Young Professionals (38,900 profiles)** get standard pricing ($68 avg) with targeted messaging testing cultural significance vs social experience framing. Will monitor premium section velocity and adjust. **Group Buyers (50,400 profiles)** receive a -10% discount ($61 avg) to drive group sales and fill upper bowl efficiently, testing "easy checkout" vs "value-focused" messaging variants.`,

  responseTesting: `All segments launch January 8th @ 10am (7 days before the game). We're running parallel A/B tests across four dimensions:`,

  testingCard: {
    title: 'Active Testing & Optimization',
    items: [
      { text: 'Pricing elasticity: +15% vs +20% premium for KG Fans (only if initial conversion >45%)' },
      { text: 'Emotional messaging: "You Were There..." nostalgia vs "One Night Only" scarcity for KG segment' },
      { text: 'Send time optimization: 10am vs 7pm sends to test work-hour browsing vs post-work conversion' },
      { text: 'Group discount depth: -10% vs -15% to find optimal volume/margin balance for upper bowl fill' }
    ],
    footer: 'Real-time optimization kicks in after 24 hours. If KG Fans convert >50%, we\'ll push premium pricing higher. If group sales lag, we\'ll deepen discount to -15% for remaining inventory.'
  },

  responseInventory: `4,200 seats available for this game. I've allocated inventory strategically across segments: KG Fans get first access to premium sections (lower bowl, club seats). Young Professionals targeted for mid-tier sections with social sight-lines. Group Buyers directed to upper bowl blocks. Excluded courtside and club from group discount to protect premium positioning. Dynamic pricing will adjust section-by-section based on velocity.`,

  optimizationCard: {
    title: 'Auto-Optimization Rules',
    items: [
      { text: 'If KG Fans conversion >50% in first 48 hours → increase premium to +20% for remaining inventory' },
      { text: 'If lower bowl fills >70% by Day 3 → open premium sections to Young Professionals at +10%' },
      { text: 'If group sales <30% by Day 4 → increase discount to -15% and add "bring the crew" social proof' },
      { text: 'If any section sells <40% by Day 5 → trigger flash sale for that section only (-20% for 12 hours)' }
    ],
    footer: 'All messaging and pricing auto-adjusts based on real-time conversion data. Target: 92%+ sell-through by game day with maximized revenue per seat.'
  },

  responseConclusion: `Campaign launches **January 8th @ 10am** with simultaneous email, SMS, and app push to all segments. We're projecting **109,000 opens** → **65,000 clicks** → **72-75K conversions with optimization**, generating **$4.8-5.2M in revenue**. Conservative estimate accounts for segment mix, assumes 48% open rate and 32% base conversion rate (likely conservative for this emotional event). The Jan 15th game will be a sellout with premium pricing holding through KG's ceremony.`,

  sidebar: {
    badge: 'Auto-Optimizing',
    title: 'Kevin Garnett Jersey Retirement',
    subtitle: 'Timberwolves vs. Pacers • Jan 15, 2026 • 7:00 PM',
    revenueRange: '$4.5-5.2M',
    revenueLabel: 'Projected revenue range',
    sections: [
      {
        icon: 'users',
        label: 'Audience Segments',
        value: '3 Segments'
      },
      {
        icon: 'ticket',
        label: 'Event & Inventory',
        value: '4,200 Seats'
      },
      {
        icon: 'dollar',
        label: 'Pricing & Strategy',
        value: 'Avg. $68/ticket'
      },
      {
        icon: 'message',
        label: 'Messaging',
        value: '3 Channels'
      }
    ],
    keyDecisions: [
      'Created "Kevin Garnett Fans" segment from purchase & attendance data during 2007-2016 era (44.7K fans)',
      'Applied +15% premium pricing for KG Fans segment (testing up to +20% if conversion holds)',
      'Excluded courtside and club seats from group discount to protect premium positioning',
      'Personalized messaging by segment: emotional nostalgia (KG Fans), social experience (Young Professionals), value (Groups)',
      'Scheduled all sends for January 8 @ 10am (7 days out) with automated 7pm send time testing'
    ]
  }
};

// ===========================================
// CAMPAIGN CONTENT MAP & SERVICE FUNCTIONS
// ===========================================

const CAMPAIGN_CONTENT_MAP: Record<string, CampaignContent> = {
  'rec-1': rec1Content,
  'rec-2': rec2Content,
  'rec-3': rec3Content,
  'default': defaultContent
};

/**
 * Get campaign content by recommendation ID
 * Falls back to default (KG campaign) if ID not found or null
 */
export function getCampaignContent(recommendationId: string | null): CampaignContent {
  if (!recommendationId) {
    return CAMPAIGN_CONTENT_MAP['default'];
  }

  return CAMPAIGN_CONTENT_MAP[recommendationId] || CAMPAIGN_CONTENT_MAP['default'];
}

/**
 * Calculate total duration for thinking steps animation
 * Used to determine when to show response text
 */
export function calculateThinkingDuration(steps: ThinkingStep[]): number {
  if (steps.length === 0) return 0;

  const lastStep = steps[steps.length - 1];
  return lastStep.delay + lastStep.duration;
}
