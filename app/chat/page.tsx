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
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [checkboxSelections, setCheckboxSelections] = useState({
    longtimeMembers: false,
    cappingPrice: false,
    upsellingQuarterToHalf: false,
    upsellingHalfToFull: false,
    crossSellAtRisk: false,
  });
  const [priceCapPercentage, setPriceCapPercentage] = useState('');
  const [generatingCampaign, setGeneratingCampaign] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default user message or use recommendation prompt
  const userMessage = recommendation
    ? recommendation.chatPrompt
    : 'Create a Kevin Garnett campaign targeting young professionals and group buyers with special packages around his jersey retirement night on Jan 15 vs. the Pacers';

  useEffect(() => {
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
  }, []);

  const handleLaunchCampaign = () => {
    // Extract campaign data from sidebar content
    let newCampaign;

    if (generatingCampaign) {
      // STR Workflow campaign data
      const revenueValue = (76.3 - (sliderValue / 100) * 13.5).toFixed(1);
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

  // If this is the Season Ticket Renewal workflow and no goal selected, show slider in chat
  const isSTRWorkflow = workflowType === 'str' && !selectedGoal;

  // Generate STR-specific thinking steps based on user selections
  const generateSTRThinkingSteps = () => {
    const revenueValue = (76.3 - (sliderValue / 100) * 13.5).toFixed(1);
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

  // Generate STR campaign content based on user selections
  const generateSTRCampaignContent = () => {
    const revenueValue = (76.3 - (sliderValue / 100) * 13.5).toFixed(1);
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

      inventory: `Channel orchestration begins with email to all segments, followed by SMS reminders 7 days before deadline. ${checkboxSelections.crossSellAtRisk ? 'Non-renewing members receive targeted subscription offers via retargeting campaigns.' : ''} Payment plans are available for all tiers${checkboxSelections.cappingPrice ? ', aligning with your price sensitivity focus' : ''}, with automated billing options to reduce friction.`,

      conclusion: `With projected ${renewalRate}% retention and $${revenueValue}MM in revenue, this campaign balances${isRevenueFocused ? ' revenue generation' : isRenewalFocused ? ' member satisfaction' : ' strategic objectives'} while maintaining strong fan relationships. ${checkboxSelections.upsellingQuarterToHalf || checkboxSelections.upsellingHalfToFull ? 'Upsell opportunities add' : 'Segment-specific messaging drives'} incremental value beyond base renewals. Launch immediately to maximize${checkboxSelections.longtimeMembers ? ' loyalty recognition impact' : ' early bird participation'}.`
    };
  };

  useEffect(() => {
    if (!isSTRWorkflow) {
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
      // For STR workflow, just show the interface immediately
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isSTRWorkflow]);

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

  return (
    <div className="h-[calc(100vh-56px)] flex relative" style={{
      backgroundImage: 'linear-gradient(135deg, rgba(76, 101, 240, 0.02) 0%, rgba(204, 255, 0, 0.01) 100%)'
    }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-[624px] mx-auto space-y-6">
            {/* User Message - Only show for non-STR workflows */}
            {!isSTRWorkflow && (
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

            {/* STR Workflow - Goal Selection Step 1 */}
            {isSTRWorkflow && (
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
                  <p className="text-base text-[rgba(0,0,0,0.75)] leading-[26px] tracking-tight mb-4">
                    What is your goal for this upcoming season?
                  </p>
                  <p className="text-sm text-[rgba(0,0,0,0.65)] leading-[22px] tracking-tight mb-4">
                    As a reminder, here's your renewal performance for the past 3 seasons:
                  </p>

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

                {/* Slider Container */}
                <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 space-y-8">
                  {/* Labels */}
                  <div className="flex justify-between items-start">
                    <div className="text-left max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">
                        Maximize Revenue
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">
                        Focus on higher pricing and premium conversions
                      </div>
                    </div>
                    <div className="text-right max-w-[200px]">
                      <div className="text-base font-bold text-black tracking-tight mb-1">
                        Maximize Renewals
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.5)] leading-[20px]">
                        Focus on retention rate and holder satisfaction
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
                        ${(76.3 - (sliderValue / 100) * 13.5).toFixed(1)}MM
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
            {isSTRWorkflow && sliderSubmitted && !selectedGoal && (
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
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer"
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
                        className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer"
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
                            placeholder="0"
                            className="w-20 px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded text-base text-black focus:outline-none focus:border-[#4c65f0] focus:border-2"
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
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer"
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
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer"
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
                      className="w-5 h-5 mt-0.5 rounded border-2 border-[rgba(0,0,0,0.3)] text-[#4c65f0] focus:ring-[#4c65f0] cursor-pointer"
                    />
                    <span className="text-base text-black tracking-tight group-hover:text-[#4c65f0] transition-colors">
                      Cross Sell Subscriptions to At Risk Accounts
                    </span>
                  </label>

                  {/* Continue Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => {
                        setGeneratingCampaign(true);
                        setSelectedGoal(`slider-${sliderValue}`);
                      }}
                      className="bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-10 py-3 rounded-full font-semibold text-base tracking-tight transition-all hover:scale-105 shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
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
                    <h3 className="text-base font-semibold text-black tracking-tight">Building Campaign Strategy</h3>
                    <p className="text-xs text-[rgba(0,0,0,0.5)] tracking-tight">
                      Step {Math.min(activeStep + 1, (generatingCampaign ? strThinkingSteps : thinkingSteps).length)} of {(generatingCampaign ? strThinkingSteps : thinkingSteps).length}
                    </p>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-6 h-1.5 bg-[rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4c65f0] to-[#657dff] transition-all duration-500 ease-out"
                    style={{
                      width: `${((completedSteps.length) / (generatingCampaign ? strThinkingSteps : thinkingSteps).length) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="space-y-4">
                  {(generatingCampaign ? strThinkingSteps : thinkingSteps).map((step, index) => {
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

            {/* Regular Campaign Response */}
            {showText && !isSTRWorkflow && (
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

      {/* Right Sidebar - Only show when not STR workflow OR when STR campaign is generated */}
      {(!isSTRWorkflow || generatingCampaign) && (
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
          {generatingCampaign ? (
            <>
              {/* STR Campaign Sidebar */}
              {(() => {
                const revenueValue = (76.3 - (sliderValue / 100) * 13.5).toFixed(1);
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
                {generatingCampaign ? (
                  <>
                    <li>Targeted {Math.round(67 + (sliderValue / 100) * 20)}% renewal rate with {sliderValue < 40 ? 'revenue-first' : sliderValue > 60 ? 'retention-first' : 'balanced'} approach</li>
                    {checkboxSelections.longtimeMembers && <li>Prioritized longtime member recognition with exclusive perks</li>}
                    {checkboxSelections.cappingPrice && <li>Capped price increases at {priceCapPercentage || 0}% to maintain affordability</li>}
                    {checkboxSelections.upsellingQuarterToHalf && <li>Created quarter-to-half season upgrade path</li>}
                    {checkboxSelections.upsellingHalfToFull && <li>Enabled half-to-full season conversion opportunity</li>}
                    {checkboxSelections.crossSellAtRisk && <li>Cross-sell single game subscriptions to non-renewals</li>}
                    <li>Implemented payment plans across all tiers</li>
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
              Launch Campaign
            </button>

            <button className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-full transition-colors font-semibold text-base tracking-tight">
              Edit Campaign
            </button>

            <button className="w-full h-14 bg-transparent border border-[rgba(0,0,0,0.15)] text-black rounded-full hover:bg-gray-50 transition-colors font-semibold text-base tracking-tight">
              Save as Draft
            </button>

            <p className="text-xs text-[rgba(0,0,0,0.65)] text-center tracking-tight">
              Campaign will go live immediately. Landing pages will be published and messages scheduled.
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
