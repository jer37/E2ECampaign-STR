# Season Ticket Renewal Campaign — Current Implementation

## Overview

The Season Ticket Renewal Campaign is an end-to-end flow that allows users to go from identifying a renewal opportunity to launching a fully-built AI-generated campaign. The flow spans three pages and involves a banner trigger, an AI chat experience with a thinking animation, a detailed strategy response, and a campaign sidebar with launch actions.

---

## Flow Summary

**Banner (Campaigns page)** → **Chat interface with AI thinking module** → **Campaign strategy + sidebar with Launch/Edit/Save actions** → **Redirect back to Campaigns (Active tab)**

---

## Step 1: Banner on Campaigns Page

**Location:** `/campaigns` → Active tab

**What the user sees:**

- A prominent banner at the top of the Active tab content area (below the tab bar, above the campaigns table)
- Styled as a horizontal card with a gradient background (`from-[rgba(76,101,240,0.06)]` to `from-[rgba(76,101,240,0.02)]`) and a subtle blue border
- Left side: A blue circular icon with a sparkle/star SVG
- Center content:
  - Bold blue title: **"Season Ticket Renewal Campaign"**
  - Description text: "4,120 holders entering renewal window — Build AI-powered renewal strategy for 2026-27 season"
- Right side:
  - "Mar 15 deadline" label
  - Right-arrow chevron icon (animates on hover)
- The entire banner is a clickable `<Link>` that navigates to `/chat?rec=renewal-1`

**Hover behavior:** Border darkens, shadow appears, arrow shifts right

---

## Step 2: Chat Interface — AI Thinking Module

**Location:** `/chat?rec=renewal-1`

**Entry behavior:**

- The chat page reads the `rec` URL parameter (`renewal-1`)
- Loads the corresponding recommendation from `mockRecommendations.ts` and campaign content from `campaignContent.ts`
- The recommendation's `chatPrompt` is displayed as the user's message (right-aligned, gray bubble)
- An "AI Recommendation" badge (sparkle icon + blue text) appears above the user message since it came from a recommendation

**User message displayed:**

> "Launch a comprehensive season ticket renewal campaign for 2026-27. We have 4,120 current holders with renewal deadline March 15. Build a multi-segment strategy with early-bird incentives, at-risk account intervention, and loyalty recognition to maximize renewal rate from 82% baseline to 90%+ target."

**AI Thinking Module (animated):**

After ~800ms, a floating "Building Campaign Strategy" card appears with:
- A pulsing blue avatar with a ping animation
- A progress bar that fills as steps complete
- 6 sequential thinking steps, each with:
  - A generic text that appears first (e.g., "Analyzing season ticket holder database")
  - A transition to specific text after a delay (e.g., "Profiling 4,120 current holders by tenure, engagement score, and renewal likelihood")
  - Reasoning text that appears below in blue (e.g., explains the segmentation rationale)
  - A step indicator icon: pulsing blue dot (active), green checkmark with pop animation (completed), or empty circle (pending)
  - Steps fade to 50% opacity once completed

**Thinking steps for renewal-1:**

1. Analyzing → Profiling 4,120 holders by tenure, engagement, renewal likelihood
2. Calculating risk → Identifying 420 at-risk accounts (82% baseline → 90% target)
3. Designing incentives → 4-tier early-bird program: Lock-In, Loyalty Upgrade, Flex Add-On, Legacy
4. Building outreach → Multi-channel: rep calls (at-risk) + email + app + direct mail
5. Modeling revenue → 90% renewal rate → 3,708 renewals → $6.8M committed revenue
6. Setting timeline → 6-week campaign: Early-bird (Feb 10-28) → Standard (Mar 1-15) → Final push

**Total thinking animation duration:** ~11 seconds

---

## Step 3: AI Campaign Response

**Location:** Same `/chat` page, below the thinking module

After thinking completes (~11.1 seconds), the thinking module disappears and the AI response fades in with staggered animations:

**Response content includes:**

1. **Intro paragraph** — Summarizes the campaign: 4,120 holders, 4 tenure segments, 420 at-risk accounts, 4-tier incentive program, March 15 deadline

2. **Data table** — 4-column table with segments:
   | Holder Segment | Incentive Package | Will Test | Outreach Channel |
   |---|---|---|---|
   | Loyal Veterans (10+ yrs, 1,240) | Legacy recognition + seat lock | Recognition vs upgrade offer | Personal letter + rep call |
   | Established (5-9 yrs, 1,380) | Loyalty seat upgrade | Upgrade vs 5% discount | Email sequence + app |
   | Developing (2-4 yrs, 980) | Flex guest pass add-on | Flexibility vs pricing | Email + SMS + app |
   | First-Year (520) | 5% early-bird discount | Discount vs experience perks | Rep call + email + event |

3. **Strategy paragraph** — Detailed breakdown of each segment's approach, testing variables, and messaging

4. **Testing paragraph + Testing card** — "Active Testing & Optimization" card listing 5 A/B test variables (incentive type, urgency framing, outreach cadence, payment options, social proof)

