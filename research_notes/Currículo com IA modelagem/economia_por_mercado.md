# Economics by Market: AI Resume Builder sold via Google Search Ads (BR owner), 2026

Research date: 2026-10-26. Labels used: **[V]** verified from a cited source (usually a search snippet, because WebFetch failed with DNS errors for starterstory.com, indiehackers.com, stripe.com and beehiiv.com, so primary pages could not be opened); **[E]** my estimate or assumption; **[K]** background knowledge I could not re-verify this session, so treat it as unverified.

FX assumptions [E]: US$1 = R$5.40; £1 = US$1.27; €1 = US$1.08; US$1 = MXN 18.5. Check these against live rates before you rely on any figure.

## 1. Conversion benchmarks for resume builders

### Takeaway
No public source gives resume-builder visitor→signup or free→paid rates. The most useful hard number is StandOut CV: about £43 lifetime revenue per paying customer (£1M across 23,000 payers). The market leader (BOLD brands, Resume.io) earns its money from low-price trials that auto-renew at about US$25–30 every 4 weeks. That model drives LTV up, and it also drives complaints.

### Cited Findings
- StandOut CV (UK): more than £1M lifetime revenue, £30K MRR, more than 23,000 paying customers. Building a CV is free and the paywall is at download. **[V]** — [Starter Story snippet via search](https://www.starterstory.com/businesses/standout-cv/monetization)
  - Math: £1,000,000 / 23,000 ≈ **£43.5 lifetime revenue per payer** (≈ US$55). This is the best LTV proxy found. **[E derived from V]**
- Rezi: reported at about US$215K MRR (≈US$2.5M/yr). It started as a Word template sold for about US$9.69. **[V]** — [Goodreads/author blog](https://www.goodreads.com/author_blog_posts/25050295-from-10-word-doc-to-2-5-million-a-year-saas)
- ResumeMaker.Online: about US$45.5K revenue in 2024, bootstrapped. **[V, third-party estimate]** — [Latka](https://getlatka.com/companies/resumemaker.online)
- A freemium resume or career product charged US$5/month or US$20/year in 2017. **[V]** — [IndieHackers interview](https://www.indiehackers.com/interview/scratching-my-own-itch-let-me-quit-my-day-job-and-bootstrap-full-time-de5bfdeaa9)
- Resume Beacon (indie resume builder): monthly revenue went from about US$244 to US$586 in 5 months. The founder said conversion rates were "well below" what he wanted. Costs were about US$30/mo hosting plus US$40/mo email. **[V]** — [IndieHackers](https://www.indiehackers.com/interview/a0e1922fcb)
- Kickresume (historical, undated): 300 paying subscribers and 40K visitors/month after its Dec 2015 subscription launch. That is roughly 0.75% of monthly visitors as the paying base, a weak proxy. **[V, old]** — [AngelList syndicate](https://venture.angellist.com/kickresume/syndicate)
- Typical pricing models: subscriptions at about US$5–30/month, or a one-time download fee of about US$1.95–4.95. **[V]** — [search summary of rapidevelopers/resumetemplates pages](https://rapidevelopers.com/ai-implementation/ai-powered-resume-builder-ai-white-label)
- Resume.io: 7-day trial for US$2.95, which auto-renews at US$24.95 or US$29.95 every 4 weeks (sources conflict). The 7-day money-back guarantee covers only the trial window. Trustpilot shows complaints about unexpected renewal charges and refused refunds. **[V]** — [resufit](https://resufit.com/blog/resumeio-review-pricing-templates-worth-it/index.md); [top10](https://www.top10.com/resume-builder/reviews/resumeio); [Trustpilot](https://uk.trustpilot.com/review/resume.io?page=6); [pitchmeai](https://pitchmeai.com/blog/resume-io-free-trial-tips)
- Zety Brazil: R$8.70 trial for 14 days, then R$49.70 every 4 weeks; annual plan R$199.90; 14-day refund. **[V]** — [Zety BR planos](https://zety.com/br/planos)
- Enhancv in BRL: R$24.99/month, or R$49.97 per quarter. Resume.io BR: R$44.95 for 6 months with no auto-renew, or a R$2.95 7-day trial. **[V, third-party comparator]** — [toolquestor](https://toolquestor.com/pt/vs/resoume-vs-resumeio)

### Inferences
- **[E]** Click→paid assumption for modelling: 3% (pessimistic), 5% (base), 8% (optimistic). This assumes a "build free, pay to download" funnel on high-intent terms ("resume builder", "fazer currículo"). Head terms such as "curriculo", "cv template" and "curriculum vitae" are much more informational (people looking for templates, a definition, or a free Word file), so they will convert near or below the pessimistic end.
- **[E]** ARPPU anchors: one-time download US$15–25. Trial plus auto-renew (BOLD style) lands at about US$40–75 per payer once 1–2 rebills are included, with higher refund and chargeback exposure. StandOut's £43 per payer suggests a well-run non-predatory UK product reaches about US$50–55 LTV.
- **[K]** Card-network chargeback monitoring thresholds are roughly 0.9% (Visa) and about 1–1.5% (Mastercard) of transactions. Auto-renew trial models in this category are complaint-prone, so a new merchant (especially on a Stripe Brazil account) risks account reviews. A one-time "24h/7-day pass" or a clearly disclosed subscription is safer.

### Gaps
- No public visitor→signup, signup→paid or trial→subscription rate for any resume builder was found. Starter Story and IndieHackers pages could not be opened (DNS failure).
- No public refund or chargeback rates for resume builders.

## 2. Willingness to pay and payment methods by market

### Takeaway
Prices cluster at US$20–30 per 4 weeks for the incumbents in every market, including BRL-localised Zety. Local-method coverage is decisive in Brazil (Pix now overtakes cards in e-commerce transaction count) and in Germany (PayPal and invoice dominate, and cards are a minority). It matters moderately in Mexico, where card authorisation rates are poor.

### Cited Findings
- Brazil: in Jan–Jun 2026, Pix overtook credit cards for the first time in number of online-store transactions (Appmax survey). **[V]** — [search summary citing Appmax/finsiders](https://finsidersbrasil.com.br/?p=373624)
- Brazil incumbent prices: Zety R$49.70 per 4 weeks; Enhancv R$24.99/mo; Resoume lifetime R$34.99 one-time. **[V]** — [Zety BR](https://zety.com/br/planos); [toolquestor](https://toolquestor.com/pt/vs/enhancv-vs-resoume)
- Mexico: estimated 2025 e-commerce shares are credit cards about 32%, digital wallets 26%, debit 23% and bank transfer about 6% (vendor figures, unsourced). Mexican banks reportedly reject 37% of online card authorisations. Internationally routed card transactions approve about 20–30 percentage points less often than domestic ones. **[V, vendor claims]** — [Antom](https://www.antom.com/markets/mexico); [Nuvei](https://www.nuvei.com/posts/mexico-e-commerce-unlock-payment-performance-with-local-acquiring-oxxo-pay-spei-and-installments)
- Mexico: 23.7% of people used SPEI transfers (ENIF 2024). OXXO Pay is a cash voucher paid at convenience stores. **[V]** — [Paynopain](https://paynopain.com/en/blog/payment-methods-mexico-2025-trends-and-consumer-habits/)
- Germany: PayPal had about 28% of e-commerce transactions in 2023. Invoice is about 27–44% depending on the survey. SEPA direct debit is about 17–23%, and cards only about 11–28%. Giropay was discontinued in June 2024. **[V, secondary]** — [cross-border-magazine](https://cross-border-magazine.com/e-commerce-payment-germany-2025/); [juspay](https://juspay.io/blog/payment-methods-in-germany-for-2025-what-you-need-to-know)
- Brazilian cardholders buying in foreign currency pay IOF: Stripe documents 3.5% for Pix cross-border, and PagBrasil cites 6.38% on foreign-currency card purchases. The sources conflict, and the rate depends on the instrument and the date. **[V]** — [Stripe Pix docs](https://edge-docs.stripe.com/payments/pix); [PagBrasil](https://www.pagbrasil.com/news/international-card-foreign-currency/)

### Inferences
- **[E]** Realistic launch prices:
  - US: US$19–29 one-time or US$2.95→US$24.95 trial
  - UK: £15–25
  - DE/FR: €19.90–29
  - ES: €12.90–19.90
  - MX: MXN 99–199 (US$5–11)
  - BR: R$19.90–39.90
  All EU/UK prices include VAT.
- **[E]** Purchasing power: BR and MX prices about 1/4 to 1/3 of US prices in USD terms fit local willingness to pay. Incumbents charge almost US-level BRL prices (R$49.70 ≈ US$9.20 per 4 weeks, roughly a third of the US price).
- **[E]** In BR, a product without Pix should expect to lose a large share of buyers. In DE, offer PayPal (Paddle and most MoRs support PayPal).

### Gaps
- World Bank/IMF PPP figures were not retrieved this session.
- No verified France or Spain payment-mix data; the search returned none.
- No official Banxico share data.

## 3. Actual CPC vs top-of-page estimates, Quality Score, and BOLD's bidding

### Takeaway
Google defines the top-of-page bid as the bid you probably need to appear in the top ads. It is not what you pay, and it depends on Quality Score and competition. No source gives a reliable ratio. The modelling uses roughly 60–80% of the range midpoint as the realistic average CPC **[E]**. BOLD-family brands dominate US resume paid search, which raises entry CPCs and depresses Quality Score through the advertisers' landing-page advantage.

### Cited Findings
- Top-of-page bid estimate means "the bid you likely need to set for your ad to be shown among top ads on the first page". It is based on Quality Score and current competition. **[V]** — [Google Ads Help 2472742](https://support.google.com/google-ads/answer/2472742)
- An agency analysis argues that these estimates are inaccurate because position depends on Quality Score, budget and competition (older post). **[V]** — [Browser Media](https://browsermedia.agency/blog/googles-top-of-page-bid-estimates-how-accurate-are-they/)
- A federal antitrust complaint (filed 2 April, California, citing Rocket Resume) alleges that many resume-builder brands trace back to BOLD, with about 80% market share and about US$750M/yr. These figures come from a newsletter, not the filing itself. **[V, secondary]** — [The Recruiting Life](https://jimstroud.beehiiv.com/p/draft-you-thought-you-had-resume-options-a-new-antitrust-lawsuit-says-the-choice-was-bold-bold-or-bo)
- BOLD reportedly owns LiveCareer, MyPerfectResume, Zety, Resume Now and others (claim from a competitor). **[V, biased source]** — [Sheets Resume](https://sheetsresume.com/blog/resume-builders-owned-by-bold)
- Adthena: myperfectresume.com had 5.38% of clicks among US HR-category advertisers (June 2025), with resume-now.com, resume.co and resumegenius.com also in the top 10. **[V, third-party]** — [Adthena](https://www.adthena.com/market-share/us-services-2-hr/)

### Inferences
- **[E]** Assumed realistic average CPC (USD):

| Market | Assumed CPC | Basis |
|---|---|---|
| US | ~US$4.50 | "resume builder" range R$19.9–49 → mid R$34.5 ≈ US$6.4, × ~0.7 |
| UK | ~US$2.50 (R$13.5) | blend of "cv maker" and "cv template" |
| DE | ~US$2.41 (R$13) | |
| FR | ~US$2.41 (R$13) | |
| ES | ~US$1.30 (R$7) | |
| MX | ~US$0.37 (R$2) | |
| BR | ~US$0.22 (R$1.20) | |

- **[E]** Several brands from one owner can each hold ad slots on the same query, so new entrants face multiple deep-pocketed bidders. Those bidders' LTV comes from auto-renew subscriptions and is roughly 2–3× a one-time price, so they can outbid a one-time-price product.
- **[K]** Quality Score (1–10) is based on expected CTR, ad relevance and landing-page experience. A new account starts with no CTR history, so first-month CPCs often run above steady-state.

### Gaps
- No published dataset of actual CPC as a share of the top-of-page estimate. The only reliable source is a small live test campaign of about R$300–500 per market.

## 4. Payment and tax infrastructure for a Brazil-resident owner

### Takeaway
To sell abroad, a merchant of record (Paddle, or Lemon Squeezy, both about 5% + US$0.50) is the low-risk path. It collects and remits VAT and US sales tax and pays out to Brazil. Stripe Brazil accounts restrict cross-border activity. For Brazil itself, a domestic gateway (Asaas, or Mercado Pago with Pix at low or zero cost) is far cheaper than any MoR.

### Cited Findings
- Paddle: 5% + 50¢ per transaction, all-inclusive, no monthly fee. **[V, secondary]** — [rework](https://resources.rework.com/tools/billing-revenue/paddle-vs-lemon-squeezy); [dodopayments](https://dodopayments.com/blogs/paddle-vs-lemon-squeezy/)
- Lemon Squeezy: 5% + 50¢, plus 1.5% on international transactions; one source adds +0.5% on subscriptions. Stripe acquired it in July 2024, and reports of restricted sign-ups in 2026 are unconfirmed. **[V, competitor-authored]** — [dodopayments](https://dodopayments.com/blogs/lemonsqueezy-review)
- Stripe Brazil accounts: cross-border payments and FX activity are restricted and can be declined. The exception is Visa and Mastercard cards issued outside Brazil. **[V]** — [Stripe Support](https://support.stripe.com/questions/transaction-declined-stripe-brazil-accounts)
- Stripe Brazil local card rate is cited as 3.99% + R$0.39, plus 2% when currency conversion applies. This is not verified against Stripe's own page, which failed to load. **[V, third-party]** — [Studio Ninja table](https://help.studioninja.co/en/articles/10269673-stripe-fees-in-different-countries)
- Stripe added Pix through EBANX. **[V]** — [Payments Journal](https://www.paymentsjournal.com/stripe-adds-pix-payments-through-ebanx-integration/)
- Asaas official prices: Pix R$1.99 per received transaction (R$0.99 promotional for 3 months); credit card R$0.49 + 2.99% (single payment); no monthly fee (checked 16 Oct 2026). **[V]** — [Asaas preços](https://www.asaas.com:443/precos-e-taxas)
- Mercado Pago: Pix listed as free, credit card from 3.08%, according to a third-party comparator (Jul 2026). **[V, third-party]** — [calculadoradetaxas](https://www.calculadoradetaxas.com.br/mercado-pago/taxas)

### Inferences
- **[E]** Fee on a typical ticket:

| Sale | Route | Fee | Effective rate |
|---|---|---|---|
| US$25 | Paddle | 1.25 + 0.50 = US$1.75 | 7.0% |
| US$15 | Paddle | US$1.25 | 8.3% |
| R$29.90 | Asaas Pix | R$1.99 | 6.7% |
| R$29.90 | Mercado Pago Pix | ~R$0 | ~0% |
| R$29.90 | Asaas card | 0.49 + 0.89 = R$1.38 | 4.6% |

- **[K]** MoR VAT handling: prices shown to EU and UK consumers must include VAT (DE 19%, FR 20%, ES 21%, UK 20%; MX IVA 16%). The MoR remits it, so net revenue is price / (1 + VAT) before the MoR fee. In the US, the MoR handles state sales tax on SaaS where it applies.
- **[K]** Brazil-side taxes: an exporter of services typically gets ISS and PIS/COFINS exemptions when the result occurs abroad. Income is still taxed under the company's regime: Simples Nacional Anexo III starts at about 6%, and Anexo V at about 15.5% if the "fator R" is below 28%. **The owner should confirm the CNAE and regime with a contador.** MoR payouts arrive as a USD wire or via Payoneer. Expect about 1–2% FX spread plus the receiving bank's fees, and a "contrato de câmbio" via the bank.
- **[E]** Modelled cost stack: about 6% BR tax on all revenue, MoR 5% + US$0.50 abroad, Pix about 1% domestically, plus 1.5% FX.

### Gaps
- Stripe Brazil's official pricing page could not be fetched.
- Polar's current fees not verified **[K: about 4% + 40¢ in 2025]**.
- Paddle's payout fees to Brazil not verified.

## 5. AI cost per resume and hosting

### Takeaway
LLM cost is negligible: about US$0.03 per complete resume on Gemini 2.5 Flash or GPT-4.1 mini class models. Even after paying for free users who never convert, it stays below US$1 per sale. Ad spend, not AI, determines unit economics.

### Cited Findings
- Gemini 2.5 Flash: US$0.30 per 1M input tokens, US$2.50 per 1M output tokens (cached input about US$0.03/M), as of Aug 2026. **[V, third-party tracker]** — [anotherwrapper](https://anotherwrapper.com/llm-pricing/gemini-2.5-flash)
- GPT-4.1 mini: US$0.40 per 1M input, US$1.60 per 1M output. **[V, single third-party source]** — [aicostcheck](https://aicostcheck.com/compare/gemini-2-5-flash-vs-gpt-4-1-mini)
- An indie resume builder ran on about US$30/mo hosting plus US$40/mo email. **[V]** — [IndieHackers Resume Beacon](https://www.indiehackers.com/interview/a0e1922fcb)

### Inferences
- **[E]** Tokens per resume session: 5 generations (summary, bullets, tailoring to a job ad, ATS check, cover letter), about 5k input and 2k output each, for 25k input and 10k output in total.
  - Gemini 2.5 Flash: 25k × 0.30/1M + 10k × 2.50/1M = 0.0075 + 0.025 = **US$0.033**
  - GPT-4.1 mini: 0.010 + 0.016 = **US$0.026**
  - **[K]** A frontier model at about US$3/US$15 per M: 0.075 + 0.15 = about US$0.23
- **[E]** Free users who never pay: at about 20–30 AI sessions per sale, the cheap-model cost is about US$0.66–1.00 per sale. The model uses US$0.70 per sale.
- **[E]** Fixed costs: about US$30–80/mo for hosting, database and email at launch. This is immaterial against a US$200/day target.

### Gaps
- Official OpenAI and Google pricing pages were not fetched. Confirm current rates there.

## 6. Unit economics per market

### Takeaway
On base assumptions (5% click→paid, realistic CPC, one-time price), **every market loses money on Google Search head terms**. Breakeven conversion is:
- **US, UK, DE, FR, ES: about 9–12%**. No public resume-builder evidence supports that, so these are not viable with a one-off price against BOLD-level bidding. The US becomes viable only with a subscription LTV of about US$70 and about 7% conversion.
- **BR and MX: about 5.5–7%**. Low CPCs are disproportionately cheap relative to price. They become positive only at the optimistic 8% conversion, and even then **BR is the only market whose addressable volume approaches US$200/day of profit** (about US$340/day at 8%, which requires 156 sales/day).

### Assumptions [E]
- Clicks/day = monthly searches / 30 × 25% (the brief's capture assumption; very optimistic for head terms).
- Net per sale = price ex-VAT − payment fee − taxes/FX − US$0.70 AI.

| Market | Terms counted (searches/mo) | CPC (US$) | Price (local) | Net per sale (US$) |
|---|---|---|---|---|
| BR | curriculo + fazer currículo = 401k | 0.22 (R$1.20) | R$29.90 | 4.06 |
| MX | curriculum vitae = 246k | 0.37 (R$2.00) | MXN 149 incl. IVA | 5.36 |
| ES | curriculum vitae = 74k | 1.30 (R$7) | €14.90 incl. VAT | 11.40 |
| DE | lebenslauf erstellen = 49.5k | 2.41 (R$13) | €29 incl. VAT | 25.60 |
| FR | cv en ligne = 12.1k | 2.41 (R$13) | €24.90 incl. VAT | 20.10 |
| UK | cv maker + cv template = 123.6k | 2.50 (R$13.5) | £25 incl. VAT | 23.90 |
| US | resume builder + ai resume builder + ats checker = 407k | 4.50 (R$24) | US$40 ARPPU | 36.50 |

How the net per sale is built:
- **BR:** R$29.90 − Pix about 1% − tax 6% − FX 0 → about R$27.5, × (1 − 0.06 tax) → R$25.7 ≈ US$4.76, − 0.70 AI = **US$4.06**
- **MX:** MXN 149 / 1.16 = 128.4 → US$6.94 − (5% + 0.50) MoR = 6.09; − 1.5% FX − 6% tax ≈ 5.6 (rounded down to 6.06 before AI in the script, a slight overstatement) − 0.70 = **US$5.36**
- **ES:** 14.90 / 1.21 = €12.31 = US$13.30 − MoR US$1.17 = 12.1 − 0.70 = **11.40**
- **DE:** 29 / 1.19 = €24.37 = US$26.3 → after MoR, tax and FX about 26.3 (simplified) − 0.70 = **25.60**
- **FR:** 24.90 / 1.20 = €20.75 = US$22.4 − MoR 1.62 = 20.8 − 0.70 = **20.10**
- **UK:** 25 / 1.20 = £20.83 = US$26.5 − MoR 1.82 = 24.6 − 0.70 = **23.90**
- **US:** 40 − 2.50 MoR − 0.70 = about 36.8 → **36.50** (rounded)

Simplification note: the EU/UK/US lines do not deduct the BR income tax (about 6%) or FX (about 1.5%). Including them lowers net by about 7.5% and makes those markets worse still.

### Results
CAC = CPC / conversion; contribution = net − CAC; profit/day = sales/day × contribution.

| Market | Breakeven conv. | Clicks/day | @3%: CAC / contrib. / profit per day | @5%: CAC / contrib. / profit per day | @8%: CAC / contrib. / profit per day | Sales/day needed for US$200 profit (@8%) | Max sales/day @8% |
|---|---|---|---|---|---|---|---|
| BR | 5.5% | 3,343 | 7.41 / −3.35 / −336 | 4.44 / −0.39 / −64 | 2.78 / +1.28 / **+343** | 156 | 267 |
| MX | 6.9% | 2,050 | 12.35 / −6.99 / −430 | 7.41 / −2.05 / −210 | 4.63 / +0.73 / **+120** | 274 (exceeds the 164 max) | 164 |
| ES | 11.4% | 617 | 43.2 / −31.8 / −588 | 25.9 / −14.5 / −448 | 16.2 / −4.8 / −237 | n/a | 49 |
| DE | 9.4% | 412 | 80.3 / −54.7 / −676 | 48.2 / −22.6 / −465 | 30.1 / −4.5 / −148 | n/a | 33 |
| FR | 12.0% | 101 | 80.3 / −60.2 / −182 | 48.2 / −28.1 / −141 | 30.1 / −10.0 / −81 | n/a | 8 |
| UK | 10.5% | 1,030 | 83.3 / −59.4 / −1,836 | 50.0 / −26.1 / −1,344 | 31.3 / −7.4 / −606 | n/a | 82 |
| US | 12.3% | 3,393 | 150 / −113.5 / −11,554 | 90 / −53.5 / −9,077 | 56.3 / −19.8 / −5,361 | n/a | 271 |

Sensitivity [E]:
- **US with BOLD-style subscription LTV of about US$70** (trial plus about 2 rebills): net is about US$65, so breakeven conversion = 4.5 / 65 = **6.9%**. That is plausible only with a strong trial funnel, and it carries the chargeback and complaint risk described in section 1.
- **US long tail ("ats resume checker", 12.1k/mo, CPC about US$1.50–2):**
  - Breakeven = 1.75 / 36.5 = 4.8%.
  - At 6%: CAC US$29, contribution +US$7.3 per sale.
  - Volume: 12.1k / 30 × 25% ≈ 100 clicks/day → 6 sales/day → about **US$44/day**.
  - A portfolio of such long-tail US terms is the most plausible US entry.
- **BR at the low end of the bid range (CPC R$0.80 ≈ US$0.15):** breakeven = 0.15 / 4.06 = 3.7%. At 5% conversion, contribution is +US$1.10 per sale; × 167 sales/day ≈ **US$185/day**. **BR is very sensitive to CPC and conversion.** Raising the price to R$39.90 (net about US$5.90) moves breakeven at R$1.20 CPC to 3.8%.
- **What is needed for US$200/day in each market at its own assumed CPC:**
  - BR at 8%: 156 sales/day, about 58% of the theoretical maximum.
  - MX at 8%: 274 sales/day, above the maximum of 164, so not reachable.
  - EU, UK and US: negative contribution, so no sales volume reaches the target.

### Inferences
- **[E]** Ranking by economics: **BR ≥ MX >> ES > DE ≈ UK > FR ≈ US** for a one-time-price product on Google Search.
- **[E]** The US has the largest gross opportunity, but it requires a subscription model and accepting BOLD's playbook.
- **[E]** Brazil has two structural advantages:
  - The owner's home market: Pix, no FX, no MoR fee, native language.
  - CPCs at about 1/20 of US CPCs, while local willingness to pay is about 1/5–1/8 of US levels.
- **[E]** The 25% click-capture assumption is likely too high for head terms. Real ad CTR across all ad slots plus organic results usually means one advertiser captures well under 10% of searches. Realistic maximum volumes are probably 1/3 to 1/2 of the table values, which leaves BR at roughly US$100–170/day best case. Reaching US$200/day likely requires BR plus PT-adjacent and long-tail terms ("currículo com IA", "currículo para primeiro emprego", "modelo de currículo pdf"), or BR plus MX.
- **[E]** Recommended validation: R$300–500 test per market (BR first, then MX, then a US long-tail ATS-checker test) to measure real CPC and click→paid before committing.

### Gaps
- All conversion rates are assumptions; no public resume-builder benchmark exists.
- Real CPCs need a live test.
- MX net uses a slightly generous rounding (about +US$0.40). The MX conclusion does not change.

## 7. Seasonality and language/support feasibility

### Takeaway
Job-search demand is seasonal (peaks in January and early autumn, troughs in December). None of this was verified from a source this session, so check Google Trends per keyword. Spanish markets (MX, ES) are the easiest second language for a Portuguese speaker. Germany and France add stricter legal and consumer-protection obligations.

### Cited Findings
- No source for resume-search seasonality was retrieved. **[K]** General pattern: January–March peak (new-year job hunting) and a September peak in the northern hemisphere; troughs in late December and in July–August in Europe. Brazil usually peaks January–March after the holidays and the 13º salário, with a secondary dip in December.
- Mexico: 78% of e-commerce purchases are made on mobile (PCMI 2025), so a mobile-first builder and PDF flow is required. **[V]** — [Nuvei](https://www.nuvei.com/posts/mexico-e-commerce-unlock-payment-performance-with-local-acquiring-oxxo-pay-spei-and-installments)

### Inferences
- **[E]** Language feasibility for a PT speaker using AI:
  - PT-BR: native.
  - ES (MX/ES): high, close language; AI translation plus light review is fine.
  - EN (US/UK): high.
  - FR/DE: medium. Support can be AI-drafted, but legal pages (DE Impressum, GDPR/DSGVO, FR language and consumer rules, the **[K]** EU 14-day withdrawal right for digital content unless explicitly waived at checkout) need a native or legal check.
- **[E]** Resume conventions differ by market (DE Lebenslauf with photo and signature, UK 2-page CV, US 1-page resume, BR currículo with "objetivo"). AI templates must be localised, which is a real but manageable effort.
- **[E]** Support load is driven mainly by billing disputes (renewals, refunds). A one-time-pass model minimises support in every language.

### Gaps
- No Google Trends data was pulled. Run Trends for "currículo", "resume builder", "lebenslauf erstellen", "curriculum vitae" (MX/ES) and "cv maker" (UK) to confirm peak months before timing a launch.
