# On-Sale Pricing & Packaging Campaign — Implementation Requirements

## Overview

The On-Sale Pricing & Packaging Campaign is an end-to-end flow that allows users to configure upfront pricing and packaging options for the general on-sale of an NBA team's upcoming season. The flow spans three pages and involves a banner trigger, a multi-step AI chat experience with interactive inputs, a detailed pricing strategy response, and a campaign sidebar with launch actions. This workflow is modeled on the existing Season Ticket Renewal STR workflow (`/chat?workflow=str`) and follows identical UI patterns, animations, and technical architecture.

---

## Flow Summary

**Banner (Campaigns page)** → **Chat interface with multi-step guided inputs** → **AI thinking module + pricing strategy + sidebar with Launch/Edit/Save actions** → **Redirect back to Campaigns (Active tab)**

---

## Step 1: Banner on Campaigns Page

**Location:** `/campaigns` → Active tab

**What the user sees:**

- A prominent banner positioned below the existing Season Ticket Renewal banner (or in place of it if that campaign has already been launched), at the top of the Active tab content area (below the tab bar, above the campaigns table)
- Styled as a horizontal card with the same gradient background as the STR banner (`from-[rgba(76,101,240,0.06)]` to `from-[rgba(76,101,240,0.02)]`) and a subtle blue border
- Left side: A blue circular icon with a pricing/tag SVG (e.g., a ticket with a dollar sign, or a grid/chart icon to differentiate from the renewal sparkle icon)
- Center content:
  - Bold blue title: **"Configure On-Sale Pricing & Packaging"**
  - Description text: "18,200 seats across 41 home games — Set pricing, packages, and go-to-market strategy for 2026-27 on-sale"
- Right side:
  - "On-sale Jun 1" label
  - Right-arrow chevron icon (animates on hover)
- The entire banner is a clickable `<Link>` that navigates to `/chat?workflow=pricing`

**Hover behavior:** Border darkens, shadow appears, arrow shifts right (same as STR banner)

---

## Step 2: Chat Interface — Multi-Step Guided Workflow

**Location:** `/chat?workflow=pricing`

**Source code location:** `/Users/joelresnicow/E2ECampaign/app/chat/page.tsx` (extend existing chat page)

This is a multi-step conversational workflow (identical pattern to the STR workflow) where the AI walks the user through a series of guided questions to collect their pricing and packaging preferences before generating the full strategy.

---

### Pricing Step 1: Greeting + Historical Performance

**What the user sees (sequentially animated):**

1. **Greeting text:** "Hi there, let's configure your on-sale pricing and packaging" (fades in at 100ms)
2. **Context text:** "Here's your ticket revenue performance and sell-through for the past 3 seasons:" (fades in at 800ms)
3. **Historical table** (fades in at 800ms) with 3 seasons of data:

| Season | Avg Sell-Through | Single Game Rev | Flex Plans Rev | Partial Plans Rev | Full Season Rev | Total Ticket Rev |
|--------|-----------------|-----------------|---------------|-------------------|-----------------|------------------|
| 2023 | 81% | $14.2MM | $6.9MM | $19.7MM | $38.2MM | $79.0MM |
| 2024 | 84% | $16.8MM | $7.8MM | $22.3MM | $42.1MM | $89.0MM |
| 2025 | 87% | $19.1MM | $8.4MM | $24.6MM | $46.8MM | $98.9MM |

4. **Secondary market context** (fades in at 1200ms) — A small insight card:
   - "Secondary market avg: 112% of face value across all games last season"
   - "Top 10 games averaged 148% of face value; bottom 10 averaged 74%"

---

### Pricing Step 2: Goal Slider

**What the user sees (fades in at 1600ms):**