5. **Inventory paragraph** — Seat inventory details, upgrade pool, parking passes, guest pass allocation

6. **Optimization card** — "Auto-Optimization Rules" with 5 conditional rules (e.g., if early-bird >65% → reduce discount)

7. **Conclusion paragraph** — Launch plan, timeline, projected $6.8M revenue at 90% renewal rate + $340K upgrade revenue

---

## Step 4: Campaign Sidebar (Right Panel)

**Location:** Right side of chat page, slides in ~500ms after the AI response starts appearing

**Sidebar contents (top to bottom):**

- **Header bar** — Star icon + "New Campaign" title, share button, close button
- **Badge** — Green "Renewal Campaign" status badge
- **Title & Revenue** —
  - Title: "Season Ticket Renewal Campaign"
  - Subtitle: "4,120 Holders • 4 Segments • Mar 15 Deadline"
  - Revenue: "$6.8M" in green with "Committed renewal revenue (90% target)" label
- **Section cards** (gray background, icon + label + value):
  - Season Ticket Holders → 4,120 Accounts
  - At-Risk Accounts → 420 Flagged
  - Avg. Account Value → $4,200/season
  - Outreach → Multi-Channel
- **Key Decisions card** — Bordered card listing 5 key decisions made by the AI
- **Action buttons:**
  1. **"Launch Campaign"** — Blue button, saves campaign as Active to localStorage, redirects to `/campaigns?tab=active`
  2. **"Edit Campaign"** — Black button, scrolls to and focuses the chat input textarea
  3. **"Save as Draft"** — Outlined button, saves campaign as Draft to localStorage, redirects to `/campaigns?tab=active`
- **Disclaimer** — "Campaign will go live immediately. Landing pages will be published and messages scheduled."

---

## Step 5: Post-Launch / Post-Save

**What happens on Launch or Save as Draft:**

- Campaign is saved to `localStorage` via `saveCampaign()` from `lib/campaignsStore.ts`
- Campaign object includes: title, description, status (Active or Draft), segment, type, revenue projections, analytics placeholders, and `createdFrom: 'renewal-1'`
- User is redirected to `/campaigns?tab=active` where the new campaign appears in the campaigns table

---

## Technical Details

### Key Files

| File | Purpose |
|------|---------|
| `app/campaigns/page.tsx` | Contains the Season Ticket Renewal banner (lines 127-154) |
| `app/chat/page.tsx` | Full chat interface: thinking module, AI response, sidebar, action buttons |
| `lib/campaignContent.ts` | Contains `renewal1Content` object with all thinking steps, response text, data tables, sidebar content |
| `lib/mockRecommendations.ts` | Contains `renewal-1` recommendation with metadata, chatPrompt, impact/urgency data |
| `lib/campaignsStore.ts` | localStorage CRUD for saving/loading campaigns |
| `components/Sidebar.tsx` | App-wide navigation sidebar |
| `components/TabBar.tsx` | Campaigns page tab navigation |

### URL & Routing

- Banner links to: `/chat?rec=renewal-1`
- Chat page reads `rec` param via `useSearchParams()`
- Recommendation data loaded via `getRecommendationById('renewal-1')`
- Campaign content loaded via `getCampaignContent('renewal-1')`
- After launch/save: redirects to `/campaigns?tab=active`

### State Management

- Campaign data stored in `localStorage` (no backend)
- UI state managed with React `useState` and `useEffect` hooks
- Thinking animation orchestrated via cascading `setTimeout` calls with configurable delays/durations per step
- Sidebar slide-in triggered after thinking completes (~11.6 seconds)

### Design System

- Primary blue: `#4c65f0`
- Success green: `#007a47`
- Error red: `#d32f2f`
- Accent lime: `#ccff00`
- Fonts: Inter (headings), Roboto (inputs)
- Animations: `fade-in`, `slide-in`, `slide-in-left`, `check-pop`, `pulse-glow`, `pulse`, `ping`

---

## STR Workflow — Interactive Season Ticket Renewal Flow

**Location:** `/chat?workflow=str`

**Source code location:** `/Users/joelresnicow/E2ECampaign/app/chat/page.tsx` (served on port 3000)

This is an alternative, multi-step conversational workflow for building a Season Ticket Renewal campaign. Instead of immediately generating a campaign, the AI walks the user through a series of guided questions to collect their goals and preferences before building the strategy.

**Note:** The workspace copy at `/Users/joelresnicow/Claud.md/E2ECampaign` does **not** contain this workflow. The STR code exists only in `/Users/joelresnicow/E2ECampaign`.

---

### STR Step 1: Greeting + Historical Performance

**What the user sees (sequentially animated):**

1. **Greeting text:** "Hi there, let's get started" (fades in at 100ms)
2. **Context text:** "As a reminder, here's your renewal performance for the past 3 seasons:" (fades in at 800ms)
3. **Historical table** (fades in at 800ms) with 3 seasons of data:

