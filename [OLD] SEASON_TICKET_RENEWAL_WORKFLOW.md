# Season Ticket Renewal Campaign Workflow

## Overview

This document outlines the user workflow and configuration options for creating a Season Ticket Renewal campaign through the banner Call-to-Action on the Active Campaigns page.

---

## When to Use This Workflow

The **Season Ticket Renewal banner** appears on the Active Campaigns page when it's the optimal time in your seasonal cycle to launch renewal campaigns. This banner serves as a proactive reminder to engage season ticket holders before renewal deadlines approach.

**Best Time to Launch:**
- 60-90 days before the season starts
- When early bird pricing windows open
- Before renewal deadlines expire

---

## User Workflow

### Step 1: Click "Create Campaign" on Banner

**Location:** Navigate to `/campaigns` (Active tab)

**What You'll See:**
- A prominent blue banner with gradient background
- "Seasonal Opportunity" badge indicating optimal timing
- Title: "Time to Launch Season Ticket Renewals"
- Description explaining why now is the right time
- "Create Campaign" button on the right side

**Action:** Click the **"Create Campaign"** button

---

### Step 2: Campaign Creation Landing Page

**Location:** You'll be redirected to `/create-campaign`

**What You'll See:**
- Greeting: "Hi [Name], how can I help?"
- Large text input area for natural language campaign requests
- AI-recommended campaign suggestions (chips at the bottom)
- General template suggestions

**Options:**

#### Option A: Use Natural Language Input
Type your campaign requirements in plain English. Examples:
- "Create a renewal campaign for season ticket holders with early bird pricing"
- "I need to target at-risk STH who haven't renewed yet"
- "Set up a campaign with 20% off for renewals in the next 2 weeks"

#### Option B: Select an AI Recommendation
If a Season Ticket Renewal recommendation appears as a chip, click it to auto-populate campaign context.

**Action:** Either type your request or click a suggestion, then press Enter or click "→"

---

### Step 3: AI Campaign Builder (Chat Interface)

**Location:** You'll be redirected to `/chat` (or `/chat?rec={id}` if from a recommendation)

**What You'll See:**

1. **Thinking Animation (6 steps, ~11 seconds):**
   - Analyzing season ticket holder data
   - Identifying renewal segments
   - Calculating optimal pricing strategies
   - Determining campaign timing
   - Generating messaging recommendations
   - Finalizing campaign structure

