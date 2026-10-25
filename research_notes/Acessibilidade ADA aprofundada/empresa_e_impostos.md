# Brazil-resident founder: legal setup for a US-facing B2B accessibility-services business (US + Brazil), as of Oct 2026

> Research notes, not legal or tax advice. Each claim has a source and is marked **[verified]** (primary source or several secondary sources agree), **[secondary]** (one secondary or marketing source) or **[unverified/estimate]** (my inference or training knowledge, with no source found this session). Several official pages (support.mercury.com, support.google.com, camara.leg.br, demarest.com.br) failed with DNS errors in WebFetch, so some primary sources were read only through search snippets. A US CPA (Form 5472 and ECI) and a Brazilian contador or tax lawyer (Lei 14.754, Simples, câmbio) are needed before launch.

---

## 1. US entity options for a non-resident (LLC, costs, EIN, BOI, Form 5472, US tax)

### Takeaway
A single-member LLC in Wyoming, New Mexico or Delaware, owned by a Brazil-resident individual, is a disregarded entity for US tax. If all work is done outside the US (by the owner in Brazil and by foreign freelancers), there is generally no ECI and no US federal income tax. There is still a hard annual filing duty: Form 5472 plus a pro-forma Form 1120, with a $25,000 penalty if it is missed. Since March 2025, BOI reporting no longer applies to LLCs formed in the US. The EIN can be obtained without an SSN or ITIN by phone or fax using Form SS-4.