| Season | Renewal Rate | Full Season | Half Season | Flex Plans | Total Revenue |
|--------|-------------|-------------|-------------|------------|---------------|
| 2023 | 74% | $38.2MM | $12.8MM | $6.9MM | $57.9MM |
| 2024 | 76% | $42.1MM | $14.5MM | $7.8MM | $64.4MM |
| 2025 | 79% | $46.8MM | $16.2MM | $8.4MM | $71.4MM |

### STR Step 2: Goal Slider

**What the user sees (fades in at 1600ms):**

- Question: "What is your goal for this upcoming season?"
- A slider card with:
  - **Left label:** "Maximize Revenue" — "Focus on higher pricing for premium inventory"
  - **Right label:** "Maximize Renewals" — "Focus on retention rate and fan perceived value"
  - **Range slider** (0-100) with gradient from blue (#4c65f0) to lime (#ccff00)
  - **Dynamic metrics** that update as the slider moves:
    - **Forecasted Revenue:** Calculated as `${ 81.2 - (sliderValue / 100) * 10.1 }MM` (ranges from ~$81.2MM to ~$71.1MM)
    - **Forecasted Renewal Rate:** Calculated as `{ 67 + (sliderValue / 100) * 20 }%` (ranges from 67% to 87%)
  - **Continue button** — Submits the slider value and advances to the next step

### STR Step 3: Additional Preferences (Checkboxes)

**What the user sees after clicking Continue:**

- Question: "What else is important to you?"
- Checkbox options:
  - Renewals of longtime members
  - Capping Maximum Price Increase (with conditional numeric input for percentage when checked)
  - Upselling from Quarter to Half Season
  - Upselling from Half to Full Season
  - Cross Sell Subscriptions to At Risk Accounts
- **Continue button**

### STR Step 4: Payment Plans

**What the user sees after clicking Continue:**

- Question: "What kind of payment plans do you want to make available?"
- Three checkbox plan options:
  1. 10% upfront, with 12 equal monthly payments
  2. 15% upfront with 9 equal payments — **[RECOMMENDED]** (highlighted with blue border)
  3. 10% upfront with 6 equal payments
- **Continue button**

### STR Step 5: Full Upfront Payment Question

**What the user sees:**

- Question: "Require full upfront payment for fans who missed payment deadlines last season?"
- Two buttons: **Yes** / **No**
- After selection, the chosen answer is displayed in a blue confirmation badge

### STR Step 6: Opt-Out Options

**What the user sees:**

- Question: "For fans who opt out of auto-renewal, what options do you want to provide to them?"
- Checkbox options:
  - Offer discount equivalent to unused credits from prior season
  - Offer half or quarter season plans on the same seat
  - Offer 3 free upgrades to next best price level — **[RECOMMENDED]** (highlighted with blue border)
- **Continue button** — Clicking this triggers campaign generation

### STR Step 7: AI Thinking Module + Campaign Generation

After the final Continue, the system:

1. Sets `generatingCampaign = true` and `selectedGoal` to the slider value
2. Generates **dynamic thinking steps** based on the user's selections (6 steps, ~12.4 seconds total):
   - Analyzing season ticket holder data (9,345 holders)
   - Segmenting member base (premium-focused / retention-focused / balanced based on slider)
   - Calculating pricing strategy (incorporates price cap if selected)
   - Designing member communications
   - Planning upsell opportunities (based on checkbox selections)
   - Finalizing campaign structure (with projected renewal rate and revenue)

3. Generates **dynamic campaign response** with:
   - Intro paragraph reflecting the user's slider position and checkbox selections
   - Segment table with dynamically generated rows based on selections (e.g., "Longtime Loyalists" row only appears if that checkbox was selected)
   - Strategy, testing, inventory, and conclusion paragraphs all personalized to selections

4. **Sidebar** slides in with STR-specific content:
   - Badge: "Season Ticket Renewal"
   - Title: "2026 Season Ticket Renewal Campaign"
   - Revenue: dynamically calculated from slider
   - Section cards: Target Accounts (9,345), Renewal Target (dynamic %), Price Cap (if selected), Campaign Duration, Payment Plans
   - Key Decisions: dynamically built from all user selections
   - Action buttons: Launch Campaign, Edit Campaign, Save as Draft

### STR Launch Behavior

When "Launch Campaign" is clicked:
- Saves campaign to localStorage with `createdFrom: 'str-workflow'`
- Campaign title: "2026 Season Ticket Renewal Campaign"
- Projected revenue calculated from slider value
- Redirects to `/campaigns?tab=active`

---

## What's Not Yet Implemented

The following items could be added to enhance the existing flows:

- **Banner linking to STR workflow** — The banner on `/campaigns` currently links to `/chat?rec=renewal-1` (the standard flow), not to `/chat?workflow=str` (the interactive slider flow). A decision is needed on which flow the banner should trigger, or whether both should be accessible.
- **Syncing the two project copies** — The workspace copy (`/Users/joelresnicow/Claud.md/E2ECampaign`) is behind the running copy (`/Users/joelresnicow/E2ECampaign`) and does not contain the STR workflow code.
