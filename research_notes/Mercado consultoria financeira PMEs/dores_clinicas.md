# Financial pains of dental and aesthetic (HOF) clinic owners in Brazil

Research date: 2026-10-25. About 17 searches. Many vendor pages (simplesdental.com, calculadoradetaxas.com.br, contabilidadezen.com.br) could not be fetched directly (DNS errors), so some numbers come from search-result extracts of those pages. They are marked **[snippet]** and should be re-checked before they go into client-facing material.
Vendor bias: most practical benchmarks come from software vendors (Simples Dental, Asaas, Digisac), payment comparators, or accountants selling services. They have an interest in making the problems look large. Peer-reviewed Brazilian data exists mainly on dental insurance fees (convênios) and public-service no-shows.

## 1. Card fees, antecipação and parcelamento sem juros 10–12x

### Takeaway
For high-ticket treatments (implants, ortho, prosthetics, HOF packages), the card is the biggest cost a consultant can fix. Selling in 12x with antecipação costs about 11–12% of the ticket, versus about 1–3% for Pix, debit or à vista. Changing acquirer or rates, changing the payment-method mix and setting a parcelamento policy are all achievable in 30–60 days.

### Cited Findings
- Stone (rate table republished by Jornal Contábil, date not stated): débito 1.25–1.29%; crédito parcelado from 5.41% (2x) up to **11.99% (12x)** — [Jornal Contábil](https://www.jornalcontabil.com.br/noticia/descubra-a-maquininha-de-cartao-ideal-para-o-seu-negocio/)
- Rede crédito parcelado from 4.04%. Rede and Cielo antecipação rates are "conforme perfil e volume", meaning they can be negotiated — [Jornal Contábil](https://www.jornalcontabil.com.br/noticia/descubra-a-maquininha-de-cartao-ideal-para-o-seu-negocio/)
- Antecipação in 2026 costs about **1.49% to 3.5% per month**, depending on the acquirer (Cielo, Rede, Getnet, Stone, PagBank) or auction platform. Source is an antecipação seller, so it is biased — [AntecipaFácil](https://antecipafacil.com.br/artigo/antecipacao-recebiveis-cielo-2026-cartao-credito)
- D+0/D+1 receipt typically costs 2–4% of the anticipated amount — [Shopify BR](https://www.shopify.com/br/blog/taxas-de-processamento-de-cartoes-de-credito)
- PagBank: every parcelado sale = transaction fee + antecipação fee (if any) + parcelamento interest — [PagBank blog](https://blog.pagbank.com.br/como-calcular-juros-da-maquina-de-cartao-parcelado)
- A comparator profiling dentists says crédito parcelado (6x/10x/12x) is the most critical mode for dentists. A R$3,000 procedure in 12x can cost about **R$150 more** at an expensive acquirer than at the cheapest one. Example: on R$10,000, the net amount was R$8,896 in 12x antecipado, R$9,695 crédito à vista and R$9,954 Pix. That is about 11% vs 3% vs 0.5% cost (my calculation) **[snippet]** — [Calculadora de Taxas – dentista](https://www.calculadoradetaxas.com.br/maquininha-por-perfil/dentista)

### Inferences
- Clinic where 50% of revenue comes in on cards at 10–12x: a 2–4 percentage-point rate renegotiation, or moving 20% of the mix to Pix or entrada + boleto, is worth roughly **1–3% of total revenue**. On R$100k/month that is R$1–3k/month. It is measurable inside 90 days by comparing card statements (extratos de adquirente) before and after.
- "Parcelamento sem juros" is in fact a discount of about 10–12% that the clinic grants. If the price list was not built with it included, the margin on procedures sold in 12x can drop to zero (see section 2).
- Diagnostic items: acquirer statements for 3 months, effective rate by mode, % of revenue by payment method and number of installments, automatic vs on-demand antecipação, existence of a Pix discount policy.

### Gaps
- No official, dated rate table for dentists from Stone, Cielo or PagBank could be fetched. No study gives the % of clinic revenue paid in 10–12x.

## 2. Pricing below cost, cost per chair-hour, idle chair rate and no-shows

### Takeaway
Clinics usually price from "tabela do mercado / VRPO / concorrente", not from the cost per chair-hour (custo da hora clínica). The methodology is simple: fixed costs ÷ productive hours, discounted for no-shows and idle time. No-show rates are much higher than vendors assume. This is the most "consultable" deliverable: a cost-based price list plus a dashboard of agenda occupancy and no-shows.

### Cited Findings
- Hora clínica = monthly fixed costs ÷ hours available. Example: R$5,000 ÷ 200 h = R$25/h minimum, before materials and margin. The vendor suggests discounting about **5% for no-shows and 10% for idle chair time** **[snippet]** — [Simples Dental](https://www.simplesdental.com/blog/?p=2859)
- The vendor separates "hora clínica geral" (theoretical full capacity) from "hora clínica de atendimento" (actual hours with patients), and calls the second the realistic minimum **[snippet]** — [Simples Dental](https://simplesdental.com/blog/?p=4182)
- No-shows in public orthodontic services (20 municipalities, Ceará): **32.17%** of 8,283 appointments. Public sector, so it is not equivalent to private clinics — [SciELO CSC 2018](https://www.scielosp.org/pdf/csc/2018.v23n1/287-294)
- A systematic review (PUC-Rio dissertation) found an average no-show rate of **23%**, higher among younger and lower-income patients — [PUC-Rio](https://www.maxwell.vrac.puc-rio.br/32440/32440.PDF)
- No-shows in pediatric public secondary dental care in a large Brazilian city — [SciELO CSC 2019](https://scielosp.org/article/csc/2019.v24n5/1915-1923)
- Brazilian case study (UCS) costing 3 procedures in a clinic **without regular accounting**. Its conclusion compares the practiced price with a cost-based "preço proposto". The extract says the practiced price was *above* the proposed price, so this case does NOT prove underpricing — [UCS repositório](https://repositorio.ucs.br/11338/12321)
- Dentists' fees under convênios are 81–87% below the CFO reference on resin restorations (see section 5). This is the strongest documented evidence of "price below cost" — [Revodonto/APCD](https://revodonto.bvsalud.org/pdf/apcd/v70n3/a09v70n3.pdf)

### Inferences
- For private-pay patients there is NO solid Brazilian evidence that clinics price below cost in general. It is a vendor narrative. Treat it as a hypothesis to test per client with cost per procedure = hora clínica × duration + materials + lab + card fee + tax + commission.
- No-show impact: on a chair at R$150/h of hora clínica and 160 h/month, each 10 points of no-shows or idle time means about R$2,400/month of fixed cost not absorbed per chair. Confirmation, reminders and an overbooking policy can measurably cut no-shows within 60–90 days.
- Diagnostic items: occupancy rate per chair, no-show %, cancellations without rescheduling, hora clínica computed (yes/no), margin per top-10 procedure, card fee included in the price (yes/no).

### Gaps
- No national private-practice no-show statistic for Brazil was found. Clinicorp, Simples Dental and Dental Office did not publish an accessible benchmark. Idle chair rate (ociosidade) has no source beyond the vendor's 10% assumption.

## 3. Dentist commissions (porcentagem sobre produção) and margin

### Takeaway
The model of paying associate dentists a % of production or receipts is the norm. The pain is paying commission on **gross production** (before card fees, lab costs, default and tax) instead of on **net receipts**. That erodes the owner's margin on every installment sale.

### Cited Findings
- Simples Dental article on how to define commissions while keeping financial control (page could not be fetched; it exists as a topic) — [Simples Dental](https://www.simplesdental.com/blog/?p=2290)
- US references: 30% of collections without a lab deduction, or 35–40% with lab charged to the associate. 30–32% of production is "most common" in one region. These are **US data**, used only as a reference — [Dental Economics](https://dentaleconomics.com/practice/overhead-and-profitability/article/14233195/appropriate-compensation-for-associate-dentists); [DentistryIQ](https://www.dentistryiq.com/practice-management/financial/article/16367629/should-associates-have-to-pay-their-lab-bills); [Dentaltown](https://www.nxtbook.com/farran/dentaltown/dentaltown-september-2022/index.php?startid=27)
- UK HOF: owner-operator injector net margin about 44%, falling to about 20% once the clinic employs other injectors on commission — [Pabau](https://pabau.com/blog/how-much-do-botox-clinics-make/)
- Codental software has a "how much each dentist billed" report, which shows that commission per producer is a standard control — [Codental help](https://intercom.help/codental/pt-BR/articles/8201551-como-ver-quanto-cada-dentista-faturou-no-codental)

### Inferences
- Rough calculation: 40% commission on gross production + 12% card fee in 12x + 8–12% lab + 6–15% tax leaves a contribution margin before fixed costs of about 20–30%, or lower. Moving the base to net receipts (after card fee, lab and default) typically recovers about 3–6 points of margin. This is my estimate and needs to be validated per client.
- Diagnostic items: base of the commission (production vs receipts; gross vs net of card fee and lab), when commission is paid (on sale vs on receipt), commission on uncollected amounts.

### Gaps
- No Brazilian survey of typical commission % was found. The 30–50% range often quoted in the Brazilian market could not be confirmed with a citable source.

## 4. PF/PJ mixing, pró-labore, owner withdrawals, lack of financial control

### Takeaway
Weak financial management is well documented qualitatively (the dentist "manages by intuition") but there is no good national % figure. Separating PF/PJ, a fixed pró-labore and a basic cash flow and DRE are the core 90-day deliverables.

### Cited Findings
- Survey of 50 dentists (northwest Paraná, **2011, old**, convenience sample): financial management done "predominantemente por intuição", meaning that training in this area is incipient — [Revista Uningá](https://revista.uninga.br/uninga/article/download/995/655/2868)
- Literature: working-capital management is barely taught in dental schools. Administrative management of clinics is described as "ineficiente" — [FADISMA](https://sites.fadisma.com.br/entrementesanais/wp-content/uploads/sites/7/2022/07/GESTAO-DO-CAPITAL-DE-GIRO-UMA-ANALISE-BIBLIOG.pdf); [Dialnet](https://dialnet.unirioja.es/descarga/articulo/6774011.pdf)
- Accountant blog (2026): the typical PJ dentist pattern is "fatura mais, mas não consegue localizar o dinheiro". Listed errors: mixing clinic and personal money, no reserve for weak months. Opening the CNPJ fixes taxes but does not fix financial organization **[snippet; accounting vendor]** — [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/jornada-financeira-dentista-pj-2026/)
- A mentor suggests a fixed or % pró-labore, e.g. 40% personal / 60% clinic (opinion, not data) — [Cora](https://www.cora.com.br/blog/contabilidade-para-dentista/)
- The sector is described as "saturado" plus "inexperiência e ineficiência em gestão" — [Uninter](https://www.uninter.com/noticias/?p=76006); 1 dentist per 735 inhabitants, more than 2x the WHO recommendation — [SciELO CSC 2024](https://scielosp.org/pdf/csc/2024.v29n1/e15942022/pt)
- Sebrae (2021, all small firms): 22% of closed businesses cite lack of working capital as the main cause of closing — [Fenacon/Sebrae](https://fenacon.org.br/noticias/sebrae-pequenos-negocios-tem-maior-taxa-de-mortalidade/)
- Market size: about 81k registered dental clinics (CFO, 2024, via Asaas) — [Asaas](https://blog.asaas.com/como-abrir-consultorio-odontologico/amp/); 339k to more than 400k dentists, depending on the source and date (conflicting) — [Guia da Carreira](https://www.guiadacarreira.com.br/blog/mercado-de-trabalho-odontologia)

### Inferences
- The fixes are binary and auditable in 90 days: separate bank accounts, a pró-labore defined in writing, a cash-flow routine (weekly), a monthly DRE gerencial, and a reserve target (e.g. 3 months of fixed costs).

### Gaps
- **No reliable national % of clinics without financial control was found.** The UFES Vitória study on management tools exists but its percentages could not be retrieved. Do not cite any "X% of dentists don't control finances" figure without a source.

## 5. Inadimplência and convênios (low fees, glosas)

### Takeaway
Default on own credit (boleto, carnê, crediário próprio) averages about 6.7% according to the only figure found, which comes from a vendor. Most clinics do no credit check. Convênios pay far below reference tables, and this is documented academically.

### Cited Findings
- National average patient default in dental clinics: **6.7%** (Grupo TOMAZ report cited by Simples Dental; date of the report not stated) **[snippet; vendor]** — [Simples Dental](https://simplesdental.com/blog/?p=4002)
- Simples Dental 2023 survey: **about 70% of clinics did not run credit checks** on patients **[snippet; vendor]** — [Simples Dental](https://www.simplesdental.com/blog/?p=4022)
- Asaas (billing vendor) content on what to do when the patient doesn't pay — [Asaas](https://blog.asaas.com/o-que-fazer-quando-o-paciente-nao-paga/)
- Codental integrates a Serasa lookup of patients, which shows the market treats credit risk as a real pain — [Codental](https://intercom.help/codental/pt-BR/articles/8991947-consultando-o-historico-do-paciente-no-serasa)
- Convênios, Maceió (2016): fees for all specialties are below the VRPO-CFO table; resin restorations are **81–87% below** the CFO suggestion — [Revodonto/APCD](https://revodonto.bvsalud.org/pdf/apcd/v70n3/a09v70n3.pdf); [Revodonto OCC](https://revodonto.bvsalud.org/pdf/occ/v14n4/a07v14n4.pdf)
- UNESP doctoral thesis (2024, 261 credentialed dentists in one SP municipality): sealant paid **R$5.82 vs R$132.30** under CBHPO (95.6% gap) — [UNESP](https://repositorio.unesp.br/bitstreams/b20eb109-e136-48d9-b839-d76cc70b69d9/download)
- 76.8% of dentists rated convênio pay as bad or very bad (older survey). They also complain about payment timing and loss of autonomy — [Redalyc](https://www.redalyc.org/pdf/637/63770311.pdf)
- Press (2011–12, old): tables about 80% out of date, 10 years without readjustment, CADE complaint — [Estado de Minas](https://www.em.com.br/app/noticia/economia/2012/04/16/internas_economia,288980/custos-do-atendimento-odontologico-em-plano-de-saude-geram-polemica.shtml)

### Inferences
- Convênio profitability per plan (fee vs cost per procedure via hora clínica) is a high-value diagnostic: it often shows plans with negative contribution margin. Dropping or limiting them is a decision the consultant can support with numbers in 30–60 days.
- Default: cutting it from 6.7% to about 3% with entrada + Pix/card + credit check is about 3–4% of credit sales recovered.

### Gaps
- No quantified data on **glosa** rates in dental convênios was found. No split of default by boleto, carnê or crediário.

## 6. Tax: Simples Nacional, Fator R (Anexo III vs V), Lucro Presumido

*(Out of scope for the consultant: refer to an accountant. Listed here as a pain and an impact.)*

### Takeaway
Odontologia falls under Fator R. With payroll plus pró-labore of 28% or more of revenue it is taxed in Anexo III (from 6%), otherwise in Anexo V (from 15.5%). A badly configured pró-labore is a common, large and quick-to-spot leak.

### Cited Findings
- Odontologia is subject to Fator R (LC 123/06 art. 18 §5º-M). Anexo III from 6%, Anexo V from 15.5% — [Jornal Contábil](https://jornalcontabil.com.br/noticia/fator-r-do-simples-nacional-anexo-iii-e-v-em-qual-deles-pago-menos-imposto/amp/); [Contabilizei](https://www.contabilizei.com.br/contabilidade-online/fator-r-simples-nacional/)
- Example at R$20k/month revenue: pró-labore R$5,600 (28%). DAS about R$1,200 (III) vs about R$3,100 (V), a saving of **about R$1,900/month gross**, minus 11% INSS on the pró-labore (about R$616) — [Contabilidade.com](https://contabilidade.com/blog/quanto-um-dentista-paga-de-imposto-veja-a-tributacao-como-autonomo-simples-nacional-e-lucro-presumido/); [Agilize](https://agilize.com.br/artigos/?p=4750)
- Effective rate about 8.6% (III, 2nd band) vs about 15.9% (V) on R$240k/year — [Agilize](https://agilize.com.br/artigos/?p=4415)
- Rough comparison: Anexo III about 6–14%, V about 15.5%, Lucro Presumido about 14% (vendor says the figures are approximate) **[snippet]** — [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/simples-ou-presumido-abrir-empresa-dentistas-2026/)
- Profit distributions do NOT count toward Fator R. Fator R uses the clinic's total payroll — [Agilize](https://agilize.com.br/artigos/?p=4750)
- MEI is not allowed for dentists — [Freelas sem Crise](https://www.freelasemcrise.com.br/calculadoras/reserva-seguranca/dentista)

### Inferences
- Net saving from fixing Fator R is about R$15k/year per R$240k of revenue (my estimate from the figures above). The consultant flags it in the diagnostic and refers to an accountant.
- The tax reform (IBS/CBS from 2026–2027) may change the comparison. The 60% rate reduction for health services is not verified here.

### Gaps
- Equiparação hospitalar (lower presumed rates for clinics with hospital-type services) is not covered by any source found.

## 7. Benchmarks: margins and cost structure

### Takeaway
No Brazilian benchmark for dental cost structure was found. The available figures are US (ADA-style) references republished by vendors. Use them as an order of magnitude, calibrated per client.

### Cited Findings
- Overhead 60–65% of collections on average; 55–60% is ideal; healthy margin 35–40%; above 30% means stable (US-based) — [Rework – métricas](https://resources.rework.com/pt/libraries/dental-clinic-growth/key-financial-metrics-dental-practices)
- Staff payroll 24–26% (up to 30%); lab 8–12% general practice (implants 10–14%, pediatric 4–7%); dental supplies 5–7% (US/ADA) — [Rework – laboratório](https://resources.rework.com/pt/libraries/dental-clinic-growth/dental-lab-cost-management); [Rework – métricas](https://resources.rework.com/pt/libraries/dental-clinic-growth/key-financial-metrics-dental-practices)
- Aesthetics/injectables (foreign): gross margin target 60–70%, price = cost ÷ (1 − margin) — [Zenoti](https://www.zenoti.com/es/thecheckin/how-to-price-med-spa-services); US product cost US$6–7/unit vs price US$10–25/unit — [Brenton Way](https://brentonway.com/tools/med-spa-pricing-calculator); the reconstituted vial lasts a short time, so vial use is a key margin lever — [Pabau](https://pabau.com/blog/how-much-do-botox-clinics-make/)
- Rent: no benchmark found.

### Inferences
- Suggested Brazilian working ranges to validate per client (inference, not a source): card fees 2–6% of revenue, tax 6–16%, commissions 25–40% of the associates' production, lab 8–14%, materials 5–8%, payroll 20–30%, rent and occupancy 5–10%, marketing 3–8%, owner net margin 15–30%.

### Gaps
- No Brazilian sector survey (CFO, ABO, Sebrae) with cost-structure percentages. No Brazilian data on HOF toxin or filler cost in R$ was found.

## 8. Aesthetic / HOF clinics: specific pains

### Takeaway
There are few quantified Brazilian sources. The pains are: price wars on toxin and fillers (not documented with data), regulatory risk, perishable high-cost inventory, and commissions to injectors.

### Cited Findings
- TRF-1 decision annulled the CFO norm allowing dentists to perform facial harmonization; CFO said it would appeal (date unclear in the extract). This is regulatory and revenue risk for HOF dentists — [DGABC](https://www.dgabc.com.br/Noticia/4342379/dentista-pode-ou-nao-fazer-harmonizacao-facial-entenda-nova-decisao-da-justica); AMB/CFM opposition to CFO Res. 198/2019 — [AMB](https://amb.org.br/wp-content/uploads/2019/02/Nota-Conjunta-da-AMB-e-CFM-sobre-a-Resolução-nº-198_REV.pdf)
- Injectables inventory is costly (a vial costs hundreds of dollars before use). Injector commissions complicate the bookkeeping (US source) — [Beancount](https://beancount.io/pt/blog/2026/07/28/medical-spa-bookkeeping-injector-commissions-guide)
- Sebrae 2026 Roraima beauty and aesthetics report: small businesses are 98.3% of the sector there — [DataSebrae](https://datasebrae.com.br/wp-content/uploads/2026/07/RR-I-EDICAO-Estetica-e-Beleza-Junho-2026.pdf)

### Gaps
- No Brazilian data on HOF price per unit or ml, margin, or price war. Needs field interviews.

## 9. Owners' own words (phrases of pain)

### Takeaway
Real verbatim quotes from forums, Instagram or Reclame Aqui could not be collected with the tools available. The phrases below are wording that appears in sector content (vendor or accountant), not verified owner quotes.

### Cited Findings
- "Fatura mais, mas não consegue localizar o dinheiro" (accountant's description of PJ dentists) — [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/jornada-financeira-dentista-pj-2026/)
- Gestão financeira "por intuição" (survey summary) — [Uningá](https://revista.uninga.br/uninga/article/download/995/655/2868)
- Convênio dissatisfaction: values, payment timing, "perda de autonomia" — [Redalyc](https://www.redalyc.org/pdf/637/63770311.pdf)
- Dentist forum doubt on Anexo III vs V (Contábeis forum, 2018) — [Contábeis](https://www.contabeis.com.br/forum/tributos-federais/280345/dentista-anexo-iii-ou-v-simples-nacional/)

### Gaps
- Instagram, YouTube, Facebook groups and Reclame Aqui were not searchable with these tools. Recommend 5–10 owner interviews, or scraping comments from dental-management influencer content, to capture real wording.

## Summary: what a consultant can measurably fix in 90 days (inference)

| Pain | Typical size (sourced range) | 90-day fix / metric |
|---|---|---|
| Card fees and antecipação at 10–12x | 12x about 11–12% of the ticket vs Pix about 0.5% | Renegotiate or change acquirer, Pix and entrada policy; metric: effective % fee in the statements |
| Price not built from hora clínica | No-shows 23–32% (public/academic) vs 5% assumed by vendors | Hora clínica + margin per procedure + new price list; metric: contribution margin per procedure |
| Commission on gross production | Unquantified in BR; US 30–40% | Commission base = net receipts; metric: owner margin % |
| PF/PJ mixing, no cash flow | Qualitative; 22% of SME closures due to working capital | Separate accounts, pró-labore, weekly cash flow, monthly DRE |
| Default on own credit | About 6.7% average; 70% do no credit check | Credit check + entrada + collection routine; metric: % overdue |
| Unprofitable convênios | Fees 81–96% below reference tables | Profitability per plan; drop or limit loss-making plans |
| Fator R misconfigured (refer to accountant) | About R$1.9k/month gross per R$20k/month revenue | Flag and refer to accountant |
