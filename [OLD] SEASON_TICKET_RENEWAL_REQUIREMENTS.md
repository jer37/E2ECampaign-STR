# Season Ticket Renewal Campaign - Implementation Requirements

> **Instructions:** Fill in the sections below with your specific requirements. When ready, ask Claude to "Implement the requirements in SEASON_TICKET_RENEWAL_REQUIREMENTS.md"

---

## 1. AI Recommendation Data

### Basic Information
- **Recommendation ID:** `rec-str-1` _(or your preferred ID)_
- **Type:** `conversion_opportunity` / `at_risk_segment` / `renewal_campaign` _(choose one or specify)_
- **Category:** `season` / `fan_profile` / `other` _(choose one)_
- **Title:** _[What should the recommendation card title be?]_
- **Description:** _[Brief description shown on the opportunity card]_

### Metrics
- **Current:** _[e.g., "2,840 STH eligible for renewal"]_
- **Target:** _[e.g., "2,550 renewals (90% retention rate)"]_
- **Gap:** _[What needs to be achieved?]_
- **Unit:** `accounts` / `revenue` / `percentage` _(choose one)_

### Impact
- **Revenue Value:** _[e.g., $4,200,000]_
- **Currency:** `USD`
- **Impact Type:** `revenue` / `retention` / `upsell` _(choose one)_

### Urgency
- **Level:** `high` / `medium` / `low` _(choose one)_
- **Deadline:** _[e.g., "March 15, 2026" or null if no deadline]_
- **Days Remaining:** _[e.g., 45 or null]_

### AI Confidence
- **Confidence Score:** _[e.g., 92 (representing 92%)]_

### Action & Prompt
- **Suggested Action:** _[e.g., "Launch renewal campaign with early bird pricing"]_
- **Chat Prompt:** _[Pre-filled message when user clicks "Build Campaign"]_

### Event Details (if applicable)
- **Event Type:** `game` / `deadline` / `opportunity` / `milestone` _(choose one or specify)_
- **Event Title:** _[e.g., "Season Ticket Renewal Window"]_
- **Event Date:** _[e.g., "2026-03-15" or null]_

---

## 2. Campaign Content (AI Campaign Builder)

### Thinking Steps (6-step animation)

Fill in what the AI should "think about" during the animation. Each step should have:
- Generic text (shown first)
- Specific text (shown after transition)
- Reasoning (why this step matters)

**Step 1:**
- Generic: _[e.g., "Analyzing data..."]_
- Specific: _[e.g., "Identifying 2,840 season ticket holders eligible for renewal"]_
- Reasoning: _[Why this analysis matters]_

**Step 2:**
- Generic: _[...]_
- Specific: _[...]_
- Reasoning: _[...]_

**Step 3:**
- Generic: _[...]_
- Specific: _[...]_
- Reasoning: _[...]_

**Step 4:**
- Generic: _[...]_
- Specific: _[...]_
- Reasoning: _[...]_

**Step 5:**
- Generic: _[...]_
- Specific: _[...]_
- Reasoning: _[...]_

**Step 6:**
- Generic: _[...]_
- Specific: _[...]_
- Reasoning: _[...]_

---

### Response Introduction
_[Opening paragraph that introduces the campaign strategy]_

Example:
```
"Based on your renewal cycle data, I've created a comprehensive Season Ticket Renewal campaign
targeting 2,840 eligible holders. This multi-tiered approach prioritizes early renewals while
providing enhanced incentives for at-risk segments..."
```

---

### Data Table

Define the segments/tiers shown in the campaign strategy table.

**Column Headers:**
- _[e.g., "Segment", "Accounts", "Pricing", "Message", "Expected Conversion"]_

**Row 1:**
- Segment: _[e.g., "Engaged Renewals"]_
- Accounts: _[e.g., "1,500"]_
- Pricing: _[e.g., "10% Early Bird Discount"]_
- Message: _[e.g., "Thank you for 5 great seasons..."]_
- Conversion: _[e.g., "95%"]_

**Row 2:**
- Segment: _[...]_
- Accounts: _[...]_
- Pricing: _[...]_
- Message: _[...]_
- Conversion: _[...]_

**Row 3:**
- Segment: _[...]_
- Accounts: _[...]_
- Pricing: _[...]_
- Message: _[...]_
- Conversion: _[...]_

_(Add more rows as needed)_

---

### Strategy Explanation
_[Paragraph explaining the overall campaign strategy after the data table]_

Example:
```
"This segmentation ensures each holder receives relevant messaging based on their engagement
level. High-value accounts get exclusive perks, while at-risk holders receive enhanced
incentives to encourage renewal..."
```

---

### Testing & Optimization Card

**Card Title:** _[e.g., "A/B Testing Strategy"]_

**Test Items:** _(list 3-5 testing recommendations)_
1. _[e.g., "Subject line test: Recognition vs. Urgency"]_
2. _[...]_
3. _[...]_
4. _[...]_
5. _[...]_

**Footer:** _[Summary or additional context]_

---

### Optimization Recommendations
_[Paragraph about campaign optimization strategies]_

Example:
```
"To maximize conversion rates, launch with email to all segments, followed by SMS reminders
3 days before deadline. Monitor open rates daily and adjust send times for low-performing
segments..."
```

---

### Optimization Card (if different from testing card)

**Card Title:** _[e.g., "Performance Optimization"]_

