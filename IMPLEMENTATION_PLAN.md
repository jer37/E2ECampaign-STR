# Proactive Campaign Suggestions - Implementation Plan

## Overview
Transform the Campaign Builder from reactive (user-initiated) to proactive (AI-suggested) by identifying opportunities and recommending campaigns automatically.

## Core Philosophy
The system should feel like an intelligent assistant that's constantly monitoring the business and surfacing high-impact opportunities, not just waiting for users to ask.

## Implementation Strategy

### Phase 1: Main Dashboard Recommendations Section
**Location:** `/app/page.tsx` - Insert between metrics cards and search section

**Features:**
- New "AI-Recommended Campaigns" section with gradient accent
- Display 3 high-priority suggestions in card format
- Each card shows:
  - Opportunity title (e.g., "Boost Sales for Underperforming Game")
  - Context snippet (e.g., "Timberwolves vs Pacers - Jan 15 • 45% unsold")
  - Projected impact (e.g., "Potential +$380K revenue")
  - Urgency indicator (e.g., "Game in 3 days")
  - "Build Campaign" CTA button
- Visual differentiation: Sparkle icon + gradient border for AI recommendations
- Cards have hover states with lift effect

**Mock Data Scenarios:**
1. **Underperforming Inventory:**
   - Title: "Fill Seats for Timberwolves vs Pacers"
   - Context: "Jan 15, 2026 • 1,890 unsold seats (45% capacity)"
   - Impact: "Potential +$380K revenue"
   - Urgency: "Game in 3 days"
   - Confidence: 94%

2. **At-Risk Season Ticket Holders:**
   - Title: "Retain At-Risk Season Ticket Holders"
   - Context: "847 accounts showing low engagement"
   - Impact: "Prevent $2.1M churn risk"
   - Urgency: "Renewal deadline Feb 1"
   - Confidence: 89%

3. **Conversion Opportunity:**
   - Title: "Convert Flex to Half Season Plans"
   - Context: "1,240 flex plan holders with 8+ game purchases"
   - Impact: "Potential +$620K upsell revenue"
   - Urgency: "Prime conversion window"
   - Confidence: 87%

**User Flow:**
- User clicks "Build Campaign" on any card
- Navigates to `/chat` with pre-filled context
- Thinking module immediately starts (no create-campaign intermediate page)
- Context object passed via URL params or session storage

**Technical Implementation:**
```tsx
// New component: RecommendedCampaigns
interface Recommendation {
  id: string;
  title: string;
  context: string;
  impact: string;
  urgency: string;
  confidence: number;
  prompt: string; // Pre-filled prompt for chat
  category: 'inventory' | 'retention' | 'conversion';
}

const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Fill Seats for Timberwolves vs Pacers',
    context: 'Jan 15, 2026 • 1,890 unsold seats (45% capacity)',
    impact: 'Potential +$380K revenue',
    urgency: 'Game in 3 days',
    confidence: 94,
    prompt: 'Create a last-minute campaign to fill 1,890 unsold seats for Timberwolves vs Pacers on Jan 15. Target price-sensitive fans and families.',
    category: 'inventory'
  },
  // ... other recommendations
];
```

### Phase 2: Dynamic Create Campaign Suggestions
**Location:** `/app/create-campaign/page.tsx` - Replace static suggestions array

**Changes:**
- Replace hardcoded `suggestions` array with dynamic recommendations
- Show same 3 opportunities from dashboard + 3 general templates
- Order by urgency/confidence score
- When user clicks suggestion chip:
  - If it's a recommendation: Go to `/chat` with context
  - If it's a template: Show input field to customize
- Add small sparkle icon to AI-recommended chips

**Visual Differentiation:**
```tsx
// AI-recommended chips have gradient border
<SuggestionChip
  text={suggestion.title}
  isAIRecommended={suggestion.category !== 'template'}
  impact={suggestion.impact}
  onClick={() => handleSuggestionClick(suggestion)}
/>
```

### Phase 3: Chat Page Context Integration
**Location:** `/app/chat/page.tsx` - Add URL param/state handling

**Features:**
- Accept `recommendationId` or `prompt` param
- Load pre-filled context when coming from recommendation
- Show "AI Recommendation" badge in header
- Thinking module steps reference the specific opportunity
- Campaign sidebar shows additional context:
  - Original opportunity that triggered recommendation
  - Real-time data snapshot (inventory levels, segment sizes, etc.)
  - Confidence score breakdown

**Technical Implementation:**
```tsx
// In chat page
const searchParams = useSearchParams();
const recommendationId = searchParams.get('rec');
const prefilledPrompt = searchParams.get('prompt');

useEffect(() => {
  if (recommendationId) {
    // Load recommendation data
    // Show contextual thinking steps
  }
}, [recommendationId]);
```

### Phase 4: Visual Enhancements

**Design System Additions:**
1. **AI Badge Component:**
   - Sparkle icon + "AI Recommended" text
   - Gradient background (purple to lime)
   - Subtle pulse animation

2. **Opportunity Cards:**
   - White background with gradient border
   - Hover: Border glows, card lifts
   - Top-right: Confidence percentage badge
   - Bottom: Full-width gradient CTA button

3. **Impact Metrics:**
   - Large bold numbers (e.g., "$380K")
   - Supporting text below (e.g., "potential revenue")
   - Color-coded by impact type:
     - Green: Revenue opportunity
     - Orange: Risk prevention
     - Purple: Conversion/upsell

