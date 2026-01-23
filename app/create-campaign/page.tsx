'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveRecommendations } from '../../lib/mockRecommendations';

// Get AI recommendations
const aiRecommendations = getActiveRecommendations();

// General campaign templates
const templates = [
  { text: 'Theme night campaign', isAI: false },
  { text: 'Group sales campaign', isAI: false },
  { text: 'VIP experience package', isAI: false },
];

// Mix AI recommendations with templates
const suggestions: Array<{ text: string; isAI: boolean; recommendationId?: string }> = [
  ...aiRecommendations.map(rec => ({
    text: rec.title,
    isAI: true,
    recommendationId: rec.id
  })),
  ...templates
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          background: 'linear-gradient(135deg, rgba(76, 101, 240, 0.03) 0%, rgba(204, 255, 0, 0.02) 100%)',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        {/* Greeting - Fade in from top */}
        <div
          className="text-center mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <h1 className="text-4xl font-bold text-black mb-3 tracking-tight">
            Hi Jord, how can I help?
          </h1>
          <p className="text-base text-[rgba(0,0,0,0.65)] tracking-tight">
            Describe your campaign goal and I'll help you set everything up
          </p>
        </div>

        {/* Input Box with Animated Gradient Border */}
        <div
          className="w-full max-w-[674px] mb-8 transition-all duration-1000 ease-out delay-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          <div className="relative">
            {/* Animated gradient border - fades out when typing */}
            <div
              className="absolute -inset-[3px] rounded-xl overflow-hidden transition-opacity duration-500"
              style={{ opacity: inputValue ? 0 : 1 }}
            >
              <div
                className="absolute inset-0 animate-gradient-rotate"
                style={{
                  background: 'linear-gradient(90deg, #4c65f0 0%, #657dff 25%, #ccff00 50%, #4c65f0 75%, #657dff 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>

            {/* Static border when typing */}
            <div
              className="absolute -inset-[3px] rounded-xl transition-opacity duration-500"
              style={{
                opacity: inputValue ? 1 : 0,
                border: '3px solid #4c65f0',
              }}
            />

            {/* Input container */}
            <div className="relative bg-white rounded-xl shadow-lg p-5">
              <textarea
                placeholder="Ask Jump..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={1}
                className="w-full text-base text-black placeholder:text-[rgba(0,0,0,0.4)] tracking-tight focus:outline-none bg-transparent resize-none overflow-hidden"
                style={{
                  minHeight: '24px',
                  maxHeight: '200px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '24px';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <button className="hover:scale-110 transition-transform duration-200">
                  <img
                    src="https://www.figma.com/api/mcp/asset/bb2bca4e-f812-45fb-8205-88cb33183c15"
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
                  {/* Microphone - always visible */}
                  <button className="hover:scale-110 transition-transform duration-200">
                    <img
                      src="https://www.figma.com/api/mcp/asset/138ad392-562f-4c05-a7aa-22ebfedf38eb"
                      alt="Voice"
                      className="w-6 h-6"
                    />
                  </button>

                  {/* Submit button - slides in when text is entered */}
                  {inputValue && (
                    <button
                      onClick={() => router.push('/chat')}
                      className="bg-[#4c65f0] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#3d52c9] transition-all duration-300 shadow-lg hover:shadow-xl animate-slide-in"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                        <path d="M10 4L10 16M10 4L6 8M10 4L14 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Chips - Staggered fade in */}
        <div className="w-full max-w-[764px] space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <SuggestionChip
                key={index}
                text={suggestion.text}
                isAI={suggestion.isAI}
                delay={400 + (index * 100)}
                isVisible={isVisible}
                onClick={() => {
                  if (suggestion.isAI && suggestion.recommendationId) {
                    router.push(`/chat?rec=${suggestion.recommendationId}`);
                  } else {
                    router.push('/chat');
                  }
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {suggestions.slice(3).map((suggestion, index) => (
              <SuggestionChip
                key={index + 3}
                text={suggestion.text}
                isAI={suggestion.isAI}
                delay={700 + (index * 100)}
                isVisible={isVisible}
                onClick={() => {
                  if (suggestion.isAI && suggestion.recommendationId) {
                    router.push(`/chat?rec=${suggestion.recommendationId}`);
                  } else {
                    router.push('/chat');
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style jsx global>{`
        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 3s linear infinite;
        }

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(76, 101, 240, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(76, 101, 240, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

function SuggestionChip({
  text,
  isAI = false,
  delay,
  isVisible,
  onClick
}: {
  text: string;
  isAI?: boolean;
  delay: number;
  isVisible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl px-5 py-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
        border: isAI ? '2px solid rgba(76, 101, 240, 0.2)' : '2px solid transparent',
      }}
    >
      <div className="flex items-center gap-2">
        {isAI && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="url(#chip-sparkle-gradient)">
            <defs>
              <linearGradient id="chip-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c65f0" />
                <stop offset="100%" stopColor="#657dff" />
              </linearGradient>
            </defs>
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        )}
        <span className="text-sm font-semibold text-[#4c65f0] tracking-tight whitespace-nowrap">
          {text}
        </span>
      </div>
    </button>
  );
}
