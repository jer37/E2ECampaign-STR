# On-Sale Pricing & Packaging Campaign — Current Implementation

## Overview

The On-Sale Pricing & Packaging Campaign is an end-to-end flow that allows users to configure upfront pricing and packaging options for the general on-sale of an NBA team's upcoming season. The flow spans three pages and involves a banner trigger, a multi-step AI chat experience with interactive inputs, a detailed pricing strategy response, and a campaign sidebar with launch actions. This workflow follows the same UI patterns, animations, and technical architecture as the Season Ticket Renewal (STR) workflow.

---

## Flow Summary

**Banner (Campaigns page → Season Opportunities tab)** → **Chat interface with multi-step guided inputs** → **AI thinking module + pricing strategy + sidebar with Launch/Edit/Save actions** → **Redirect back to Campaigns (Active tab)**

---

## Step 1: Banner on Campaigns Page

**Location:** `/campaigns` → Season Opportunities tab

**What the user sees:**

- A prominent banner positioned alongside the STR banner on the Season Opportunities tab (rendered via `GoalsView` component)
- Styled as a horizontal card with a gradient background (`from-[rgba(76,101,240,0.06)]` to `from-[rgba(76,101,240,0.02)]`) and a subtle blue border
- Left side: A blue circular icon with a pricing/tag SVG
- Center content:
  - Pill badge: **"Annual Planning Cycle"** with calendar icon (blue rounded pill, `bg-[#4c65f0]`)
  - Bold blue title: **"Configure On-Sale Pricing & Packaging"**
  - Description text: "18,200 seats across 41 home games — Set pricing, packages, and go-to-market strategy for 2026-27 on-sale"
- Right side:
  - "On-sale Jun 1" label
  - Right-arrow chevron icon (animates on hover)
- The entire banner is a clickable `<Link>` that navigates to `/chat?workflow=pricing`

**Hover behavior:** Border darkens, shadow appears, arrow shifts right

---

## Step 2: Chat Interface — Multi-Step Guided Workflow

**Location:** `/chat?workflow=pricing`

**Source code location:** `app/chat/page.tsx`

This is a multi-step conversational workflow where the AI walks the user through a series of guided questions to collect their pricing and packaging preferences before generating the full strategy.

---

### Pricing Step 1: Greeting + Historical Performance

**What the user sees (sequentially animated):**

1. **Greeting text:** "Hi there, let's configure your on-sale pricing and packaging" (fades in at 100ms)
2. **Context text:** "Here's your ticket revenue performance and sell-through for the past 3 seasons:" (fades in at 800ms)
3. **Historical table** (fades in at 800ms) with 3 seasons of data:

| Season | Avg Sell-Through | Single Game | Flex Plans | New Fixed Plans | Total Rev |
|--------|-----------------|-------------|------------|-----------------|-----------|
| 2023 | 95.3% | $7.5MM | $2.4MM | $2.5MM | $12.4MM |
| 2024 | 96.7% | $9.3MM | $2.9MM | $3.0MM | $15.2MM |
| 2025 | 97.8% | $11.1MM | $3.9MM | $3.8MM | $18.8MM |

**Notes on table:**
- "Full Season" column was removed (that data lives in the STR workflow)
- "Partial Plans" was renamed to "New Fixed Plans"
- Revenue distribution is roughly 60% Single Game, 20% Flex, 20% New Fixed Plans
- Sell-through rates are between 95-98% with one decimal point
- Total revenue grows from $12.4MM to $18.8MM across 3 seasons

**State variable:** `showPricingHistoricalTable`

---

### Pricing Step 2: Goal Slider

**What the user sees (fades in at 1600ms):**