4. **Urgency Indicators:**
   - Time-based: "3 days left" with clock icon
   - Priority-based: "High Priority" with flame icon
   - Subtle animation draws attention without being annoying

## Technical Architecture

### Data Structure
```typescript
interface OpportunityData {
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
  relatedData: {
    eventId?: string;
    segmentId?: string;
    inventorySnapshot?: object;
  };
}
```

### State Management
- Use React Context or prop drilling for recommendation data
- Store active recommendation in session storage for chat page
- Clear on navigation away from chat

### Mock Data Service
```typescript
// /lib/mockRecommendations.ts
export function getActiveRecommendations(): OpportunityData[] {
  // Return 3-5 high-priority recommendations
  // In production, this would call an API
}

export function getRecommendationById(id: string): OpportunityData | null {
  // Fetch specific recommendation details
}
```

## Animation & Interaction Design

### Dashboard Recommendations Section
1. **Entrance:** Fade in with stagger (400ms delay between cards)
2. **Hover State:**
   - Card lifts 4px
   - Border gradient animates
   - Button background shifts
3. **Click Animation:**
   - Card scales down to 0.98
   - Quick haptic feedback feel
   - Route to chat with smooth transition

### Confidence Indicators
- Circular progress indicator (0-100%)
- Green gradient fill for high confidence (>85%)
- Orange for medium (70-85%)
- Animate progress on mount

### Impact Numbers
- Count-up animation on first view
- Bold typography with color emphasis
- Subtle glow effect on hover

## User Experience Flow

### Scenario 1: User Arrives at Dashboard
1. User logs in, sees campaigns dashboard
2. "AI-Recommended Campaigns" section appears below metrics
3. 3 cards show urgent opportunities with sparkle icons
4. User reads "Fill Seats for Timberwolves vs Pacers" card
5. Sees "Potential +$380K revenue" and "Game in 3 days"
6. Clicks "Build Campaign" button
7. Immediately taken to `/chat?rec=rec-1`
8. Thinking module starts with context: "Analyzing underperforming inventory for Jan 15 game..."
9. Campaign built with specific targeting for the Pacers game
10. Sidebar shows inventory snapshot and pricing strategy

### Scenario 2: User Clicks "Create Campaign"
1. User clicks top-right "Create Campaign" button
2. Lands on `/create-campaign` page
3. Sees mix of AI recommendations (with sparkle) and templates
4. Clicks "Fill Seats for Timberwolves vs Pacers" chip
5. Same flow as Scenario 1 (goes to chat with context)

### Scenario 3: User Wants Custom Campaign
1. User on `/create-campaign` page
2. Ignores suggestion chips
3. Types custom prompt: "Create campaign for weekend games in March"
4. Clicks submit
5. Goes to chat with their custom prompt
6. No pre-filled context, full flexibility

## Implementation Checklist

### File Changes Required:
- [ ] `/app/page.tsx` - Add RecommendedCampaigns section
- [ ] `/app/create-campaign/page.tsx` - Make suggestions dynamic
- [ ] `/app/chat/page.tsx` - Add recommendation context handling
- [ ] `/lib/mockRecommendations.ts` - Create mock data service
- [ ] `/components/RecommendedCampaigns.tsx` - New component
- [ ] `/components/OpportunityCard.tsx` - New component
- [ ] `/components/AIBadge.tsx` - New component
- [ ] `/app/globals.css` - Add new animations

### Key Components to Build:
1. **RecommendedCampaigns** - Section wrapper with header
2. **OpportunityCard** - Individual recommendation card
3. **AIBadge** - Sparkle + "AI Recommended" indicator
4. **ImpactMetric** - Formatted impact display
5. **ConfidenceBadge** - Circular progress indicator
6. **SuggestionChip** (enhanced) - Support AI vs template styling

### Animation Keyframes to Add:
- `@keyframes lift` - Card hover elevation
- `@keyframes glow-border` - Gradient border animation
- `@keyframes count-up` - Number animation
- `@keyframes confidence-fill` - Progress circle fill
- `@keyframes pulse-badge` - Subtle sparkle pulse

## Success Criteria

**User Experience:**
- [ ] Recommendations feel proactive and intelligent
- [ ] Clear value proposition in each card (impact + urgency)
- [ ] Smooth transition from recommendation to chat
- [ ] Context is preserved and visible in chat
- [ ] Animations enhance, not distract

**Visual Quality:**
- [ ] Matches brand colors and design system
- [ ] Marc Andreessen-worthy polish
- [ ] Responsive and performant
- [ ] Accessible (ARIA labels, keyboard nav)

**Technical:**
- [ ] Clean component architecture
- [ ] Reusable components
- [ ] TypeScript types defined
- [ ] No layout shifts or jank
- [ ] Fast navigation between pages

## Future Enhancements (Post-MVP)

1. **Dismissal System:** Users can dismiss recommendations with feedback
2. **Priority Queue:** Show different recommendations over time
3. **Impact Tracking:** Show actual results from launched campaigns
4. **Smart Timing:** Surface recommendations at optimal times
5. **Notification System:** Alert users to urgent opportunities
6. **Historical Context:** "Similar campaigns you ran generated $X"
7. **A/B Test Suggestions:** Recommend experiments based on data
8. **Seasonal Intelligence:** Proactively suggest holiday/playoff campaigns

## Notes

- All recommendation data is mocked for prototype
- In production, this would connect to analytics engine
- Keep animations smooth and professional
- Ensure the sparkle icon is consistent across all AI-suggested content
- Test with Marc Andreessen user persona in mind (high expectations)