**Optimization Items:** _(list 3-5 optimization tactics)_
1. _[e.g., "Send time optimization: 10am CT performs best"]_
2. _[...]_
3. _[...]_
4. _[...]_

**Footer:** _[Summary or additional context]_

---

### Conclusion
_[Final paragraph wrapping up the campaign strategy]_

Example:
```
"With a projected 90% retention rate, this campaign should secure $3.8M in renewal revenue
while maintaining strong fan relationships. Launch immediately to maximize early bird
participation."
```

---

## 3. Sidebar Content (Right Panel)

### Campaign Badge
- **Text:** _[e.g., "AI Recommended" or "Seasonal Priority"]_

### Campaign Title
- **Title:** _[e.g., "Season Ticket Renewal Campaign"]_

### Campaign Subtitle
- **Subtitle:** _[e.g., "Multi-tier retention strategy" or brief tagline]_

### Revenue Projection
- **Range:** _[e.g., "$3.6M - $4.2M"]_
- **Label:** _[e.g., "Projected Renewal Revenue"]_

### Campaign Metadata Sections

Fill in 4-6 metadata items with icons:

**Section 1:**
- Icon: _[e.g., "users" / "target" / "calendar" / "dollar"]_
- Label: _[e.g., "Target Accounts"]_
- Value: _[e.g., "2,840 Season Ticket Holders"]_

**Section 2:**
- Icon: _[...]_
- Label: _[e.g., "Pricing Strategy"]_
- Value: _[...]_

**Section 3:**
- Icon: _[...]_
- Label: _[e.g., "Campaign Window"]_
- Value: _[...]_

**Section 4:**
- Icon: _[...]_
- Label: _[e.g., "Urgency"]_
- Value: _[...]_

**Section 5 (optional):**
- Icon: _[...]_
- Label: _[...]_
- Value: _[...]_

**Section 6 (optional):**
- Icon: _[...]_
- Label: _[...]_
- Value: _[...]_

### Key Decisions

List 4-6 key decisions the AI made in building this campaign:

1. _[e.g., "Segmented audience into 3 tiers based on engagement"]_
2. _[e.g., "Applied 10-20% early bird discounts to encourage immediate action"]_
3. _[...]_
4. _[...]_
5. _[...]_
6. _[...]_

---

## 4. Button Behavior & Routing

### Banner Button Click
When user clicks "Create Campaign" on the banner:

**Option A: Direct to Chat with Recommendation Context**
- Route to: `/chat?rec=rec-str-1`
- Pre-populate: _[Should the input be pre-filled? If yes, with what text?]_

**Option B: Go to Create Campaign Landing First**
- Route to: `/create-campaign`
- Display recommendation: _[Should the STR recommendation appear as a chip? Yes/No]_
- Chip text: _[If yes, what should the chip say?]_

**Option C: Custom Behavior**
- _[Describe what should happen]_

_(Choose one option above or specify custom behavior)_

---

## 5. Where to Add the Recommendation

### Display Locations

Where should this recommendation appear in the UI?

- [ ] Dashboard (`/`) - in "Opportunities & Risks" section
- [ ] Create Campaign page (`/create-campaign`) - as a suggestion chip
- [ ] Campaigns page (`/campaigns`) - Game Opportunities tab
- [ ] Campaigns page (`/campaigns`) - Season Opportunities tab
- [ ] Other: _[specify]_

---

## 6. Game Linkages (Optional)

Should this campaign be linked to specific games when launched?

**Linked Games:** _[e.g., "All home games" or "First 10 games" or "Games 1-5, 10, 15"]_

**Estimated Impact per Game:** _[e.g., "2-5% capacity increase" or specific values]_

**How to determine linkage:** _[Automatic based on rules, or user configures at launch?]_

---

## 7. Campaign Data When Launched

When the user clicks "Launch Campaign", what data should be saved to `campaignsStore.ts`?

- **Title:** _[e.g., "Season Ticket Renewal Campaign 2026"]_
- **Description:** _[Brief description for campaigns table]_
- **Status:** `Active` / `Draft` _(choose one)_
- **Segment:** _[e.g., "Season Ticket Holders"]_
- **Type:** _[e.g., "Revenue" / "Retention"]_
- **Projected Revenue:** _[e.g., 4200000]_
- **Actual Revenue:** _[e.g., 0 (starts at 0)]_
- **Delivered/Opened/Converted:** _[Start at 0% or specify]_
- **Created From:** `rec-str-1` _(links back to recommendation)_
- **Linked Games:** _[Array of game IDs if applicable]_

---

## 8. Additional Features

### Special Requirements
_[Any other custom behavior, validations, or features needed?]_

Example:
- Should there be a deadline countdown in the sidebar?
- Should the banner disappear after campaign is launched?
- Should there be a confirmation modal before launching?
- Any email/SMS integration details?

---

## 9. Testing Checklist

After implementation, verify:
- [ ] Banner appears on `/campaigns` (Active tab)
- [ ] Clicking button routes correctly
- [ ] AI recommendation displays in correct locations
- [ ] Thinking animation runs (6 steps, ~11 seconds)
- [ ] Campaign content renders properly
- [ ] Sidebar shows correct data
- [ ] "Launch Campaign" button saves to localStorage
- [ ] Launched campaign appears in campaigns table
- [ ] Game linkages work (if applicable)

---

## Notes

_[Any additional context, constraints, or special considerations]_

---

**When ready, save this file and tell Claude:**
> "Implement the requirements in SEASON_TICKET_RENEWAL_REQUIREMENTS.md"
