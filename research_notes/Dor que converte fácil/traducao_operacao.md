# Operating an online certified translation service (PT→EN for USCIS, extendable to ES→EN) with minimal owner involvement — 2026

Research date: 2026-10-26. Labels used: **[VERIFIED]** = supported by a source found in this session (often a vendor page or a third-party summary, read via search results; note that direct fetches of uscis.gov, ecfr.gov, proof.com and rapidtranslate.org failed with DNS errors in this environment, so primary pages were NOT read in full). **[ESTIMATE]** = my inference or calculation, not from a source.

## 1. Workflow and AI: pre-translation + human post-editing + certification; legal limits

### Takeaway
USCIS needs a complete English translation plus a signed statement from a translator saying they are competent in both languages and the translation is complete and accurate (8 CFR 103.2(b)(3)). It does not require notarization or a sworn/ATA translator. So the model that works is: OCR, then an AI draft from a template, then a human translator reviews it, signs and takes responsibility, then a QA checklist, then the PDF is delivered. The certification must name a real human translator. It cannot be the AI, and it should not be the customer or a relative.

### Cited Findings
- 8 CFR 103.2(b)(3) requires that any foreign-language document come with a full English translation that the translator has certified as complete and accurate, plus the translator's certification that they are competent to translate from the foreign language into English. Vendors and forums repeat this consistently. — [ProZ forum: Translation Certification as per USCIS 8 CFR 103.2(b)(3)](https://bel.proz.com/forum/translation_in_the_us/345940-translation_certification_as_per_uscis_8_cfr_1032b3.html); [immihelp: What is a Certified Translation for USCIS](https://www.immihelp.com/what-is-a-certified-translation-for-uscis); [Trusted Translations guide](https://www.trustedtranslations.com/blog/certified-translations-for-uscis-forms)
- Notarization is not required by USCIS. A signed accuracy certificate from the translator is enough. — [Carolina Translation Center blog 2026](https://blog.translation.center/2026/01); [Translayte PT: Requisito de Tradução do USCIS 2026](https://translayte.com/pt/blogue/uscis-requisito-de-traducao)
- Self-translation: sources disagree. Some say the regulation does not explicitly ban it, but USCIS discourages applicants or close family certifying their own documents. — [immihelp](https://www.immihelp.com/what-is-a-certified-translation-for-uscis); [Rapid Translate resources](https://www.rapidtranslate.org/resources/uscis-translation-requirements)
- A ProZ forum translator reported cases where notaries notarized the translation *instead of* the translator certifying it, which led to problems. This is anecdotal. The point is that the certification, not a notary seal, is what matters. — [ProZ forum](https://files.proz.com/forum/translation_in_the_us/345940-translation_certification_as_per_uscis_8_cfr_1032b3.html)
- In September 2025, examiners were described as comparing the translation against the original side by side, and issuing an RFE if anything looks condensed or "off". In practice that means stamps, marginal notes (averbações), seals and handwritten parts must all be translated. — [Resident.com USCIS Translation Requirements 2025](https://resident.com/resource-guide/2025/09/26/uscis-translation-requirements-2025-update-what-you-need-to-know)
- **Unverified 2026 claim:** a MotaWord blog says USCIS Policy Alert PA-2026-05 (effective Aug 5, 2026) lets officers deny cases without an RFE or NOID. The Language Doctors say USCIS has announced outright rejections for translation errors. I found no primary USCIS confirmation. — [MotaWord blog](https://aila.motaword.com/blog/uscis-deny-without-rfe-certified-translation-accuracy); [The Language Doctors](https://thelanguagedoctors.org/avoid-uscis-rejections-translation-errors)
- In the industry, MTPE (machine translation + post-editing) adoption rose from 26% (2022) to about 46% (2024). — [Nimdzi: The MTPE efficiency gap](https://www.nimdzi.com/the-mtpe-efficiency-gap/)
- AI pre-translation costs almost nothing. DeepL API Pro has been listed at a $5.49/month base fee plus $25 per million characters (G2, updated Jan 2026). A 2026 comparison says API Free and Pro closed to new signups in mid-2026, replaced by "Growth" at about $32.50/month plus about $27.50 per extra million characters. These sources conflict, so check deepl.com. — [G2 DeepL API pricing](https://www.g2.com/products/deepl-api/pricing); [SimpleLocalize 2026 cost comparison](https://simplelocalize.io/blog/posts/ai-machine-translation-cost-comparison/)

### Inferences
- **[ESTIMATE] Recommended delivery pipeline (standardized, low-touch):**
  1. Customer uploads a file, picks the document type, and enters names exactly as they appear in the passport (this field cuts down on revisions).
  2. OCR + layout extraction (Google Document AI / AWS Textract / Azure Document Intelligence, or a vision LLM like GPT/Claude reading the image directly). Old handwritten or typewritten certidões (livro/folha/termo) need a vision LLM plus a human check. Classic OCR does badly on these.
  3. The doc-type classifier picks a **template** (DOCX/HTML that mirrors the layout). The LLM fills the fields: names are never translated, dates go to "Month DD, YYYY" with the original kept as needed, and a glossary covers cartório terms ("Oficial de Registro Civil das Pessoas Naturais" → "Civil Registry Officer of Natural Persons", "averbação" → "annotation/endorsement", "[illegible]", "[seal]", "[signature]").
  4. A Brazilian translator post-edits in a side-by-side view (original image | draft), fixes errors, and confirms that every stamp, QR code, matrícula number and averbação is covered.
  5. Automated QA: numbers and dates match the source, names match the passport field, no untranslated Portuguese is left, all pages are accounted for. A second LLM pass can flag mismatches as a "checker", but it does not certify.
  6. The certification page is generated with the translator's name, signature (image or e-signature), date, a statement of competence and accuracy, and an order ID. The PDF is merged (source copy + translation + certificate) and delivered by email or a link.
- **[ESTIMATE] Template library for Brazilian docs** (the 80/20 of volume): certidão de nascimento (new national model with matrícula, 2010+, and old handwritten/typewritten book-based ones); casamento (with or without averbação de divórcio); óbito; RG (old state model and the new CIN national ID); CNH (physical and digital CNH-e); CTPS (physical booklet pages and Carteira de Trabalho Digital); diploma and histórico escolar (very variable, so price per page/word, not flat); antecedentes criminais (Polícia Federal / state SSP certificates, which are short and standard); certidão de divórcio/averbação; escritura/sentença (variable, quote by word). Each template needs: field map, glossary, layout skeleton, and known pitfalls (for example, the matrícula number must be copied exactly).
- **Ethical/legal limits [ESTIMATE, not legal advice]:** The signer must actually be competent and must actually review the full document. Customers must not be told that "AI translated" anything is "certified" without a human. The business should not claim "ATA-certified" or "sworn" unless that is true. A "USCIS acceptance guarantee" should be framed as a revision or refund guarantee, never as a promise about the immigration outcome. Liability: use a translator contract with an indemnity/quality clause, keep business E&O (professional liability) insurance, and cap liability at the order price in the Terms. The certifying translator is personally attesting, so they will want a clear scope (they are certifying the translation, not that the document is authentic).

### Gaps
- Could not fetch the USCIS Policy Manual or eCFR text directly (DNS failure), so the regulation wording is taken from secondary sources.
- PA-2026-05 (denials without an RFE) is unconfirmed. Check the USCIS policy alerts page.
- No benchmark data found on OCR accuracy for handwritten Brazilian certidões.

## 2. Translator sourcing, rates, turnaround, vetting

### Takeaway
Self-listed PT↔EN rates on ProZ cluster around US$0.04–0.12/word. Common practitioner guidance puts full post-editing at about 50–70% of the full rate. A Brazilian translator post-editing a templated certidão could plausibly be paid US$5–15 per document-page [ESTIMATE]. Tradutores públicos (sworn) are a premium tier that USCIS does not need.

### Cited Findings
- ProZ self-listed rates: PT→EN US$0.05–0.09/word (one profile), 0.06–0.09 (another), 0.10–0.12 (an active translator), 0.12 standard (an established translator); in euros, PT→EN €0.09/word or €35/hour. Low end is US$0.02–0.05. These are individual listings, not a survey. — [ProZ profile 3263692](https://www.proz.com/profile/3263692); [ProZ profile 82619](https://www.proz.com/profile/82619); [ProZ profile 97476](https://www.proz.com/profile/97476); [ProZ profile 2327386](https://www.proz.com/profile/2327386?print=1)
- MTPE pricing benchmark: light post-editing is about 40–50% of the full per-word rate and full post-editing about 50–70% (practitioner blog, 2026, not a survey). Older ProZ forum posts cite 60–75%, and agencies paying US$0.04–0.05/word for full PEMT. — [ICS Translate: MTPE in 2026](https://www.ics-translate.com/blog/mtpe-in-2026-when-it-works-when-it-doesnt-and-what-it-costs); [ProZ forum: rates of MT and post-editing](https://www2.proz.com/forum/post_editing_machine_translation/354268-rates_of_mt_and_post_editing.html)
- GTS Translation ran a 2025 survey of freelancers (3,300 invited, 212 responses) that covered MTPE pricing, but its figures were not visible. — [tcworld: The state of MTPE](https://www.tcworld.info/news/the-state-of-machine-translation-post-editing)
- The ATA compensation survey (run with Dynamic Benchmarking) exists, but no current per-word figures were publicly available. The most detailed public summary uses 2014 data. — [ATA compensation survey](https://www.atanet.org/business-strategies/ata-compensation-survey/); [ATA survey summary](https://www.atanet.org/resources/summary-of-the-ata-translation-and-interpreting-services-survey/)
- Brazilian sworn translation (tradução juramentada) retail is commonly R$50–70 per page, with documents R$60–180 (price comparison site). — [Cronoshare: quanto custa tradução juramentada](https://www.cronoshare.com.br/quanto-custa/traducao-juramentada)
- Brazilian court fee tables in 2025 (a reference floor for legal translation in Brazil): TJAC pays R$57.43 per lauda (1,100 characters with spaces) for common-text translation into Portuguese and R$62.65 for versão (out of Portuguese). — [TJAC Portaria 2624/2025](https://webdev.tjac.jus.br/wp-content/uploads/2025/06/Portaria_PRESI_TJAC_2624_2025.pdf)
- US retail competitors: Rapid Translate US$27.99/page, RushTranslate US$24.95, Translayte from US$24.99, Universal Translation US$20. Typical USCIS range is US$25–40 per page (about 250 words). — [Translayte PT 2026](https://translayte.com/pt/blogue/uscis-requisito-de-traducao); [Rapid Translate birth certificate page](https://www.rapidtranslate.org/birth-certificate-translation); [Carolina Translation Center 2026](https://blog.translation.center/2026/01)
- US freelancers may quote US$50–150+ for a single certificate. — [Translayte: cost to translate a birth certificate](https://translayte.com/blog/how-much-does-it-cost-to-translate-a-birth-certificate)

### Inferences
- **[ESTIMATE] Pay model:** pay per *template document* (flat rate) rather than per word. For example, US$6–10 per templated certidão/RG/CNH page post-edit and certify, and US$0.04–0.06/source word for free-form documents (diplomas, históricos, sentenças). A templated certidão takes an experienced translator about 10–20 minutes, which works out to roughly US$25–40/hour equivalent. That rate is attractive in Brazil.
- **[ESTIMATE] Sourcing:** ProZ job board (filter PT>EN, legal/certificates), Upwork, ABRATES member directory, LinkedIn, and Brazilian Facebook/Telegram translator groups. Keep a pool of 3–5 translators to cover 24h SLA and vacations. Use 1–2 US-based or ATA-certified PT>EN translators as a premium/backup signer (in case some customers or offices want a US-resident signer). Tradutor público juramentado is an upsell only for Brazilian-destination docs (EN→PT), not for USCIS.
- **[ESTIMATE] Vetting:** paid test (US$20–30) using 3 real anonymized docs: an old handwritten certidão with an averbação, a CNH, and a histórico. Score against a rubric (omissions, names/dates, stamps translated, formatting, use of the "[illegible]" convention). After that, spot-check their first 20 orders, then 10% random QA. ATA certification is optional. It is a quality signal but not required by USCIS.
- **Turnaround [ESTIMATE]:** with templates, 24h standard / 12h rush is realistic for 1–3 page orders if the pool covers the BRT and US time zones.

### Gaps
- No current ABRATES rate table (published table/survey) was found. ABRATES does not appear to publish an official table publicly. Sintra (São Paulo translators' union) historically publishes a reference table, but no 2025/2026 figures were retrieved.
- No direct data on Upwork rates for PT→EN certificate work.
- No 2025–2026 survey percentage for MTPE rates (the GTS figures were not visible).

## 3. Order platform: upload + instant quote + payment + delivery; notarization

### Takeaway
A low-cost stack can run on a Shopify or WooCommerce store with a file-upload/page-count app, or a custom form (Tally/Typeform + Stripe Checkout), with orders sent to a small TMS (Protemos ~US$50–90/month) or a Trello/Airtable board. Pricing per document type (flat) plus per-page for free-form docs makes instant quotes simple. Notarization via Proof costs about US$25 per notarization.

### Cited Findings
- Shopify **Upload Center (Quaflow)** can calculate dynamic price from PDF page count. Plans start at US$9/month (or US$90/year), and custom PDF price calculations are on higher tiers. **Shopaw File Upload** has a free plan (US$0.02 per upload, up to a US$100 cap) or US$6.99/month. **UploadsPro** adds upload fees. — [Shopify App Store: Upload Center](https://apps.shopify.com/upload-center); [Shopaw File Upload](https://apps.shopify.com/shopaw-file-upload?locale=it); [UploadsPro](https://apps.shopify.com/uploads-pro?locale=tr)
- Protemos (TMS/business management for agencies): US$90/month (monthly), US$70/month (6-month), US$50/month (annual), per user/manager. There is a free tier for freelancers per Capterra (SaaSworthy says no free plan; its data is from 2020). — [Capterra UK: Protemos](https://www.capterra.co.uk/software/172883/protemos); [SaaSworthy: Protemos pricing](https://www.saasworthy.com/product/protemos/pricing)
- Page rule: providers commonly define a page as up to 250 words, so a dense two-sided certificate may bill as 2–3 pages. Some sell a flat "one document" price, for example US$54 for a birth/marriage certificate front+back with USCIS certification. — [Carolina Translation Center blog](https://blog.translation.center/search/label/Certified%20Translation%20Prices); [Sespanish 2026 prices](https://www.sespanish.com/translation-price/amp/)
- Proof (formerly Notarize) support page, per search summary: US$25 for the first notary seal, US$15 per additional seal, US$10 per on-demand witness, US$10 per additional signer. A third-party review of the Business Pro plan lists US$25 per meeting, US$10 per extra seal, US$5 per extra signer, US$4 ID verification per signer, and no monthly fee. — [Proof support: How much does notarization cost](https://support.proof.com/hc/en-us/articles/22372310048919); [FrontDeskReview: Proof pricing 2026](https://frontdeskreview.com/software/notary-software/proof/)
- Notarization is not required by USCIS, so it is an optional upsell. — [Carolina Translation Center 2026](https://blog.translation.center/2026/01)

### Inferences
- **[ESTIMATE] Recommended low-touch stack:**
  - *Front-end + checkout:* Shopify (Basic) with "products" per document type (Birth certificate – US$X flat; Marriage; RG; CNH; Diploma per page). Use Upload Center or a similar app, plus Stripe/Shopify Payments. Alternative: a Webflow/Framer landing page with a Tally form (file upload) and Stripe Payment Link, joined with Zapier/Make.
  - *Instant quote:* flat price per standard doc type (removes word-counting friction). For "other documents" use PDF page count × price, or OCR word count / 250 run automatically by a script (Make + an OCR API) and email a Stripe link.
  - *Order engine:* the paid order webhook creates a job (Airtable/Notion or Protemos). An automation runs OCR + LLM draft into a Google Doc/DOCX from the template, assigns it to the translator queue, the translator marks it done, auto-QA runs, the certificate PDF is generated (e.g., PDFMonkey/DocuSeal/Google Docs template), it is emailed to the customer, and a review request goes out.
  - *Full TMS (Plunet, XTRF, Smartcat):* overkill for this volume. Plunet/XTRF are enterprise, quote-based tools. Smartcat has a marketplace + MT and could act as the CAT layer. Pricing was not verified this session.
  - *Notarization upsell:* the translator signs the certificate in a Proof session (about US$25). Sell it at US$35–50. Deliver an e-notarized PDF. Some customers want this for non-USCIS purposes (schools, courts, DMV).

### Gaps
- Plunet, XTRF and Smartcat 2026 pricing was not retrieved.
- No Shopify app was found that is built specifically for translation quotes. A WooCommerce quote plugin was not researched.
- The Proof figures come from a search summary (direct fetch failed). Whether e-notarized translation certificates are accepted for each non-USCIS use is not verified.

## 4. Customer support automation, revision/refund policy, chargebacks

### Takeaway
Market leaders offer free revisions plus a "USCIS acceptance" refund guarantee tied to translation errors, with a 30-day revision window. Most support questions can be answered ahead of time in the order flow and an FAQ bot.

### Cited Findings
- Rapid Translate: full refund if USCIS rejects because of a translation error. The process is free revisions first, then a refund if the issue is unresolved. Revisions must be requested within 30 days of delivery. Refunds cover USCIS rejection for translation error, quality shortfalls, or late delivery. Cancellations before work starts get a full refund. Once work has started, refunds are partial. — [Rapid Translate refund guarantee policy](https://www.rapidtranslate.org/refund-guarantee-policy); [Rapid Translate: USCIS acceptance guarantee](https://devserver1.rapidtranslate.org/help-center/translation-services-and-addons/uscis-acceptance-guarantee)
- Translayte: if a translation is rejected, it takes responsibility, then revises and resubmits. No explicit refund commitment was found in the excerpt. — [Translayte USCIS](https://translayte.com/certified-translations/uscis)

### Inferences
- **[ESTIMATE] Top customer questions** (to answer in the FAQ/bot and in-flow): "Is it accepted by USCIS?" (yes, certified per 8 CFR 103.2(b)(3); notarization not needed); "Do I need notarization/sworn?"; "How do you spell names/accents?" (we follow the passport; enter names at checkout); "Do you translate the back, stamps, averbações?" (yes, everything); "How is a page counted?"; "Turnaround/rush?"; "Do I need the original/mailing?" (no, a digital PDF; print it to file); "Can you correct X?" (free revisions); "Is my data safe?"; "Spanish?"; "Invoice/receipt?".
- **[ESTIMATE] Bot stack:** WhatsApp Business API via a BSP (e.g., Twilio, 360dialog, or WATI/Respond.io-type tools) plus an LLM agent grounded on the FAQ and order-status lookup. Email through Help Scout/Freshdesk/Gmail + an AI auto-draft. Escalate to a human for refunds, translation disputes and anything about legal or immigration advice (the bot must refuse immigration advice).
- **[ESTIMATE] Chargeback reduction:** a clear descriptor on card statements; a checkbox to accept terms (scope, page count, revision policy); a confirmation email with the order summary; delivery proof (download logs); a draft-preview option for name check before final; fast refund handling. Stripe Radar plus 3DS on high-risk payments. Keep evidence packs (order, upload, delivery email, download log) for disputes.
- **[ESTIMATE] Policy:** unlimited free corrections of translator errors within 30 days. Customer-caused changes (names spelled differently than the source) are free once. Full refund if USCIS rejects for a translation defect (very rare if QA is done). No refund once delivered for reasons outside translation quality.

### Gaps
- No data found on chargeback rates in the translation industry.
- No published statistics on the distribution of support questions for this niche. The question list above is inferred.

## 5. Privacy/security for PII; translator NDA; US state obligations

### Takeaway
Documents contain high-sensitivity PII (IDs, CPF, birth data, sometimes criminal records). A small business is likely exempt from most comprehensive state privacy laws, but state breach-notification laws apply regardless of size. Brazil's LGPD applies to a Brazil-based operator. Minimize retention, encrypt, use NDAs, and give translators least-privilege access.

### Cited Findings
- Texas TDPSA has no revenue or volume threshold. It covers businesses that are *not* small businesses as defined by the SBA, but even small businesses must get consent before selling sensitive data. — [Thompson Hine](https://www.thompsonhine.com/insights/texas-enacts-privacy-law-amends-data-breach-notification-law/); [Locke Lord](https://www.lockelord.com/newsandevents/publications/2024/04/texas-data-privacy-security-act)
- Texas breach law (Tex. Bus. & Com. Code §§ 521.002, 521.053) was amended to require notice to the Texas AG within 30 days of discovering a breach (effective Sept 1, 2023), through an electronic form. — [Thompson Hine](https://www.thompsonhine.com/insights/texas-enacts-privacy-law-amends-data-breach-notification-law/); [Mintz](https://www.mintz.com/insights-center/viewpoints/2826/2023-07-07-texas-has-been-busy-ramping-privacy-protections-new)

### Inferences
- **[ESTIMATE] Applicability:** CCPA/CPRA applies only above thresholds (revenue over roughly US$25M+ adjusted, or large data volumes), so a small operator is likely exempt. Most other state comprehensive laws have consumer-count thresholds (around 100k consumers) that a small shop will not reach. Texas/Nebraska-style laws exempt SBA-small businesses except for the sensitive-data consent rule. **All states' data breach laws apply regardless of size** when names are combined with ID numbers. Verify this with counsel. Brazil's LGPD applies because processing happens in Brazil (the operator and translators are there). Publish a privacy policy, name a DPO/encarregado contact, and record a legal basis (contract performance).
- **[ESTIMATE] Controls:** files kept in encrypted cloud storage (Google Workspace / S3 with SSE) with signed-URL access. Translators work in a browser workspace (no downloads where possible) and use 2FA. Auto-delete source and translation files 30–90 days after delivery, with an opt-in "keep for re-orders" choice. Use AI APIs under no-training/zero-retention terms (DeepL Pro does not store texts; OpenAI/Anthropic business APIs do not train on data by default; confirm current terms). Translator agreement: NDA plus confidentiality, a data processing clause (LGPD operator), a ban on using personal AI accounts, deletion after the job, IP assignment, and quality/indemnity. Keep access logs and a breach-response one-pager.

### Gaps
- Did not verify current CCPA thresholds or a 2026 list of state laws with small-business carve-outs.
- AI vendor retention terms were not verified this session.

## 6. Unit cost model and owner hours

### Takeaway
At a retail price of about US$25–35 per page (or US$39–59 flat per standard document), templated AI + Brazilian post-editor delivery has a direct cost of about US$8–14 per page. That leaves roughly 55–70% gross margin before marketing. Customer acquisition (Google Ads) is likely the biggest cost [ESTIMATE].

### Cited Findings
- Market retail price: US$25–35/page typical in 2026 (Carolina Translation Center), US$25–60 per birth certificate (Translayte), US$20–28 (big online players). — [Carolina Translation Center 2026](https://blog.translation.center/2026/01); [Translayte birth certificate cost](https://translayte.com/blog/how-much-does-it-cost-to-translate-a-birth-certificate); [Translayte PT](https://translayte.com/pt/blogue/uscis-requisito-de-traducao)
- MT cost: about US$25 per million characters (DeepL). — [G2](https://www.g2.com/products/deepl-api/pricing)
- Notarization cost: about US$25 per notarization (Proof). — [FrontDeskReview](https://frontdeskreview.com/software/notary-software/proof/)

### Inferences — [ESTIMATE] cost per page (templated certidão, 1 page)

| Item | Low | High | Note |
|---|---|---|---|
| Translator post-edit + certification signature | $6 | $12 | flat per templated page; free-form docs at ~$0.05/word × 250 = $12.50 |
| QA / second-check (10–100% sampling) | $0.50 | $2 | reviewer pay, sampled |
| OCR + LLM + MT API | $0.05 | $0.30 | ~2–4k chars; vision LLM calls cost cents |
| Payment processing (~3% + $0.30) | $1.05 | $1.35 | on a $25–35 order |
| Software amortized (Shopify, apps, Zapier, bot, storage) | $0.50 | $2 | ~$200–400/month spread over volume |
| Refund/revision reserve (3–5%) | $1 | $1.75 | |
| **Total direct** | **~$9** | **~$19** | |
| Retail price | $25 | $35 | |
| **Contribution before ads** | **~$16** | **~$16–26** | |

- **Packages [ESTIMATE]:** "Green card / marriage package" (2 birth certificates + marriage certificate + criminal background) sold at about US$99–129. Direct cost is about US$35–50. "Naturalization / name change package", "Student package" (diploma + histórico, priced per page). Rush 12h at +50%. Notarization +US$35–45 (cost about US$25). Mail hard copy +US$20 (only if needed).
- **Owner hours [ESTIMATE]** (assuming the automation above, pool of translators, a part-time QA lead after scale):
  - *10 orders/day (~15–20 pages/day):* about 5–8 hours/week. Escalated tickets about 1 hour per day at the start, dropping to 3–4 hours/week; translator payments weekly 0.5 hour; spot QA 1–2 hours; ads/metrics 1–2 hours. The owner can still act as backup QA.
  - *30 orders/day (~45–60 pages/day):* about 8–12 hours/week if a paid **ops/QA lead** (a senior Brazilian translator at about US$600–1,200/month, part-time) handles escalations, translator scheduling and QA. Otherwise 20+ hours/week. Needs 5–8 translators in rotation.
- **Spanish→English extension [ESTIMATE]:** same pipeline with a separate template set (Mexican/Central American actas, etc.) and a separate translator pool. Competition is larger and prices lower (ES→EN is the most common pair).

### Gaps
- No verified data on CAC (Google Ads CPC for "certified translation USCIS Portuguese").
- No verified data on what share of orders are templated vs free-form documents.
- Translator pay per templated page is an estimate derived from ProZ per-word rates and MTPE percentages, not from a quoted market rate.
