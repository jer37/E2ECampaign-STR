# Season Ticket Renewal Campaign — Current Implementation

## Overview

The Season Ticket Renewal Campaign is an end-to-end flow that allows users to go from identifying a renewal opportunity to launching a fully-built AI-generated campaign. The flow spans three pages and involves a banner trigger, an AI chat experience with a thinking animation, a detailed strategy response, and a campaign sidebar with launch actions.

---

## Flow Summary

**Banner (Campaigns page → Season Opportunities tab)** → **Chat interface with multi-step guided inputs** → **AI thinking module + campaign strategy + sidebar with Launch/Edit/Save actions** → **Redirect back to Campaigns (Active tab)**

---

## Step 1: Banner on Campaigns Page

**Location:** `/campaigns` → Season Opportunities tab

**What the user sees:**

- A prominent banner at the top of the Season Opportunities tab content area (rendered via `GoalsView` component)
- Styled as a horizontal card with a gradient background (`from-[rgba(76,101,240,0.06)]` to `from-[rgba(76,101,240,0.02)]`) and a subtle blue border
- Left side: A blue circular icon with a sparkle/star SVG
- Center content:
  - Pill badge: **"Annual Planning Cycle"** with calendar icon (blue rounded pill, `bg-[#4c65f0]`)
  - Bold blue title: **"Season Ticket Renewal Campaign"**
  - Description text: "4,120 holders entering renewal window — Build AI-powered renewal strategy for 2026-27 season"
- Right side:
  - "Mar 15 deadline" label
  - Right-arrow chevron icon (animates on hover)
- The entire banner is a clickable `<Link>` that navigates to `/chat?workflow=str`

**Hover behavior:** Border darkens, shadow appears, arrow shifts right

---

## STR Workflow — Interactive Season Ticket Renewal Flow

**Location:** `/chat?workflow=str`

**Source code location:** `app/chat/page.tsx`

This is the primary multi-step conversational workflow for building a Season Ticket Renewal campaign. The AI walks the user through guided questions to collect goals and preferences before building the strategy.

---

### STR Step 1: Greeting + Historical Performance

**What the user sees (sequentially animated):**

1. **Greeting text:** "Hi there, let's get started" (fades in at 100ms)
2. **Context text:** "As a reminder, here's your renewal performance for the past 3 seasons:" (fades in at 800ms)
3. **Historical table** (fades in at 800ms) with 3 seasons of data:

| Season | Accounts | Renewal Rate | Full Season | Half Season | Flex Plans | Total Revenue | Avg/Acct |
|--------|----------|-------------|-------------|-------------|------------|---------------|----------|
| 2023 | 8,200 | 74% | $38.2MM | $12.8MM | $6.9MM | $57.9MM | $7,061 |
| 2024 | 8,800 | 76% | $42.1MM | $14.5MM | $7.8MM | $64.4MM | $7,318 |
| 2025 | 9,345 | 79% | $46.8MM | $16.2MM | $8.4MM | $71.4MM | $7,639 |

**State variable:** `showHistoricalTable`

---

### STR Step 2: Goal Slider

**What the user sees (fades in at 1600ms):**

