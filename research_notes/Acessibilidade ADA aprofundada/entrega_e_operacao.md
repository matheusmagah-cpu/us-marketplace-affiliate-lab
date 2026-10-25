# Delivery engine for WCAG 2.1/2.2 AA audits and remediation for small e-commerce stores (Shopify, WooCommerce, BigCommerce), 2026

Research date: 2026-10-25. Method: web search plus some page fetches. Many vendor domains (accessible.org, testparty.ai, shopify.com, shopify.dev, digitala11y.com) returned DNS errors to the fetch tool, so several figures come from search-result summaries of those pages and were not read in full. **Labels used below: VERIFIED = a published figure seen in a search result or page (still often vendor-published). ESTIMATE = my own inference, with no source.** Most cost sources are vendors selling accessibility services or software (TestParty, Accessible.org, WebAbility, fudge.ai, AudioEye), so their ranges may lean toward their own products.

## 1. Effort: hours to audit and remediate a small store; common e-commerce WCAG failures; what can be fixed at theme level

### Takeaway
Published prices for a small-site manual audit cluster at $1,250–$5,000. Cost depends on the number of unique templates and interactive components, not on total page count. Remediation is commonly budgeted at 1–3x the audit fee. No source gave an hours-per-page figure, so the hour estimates below are my own. Most top failures (contrast, alt text, labels, empty links and buttons, document language) can be fixed in the theme or in content. Checkout and third-party app widgets mostly cannot.