- Question: "What is your primary goal for this season's on-sale?"
- A slider card with:
  - **Left label:** "Maximize Revenue" — "Higher prices on premium inventory, accept lower fill rates on weaker games"
  - **Right label:** "Maximize Attendance" — "Competitive pricing across all games, prioritize sellouts and fan experience"
  - **Range slider** (0-100) with gradient from blue (#4c65f0) to lime (#ccff00)
  - **Dynamic metrics** that update as the slider moves:
    - **Forecasted Total Ticket Revenue:** Calculated as `${ 112.5 - (sliderValue / 100) * 14.8 }MM` (ranges from ~$112.5MM at full revenue focus to ~$97.7MM at full attendance focus)
    - **Forecasted Avg Sell-Through:** Calculated as `${ 78 + (sliderValue / 100) * 17 }%` (ranges from 78% to 95%)
  - **Continue button** — Submits the slider value and advances to the next step

---

### Pricing Step 3: Package Selection

**What the user sees after clicking Continue:**

- Question: "Which package types do you want to offer this season?"
- Checkbox options (each with a brief description):
  - Full Season Plan (41 games) — **[ON by default]**
  - Half Season Plan (20 games) — **[ON by default]**
  - Quarter Season Plan (10 games) — **[ON by default]**
  - 5-Game Mini Plan (NEW) — with subtext: "New offering — attracts first-time plan buyers"
  - Flex Plan (choose-your-own games) — with conditional inputs when checked:
    - Number of games in flex pack: dropdown with options [5, 10, 15, 20]
    - Allow fans to pick their own games? **Yes** / **No** toggle
  - Single Game Tickets — **[ON by default]**
  - Group Packages (15+ tickets) — with conditional input: minimum group size (numeric input, default 15)
- **Continue button**

---

### Pricing Step 4: Game Tiering

**What the user sees after clicking Continue:**

- Question: "How do you want to tier your home games for pricing purposes?"
- Three radio button options with visual previews:
  1. **Conservative (3 tiers)** — "Standard, Premium, Marquee" — subtext: "Simpler for fans to understand; less revenue optimization"
  2. **Balanced (4 tiers)** — "Value, Standard, Premium, Marquee" — **[RECOMMENDED]** (highlighted with blue border) — subtext: "Good balance of simplicity and revenue capture"
  3. **Aggressive (5 tiers)** — "Value, Standard, Premium, Marquee, Platinum" — subtext: "Maximum revenue optimization; more complex for fans"
- **Preview card** — Shows an example of how games would distribute across the selected tier structure:
  - Conservative: Standard (18 games), Premium (14 games), Marquee (9 games)
  - Balanced: Value (8 games), Standard (15 games), Premium (11 games), Marquee (7 games)
  - Aggressive: Value (5 games), Standard (12 games), Premium (12 games), Marquee (8 games), Platinum (4 games)
- **Continue button**

---

### Pricing Step 5: Pricing Constraints

**What the user sees after clicking Continue:**

- Question: "What pricing constraints do you want to apply?"
- Checkbox options:
  - Cap year-over-year price increase — with conditional numeric input for max % increase when checked (default: 8%)
  - Set a floor price (minimum per-ticket price) — with conditional input: dollar amount (default: $15)
  - Price match or undercut secondary market for low-demand games — subtext: "Reduce unsold inventory by competing with resale market"
  - Maintain season-plan discount ladder — subtext: "Ensure full season holders always pay less per game than partial, flex, and single-game buyers" — **[RECOMMENDED, ON by default]**
  - Premium section pricing premium — with conditional input: percentage premium over standard sections (default: 40%)
- **Continue button**

---

### Pricing Step 6: Benefits & Perks

**What the user sees after clicking Continue:**

- Question: "What benefits do you want to include with plan packages?"
- A tiered benefit allocation table where each benefit can be toggled on/off per package tier:

| Benefit | Full Season | Half Season | Quarter | 5-Game | Flex |
|---------|:-----------:|:-----------:|:-------:|:------:|:----:|
| Playoff ticket priority | ✓ ON | ✓ ON | OFF | OFF | OFF |
| Seat upgrade opportunities | ✓ ON | ✓ ON | ✓ ON | OFF | OFF |
| Free parking passes | ✓ ON | OFF | OFF | OFF | OFF |
| Merchandise credit | ✓ ON | ✓ ON | OFF | OFF | OFF |
| Ticket exchange privileges | ✓ ON | ✓ ON | ✓ ON | ✓ ON | OFF |
| Exclusive member events | ✓ ON | ✓ ON | OFF | OFF | OFF |
| Guest pass allocation | ✓ ON | OFF | OFF | OFF | OFF |

- The table should only show columns for package types selected in Step 3
- Each cell is a clickable toggle (checkbox)
- Default values shown above; user can customize
- **Continue button** — Clicking this triggers campaign generation

---

### Pricing Step 7: AI Thinking Module + Strategy Generation

After the final Continue, the system:

1. Sets `generatingCampaign = true` and stores all user selections
2. Generates **dynamic thinking steps** based on the user's selections (6 steps, ~12.4 seconds total):
   - Analyzing historical ticket data (18,200 seats × 41 home games)
   - Classifying 41 home games into demand tiers (based on selected tier structure)
   - Calculating per-seat, per-game base pricing across [X] price levels (incorporating constraints)
   - Modeling package discount ladder (full season → half → quarter → 5-game → flex → single)
   - Running cannibalization analysis (impact of new package types on existing plan holders)
   - Finalizing pricing manifest and revenue projections

3. Generates **dynamic campaign response** (see Step 3 below)

**Total thinking animation duration:** ~12.4 seconds

---

## Step 3: AI Pricing Strategy Response

**Location:** Same `/chat` page, below the thinking module

After thinking completes, the thinking module disappears and the AI response fades in with staggered animations:

**Response content includes:**

1. **Intro paragraph** — Summarizes the configuration: 18,200 seats, 41 home games, [X] game tiers, [Y] package types offered, goal position (revenue vs. attendance), and any constraints applied. Dynamic based on user selections.

2. **Game Tier Classification Table** — Shows how all 41 games are classified:

   | Tier | Games | Example Matchups | Per-Game Pricing Multiplier |
   |------|-------|------------------|-----------------------------|
   | Marquee | 7 | vs. Lakers, Warriors, Celtics, Christmas Day | 1.6x base |
   | Premium | 11 | vs. Knicks, 76ers, Nuggets, weekend games | 1.25x base |
   | Standard | 15 | vs. Pacers, Hornets, weeknight games | 1.0x base |
   | Value | 8 | vs. Wizards, Pistons, Tuesday/Wednesday | 0.7x base |

   - Table dynamically reflects the tier structure selected in Step 4
   - Multipliers shift based on goal slider: revenue-focused = wider spread; attendance-focused = narrower spread

3. **Pricing Manifest Summary Table** — Shows per-game pricing at each arena price level for the full-season equivalent:

   | Price Level | Section Examples | Full Season Per-Game | Half Season Per-Game | Quarter Per-Game | 5-Game Per-Game | Single Game Avg |
   |-------------|-----------------|---------------------|---------------------|-----------------|-----------------|-----------------|
   | Courtside | Rows 1-3 | $485 | $535 | $575 | $610 | $650 |
   | Lower Premium | Sec 101-108 | $145 | $160 | $172 | $182 | $195 |
   | Lower Standard | Sec 109-120 | $95 | $105 | $113 | $120 | $128 |
   | Club Level | Sec 201-210 | $120 | $132 | $142 | $150 | $160 |
   | Upper Premium | Sec 301-308 | $55 | $61 | $65 | $69 | $74 |
   | Upper Standard | Sec 309-320 | $32 | $35 | $38 | $40 | $43 |

   - Columns dynamically reflect only the package types selected in Step 3
   - Prices dynamically adjusted based on goal slider and pricing constraints

4. **Package Menu Card** — A styled card summarizing each package offering:
   - Package name, number of games, per-game discount vs. single game, included benefits, and payment plan options
   - E.g., "Full Season (41 games) — 25% per-game savings vs. single game — Includes: playoff priority, parking, merch credit, exchange privileges, member events, guest passes — Payment: 4 monthly installments"

5. **Discount Ladder Visualization** — A bar chart or visual showing the per-game effective price at a representative section (e.g., Lower Standard) across all package types, clearly demonstrating the discount incentive for higher commitment

6. **Cannibalization Analysis Card** — "Package Migration Forecast" card with projections:
   - Estimated X% of current half-season holders may downgrade to 5-game plan
   - Estimated Y new 5-game plan buyers (net new)
   - Net revenue impact: +$Z or -$Z
   - Only shown if new package types (5-game, flex) are selected

7. **Revenue Projection Card** — "Revenue Forecast" card:
   - Total projected ticket revenue (dynamic from slider + selections)
   - Breakdown by package type (pie chart or table)
   - Comparison to prior season: +X% YoY
   - Best case / base case / worst case scenarios

8. **Go-to-Market Timeline** — A timeline graphic or table showing the recommended on-sale sequence:
   - Phase 1: Season plan renewals (already completed)
   - Phase 2: New full season plans (Apr 1-15)
   - Phase 3: Half & quarter season plans (Apr 15-30)
   - Phase 4: 5-game & flex plans (May 1-15)
   - Phase 5: Single game on-sale (Jun 1)
   - Phase 6: Dynamic pricing active (game day adjustments)

9. **Conclusion paragraph** — Summary of recommendation, total projected revenue, key risks, and next steps

---

## Step 4: Campaign Sidebar (Right Panel)

**Location:** Right side of chat page, slides in ~500ms after the AI response starts appearing

**Sidebar contents (top to bottom):**

- **Header bar** — Tag/price icon + "New Campaign" title, share button, close button
- **Badge** — Blue "Pricing & Packaging" status badge
- **Title & Revenue** —
  - Title: "2026-27 On-Sale Pricing & Packaging"
  - Subtitle: "18,200 Seats • 41 Games • [X] Tiers • Jun 1 On-Sale"
  - Revenue: dynamic total in green (e.g., "$104.8M") with "Projected total ticket revenue" label
- **Section cards** (gray background, icon + label + value):
  - Total Seats → 18,200 Capacity
  - Home Games → 41 Games
  - Game Tiers → [3/4/5] Tiers (based on selection)
  - Package Types → [X] Offered (count of selected packages)
  - Avg Price Increase → [X]% YoY (calculated from constraints)
- **Key Decisions card** — Bordered card listing key decisions dynamically built from all user selections:
  - Goal orientation (e.g., "Balanced: 55% revenue / 45% attendance focus")
  - Package types offered
  - Game tier structure
  - Pricing constraints applied
  - Benefit allocations
- **Action buttons:**
  1. **"Publish Pricing"** — Blue button, saves campaign as Active to localStorage, redirects to `/campaigns?tab=active`
  2. **"Edit Configuration"** — Black button, scrolls to and focuses the chat input textarea
  3. **"Save as Draft"** — Outlined button, saves campaign as Draft to localStorage, redirects to `/campaigns?tab=active`
- **Disclaimer** — "Pricing will be locked and published to ticketing system. Package pages will be generated and on-sale dates activated."

---

## Step 5: Post-Launch / Post-Save

**What happens on Publish or Save as Draft:**

- Campaign is saved to `localStorage` via `saveCampaign()` from `lib/campaignsStore.ts`
- Campaign object includes: title, description, status (Active or Draft), type: 'pricing', revenue projections, all user selections (slider value, packages, tiers, constraints, benefits), and `createdFrom: 'pricing-workflow'`
- User is redirected to `/campaigns?tab=active` where the new campaign appears in the campaigns table

---

## Technical Details

### Key Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/campaigns/page.tsx` | **Modify** | Add the "Configure On-Sale Pricing & Packaging" banner below/alongside the STR banner |
| `app/chat/page.tsx` | **Modify** | Add `workflow=pricing` handling: multi-step guided inputs, thinking steps, response, sidebar — following exact same pattern as `workflow=str` |
| `lib/campaignContent.ts` | **Modify** | Add `pricingContent` object with all thinking steps, response templates, data tables, sidebar content |
| `lib/mockRecommendations.ts` | **Modify** | Add `pricing-1` recommendation with metadata |
| `lib/campaignsStore.ts` | **Modify** | Ensure `saveCampaign()` supports the new campaign type |

### URL & Routing

- Banner links to: `/chat?workflow=pricing`
- Chat page reads `workflow` param via `useSearchParams()`
- When `workflow === 'pricing'`, render the multi-step pricing workflow
- After publish/save: redirects to `/campaigns?tab=active`

### State Management

- All user selections stored in component state:
  - `pricingGoal` (number, 0-100) — slider value
  - `selectedPackages` (string[]) — which package types are offered
  - `flexConfig` ({ gameCount: number, fanChoice: boolean }) — flex plan details
  - `tierStructure` ('conservative' | 'balanced' | 'aggressive') — game tiering
  - `pricingConstraints` ({ maxIncrease?: number, floorPrice?: number, matchSecondary: boolean, maintainLadder: boolean, premiumPct?: number }) — constraint selections
  - `benefitAllocations` (Record<string, Record<string, boolean>>) — benefit-per-package toggle matrix
- Campaign data saved to `localStorage` (no backend)
- UI state managed with React `useState` and `useEffect` hooks
- Thinking animation orchestrated via cascading `setTimeout` calls (same pattern as STR)
- Sidebar slide-in triggered after thinking completes

### Design System

Use the exact same design system as the STR workflow:

- Primary blue: `#4c65f0`
- Success green: `#007a47`
- Error red: `#d32f2f`
- Accent lime: `#ccff00`
- Fonts: Inter (headings), Roboto (inputs)
- Animations: `fade-in`, `slide-in`, `slide-in-left`, `check-pop`, `pulse-glow`, `pulse`, `ping`
- All interactive elements (sliders, checkboxes, toggles, buttons) should match the styling established in the STR workflow

### Dynamic Calculation Formulas

**Revenue projection** (based on slider):
```
baseRevenue = 112.5  // $MM, maximum revenue scenario
revenueRange = 14.8  // $MM, difference between max revenue and max attendance
projectedRevenue = baseRevenue - (sliderValue / 100) * revenueRange
```

**Sell-through projection** (based on slider):
```
baseSellThrough = 78   // %, minimum at full revenue focus
sellThroughRange = 17  // %, range
projectedSellThrough = baseSellThrough + (sliderValue / 100) * sellThroughRange
```

**Per-game pricing** (discount ladder):
```
singleGameBase = 1.00x  // reference price
flexDiscount = 0.05     // 5% off single game
fiveGameDiscount = 0.07 // 7% off single game
quarterDiscount = 0.12  // 12% off single game
halfDiscount = 0.18     // 18% off single game
fullDiscount = 0.25     // 25% off single game
```

**Game tier multipliers** (for balanced 4-tier structure):
```
Value    = 0.70x base
Standard = 1.00x base
Premium  = 1.25x base
Marquee  = 1.60x base
```

---

## Mock Data

### Historical Data (for Step 1 table)

```typescript
const pricingHistoricalData = [
  {
    season: '2023',
    avgSellThrough: '81%',
    singleGameRev: '$14.2MM',
    flexRev: '$6.9MM',
    partialRev: '$19.7MM',
    fullSeasonRev: '$38.2MM',
    totalRev: '$79.0MM',
  },
  {
    season: '2024',
    avgSellThrough: '84%',
    singleGameRev: '$16.8MM',
    flexRev: '$7.8MM',
    partialRev: '$22.3MM',
    fullSeasonRev: '$42.1MM',
    totalRev: '$89.0MM',
  },
  {
    season: '2025',
    avgSellThrough: '87%',
    singleGameRev: '$19.1MM',
    flexRev: '$8.4MM',
    partialRev: '$24.6MM',
    fullSeasonRev: '$46.8MM',
    totalRev: '$98.9MM',
  },
];
```

### Secondary Market Insight Data

```typescript
const secondaryMarketData = {
  avgFaceValuePct: 112,
  top10GamesAvg: 148,
  bottom10GamesAvg: 74,
  season: '2025',
};
```

### Game Tier Distribution

```typescript
const gameTierDistributions = {
  conservative: { Standard: 18, Premium: 14, Marquee: 9 },
  balanced: { Value: 8, Standard: 15, Premium: 11, Marquee: 7 },
  aggressive: { Value: 5, Standard: 12, Premium: 12, Marquee: 8, Platinum: 4 },
};
```

### Arena Price Levels

```typescript
const pricelevels = [
  { level: 'Courtside', sections: 'Rows 1-3', basePrice: 485 },
  { level: 'Lower Premium', sections: 'Sec 101-108', basePrice: 145 },
  { level: 'Lower Standard', sections: 'Sec 109-120', basePrice: 95 },
  { level: 'Club Level', sections: 'Sec 201-210', basePrice: 120 },
  { level: 'Upper Premium', sections: 'Sec 301-308', basePrice: 55 },
  { level: 'Upper Standard', sections: 'Sec 309-320', basePrice: 32 },
];
```

---

## Thinking Steps (Dynamic)

The 6 thinking steps adapt based on user selections:

1. **Analyzing** → "Analyzing historical ticket data for 18,200 seats across 41 home games"
   - Reasoning: "Reviewing 3 seasons of sell-through rates, revenue by package type, and secondary market performance to establish pricing baselines"

2. **Classifying games** → "Classifying 41 home games into [3/4/5] demand tiers based on opponent strength, day of week, and historical demand"
   - Reasoning: "Using [conservative/balanced/aggressive] tiering to [description based on selection]"

3. **Calculating pricing** → "Calculating per-seat, per-game pricing across 6 arena price levels with [X]% max YoY increase cap" (or "no price cap" if unchecked)
   - Reasoning: "Optimizing for [revenue/attendance/balance] based on goal setting, applying pricing constraints"

4. **Modeling packages** → "Modeling discount ladder across [X] package types: [list selected packages]"
   - Reasoning: "Full season holders receive 25% per-game discount; discount tapers to ensure commitment incentive at every tier"

5. **Cannibalization analysis** → "Running cannibalization analysis for new [5-game/flex] plan impact on existing plan holders" (only if new package types selected; otherwise: "Validating package migration projections against historical data")
   - Reasoning: "Estimating net revenue impact of [new package types] introduction"

6. **Finalizing** → "Finalizing pricing manifest and projecting $[X]MM total ticket revenue at [Y]% sell-through"
   - Reasoning: "Locking [X] game tiers, [Y] package types, and go-to-market timeline for Jun 1 on-sale"

---

## Implementation Notes

- **Follow the STR pattern exactly.** The existing STR workflow in `/Users/joelresnicow/E2ECampaign/app/chat/page.tsx` is the implementation template. The pricing workflow should use the same component structure, animation system, and state management patterns.
- **The banner should coexist with the STR banner** on the `/campaigns` page. Both banners should be visible if both campaigns are in a "not yet launched" state. Once a campaign is launched, its banner should be hidden.
- **The benefit allocation table (Step 6)** is the most complex new UI component. It is a matrix of toggles — implement it as a grid/table with clickable cells that toggle boolean state.
- **All pricing numbers are mock data.** There is no backend or real pricing engine. The dynamic calculations should produce plausible numbers that respond to user inputs.
- **The workflow param `pricing`** should be handled alongside the existing `str` workflow param in the chat page's routing logic.

---

## What's Not Yet Specified

The following items may need further decisions:

- **Dynamic pricing rules for single game** — Should the AI response include specific algorithmic rules (e.g., "increase price by 5% for every 10% of section sold"), or just general guidance?
- **Integration with actual ticketing system** — Currently all data is mock/localStorage. Future state would connect to a real pricing engine.
- **Seat map visualization** — Should any step include an interactive seat map showing price levels? This would be a significant additional component.
- **Approval workflow** — Should "Publish Pricing" require a confirmation modal or multi-user approval before going live?
- **Comparison mode** — Should users be able to run multiple pricing scenarios side-by-side before choosing one to publish?