- Question: "What is your goal for this upcoming season?"
- A slider card with:
  - **Left label:** "Maximize Revenue" — "Focus on higher pricing for premium inventory"
  - **Right label:** "Maximize Renewals" — "Focus on retention rate and fan perceived value"
  - **Range slider** (0-100) with gradient from blue (#4c65f0) to lime (#ccff00)
  - **Dynamic metrics** that update as the slider moves:
    - **Forecasted Revenue:** `${(78.0 - (sliderValue / 100) * 5.0).toFixed(1)}MM` — ranges from $78.0MM (max revenue) to $73.0MM (max renewals)
    - **Forecasted Renewal Rate:** `{(72 + (sliderValue / 100) * 16).toFixed(1)}%` — ranges from 72.0% to 88.0%
    - **Avg Rev / Account:** dynamically calculated from revenue and projected accounts
    - **Implied churn text:** "~{X} accounts would not renew at this setting" — makes churn tangible
  - **Continue button** — Submits the slider value and advances to the next step

**State variables:** `sliderValue` (default: 50), `sliderSubmitted`

---

### STR Step 3: Additional Preferences (Checkboxes)

**What the user sees after clicking Continue:**

- Question: "What else is important to you?"

**Checkbox options (all unchecked by default unless noted):**

1. **Renewals of longtime members**
2. **Capping Maximum Price Increase** — with "Recommended: 12%" text next to the checkbox. When checked, a conditional numeric input appears for max % (default: `12`). State: `priceCapPercentage`
3. **Upselling from Quarter to Half Season**
4. **Upselling from Half to Full Season**
5. **Cross Sell Subscriptions to At Risk Accounts**
6. **Seat relocation incentives** — with "Recommended" badge
7. **Referral bonus for renewals** — with "Recommended" badge. When checked, a conditional input for referral credit amount appears (default: `$200`). State: `referralCreditAmount`
8. **Early access perks** — with "Recommended" badge
9. **Win-back campaign for lapsed season ticket holders** — with "New" badge
10. **Renewal Default** — radio buttons: "Auto-renew with opt-out" (default) / "Require active renewal". State: `autoRenewalDefault` (true = auto-renew)

**State variable:** `checkboxSelections` (object with boolean keys for each option)

- **Continue button**

---

### STR Step 4: Payment Plans

**What the user sees after clicking Continue:**

- Question: "What kind of payment plans do you want to make available?"

**Plan options:**

1. **10% upfront, with 12 equal monthly payments** — State: `paymentPlans.plan1`
2. **15% upfront with 9 equal payments** — **[RECOMMENDED]** — State: `paymentPlans.plan2`
3. **10% upfront with 6 equal payments** — State: `paymentPlans.plan3`
4. **Pay-in-full discount** — **[Recommended]** badge. When checked, a conditional input for discount percentage appears (default: `5%`). State: `paymentPlans.payInFull`, `payInFullDiscount`
5. **Monthly subscription — $0 upfront, 12 equal payments** — **[New]** badge. State: `paymentPlans.monthlySubscription`

**Additional controls:**

- **"Require credit card on file for all payment plans"** checkbox — default: checked. State: `requireCardOnFile`
- **Cash flow estimate indicator** — dynamically updates below the plan selection based on selected plans, showing revenue timing (e.g., "~55% of revenue collected by opening day")

**State variable:** `paymentPlans` (object with boolean keys), `payInFullDiscount`, `requireCardOnFile`

- **Continue button**

---

### STR Step 5: Missed Payment Policy

**What the user sees:**

- **Contextual data:** "142 accounts missed payment deadlines last season, representing $1.1MM in delayed collections."
- Question: "For fans who missed payment deadlines last season, what's your approach?"

**Three button options (graduated):**

1. **"Require full upfront payment"** — Strictest option. State value: `'full'`
2. **"Require higher deposit (25-50%)"** — **[Recommended]** badge. When selected, a conditional input for deposit percentage appears (default: `35%`). State value: `'higher-deposit'`, `missedPaymentDeposit`
3. **"Standard terms with stricter auto-pay enforcement"** — Gentlest option. State value: `'standard'`

After selection, the chosen answer is displayed in a blue confirmation badge.

**State variable:** `requireFullUpfront` (type: `string | null` — `'full'`, `'higher-deposit'`, or `'standard'`)

---

### STR Step 6: Opt-Out Options

**What the user sees:**

- Question: "For fans who opt out of auto-renewal, what options do you want to provide to them?"

**Checkbox options:**

1. **Offer discount equivalent to unused credits from prior season** — State: `optOutOptions.discountCredits`
2. **Offer half or quarter season plans on the same seat** — State: `optOutOptions.offerHalfQuarter`
3. **Offer 3 free upgrades to next best price level** — **[Recommended]** badge. State: `optOutOptions.freeUpgrades`
4. **Notify fans they'll lose seat priority and go to back of waitlist** — **[Recommended]** badge. State: `optOutOptions.waitlistPriority`
5. **Offer 1-year membership freeze with guaranteed seat return** — **[New]** badge. State: `optOutOptions.pauseSeason`
6. **Require exit survey before processing cancellation** — State: `optOutOptions.exitSurvey`
7. **Route to account rep for personal outreach before processing** — **[Recommended]** badge. State: `optOutOptions.repOutreach`

**State variable:** `optOutOptions` (object with boolean keys)

- **Continue button** — Clicking this triggers campaign generation

---

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

4. **Sidebar** slides in with STR-specific content (see below)

---

## Campaign Sidebar (Right Panel)

**Location:** Right side of chat page, slides in ~500ms after the AI response starts appearing

**Sidebar header:**

- Document icon (inline SVG) + "New Campaign" title
- Share button (share/network icon, inline SVG)
- Close button (X icon)

**Sidebar contents:**

- **Badge** — Green "Season Ticket Renewal" status badge
- **Title & Revenue** —
  - Title: "2026 Season Ticket Renewal Campaign"
  - Subtitle: "Multi-segment retention strategy"
  - Revenue: dynamically calculated `${(78.0 - (sliderValue / 100) * 5.0).toFixed(1)}MM` in green
- **Section cards** (gray background, inline SVG icon + label + value):
  - People/users icon → **Target Accounts** → "9,345 Season Ticket Holders"
  - Bullseye/target icon → **Renewal Target** → `{renewalRate}% Retention Rate` (dynamic from slider)
  - Shield icon → **Price Cap** → `{priceCapPercentage}% Maximum Increase` (only shown if `cappingPrice` checkbox is checked)
  - Calendar icon → **Campaign Duration** → "60-day renewal window"
  - Credit card icon → **Payment Plans** → dynamic list of selected plans (e.g., "Pay-in-full, 12mo, Monthly options")
  - Dollar sign icon → **Missed Payment Policy** → reflects selection ("Full upfront required" / "{X}% deposit required" / "Auto-pay enforcement")

- **Key Decisions card** — dynamically built from all user selections:
  - Renewal rate and revenue targets
  - Longtime member recognition (if selected)
  - Price cap percentage (if selected)
  - Upsell paths (quarter→half, half→full)
  - Cross-sell to at-risk (if selected)
  - Seat relocation incentives (if selected)
  - Referral bonus with credit amount (if selected)
  - Early access perks (if selected)
  - Win-back for lapsed STH (if selected)
  - Payment options with full details
  - Missed payment policy
  - Retention offers for opt-outs (all selected options listed)

- **Action buttons:**
  1. **"Launch Campaign"** — Blue button, saves campaign as Active to localStorage, redirects to `/campaigns?tab=active`
  2. **"Edit Campaign"** — Black button, scrolls to and focuses the chat input textarea
  3. **"Save as Draft"** — Outlined button, saves campaign as Draft to localStorage, redirects to `/campaigns?tab=active`
- **Disclaimer** — "Campaign will go live immediately. Landing pages will be published and messages scheduled."

---

## Post-Launch / Post-Save

**What happens on Launch or Save as Draft:**

- Campaign is saved to `localStorage` via `saveCampaign()` from `lib/campaignsStore.ts`
- Campaign object includes: title, description, status (Active or Draft), segment, type, revenue projections, analytics placeholders, and `createdFrom: 'str-workflow'`
- User is redirected to `/campaigns?tab=active` where the new campaign appears in the campaigns table

---

## Technical Details

### Key Files

| File | Purpose |
|------|---------|
| `app/campaigns/page.tsx` | Campaigns dashboard with tab navigation; Season Opportunities tab renders `GoalsView` component containing the STR banner |
| `components/GoalsView.tsx` | Contains the Season Ticket Renewal CTA banner (and the Pricing CTA banner), both with "Annual Planning Cycle" pill badges |
| `app/chat/page.tsx` | Full chat interface: multi-step STR workflow inputs, thinking module, AI response, sidebar, action buttons |
| `lib/campaignContent.ts` | Contains campaign content objects with thinking steps, response text, data tables, sidebar content |
| `lib/mockRecommendations.ts` | Contains recommendation metadata |
| `lib/campaignsStore.ts` | localStorage CRUD for saving/loading campaigns |
| `components/Sidebar.tsx` | App-wide navigation sidebar |
| `components/TabBar.tsx` | Campaigns page tab navigation |
| `app/layout.tsx` | Root layout with header; contains Timberwolves logo (ESPN CDN) |

### URL & Routing

- Banner links to: `/chat?workflow=str`
- Chat page reads `workflow` param via `useSearchParams()`
- When `workflow === 'str'`, render the multi-step STR workflow
- After launch/save: redirects to `/campaigns?tab=active`

### State Management

All STR state variables in `app/chat/page.tsx`:

```typescript
sliderValue (number, 0-100, default: 50)
sliderSubmitted (boolean)
checkboxSelections ({
  longtimeMembers: boolean,
  cappingPrice: boolean,
  upsellingQuarterToHalf: boolean,
  upsellingHalfToFull: boolean,
  crossSellAtRisk: boolean,
  seatRelocation: boolean,
  referralBonus: boolean,
  earlyAccessPerks: boolean,
  winBackLapsed: boolean,
  autoRenewalDefault: boolean (default: true)
})
priceCapPercentage (string, default: '12')
referralCreditAmount (string, default: '200')
paymentPlans ({
  plan1: boolean,
  plan2: boolean,
  plan3: boolean,
  payInFull: boolean,
  monthlySubscription: boolean,
})
payInFullDiscount (string, default: '5')
requireCardOnFile (boolean, default: true)
requireFullUpfront (string | null — 'full', 'higher-deposit', 'standard', or null)
missedPaymentDeposit (string, default: '35')
optOutOptions ({
  discountCredits: boolean,
  offerHalfQuarter: boolean,
  freeUpgrades: boolean,
  waitlistPriority: boolean,
  pauseSeason: boolean,
  exitSurvey: boolean,
  repOutreach: boolean,
})
```

### Dynamic Calculation Formulas

**Revenue projection** (STR goal slider):
```
projectedRevenue = 78.0 - (sliderValue / 100) * 5.0   // $78.0MM → $73.0MM
```

**Renewal rate** (STR goal slider):
```
renewalRate = 72 + (sliderValue / 100) * 16   // 72.0% → 88.0%
```

**Implied churn:**
```
churnCount = Math.round(9345 * (1 - renewalRate / 100))
```

### Design System

- Primary blue: `#4c65f0`
- Success green: `#007a47`
- Error red: `#d32f2f`
- Accent lime: `#ccff00`
- Fonts: Inter (headings), Roboto (inputs)
- Animations: `fade-in`, `slide-in`, `slide-in-left`, `check-pop`, `pulse-glow`, `pulse`, `ping`
- All icons are inline SVGs (no external image dependencies)
- Badge styles: "Recommended" = `bg-[rgba(76,101,240,0.1)] text-[#4c65f0]`, "New" = `bg-[#ccff00] text-black`

---

## What's Not Yet Implemented

### Medium Priority

- **Segmentation preview step** — New step between opt-out options and campaign generation showing account breakdown with adjustable thresholds
- **Communication timeline & channel selection** — New step with date pickers for early-bird/standard/deadline windows and channel checkboxes
- **Revenue per renewed account metric** on the goal slider (currently shows Avg Rev/Account but not as a third dynamic metric card)

### Lower Priority

- **Edge case handling** — Define behavior when user selects no preferences, doesn't move slider, or skips optional inputs
- **Auto-renewal default radio** impact on campaign generation — The selection is captured in state but not yet reflected in the AI-generated campaign content
