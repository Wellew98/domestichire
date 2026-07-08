# DomesticHire Launch Playbook
> Customized from Red Flame Gas playbook (v1) — Apr-Jul 2026
> Applied to: DomesticHire — domestic worker recruitment platform, Harare, Zimbabwe

## How to use
Work phases in order. Phases 0-1 are non-negotiable before anything marketing goes live. Phase 5 (GBP) runs in parallel from day one; it's the highest-leverage surface.

---

## Phase 0 — Client intake: lock the canon before touching anything

Everything below gets re-litigated later if not written down on day one. One canonical block, agreed:

| Field | Value |
|---|---|
| **Business name (exact)** | DomesticHire |
| **Street address** | **[CONFIRM: Harare office address? Or online-only?]** |
| **Phone/WhatsApp (ONE)** | **[CONFIRM: +263 XX XXX XXXX]** |
| **Email** | info@domestichire.co.zw |
| **Website** | https://domestichire-psi.vercel.app → domestichire.co.zw |
| **Hours** | Mon-Fri 8am-5pm, Sat 8am-12pm |
| **Services (canonical)** | Maid recruitment, Nanny placement, Driver hiring, Gardener placement, Cook/Chef hiring, Cleaner placement, Nurse Aide placement |
| **Coverage areas (ranked)** | Harare, Bulawayo, Mutare, Gweru, Chitungwiza, Masvingo, Kwekwe, Kadoma **[CONFIRM + EXCLUDED areas]** |
| **Pricing policy** | Placement fee = one month's expected salary. Visible on each worker profile. **[CONFIRM]** |

### Also collect on day one:
- **Account inventory:** Which Google account owns GSC, GA4, domain registrar, Vercel, GitHub, Meta Business? Write down account emails.
- **Business reality:** Repeat/referral share? Current lead volume? Seasonal pattern? Who answers WhatsApp and how fast?
- **Lead target with date:** e.g. "20 paid placements/month by Dec 2026"

---

## Phase 1 — Technical foundation

### Stack: Next.js 16 on Vercel (auto-deploy from GitHub)
✅ Equivalent to the Cloudflare Pages stack in the original playbook.