### Cited Findings
**Formation and state costs**
- Stripe Atlas costs a one-time $500. The fee covers state filing, the EIN and the first year of registered agent service. Agent renewal is about $100 a year, and the Delaware franchise tax or annual fee is not included. **[secondary, several review sites; stripe.com/atlas pricing not fetched]** — [Rho: Stripe Atlas review](https://www.rho.co/blog/stripe-atlas-review); [Rho: Atlas alternatives](https://www.rho.co/blog/stripe-atlas-alternatives); [Unilink: Stripe Atlas 2026](https://www.unilink.us/blog/stripe-atlas-2026)
- One 2026 source says Atlas forms Delaware C-corps. Stripe's own guides say nonresidents can form a US LLC. An old 2021 post said Atlas would not form LLCs for non-US residents. Check current Atlas eligibility for LLCs before choosing it. **[conflicting]** — [Stripe: open an LLC as a nonresident](https://stripe.com/en-mx/resources/more/how-to-open-an-llc-in-the-usa-for-nonresidents); [Indie Hackers 2021](https://www.indiehackers.com/post/how-to-set-up-a-us-llc-and-us-bank-account-as-a-non-us-resident-remotely-from-anywhere-in-the-world-2021-update-bfd8b050a6)
- One source says Delaware raised its incorporation fee to $109 from 1 Aug 2026. **[unverified, single source]** — [Rho](https://www.rho.co/blog/stripe-atlas-review)
- **Delaware LLC:** flat $300 annual tax, due 1 June (June 1, 2026 for this cycle). LLCs file no annual report. Paying late adds a $200 penalty plus interest and costs the company its good standing. **[verified, Wolters Kluwer]** — [Wolters Kluwer: Delaware annual tax due June 1](https://www.wolterskluwer.com/en-au/expert-insights/delaware-annual-tax-is-due-june-1)
- **Wyoming LLC:** the annual report fee is the greater of $60 or $0.0002 per dollar of Wyoming assets, so in practice $60. It is due on the first day of the formation anniversary month. An LLC still unfiled 60 days after the due date can be administratively dissolved. **[secondary, several guides agree]** — [Zenind WY 2026](https://www.zenind.com/help/post/wyoming-llc-fees-licenses-and-filing-requirements-2026-guide); [LLC University WY](https://www.llcuniversity.com/wyoming-llc/costs/); [FileForms WY 2026](https://fileforms.com/wyoming-annual-report-filing-for-2026-deadlines-requirements-and-how-to-stay-compliant)
- **New Mexico LLC:** no annual report and no annual state fee. A registered agent with an NM street address is still required. **[secondary, several sources]** — [Dimov Tax](https://dimovtax.com/states-have-no-annual-report-llcs/); [LegalZoom NM](https://www.legalzoom.com/articles/how-to-start-an-llc-in-new-mexico)

**EIN without an SSN**
- The IRS lets international applicants call **267-941-1099** (not toll-free), 6 a.m. to 11 p.m. Eastern, Monday to Friday. The caller must be authorized to receive the EIN. By fax (Fax-TIN), the EIN generally arrives within 4 business days. **[verified, IRS SS-4 instructions 12/2025]** — [IRS: Instructions for Form SS-4](https://www.irs.gov/instructions/iss4)
- On SS-4 line 7b, an applicant with no SSN or ITIN writes "Foreign" or "N/A". The responsible party must be a natural person. **[verified, IRS]** — [IRS SS-4 instructions](https://www.irs.gov/instructions/iss4); [Wise: EIN for foreigners](https://wise.com/us/blog/ein-for-foreigners)
- Secondary sources give these fax numbers: 304-707-9471 for applicants outside the US and 855-215-1627 for applicants inside it. Mail to "Internal Revenue Service, Attn: EIN International Operation, Cincinnati, OH 45999" takes about 4 weeks. The same sources quote fax turnaround as anything from 1 week to 4–6 weeks. **[secondary, check the numbers against irs.gov]** — [Rho: EIN for non-US founders](https://www.rho.co/blog/ein-for-non-us-founders); [Rho: EIN processing times](https://rho.co/blog/how-long-does-it-take-to-get-an-ein)
- Stripe confirms that nonresidents do not need an SSN or ITIN for an EIN and can apply by fax, mail or phone with SS-4. **[verified, Stripe]** — [Stripe: get an EIN outside the US](https://stripe.com/en-dk/resources/more/how-to-get-an-ein-or-a-tin-while-living-outside-the-us)

**BOI (Corporate Transparency Act)**
- FinCEN's interim final rule, published 26 March 2025, exempts entities formed under US state law (former "domestic reporting companies") from all BOI reporting. Only **foreign reporting companies** (entities formed abroad and registered to do business in a US state) must still report, and they need not report US-person owners. The IFR remains in force until replaced by a final rule. **[verified, several law firms]** — [Hunton](https://hunton.com/insights/legal/significantly-tailored-back-cta-only-requires-foreign-reporting-companies-to-report-boi-and-only-report-non-us-persons-boi); [Sidley](https://sidley.com/en/insights/newsupdates/2025/03/fincen-issues-interim-final-rule-for-corporate-transparency-act); [Reed Smith](https://www.reedsmith.com/en/perspectives/2025/03/corporate-transparency-act-fincen-rule-exempting-domestic-boi-reporting)
- What this means here: a Wyoming, NM or Delaware LLC owned by a Brazilian has **no BOI filing** under the IFR, even though its owner is foreign. Exemption depends on where the entity was formed, not on who owns it. I found no source confirming whether a final rule had been issued by Oct 2026. **[gap]**

**Form 5472 and pro-forma 1120**
- A foreign-owned US disregarded entity must file Form 5472 attached to a pro-forma Form 1120 every year, even with no income or tax due. A late or substantially incomplete filing triggers a **$25,000** penalty. A further $25,000 applies for each 90 days the failure continues after an IRS notice. **[verified, several CPA and law-firm sources; IRS form page not fetched]** — [Loeb & Loeb](https://www.loeb.com/en/insights/publications/2021/03/obligations-to-file-form-5472-for-foreign-owned-disregarded-entities); [Greenback](https://www.greenbacktaxservices.com/knowledge-center/form-5472/); [TaxesForExpats](https://cdn.taxesforexpats.com/articles/foreign-business/form-5472-penalty.html)
- Due date is 15 April for a calendar year, extendable to 15 October with Form 7004. The forms cannot be e-filed: they are faxed or mailed to a special IRS address and marked "Foreign-owned U.S. DE". **[secondary; one CPA firm instead cites 15 March, so this conflicts]** — [SDO CPA](https://www.sdocpa.com/form-5472-foreign-owned-business-filing/); [Greenback](https://www.greenbacktaxservices.com/knowledge-center/form-5472/)
- Reportable transactions include capital contributions and distributions between the owner and the LLC, so almost any LLC with a bank account will have something to report. **[secondary]** — [Clemta](https://clemta.com/blog/us-llc-tax-for-non-residents-compliance-guide)

**US income tax and ECI**
- Pay for services performed outside the US is generally foreign-source income, so there is no ECI and no US withholding. What decides this is where the work is physically done, not where the clients are. A US office or US staff would change the analysis. **[secondary, several tax firms]** — [Entity.inc: ECI guide](https://www.entity.inc/blog/effectively-connected-income-eci/); [Nonresident.tax](https://nonresident.tax/blog/w-9-or-w-8ben-e-foreign-owned-us-llc/); [EntityBrief 2026](https://entitybrief.com/llc-taxes/foreign-owners/)
- For a foreign-owned single-member LLC, the **owner** gives US payers or platforms a **W-8BEN** (individual owner), not a W-9. If income becomes ECI, the W-8 is no longer valid. **[verified, IRS W-8BEN-E instructions]** — [IRS Instructions W-8BEN-E](https://www.irs.gov/pub/irs-pdf/iw8bene.pdf)

### Inferences
- **Year-1 US cost estimate [estimate]:** formation $50–$500 depending on provider and state, plus registered agent of about $0–$150 in year 1 and $100–$150/yr after, plus the state annual fee (NM $0 / WY $60 / DE $300), plus Form 5472 preparation by a specialist of roughly $300–$800/yr (no fee source found). **Best estimate for a services LLC: about $400–$1,200 in year 1, then $400–$1,200/yr.** NM or WY is cheapest. Delaware adds cost without benefit for an LLC that is not raising VC money.
- Timeline [estimate]: state filing 1–5 business days (WY/NM online); EIN the same day by phone or about 4 business days to a few weeks by fax; bank and Stripe 1–3 weeks after the EIN. **Realistic total: 2–6 weeks.**
- ECI risk to watch: no US-located employees or contractors acting as the LLC's agents, no US office, and the owner should not do the work during US trips. A US freelancer doing work in the US could create a US trade or business. A US CPA should confirm.
- Some US states may require sales-tax registration for "digital" or "information" services. Accessibility audits are usually not taxable, but this was not researched.

### Gaps
- Current Doola, Firstbase and Northwest pricing was not checked this session; their pages need direct review. From training knowledge only (unverified): Doola starter about $297/yr plus state fee, Firstbase about $399 plus state fee, Northwest about $39 plus state fee plus $125/yr registered agent.
- Final-rule status of the FinCEN BOI IFR as of Oct 2026.
- Exact IRS fax number and mailing address for the pro-forma 1120/5472 in the current instructions.

---

## 2. Banking and payments (Mercury, Relay, Wise, Payoneer, Stripe, chargebacks, invoicing)

### Takeaway
Mercury does not require US citizenship or residency, but it does require a US-formed company and rejects registered-agent, P.O. box and UPS Store addresses. Whether Brazil is on its restricted-country list could not be fetched; it is believed to be supported, but this is unverified. A Stripe US account needs the US entity, EIN, US bank account and identity documents. An SSN is not required for the EIN, but whether Stripe asks the representative for one could not be confirmed.

### Cited Findings
- Mercury: the company must be formed in the US or a US territory, and applicants do not need to be US citizens or residents. Principal place of business can be outside the US. Registered-agent addresses, P.O. boxes and UPS Store addresses are rejected. Money services businesses, adult entertainment, cannabis and gambling are restricted. Some founder-residence countries are unsupported (list linked from the page). **[verified from search snippet of the Mercury help page]** — [Mercury: eligibility](https://support.mercury.com/hc/en-us/articles/28770467511060)
- A third-party guide says KYC review for non-US founders takes 2–3 weeks, against 3–7 days for US founders. **[secondary]** — [Zenind: Mercury from Brazil](https://www.zenind.com/help/post/how-to-open-a-mercury-account-in-brazil-a-practical-guide-for-brazilian-founders)
- For Stripe, a third-party guide lists a US entity, US EIN, US bank account and verification documents as requirements. For founders without an SSN, the EIN comes from a paper SS-4 (1–3 weeks typical). **[secondary]** — [File.business guide](https://design.file.business/us-stripe-account-international-founder)
- Whether Stripe Atlas or Stripe needs a US phone number is anecdotal and unresolved. **[forum]** — [Bubble forum](https://forum.bubble.io/t/is-a-us-phone-number-actually-required-for-stripe/388084)

### Inferences
- [unverified] Zenind publishes a "Mercury in Brazil" guide, which suggests Brazil is not a blocked country. Brazilian founders commonly use Mercury, but confirm on Mercury's restricted list.
- [unverified, training knowledge] Relay has historically been stricter with non-US residents (it often wanted SSN/ITIN or US presence), so treat it as uncertain. Wise Business and Payoneer generally onboard non-resident-owned US LLCs and provide US ACH/wire receiving details. Payoneer also has a Brazil-side offering.
- Address: Mercury rejects registered-agent addresses, so the founder can list a Brazilian home address as principal place of business. Mercury allows an international principal place of business, which is better than buying a "virtual office" that may also be rejected.
- Chargebacks in B2B [best practice, no source]: use a signed SOW or proposal with click-through ToS acceptance, written acceptance of deliverables (audit report sign-off), milestone or upfront billing (for example 50% deposit), invoices via Stripe Invoicing with ACH preferred for large tickets (ACH debit disputes have different rules and fees from cards), a clear refund policy, and kept evidence (emails, report delivery logs). Card disputes cost a fee per dispute; check current Stripe pricing.
- Invoicing: Stripe Invoicing, or Mercury/Wise invoicing, in USD with the LLC's legal name, EIN and a US mailing address (virtual mailbox).

### Gaps
- Mercury's restricted-country list (page fetch failed); Relay's current non-resident policy; Stripe's current requirement for the representative's SSN or ID; current Stripe dispute fee.

---

## 3. Alternative without a US entity: selling from a Brazilian company (CNPJ), Simples Nacional export

### Takeaway
A Brazilian ME or LTDA in Simples Nacional can invoice US clients as a **service export**. PIS/COFINS (and usually ISS) are excluded when the client is resident abroad **and** there is an effective inflow of currency. COSIT 179/2025 accepts receipt in reais or foreign currency. Tax-wise this is often cheaper and simpler than a US LLC (no Form 5472, no Lei 14.754 controlled-entity regime), but US B2B buyers see a foreign vendor. That can hurt Google Ads conversion and procurement onboarding (W-8BEN-E, vendor forms, international wires).

### Cited Findings
- To get the Simples export benefit, the client must be resident or domiciled abroad and the payment must be an effective inflow of foreign currency into Brazil (Solução de Consulta COSIT 160/2024, citing 78/2019). Services performed in Brazil whose result is verified in Brazil do not qualify. **[verified via search summaries of COSIT]** — [Tributo Devido](https://tributodevido.com.br/portal/isencao-pis-cofins-exportacao-servicos-simples-nacional/); [Contabilidade Zen 2026](https://www.contabilidadezen.com.br/blog/como-abrir-empresa-exportacao-servicos-2026/)
- COSIT 179/2025 (16 Sep 2025): export revenue may be received in Brazil in reais or foreign currency, whatever the contract currency, before or after the service. Legal basis is MP 2.158-35/2001 art. 14, III and Lei 10.833/2003 art. 6, II. **[verified]** — [Normas Legais: COSIT 179/2025](https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-179-2025.htm)
- ISS: sources conflict on practice. Most large municipalities (for example São Paulo) recognize the exemption when the client is abroad and payment comes in foreign currency; some ask for more documentation. **[secondary / forum]** — [Econet](https://blog.econeteditora.com.br/o-que-e-exportacao-de-servicos); [Contábeis forum](https://www.contabeis.com.br/forum/tributos-federais/329322/prestacao-de-servico-exterior/)

### Inferences
- [unverified, training knowledge] In the PGDAS-D, flagging revenue as export removes the ISS, PIS and COFINS shares from the DAS. IRPJ, CSLL and CPP still apply. Website audit or remediation work is usually Anexo III, or Anexo V subject to the "Fator R" (payroll/pró-labore ≥ 28% of revenue keeps the company in Anexo III). Anexo III's nominal first-bracket rate is 6% and drops after export removals; Anexo V starts at 15.5%. The contador must classify the CNAE (for example 6201-5/01, 6204-0/00, 7020-4/00) and confirm the annex.
- [unverified] Since 2026, the tax reform (CBS/IBS, LC 214/2025) phases in with export immunity, but transition rules for Simples companies need a contador.
- [unverified] Since 2026, Lei 15.270/2025 adds 10% withholding on dividends above R$50k/month per paying company to the same individual, plus a minimum tax on high incomes. This matters for drawing profit from either a CNPJ or a controlled entity. A contador must confirm.
- Trust and conversion: US SMB buyers paying by card through a US-looking checkout (Stripe Brazil can charge USD) may not notice the vendor's country. Larger buyers' procurement will see "foreign vendor" and may balk at international wires or W-8BEN-E. A US LLC with US ACH details, a US address and a US phone line lowers that friction. Middle path: start with the Brazilian CNPJ and add a US LLC once US sales prove out.
- Payment rails from a CNPJ: Stripe Brazil (USD charges, payout in BRL), Wise Business Brazil and Payoneer give US receiving accounts. Each conversion counts as a câmbio operation documented as export of services, which supports the "ingresso de divisas" requirement.

### Gaps
- Exact current Simples Anexo III/V effective rates after export exclusions for the expected revenue bracket. Stripe Brazil's current cross-border pricing and USD settlement options. A municipality-specific ISS rule for the founder's city.

---

## 4. Brazil tax on a US LLC owned by a Brazilian resident (Lei 14.754/2023, carnê-leão, câmbio)

### Takeaway
Since 1 Jan 2024, a Brazil-resident individual who controls a foreign entity pays **15% IRPF on the entity's annual profit, taxed on 31 December whether or not it is distributed**, declared in the annual DIRPF. An irrevocable "transparency option" lets the individual declare the entity's assets and income as if held directly. Whether a US disregarded LLC is a "controlled entity" or should be treated transparently, and how active service income from work done in Brazil is classified (possibly as the individual's own income under carnê-leão at progressive rates), is not settled by any source found. **This is the single most important question for a contador or tax lawyer.**

### Cited Findings
- Profits of controlled foreign entities are taxed at **15%** IRPF in the annual return, with no deductions, on profit determined at **31 December** of each year whether distributed or not. This ends deferral. Profits earned before 2024 keep deferral. **[verified, several firms]** — [KPMG](https://kpmg.com/br/pt/home/insights/2024/03/tributacao-offshores-lei-14754-2023-.html); [PwC](https://www.pwc.com.br/pt/setores-de-atividade/servicos-financeiros/2024/Lei-14754-2023.pdf); [Bem Paraná](https://www.bemparana.com.br/publicacao/colunas/contabilidade-facil/offshores-e-trusts-entenda-a-nova-regra-de-tributacao/); [Ministério da Fazenda Q&A](https://www.gov.br/fazenda/pt-br/assuntos/noticias/2023/dezembro/20-12-2023-mf-qa-lei-14754-offshores-limpo.pdf)
- **Conflict:** one summary says the general rule taxes controlled-entity profits when made available, with 31/12 taxation only for "qualifying" controlled entities (tax-haven location, or own active income below 60%). Most sources describe 31/12 taxation for all controlled entities. Treat this as conflicting and check against art. 5 of the law. — [Galícia Educação](https://www.galiciaeducacao.com.br/blog/lei-14754-tributacao-automatica-de-offshores/); [Carvalho Barros](https://carvalhobarros.adv.br/blog/artigos/holding-offshore-lei-14754-2023); compare [KPMG](https://kpmg.com/br/pt/home/insights/2024/03/tributacao-offshores-lei-14754-2023-.html)
- A controlled entity is one where the individual, alone or with related persons, holds decision power or the ability to elect most managers, or more than 50% of capital. A single-member LLC owner plainly has control. **[verified]** — [Bem Paraná](https://www.bemparana.com.br/publicacao/colunas/contabilidade-facil/offshores-e-trusts-entenda-a-nova-regra-de-tributacao/); [Souto Correa](https://soutocorrea.com.br/wp-content/uploads/2023/12/Souto-Correa_Lei-14.7542023.pdf)
- **Transparency option:** the individual declares the controlled entity's assets, rights and income in proportion to ownership, under the tax regime that applies to each, as if held directly. The option is irrevocable for as long as the investment is held, is made per entity, and must be made by all Brazilian-resident individual partners. **[verified]** — [Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/planejamento-sucessorio/novas-regras-de-tributacao-de-investimentos-no-exterior); [Lei 14.754 text (Senado)](https://legis.senado.leg.br/norma/37911511/publicacao/37928599)
- Amounts taxed under the annual regime are not taxed again when distributed. They are recorded as a dividend receivable, and exchange variation on that receivable is not taxed. Losses follow art. 9. Regulation: IN RFB 2.180/2024. **[verified / secondary]** — [Souto Correa](https://soutocorrea.com.br/wp-content/uploads/2023/12/Souto-Correa_Lei-14.7542023.pdf); [Tellicojus](https://tellicojus.com/blog/lei-14754-offshores/); [Castro Contabilidade](https://castro.cnt.br/noticias/informativo-22-2024-lei-das-offshores-no-14-754-2023/)

### Inferences
- [inference] For a US LLC run from Brazil, the default path is: the LLC books profit (revenue minus freelancer costs, ads and tools), and the owner pays **15% on the LLC's annual profit in reais** in the DIRPF filed in April–May of the following year. The US imposes no tax (no ECI), so there is no foreign tax credit to offset it. Compared with Simples (about 6% or less after export exclusions) this can cost more, but it is simple and flat with no INSS.
- [inference, high risk] The Receita could argue that the owner personally performs services in Brazil and that the LLC is merely a conduit. That would make the income the individual's own, taxable under carnê-leão at the progressive table up to 27.5%, and possibly subject to INSS. The transparency option could produce the same result. A tax lawyer should check the substance (freelancers do the delivery, the LLC holds the contracts and IP, documented management) and whether a hybrid "LLC plus Brazilian CNPJ subcontractor" structure is better: the LLC sells, and a Brazilian Simples company provides services to the LLC as a service export.
- [inference] If the owner draws a salary or fee from the LLC into Brazil, that is foreign-source income for the individual, paid via monthly carnê-leão. It could duplicate tax on the same profit if not structured carefully.
- Câmbio [unverified, training knowledge]: Lei 14.286/2021 (new FX framework, in force since Dec 2022) simplified individual FX. Receiving via Wise or Payoneer into a Brazilian account is a regular FX operation with IOF, generally 0.38% on most inbound conversions; IOF rates changed in 2025 and should be checked. Holding an LLC and its bank account abroad also triggers reporting: DIRPF asset declaration (LLC participation and its accounts if transparent) and, if foreign assets reach **US$1 million** on 31/12, the Banco Central **CBE** declaration.
- A contador experienced with offshore and LLC cases is mandatory, not optional.

### Gaps
- No source addressed directly how Receita treats a US **disregarded** single-member LLC (separate entity versus transparent) under IN RFB 2.180/2024. Exact article text could not be fetched (Câmara DNS failure). Current IOF rate for inbound service-export FX in 2026. Interaction with the 2026 dividend withholding and minimum tax law.

---

## 5. Contracts and E&O insurance

### Takeaway
No source confirmed whether Hiscox, Next (ERGO NEXT) or Embroker write professional liability (E&O) for a US LLC whose owner lives abroad. Hiscox professional liability covers work performed anywhere, but claims must be brought in the US or Canada. Get direct quotes and expect possible declines. Accessibility-service contracts must avoid any "ADA compliance guarantee".

### Cited Findings
- Hiscox professional liability covers work performed anywhere in the world, provided claims are brought in the US or Canada. **[secondary]** — [Wise: best small business insurance for LLCs](https://wise.com/us/blog/best-small-business-insurance-llc); [Hiscox LLC insurance](https://www.hiscox.com/sb-lp/professional-business-insurance/llc-insurance)
- Next Insurance (now ERGO NEXT) offers professional liability (E&O) and other lines, but not in all 50 states. **[secondary]** — [Quotesweep 2026](https://www.quotesweep.com/blog/best-insurance-for-llc)
- California bars LLCs (domestic and foreign) from rendering licensed "professional services" in the state. This concerns licensed professions, not web accessibility consulting. **[verified, CA DOI]** — [CA Dept. of Insurance](https://www.insurance.ca.gov/0200-industry/0020-apply-license/0300-business-license/business-entity-limited-liability.cfm)

### Inferences
- Contract essentials [best practice, no source]:
  - Scope tied to a named standard and version (WCAG 2.1/2.2 AA) and a sampled page list.
  - An explicit statement that the service is a technical assessment, **not legal advice and not a guarantee of ADA/Section 508 compliance or of immunity from demand letters or lawsuits**.
  - Point-in-time snapshot: site changes void conclusions.
  - Automated-tool limitations disclosed.
  - Client responsible for implementation unless remediation is contracted.
  - Limitation of liability capped at fees paid (for example in the last 12 months), with no consequential damages.
  - Mutual indemnity carve-outs; confidentiality; IP and licence to deliverables; acceptance and payment terms (deposit, net terms, late fees).
  - Chargeback and dispute clause plus a requirement to raise disputes with the vendor first.
  - Subcontractor clause allowing freelancers.
  - Governing law and venue: Wyoming, New Mexico or Delaware (the LLC's state) with arbitration, or the client's state on request.
  - E-signature clause.
  - Have a US attorney review the template once (estimate $500–$2,000, no source).
- Insurance: Embroker, Hiscox and Next quote online, and online flows usually require a US business address and may ask about owner residency. A broker with surplus-lines access (for example Founder Shield, or other tech E&O brokers) is the fallback. Expect roughly $500–$1,500/yr for $1M tech E&O for a micro-business [unverified estimate].

### Gaps
- Insurer underwriting rules on foreign ownership or residence were not found. They need direct quotes or broker confirmation.

---

## 6. Google Ads: advertiser verification for a foreign-owned US LLC

### Takeaway
Google's advertiser verification for an organization requires a business registration document plus a government photo ID of an authorized representative (an Ads admin or payments-profile admin). For US organizations, a **passport** is an accepted ID, and IDs may be issued in any country. The legal name and address on the payments profile must exactly match the documents. Payments-profile country is the main friction point: some Google help pages list a country mismatch between profile, registration document and ID as a rejection reason. Set up a **new, separate Google Ads account and a new US payments profile** in the LLC's legal name.

### Cited Findings
- US document requirements list passports among the accepted photo IDs for the authorized representative, alongside state ID, driver's licence and green card. **[verified, Google help, US page]** — [Google: document requirements, US](https://support.google.com/adspolicy/answer/9872280?hl=en&co=GENIE.CountryCode%3DUS)
- The authorized representative is an admin of the Google Ads account and/or the payments profile paying for ads. A regional Google page says the ID can be issued in any country. Documents must exactly match payments-profile information, including the organization name, and the profile name can be edited during the task. **[verified, Google help]** — [Google: document requirements](https://support.google.com/adspolicy/answer/9872280?hl=en-GB&co=GENIE.CountryCode%3DIC); [Google: tasks for advertiser verification](https://support.google.com/adspolicy/answer/15577076?hl=en)
- Google Ad Manager's ID-verification page (a different product, but the same payments system) says Google can only verify IDs matching the payments-profile country, and tells applicants to contact support if the ID country differs. **[verified for Ad Manager; applicability to Google Ads not confirmed]** — [Google Ad Manager: verify identity](https://support.google.com/admanager/answer/13985965?hl=en)
- Verification also includes a business-operations questionnaire, and missing or wrong answers are a common failure. Verification must generally be completed within 30 days of the request or ads pause. **[verified / secondary]** — [Google: business operations issues](https://support.google.com/adspolicy/answer/11938893?hl=en); [Kliken](https://help.kliken.com/en/articles/12532609-how-to-complete-your-google-advertiser-verification)

### Inferences
- Practical setup [inference]:
  1. Create a new Google account and Google Ads account, not linked to the founder's existing business payments profile.
  2. Create a payments profile with country **United States**, organization type, the exact LLC legal name (including "LLC"), and the LLC's address. Use the address on the Articles or EIN letter, which may be the registered-agent or virtual-mailbox address.
  3. Pay with the LLC's US card (Mercury, Wise or Relay debit card), billing in USD.
  4. For verification, upload the Articles of Organization or Certificate of Formation, and/or the IRS EIN letter (CP 575 / 147C), plus the owner's passport.
- Because the payments profile country cannot be changed after creation [training knowledge, unverified], pick US from the start. If the ID-country issue triggers a rejection, appeal via support with the passport plus formation documents.
- US virtual phone (for example Google Voice, OpenPhone or Quo) and virtual address: allowed for contact, but the advertised business info must not misrepresent location. Google's "misrepresentation" policy could be triggered if ads or the site imply a US-based team that does not exist. The site should state a remote, international team honestly.
- If selling from a Brazilian CNPJ instead: the payments profile is Brazil, billing in BRL with Brazilian taxes on ad spend (ISS/PIS/COFINS/IOF-type charges on Google Brazil invoices; unverified). US targeting still works.

### Gaps
- Whether Google Ads (not Ad Manager) currently rejects a US organization profile whose representative holds a non-US passport. Anecdotes suggest it is possible but sometimes needs an appeal. No first-hand 2026 source was found.

---

## 7. Paying freelancers from the LLC (Upwork, Deel, Wise; W-8BEN)

### Takeaway
Foreign (non-US) freelancers working outside the US give the LLC a **W-8BEN** (individuals) or **W-8BEN-E** (entities). They are kept on file, not sent to the IRS. Payments for services performed outside the US are foreign-source, so no 1099 or US withholding applies. US-based freelancers would provide a W-9 and receive a 1099-NEC above the threshold, and their work in the US may create ECI risk for the LLC.

### Cited Findings
- W-8BEN is for foreign individuals and W-8BEN-E for foreign entities. Compensation for services performed outside the US is generally foreign-source, with usually no US withholding. **[verified/secondary]** — [IRS W-8BEN-E instructions](https://www.irs.gov/pub/irs-pdf/iw8bene.pdf); [Vantis CPA](https://vantiscpa.com/resources/w-8ben-w-8ben-e/); [Entity.inc](https://www.entity.inc/blog/effectively-connected-income-eci/)

### Inferences
- Platforms [unverified, training knowledge]:
  - **Upwork** (client fee about 5%, plus marketplace fee; collects W-8/W-9 automatically).
  - **Deel** contractor plans (about $49/contractor/month; contracts and W-8BEN collection).
  - **Wise Business** batch payouts (lowest FX cost, but contracts and W-8 collection are manual).
  - **Payoneer**.
- Keep an independent-contractor agreement with each freelancer: IP assignment, confidentiality, accessibility quality standards and a non-solicit.
- Brazilian freelancers paid by the LLC: for them this is foreign-source income, taxed under their own carnê-leão or their own CNPJ export. If the founder pays themself this way, see section 4 risks.
- Freelancer costs are LLC expenses that lower the profit taxed at 15% in Brazil. Keep invoices.

### Gaps
- Current Upwork client fees and Deel pricing were not verified this session.

---

## Consolidated setup checklist (to build the report)

**Path A, US LLC (best for US-buyer trust):**
1. Choose a state: NM ($0/yr) or WY ($60/yr). Avoid DE ($300/yr) unless you need it.
2. Form via a provider or directly, with a registered agent. Get an EIN by phone (267-941-1099) or fax SS-4 (about 4 business days).
3. No BOI filing under the 2025 IFR; recheck the FinCEN site.
4. Open Mercury (confirm Brazil eligibility) and/or Wise Business, then Stripe US with Stripe Invoicing and ACH.
5. Get a US virtual mailbox (not just the registered-agent address, which Mercury rejects) and a US VoIP number.
6. Set up a separate Google Ads account with a US payments profile in the exact LLC name, LLC card, USD; verify with Articles, EIN letter and passport.
7. Have contracts and ToS reviewed by a US attorney; get E&O quotes (Hiscox, Embroker, Next, broker).
8. Collect W-8BEN from freelancers; pay via Wise, Deel or Upwork.
9. Every year: Form 5472 plus pro-forma 1120 by 15 April (Form 7004 extends to 15 October), $25k penalty risk; state annual fee; registered agent renewal.
10. Brazil: hire a contador for Lei 14.754 (15% on the LLC's 31/12 profit in the DIRPF, or the transparency option), the LLC asset declaration, the CBE if foreign assets reach US$1M, and IOF/câmbio documentation.

**Path B, Brazilian CNPJ (cheapest and simplest tax-wise):**
1. Open an ME/LTDA (or SLU) in Simples Nacional with a services CNAE; check Fator R for Anexo III versus V.
2. Invoice abroad as a service export (client abroad plus currency inflow; reais or FX accepted per COSIT 179/2025). PIS/COFINS are excluded and ISS usually is.
3. Receive via Stripe Brazil, Wise Business, Payoneer or a bank.
4. Google Ads with a Brazil payments profile (BRL).
5. Upgrade to an LLC (Path A or a hybrid where the LLC sells and the CNPJ subcontracts) once US traction justifies it.
