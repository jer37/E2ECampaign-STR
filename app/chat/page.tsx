'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getRecommendationById } from '../../lib/mockRecommendations';
import { getCampaignContent, calculateThinkingDuration } from '../../lib/campaignContent';
import { saveCampaign } from '../../lib/campaignsStore';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recommendationId = searchParams.get('rec');
  const workflowType = searchParams.get('workflow');
  const recommendation = recommendationId ? getRecommendationById(recommendationId) : null;

  // Load dynamic campaign content based on recommendation
  const campaignContent = getCampaignContent(recommendationId);
  const thinkingSteps = campaignContent.thinkingSteps;

  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [transitionedSteps, setTransitionedSteps] = useState<number[]>([]);
  const [showText, setShowText] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showHistoricalTable, setShowHistoricalTable] = useState(false);
  const [showGoalQuestion, setShowGoalQuestion] = useState(false);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [checkboxSelections, setCheckboxSelections] = useState({
    longtimeMembers: false,
    cappingPrice: false,
    upsellingQuarterToHalf: false,
    upsellingHalfToFull: false,
    crossSellAtRisk: false,
  });
  const [priceCapPercentage, setPriceCapPercentage] = useState('');
  const [preferencesSubmitted, setPreferencesSubmitted] = useState(false);
  const [paymentPlans, setPaymentPlans] = useState({
    plan1: false, // 10% upfront, 12 monthly
    plan2: false, // 15% upfront, 9 monthly (recommended)
    plan3: false, // 10% upfront, 6 payments
  });
  const [paymentPlansSubmitted, setPaymentPlansSubmitted] = useState(false);
  const [requireFullUpfront, setRequireFullUpfront] = useState<boolean | null>(null);
  const [optOutOptions, setOptOutOptions] = useState({
    discountCredits: false,
    offerHalfQuarter: false,
    freeUpgrades: false,
  });
  const [optOutSubmitted, setOptOutSubmitted] = useState(false);
  const [generatingCampaign, setGeneratingCampaign] = useState(false);

  // Pricing workflow state
  const [pricingSliderValue, setPricingSliderValue] = useState(50);
  const [pricingSliderSubmitted, setPricingSliderSubmitted] = useState(false);
  const [showPricingHistoricalTable, setShowPricingHistoricalTable] = useState(false);
  const [showPricingGoalQuestion, setShowPricingGoalQuestion] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState({
    fullSeason: true,
    halfSeason: true,
    quarterSeason: true,
    fiveGame: false,
    flex: false,
    singleGame: true,
    group: false,
  });
  const [flexConfig, setFlexConfig] = useState({ gameCount: 10, fanChoice: true });
  const [groupMinSize, setGroupMinSize] = useState(15);
  const [packagesSubmitted, setPackagesSubmitted] = useState(false);
  const [tierStructure, setTierStructure] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [tierSubmitted, setTierSubmitted] = useState(false);
  const [pricingConstraints, setPricingConstraints] = useState({
    capYoY: false,
    floorPrice: false,
    matchSecondary: false,
    maintainLadder: true,
    premiumPricing: false,
  });
  const [maxYoYIncrease, setMaxYoYIncrease] = useState('8');
  const [floorPriceAmount, setFloorPriceAmount] = useState('15');
  const [premiumPct, setPremiumPct] = useState('40');
  const [constraintsSubmitted, setConstraintsSubmitted] = useState(false);
  const [benefitAllocations, setBenefitAllocations] = useState<Record<string, Record<string, boolean>>>({
    playoffPriority: { fullSeason: true, halfSeason: true, quarterSeason: false, fiveGame: false, flex: false },
    seatUpgrades: { fullSeason: true, halfSeason: true, quarterSeason: true, fiveGame: false, flex: false },
    freeParking: { fullSeason: true, halfSeason: false, quarterSeason: false, fiveGame: false, flex: false },
    merchCredit: { fullSeason: true, halfSeason: true, quarterSeason: false, fiveGame: false, flex: false },
    ticketExchange: { fullSeason: true, halfSeason: true, quarterSeason: true, fiveGame: true, flex: false },
    memberEvents: { fullSeason: true, halfSeason: true, quarterSeason: false, fiveGame: false, flex: false },
    guestPasses: { fullSeason: true, halfSeason: false, quarterSeason: false, fiveGame: false, flex: false },
  });
  const [benefitsSubmitted, setBenefitsSubmitted] = useState(false);
  const [generatingPricingCampaign, setGeneratingPricingCampaign] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default user message or use recommendation prompt
  const userMessage = recommendation
    ? recommendation.chatPrompt
    : 'Create a Kevin Garnett campaign targeting young professionals and group buyers with special packages around his jersey retirement night on Jan 15 vs. the Pacers';

  // Check if this is STR workflow (needed before useEffect)
  const isSTRWorkflow = workflowType === 'str' && !selectedGoal;
  // Check if ANY part of STR workflow (including after campaign generation)
  const isAnySTRWorkflow = workflowType === 'str';

  // Check if this is Pricing workflow
  const isPricingWorkflow = workflowType === 'pricing' && !generatingPricingCampaign;
  const isAnyPricingWorkflow = workflowType === 'pricing';

  useEffect(() => {
    // For STR workflow, show items sequentially
    if (isAnySTRWorkflow) {
      setTimeout(() => setIsVisible(true), 100);
      setTimeout(() => setShowHistoricalTable(true), 800);
      setTimeout(() => setShowGoalQuestion(true), 1600);
      return;
    }

    // For Pricing workflow, show items sequentially
    if (isAnyPricingWorkflow) {
      setTimeout(() => setIsVisible(true), 100);
      setTimeout(() => setShowPricingHistoricalTable(true), 800);
      setTimeout(() => setShowPricingGoalQuestion(true), 1600);
      return;
    }

    // Show user message first
    setTimeout(() => setIsVisible(true), 100);

    // Start thinking module
    setTimeout(() => setIsThinking(true), 800);

    // Show and complete each thinking step progressively
    thinkingSteps.forEach((step, index) => {
      // Start the step
      setTimeout(() => {
        setActiveStep(index);
      }, step.delay);

      // Transition from generic to specific text
      setTimeout(() => {
        setTransitionedSteps(prev => [...prev, index]);
      }, step.delay + step.transitionDelay);

      // Complete the step
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        if (index < thinkingSteps.length - 1) {
          setActiveStep(index + 1);
        }
      }, step.delay + step.duration);
    });

    // Start showing text after all thinking complete
    setTimeout(() => {
      setIsThinking(false);
      setShowText(true);
    }, 11100);

    // Slide in sidebar as text appears
    setTimeout(() => {
      setShowSidebar(true);
    }, 11600);

    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isAnySTRWorkflow, isAnyPricingWorkflow]);

  const handleLaunchCampaign = () => {
    let newCampaign;

    if (generatingPricingCampaign) {
      const revenueValue = (112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1);
      const sellThrough = Math.round(78 + (pricingSliderValue / 100) * 17);

      newCampaign = {
        title: '2026-27 On-Sale Pricing & Packaging',
        description: `${Object.values(selectedPackages).filter(Boolean).length} package types, ${tierStructure} tiering, ${sellThrough}% sell-through target`,
        status: 'Active' as const,
        segment: 'All Ticket Buyers',
        type: 'Pricing & Packaging',
        actualRevenue: 0,
        projectedRevenue: parseFloat(revenueValue) * 1000000,
        delivered: 0,
        opened: 0,
        converted: 0,
        lastEdited: `Last Edited ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} by Joel Resnicow`,
        createdFrom: 'pricing-workflow',
      };
    } else if (generatingCampaign) {
      const revenueValue = (81.2 - (sliderValue / 100) * 10.1).toFixed(1);
      const renewalRate = Math.round(67 + (sliderValue / 100) * 20);

      newCampaign = {
        title: '2026 Season Ticket Renewal Campaign',
        description: `Multi-segment retention strategy targeting ${renewalRate}% renewal rate`,
        status: 'Active' as const,
        segment: 'Season Ticket Holders',
        type: 'Season Ticket Renewal',
        actualRevenue: 0,
        projectedRevenue: parseFloat(revenueValue) * 1000000,
        delivered: 0,
        opened: 0,
        converted: 0,
        lastEdited: `Last Edited ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} by Joel Resnicow`,
        createdFrom: 'str-workflow',
      };
    } else {
      // Regular workflow campaign data
      newCampaign = {
        title: campaignContent.sidebar.title,
        description: campaignContent.sidebar.subtitle,
        status: 'Active' as const,
        segment: campaignContent.sidebar.sections[0]?.value || 'General Audience',
        type: campaignContent.sidebar.badge,
        actualRevenue: 0,
        projectedRevenue: parseInt(campaignContent.sidebar.revenueRange.replace(/[$,K-]/g, '').split(' ')[0]) * 1000 || 0,
        delivered: 0,
        opened: 0,
        converted: 0,
        lastEdited: new Date().toISOString(),
        createdFrom: recommendationId || undefined,
      };
    }

    // Save to localStorage
    saveCampaign(newCampaign);

    // Redirect to campaigns page Active tab
    router.push('/campaigns?tab=active');
  };

  // State for slider value in STR workflow
  const [sliderValue, setSliderValue] = useState(50);

  // Generate STR-specific thinking steps based on user selections
  const generateSTRThinkingSteps = () => {
    const revenueValue = (81.2 - (sliderValue / 100) * 10.1).toFixed(1);
    const renewalRate = Math.round(67 + (sliderValue / 100) * 20);
    const isRevenueFocused = sliderValue < 40;
    const isRenewalFocused = sliderValue > 60;

    return [
      {
        genericText: "Analyzing season ticket holder data...",
        specificText: `Identifying 9,345 season ticket holders eligible for renewal`,
        reasoning: "Understanding the full renewal pool to segment appropriately",
        delay: 800,
        duration: 1800,
        transitionDelay: 900
      },
      {
        genericText: "Segmenting member base...",
        specificText: `Creating ${isRevenueFocused ? 'premium-focused' : isRenewalFocused ? 'retention-focused' : 'balanced'} segments based on tenure, engagement, and value`,
        reasoning: "Tailoring strategy to prioritize " + (isRevenueFocused ? "revenue generation" : isRenewalFocused ? "renewal rates" : "both objectives"),
        delay: 2700,
        duration: 1800,
        transitionDelay: 900
      },
      {
        genericText: "Calculating pricing strategy...",
        specificText: checkboxSelections.cappingPrice
          ? `Setting pricing with ${priceCapPercentage || '0'}% maximum increase cap`
          : `Optimizing pricing to target $${revenueValue}MM revenue`,
        reasoning: checkboxSelections.cappingPrice
          ? "Ensuring member affordability while maintaining revenue goals"
          : "Balancing revenue targets with market competitiveness",
        delay: 4600,
        duration: 1800,
        transitionDelay: 900
      },
      {
        genericText: "Designing member communications...",
        specificText: `Creating personalized messaging for ${checkboxSelections.longtimeMembers ? 'longtime loyalty recognition' : 'value-based positioning'}`,
        reasoning: "Building emotional connection with season ticket holders",
        delay: 6500,
        duration: 1900,
        transitionDelay: 900
      },
      {
        genericText: "Planning upsell opportunities...",
        specificText: (checkboxSelections.upsellingQuarterToHalf || checkboxSelections.upsellingHalfToFull)
          ? `Targeting ${checkboxSelections.upsellingQuarterToHalf && checkboxSelections.upsellingHalfToFull ? 'quarter-to-half and half-to-full' : checkboxSelections.upsellingQuarterToHalf ? 'quarter-to-half' : 'half-to-full'} conversion paths`
          : `Identifying upgrade opportunities across membership tiers`,
        reasoning: "Maximizing lifetime value through tier progression",
        delay: 8500,
        duration: 1800,
        transitionDelay: 900
      },
      {
        genericText: "Finalizing campaign structure...",
        specificText: `Targeting ${renewalRate}% renewal rate with $${revenueValue}MM projected revenue`,
        reasoning: "Aligning all campaign elements with strategic objectives",
        delay: 10400,
        duration: 1900,
        transitionDelay: 900
      }
    ];
  };

  const strThinkingSteps = isSTRWorkflow ? generateSTRThinkingSteps() : [];

  // Generate Pricing-specific thinking steps
  const generatePricingThinkingSteps = () => {
    const revenueValue = (112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1);
    const sellThrough = Math.round(78 + (pricingSliderValue / 100) * 17);
    const tierLabel = tierStructure === 'conservative' ? '3' : tierStructure === 'balanced' ? '4' : '5';
    const packageCount = Object.values(selectedPackages).filter(Boolean).length;

    return [
      {
        genericText: "Analyzing historical ticket data...",
        specificText: `Analyzing 3 seasons of data for 18,200 seats across 41 home games`,
        reasoning: "Reviewing sell-through rates, revenue by package type, and secondary market performance to establish pricing baselines",
        delay: 800,
        duration: 1800,
        transitionDelay: 900,
      },
      {
        genericText: "Classifying home games into demand tiers...",
        specificText: `Classifying 41 home games into ${tierLabel} demand tiers based on opponent strength, day of week, and historical demand`,
        reasoning: `Using ${tierStructure} tiering to ${tierStructure === 'aggressive' ? 'maximize revenue capture with granular pricing' : tierStructure === 'conservative' ? 'keep pricing simple and fan-friendly' : 'balance revenue optimization with simplicity'}`,
        delay: 2700,
        duration: 1800,
        transitionDelay: 900,
      },
      {
        genericText: "Calculating per-seat pricing...",
        specificText: `Calculating per-seat, per-game pricing across 6 arena price levels${pricingConstraints.capYoY ? ` with ${maxYoYIncrease}% max YoY increase cap` : ''}`,
        reasoning: `Optimizing for ${pricingSliderValue < 40 ? 'revenue generation' : pricingSliderValue > 60 ? 'attendance maximization' : 'balanced revenue and attendance'}, applying pricing constraints`,
        delay: 4600,
        duration: 1800,
        transitionDelay: 900,
      },
      {
        genericText: "Modeling package discount ladder...",
        specificText: `Modeling discount ladder across ${packageCount} package types`,
        reasoning: "Full season holders receive 25% per-game discount; discount tapers to ensure commitment incentive at every tier",
        delay: 6500,
        duration: 1900,
        transitionDelay: 900,
      },
      {
        genericText: "Running cannibalization analysis...",
        specificText: selectedPackages.fiveGame || selectedPackages.flex
          ? `Running cannibalization analysis for new ${[selectedPackages.fiveGame && '5-game', selectedPackages.flex && 'flex'].filter(Boolean).join(' and ')} plan impact`
          : "Validating package migration projections against historical data",
        reasoning: selectedPackages.fiveGame || selectedPackages.flex
          ? "Estimating net revenue impact of new package type introduction on existing plan holders"
          : "Confirming current package mix optimizes revenue across all tiers",
        delay: 8500,
        duration: 1800,
        transitionDelay: 900,
      },
      {
        genericText: "Finalizing pricing manifest...",
        specificText: `Finalizing pricing manifest and projecting $${revenueValue}MM total ticket revenue at ${sellThrough}% sell-through`,
        reasoning: `Locking ${tierLabel} game tiers, ${packageCount} package types, and go-to-market timeline for Jun 1 on-sale`,
        delay: 10400,
        duration: 1900,
        transitionDelay: 900,
      },
    ];
  };

  const pricingThinkingSteps = isPricingWorkflow ? generatePricingThinkingSteps() : [];

  // Generate Pricing campaign content
  const generatePricingCampaignContent = () => {
    const revenueValue = (112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1);
    const sellThrough = Math.round(78 + (pricingSliderValue / 100) * 17);
    const isRevenueFocused = pricingSliderValue < 40;
    const isAttendanceFocused = pricingSliderValue > 60;
    const tierLabel = tierStructure === 'conservative' ? '3' : tierStructure === 'balanced' ? '4' : '5';
    const packageCount = Object.values(selectedPackages).filter(Boolean).length;

    const tierDistributions: Record<string, { name: string; games: number; multiplier: string }[]> = {
      conservative: [
        { name: 'Standard', games: 18, multiplier: '1.0x' },
        { name: 'Premium', games: 14, multiplier: isRevenueFocused ? '1.35x' : '1.25x' },
        { name: 'Marquee', games: 9, multiplier: isRevenueFocused ? '1.75x' : '1.55x' },
      ],
      balanced: [
        { name: 'Value', games: 8, multiplier: isAttendanceFocused ? '0.65x' : '0.70x' },
        { name: 'Standard', games: 15, multiplier: '1.0x' },
        { name: 'Premium', games: 11, multiplier: isRevenueFocused ? '1.35x' : '1.25x' },
        { name: 'Marquee', games: 7, multiplier: isRevenueFocused ? '1.75x' : '1.60x' },
      ],
      aggressive: [
        { name: 'Value', games: 5, multiplier: isAttendanceFocused ? '0.60x' : '0.65x' },
        { name: 'Standard', games: 12, multiplier: '1.0x' },
        { name: 'Premium', games: 12, multiplier: isRevenueFocused ? '1.35x' : '1.25x' },
        { name: 'Marquee', games: 8, multiplier: isRevenueFocused ? '1.80x' : '1.65x' },
        { name: 'Platinum', games: 4, multiplier: isRevenueFocused ? '2.10x' : '1.90x' },
      ],
    };

    const priceLevels = [
      { level: 'Courtside', sections: 'Rows 1-3', base: 485 },
      { level: 'Lower Premium', sections: 'Sec 101-108', base: 145 },
      { level: 'Lower Standard', sections: 'Sec 109-120', base: 95 },
      { level: 'Club Level', sections: 'Sec 201-210', base: 120 },
      { level: 'Upper Premium', sections: 'Sec 301-308', base: 55 },
      { level: 'Upper Standard', sections: 'Sec 309-320', base: 32 },
    ];

    const discounts: Record<string, number> = {
      fullSeason: 0.25,
      halfSeason: 0.18,
      quarterSeason: 0.12,
      fiveGame: 0.07,
      flex: 0.05,
      singleGame: 0,
    };

    const packageLabels: Record<string, string> = {
      fullSeason: 'Full Season (41)',
      halfSeason: 'Half Season (20)',
      quarterSeason: 'Quarter (10)',
      fiveGame: '5-Game Mini',
      flex: `Flex (${flexConfig.gameCount})`,
      singleGame: 'Single Game',
    };

    const activePackageKeys = Object.entries(selectedPackages)
      .filter(([key, val]) => val && key !== 'group')
      .map(([key]) => key);

    return {
      tiers: tierDistributions[tierStructure],
      priceLevels,
      discounts,
      packageLabels,
      activePackageKeys,
      revenueValue,
      sellThrough,
      tierLabel,
      packageCount,
      isRevenueFocused,
      isAttendanceFocused,
      intro: `Based on your ${isRevenueFocused ? 'revenue-focused' : isAttendanceFocused ? 'attendance-focused' : 'balanced'} strategy, I've configured on-sale pricing across 18,200 seats and 41 home games using ${tierLabel} demand tiers and ${packageCount} package types. ${pricingConstraints.capYoY ? `Year-over-year price increases are capped at ${maxYoYIncrease}%.` : ''} ${pricingConstraints.maintainLadder ? 'The discount ladder ensures full season holders always pay the least per game.' : ''} Projected total ticket revenue: $${revenueValue}MM at ${sellThrough}% sell-through.`,

      strategy: `The ${tierStructure} tiering structure distributes games across ${tierLabel} demand levels based on opponent strength, day of week, and historical attendance. ${isRevenueFocused ? 'Revenue-optimized multipliers widen the spread between value and marquee games to capture maximum willingness-to-pay on premium matchups.' : isAttendanceFocused ? 'Attendance-optimized multipliers narrow the spread to keep even marquee games accessible, prioritizing sellouts and atmosphere.' : 'Balanced multipliers provide healthy revenue capture while keeping pricing accessible across the schedule.'}`,

      cannibalization: selectedPackages.fiveGame || selectedPackages.flex
        ? `Introducing ${[selectedPackages.fiveGame && 'the 5-Game Mini Plan' , selectedPackages.flex && 'Flex Plans'].filter(Boolean).join(' and ')} creates some migration risk from existing partial plan holders. Our analysis projects approximately 6-8% of current quarter season holders may downgrade to a 5-game plan, offset by an estimated 340 net-new 5-game plan buyers who would not have purchased a larger commitment. Net revenue impact: +$1.2MM from expanded buyer base.`
        : null,

      conclusion: `With ${tierLabel}-tier game classification, ${packageCount} package types, and the go-to-market timeline launching season plans April 1st through single game on-sale June 1st, this pricing configuration projects $${revenueValue}MM in total ticket revenue at ${sellThrough}% average sell-through. ${pricingConstraints.capYoY ? `The ${maxYoYIncrease}% YoY cap protects fan relationships while still growing revenue. ` : ''}Key risks include secondary market undercutting on low-demand games${selectedPackages.fiveGame ? ' and cannibalization from the new 5-game plan' : ''}. Dynamic pricing rules for single game tickets will adjust in real-time based on demand velocity.`,
    };
  };

  // Generate STR campaign content based on user selections
  const generateSTRCampaignContent = () => {
    const revenueValue = (81.2 - (sliderValue / 100) * 10.1).toFixed(1);
    const renewalRate = Math.round(67 + (sliderValue / 100) * 20);
    const isRevenueFocused = sliderValue < 40;
    const isRenewalFocused = sliderValue > 60;
    const targetAccounts = 9345;

    // Build segment list based on selections
    const segments = [];

    if (checkboxSelections.longtimeMembers) {
      segments.push({
        segment: "Longtime Loyalists (10+ Years)",
        accounts: "1,400",
        pricing: checkboxSelections.cappingPrice ? `Standard + ${priceCapPercentage || 0}% max` : "Premium Pricing",
        conversion: "96%",
        messaging: "Recognition of loyalty with exclusive perks and playoff priority"
      });
    }

    segments.push({
      segment: "Engaged Renewals (High Attendance)",
      accounts: isRevenueFocused ? "3,850" : "4,500",
      pricing: checkboxSelections.cappingPrice ? `+${priceCapPercentage || 0}% cap` : isRevenueFocused ? "+15% increase" : "+8% increase",
      conversion: isRenewalFocused ? "94%" : "89%",
      messaging: "Thank you messaging with early bird savings and seat protection"
    });

    if (checkboxSelections.upsellingQuarterToHalf) {
      segments.push({
        segment: "Quarter → Half Season Upsell",
        accounts: "945",
        pricing: "Tiered upgrade incentive",
        conversion: "42%",
        messaging: "More games, more value - upgrade to half season with discount"
      });
    }

    if (checkboxSelections.upsellingHalfToFull) {
      segments.push({
        segment: "Half → Full Season Upsell",
        accounts: "650",
        pricing: "Premium tier transition",
        conversion: "38%",
        messaging: "Complete experience with full season benefits and playoff access"
      });
    }

    segments.push({
      segment: "At-Risk Members (Low Engagement)",
      accounts: isRevenueFocused ? "1,550" : "2,400",
      pricing: checkboxSelections.cappingPrice ? `Flexible, ${priceCapPercentage || 0}% max` : "Incentivized pricing",
      conversion: isRenewalFocused ? "78%" : "64%",
      messaging: "Win-back offers with payment plans and added value"
    });

    if (checkboxSelections.crossSellAtRisk) {
      segments.push({
        segment: "Non-Renewals → Single Game Subs",
        accounts: "950",
        pricing: "Subscription conversion",
        conversion: "52%",
        messaging: "Stay connected with flexible game packages"
      });
    }

    return {
      intro: `Based on your ${isRevenueFocused ? 'revenue-focused' : isRenewalFocused ? 'renewal-focused' : 'balanced'} strategy targeting ${renewalRate}% renewal rate and $${revenueValue}MM in revenue, I've created a comprehensive Season Ticket Renewal campaign for ${targetAccounts} eligible holders.${checkboxSelections.cappingPrice ? ` With your ${priceCapPercentage || 0}% price increase cap,` : ''} This multi-segment approach${checkboxSelections.longtimeMembers ? ' prioritizes longtime member recognition' : ''} while ${checkboxSelections.upsellingQuarterToHalf || checkboxSelections.upsellingHalfToFull ? 'creating strategic upsell paths' : 'maximizing renewals across all tiers'}.`,

      segments,

      strategy: `This segmentation strategy ensures each member receives relevant messaging based on their engagement level and tenure. ${checkboxSelections.longtimeMembers ? 'Longtime members receive premium recognition and exclusive playoff access priority, building emotional loyalty.' : 'High-engagement holders get value-based positioning with early bird savings.'} ${checkboxSelections.cappingPrice ? `The ${priceCapPercentage || 0}% price cap maintains affordability while protecting revenue targets.` : ''} ${checkboxSelections.upsellingQuarterToHalf || checkboxSelections.upsellingHalfToFull ? 'Upsell paths create natural tier progression opportunities.' : ''}`,

      testing: `To optimize performance, we'll implement A/B testing across key campaign elements: subject line variations (recognition vs. urgency), send time optimization (weekday vs. weekend), and pricing presentation (savings vs. value).${checkboxSelections.cappingPrice ? ' The price cap messaging will be tested for clarity and acceptance.' : ''} Mobile-first design ensures seamless renewal across all devices.`,

      inventory: `Channel orchestration begins with email to all segments, followed by SMS reminders 7 days before deadline. ${checkboxSelections.crossSellAtRisk ? 'Non-renewing members receive targeted subscription offers via retargeting campaigns.' : ''} Multiple payment plans are offered: ${[
        paymentPlans.plan1 && '10% upfront with 12 monthly payments',
        paymentPlans.plan2 && '15% upfront with 9 monthly payments (recommended)',
        paymentPlans.plan3 && '10% upfront with 6 payments'
      ].filter(Boolean).join(', ') || 'flexible payment options'}. ${requireFullUpfront ? 'Fans who missed payment deadlines last season must pay in full upfront to ensure commitment.' : 'All fans, including those who missed deadlines, have access to payment plans to maximize inclusivity.'} Automated billing reduces friction across all tiers.`,

      conclusion: `With projected ${renewalRate}% retention and $${revenueValue}MM in revenue, this campaign balances${isRevenueFocused ? ' revenue generation' : isRenewalFocused ? ' member satisfaction' : ' strategic objectives'} while maintaining strong fan relationships. ${checkboxSelections.upsellingQuarterToHalf || checkboxSelections.upsellingHalfToFull ? 'Upsell opportunities add' : 'Segment-specific messaging drives'} incremental value beyond base renewals.${(optOutOptions.discountCredits || optOutOptions.offerHalfQuarter || optOutOptions.freeUpgrades) ? ` For fans opting out of auto-renewal, we've prepared retention offers including ${[
        optOutOptions.discountCredits && 'credit-based discounts',
        optOutOptions.offerHalfQuarter && 'partial season plan alternatives',
        optOutOptions.freeUpgrades && '3 free seat upgrades'
      ].filter(Boolean).join(', ')} to maintain engagement.` : ''} Launch immediately to maximize${checkboxSelections.longtimeMembers ? ' loyalty recognition impact' : ' early bird participation'}.`
    };
  };

  useEffect(() => {
    if (!isSTRWorkflow && !isPricingWorkflow) {
      // Original thinking animation logic
      setTimeout(() => setIsVisible(true), 100);
      setTimeout(() => setIsThinking(true), 800);

      thinkingSteps.forEach((step, index) => {
        setTimeout(() => {
          setActiveStep(index);
        }, step.delay);

        setTimeout(() => {
          setTransitionedSteps(prev => [...prev, index]);
        }, step.delay + step.transitionDelay);

        setTimeout(() => {
          setCompletedSteps(prev => [...prev, index]);
          if (index < thinkingSteps.length - 1) {
            setActiveStep(index + 1);
          }
        }, step.delay + step.duration);
      });

      setTimeout(() => {
        setIsThinking(false);
        setShowText(true);
      }, 11100);

      setTimeout(() => {
        setShowSidebar(true);
      }, 11600);

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isSTRWorkflow, isPricingWorkflow]);

  // Handle STR campaign generation
  useEffect(() => {
    if (generatingCampaign && strThinkingSteps.length > 0) {
      setTimeout(() => setIsThinking(true), 500);

      strThinkingSteps.forEach((step, index) => {
        setTimeout(() => {
          setActiveStep(index);
        }, step.delay);

        setTimeout(() => {
          setTransitionedSteps(prev => [...prev, index]);
        }, step.delay + step.transitionDelay);

        setTimeout(() => {
          setCompletedSteps(prev => [...prev, index]);
          if (index < strThinkingSteps.length - 1) {
            setActiveStep(index + 1);
          }
        }, step.delay + step.duration);
      });

      setTimeout(() => {
        setIsThinking(false);
        setShowText(true);
      }, 12400);

      setTimeout(() => {
        setShowSidebar(true);
      }, 12900);
    }
  }, [generatingCampaign]);

  // Handle Pricing campaign generation
  useEffect(() => {
    if (generatingPricingCampaign) {
      const steps = generatePricingThinkingSteps();
      setTimeout(() => setIsThinking(true), 500);

      steps.forEach((step, index) => {
        setTimeout(() => setActiveStep(index), step.delay);
        setTimeout(() => setTransitionedSteps(prev => [...prev, index]), step.delay + step.transitionDelay);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, index]);
          if (index < steps.length - 1) setActiveStep(index + 1);
        }, step.delay + step.duration);
      });

      setTimeout(() => {
        setIsThinking(false);
        setShowText(true);
      }, 12400);

      setTimeout(() => setShowSidebar(true), 12900);
    }
  }, [generatingPricingCampaign]);

  return (
    <div className="h-[calc(100vh-56px)] flex relative" style={{
      backgroundImage: 'linear-gradient(135deg, rgba(76, 101, 240, 0.02) 0%, rgba(204, 255, 0, 0.01) 100%)'
    }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-[624px] mx-auto space-y-6">
            {/* User Message - Only show for non-STR and non-Pricing workflows */}
            {!isAnySTRWorkflow && !isAnyPricingWorkflow && (
              <div
                className="flex justify-end transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="bg-[#f4f4f4] rounded-[20px] px-4 py-3 max-w-[488px]">
                  {recommendation && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[rgba(0,0,0,0.1)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="url(#msg-sparkle-gradient)">
                        <defs>
                          <linearGradient id="msg-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4c65f0" />
                            <stop offset="100%" stopColor="#657dff" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                      </svg>
                      <span className="text-xs font-semibold text-[#4c65f0] tracking-tight">AI Recommendation</span>
                    </div>
                  )}
                  <p className="text-sm text-black leading-[22px] tracking-tight">
                    {userMessage}
                  </p>
                </div>
              </div>
            )}

            {/* STR Workflow - Greeting */}
            {isAnySTRWorkflow && (
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                {/* AI Greeting Message */}
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-4">
                    Hi there, let's get started
                  </p>
                  {showHistoricalTable && (
                    <p className="text-base text-[rgba(0,0,0,0.75)] leading-[26px] tracking-tight mb-4">
                      As a reminder, here's your renewal performance for the past 3 seasons:
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STR Workflow - Historical Performance Table */}
            {isAnySTRWorkflow && showHistoricalTable && (
              <div
                className="transition-all duration-700 mb-6"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* Historical Performance Table */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)]">
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Season</th>
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Renewal Rate</th>
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Full Season</th>
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Half Season</th>
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Flex Plans</th>
                          <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[rgba(0,0,0,0.08)]">
                          <td className="px-4 py-3 font-medium text-black">2023</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">74%</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$38.2MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$12.8MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$6.9MM</td>
                          <td className="px-4 py-3 font-semibold text-black">$57.9MM</td>
                        </tr>
                        <tr className="border-b border-[rgba(0,0,0,0.08)]">
                          <td className="px-4 py-3 font-medium text-black">2024</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">76%</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$42.1MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$14.5MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$7.8MM</td>
                          <td className="px-4 py-3 font-semibold text-black">$64.4MM</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-black">2025</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">79%</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$46.8MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$16.2MM</td>
                          <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$8.4MM</td>
                          <td className="px-4 py-3 font-semibold text-black">$71.4MM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </div>
            )}

            {/* STR Workflow - Goal Question and Slider */}
            {isAnySTRWorkflow && showGoalQuestion && (
              <div
                className="transition-all duration-700"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* Goal Question */}
                <div className="mb-6">
                  <p className="text-base text-[rgba(0,0,0,0.75)] leading-[26px] tracking-tight">
                    What is your goal for this upcoming season?
                  </p>
                </div>

                {/* Slider Container */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-8">
                  {/* Labels */}
                  <div className="flex justify-between items-start">
                    <div className="text-left max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">
                        Maximize Revenue
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">
                        Focus on higher pricing for premium inventory
                      </div>
                    </div>
                    <div className="text-right max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">
                        Maximize Renewals
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">
                        Focus on retention rate and fan perceived value
                      </div>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-[#4c65f0] to-[#ccff00] rounded-full appearance-none cursor-pointer slider-custom"
                      style={{
                        background: `linear-gradient(to right, #4c65f0 0%, #ccff00 100%)`
                      }}
                      disabled={sliderSubmitted}
                    />
                  </div>

                  {/* Dynamic Metrics */}
                  <div className="flex justify-center gap-16 pt-4">
                    {/* Forecasted Revenue */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[rgba(0,0,0,0.5)] tracking-tight mb-2">
                        Forecasted Revenue
                      </div>
                      <div className="text-3xl font-bold text-black tracking-tight">
                        ${(81.2 - (sliderValue / 100) * 10.1).toFixed(1)}MM
                      </div>
                    </div>

                    {/* Renewal Rates */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[rgba(0,0,0,0.5)] tracking-tight mb-2">
                        Forecasted Renewal Rate
                      </div>
                      <div className="text-3xl font-bold text-black tracking-tight">
                        {Math.round(67 + (sliderValue / 100) * 20)}%
                      </div>
                    </div>
                  </div>

                  {/* Continue Button - Hide after submission */}
                  {!sliderSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setSliderSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STR Workflow - Additional Preferences Step 2 */}
            {isAnySTRWorkflow && sliderSubmitted && (
              <div
                className="transition-all duration-700"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* AI Question */}
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    What else is important to you?
                  </p>
                </div>

                {/* Checkbox Options Card */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-6">
                  {/* Renewals of longtime members */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkboxSelections.longtimeMembers}
                      onChange={(e) => setCheckboxSelections({...checkboxSelections, longtimeMembers: e.target.checked})}
                      disabled={preferencesSubmitted || generatingCampaign}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Renewals of longtime members
                    </span>
                  </label>

                  {/* Capping Maximum Price Increase */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checkboxSelections.cappingPrice}
                        onChange={(e) => setCheckboxSelections({...checkboxSelections, cappingPrice: e.target.checked})}
                        disabled={generatingCampaign}
                        className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                        Capping Maximum Price Increase
                      </span>
                    </label>

                    {/* Price Cap Input - Only show when checkbox is checked */}
                    {checkboxSelections.cappingPrice && (
                      <div className="ml-8 flex items-center gap-3">
                        <label htmlFor="priceCapInput" className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                          Maximum increase:
                        </label>
                        <div className="relative">
                          <input
                            id="priceCapInput"
                            type="number"
                            min="0"
                            max="99"
                            value={priceCapPercentage}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 99)) {
                                setPriceCapPercentage(val);
                              }
                            }}
                            disabled={preferencesSubmitted || generatingCampaign}
                            placeholder="0"
                            className="w-20 px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded text-base text-black focus:outline-none focus:border-[#4c65f0] focus:border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-[rgba(0,0,0,0.5)]">
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upselling Quarter to Half */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkboxSelections.upsellingQuarterToHalf}
                      onChange={(e) => setCheckboxSelections({...checkboxSelections, upsellingQuarterToHalf: e.target.checked})}
                      disabled={preferencesSubmitted || generatingCampaign}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Upselling from Quarter to Half Season
                    </span>
                  </label>

                  {/* Upselling Half to Full */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkboxSelections.upsellingHalfToFull}
                      onChange={(e) => setCheckboxSelections({...checkboxSelections, upsellingHalfToFull: e.target.checked})}
                      disabled={preferencesSubmitted || generatingCampaign}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Upselling from Half to Full Season
                    </span>
                  </label>

                  {/* Cross Sell Subscriptions to At Risk Accounts */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkboxSelections.crossSellAtRisk}
                      onChange={(e) => setCheckboxSelections({...checkboxSelections, crossSellAtRisk: e.target.checked})}
                      disabled={preferencesSubmitted || generatingCampaign}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Cross Sell Subscriptions to At Risk Accounts
                    </span>
                  </label>

                  {/* Continue Button - Hide after submission */}
                  {!preferencesSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setPreferencesSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STR Workflow - Payment Plans Step 3 */}
            {isAnySTRWorkflow && preferencesSubmitted && (
              <div
                className="transition-all duration-700"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* AI Question */}
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    What kind of payment plans do you want to make available?
                  </p>
                </div>

                {/* Payment Plans Table */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-6">
                  <div className="space-y-4">
                    {/* Plan 1: 10% upfront, 12 monthly */}
                    <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-lg hover:bg-[rgba(76,101,240,0.03)] transition-colors">
                      <input
                        type="checkbox"
                        checked={paymentPlans.plan1}
                        onChange={(e) => setPaymentPlans({...paymentPlans, plan1: e.target.checked})}
                        disabled={paymentPlansSubmitted}
                        className="w-5 h-5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <div className="text-base font-semibold text-black tracking-tight">
                          10% upfront, with 12 equal monthly payments
                        </div>
                        <div className="text-sm text-[rgba(0,0,0,0.5)] mt-1">
                          Lowest initial commitment, spread over full year
                        </div>
                      </div>
                    </label>

                    {/* Plan 2: 15% upfront, 9 monthly [Recommended] */}
                    <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-lg hover:bg-[rgba(76,101,240,0.03)] transition-colors border-2 border-[#4c65f0] bg-[rgba(76,101,240,0.02)]">
                      <input
                        type="checkbox"
                        checked={paymentPlans.plan2}
                        onChange={(e) => setPaymentPlans({...paymentPlans, plan2: e.target.checked})}
                        disabled={paymentPlansSubmitted}
                        className="w-5 h-5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-base font-semibold text-black tracking-tight">
                            15% upfront with 9 equal payments
                          </div>
                          <span className="text-xs font-bold text-[#4c65f0] bg-[rgba(76,101,240,0.1)] px-2 py-1 rounded">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="text-sm text-[rgba(0,0,0,0.5)] mt-1">
                          Balanced commitment, completed before season ends
                        </div>
                      </div>
                    </label>

                    {/* Plan 3: 10% upfront, 6 payments */}
                    <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-lg hover:bg-[rgba(76,101,240,0.03)] transition-colors">
                      <input
                        type="checkbox"
                        checked={paymentPlans.plan3}
                        onChange={(e) => setPaymentPlans({...paymentPlans, plan3: e.target.checked})}
                        disabled={paymentPlansSubmitted}
                        className="w-5 h-5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <div className="text-base font-semibold text-black tracking-tight">
                          10% upfront with 6 equal payments
                        </div>
                        <div className="text-sm text-[rgba(0,0,0,0.5)] mt-1">
                          Higher monthly amount, faster payoff timeline
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Continue Button */}
                  {!paymentPlansSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setPaymentPlansSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STR Workflow - Full Upfront Payment Question */}
            {isAnySTRWorkflow && paymentPlansSubmitted && (
              <div
                className="transition-all duration-700 mt-6"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* AI Question */}
                <div className="mb-4">
                  <p className="text-base text-black leading-[26px] tracking-tight">
                    Require full upfront payment for fans who missed payment deadlines last season?
                  </p>
                </div>

                {/* Yes/No Buttons or Selected Answer */}
                {requireFullUpfront === null ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setRequireFullUpfront(true)}
                      className="flex-1 bg-white border-2 border-[rgba(0,0,0,0.15)] hover:border-[#4c65f0] hover:bg-[rgba(76,101,240,0.03)] text-black px-8 py-4 rounded-xl font-semibold text-base tracking-tight transition-all"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setRequireFullUpfront(false)}
                      className="flex-1 bg-white border-2 border-[rgba(0,0,0,0.15)] hover:border-[#4c65f0] hover:bg-[rgba(76,101,240,0.03)] text-black px-8 py-4 rounded-xl font-semibold text-base tracking-tight transition-all"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="bg-[rgba(76,101,240,0.05)] border border-[rgba(76,101,240,0.2)] rounded-xl px-6 py-4">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="#4c65f0">
                        <path d="M10 2L10 14M10 2L6 6M10 2L14 6" stroke="#4c65f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-base font-semibold text-[#4c65f0] tracking-tight">
                        {requireFullUpfront ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STR Workflow - Opt-Out Options */}
            {isAnySTRWorkflow && requireFullUpfront !== null && (
              <div
                className="transition-all duration-700 mt-6"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                {/* AI Question */}
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    For fans who opt out of auto-renewal, what options do you want to provide to them?
                  </p>
                </div>

                {/* Opt-Out Options Card */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-6">
                  {/* Option 1: Discount equivalent to unused credits */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={optOutOptions.discountCredits}
                      onChange={(e) => setOptOutOptions({...optOutOptions, discountCredits: e.target.checked})}
                      disabled={optOutSubmitted}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Offer discount equivalent to unused credits from prior season
                    </span>
                  </label>

                  {/* Option 2: Half or quarter season plans */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={optOutOptions.offerHalfQuarter}
                      onChange={(e) => setOptOutOptions({...optOutOptions, offerHalfQuarter: e.target.checked})}
                      disabled={optOutSubmitted}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Offer half or quarter season plans on the same seat
                    </span>
                  </label>

                  {/* Option 3: Free upgrades */}
                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg hover:bg-[rgba(76,101,240,0.03)] transition-colors border-2 border-[#4c65f0] bg-[rgba(76,101,240,0.02)]">
                    <input
                      type="checkbox"
                      checked={optOutOptions.freeUpgrades}
                      onChange={(e) => setOptOutOptions({...optOutOptions, freeUpgrades: e.target.checked})}
                      disabled={optOutSubmitted}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                          Offer 3 free upgrades to next best price level
                        </span>
                        <span className="text-xs font-bold text-[#4c65f0] bg-[rgba(76,101,240,0.1)] px-2 py-1 rounded">
                          RECOMMENDED
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Continue Button */}
                  {!optOutSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => {
                          setOptOutSubmitted(true);
                          setGeneratingCampaign(true);
                          setSelectedGoal(`slider-${sliderValue}`);
                        }}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================================ */}
            {/* PRICING WORKFLOW STEPS          */}
            {/* ================================ */}

            {/* Pricing Workflow - Greeting */}
            {isAnyPricingWorkflow && (
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-4">
                    Hi there, let's configure your on-sale pricing and packaging
                  </p>
                  {showPricingHistoricalTable && (
                    <p className="text-base text-[rgba(0,0,0,0.75)] leading-[26px] tracking-tight mb-4">
                      Here's your ticket revenue performance and sell-through for the past 3 seasons:
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Workflow - Historical Performance Table */}
            {isAnyPricingWorkflow && showPricingHistoricalTable && (
              <div className="transition-all duration-700 mb-6" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)]">
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Season</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Avg Sell-Through</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Single Game</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Flex Plans</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Partial Plans</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Full Season</th>
                        <th className="text-left px-4 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Total Rev</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[rgba(0,0,0,0.08)]">
                        <td className="px-4 py-3 font-medium text-black">2023</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">81%</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$14.2MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$6.9MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$19.7MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$38.2MM</td>
                        <td className="px-4 py-3 font-semibold text-black">$79.0MM</td>
                      </tr>
                      <tr className="border-b border-[rgba(0,0,0,0.08)]">
                        <td className="px-4 py-3 font-medium text-black">2024</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">84%</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$16.8MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$7.8MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$22.3MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$42.1MM</td>
                        <td className="px-4 py-3 font-semibold text-black">$89.0MM</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-black">2025</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">87%</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$19.1MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$8.4MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$24.6MM</td>
                        <td className="px-4 py-3 text-[rgba(0,0,0,0.75)]">$46.8MM</td>
                        <td className="px-4 py-3 font-semibold text-black">$98.9MM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Secondary market insight */}
                <div className="bg-[rgba(76,101,240,0.04)] border border-[rgba(76,101,240,0.15)] rounded-lg px-4 py-3 mb-6">
                  <p className="text-sm text-[rgba(0,0,0,0.75)] tracking-tight">
                    <span className="font-semibold text-[#4c65f0]">Secondary market insight:</span> Avg 112% of face value across all games last season.
                    Top 10 games averaged 148% of face; bottom 10 averaged 74%.
                  </p>
                </div>
              </div>
            )}

            {/* Pricing Workflow - Goal Slider */}
            {isAnyPricingWorkflow && showPricingGoalQuestion && (
              <div className="transition-all duration-700" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="mb-6">
                  <p className="text-base text-[rgba(0,0,0,0.75)] leading-[26px] tracking-tight">
                    What is your primary goal for this season's on-sale?
                  </p>
                </div>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="text-left max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">Maximize Revenue</div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">Higher prices on premium inventory, accept lower fill rates</div>
                    </div>
                    <div className="text-right max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">Maximize Attendance</div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">Competitive pricing, prioritize sellouts and fan experience</div>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range" min="0" max="100"
                      value={pricingSliderValue}
                      onChange={(e) => setPricingSliderValue(parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer slider-custom"
                      style={{ background: 'linear-gradient(to right, #4c65f0 0%, #ccff00 100%)' }}
                      disabled={pricingSliderSubmitted}
                    />
                  </div>
                  <div className="flex justify-center gap-16 pt-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[rgba(0,0,0,0.5)] tracking-tight mb-2">Forecasted Total Revenue</div>
                      <div className="text-3xl font-bold text-black tracking-tight">
                        ${(112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1)}MM
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[rgba(0,0,0,0.5)] tracking-tight mb-2">Forecasted Avg Sell-Through</div>
                      <div className="text-3xl font-bold text-black tracking-tight">
                        {Math.round(78 + (pricingSliderValue / 100) * 17)}%
                      </div>
                    </div>
                  </div>
                  {!pricingSliderSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setPricingSliderSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Workflow - Package Selection */}
            {isAnyPricingWorkflow && pricingSliderSubmitted && (
              <div className="transition-all duration-700" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    Which package types do you want to offer this season?
                  </p>
                </div>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-4">
                  {[
                    { key: 'fullSeason', label: 'Full Season Plan (41 games)', desc: null, defaultOn: true },
                    { key: 'halfSeason', label: 'Half Season Plan (20 games)', desc: null, defaultOn: true },
                    { key: 'quarterSeason', label: 'Quarter Season Plan (10 games)', desc: null, defaultOn: true },
                    { key: 'fiveGame', label: '5-Game Mini Plan', desc: 'New offering — attracts first-time plan buyers', defaultOn: false },
                    { key: 'flex', label: 'Flex Plan (choose-your-own games)', desc: null, defaultOn: false },
                    { key: 'singleGame', label: 'Single Game Tickets', desc: null, defaultOn: true },
                    { key: 'group', label: 'Group Packages (15+ tickets)', desc: null, defaultOn: false },
                  ].map((pkg) => (
                    <div key={pkg.key}>
                      <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-[rgba(76,101,240,0.03)] transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPackages[pkg.key as keyof typeof selectedPackages]}
                          onChange={(e) => setSelectedPackages({ ...selectedPackages, [pkg.key]: e.target.checked })}
                          disabled={packagesSubmitted}
                          className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div>
                          <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                            {pkg.label}
                          </span>
                          {pkg.desc && (
                            <p className="text-sm text-[rgba(0,0,0,0.5)] mt-0.5">{pkg.desc}</p>
                          )}
                        </div>
                      </label>

                      {/* Flex config */}
                      {pkg.key === 'flex' && selectedPackages.flex && !packagesSubmitted && (
                        <div className="ml-11 mt-2 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[rgba(0,0,0,0.65)]">Games:</span>
                            <select
                              value={flexConfig.gameCount}
                              onChange={(e) => setFlexConfig({ ...flexConfig, gameCount: parseInt(e.target.value) })}
                              className="border border-[rgba(0,0,0,0.23)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#4c65f0]"
                            >
                              {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[rgba(0,0,0,0.65)]">Fan picks games?</span>
                            <button
                              onClick={() => setFlexConfig({ ...flexConfig, fanChoice: !flexConfig.fanChoice })}
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${flexConfig.fanChoice ? 'bg-[#4c65f0] text-white' : 'bg-[rgba(0,0,0,0.08)] text-black'}`}
                            >
                              {flexConfig.fanChoice ? 'Yes' : 'No'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Group min size */}
                      {pkg.key === 'group' && selectedPackages.group && !packagesSubmitted && (
                        <div className="ml-11 mt-2 flex items-center gap-2 text-sm">
                          <span className="text-[rgba(0,0,0,0.65)]">Min group size:</span>
                          <input
                            type="number" min="5" max="100"
                            value={groupMinSize}
                            onChange={(e) => setGroupMinSize(parseInt(e.target.value) || 15)}
                            className="w-16 border border-[rgba(0,0,0,0.23)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#4c65f0]"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {!packagesSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setPackagesSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Workflow - Game Tiering */}
            {isAnyPricingWorkflow && packagesSubmitted && (
              <div className="transition-all duration-700" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    How do you want to tier your home games for pricing purposes?
                  </p>
                </div>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-4">
                  {([
                    { value: 'conservative' as const, label: 'Conservative (3 tiers)', desc: 'Standard, Premium, Marquee — Simpler for fans; less revenue optimization', preview: 'Standard (18) • Premium (14) • Marquee (9)' },
                    { value: 'balanced' as const, label: 'Balanced (4 tiers)', desc: 'Value, Standard, Premium, Marquee — Good balance of simplicity and revenue capture', preview: 'Value (8) • Standard (15) • Premium (11) • Marquee (7)', recommended: true },
                    { value: 'aggressive' as const, label: 'Aggressive (5 tiers)', desc: 'Value, Standard, Premium, Marquee, Platinum — Maximum revenue optimization', preview: 'Value (5) • Standard (12) • Premium (12) • Marquee (8) • Platinum (4)' },
                  ]).map((tier) => (
                    <label
                      key={tier.value}
                      className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg transition-colors ${
                        tier.recommended && tierStructure === tier.value ? 'border-2 border-[#4c65f0] bg-[rgba(76,101,240,0.02)]' :
                        tierStructure === tier.value ? 'border-2 border-[#4c65f0] bg-[rgba(76,101,240,0.02)]' :
                        'border-2 border-transparent hover:bg-[rgba(76,101,240,0.03)]'
                      }`}
                    >
                      <input
                        type="radio" name="tierStructure"
                        checked={tierStructure === tier.value}
                        onChange={() => setTierStructure(tier.value)}
                        disabled={tierSubmitted}
                        className="w-5 h-5 mt-0.5 text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-black tracking-tight">{tier.label}</span>
                          {tier.recommended && (
                            <span className="text-xs font-bold text-[#4c65f0] bg-[rgba(76,101,240,0.1)] px-2 py-1 rounded">RECOMMENDED</span>
                          )}
                        </div>
                        <p className="text-sm text-[rgba(0,0,0,0.5)] mt-1">{tier.desc}</p>
                        {tierStructure === tier.value && (
                          <p className="text-sm text-[#4c65f0] mt-2 font-medium">{tier.preview}</p>
                        )}
                      </div>
                    </label>
                  ))}

                  {!tierSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setTierSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Workflow - Pricing Constraints */}
            {isAnyPricingWorkflow && tierSubmitted && (
              <div className="transition-all duration-700" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    What pricing constraints do you want to apply?
                  </p>
                </div>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-6">
                  {/* Cap YoY */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={pricingConstraints.capYoY}
                        onChange={(e) => setPricingConstraints({ ...pricingConstraints, capYoY: e.target.checked })}
                        disabled={constraintsSubmitted}
                        className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                        Cap year-over-year price increase
                      </span>
                    </label>
                    {pricingConstraints.capYoY && !constraintsSubmitted && (
                      <div className="ml-8 flex items-center gap-3">
                        <span className="text-sm text-[rgba(0,0,0,0.65)]">Maximum increase:</span>
                        <div className="relative">
                          <input type="number" min="0" max="50" value={maxYoYIncrease}
                            onChange={(e) => setMaxYoYIncrease(e.target.value)}
                            className="w-20 px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded text-base text-black focus:outline-none focus:border-[#4c65f0] focus:border-2"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-[rgba(0,0,0,0.5)]">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Floor Price */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={pricingConstraints.floorPrice}
                        onChange={(e) => setPricingConstraints({ ...pricingConstraints, floorPrice: e.target.checked })}
                        disabled={constraintsSubmitted}
                        className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                        Set a floor price (minimum per-ticket price)
                      </span>
                    </label>
                    {pricingConstraints.floorPrice && !constraintsSubmitted && (
                      <div className="ml-8 flex items-center gap-3">
                        <span className="text-sm text-[rgba(0,0,0,0.65)]">Minimum price:</span>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-[rgba(0,0,0,0.5)]">$</span>
                          <input type="number" min="1" max="100" value={floorPriceAmount}
                            onChange={(e) => setFloorPriceAmount(e.target.value)}
                            className="w-20 pl-7 pr-3 py-2 border border-[rgba(0,0,0,0.23)] rounded text-base text-black focus:outline-none focus:border-[#4c65f0] focus:border-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Match Secondary */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={pricingConstraints.matchSecondary}
                      onChange={(e) => setPricingConstraints({ ...pricingConstraints, matchSecondary: e.target.checked })}
                      disabled={constraintsSubmitted}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                        Price match or undercut secondary market for low-demand games
                      </span>
                      <p className="text-sm text-[rgba(0,0,0,0.5)] mt-0.5">Reduce unsold inventory by competing with resale market</p>
                    </div>
                  </label>

                  {/* Maintain Ladder */}
                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border-2 border-[#4c65f0] bg-[rgba(76,101,240,0.02)]">
                    <input
                      type="checkbox"
                      checked={pricingConstraints.maintainLadder}
                      onChange={(e) => setPricingConstraints({ ...pricingConstraints, maintainLadder: e.target.checked })}
                      disabled={constraintsSubmitted}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-black tracking-tight">Maintain season-plan discount ladder</span>
                        <span className="text-xs font-bold text-[#4c65f0] bg-[rgba(76,101,240,0.1)] px-2 py-1 rounded">RECOMMENDED</span>
                      </div>
                      <p className="text-sm text-[rgba(0,0,0,0.5)] mt-0.5">Full season holders always pay less per game than partial, flex, and single-game buyers</p>
                    </div>
                  </label>

                  {/* Premium Pricing */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={pricingConstraints.premiumPricing}
                        onChange={(e) => setPricingConstraints({ ...pricingConstraints, premiumPricing: e.target.checked })}
                        disabled={constraintsSubmitted}
                        className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                        Premium section pricing premium
                      </span>
                    </label>
                    {pricingConstraints.premiumPricing && !constraintsSubmitted && (
                      <div className="ml-8 flex items-center gap-3">
                        <span className="text-sm text-[rgba(0,0,0,0.65)]">Premium % over standard:</span>
                        <div className="relative">
                          <input type="number" min="0" max="200" value={premiumPct}
                            onChange={(e) => setPremiumPct(e.target.value)}
                            className="w-20 px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded text-base text-black focus:outline-none focus:border-[#4c65f0] focus:border-2"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-[rgba(0,0,0,0.5)]">%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!constraintsSubmitted && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setConstraintsSubmitted(true)}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Workflow - Benefits & Perks */}
            {isAnyPricingWorkflow && constraintsSubmitted && (
              <div className="transition-all duration-700" style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div className="mb-6">
                  <p className="text-base text-black leading-[26px] tracking-tight mb-6">
                    What benefits do you want to include with plan packages?
                  </p>
                </div>
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(0,0,0,0.1)]">
                        <th className="text-left px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Benefit</th>
                        {selectedPackages.fullSeason && <th className="text-center px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Full</th>}
                        {selectedPackages.halfSeason && <th className="text-center px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Half</th>}
                        {selectedPackages.quarterSeason && <th className="text-center px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Quarter</th>}
                        {selectedPackages.fiveGame && <th className="text-center px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">5-Game</th>}
                        {selectedPackages.flex && <th className="text-center px-3 py-3 font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Flex</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { key: 'playoffPriority', label: 'Playoff ticket priority' },
                        { key: 'seatUpgrades', label: 'Seat upgrade opportunities' },
                        { key: 'freeParking', label: 'Free parking passes' },
                        { key: 'merchCredit', label: 'Merchandise credit' },
                        { key: 'ticketExchange', label: 'Ticket exchange privileges' },
                        { key: 'memberEvents', label: 'Exclusive member events' },
                        { key: 'guestPasses', label: 'Guest pass allocation' },
                      ]).map((benefit) => (
                        <tr key={benefit.key} className="border-b border-[rgba(0,0,0,0.06)]">
                          <td className="px-3 py-3 text-black tracking-tight">{benefit.label}</td>
                          {(['fullSeason', 'halfSeason', 'quarterSeason', 'fiveGame', 'flex'] as const).map((pkg) =>
                            selectedPackages[pkg] ? (
                              <td key={pkg} className="text-center px-3 py-3">
                                <input
                                  type="checkbox"
                                  checked={benefitAllocations[benefit.key]?.[pkg] ?? false}
                                  onChange={(e) => {
                                    setBenefitAllocations((prev) => ({
                                      ...prev,
                                      [benefit.key]: { ...prev[benefit.key], [pkg]: e.target.checked },
                                    }));
                                  }}
                                  disabled={benefitsSubmitted}
                                  className="w-4 h-4 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                              </td>
                            ) : null
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {!benefitsSubmitted && (
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          setBenefitsSubmitted(true);
                          setGeneratingPricingCampaign(true);
                        }}
                        className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Thinking Module */}
            {isThinking && (
              <div className="bg-white/80 backdrop-blur-sm border border-[rgba(76,101,240,0.2)] rounded-2xl p-6 shadow-2xl animate-fade-in" style={{
                boxShadow: '0 20px 60px rgba(76, 101, 240, 0.15), 0 0 0 1px rgba(76, 101, 240, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4c65f0] to-[#657dff] flex items-center justify-center animate-pulse-glow">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M8 2L8 14M8 2L4 6M8 2L12 6M2 8h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#4c65f0] opacity-30 animate-ping"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black tracking-tight">
                      {generatingPricingCampaign ? 'Building Pricing Strategy' : 'Building Campaign Strategy'}
                    </h3>
                    <p className="text-xs text-[rgba(0,0,0,0.5)] tracking-tight">
                      Step {Math.min(activeStep + 1, (generatingPricingCampaign ? generatePricingThinkingSteps() : generatingCampaign ? strThinkingSteps : thinkingSteps).length)} of {(generatingPricingCampaign ? generatePricingThinkingSteps() : generatingCampaign ? strThinkingSteps : thinkingSteps).length}
                    </p>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-6 h-1.5 bg-[rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4c65f0] to-[#657dff] transition-all duration-500 ease-out"
                    style={{
                      width: `${((completedSteps.length) / (generatingPricingCampaign ? generatePricingThinkingSteps() : generatingCampaign ? strThinkingSteps : thinkingSteps).length) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="space-y-4">
                  {(generatingPricingCampaign ? generatePricingThinkingSteps() : generatingCampaign ? strThinkingSteps : thinkingSteps).map((step, index) => {
                    const isActive = activeStep === index;
                    const isCompleted = completedSteps.includes(index);
                    const hasTransitioned = transitionedSteps.includes(index);
                    const shouldShow = index <= activeStep || isCompleted;
                    const displayText = hasTransitioned ? step.specificText : step.genericText;

                    return shouldShow ? (
                      <div
                        key={index}
                        className="animate-slide-in-left"
                        style={{
                          opacity: isCompleted ? 0.5 : 1,
                          transition: 'opacity 0.3s'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0 mt-0.5">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-[#007a47] flex items-center justify-center animate-check-pop">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            ) : isActive ? (
                              <div className="w-5 h-5 rounded-full bg-[#4c65f0] flex items-center justify-center animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-[rgba(0,0,0,0.1)]"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm tracking-tight font-medium transition-all duration-500 mb-1 ${
                              isCompleted ? 'text-[rgba(0,0,0,0.45)]' : 'text-black'
                            }`}>
                              {displayText}
                            </p>
                            {hasTransitioned && (
                              <p className={`text-xs leading-relaxed tracking-tight animate-fade-in ${
                                isCompleted ? 'text-[rgba(0,0,0,0.35)]' : 'text-[rgba(76,101,240,0.8)]'
                              }`}>
                                {step.reasoning}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* STR Campaign Response */}
            {showText && generatingCampaign && (
              <div className="space-y-6">
                {(() => {
                  const strContent = generateSTRCampaignContent();
                  return (
                    <>
                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '0ms' }}>
                        <p>{strContent.intro}</p>
                      </div>

                      {/* Segment Table */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 grid grid-cols-4 gap-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
                          <div>Segment</div>
                          <div>Accounts</div>
                          <div>Pricing</div>
                          <div>Expected Conversion</div>
                        </div>
                        {strContent.segments.map((seg, index) => (
                          <div
                            key={index}
                            className={`px-4 py-3 ${index < strContent.segments.length - 1 ? 'border-b border-[rgba(0,0,0,0.1)]' : ''} grid grid-cols-4 gap-2 text-sm tracking-tight`}
                          >
                            <div className="font-semibold">{seg.segment}</div>
                            <div>{seg.accounts}</div>
                            <div>{seg.pricing}</div>
                            <div className="text-[#007a47]">{seg.conversion}</div>
                          </div>
                        ))}
                      </div>

                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '600ms' }}>
                        <p>{strContent.strategy}</p>
                      </div>

                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '900ms' }}>
                        <p>{strContent.testing}</p>
                      </div>

                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '1200ms' }}>
                        <p>{strContent.inventory}</p>
                      </div>

                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '1.5s' }}>
                        <p>{strContent.conclusion}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Pricing Campaign Response */}
            {showText && generatingPricingCampaign && (
              <div className="space-y-6">
                {(() => {
                  const pc = generatePricingCampaignContent();
                  return (
                    <>
                      {/* Intro */}
                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '0ms' }}>
                        <p>{pc.intro}</p>
                      </div>

                      {/* Game Tier Table */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-2">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Game Tier Classification — 41 Home Games</span>
                        </div>
                        <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-2 grid grid-cols-4 gap-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
                          <div>Tier</div>
                          <div>Games</div>
                          <div>Example Matchups</div>
                          <div>Multiplier</div>
                        </div>
                        {pc.tiers.map((tier, i) => {
                          const examples: Record<string, string> = {
                            Platinum: 'Christmas Day, Opening Night',
                            Marquee: 'vs. Lakers, Warriors, Celtics',
                            Premium: 'vs. Knicks, 76ers, weekends',
                            Standard: 'vs. Pacers, Hornets, weeknights',
                            Value: 'vs. Wizards, Pistons, Tue/Wed',
                          };
                          return (
                            <div key={i} className={`px-4 py-3 ${i < pc.tiers.length - 1 ? 'border-b border-[rgba(0,0,0,0.08)]' : ''} grid grid-cols-4 gap-2 text-sm tracking-tight`}>
                              <div className="font-semibold">{tier.name}</div>
                              <div>{tier.games} games</div>
                              <div className="text-[rgba(0,0,0,0.65)]">{examples[tier.name] || ''}</div>
                              <div className="text-[#4c65f0] font-semibold">{tier.multiplier}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pricing Manifest Table */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '600ms' }}>
                        <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Pricing Manifest — Per-Game Price by Section & Package</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[rgba(0,0,0,0.1)]">
                                <th className="text-left px-3 py-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Price Level</th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Sections</th>
                                {pc.activePackageKeys.map((key) => (
                                  <th key={key} className="text-right px-3 py-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
                                    {pc.packageLabels[key]}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pc.priceLevels.map((pl, i) => (
                                <tr key={i} className={i < pc.priceLevels.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}>
                                  <td className="px-3 py-2 font-semibold text-black">{pl.level}</td>
                                  <td className="px-3 py-2 text-[rgba(0,0,0,0.65)]">{pl.sections}</td>
                                  {pc.activePackageKeys.map((key) => {
                                    const discount = pc.discounts[key] || 0;
                                    const price = Math.round(pl.base * (1 - discount));
                                    return (
                                      <td key={key} className="text-right px-3 py-2 font-medium">
                                        ${price}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Strategy */}
                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '900ms' }}>
                        <p>{pc.strategy}</p>
                      </div>

                      {/* Package Menu Card */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '1200ms' }}>
                        <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Package Menu & Discount Ladder</span>
                        </div>
                        <div className="px-4 py-3 space-y-3">
                          {pc.activePackageKeys.map((key) => {
                            const disc = pc.discounts[key] || 0;
                            const discPct = Math.round(disc * 100);
                            const benefitList = Object.entries(benefitAllocations)
                              .filter(([, pkgs]) => pkgs[key])
                              .map(([benefitKey]) => {
                                const labels: Record<string, string> = {
                                  playoffPriority: 'Playoff priority',
                                  seatUpgrades: 'Seat upgrades',
                                  freeParking: 'Parking',
                                  merchCredit: 'Merch credit',
                                  ticketExchange: 'Ticket exchange',
                                  memberEvents: 'Member events',
                                  guestPasses: 'Guest passes',
                                };
                                return labels[benefitKey] || benefitKey;
                              });
                            return (
                              <div key={key} className="flex items-center gap-4 p-3 rounded-lg bg-[rgba(0,0,0,0.02)]">
                                <div className="flex-1">
                                  <div className="font-semibold text-black text-sm">{pc.packageLabels[key]}</div>
                                  {benefitList.length > 0 && (
                                    <div className="text-xs text-[rgba(0,0,0,0.55)] mt-0.5">{benefitList.join(' • ')}</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-[#007a47]">
                                    {discPct > 0 ? `${discPct}% savings` : 'Full price'}
                                  </div>
                                  <div className="text-xs text-[rgba(0,0,0,0.5)]">vs. single game</div>
                                </div>
                                {/* Mini bar */}
                                <div className="w-24 h-2 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-[#4c65f0]" style={{ width: `${100 - discPct * 2.5}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cannibalization */}
                      {pc.cannibalization && (
                        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '1500ms' }}>
                          <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
                            <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Package Migration Forecast</span>
                          </div>
                          <div className="px-4 py-3 text-sm text-black tracking-tight leading-[22px]">
                            <p>{pc.cannibalization}</p>
                          </div>
                        </div>
                      )}

                      {/* Revenue Projection Card */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '1800ms' }}>
                        <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Revenue Forecast</span>
                        </div>
                        <div className="px-4 py-4">
                          <div className="flex items-center gap-8 mb-4">
                            <div>
                              <div className="text-2xl font-bold text-[#007a47]">${pc.revenueValue}MM</div>
                              <div className="text-xs text-[rgba(0,0,0,0.5)]">Projected total ticket revenue</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-black">{pc.sellThrough}%</div>
                              <div className="text-xs text-[rgba(0,0,0,0.5)]">Avg sell-through</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-[#4c65f0]">+{Math.round((parseFloat(pc.revenueValue) / 98.9 - 1) * 100)}%</div>
                              <div className="text-xs text-[rgba(0,0,0,0.5)]">YoY growth</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="bg-[rgba(0,0,0,0.03)] rounded p-3 text-center">
                              <div className="font-semibold text-[rgba(0,0,0,0.5)] text-xs mb-1">Best Case</div>
                              <div className="font-bold text-[#007a47]">${(parseFloat(pc.revenueValue) * 1.08).toFixed(1)}MM</div>
                            </div>
                            <div className="bg-[rgba(76,101,240,0.05)] rounded p-3 text-center border border-[rgba(76,101,240,0.15)]">
                              <div className="font-semibold text-[#4c65f0] text-xs mb-1">Base Case</div>
                              <div className="font-bold text-black">${pc.revenueValue}MM</div>
                            </div>
                            <div className="bg-[rgba(0,0,0,0.03)] rounded p-3 text-center">
                              <div className="font-semibold text-[rgba(0,0,0,0.5)] text-xs mb-1">Worst Case</div>
                              <div className="font-bold text-[#d32f2f]">${(parseFloat(pc.revenueValue) * 0.91).toFixed(1)}MM</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Go-to-Market Timeline */}
                      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '2100ms' }}>
                        <div className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Go-to-Market Timeline</span>
                        </div>
                        <div className="px-4 py-3 space-y-3">
                          {[
                            { phase: '1', label: 'Season plan renewals', dates: 'Completed', status: 'done' },
                            { phase: '2', label: 'New full season plans', dates: 'Apr 1–15', status: 'upcoming' },
                            { phase: '3', label: 'Half & quarter season plans', dates: 'Apr 15–30', status: 'upcoming' },
                            ...(selectedPackages.fiveGame || selectedPackages.flex ? [{ phase: '4', label: `${[selectedPackages.fiveGame && '5-game', selectedPackages.flex && 'flex'].filter(Boolean).join(' & ')} plans`, dates: 'May 1–15', status: 'upcoming' }] : []),
                            { phase: selectedPackages.fiveGame || selectedPackages.flex ? '5' : '4', label: 'Single game on-sale', dates: 'Jun 1', status: 'upcoming' },
                            { phase: selectedPackages.fiveGame || selectedPackages.flex ? '6' : '5', label: 'Dynamic pricing active', dates: 'Game day adjustments', status: 'upcoming' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                item.status === 'done' ? 'bg-[#007a47] text-white' : 'bg-[rgba(76,101,240,0.1)] text-[#4c65f0]'
                              }`}>
                                {item.status === 'done' ? '✓' : item.phase}
                              </div>
                              <div className="flex-1 text-sm font-medium text-black tracking-tight">{item.label}</div>
                              <div className={`text-sm tracking-tight ${item.status === 'done' ? 'text-[#007a47] font-semibold' : 'text-[rgba(0,0,0,0.5)]'}`}>
                                {item.dates}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conclusion */}
                      <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '2400ms' }}>
                        <p>{pc.conclusion}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Regular Campaign Response */}
            {showText && !isAnySTRWorkflow && !isAnyPricingWorkflow && (
            <div className="space-y-6">
              <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '0ms' }}>
                <p>
                  {campaignContent.responseIntro}
                </p>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 grid grid-cols-4 gap-2 text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">
                  {campaignContent.dataTable.headers.map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </div>
                {campaignContent.dataTable.rows.map((row, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 ${index < campaignContent.dataTable.rows.length - 1 ? 'border-b border-[rgba(0,0,0,0.1)]' : ''} grid grid-cols-4 gap-2 text-sm tracking-tight`}
                  >
                    <div className="font-semibold">{row.segment}</div>
                    <div>{row.startingPrice}</div>
                    <div>{row.willTest}</div>
                    <div className="text-[rgba(0,0,0,0.65)]">{row.messaging}</div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '600ms' }}>
                <p>
                  {campaignContent.responseStrategy}
                </p>
              </div>

              <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '900ms' }}>
                <p>
                  {campaignContent.responseTesting}
                </p>
              </div>

              {/* Active Testing & Optimization */}
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '900ms' }}>
                <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">{campaignContent.testingCard.title}</span>
                </div>
                <div className="px-4 py-3">
                  <ul className="text-sm text-black tracking-tight space-y-1 list-disc list-inside mb-4">
                    {campaignContent.testingCard.items.map((item, index) => (
                      <li key={index}>{item.text}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#4c65f0] tracking-tight">
                    {campaignContent.testingCard.footer}
                  </p>
                </div>
              </div>

              <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '1200ms' }}>
                <p>
                  {campaignContent.responseInventory}
                </p>
              </div>

              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden animate-fade-in" style={{ animationDelay: '1500ms' }}>
                <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">{campaignContent.optimizationCard.title}</span>
                </div>
                <div className="px-4 py-3">
                  <ul className="text-sm text-black tracking-tight space-y-1 list-disc list-inside mb-4">
                    {campaignContent.optimizationCard.items.map((item, index) => (
                      <li key={index}>{item.text}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#4c65f0] tracking-tight">
                    {campaignContent.optimizationCard.footer}
                  </p>
                </div>
              </div>

              <div className="text-sm text-black leading-[22px] tracking-tight animate-fade-in" style={{ animationDelay: '1.5s' }}>
                <p>
                  {campaignContent.responseConclusion}
                </p>
              </div>
            </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input */}
        <div className="p-8">
          <div className="max-w-[706px] mx-auto space-y-3">
            <div className="bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.04)] rounded-xl p-5">
              <textarea
                placeholder="Ask Jump..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={1}
                className="w-full text-sm text-[rgba(0,0,0,0.65)] placeholder:text-[rgba(0,0,0,0.65)] leading-[22px] tracking-tight focus:outline-none bg-transparent resize-none overflow-hidden"
                style={{
                  minHeight: '22px',
                  maxHeight: '200px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '22px';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <button className="hover:scale-110 transition-transform duration-200">
                  <img
                    src="https://www.figma.com/api/mcp/asset/a8379c75-080f-4c55-b535-f7b8235c7092"
                    alt="Add"
                    className="w-6 h-6"
                  />
                </button>

                <div
                  className="flex items-center justify-end transition-all duration-300 ease-out"
                  style={{
                    gap: inputValue ? '16px' : '0px',
                  }}
                >
                  <button className="hover:scale-110 transition-transform duration-200">
                    <img
                      src="https://www.figma.com/api/mcp/asset/31cb1876-b852-4648-8a81-6626adc8e393"
                      alt="Voice"
                      className="w-6 h-6"
                    />
                  </button>

                  {inputValue && (
                    <button className="bg-[#4c65f0] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#3d52c9] transition-all duration-300 shadow-lg hover:shadow-xl animate-slide-in">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                        <path d="M10 4L10 16M10 4L6 8M10 4L14 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-[rgba(0,0,0,0.65)] text-center tracking-tight">
              AI can make mistakes, always review results.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Show for regular workflows, STR after generation, or Pricing after generation */}
      {(!isSTRWorkflow || generatingCampaign) && (!isPricingWorkflow || generatingPricingCampaign) && (
      <div
        className="w-[515px] bg-white border-l border-[rgba(0,0,0,0.1)] flex flex-col transition-all duration-700 ease-out"
        style={{
          transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
          opacity: showSidebar ? 1 : 0,
        }}
      >
        {/* Header */}
        <div className="h-16 border-b border-[rgba(0,0,0,0.1)] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <img
              src="https://www.figma.com/api/mcp/asset/705c6ed5-17c8-4431-9f00-1bbd6ed49734"
              alt="Campaign"
              className="w-6 h-6"
            />
            <h2 className="text-lg font-semibold text-black tracking-tight">New Campaign</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:scale-110 transition-transform">
              <img
                src="https://www.figma.com/api/mcp/asset/d41048ce-d887-4c48-b01e-407dfbdc5dcf"
                alt="Share"
                className="w-6 h-6"
              />
            </button>
            <button className="hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {generatingPricingCampaign ? (
            <>
              {/* Pricing Campaign Sidebar */}
              {(() => {
                const revenueValue = (112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1);
                const sellThrough = Math.round(78 + (pricingSliderValue / 100) * 17);
                const tierLabel = tierStructure === 'conservative' ? '3' : tierStructure === 'balanced' ? '4' : '5';
                const packageCount = Object.values(selectedPackages).filter(Boolean).length;
                return (
                  <>
                    <div className="inline-flex items-center px-3 h-8 border border-[rgba(0,0,0,0.15)] rounded bg-transparent">
                      <span className="text-sm font-semibold text-[#4c65f0] tracking-tight">Pricing & Packaging</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-black tracking-tight leading-none mb-1">
                          2026-27 On-Sale Pricing & Packaging
                        </h1>
                        <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                          18,200 Seats • 41 Games • {tierLabel} Tiers • Jun 1 On-Sale
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="text-lg font-semibold text-[#007a47] tracking-tight">${revenueValue}MM</div>
                        <div className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">Projected ticket revenue</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/4a62c6bf-a456-4cb3-b835-815553d51470"
                        title="Total Seats"
                        value="18,200 Capacity"
                      />
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/913cffaa-f0bf-4fa0-b024-575a787b4760"
                        title="Home Games"
                        value="41 Games"
                      />
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/1821a86c-cb32-46b4-94c7-66e989c3173f"
                        title="Game Tiers"
                        value={`${tierLabel} Tiers`}
                      />
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/f335fd27-7f35-400e-96f9-f544c70816df"
                        title="Package Types"
                        value={`${packageCount} Offered`}
                      />
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/1821a86c-cb32-46b4-94c7-66e989c3173f"
                        title="Avg Sell-Through"
                        value={`${sellThrough}% Target`}
                      />
                    </div>
                  </>
                );
              })()}
            </>
          ) : generatingCampaign ? (
            <>
              {/* STR Campaign Sidebar */}
              {(() => {
                const revenueValue = (81.2 - (sliderValue / 100) * 10.1).toFixed(1);
                const renewalRate = Math.round(67 + (sliderValue / 100) * 20);

                return (
                  <>
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 h-8 border border-[rgba(0,0,0,0.15)] rounded bg-transparent">
                      <span className="text-sm font-semibold text-[#007a47] tracking-tight">Season Ticket Renewal</span>
                    </div>

                    {/* Title & Revenue */}
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-black tracking-tight leading-none mb-1">
                          2026 Season Ticket Renewal Campaign
                        </h1>
                        <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                          Multi-segment retention strategy
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="text-lg font-semibold text-[#007a47] tracking-tight">${revenueValue}MM</div>
                        <div className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">Projected Revenue</div>
                      </div>
                    </div>

                    {/* Section Cards */}
                    <div className="space-y-2">
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/4a62c6bf-a456-4cb3-b835-815553d51470"
                        title="Target Accounts"
                        value="9,345 Season Ticket Holders"
                      />
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/913cffaa-f0bf-4fa0-b024-575a787b4760"
                        title="Renewal Target"
                        value={`${renewalRate}% Retention Rate`}
                      />
                      {checkboxSelections.cappingPrice && (
                        <SectionCard
                          icon="https://www.figma.com/api/mcp/asset/1821a86c-cb32-46b4-94c7-66e989c3173f"
                          title="Price Cap"
                          value={`${priceCapPercentage || 0}% Maximum Increase`}
                        />
                      )}
                      <SectionCard
                        icon="https://www.figma.com/api/mcp/asset/f335fd27-7f35-400e-96f9-f544c70816df"
                        title="Campaign Duration"
                        value="60-day renewal window"
                      />
                      {(paymentPlans.plan1 || paymentPlans.plan2 || paymentPlans.plan3) && (
                        <SectionCard
                          icon="https://www.figma.com/api/mcp/asset/1821a86c-cb32-46b4-94c7-66e989c3173f"
                          title="Payment Plans"
                          value={`${[paymentPlans.plan1 && '12mo', paymentPlans.plan2 && '9mo', paymentPlans.plan3 && '6mo'].filter(Boolean).join(', ')} options`}
                        />
                      )}
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              {/* Regular Campaign Sidebar */}
              {/* Badge */}
              <div className="inline-flex items-center px-3 h-8 border border-[rgba(0,0,0,0.15)] rounded bg-transparent">
                <span className="text-sm font-semibold text-[#007a47] tracking-tight">{campaignContent.sidebar.badge}</span>
              </div>

              {/* Title & Revenue */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-black tracking-tight leading-none mb-1">
                    {campaignContent.sidebar.title}
                  </h1>
                  <p className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">
                    {campaignContent.sidebar.subtitle}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <div className="text-lg font-semibold text-[#007a47] tracking-tight">{campaignContent.sidebar.revenueRange}</div>
                  <div className="text-sm text-[rgba(0,0,0,0.65)] tracking-tight">{campaignContent.sidebar.revenueLabel}</div>
                </div>
              </div>

              {/* Section Cards */}
              <div className="space-y-2">
                {campaignContent.sidebar.sections.map((section, index) => {
                  // Map icon names to actual icon URLs
                  const iconMap: Record<string, string> = {
                    'users': 'https://www.figma.com/api/mcp/asset/4a62c6bf-a456-4cb3-b835-815553d51470',
                    'ticket': 'https://www.figma.com/api/mcp/asset/913cffaa-f0bf-4fa0-b024-575a787b4760',
                    'alert': 'https://www.figma.com/api/mcp/asset/4a62c6bf-a456-4cb3-b835-815553d51470',
                    'dollar': 'https://www.figma.com/api/mcp/asset/1821a86c-cb32-46b4-94c7-66e989c3173f',
                    'message': 'https://www.figma.com/api/mcp/asset/f335fd27-7f35-400e-96f9-f544c70816df'
                  };

                  return (
                    <SectionCard
                      key={index}
                      icon={iconMap[section.icon] || iconMap['users']}
                      title={section.label}
                      value={section.value}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* Key Decisions */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden">
            <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Key Decisions</span>
            </div>
            <div className="px-4 py-3">
              <ul className="text-sm text-black tracking-tight space-y-1 list-disc list-inside">
                {generatingPricingCampaign ? (
                  <>
                    <li>{pricingSliderValue < 40 ? 'Revenue-focused' : pricingSliderValue > 60 ? 'Attendance-focused' : 'Balanced'} pricing strategy targeting ${(112.5 - (pricingSliderValue / 100) * 14.8).toFixed(1)}MM revenue</li>
                    <li>{Object.entries(selectedPackages).filter(([, v]) => v).length} package types: {Object.entries(selectedPackages).filter(([, v]) => v).map(([k]) => {
                      const labels: Record<string, string> = { fullSeason: 'Full', halfSeason: 'Half', quarterSeason: 'Quarter', fiveGame: '5-Game', flex: 'Flex', singleGame: 'Single', group: 'Group' };
                      return labels[k] || k;
                    }).join(', ')}</li>
                    <li>{tierStructure.charAt(0).toUpperCase() + tierStructure.slice(1)} game tiering ({tierStructure === 'conservative' ? '3' : tierStructure === 'balanced' ? '4' : '5'} tiers)</li>
                    {pricingConstraints.capYoY && <li>YoY price increase capped at {maxYoYIncrease}%</li>}
                    {pricingConstraints.floorPrice && <li>Floor price set at ${floorPriceAmount} per ticket</li>}
                    {pricingConstraints.maintainLadder && <li>Discount ladder maintained across all package tiers</li>}
                    {pricingConstraints.matchSecondary && <li>Secondary market price matching on low-demand games</li>}
                    <li>Go-to-market: Season plans Apr 1 → Single game Jun 1</li>
                  </>
                ) : generatingCampaign ? (
                  <>
                    <li>Targeted {Math.round(67 + (sliderValue / 100) * 20)}% renewal rate with {sliderValue < 40 ? 'revenue-first' : sliderValue > 60 ? 'retention-first' : 'balanced'} approach</li>
                    {checkboxSelections.longtimeMembers && <li>Prioritized longtime member recognition with exclusive perks</li>}
                    {checkboxSelections.cappingPrice && <li>Capped price increases at {priceCapPercentage || 0}% to maintain affordability</li>}
                    {checkboxSelections.upsellingQuarterToHalf && <li>Created quarter-to-half season upgrade path</li>}
                    {checkboxSelections.upsellingHalfToFull && <li>Enabled half-to-full season conversion opportunity</li>}
                    {checkboxSelections.crossSellAtRisk && <li>Cross-sell single game subscriptions to non-renewals</li>}
                    {(paymentPlans.plan1 || paymentPlans.plan2 || paymentPlans.plan3) && (
                      <li>Offering {[
                        paymentPlans.plan1 && '12-month',
                        paymentPlans.plan2 && '9-month (recommended)',
                        paymentPlans.plan3 && '6-month'
                      ].filter(Boolean).join(', ')} payment plan options</li>
                    )}
                    {requireFullUpfront !== null && (
                      <li>{requireFullUpfront ? 'Required full upfront payment for fans who missed deadlines' : 'Extended payment plans to all fans, including those who missed deadlines'}</li>
                    )}
                    {(optOutOptions.discountCredits || optOutOptions.offerHalfQuarter || optOutOptions.freeUpgrades) && (
                      <li>Retention offers for opt-outs: {[
                        optOutOptions.discountCredits && 'unused credit discounts',
                        optOutOptions.offerHalfQuarter && 'partial season plans',
                        optOutOptions.freeUpgrades && '3 free upgrades'
                      ].filter(Boolean).join(', ')}</li>
                    )}
                    <li>Multi-channel approach: email primary, SMS reminders</li>
                  </>
                ) : (
                  campaignContent.sidebar.keyDecisions.map((decision, index) => (
                    <li key={index}>{decision}</li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleLaunchCampaign}
              className="w-full h-14 bg-[#4c65f0] hover:bg-[#3d52c9] text-white rounded-full flex items-center justify-center gap-3 transition-colors font-semibold text-base tracking-tight"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {generatingPricingCampaign ? 'Publish Pricing' : 'Launch Campaign'}
            </button>

            <button className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-full transition-colors font-semibold text-base tracking-tight">
              {generatingPricingCampaign ? 'Edit Configuration' : 'Edit Campaign'}
            </button>

            <button className="w-full h-14 bg-transparent border border-[rgba(0,0,0,0.15)] text-black rounded-full hover:bg-gray-50 transition-colors font-semibold text-base tracking-tight">
              Save as Draft
            </button>

            <p className="text-xs text-[rgba(0,0,0,0.65)] text-center tracking-tight">
              {generatingPricingCampaign
                ? 'Pricing will be locked and published to ticketing system. Package pages will be generated and on-sale dates activated.'
                : 'Campaign will go live immediately. Landing pages will be published and messages scheduled.'}
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateX(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out forwards;
        }

        @keyframes check-pop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-check-pop {
          animation: check-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-progress-bar {
          animation: progress-bar linear forwards;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(76, 101, 240, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(76, 101, 240, 0.6);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Slider Styles */
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 4px solid #4c65f0;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(76, 101, 240, 0.3);
          transition: all 0.2s;
        }
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(76, 101, 240, 0.4);
        }
        .slider-custom::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 4px solid #4c65f0;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(76, 101, 240, 0.3);
          transition: all 0.2s;
        }
        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(76, 101, 240, 0.4);
        }
      `}</style>
    </div>
  );
}

function SectionCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-[#f4f4f4] rounded px-4 py-3 flex items-center gap-4">
      <img src={icon} alt={title} className="w-6 h-6" />
      <div className="flex-1 text-sm font-semibold text-black tracking-tight">{title}</div>
      <div className="text-sm font-semibold text-[#4c65f0] tracking-tight">{value}</div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