| Checklist | Status |
|---|---|
| Domain + DNS (domestichire.co.zw) | ⏳ Custom domain not yet configured |
| Force HTTPS | ✅ Vercel auto-HTTPS |
| www → apex redirect | ⏳ Configure in Vercel |
| GitHub auto-deploy | ✅ Live |
| Clean URLs (no .html) | ✅ Next.js App Router handles this |
| sitemap.xml + robots.txt in repo | ✅ Created (2026-07-08) |
| Canonical URLs on every page | ✅ Added via metadata |
| AI crawler policy decision | ⏳ **[OWNER DECISION: allow ChatGPT/Claude to index?]** |
| Email routing (info@custom-domain → owner's Gmail) | ⏳ Needs setup |
| Deploy workflow: local → push → verify live | ✅ Pipeline works |

### Trap check:
- ✅ No .html URLs to worry about
- ⚠️ Vercel doesn't have the 200-fallback trap, but check custom 404
- ⚠️ Custom domain not live yet — hold on canonical URLs until it is

---

## Phase 2 — Homepage retrofits

Current state: ✅ Good foundation. Missing pieces per the playbook:

| Requirement | Status | Action |
|---|---|---|
| H1: service + location | ✅ "Find Trusted Domestic Workers in Zimbabwe" |
| WhatsApp CTA first in hero | ⚠️ Missing | Add floating WhatsApp button + hero WhatsApp CTA |
| Prefilled wa.me links per intent | ❌ Missing | "I'm interested in [worker name]" links |
| Category grid | ✅ Worker categories with icons |
| Services section with canonical wording | ✅ Services page exists |
| **Trust strip** | ❌ Missing | Add: "Verified Workers • Secure Paystack Payments • One-Time Fee • Direct Contact Access" |
| NAP block + Google Maps embed | ❌ Missing | Add Harare office map + contact block |
| **Floating WhatsApp button** (every page) | ❌ Missing | Critical per playbook |
| JSON-LD: LocalBusiness + Service + Breadcrumb | ✅ Organization schema added |
| Unique title + meta + OG image | ✅ Done (SEO pass) |
| GA4 tag | ❌ Missing | Phase 6 |

### Money keywords for DomesticHire (Zimbabwe SEO):
- "hire maid Harare" / "maid in Harare"
- "nanny Zimbabwe" / "nannies Bulawayo"
- "domestic worker recruitment Zimbabwe"
- "house help Harare" / "domestic helper Zimbabwe"
- "gardeners Harare" / "drivers Zimbabwe"
- "nurse aides Bulawayo"

### Copy rules:
- Location + service in every H1
- Named coverage cities come first in meta descriptions
- The money combo is "[category] in [city]" — this drives all SEO content

---

## Phase 3 — Location pages (THE RANKING ENGINE)

This is what won at Red Flame and will win here. Instead of suburb gas pages, we build **city-specific worker listing pages**.

### Page strategy: City hubs + Category × City combos

**City hub pages** (high priority — build 5-9):
- `/workers/harare` — "Domestic Workers in Harare | DomesticHire"
- `/workers/bulawayo` — "Domestic Workers in Bulawayo | DomesticHire"
- `/workers/mutare` — "Domestic Workers in Mutare | DomesticHire"
- `/workers/gweru` — "Domestic Workers in Gweru | DomesticHire"
- `/workers/chitungwiza` — "Domestic Workers in Chitungwiza | DomesticHire"

**Category × City pages** (medium priority — build as GSC shows demand):
- `/maids-harare` — "Maids for Hire in Harare"
- `/nannies-bulawayo` — "Nannies in Bulawayo"
- etc.

### Every location page MUST have:
- Unique title: "Domestic Workers in [City] — Maids, Nannies, Gardeners & More"
- Unique meta description naming specific categories available in that city
- Real worker cards filtered to that location (not empty pages!)
- H1: "Find Domestic Workers in [City], Zimbabwe"
- Unique JSON-LD: LocalBusiness with areaServed = that city
- Location-specific copy: landmarks, neighborhoods, local context
- Internal link strip to sibling city pages
- FAQ section matching FAQ schema: "How do I hire a maid in [City]?"

**Trap:** Never build pages for cities with zero workers. Empty pages = "Discovered - currently not indexed."

---

## Phase 4 — Indexing and Search Console

| Step | Status |
|---|---|
| Verify GSC property for domestic-hire domain | ⏳ |
| Import to Bing Webmaster Tools | ⏳ |
| Submit sitemap.xml | ⏳ |
| Delete any stale sitemaps | ⏳ |
| URL-inspect + Request Indexing for every location page | ⏳ |
| Week-2 check: chase "Discovered - not indexed", "Redirect error" | ⏳ |
| Fortnightly rank checks | ⏳ |

### Rank check method (from playbook):
- **Incognito + uule parameter** for Zimbabwe cities
- NEVER check from a signed-in browser (personalization inflates positions)
- For map-pack truth: use owner's phone in-area, or a rank-grid tool

---

## Phase 5 — Google Business Profile

GBP category: **Employment Agency** (primary) + **Recruiter** (secondary). This is your local-pack lever for "domestic worker agency Harare" and "recruitment agency near me."

### GBP setup checklist:
- [ ] Exact canonical name: "DomesticHire"
- [ ] Primary category: Employment Agency
- [ ] Secondary categories: Recruiter
- [ ] Address (if physical office exists) — or service-area business if online-only
- [ ] Service area: Zimbabwe (or major cities)
- [ ] Phone/WhatsApp: the ONE canonical number
- [ ] Hours: match site byte-for-byte
- [ ] Website: the canonical URL
- [ ] All 8 services listed in GBP services section
- [ ] 20+ photos (office, team, happy placements, workers — with consent)
- [ ] 5+ self-seeded Q&As (e.g. "How much is the placement fee?" → "One month's salary, one time.")
- [ ] Messaging enabled
- [ ] Weekly posts (rotation: worker spotlight, hiring tips, success story, safety advice)

### Reviews engine:
- Ask employers within 24h of a successful placement
- Direct review link via WhatsApp
- Target: 2-3/week sustained
- **Apps Script reminder** (clone from playbook): daily 6pm email to owner with review-request button

### Citations (Zimbabwe-relevant directories):
Zimbabwe doesn't have the SA directories listed in the playbook. Relevant Zim directories to research:
- Zimclassifieds, Classifieds.co.zw, Zimbiz directory
- If none exist — focus energy on GBP + Facebook + WhatsApp groups instead

---

## Phase 6 — Measurement (before ANY paid spend)

### GA4 setup:
- [ ] ONE GA4 property for DomesticHire
- [ ] Tag on every page
- [ ] lead_whatsapp event on WhatsApp clicks (floating button + worker contact reveal)
- [ ] lead_payment_start event on "Pay Placement Fee" clicks
- [ ] lead_payment_complete event on successful payment
- [ ] lead_contact_form on contact page submissions
- [ ] Mark all as Key Events
- [ ] Link GSC + Google Ads to GA4

### Owner's leads spreadsheet (weekly):
| Metric | Source |
|---|---|
| WhatsApp inquiries received | Owner's phone count |
| Calls received | Owner's phone count |
| Website contact form submissions | GA4 + email |
| Payments completed | Admin dashboard |
| Placements made (paid + placed) | Owner's records |
| **Conversion rate: inquiry → placement** | THE bottleneck metric |

### Honest lead math:
```
Current organic traffic → ~? clicks/month (needs GA4)
Realistic 12-week growth: 3-5x (Zim market is less competitive than SA)
Conversion rate: 5-10% (educated guess for marketplace)
Target: [OWNER DEFINED]
Gap = target - projected → filled by GBP + paid ads
```

---

## Phase 7 — Paid Ads (only after Phase 6 is live)

### Meta (Facebook/Instagram) — highest priority for Zim:
Zimbabwe has very high Facebook + WhatsApp usage. This is the primary paid channel.

- **Click-to-WhatsApp ads** — the proven format
- Video engagement ads with owner/team explaining how DomesticHire works
- Target: Zimbabwe, age 25-55, interests: home services, parenting, household
- Estimated costs: Facebook ads in Zim are cheaper than SA — budget R1,500-3,000/month to validate
- Boosted posts = waste bucket per playbook. Build proper campaigns.

### Google Ads:
- Search campaign: 3 ad groups
  1. Category-intent: "hire maid", "nanny Harare", "driver Zimbabwe"
  2. Location-intent: "domestic workers Harare", "house help Bulawayo"
  3. Brand defense: "domestichire"
- Phrase + exact match only (no broad match)
- Negative keywords: "free", "volunteer", "unpaid"
- Radius targeting: Zimbabwe
- Estimated Zim CPC: R3-8 (cheaper than SA's R8-15)

---

## THE TRAP LIST (check monthly)

Adapted from Red Flame traps for DomesticHire context:

1. **Local edits believed live but never pushed to GitHub/Vercel** — verify on live URL after every push
2. **Duplicate worker profiles** — canonical risk if same worker appears twice
3. **Schema for content not visible on page** — FAQ schema without visible FAQ section
4. **City pages with zero workers** — "Discovered - not indexed" guaranteed
5. **Second phone number leaking into GBP/citations** — ONE number everywhere
6. **Placeholder contact info still live** — current site has +263 77 000 0000 (fake)
7. **Account sprawl** — GSC/GA4/Vercel/GitHub/Meta under different emails, undocumented
8. **Judging rank from signed-in browser** — incognito + uule only
9. **Spending on ads before Key Events + leads spreadsheet exist**
10. **Visible placement fees changing without updating all worker profiles**

---

## Appendix A — DomesticHire current status (audited 2026-07-08)

### Done:
- ✅ Full-stack Next.js 16 app live on Vercel
- ✅ Worker directory with 8 categories + filters
- ✅ Contact-gating (pay-to-unlock)
- ✅ Paystack payments integration
- ✅ Admin dashboard with CRUD
- ✅ Responsive design
- ✅ sitemap.xml + robots.txt
- ✅ JSON-LD structured data (Organization + Breadcrumbs)
- ✅ Full metadata: titles, descriptions, OG tags, Twitter cards, canonical URLs

### Gap list (= the work plan, in playbook order):

**Phase 0:** Account inventory (who owns what?), real phone/WhatsApp number, coverage area priorities, lead targets.

**Phase 1:** Custom domain (domestichire.co.zw) not configured. Email routing not set up.

**Phase 2 (retrofit):** No floating WhatsApp button. No trust strip. No Google Maps embed. No GA4. Placeholder phone number (+263 77 000 0000) in contact page + footer. Contact form doesn't actually send. Money keywords present but not yet dominant.

**Phase 3:** Zero location-specific pages. The `/workers?location=Harare` filter exists but has no dedicated SEO page. **This is the biggest gap.**

**Phase 4:** GSC not verified. Sitemap not submitted. No manual indexing requests.

**Phase 5:** GBP profile? Unknown. Reviews: zero. Citations: zero.

**Phase 6:** No GA4 property. No lead tracking. No owner's spreadsheet.

**Phase 7:** No ads running. Hold until Phase 6 is live.

---

## Immediate next actions (this session):

1. ✅ **Done:** SEO foundation (sitemap, robots, metadata, JSON-LD)
2. 🔨 **In progress:** Custom playbook created
3. ⏳ **Ask owner:** Phase 0 canon (phone, address, coverage, lead targets)
4. ⏳ **Build:** Floating WhatsApp button + trust strip + Maps
5. ⏳ **Build:** City location pages (/workers/harare, /workers/bulawayo, etc.)
6. ⏳ **Setup:** GSC + GA4
