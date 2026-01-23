'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHomeGames, GameSchedule } from '../lib/mockGameSchedule';
import { getCampaigns } from '../lib/campaignsStore';

// NBA team colors
const teamInfo: Record<string, { abbr: string; primary: string; secondary: string }> = {
  'Los Angeles Lakers': { abbr: 'LAL', primary: '#552583', secondary: '#FDB927' },
  'Denver Nuggets': { abbr: 'DEN', primary: '#0E2240', secondary: '#FEC524' },
  'Indiana Pacers': { abbr: 'IND', primary: '#002D62', secondary: '#FDBB30' },
  'Chicago Bulls': { abbr: 'CHI', primary: '#CE1141', secondary: '#000000' },
  'Dallas Mavericks': { abbr: 'DAL', primary: '#00538C', secondary: '#002B5E' },
  'Phoenix Suns': { abbr: 'PHX', primary: '#1D1160', secondary: '#E56020' },
  'Golden State Warriors': { abbr: 'GSW', primary: '#1D428A', secondary: '#FFC72C' },
  'Sacramento Kings': { abbr: 'SAC', primary: '#5A2D81', secondary: '#63727A' },
  'Houston Rockets': { abbr: 'HOU', primary: '#CE1141', secondary: '#000000' },
  'Portland Trail Blazers': { abbr: 'POR', primary: '#E03A3E', secondary: '#000000' },
};

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const games = getHomeGames();
  const campaigns = getCampaigns();
  const atRiskGames = games.filter(game => game.performanceStatus === 'behind');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="border-b border-[rgba(0,0,0,0.04)] px-8 py-8"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%), linear-gradient(90deg, rgba(76, 101, 240, 1) 0%, rgba(76, 101, 240, 1) 100%)'
        }}
      >
        <div>
          <h1 className="text-[32px] font-black text-black leading-[36px] tracking-[-0.32px] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-base text-[rgba(0,0,0,0.65)] tracking-tight">
            Overview of your campaigns, games, and opportunities
          </p>
        </div>
      </div>

      <div className="flex-1 px-8 py-5">
        {/* Opportunities & Risks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-black tracking-tight mb-0.5">
                Opportunities & Risks
              </h2>
              <p className="text-xs text-[rgba(0,0,0,0.65)] tracking-tight">
                Games that need attention and recommended campaign actions
              </p>
            </div>
            <Link
              href="/campaigns?tab=schedule"
              className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
            >
              View All Games →
            </Link>
          </div>

          {/* Risk Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-3">
              <div className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight mb-0.5">
                Games At Risk
              </div>
              <div className="text-xl font-bold text-[#d32f2f] tracking-tight">
                {atRiskGames.length}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mt-0.5">
                Behind schedule
              </div>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-3">
              <div className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight mb-0.5">
                Revenue at Risk
              </div>
              <div className="text-xl font-bold text-[#d32f2f] tracking-tight">
                ${(atRiskGames.length * 85).toFixed(0)}K
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mt-0.5">
                Estimated opportunity
              </div>
            </div>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-3">
              <div className="text-xs font-semibold text-[rgba(0,0,0,0.65)] tracking-tight mb-0.5">
                Recommended Actions
              </div>
              <div className="text-xl font-bold text-[#4c65f0] tracking-tight">
                {atRiskGames.reduce((sum, game) => sum + game.actions.filter(a => a.type === 'campaign').length, 0)}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mt-0.5">
                Campaign opportunities
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="grid grid-cols-1 gap-3">
            {atRiskGames.slice(0, 3).map((game, index) => (
              <OpportunityCard
                key={game.id}
                game={game}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Recent Campaigns Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-black tracking-tight mb-0.5">
                Recent Campaigns
              </h2>
              <p className="text-xs text-[rgba(0,0,0,0.65)] tracking-tight">
                Your latest active campaigns and their performance
              </p>
            </div>
            <Link
              href="/campaigns"
              className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
            >
              View All Campaigns →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {campaigns.slice(0, 3).map((campaign, index) => (
              <div
                key={campaign.id}
                className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                  transitionDelay: `${(index + 3) * 100}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#4c65f0] tracking-tight mb-0.5">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-[rgba(0,0,0,0.65)] tracking-tight">
                      {campaign.description}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 border border-[rgba(0,0,0,0.15)] rounded">
                    <span className="text-xs font-semibold text-[#007a47] tracking-tight">
                      {campaign.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mb-0.5">
                      Revenue
                    </div>
                    <div className="text-base font-bold text-black tracking-tight">
                      ${(campaign.actualRevenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mb-0.5">
                      Delivered
                    </div>
                    <div className="text-base font-bold text-black tracking-tight">
                      {campaign.delivered}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mb-0.5">
                      Opened
                    </div>
                    <div className="text-base font-bold text-black tracking-tight">
                      {campaign.opened}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[rgba(0,0,0,0.4)] tracking-tight mb-0.5">
                      Converted
                    </div>
                    <div className="text-base font-bold text-black tracking-tight">
                      {campaign.converted}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ game, index, isVisible }: { game: GameSchedule; index: number; isVisible: boolean }) {
  const team = teamInfo[game.opponent];
  const isPacersGame = game.opponent === 'Indiana Pacers';
  const isSunsGame = game.opponent === 'Phoenix Suns';
  const isRocketsGame = game.opponent === 'Houston Rockets';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 hover:shadow-lg transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Team Logo */}
        {team && (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: team.primary,
              border: `2px solid ${team.secondary}`,
            }}
          >
            <span
              className="text-xs font-bold tracking-tight"
              style={{ color: team.secondary }}
            >
              {team.abbr}
            </span>
          </div>
        )}

        {/* Game Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-0.5">
                <h3 className="text-base font-bold text-black tracking-tight">
                  vs {game.opponent}
                </h3>
                {/* Inline Metrics */}
                <div className="flex items-center gap-3 text-[10px] text-[rgba(0,0,0,0.65)]">
                  <span><span className="font-semibold text-black">{game.capacitySold}%</span> sold</span>
                  <span className="font-semibold text-[#d32f2f]">
                    {isPacersGame ? '$210K' : isSunsGame ? '$185K' : isRocketsGame ? '$195K' : `$${(85 - game.capacitySold)}K`} at risk
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[rgba(0,0,0,0.65)] tracking-tight">
                <span>{game.date}</span>
                <span>•</span>
                <span>{game.dayOfWeek}</span>
                <span>•</span>
                <span>{game.time}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(211,47,47,0.1)] border border-[#d32f2f] rounded-full">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="#d32f2f">
                <path d="M8 13L4 8L8 8L8 3L12 8L8 8L8 13Z" />
              </svg>
              <span className="text-xs font-semibold text-[#d32f2f] tracking-tight">
                {game.performanceDetail}
              </span>
            </div>
          </div>

          {/* Insight */}
          <div className="mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left p-2.5 bg-[rgba(76,101,240,0.05)] border border-[rgba(76,101,240,0.15)] rounded hover:bg-[rgba(76,101,240,0.08)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-semibold text-[#4c65f0] tracking-tight uppercase">
                    AI Insight
                  </div>
                  <span className="text-xs text-[rgba(0,0,0,0.85)]">
                    {isPacersGame ?
                      'College Football National Championship conflict detected, $210K at risk' :
                    isSunsGame ?
                      'Taylor Swift concert + winter storm detected, $185K at risk' :
                    isRocketsGame ?
                      'Jalen Green hometown return opportunity, $195K upside' :
                      game.performanceInsight
                    }
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="#4c65f0"
                  className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="#4c65f0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="mt-2 p-3 bg-[rgba(76,101,240,0.05)] border-l-2 border-[#4c65f0] rounded">
                {isPacersGame ? (
                  <div className="text-xs text-[rgba(0,0,0,0.85)] tracking-tight leading-relaxed space-y-2">
                    <p>
                      <span className="font-semibold">Proactive Analysis:</span> I detected the College Football National Championship (Indiana Hoosiers vs. Miami Hurricanes, 8:00 PM ET on ESPN) scheduled the same evening as this Pacers game. Cross-referencing social media sentiment (28% spike in CFB-related posts from Minneapolis fans), historical attendance overlap data from past championship conflicts (avg. –14% ticket sales), and current pacing (–9% vs. forecast), I'm projecting significant attendance suppression.
                    </p>
                    <p>
                      If no action is taken, projected downside risk is <span className="font-semibold">$210K</span> in ticket and in-venue revenue. I've automatically flagged this as high-priority and developed a mitigation plan.
                    </p>
                    <div>
                      <p className="font-semibold mb-2">Automated Mitigation & Upside Plan:</p>
                      <div className="space-y-2">
                        <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                          <div className="mb-2">
                            <span className="font-semibold">1) Sponsor Upsell:</span> I've identified Delta Air Lines as an ideal partner based on their current brand campaign and 2,400 SkyMiles members traveling to Minneapolis this week (via booking data). Proposing a "Game-Day Upgrade" sponsorship package offering surprise seat and experience upgrades. I'll auto-generate targeting segments and creative assets once approved.
                          </div>
                          <Link
                            href={`/chat?game=${game.id}`}
                            className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                          >
                            Create Sponsor Upsell
                          </Link>
                        </div>
                        <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                          <div className="mb-2">
                            <span className="font-semibold">2) Targeted Demand Shift:</span> I've segmented 18,500 Pacers fans with low college football engagement scores (based on purchase history, email click patterns, and social media behavior). Campaign will emphasize exclusive in-arena experiences and premium seating. Dynamic pricing will adjust automatically based on real-time conversion rates.
                          </div>
                          <Link
                            href={`/chat?game=${game.id}`}
                            className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                          >
                            Create Targeted Demand Shift
                          </Link>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-[#007a47] mt-2">
                      This plan is projected to generate $420K–$580K in incremental revenue, offsetting the forecast gap while increasing sponsor ROI. I'll monitor performance hourly and auto-adjust messaging, pricing, and targeting to optimize results.
                    </p>

                    {/* View Details Link */}
                    <div className="mt-3 pt-3 border-t border-[rgba(76,101,240,0.15)]">
                      <Link
                        href={`/campaigns?tab=schedule`}
                        className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
            ) : isSunsGame ? (
              <div className="text-xs text-[rgba(0,0,0,0.85)] tracking-tight leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold">Proactive Analysis:</span> I identified a Taylor Swift concert at U.S. Bank Stadium (7:00 PM, same evening) combined with a forecasted winter storm warning (NOAA: 6-8 inches of snow, 25 mph winds starting 5:00 PM). Analyzing transportation data from Uber/Lyft APIs shows 42% fewer available drivers during similar weather events, and historical attendance patterns show –18% during severe weather coinciding with major entertainment events. Current pacing is –11% vs. forecast.
                </p>
                <p>
                  If no action is taken, projected downside risk is <span className="font-semibold">$185K</span> in ticket and in-venue revenue. I've automatically flagged this and developed a comprehensive mitigation strategy.
                </p>
                <div>
                  <p className="font-semibold mb-2">Automated Mitigation & Upside Plan:</p>
                  <div className="space-y-2">
                    <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                      <div className="mb-2">
                        <span className="font-semibold">1) Weather Protection Package:</span> I've identified 8,200 fans within 2-mile radius (via geolocation data) and 3,400 parking pass holders. Creating a "Storm-Proof Experience" campaign with covered parking upgrades, early entry access, and complimentary hot beverage vouchers. Partnership opportunity with Metro Transit for guaranteed shuttle service.
                      </div>
                      <Link
                        href={`/chat?game=${game.id}`}
                        className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                      >
                        Create Weather Protection Package
                      </Link>
                    </div>
                    <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                      <div className="mb-2">
                        <span className="font-semibold">2) Premium Experience Upsell:</span> I've segmented 12,800 fans who've previously purchased premium experiences during adverse conditions. Campaign emphasizes climate-controlled seating, private club access, and exclusive meet-and-greet opportunities. Dynamic pricing will automatically adjust based on weather severity updates from NOAA.
                      </div>
                      <Link
                        href={`/chat?game=${game.id}`}
                        className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                      >
                        Create Premium Experience Upsell
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-[#007a47] mt-2">
                  This plan is projected to generate $315K–$445K in incremental revenue, offsetting weather impact while improving fan experience. I'll monitor weather updates every 30 minutes and auto-adjust messaging and offers based on real-time conditions.
                </p>

                {/* View Details Link */}
                <div className="mt-3 pt-3 border-t border-[rgba(76,101,240,0.15)]">
                  <Link
                    href={`/campaigns?tab=schedule`}
                    className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ) : isRocketsGame ? (
              <div className="text-xs text-[rgba(0,0,0,0.85)] tracking-tight leading-relaxed space-y-2">
                <p>
                  <span className="font-semibold">Proactive Analysis:</span> I detected that Houston Rockets guard Jalen Green (Minnesota native) is returning home for the first time this season. Cross-referencing social media engagement (67% increase in Rockets-related mentions from local accounts), search volume data from Google Trends (3.2x spike in "Jalen Green tickets"), and historical data from similar hometown return games (avg. +22% ticket demand), I see an untapped opportunity.
                </p>
                <p>
                  Current pacing is –8% vs. forecast, but this is likely due to lack of awareness about the hometown storyline. If we don't capitalize on this narrative, we're leaving <span className="font-semibold">$195K</span> in potential revenue on the table. I've automatically developed an opportunity capture plan.
                </p>
                <div>
                  <p className="font-semibold mb-2">Automated Opportunity Capture Plan:</p>
                  <div className="space-y-2">
                    <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                      <div className="mb-2">
                        <span className="font-semibold">1) Local Hero Campaign:</span> I've identified 14,200 fans who attended DeLaSalle High School games (Jalen's alma mater) or live within 5 miles of his former school. Creating a "Welcome Home Jalen" campaign with exclusive pregame warmup viewing access and commemorative giveaway. Partnership opportunity with DeLaSalle for alumni reunion package.
                      </div>
                      <Link
                        href={`/chat?game=${game.id}`}
                        className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                      >
                        Create Local Hero Campaign
                      </Link>
                    </div>
                    <div className="bg-white border border-[rgba(76,101,240,0.2)] rounded-lg p-3">
                      <div className="mb-2">
                        <span className="font-semibold">2) Social Amplification Push:</span> I've segmented 22,500 younger fans (ages 18-34) with high social media engagement scores. Campaign features user-generated content contest (#WelcomeHomeJG) with courtside seat prizes and meet-and-greet opportunities. Automated social listening will track campaign hashtag performance and adjust creative in real-time.
                      </div>
                      <Link
                        href={`/chat?game=${game.id}`}
                        className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md"
                      >
                        Create Social Amplification Push
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-[#007a47] mt-2">
                  This plan is projected to generate $380K–$520K in incremental revenue, converting the hometown storyline into ticket sales and social engagement. I'll monitor social sentiment hourly and auto-optimize targeting and creative based on trending conversations.
                </p>

                {/* View Details Link */}
                <div className="mt-3 pt-3 border-t border-[rgba(76,101,240,0.15)]">
                  <Link
                    href={`/campaigns?tab=schedule`}
                    className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[rgba(0,0,0,0.85)] tracking-tight leading-relaxed">
                <p className="mb-3">{game.performanceInsight}</p>

                {/* Generic Action Buttons */}
                {game.actions.filter(a => a.type === 'campaign').length > 0 && (
                  <div className="space-y-2 mb-3">
                    {game.actions.filter(a => a.type === 'campaign').slice(0, 3).map((action, actionIndex) => (
                      <Link
                        key={actionIndex}
                        href={`/chat?game=${game.id}`}
                        className="inline-block bg-[#4c65f0] hover:bg-[#3d52c9] text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors shadow-sm hover:shadow-md mr-2"
                      >
                        Create "{action.label}" Campaign
                      </Link>
                    ))}
                  </div>
                )}

                {/* View Details Link */}
                <div className="pt-3 border-t border-[rgba(76,101,240,0.15)]">
                  <Link
                    href={`/campaigns?tab=schedule`}
                    className="text-[#4c65f0] hover:text-[#3d52c9] font-semibold text-xs tracking-tight transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