2. **AI-Generated Campaign Strategy:**
   - Campaign overview and objectives
   - Target audience breakdown (who you'll reach)
   - Segment-specific messaging and pricing
   - Data table showing:
     - Segment names
     - Number of accounts
     - Pricing tiers
     - Personalized messaging
     - Expected conversion rates

3. **Testing & Optimization Recommendations:**
   - A/B testing suggestions
   - Timing optimization tips
   - Channel recommendations (email, SMS, in-app)

4. **Campaign Sidebar (Right Panel):**
   - Campaign badge (e.g., "AI Recommended")
   - Campaign title
   - Revenue projection range
   - Key campaign details:
     - Target accounts
     - Pricing strategy
     - Urgency level
     - Confidence score
   - **Key Decisions** section listing critical choices made

**Action:** Review the AI-generated campaign strategy

---

### Step 4: Campaign Configuration

At this stage, you can review and customize the campaign details shown in the sidebar and data table.

**Key Configuration Options:**

#### Target Audience
- **Current Season Ticket Holders:** All active STH
- **At-Risk STH:** Holders who missed early deadlines or haven't engaged
- **High-Value STH:** Premium seat holders for upsell opportunities
- **Custom Segments:** Based on purchase history, engagement, or tenure

#### Pricing Strategy
- **Early Bird Pricing:** Discounts for early commitments (e.g., 10-20% off)
- **Loyalty Pricing:** Tiered discounts based on years as STH
- **Payment Plans:** Flexible payment options to reduce barriers
- **Seat Upgrade Incentives:** Special pricing for moving to better sections

#### Campaign Timing
- **Launch Date:** When to send initial outreach
- **Deadline:** Last day for renewal offers
- **Reminder Schedule:** Follow-up cadence (e.g., 7 days before deadline, 3 days, final day)

#### Messaging Personalization
- **Recognition:** Thank holders for their loyalty (e.g., "Thank you for 5 seasons")
- **Exclusive Perks:** Highlight STH-only benefits (early entry, exclusive events, playoff priority)
- **Urgency:** Communicate deadline and scarcity (limited seats available)
- **Social Proof:** "Join 2,500+ fans who've already renewed"

#### Channels
- **Email:** Primary channel for detailed information
- **SMS:** Urgent reminders and deadline alerts
- **In-App Notifications:** For fans using the mobile app
- **Direct Mail:** Physical renewal packets for premium STH

---

### Step 5: Launch or Save Campaign

**Three Action Options:**

#### 1. Launch Campaign (Primary Action)
- Click **"Launch Campaign"** button
- Campaign goes live immediately
- Appears in Active Campaigns table with "Active" status
- Linked to relevant games (if configured)
- Analytics tracking begins

#### 2. Save as Draft
- Click **"Save as Draft"** button
- Campaign saved for later editing
- Appears in Active Campaigns table with "Draft" status
- Can be edited and launched later

#### 3. Edit Campaign
- Click **"Edit Campaign"** button
- Opens editing interface to modify:
  - Target segments
  - Pricing
  - Messaging
  - Timing
  - Channels

**After Launch:**
You'll be redirected to `/campaigns?tab=active` where your new campaign appears in the table.

---

## Campaign Configuration Best Practices

### Segmentation Strategy

**Tier 1: Engaged Renewals (High Priority)**
- STH who opened renewal emails
- Active app users
- Attended 70%+ of games last season
- **Offer:** Standard early bird pricing

**Tier 2: At-Risk Renewals (Medium Priority)**
- STH who missed early deadlines
- Low game attendance (< 50%)
- Haven't engaged with emails
- **Offer:** Enhanced incentives (extra discount, payment plan)

**Tier 3: VIP Renewals (High Value)**
- Suite holders
- Club seat holders
- 5+ year STH tenure
- **Offer:** Exclusive perks (playoff priority, pre-sale access)

### Messaging Framework

**Email 1 (Launch):** Recognition + Early Bird Offer
- Subject: "[Name], Your 2026 Season Awaits – Renew Early & Save"
- Content: Thank them, highlight new season, present early bird pricing

**Email 2 (Mid-Campaign):** Social Proof + Urgency
- Subject: "2,500+ Fans Already Renewed – Don't Miss Out"
- Content: Show renewal momentum, countdown to deadline

**Email 3 (Final Reminder):** Last Chance + FOMO
- Subject: "Final Hours: Lock In Your Seats for 2026"
- Content: Deadline urgency, risk of losing seats

**SMS Reminder:** 3 days before deadline
- "Your season ticket renewal expires in 3 days! Renew now: [link]"

### Timing Recommendations

| Action | Timing |
|--------|--------|
| Launch Campaign | 60-90 days before season start |
| Early Bird Deadline | 45 days before season |
| Standard Renewal Deadline | 30 days before season |
| Final Reminder | 3 days before deadline |
| Seat Release (if not renewed) | Deadline day |

### Pricing Guidelines

- **Early Bird Discount:** 10-20% off standard renewal
- **Loyalty Bonus:** Additional 5% for 3+ year STH
- **Payment Plans:** 3-6 month installment options
- **Seat Upgrade Incentive:** 15% off upgrade differential

---

## Campaign Performance Tracking

Once launched, monitor your campaign's performance in the Active Campaigns table:

### Key Metrics to Track

1. **Delivered:** % of target audience reached
2. **Opened:** % who opened renewal communications
3. **Converted:** % who completed renewal
4. **Revenue:** Actual vs. projected renewal revenue

### Analytics Dashboard

View detailed analytics by clicking on the campaign name in the table:
- Daily conversion rates
- Segment-specific performance
- Channel effectiveness (email vs. SMS)
- Revenue by tier

### Optimization Opportunities

If performance is below projections:
- **Low Open Rates:** Adjust subject lines, try different send times
- **Low Conversion Rates:** Increase discount, extend deadline, improve payment plans
- **Segment Underperformance:** Create targeted follow-up campaign for that segment

---

## Integration with Game Schedule

Season Ticket Renewal campaigns can be linked to specific games to track their impact on capacity:

- **View Linked Games:** Navigate to `/campaigns?tab=schedule`
- **See Campaign Impact:** Each game row shows active campaigns and their estimated impact
- **Campaign Contribution:** Track % of capacity attributable to renewal campaign

---

## Next Steps After Campaign Launch

1. **Monitor Early Performance (Days 1-7):**
   - Check open rates and initial conversions
   - Identify high-performing segments
   - Adjust messaging if needed

2. **Mid-Campaign Optimization (Week 2-3):**
   - Send reminder emails to non-openers
   - Offer payment plan options to interested but uncommitted fans
   - Create urgency around deadline

3. **Final Push (Last Week):**
   - Send final countdown reminders
   - SMS alerts to at-risk renewals
   - Highlight scarcity (seats filling up)

4. **Post-Campaign Analysis:**
   - Review overall conversion rate vs. goal
   - Analyze which segments performed best
   - Document learnings for next year's campaign

---

## Frequently Asked Questions

### Can I run multiple renewal campaigns simultaneously?
Yes, you can create separate campaigns for different STH segments (e.g., one for premium seats, one for general STH).

### What if someone already renewed before the campaign launched?
The system should exclude already-renewed STH from the target audience to avoid redundant messaging.

### Can I extend the deadline mid-campaign?
Yes, use the "Edit Campaign" button to adjust the deadline and send updated communications.

### How do I handle payment plan requests?
Include payment plan options in your campaign messaging and provide a link to a form or customer service contact.

### What if I want to offer different pricing to different segments?
Create multiple campaigns with segment-specific targeting and pricing, or use the segmentation table to configure tiered pricing within one campaign.

---

## Technical Notes

- Campaigns are stored in `localStorage` via `lib/campaignsStore.ts`
- Campaign content is dynamically generated in `lib/campaignContent.ts`
- Game linkages are managed in `lib/campaignGameLinks.ts`
- The banner appears on `/campaigns` (Active tab)
- Campaign builder interface is at `/chat`

---

## Support

For additional help or questions about the Season Ticket Renewal workflow, contact the Jump Admin support team or refer to the main project README.md.