### Cited Findings
- VERIFIED (vendor): Accessible.org prices manual WCAG 2.2 AA audits by page type: $100–$250 per primary page or screen and $25–$100 per light page. It says most audits cost $1,250–$2,750, and its scope is a sample of pages. VPAT (WCAG edition) is $350 and technical support is $195/hour. — [Accessible.org pricing](https://accessible.org/pricing/)
- VERIFIED (vendor): Small-to-mid site audit at $1,500–$5,000 from flat-rate boutique firms (DigitalA11Y, Aug 2026). Other guides give $2k–$7k and $2,500–$7,000 for small business sites, and $2,500–$10,000 for expert manual audits of up to about 12 pages. — [DigitalA11Y audit cost guide](https://digitala11y.com/how-much-does-a-web-accessibility-audit-cost); [ADA Compliance Pros](https://www.adacompliancepros.com/blog/accessibility-audit-cost); [TestParty audit cost 2026](https://testparty.ai/blog/accessibility-audit-cost-2026)
- VERIFIED (vendor guidance): "The biggest cost driver is the number of unique page templates and interactive components, not your total page count." Dynamic form states expand manual validation sharply. — [WebAbility WCAG audit cost](https://www.webability.io/blog/wcag-audit-cost); [DigitalA11Y](https://digitala11y.com/how-much-does-a-web-accessibility-audit-cost)
- VERIFIED (vendor): Budget remediation at about 1–3x the audit fee for a site with typical issues. Automated scans catch only about 30–40% of WCAG issues. — [search summary of 2026 audit cost guides](https://testparty.ai/blog/website-ada-compliance-cost)
- VERIFIED (vendor, self-interested): First-year compliance for a small Shopify store is about $3,000–$10,000, $15,000–$50,000 for mid-market, and $50,000–$150,000+ for complex Shopify Plus. TestParty says Dawn ships with 30–100 WCAG violations and premium themes with 100–350, based on its own audits. — [TestParty Shopify compliance cost 2026](https://testparty.ai/blog/shopify-accessibility-compliance-cost)
- VERIFIED (practitioner): An agency reports that many clients have their own developer. They take the fixes in-house and then buy 2–3 hours of technical support to validate them. — [Accessible.org, simple Shopify audits](https://accessible.org/?p=4016067)
- VERIFIED (secondary, citing WebAIM Million 2026): 95.9% of home pages had detectable WCAG 2 failures, averaging 56.1 errors per page, up from 94.8% in 2025. Six error types make up about 96% of detected issues: low-contrast text, missing alt text, missing form labels, empty links, empty buttons, and missing document language. Low contrast appears on about 83.9% of pages. — [Matthias Ott](https://matthiasott.com/notes/this-still-not-for-everyone); [Priority Pixels](https://prioritypixels.co.uk/insights/web-accessibility-is-getting-worse-according-to-the-2026-webaim-million-report/); [Nexer Digital](https://nexerdigital.com/news-and-thoughts/the-webaim-million-report-2026-what-it-tells-us/). I did not read the primary report at webaim.org.

### Inferences
- ESTIMATE, audit hours for a small store with about 8–12 sampled templates (home, collection, product with variants, search, cart/drawer, account/login, blog post, contact/form, static page, plus global header/nav/menu, footer, and modals such as newsletter popup, quick view and cookie banner):
  - Automated scan and setup: 1–2 h.
  - Manual testing (keyboard, NVDA plus VoiceOver, zoom/reflow, contrast, forms) at about 1–1.5 h per template, plus about 2–3 h for global components: 10–18 h.
  - Report writing: 3–5 h.
  - **Total: about 14–25 h.** This fits the $1,250–$2,750 retail price range at $60–$150/h.
- ESTIMATE, remediation hours for a theme-based store on Dawn or a similar Online Store 2.0 theme: about 15–40 dev hours. Premium or heavily customized themes with sliders, mega-menus and quick-add drawers run 40–80+ h. Retest takes 3–6 h.
- Usually fixable at theme or content level:
  - contrast (CSS tokens)
  - alt text (product media and section images in admin; template fallbacks)
  - form labels and error messaging (newsletter, contact, account, search)
  - empty links and buttons (icon-only cart, search and social links need accessible names)
  - `lang` attribute
  - skip link and landmarks
  - visible focus styles
  - keyboard operation of menus, disclosures and drawers
  - carousel pause/stop controls (WCAG 2.2.2)
  - modal focus trap and return focus
  - variant pickers announced correctly (fieldset/legend, aria-live for price and stock updates)
  - heading order
  - WCAG 2.2 additions: focus not obscured by sticky headers and cookie bars, target size minimum 24px, accessible authentication.
- Usually not fixable by the contractor: the Shopify checkout core, payment provider buttons (PayPal, Amazon Pay), and app-injected widgets (reviews, chat, upsell popups, loyalty). These are handled with vendor tickets, swapping the app, or CSS overrides. This is ESTIMATE, consistent with the Shopify VPAT section below.

### Gaps
- No source gave measured hours per template or per audit. All hour figures above are estimates.
- I found no BigCommerce-specific effort or VPAT data.

## 2. Platform specifics: Shopify (checkout, themes, apps) and WooCommerce

### Takeaway
Shopify publishes a WCAG 2.2 A/AA conformance report for Checkout. The latest copy found is dated March 2026 and still lists "Partially Supports" items, including third-party wallet buttons. Dawn is listed as tested only to WCAG 2.1 AA. Merchants remain responsible for their theme, content and apps. On WooCommerce, the merchant and contractor control everything, including checkout. Equalize Digital is the leading WordPress/Woo-specific toolset.

### Cited Findings
- VERIFIED (primary, Shopify): Shopify's accessibility page lists Checkout as tested to WCAG 2.2 A/AA and Dawn v2.4.0 as tested to WCAG 2.1 A/AA. — [Shopify accessibility](https://www.shopify.com.au/accessibility)
- VERIFIED (primary): The Checkout ACR (VPAT 2.5Rev; March 2026 copy) marks criteria such as 1.3.1 and 1.3.2 as "Partially Supports". It says "PayPal/Venmo/Amazon Pay supplied controls may generate barriers to access" and that order-summary/discount sidebar content sits after the footer in the DOM. It also says "remediation is on-going". An earlier June 2025 copy noted that modals did not place focus inside the dialog. Shopify says the VPAT is informational, not legal advice. — [Shopify Checkout VPAT](https://www.shopify.com/accessibility/vpat-checkout)
- VERIFIED (secondary): Shopify does not certify the finished store, and its checkout report says merchants must assess their own compliance. — [fudge.ai](https://www.fudge.ai/blog/is-shopify-ada-compliant/); [TestParty](https://testparty.ai/blog/shopify-accessibility-requirements)
- VERIFIED (vendor estimate, self-interested): Theme Store accessibility requirements map to roughly 16–22% of WCAG success criteria, and Dawn to 18–22% out of the box. — [TestParty gap analysis](https://testparty.ai/blog/shopify-built-in-accessibility-features-gap-analysis)
- VERIFIED (forum, AI-summarized): Merchants using Dawn have still faced lawsuits over contrast, ARIA and link issues, and Shopify staff pointed them to accessibility partners for audits. — [Shopify Community](https://community.shopify.com/t/is-dawn-5-0-theme-ada-compliant/144102/4)
- VERIFIED: Equalize Digital Accessibility Checker (WordPress) costs $190/yr for 1 site (Professional), $750/yr for 5 sites, and $2,250/yr for 25 sites (Agency, also $225/mo). WooCommerce product scanning is paid-tier only. The Agency tier includes "preferred status in the Agency Partner Program". Equalize also sells accessibility consulting on the WooCommerce Marketplace with quote-based pricing. — [Equalize pricing](https://equalizedigital.com/accessibility-checker/pricing/); [WooCommerce Marketplace listing](https://woocommerce.com/products/equalize-digital-accessibility-consulting/)
- VERIFIED (vendor sources; FTC primary not read): The FTC fined accessiBe $1M (order finalized around April 2025) for claims that its AI overlay ensures WCAG compliance. Vendors report that about 1 in 4 of 4,000+ ADA web suits in 2024 named sites that had an overlay, and that federal web suits rose 27% in 2025 to 3,117 (Seyfarth data as relayed). — [TestParty overlay problems](https://testparty.ai/blog/accessibility-overlay-problems); [fudge.ai on overlays](https://www.fudge.ai/blog/accessibility-overlays-shopify/)

### Inferences
- The scope statement in every Shopify engagement should exclude Shopify Checkout core and third-party payment buttons. Reference Shopify's ACR and document known checkout issues as "platform limitations". On Shopify Plus, checkout extensions and branding added by the merchant are in scope.
- App audit step: list the installed apps that inject storefront UI. App issues go in a separate "vendor dependency" table with recommended replacements.
- Do not sell or rely on overlays as remediation. It is a legal and reputational risk, and buyers increasingly know about the FTC action.
- WooCommerce allows full remediation, including checkout (block vs classic checkout). Plugin conflicts and page builders (Elementor and similar) are the main cost multiplier (ESTIMATE).

### Gaps
- I could not open shopify.dev's theme accessibility best-practices page because of a DNS failure, so I do not have the exact Theme Store requirement list.
- I found no Horizon (newer Shopify theme) conformance data.
- I found no BigCommerce accessibility statement or Catalyst/Cornerstone theme VPAT.

## 3. Talent and cost: rates, platforms, certifications, disability user testing

### Takeaway
Offshore WCAG freelancers on Upwork, Fiverr and Freelancer typically ask $10–$50/h. LATAM contract testers go for about $17/h, US contract testers about $60/h, and accessibility firms bill $100–$200/h for remediation. Certifications are a cheap filter: IAAP CPACC (foundational), WAS (technical), CPWA (both). Check them on Credly. Disability user testing via Fable starts at $3,750–$4,500 per project, so it is a premium add-on, not part of the standard package.

### Cited Findings
- VERIFIED (individual listings, not a survey):
  - Upwork WCAG profiles: $50/h (Canada), $33/h, $20–25/h (India/Pakistan), and an IAAP-certified WCAG 2.2 expert at $15/h.
  - Upwork job posts: $10–25/h (WCAG 2.2/RGAA audits) and $20–25/h (compliance role).
  - — [Upwork WCAG specialists](https://www.upwork.com/hire/web-content-accessibility-guidelines-wcag-freelancers/ca/); [Upwork job](https://www.upwork.com/freelance-jobs/apply/Web-Accessibility-Specialist-WCAG-RGAA-Audits-for-Web-Mobile-Agency_~022111199843363478294/); [Upwork job 2](https://www.upwork.com/freelance-jobs/apply/Certified-Accessibility-Specialist-Digital-Accessibility-Compliance_~022056690449937843954/)
- VERIFIED (individual listings):
  - India: Fiverr WCAG/AT testers at $15/h (6+ yrs) and $25/h (5+ yrs); Freelancer certified consultant at $35/h, tester at $10/h; PDF remediation at $9/h.
  - LATAM: remote accessibility tester contract at $17/h.
  - US: contract listing at $60/h.
  - — [Fiverr](https://www.fiverr.com/mohdirfan0); [Freelancer accessibility testers](https://www.freelancer.com.au/freelancers/skills/accessibility-testing); [hireline LATAM](https://hireline.io/remoto/empleos/accessibility-tester/103277); [Illinois JobLink](https://illinoisjoblink.illinois.gov/jobs/12046781)
- VERIFIED (third party): Toptal publishes no accessibility rate card. Third-party estimates put Toptal at about $60–$150/h. One Contra accessibility consultant lists $25–$50/h. Accessibility firms charge about $100–$200/h for remediation. — [Toptal accessibility engineers](https://www.toptal.com/hire-accessibility-engineers); [hireinsouth on Toptal pricing](https://www.hireinsouth.com/post/how-much-does-toptal-cost); [Contra profile](https://contra.com/venkat_b_283wx96x/about); [TestParty remediation cost](https://testparty.ai/blog/accessibility-remediation-cost)
- VERIFIED (secondary; fees vary by source):
  - CPACC: about $385 member / $485 non-member.
  - WAS: $430 / $530.
  - CPWA is conferred on holders of both CPACC and WAS, and badges are verifiable on Credly.
  - Discounts exist for developing economies.
  - — [BOIA on CPACC](https://www.boia.org/blog/what-is-a-cpacc-accessibility-certification); [Skynet IAAP guide](https://www.skynettechnologies.com/blog/iaap-accessibility-certification-guide); [Credly CPWA badge](https://www.credly.com/org/international-association-of-accessibility-professionals-iaap/badge/iaap-certified-professional-in-web-accessibility-cpwa)
- VERIFIED: Fable pay-per-project pricing is listed "from $3,750" on its site, and G2 shows $4,500 per project. The project includes 3 users, video and transcripts, and feedback comes within about 2 business days. Fable has 20+ assistive technology configurations and a free self-guided task offer that returns an "Accessible Usability Score". — [Fable pricing](https://makeitfable.com/pricing); [G2 Fable](https://www.g2.com/products/fable)
- VERIFIED (historical only): Knowbility AccessWorks quotes per study. Contact aw-services@knowbility.org. A 2017 post said testers were paid about $50 per study. I found no current client pricing. — [AccessWorks page (proxy)](https://https-knowbility_org.proxy.bugsmash.io/services/accessworks); [W3C WAI-IG 2017](https://lists.w3.org/Archives/Public/w3c-wai-ig/2017JulSep/0163.html)

### Inferences
- Recommended team (ESTIMATE):
  - (a) Lead auditor, CPACC + WAS (or CPWA) or DHS Trusted Tester, offshore or LATAM/Brazil, at $25–$45/h.
  - (b) Shopify Liquid / WooCommerce PHP-JS remediation dev with accessibility experience, at $20–$45/h.
  - (c) Part-time senior US/EU QA reviewer (CPWA) for spot-checks, at $60–$100/h, 1–3 h per project.
- A Brazilian or LATAM bench gives time-zone overlap with US clients. Rates in the $15–$45/h band are plausible, based on the LATAM $17/h data point and general Upwork ranges. No Brazil-specific rate data was found.

### Gaps
- I found no reliable platform-wide medians for accessibility work on Upwork, Toptal or Contra.
- I found no Philippines-specific or Brazil-specific accessibility rate data.
- I could not verify DHS Trusted Tester program details (free federal training; exam access historically limited to federal staff and contractors) in this session. Treat this as unverified.

## 4. White-label / wholesale partners for hands-off delivery

### Takeaway
A few vendors explicitly let resellers sell under their own brand:
- Accessible.org: white-label audits, VPAT/ACRs and PDF remediation, with partner-set pricing and published retail prices that make margins easy to estimate.
- TestParty: white-label tier at 25% off standard rates, Shopify-focused.
- EquiTech Digital: services shop offering white-label audits, VPATs and remediation.

Tool-level white-label options (branded scans and reports) come from Accessibility Checker (accessibilitychecker.org), WCAG Repair ($49/mo freelancer plan), AllAccessible, Skynet and WebAbility. The last three are overlay or widget vendors and should be avoided as remediation. Wholesale rates are mostly not public.

### Cited Findings
- VERIFIED (vendor): Accessible.org's white-label program lets a partner buy services and resell them under its own brand at partner-set prices. It covers audits, VPATs/ACRs and PDF remediation. There is also a 10% referral commission, and new applicants are asked to refer one client first. Standard pricing is published. — [Accessible.org partner page](https://accessible.org/?p=8050); [Accessible.org pricing](https://accessible.org/pricing/)
- VERIFIED (vendor): The TestParty agency partner program has a white-label tier with a 25% discount off standard rates, branded deliverables and centralized oversight. — [TestParty partners](https://testparty.ai/partners)
- VERIFIED (vendor): TestParty sells source-code remediation subscriptions at about $800–$3,000/month, and another vendor quotes $1,000–$5,000/month including remediation. — [TestParty Shopify compliance cost](https://testparty.ai/blog/shopify-accessibility-compliance-cost)
- VERIFIED (vendor): EquiTech Digital lists white-label partnering for agencies (audits, VPATs, remediation support). — [GoodFirms EquiTech](https://www.goodfirms.co/company/equitech-digital-pvt-ltd)
- VERIFIED (vendor): WCAG Repair offers white-labeled PDF reports with the agency's logo and colors. The Freelancer plan is $49/mo, and VPAT and manual audit add-ons are on Enterprise. It is a scanner. — [WCAG Repair agency](https://wcagrepair.com/agency)
- VERIFIED (vendor): Accessibility Checker's agency program offers full white-label or discount pricing. — [accessibilitychecker.org agency](https://www.accessibilitychecker.org/de/businesses/agency/)
- VERIFIED (vendor): Skynet Technologies (All in One Accessibility) offers white-label widgets and reports with recurring commission up to 30%. WebAbility's partner plan includes a white-label widget, scanner and audits, with partner rates disclosed only on sales calls. AllAccessible offers a partner portal with SOW templates. — [Skynet](https://www.skynettechnologies.com/agency-partners/demo-video); [WebAbility agency](https://webability.io/agency); [AllAccessible](https://allaccessible.org/?p=2560)
- VERIFIED: Equalize Digital's Agency plan ($2,250/yr, 25 sites) includes Agency Partner Program status. This suits WordPress/Woo. — [Equalize pricing](https://equalizedigital.com/accessibility-checker/pricing/)
- VERIFIED (absence): I found no published partner or white-label terms from BOIA, Level Access or Accessibility Partners. — [search summary](https://accessible.org/?p=8050)
- Marketplace productized services exist. Example: Fiverr "ADA/508/WCAG audit + VPAT" gigs from Indian sellers. — [Fiverr gig](https://fiverr.com/vijaysingh447/do-ada-section-508-wcag-audit-and-create-vpat-report); [Upwork VPAT project](https://www.upwork.com/services/product/development-it-pro-website-accessibility-testing-1768195567550853120)

### Inferences
- Most hands-off model (ESTIMATE): resell Accessible.org or TestParty white-label audits.
  - With TestParty's 25% discount, a $2,000 retail audit costs about $1,500, giving roughly 25% gross margin at retail parity. Margins only get healthier if you price above their list.
  - Accessible.org's wholesale discount is not public. If you buy at their published price ($1,250–$2,750) and resell at $2,500–$4,500, the markup is 1.6–2x.
- Higher margin, more management: a direct freelancer bench (Section 3), using your own branded report template plus Pope Tech or Equalize for monitoring.
- Hybrid: freelancers do the audit and remediation, and a white-label partner or senior CPWA does QA sign-off and the conformance statement.

### Gaps
- Accessible.org and TestParty wholesale prices could not be fetched (DNS errors). Get partner rate cards directly.
- Accessibility Checker and Silktide white-label pricing is not public.

## 5. Tooling and costs (scanners, screen readers, statements, monitoring, white-label)

### Takeaway
A full manual-audit toolchain can run almost free: axe DevTools free, WAVE, Accessibility Insights, Pa11y/axe-core, NVDA, VoiceOver, and the Colour Contrast Analyser. Paid add-ons worth budgeting are axe DevTools Pro ($45/user/mo, guided tests), Pope Tech for multi-site monitoring ($25–$400/mo by tier, unverified third-party data), and Equalize Digital for WordPress. Siteimprove and Silktide are enterprise-priced and overkill for small stores.

### Cited Findings
- VERIFIED: axe DevTools Pro costs $45 per user/month (Deque plans page). Enterprise is custom. Older figures were $500/yr (2021: $40/mo or $409/yr). — [Deque plans](https://deque.com/?p=37102); [Deque launch release](https://www.deque.com/de/blog/deque-launches-axe-devtools-pro/)
- VERIFIED (third-party tracker, not confirmed on official page): Pope Tech plans are Free, Team $25/mo, Business Plus $225/mo, Professional $400/mo and Enterprise custom, plus a PDF scanning add-on. — [PricingSaaS Pope Tech](https://pricingsaas.com/companies/popetech)
- VERIFIED: Silktide does not publish list prices. UK G-Cloud 14 lists £6,000–£39,800 per year. The Texas DIR contract shows a 2,500-page tier at $3,856 (MSRP $4,820). I found no white-label info. — [G-Cloud Silktide](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/services/608269605939939); [Silktide pricing](https://silktide.com/pricing); [Silktide Texas DIR](https://silktide.com/?p=21162)
- VERIFIED (unverified estimate): Siteimprove is custom-quoted. Third-party estimates run about $10K–$150K+/yr. — [accessibilitychecker.org axe alternatives](https://www.accessibilitychecker.org/blog/axe-devtools-alternatives/)
- VERIFIED: Equalize Digital costs $190 / $750 / $2,250 per year (1 / 5 / 25 sites). — [Equalize pricing](https://equalizedigital.com/accessibility-checker/pricing/)
- VERIFIED: WCAG Repair offers white-label branded scan reports from $49/mo. — [WCAG Repair](https://wcagrepair.com/agency)

### Inferences
- Free or open-source and well known (ESTIMATE; not re-verified this session): WAVE browser extension (WebAIM), Accessibility Insights for Web (Microsoft, includes a guided "Assessment"), axe-core and Pa11y/pa11y-ci (can run in CI or cron for a DIY monitoring dashboard), Lighthouse, NVDA (Windows, free), VoiceOver (macOS/iOS, built in), TalkBack (Android), and the TPGi Colour Contrast Analyser. JAWS is paid, about $95/yr home license or more for professional use (unverified). For small stores, NVDA+Chrome/Firefox and VoiceOver+Safari are enough.
- Report templates: the W3C WCAG-EM Report Tool (free) and the ITI VPAT 2.5 template (free, WCAG edition) for the ACR. W3C also hosts an accessibility statement generator. These are known resources but were not fetched in this session.
- Monitoring stack per small client (ESTIMATE):
  - Pope Tech Business Plus, spread across about 20–30 sites, works out to roughly $8–$11 per site per month.
  - Or Equalize Agency, about $7.50 per site per month, for Woo.
  - Or self-hosted pa11y-ci/axe-core at near $0 plus dev time.
- White-labelable: WCAG Repair, Accessibility Checker, and overlay-vendor dashboards (Skynet, WebAbility, AllAccessible). Pope Tech and Silktide white-label status is unknown. Self-hosted pa11y output can be branded freely.

### Gaps
- I did not verify Pope Tech's official pricing page or its white-label or agency options.
- I did not verify JAWS 2026 pricing.
- I did not retrieve the official WAVE API pricing.

## 6. Process and QA: methodology, deliverables, SLAs, freelancer vetting, changing sites

### Takeaway
Use W3C WCAG-EM 2.0 (a Group Note published 23 July 2026) as the stated methodology. It has five steps: define scope, explore, select a representative sample, evaluate, report. Deliverables are an audit report, an issue/remediation log, a retest report, an accessibility statement, and optionally an ACR (VPAT 2.5). Monitoring covers sites that keep changing, with periodic manual re-audits of changed templates.

### Cited Findings
- VERIFIED (primary): WCAG-EM 2.0 is a W3C Group Note dated 23 July 2026, preceded by a February 2026 draft. Its steps are to define the evaluation scope, explore the target product, select a representative sample, evaluate it, and report findings. It applies to self-assessment and third-party evaluation. — [W3C WCAG-EM 2.0](https://www.w3.org/TR/2026/NOTE-wcag-em-2-20260723/); [W3C news](https://w3.org/news/2026/group-note-draft-w3c-accessibility-guidelines-evaluation-methodology-wcag-em-2-0/)
- VERIFIED (practitioner): One case reports what a 26-page WCAG-EM sample missed across 1,342 built pages. This illustrates the limits of sampling. — [DEV Community](https://dev.to/jangwook_kim_e31e7291ad98/what-a-26-page-wcag-em-sample-missed-across-1342-built-pages-2f4m)
- VERIFIED: A VPAT becomes an Accessibility Conformance Report (ACR) when completed. Accessible.org charges $350 for a VPAT (WCAG edition). — [accessibility.works VPAT/ACR](https://www.accessibility.works/services/vpat-acr-services/); [Accessible.org pricing](https://accessible.org/pricing/)
- VERIFIED: Automated tools detect only about 30–40% of issues, so manual testing is required. — [search summary of audit cost guides](https://testparty.ai/blog/accessibility-audit-cost-2026)

### Inferences
- Standard workflow (ESTIMATE):
  1. Intake: store URL, collaborator or staff access, theme name and version, and app list.
  2. Automated crawl (Pope Tech or axe) plus a sample of templates per WCAG-EM.
  3. Manual testing against WCAG 2.2 AA: keyboard, NVDA+Chrome, VoiceOver+Safari iOS, 200%/400% zoom and reflow, contrast, forms, error states, and the add-to-cart → cart → checkout entry flow.
  4. Issue log in a spreadsheet or Jira/Linear with SC number, severity, location, screenshot, and recommended code fix.
  5. Remediation on a duplicate or unpublished theme (Shopify) or staging (Woo), with a git diff.
  6. Retest.
  7. Publish the theme, then deliver the accessibility statement and conformance summary. Avoid claiming "fully compliant".
- SLAs (ESTIMATE): audit report 5–10 business days, remediation 2–4 weeks, retest 3–5 days, monitoring alerts reviewed weekly with a monthly report, and critical regressions fixed within 5 business days.
- Freelancer vetting (ESTIMATE):
  - Verify the CPACC/WAS/CPWA Credly badge.
  - Run a paid test audit on a known-bad seeded page or a public demo store. Compare their findings with your answer key (target ≥80% of seeded issues, with correct SC mapping and no false "pass" on keyboard or focus traps).
  - Require screen-reader video evidence for critical issues.
  - Have a senior reviewer double-check 10–20% of issues on the first 3 projects.
  - Track rework rate.
- Changing sites: monthly automated scans with diffs, quarterly manual spot-check of changed templates, re-test after any theme update or new app install, and a contract clause that excludes merchant-added content (images without alt text) unless training or a content-QA service is bought.

### Gaps
- I did not retrieve WCAG-EM 2.0's exact sample-size guidance.
- I found no industry-standard SLA benchmarks.

## 7. Estimated cost of goods sold (COGS) for three packages

### Takeaway
All figures here are ESTIMATES built from the cited rate data above, not quotes. Using a direct offshore or LATAM freelancer bench with senior QA:
- **Audit-only:** about $450–$1,100 COGS.
- **Audit plus remediation for a small store:** about $1,200–$3,500 COGS.
- **Monthly monitoring:** about $35–$130 per site per month COGS.

Reselling a white-label partner instead roughly doubles the COGS but removes management work.

### Cited Findings
- Input rates (VERIFIED, listings):
  - Offshore WCAG freelancers $10–$50/h ([Upwork](https://www.upwork.com/hire/web-content-accessibility-guidelines-wcag-freelancers/ca/), [Freelancer](https://www.freelancer.com.au/freelancers/skills/accessibility-testing))
  - LATAM tester $17/h ([hireline](https://hireline.io/remoto/empleos/accessibility-tester/103277))
  - US contract $60/h ([Illinois JobLink](https://illinoisjoblink.illinois.gov/jobs/12046781))
  - Firm remediation $100–$200/h ([TestParty](https://testparty.ai/blog/accessibility-remediation-cost))
- Retail benchmarks (VERIFIED, vendor):
  - Audit $1,250–$2,750 ([Accessible.org](https://accessible.org/pricing/)) or $1,500–$5,000 ([DigitalA11Y](https://digitala11y.com/how-much-does-a-web-accessibility-audit-cost))
  - Remediation 1–3x the audit fee ([TestParty](https://testparty.ai/blog/website-ada-compliance-cost))
  - Remediation subscriptions $800–$3,000/mo ([TestParty](https://testparty.ai/blog/shopify-accessibility-compliance-cost))
  - TestParty white-label at 25% off list ([TestParty partners](https://testparty.ai/partners))
- Tool inputs (VERIFIED):
  - axe DevTools Pro $45/user/mo ([Deque](https://deque.com/?p=37102))
  - Pope Tech $25–$400/mo ([PricingSaaS](https://pricingsaas.com/companies/popetech))
  - Equalize $2,250/yr for 25 sites ([Equalize](https://equalizedigital.com/accessibility-checker/pricing/))

### Inferences
- **A. Audit-only (8–12 templates, WCAG 2.2 AA, report, accessibility statement draft), ESTIMATE:**
  - Auditor 14–22 h at $25–$40 = $350–$880
  - Senior QA review 1.5–2.5 h at $60–$90 = $90–$225
  - Tool allocation about $15–$40
  - **COGS ≈ $450–$1,150.** Optional ACR/VPAT adds 3–5 h ($75–$200).
  - Suggested retail $1,500–$3,000, in line with the market. Gross margin about 55–75%.
  - White-label alternative: COGS about $940–$2,060 (Accessible.org at published price) or about 75% of TestParty list.
- **B. Audit plus remediation (small Shopify or Woo store on a standard theme), ESTIMATE:**
  - Audit COGS (above) $450–$1,150
  - Remediation dev 20–45 h at $25–$45 = $500–$2,000
  - Retest 3–6 h at $25–$40 = $75–$240
  - Final senior QA 1–2 h = $60–$180
  - Project management and contingency at 10%
  - **COGS ≈ $1,200–$3,900.**
  - Suggested retail $4,000–$9,000, consistent with the $3k–$10k first-year small-store range ([TestParty](https://testparty.ai/blog/shopify-accessibility-compliance-cost)). Gross margin about 50–70%.
  - Heavily customized or premium themes can double dev hours.
- **C. Monthly monitoring (per site), ESTIMATE:**
  - Scanner allocation $7–$15 (Pope Tech or Equalize spread across 20–30 sites, or self-hosted pa11y-ci)
  - Analyst triage and monthly branded report 1–2 h at $25–$40 = $25–$80
  - Small-fix allowance (for example, 1 h/month) $25–$45 if included
  - **COGS ≈ $35–$140 per site per month.**
  - Suggested retail $149–$399/mo. Gross margin about 60–80%.
  - Quarterly manual spot-check can be priced as an add-on.
- Fixed overhead not in COGS: axe DevTools Pro seat ($540/yr), Pope Tech Business Plus ($2,700/yr), JAWS license if wanted (optional), and E&O/professional liability insurance (not researched).
- The main risks to margin are scope creep (third-party apps, checkout), sites that keep changing, and freelancer quality. Mitigate with WCAG-EM scoping language, a vendor-dependency exclusion, and senior QA sampling.

### Gaps
- All COGS figures are modeled, not quoted.
- Wholesale prices from Accessible.org and TestParty, and real freelancer hours on comparable stores, would need validating through 2–3 pilot projects.
- Insurance costs and legal-review costs for accessibility statements were not researched.