- Question: "What is your primary goal for this season's on-sale?"
- A slider card with:
  - **Left label:** "Maximize Revenue" — "Higher prices on premium inventory, accept lower fill rates on weaker games"
  - **Right label:** "Maximize Attendance" — "Competitive pricing across all games, prioritize sellouts and fan experience"
  - **Range slider** (0-100) with gradient from blue (#4c65f0) to lime (#ccff00)
  - **Dynamic metrics** that update as the slider moves:
    - **Forecasted Total Revenue:** `${(22.5 - (pricingSliderValue / 100) * 3.0).toFixed(1)}MM` — ranges from $22.5MM (max revenue) to $19.5MM (max attendance)
    - **Forecasted Avg Sell-Through:** `{(96 + (pricingSliderValue / 100) * 3).toFixed(1)}%` — ranges from 96.0% to 99.0%
  - **Continue button** — Submits the slider value and advances to the next step

**State variables:** `pricingSliderValue` (default: 50), `pricingSliderSubmitted`

---

### Pricing Step 3: Package Selection

**What the user sees after clicking Continue:**

- Question: "Which package types do you want to offer this season?"

**Package list (in order displayed):**

| Package | Default | Badge |
|---------|---------|-------|
| Full Season Plan (41 games) | ON | Recommended |
| Half Season Plan (20 games) | ON | Recommended |
| Quarter Season Plan (10 games) | ON | Recommended |
| Flex Plan (choose-your-own games) | ON | Recommended |
| Single Game Tickets | ON | Recommended |
| Group Packages (7+ tickets) | ON | Recommended |
| 5-Game Mini Plan | OFF | Recommended + New |
| 3-Game Mini Plan | OFF | New |

**Badge rendering:** When a package has multiple badges (e.g., "Recommended New"), both are shown as separate pills. "Recommended" uses `bg-[rgba(76,101,240,0.1)] text-[#4c65f0]`, "New" uses `bg-[#ccff00] text-black`.

**Conditional sub-options:**

- **Flex Plan** (when checked): Expanded config area with:
  - **Min. games:** dropdown selector with options `[3, 5, 7, 10, 15, 20]`, default: `3`. State: `flexConfig.gameCount`
  - **"Require selection across different game tiers"** checkbox — default: unchecked. State: `flexConfig.requireTierMix`
    - When checked, shows **"Number of tiers"** dropdown `[2, 3, 4, 5]`, default: `3`. State: `flexConfig.tierCount`
  - **"Progressive discounting for each additional game selected"** checkbox — default: checked. State: `flexConfig.progressiveDiscount`
  - Note: "Fan picks games?" selector has been removed

- **Group Packages** (when checked): Shows minimum group size input, default: `7`. State: `groupMinSize`

**State variables:**
```typescript
selectedPackages: {
  fullSeason: true,
  halfSeason: true,
  quarterSeason: true,
  fiveGame: false,
  threeGame: false,
  flex: true,
  singleGame: true,
  group: true,
}
flexConfig: { gameCount: 3, fanChoice: true, requireTierMix: false, tierCount: 3, progressiveDiscount: true }
groupMinSize: 7
```

- **Continue button**

---

### Pricing Step 4: Game Tiering

**What the user sees after clicking Continue:**

- Question: "How do you want to tier your home games for pricing purposes?"
- Three radio button options with visual previews:
  1. **Conservative (3 tiers)** — "Standard, Premium, Marquee" — subtext: "Simpler for fans to understand; less revenue optimization"
  2. **Balanced (4 tiers)** — "Value, Standard, Premium, Marquee" — **[Recommended]** badge — subtext: "Good balance of simplicity and revenue capture"
  3. **Aggressive (5 tiers)** — "Value, Standard, Premium, Marquee, Platinum" — subtext: "Maximum revenue optimization; more complex for fans"

- **Preview card** — Shows an example of how games would distribute across the selected tier structure:
  - Conservative: Standard (18 games), Premium (14 games), Marquee (9 games)
  - Balanced: Value (8 games), Standard (15 games), Premium (11 games), Marquee (7 games)
  - Aggressive: Value (5 games), Standard (12 games), Premium (12 games), Marquee (8 games), Platinum (4 games)

**State variable:** `tierStructure` (default: `'balanced'`), `tierSubmitted`

- **Continue button**

---

### Pricing Step 5: Pricing Constraints

**What the user sees after clicking Continue:**

- Question: "What pricing constraints do you want to apply?"

**Checkbox options:**

1. **Cap year-over-year price increase** — "Recommended: 12%" text next to label. When checked, conditional numeric input for max % (default: `12`, range: 1-50). State: `pricingConstraints.capYoY`, `maxYoYIncrease`
2. **Set a floor price (minimum per-ticket price)** — When checked, conditional dollar amount input (default: `$15`). State: `pricingConstraints.floorPrice`, `floorPriceAmount`
3. **Price match or undercut secondary market** — subtext: "Reduce unsold inventory by competing with resale market." When checked, conditional input: "Price at ___% of secondary prices by price level" (default: `100`, range: 50-150). State: `pricingConstraints.matchSecondary`, `secondaryPricePct`
4. **Maintain season-plan discount ladder** — subtext: "Ensure full season holders always pay less per game than partial, flex, and single-game buyers." **[Recommended]** badge. Default: ON. State: `pricingConstraints.maintainLadder`
5. **Premium section pricing premium** — When checked, conditional percentage input (default: `40%`). State: `pricingConstraints.premiumPricing`, `premiumPct`

**State variables:**
```typescript
pricingConstraints: {
  capYoY: false,
  floorPrice: false,
  matchSecondary: false,
  maintainLadder: true,
  premiumPricing: false,
}
secondaryPricePct: '100'
maxYoYIncrease: '12'
floorPriceAmount: '15'
premiumPct: '40'
```

- **Continue button**

---

### Pricing Step 6: Benefits & Perks

**What the user sees after clicking Continue:**

- Question: "What benefits do you want to include with plan packages?"
- A tiered benefit allocation table where each benefit can be toggled on/off per package tier:

| Benefit | Full Season | Half Season | Quarter | 5-Game | Flex |
|---------|:-----------:|:-----------:|:-------:|:------:|:----:|
| Playoff ticket priority | ON | ON | OFF | OFF | OFF |
| Seat upgrade opportunities | ON | ON | ON | OFF | OFF |
| Free parking passes | ON | OFF | OFF | OFF | OFF |
| Merchandise credit | ON | ON | OFF | OFF | OFF |
| Ticket exchange privileges | ON | ON | ON | ON | OFF |
| Exclusive member events | ON | ON | OFF | OFF | OFF |
| Guest pass allocation | ON | OFF | OFF | OFF | OFF |

- The table only shows columns for package types selected in Step 3
- Each cell is a clickable toggle (checkbox)
- Default values shown above; user can customize

**State variable:** `benefitAllocations` (Record<string, Record<string, boolean>>)

- **Continue button** — Clicking this triggers campaign generation

---

### Pricing Step 7: AI Thinking Module + Strategy Generation

After the final Continue, the system:

1. Sets `generatingPricingCampaign = true` and stores all user selections
2. Generates **dynamic thinking steps** based on the user's selections (6 steps, ~12.4 seconds total):

   1. **Analyzing** → "Analyzing 3 seasons of data for 18,200 seats across 41 home games"
      - Reasoning: "Reviewing sell-through rates, revenue by package type, and secondary market performance to establish pricing baselines"

   2. **Classifying games** → "Classifying 41 home games into {3/4/5} demand tiers based on opponent strength, day of week, and historical demand"
      - Reasoning: "Using {conservative/balanced/aggressive} tiering to {description based on selection}"

   3. **Calculating pricing** → "Calculating per-seat, per-game pricing across 6 arena price levels{' with {maxYoYIncrease}% max YoY increase cap' if capYoY}"
      - Reasoning: "Optimizing for {revenue/attendance/balance} based on goal setting, applying pricing constraints"

   4. **Modeling packages** → "Modeling discount ladder across {X} package types"
      - Reasoning: "Full season holders receive 25% per-game discount; discount tapers to ensure commitment incentive at every tier"

   5. **Cannibalization analysis** → If new packages selected: "Running cannibalization analysis for new {5-game/flex} plan impact"; otherwise: "Validating package migration projections against historical data"
      - Reasoning: "Estimating net revenue impact of new package type introduction on existing plan holders"

   6. **Finalizing** → "Finalizing pricing manifest and projecting ${revenueValue}MM total ticket revenue at {sellThrough}% sell-through"
      - Reasoning: "Locking {X} game tiers, {Y} package types, and go-to-market timeline for Jun 1 on-sale"

3. Generates **dynamic campaign response** with:
   - Intro paragraph reflecting goal position, tier structure, and constraints
   - Game tier classification table
   - Pricing manifest summary table
   - Package menu card
   - Discount ladder visualization
   - Cannibalization analysis card (if new package types selected)
   - Revenue projection card
   - Go-to-market timeline
   - Conclusion paragraph

**Total thinking animation duration:** ~12.4 seconds

---

## Campaign Sidebar (Right Panel)

**Location:** Right side of chat page, slides in ~500ms after the AI response starts appearing

**Sidebar header:**

- Document icon (inline SVG) + "New Campaign" title
- Share button (share/network icon, inline SVG)
- Close button (X icon)

**Sidebar contents:**

- **Badge** — Blue "Pricing & Packaging" status badge
- **Title & Revenue** —
  - Title: "2026-27 On-Sale Pricing & Packaging"
  - Subtitle: "18,200 Seats • 41 Games • {tierLabel} Tiers • Jun 1 On-Sale"
  - Revenue: dynamically calculated `${(22.5 - (pricingSliderValue / 100) * 3.0).toFixed(1)}MM` in green
- **Section cards** (gray background, inline SVG icon + label + value):
  - Grid/arena seats icon → **Total Seats** → "18,200 Capacity"
  - Calendar icon → **Home Games** → "41 Games"
  - Stacked layers icon → **Game Tiers** → `{3/4/5} Tiers` (based on `tierStructure`)
  - Package/box icon → **Package Types** → `{X} Offered` (count of `selectedPackages` that are true)
  - Bullseye/target icon → **Avg Sell-Through** → `{sellThrough}% Target` (dynamic from slider)
  - Shield icon → **Pricing Rules** → `{X} Active` (count of active constraints; only shown when ≥1 constraint is active)

- **Key Decisions card** — dynamically built from all user selections:
  - Strategy type and revenue/sell-through targets (e.g., "Balanced pricing strategy targeting $21.0MM revenue at 97.5% sell-through")
  - Package types offered (count and list, including Group with min size)
  - Game tier structure
  - YoY cap percentage (if selected)
  - Floor price (if selected)
  - Discount ladder maintained (if selected)
  - Secondary market pricing at X% (if selected)
  - Premium pricing at +X% (if selected)
  - Flex plan config: min games, tier mix requirement, progressive discounting (if flex selected)
  - Go-to-market: Season plans Apr 1 → Single game Jun 1

- **Action buttons:**
  1. **"Launch Campaign"** — Blue button, saves campaign as Active to localStorage, redirects to `/campaigns?tab=active`
  2. **"Edit Campaign"** — Black button, scrolls to and focuses the chat input textarea
  3. **"Save as Draft"** — Outlined button, saves campaign as Draft to localStorage, redirects to `/campaigns?tab=active`
- **Disclaimer** — "Campaign will go live immediately. Landing pages will be published and messages scheduled."

---

## Post-Launch / Post-Save

**What happens on Launch or Save as Draft:**

- Campaign is saved to `localStorage` via `saveCampaign()` from `lib/campaignsStore.ts`
- Campaign object includes: title, description, status (Active or Draft), type: 'Pricing & Packaging', revenue projections, sell-through target, and `createdFrom: 'pricing-workflow'`
- User is redirected to `/campaigns?tab=active` where the new campaign appears in the campaigns table

---

## Technical Details

### Key Files

| File | Action | Purpose |
|------|--------|---------|
| `app/campaigns/page.tsx` | Existing | Campaigns dashboard with tab navigation |
| `components/GoalsView.tsx` | Existing | Contains the Pricing CTA banner (alongside STR banner), both with "Annual Planning Cycle" pill badges |
| `app/chat/page.tsx` | Existing | Full chat interface: multi-step pricing workflow inputs, thinking module, AI response, sidebar, action buttons |
| `lib/campaignContent.ts` | Existing | Contains campaign content objects |
| `lib/campaignsStore.ts` | Existing | localStorage CRUD for saving/loading campaigns |
| `app/layout.tsx` | Existing | Root layout with header; Timberwolves logo (ESPN CDN) |

### URL & Routing

- Banner links to: `/chat?workflow=pricing`
- Chat page reads `workflow` param via `useSearchParams()`
- When `workflow === 'pricing'`, render the multi-step pricing workflow
- After publish/save: redirects to `/campaigns?tab=active`

### State Management

All pricing state variables in `app/chat/page.tsx`:

```typescript
pricingSliderValue (number, 0-100, default: 50)
pricingSliderSubmitted (boolean)
showPricingHistoricalTable (boolean)
showPricingGoalQuestion (boolean)

selectedPackages ({
  fullSeason: true,
  halfSeason: true,
  quarterSeason: true,
  fiveGame: false,
  threeGame: false,
  flex: true,
  singleGame: true,
  group: true,
})

flexConfig ({
  gameCount: 3,      // min games dropdown [3, 5, 7, 10, 15, 20]
  fanChoice: true,   // legacy — selector removed from UI
  requireTierMix: false,  // checkbox
  tierCount: 3,      // dropdown [2, 3, 4, 5] — only shown when requireTierMix is true
  progressiveDiscount: true,  // checkbox
})
groupMinSize (number, default: 7)
packagesSubmitted (boolean)

tierStructure ('conservative' | 'balanced' | 'aggressive', default: 'balanced')
tierSubmitted (boolean)

pricingConstraints ({
  capYoY: false,
  floorPrice: false,
  matchSecondary: false,
  maintainLadder: true,
  premiumPricing: false,
})
secondaryPricePct (string, default: '100')
maxYoYIncrease (string, default: '12')
floorPriceAmount (string, default: '15')
premiumPct (string, default: '40')
constraintsSubmitted (boolean)

benefitAllocations (Record<string, Record<string, boolean>>)
benefitsSubmitted (boolean)
generatingPricingCampaign (boolean)
```

### Dynamic Calculation Formulas

**Revenue projection** (based on slider):
```
projectedRevenue = 22.5 - (pricingSliderValue / 100) * 3.0   // $22.5MM → $19.5MM
```

**Sell-through projection** (based on slider):
```
projectedSellThrough = 96 + (pricingSliderValue / 100) * 3   // 96.0% → 99.0%
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

## Mock Data

### Historical Data (for Step 1 table)

```typescript
const pricingHistoricalData = [
  {
    season: '2023',
    avgSellThrough: '95.3%',
    singleGameRev: '$7.5MM',
    flexRev: '$2.4MM',
    newFixedPlansRev: '$2.5MM',
    totalRev: '$12.4MM',
  },
  {
    season: '2024',
    avgSellThrough: '96.7%',
    singleGameRev: '$9.3MM',
    flexRev: '$2.9MM',
    newFixedPlansRev: '$3.0MM',
    totalRev: '$15.2MM',
  },
  {
    season: '2025',
    avgSellThrough: '97.8%',
    singleGameRev: '$11.1MM',
    flexRev: '$3.9MM',
    newFixedPlansRev: '$3.8MM',
    totalRev: '$18.8MM',
  },
];
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
const priceLevels = [
  { level: 'Courtside', sections: 'Rows 1-3', basePrice: 485 },
  { level: 'Lower Premium', sections: 'Sec 101-108', basePrice: 145 },
  { level: 'Lower Standard', sections: 'Sec 109-120', basePrice: 95 },
  { level: 'Club Level', sections: 'Sec 201-210', basePrice: 120 },
  { level: 'Upper Premium', sections: 'Sec 301-308', basePrice: 55 },
  { level: 'Upper Standard', sections: 'Sec 309-320', basePrice: 32 },
];
```

---

## What's Not Yet Specified

The following items may need further decisions:

- **Dynamic pricing rules for single game** — Should the AI response include specific algorithmic rules (e.g., "increase price by 5% for every 10% of section sold"), or just general guidance?
- **Integration with actual ticketing system** — Currently all data is mock/localStorage. Future state would connect to a real pricing engine.
- **Seat map visualization** — Should any step include an interactive seat map showing price levels?
- **Approval workflow** — Should "Publish Pricing" require a confirmation modal or multi-user approval before going live?
- **Comparison mode** — Should users be able to run multiple pricing scenarios side-by-side before choosing one to publish?
- **3-Game Mini Plan impact modeling** — The 3-Game Mini Plan package is in the UI but not yet reflected in the cannibalization analysis text or pricing projections
