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
    const newCampaign = {
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

    // Save to localStorage
    saveCampaign(newCampaign);

    // Redirect to Active tab
    router.push('/?tab=active');
  };

  return (
    <div className="h-[calc(100vh-56px)] flex relative" style={{
      backgroundImage: 'linear-gradient(135deg, rgba(76, 101, 240, 0.02) 0%, rgba(204, 255, 0, 0.01) 100%)'
    }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-[624px] mx-auto space-y-6">
            {/* User Message */}
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
                      Step {Math.min(activeStep + 1, thinkingSteps.length)} of {thinkingSteps.length}
                    </p>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-6 h-1.5 bg-[rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4c65f0] to-[#657dff] transition-all duration-500 ease-out"
                    style={{
                      width: `${((completedSteps.length) / thinkingSteps.length) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="space-y-4">
                  {thinkingSteps.map((step, index) => {
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

            {/* AI Response */}
            {showText && (
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

      {/* Right Sidebar */}
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

          {/* Key Decisions */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded overflow-hidden">
            <div className="bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight">Key Decisions</span>
            </div>
            <div className="px-4 py-3">
              <ul className="text-sm text-black tracking-tight space-y-1 list-disc list-inside">
                {campaignContent.sidebar.keyDecisions.map((decision, index) => (
                  <li key={index}>{decision}</li>
                ))}
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
