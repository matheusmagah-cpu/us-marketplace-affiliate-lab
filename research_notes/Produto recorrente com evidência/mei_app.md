# Subscription software for Brazilian MEIs: proven recurring paid market? (research as of 2026-10-26)

Method note: WebFetch and direct curl were blocked in this session (DNS and proxy 403), so every finding below comes from WebSearch result summaries and snippets, not full page reads. Labels: **[V]** means verified in a primary or near-primary source snippet. **[S]** means a secondary source or the vendor's own claim. **[E]** means my own estimate or inference. Treat every price as "seen in snippet, confirm on the vendor page".

## 1. Pain: size of the base, DAS default, NFS-e, DASN

### Takeaway
The pain is real and very large. There are about 17.2M MEIs (June 2026). Roughly 40% were in default on DAS in 2024. MEIs have been required to use the national NFS-e since Sept 2023, and it is error-prone. DASN is due every May 31, with a fine of at least R$50. ME/EPP in the Simples move to the national NFS-e on 1 Nov 2026, which widens the adjacent market.

### Cited Findings
- [S] 17.163 million MEIs in June 2026 (Dieese, based on the Receita Federal statistical report). That is 16.8% of employed people and 66.1% of self-employed ("conta própria"). The base grew 82% from 9.4M in Dec 2019. São Paulo has 4.79M. — [Bem Paraná](https://www.bemparana.com.br/noticias/economia/parana-e-o-quarto-estado-com-mais-meis-no-pais-pedreiros-e-cabelereiros-lideram/)
- [V] Sebrae national MEI stock: 14.82M (Dec/2022), 15.71M (Dec/2023), 16.34M (Dec/2024). — [Sebrae PA Informativo, May 2025](https://datasebrae.com.br/wp-content/uploads/2025/05/Informativo-de-Mercado_Semana-do-MEI_Sebrae-PA_2025.pdf)
- [S] More than 1.59M new MEIs Jan–Apr 2026, and MEIs were 77.3% of new CNPJs Jan–Aug 2026 (Sebrae). — [Fenacon](https://fenacon.org.br/noticias/meis-lideram-abertura-de-empresas-e-respondem-por-78-dos-novos-negocios-em-2026/); [Economic News Brasil, 2026-09-17](https://economicnewsbrasil.com.br/2026/09/17/abertura-de-mei-2026/); [Contadores CNT 2026-05-26](https://contadores.cnt.br/projetos/34/noticias/empresariais/2026/05/26/brasil-registra-crescimento-de-15-na-abertura-de-novos-mei-nos-primeiros-quatro-meses-do-ano.html)
- [S] DAS default: about 6.2M MEIs in 2024, roughly 40% of active registrations. The main cause is the unpaid monthly DAS, due on the 20th. Consequences include loss of INSS coverage (retirement, sickness aid, maternity pay). Under current rules, exclusion is automatic after 12 months of default. PLP 176/25 would suspend DAS generation after 6 months. — [Serasa Experian](https://www.serasaexperian.com.br/conteudos/o-que-muda-para-o-mei-em-2025-novo-limite-e-principais-alteracoes/). Caveat: that article uses a base of about 15M, which is inconsistent with Sebrae's 16.34M.
- [S] All small businesses: 23.9M active CNPJs at end of 2025, of which 7.7M are in default (Sebrae Panorama via Fenacon). This is not MEI-only. — [Fenacon](https://fenacon.org.br/noticias/numero-de-pequenos-negocios-e-recorde-mas-inadimplencia-atinge-77-milhoes/)
- [V] DASN-SIMEI for calendar year 2025 was due 31 May 2026. Late filing carries a minimum fine of R$50, cut 50% to R$25 if paid within 30 days. — [netcpa, May 2026](https://netcpa.com.br/noticias/dasn-simei-prazo-de-entrega-encerra-se-em-31052026/24513). Another source gives the formula as 2%/month, capped at 20% of declared taxes, with a minimum of R$50. — [meutudo, 2026-01-13](https://meutudo.com.br/blog/noticias/2026/01/13/declaracao-do-mei-2026-ja-esta-disponivel-veja-como-preencher/)
- [S] Revenue limit is still R$81k/year, with 20% tolerance to R$97.2k. Bills to raise it to R$130k–140k are pending. CGSN Resolution 183/2025 now counts revenue earned under the owner's CPF toward the MEI limit, which adds to the need for limit monitoring. — [contratapj](https://contratapj.com.br/limite-faturamento-mei/); [CartaCapital](https://www.cartacapital.com.br/do-micro-ao-macro/nova-regra-soma-renda-da-pessoa-fisica-ao-mei-e-muda-calculo-do-limite-anual/); [Contábeis](https://www.contabeis.com.br/noticias/73748/receita-em-cpf-entra-no-limite-de-faturamento-do-mei/)
- [S] MEIs have been required to use the national NFS-e since Sept 2023. ME/EPP in the Simples were due on 1 Sept 2026, postponed to **1 Nov 2026** by CGSN Res. 191/2026. — [Berga](https://berga.app/blog/emissor-nacional-nfse-obrigatorio); [TabNews](https://www.tabnews.com.br/nexorabr/pitch-nfs-e-nacional-obrigatoria-para-me-epp-do-simples-em-01-11-o-que-muda-no-emissor-web-e-na-api-dps-endpoints-cnc)
- [S] Common Emissor Nacional errors: municipality not enabled, wrong IBGE code, CNAE not authorized, ISS rate outside the municipal table, gov.br account at Bronze level, transmission timeouts. Forum users reported failures in Jan 2026 ("não foi possível avançar", XML schema errors). — [Contmatic: 12 erros](https://simplifique.contmatic.com.br/blogs/erros-emissor-nfse-nacional); [Contábeis forum](https://www.contabeis.com.br/forum/legalizacao-de-empresas/411887/emissor-nacional-com-erro/); [nfsedownloader status (up on 24/10/2026)](https://www.nfsedownloader.com.br/status-nfse-nacional)

### Inferences
- [E] If about 40% are in default, roughly 6–7M MEIs are behind on DAS at any moment. That is a large, recurring pain that comes back every month on the 20th.
- [E] Search demand confirms the pain: "das mei" at 673k/month and "nota fiscal mei" at 368k/month. But most of those searchers want to do one free government task right now, not buy software.

### Gaps
- No official 2025/2026 MEI default rate from Receita or Sebrae was found. The 40% figure is from 2024 and comes via Serasa.
- No figure for the number of MEIs desenquadrados or with CNPJ cancelled in 2025/2026.

## 2. Paid competitors and hard evidence of paying subscribers

### Takeaway
There are many paid MEI products, priced roughly R$15–R$60/month for software and R$49–R$200/month for accounting. That shows people pay. But I found **no hard paying-subscriber count or revenue figure** for any pure MEI app. Large players (MaisMEI, Nubank PJ, Cora, the government's own apps) give the core tasks away free: DAS, NFS-e and DASN. Monetization seems to come from adjacent services (accounting, banking, credit, or one-off paid services), not from the DAS/NFS-e tools themselves.

### Cited Findings
- **MaisMEI** [S]: 2M users in Nov 2023, projected 2.3M by year-end. These are users, not payers. — [Monitor Mercantil](https://monitormercantil.com.br/tecnologia-que-desburocratiza-gestao-de-meis-supera-marca-de-2-milhoes-de-cliente/). App Store listing: "Mais MEI: abrir MEI, DASN, DAS", described as free. — [App Store](https://apps.apple.com/br/app/mais-mei-abrir-mei-dasn-das/id1437671032). In an April 2024 Reclame Aqui reply, MaisMEI said NFS-e issuance "é uma das funcionalidades gratuitas". — [Reclame Aqui](https://www.reclameaqui.com.br/mais-mei/emissao-de-nota-fiscal-com-o-maismei_bxWrTiBUPjpDVPfE/). There is also a Reclame Aqui complaint titled "cobrança após criar MEI", which suggests some paid services exist. — [Reclame Aqui](https://www.reclameaqui.com.br/mais-mei/cobranca-apos-criar-mei_Va6UAHcP_n4vx0VL/). No price, funding round or revenue figure was found.
- **Qipu** [S, vendor claim]: "MEI Completo" plan at R$49.90/month, recurring by card, boleto or Pix. Qipu ERP MEI at R$18.90/month (R$15.75/month on the annual plan). The company claims more than 550k entrepreneurs. — [Qipu MEI](https://qipu.com.br/mei/); [Qipu serviços](https://www.qipu.com.br/servicos/); [Qipu home](https://qipu.com.br/); [Qipu blog, Sept 2026](https://qipu.com.br/blog/contabilizei-vs-qipu). No funding information was found.
- **MEI Fácil** (Reclame Aqui lists it under Neon Pagamentos) [S, old]: annual subscription of R$69.90/year, about R$5.8/month (the source is about 5 years old). Reclame Aqui score 8.4 (old, unverified). — [TotalMEI](https://totalmei.com/mei-facil/); [Reclame Aqui MEI Fácil/Neon](https://www.reclameaqui.com.br/mei-facil/mei-facil_y1zqDFmrJbdzCvMT/)
- **Company Hero "MEI Hero"** [S]: R$29.90/month, offering diagnosis and DAS debt monitoring. — [Company Hero](https://www.companyhero.com/report-pj-corporativo)
- **Emitte** (NFS-e issuer) [S]: Prata R$59.90, Ouro R$79.90, Platina R$119.90 per month. — [Emitte preços](https://emitte.com.br/preco/)
- **ZAP MEI** [S]: R$49.90/month. **Gestor MEI** sells a monthly plan (price not captured). — [Monitor do Mercado](https://monitordomercado.com.br/noticias/399236-quanto-um-contador-cobra-para-cuidar-de-um-mei-em-2026-e-o-que-esta-incluso-no-preco-do-servico/); [Gestor MEI](https://gestormei.com.br/produto/plano-mensal-gestor-mei/)
- **Newer niche entrants** that are SEO-active in 2026 (pricing not captured): Mei.ai, MEI Profissa, Berga, Agilize MEI (App Store). — [Mei.ai](https://meiai.com.br/blog/como-emitir-nfse-mei-portal-nacional-passo-a-passo); [MEI Profissa](https://meiprofissa.com.br/blog/como-emitir-nfse-sistema-nacional/); [Berga](https://berga.app/blog/emissor-nacional-nfse-obrigatorio); [Agilize MEI](https://apps.apple.com/br/app/agilize-mei/id1638944650)
- **Accounting for MEIs** [S]: online accounting for an MEI typically costs R$49–150/month, or R$80–200/month depending on region. Conta Azul's entry plan is about R$169.90/month, which is not MEI-specific. — [Monitor do Mercado](https://monitordomercado.com.br/noticias/399236-quanto-um-contador-cobra-para-cuidar-de-um-mei-em-2026-e-o-que-esta-incluso-no-preco-do-servico/); [Shopify BR](https://www.shopify.com/br/blog/ferramentas-contabeis-para-pequenas-empresas)
- **Free bank tools** [V]: Nubank PJ "Meus Impostos MEI" launched May 2023 for the whole PJ base. It generates and pays the DAS in the app, sends monthly reminders, confirms payment in real time, and accepts card payment. — [Nubank newsroom](https://international.nubank.com.br/pt-br/consumidores/conta-pj-do-nubank-ganha-recurso-inedito-para-emissao-e-pagamento-de-impostos-mei/); [InvestNews](https://investnews.com.br/negocios/conta-pj-do-nubank-ganha-recurso-para-emissao-e-pagamento-de-impostos-mei/amp/). Cora's free PJ account issues NFS-e automatically when a boleto is created (beta). — [Cora](https://www.cora.com.br/conta-pj/nota-fiscal/)
- **Free government tools** [S]: the Receita "MEI" app (DAS, DASN, assessment periods) had more than 5M Google Play downloads as of March 2025. — [Jornal Contábil](https://jornalcontabil.com.br/noticia/mei-receita-publica-nota-orientando-os-microempreendedores/). The new federal app **"Meu MEI Digital"** launched in Jan 2026. It is free, uses gov.br login, and includes an AI assistant called "Meire" for deadlines and obligations. — [CRC-SP](https://online.crcsp.org.br/portal/noticias/noticia.asp?c=10406); [okai 2026-01-26](https://okai.com.br/noticia/2026-01-26/governo-federal-lanca-aplicativo-meu-mei-digital-novo-aliado-eletronico-de-quem-faz-o-brasil-acontecer)
- [S] The Reclame Aqui landscape includes many "unofficial site" complaints: paid MEI opening, a paid cancellation that is free on gov.br, and "MEI Grátis" charging monthly. These show a market of third parties monetizing confused MEIs. Several use dark patterns, which hurts the trust of the whole category. — [Reclame Aqui: Mei Nacional Assessoria](https://www.reclameaqui.com.br/mei-nacional-assessoria-e-consultoria-empresarial/cobranca-editado-pelo-reclame-aqui-para-abertura-de-mei-em-site-nao-oficial_c3k4OCy10NrOU0GJ/); [Reclame Aqui: MEI Grátis](https://www.reclameaqui.com.br/empresa/mei-gratis/); [Reclame Aqui: meu-mei-digital (private company)](https://www.reclameaqui.com.br/meu-mei-digital/cobranca-indevida_-4mcqHbtvDiskrLI/)

### Inferences
- [E] Paying for software is proven at the price-point level: many vendors list R$15–60/month recurring plans. But scale is unproven. No vendor publishes a payer count, and the biggest free-to-use player (MaisMEI, 2M+ users) gives away DAS and NFS-e.
- [E] The likely paying segment is service-provider MEIs who issue several NFS-e a month (designers, devs, consultants, beauty and health professionals). It is a fraction of the 17M, maybe the 10–25% who are service providers that issue notes regularly. This is an unverified estimate.
- [E] Free substitutes (government app, Nubank, Cora, MaisMEI free tier) mean a paid product has to sell automation and peace of mind: auto-issue recurring NFS-e, WhatsApp DAS reminders, limit alerts including CPF revenue, and DASN pre-filled. Access alone will not sell.

### Gaps
- No funding rounds found for MaisMEI, Qipu or MEI Fácil (Crunchbase was unavailable).
- No Google Play download counts or ratings for the private apps. No current Reclame Aqui complaint counts.
- No current prices captured for Contabilizei MEI, Nibo or InfinitePay.

## 3. Why Google Ads competition is low: policy and cannibalization

### Takeaway
The low competition index on "das mei" and "nota fiscal mei" is most plausibly explained by Google's "Government documents and official services" policy, tightened on **5 Oct 2026**, together with strongly navigational intent (people want the free gov.br page). Ads that promote help with an official document or service now require the advertiser to be named as authorized on an official government site. A pure management SaaS is not "obtaining a government document", but ads on "das mei" keywords that read like DAS generation or official issuance carry a high disapproval risk. Google's policy page lists Brazil as a region where advertisers in this category must apply for exemption.

### Cited Findings
- [V] Google's own changelog page "Update to Other restricted businesses: Government documents and services policy (October 2026)". — [Google Ads Policy Help 17260489](https://support.google.com/adspolicy/answer/17260489?hl=en). From 5 Oct 2026, the advertiser's domain must be linked from an official government website that names it as authorized for that specific document or service. Acceptable proof: government directories of accredited commercial partners, and official regulatory portals listing authorized professionals. Not acceptable: commercial contracts, business licenses, registration in business registries (even government-run ones), and blog posts on gov sites. Ads must target only the authorized regions. The change was announced 4 Aug 2026. — [Relevant Audience](https://www.relevantaudience.com/google-ads-en/google-ads-government-documents-services-policy-october-2026/); [TechWyse](https://www.techwyse.com/news/platform-updates/google-ads-government-documents-services-policy-update-october-2026); [SERoundtable](https://seroundtable.com/google-ads-government-documents-and-services-41819.html); [ALM Corp](https://almcorp.com/news/google-ads-government-documents-services-policy-update-october-2026/); [PPC News Feed, Aug 2026](https://ppcnewsfeed.com/ppc-news/2026-08/update-government-documents-services-policy/)
- [S] Scope covers business identifiers and tax-related items. Google's examples include the US EIN and the UK Company Registration Number. A March 2026 update carved India out for business identifiers. — [ppc.land](https://ppc.land/google-ads-updates-government-documents-policy-carving-out-india-for-business-identifiers/); [SERoundtable](https://www.seroundtable.com/google-ads-government-documents-and-services-41819.html)
- [S] On Google's PT-BR "Documentos e serviços do governo" page, Brazil is listed among regions where advertisers in the category must request exemption to avoid disapproval. — [Google Ads policy 13156083 (pt-BR)](https://support.google.com/adspolicy/answer/13156083?hl=pt-BR); [Outras empresas restritas](https://support.google.com/adspolicy/answer/6368711?hl=pt-BR)
- [S] Practitioner advice: remove "oficial", "aprovado pelo governo" and "autorizado". Use "serviço independente" instead. — [SF Digital](https://www.sfdigital.co.uk/blog/google-ads-disapproved-government-documents-and-official-services/); [Brightery](https://www.brightery.com/en/post/why-your-ad-is-disapproved)
- [S] Context: SITEPD (Sept 2026) documented fake ads impersonating federal services even from verified advertisers. This is a reason for Google to enforce aggressively in Brazil. — [SITEPD 2026-09-22](https://sitepd.org.br/2026/09/22/google-exibe-campanhas-falsas-sobre-servicos-do-governo-mesmo-apos-verificar-anunciantes/)
- [V] A 2018-era Reclame Aqui complaint, "O Google ADS matou minha empresa MEI", is about MEI-related ads blocked under "Outros negócios restritos". — [Reclame Aqui](https://www.reclameaqui.com.br/google-adwords/o-google-ads-matou-minha-empresa-mei_yP9kXQDRHhv1pvmy/)
- [V] Free government alternatives cannibalize demand: the Receita MEI app (5M+ downloads), the Meu MEI Digital app (2026), the Portal do Empreendedor, PGMEI and the Emissor Nacional, all free (sources in section 2).

### Inferences
- [E] An ad like "Gere seu DAS MEI aqui" would very likely be disapproved or limited after Oct 2026. An ad selling "app de gestão para MEI: lembrete do DAS no WhatsApp, notas automáticas, controle do limite" is a software ad and arguably outside scope, but enforcement is automated and keyword-triggered. Expect manual appeals and possibly limited serving on "das mei" terms.
- [E] Safer keywords would be "aplicativo mei" (2.9k), "app para emitir nota fiscal mei", "sistema nota fiscal de serviço" (14.8k for "nota fiscal de serviço") and "controle financeiro mei". These have much less volume than the 673k headline.
- [E] Most "das mei" searchers are navigational and want the free PGMEI. Conversion to a paid subscription from that traffic is likely very low (<0.5% of clicks; unverified).

### Gaps
- Could not run the Ads Transparency Center or a live SERP check to see which advertisers currently bid on "das mei" or "nota fiscal mei", or how MaisMEI words its ads. Manifold and AdPlane tools failed to connect.
- Could not read the full text of Google's policy page to confirm whether Brazilian MEI and DAS services are explicitly in scope.

## 4. Retention, churn and willingness to pay

### Takeaway
There is weak direct evidence. MEIs use tech heavily (76% use technology to manage their business, according to Sebrae/IBGE Pulso), and many pay R$49–200/month for accountants. No published churn figure for MEI apps was found. Expect high churn: MEI businesses close often, have seasonal income and face free substitutes.

### Cited Findings
- [S] 76% of MEIs use technology for management, a record. The phone is the main tool (Sebrae/IBGE Pulso dos Pequenos Negócios, via a secondary article). — [Paraíba Business](https://paraibabusiness.com.br/microempreendedores-brasileiros-batem-recorde-no-uso-de-tecnologia-para-gestao-de-negocios/)
- [S] Academic studies say only part of MEIs seek accountants, and many lack basic accounting knowledge. — [Revista Visão (Uniarp), 2023](https://periodicos.uniarp.edu.br/index.php/visao/article/download/3343/1645/11471); [Remunom 2025](https://remunom.ojsbr.com/multidisciplinar/article/download/4584/4368/16551)
- [S] Generic SaaS monthly churn bands, unsourced: <1% world-class, 1–3% excellent, 3–5% healthy, >5% needs improvement. — [inblog glossary](https://inblog.ai/pt-BR/glossary/churn-rate). Brazilian context: about 21% of companies close after year 1 (IBGE via Tecnospeed). — [Tecnospeed](https://blog.tecnospeed.com.br/churn/)
- [S] MEI Fácil priced at R$69.90/year (old). Qipu ERP MEI at R$15.75–18.90/month. Low anchor prices suggest low willingness to pay for software-only. — sources in section 2

### Inferences
- [E] For a micro-ticket B2C-like SaaS for MEIs, plan on monthly logo churn of 6–10%, which gives an average lifetime of about 10–16 months. This is an estimate, not sourced. Annual prepaid plans (as MEI Fácil and Qipu offer) help.
- [E] Willingness to pay clusters at R$10–30/month for software-only. R$49 is the price of "accounting-lite" bundles (Qipu MEI Completo) that include human support, which conflicts with the owner's no-human constraint.

### Gaps
- No Sebrae 2025/2026 figure for the percentage of MEIs paying for a contador or an app. No published churn figure for any Brazilian MEI app.

## 5. Feasibility of a solo-built product

### Takeaway
A solo build is feasible technically through third-party APIs. NFS-e Nacional is available via Focus NFe, NFe.io, eNotas and PlugNotas. For DAS, the Serpro Integra Contador "Integra MEI" API generates the DAS but needs an e-CNPJ certificate and a power of attorney (procuração) set up in e-CAC. The friction is onboarding: certificate or procuração, plus a per-municipality service code and tax setup. A software that issues notes and generates guides is not accounting, which is reserved to CRC-registered professionals, as long as it does not offer bookkeeping or technical accounting responsibility.

### Cited Findings
- [S] NFS-e Nacional login: gov.br is available only to MEIs on the web emitter. ME/EPP need a digital certificate or username and password. — [TabNews](https://www.tabnews.com.br/nexorabr/pitch-nfs-e-nacional-obrigatoria-para-me-epp-do-simples-em-01-11-o-que-muda-no-emissor-web-e-na-api-dps-endpoints-cnc); [Berga](https://berga.app/blog/emissor-nacional-nfse-obrigatorio)
- [S] For issuance via API, one source says any electronic note sent via API, including from an MEI, must be signed with a digital certificate. Another says qualified signature is optional for MEIs under Lei 14.063/2020. In practice, API integrations require an A1 or A3 certificate (sources conflict). — [Signabras](https://signabras.com.br/segmentos/mei)
- [V] Focus NFe has an "NFS-e Nacional" product marketed as ideal for systems with MEI clients. It generates XML and PDF, emails the recipient and stores notes for 5 years. No public price. — [Focus NFe](https://focusnfe.com.br/produtos/nfse-nacional/)
- [S] NFe.io pricing: R$190/month for up to 250 notes, R$265 for 500, R$375 for 1,000. That works out to about R$0.38–0.76 per note. It is not confirmed that this applies to NFS-e Nacional. — [NFe.io preços](https://nfe.io/precos/emissao-nfse/)
- [S] Serpro Integra Contador, Integra MEI module: generates DAS, checks debt and updates benefits. It requires an e-CNPJ certificate (for the integrator), and the taxpayer's authorization or procuração must be set up beforehand in e-CAC. It is sold through Loja Serpro, and no price was found. — [Serpro 2022](https://serpro.gov.br/menu/noticias/noticias-2022/integra-contador-unifica-acesso-a-informacoes-contabeis); [Convergência Digital](https://convergenciadigital.com.br/governo/receita-e-serpro-lanam-plataforma-de-servios-contbeis); [CRC-SP](https://online.crcsp.org.br/portal/noticias/noticia.asp?c=5649); [community SDK listing PGMEI, CCMEI, PARCMEI](https://github.com/MarlonSantosDev/serpro_integra_contador_api)
- [S] Typical setup errors (municipality not enabled, CNAE, ISS rate) mean the product must handle per-city configuration. — [Contmatic](https://simplifique.contmatic.com.br/blogs/erros-emissor-nfse-nacional)

### Inferences
- [E] MVP stack: Focus NFe, PlugNotas or NFe.io for NFS-e; Serpro Integra MEI for DAS (or simply deep-link to PGMEI plus a barcode reminder); WhatsApp or email reminders; a revenue tracker for the limit; Pix/boleto via Asaas or Efí. One developer could build this in about 2–3 months.
- [E] A digital certificate requirement (A1 costs about R$100–200/year) would kill conversion for a R$19 product. A procuração in e-CAC is a high-friction step for low-literacy users. These onboarding costs are the real moat and the real barrier.
- [E] Legal: issuing notes and generating guides in software is not accounting activity (Decreto-Lei 9.295/46 reserves accounting to CRC-registered professionals). Avoid promising "contabilidade" or filing on the user's behalf as a professional. No source was found specifically confirming this; flagged as inference.

### Gaps
- No current Integra Contador price. No Focus NFe or PlugNotas price tables (fetch was blocked).
- Unconfirmed whether the national NFS-e API accepts MEI emission without an ICP-Brasil certificate.

## 6. Verdict (synthesis; all [E] unless cited above)

### Takeaway
The pain is strong. Recurring payment is proven to exist but not proven at scale for a pure software MEI app, and free substitutes dominate the core tasks. Google Ads on the headline "das mei" and "nota fiscal mei" terms is policy-risky after 5 Oct 2026 and mostly navigational traffic. The build is feasible but onboarding is heavy (certificate or procuração). Unit economics at R$19–49/month are marginal on paid search.

### Cited Findings
- See sections 1–5 for all source-backed facts.

### Inferences
- **Pain: STRONG.** 17.2M MEIs, about 40% in DAS default (2024), mandatory NFS-e Nacional since 2023, DASN every May.
- **Proof of recurring payment: MODERATE TO WEAK.** Qipu (R$49.90; claims 550k+ users), Company Hero (R$29.90), Emitte (R$59.90+), ZAP MEI (R$49.90) and MEI Fácil (annual) all charge. But there are no disclosed payer counts. MaisMEI (2M+ users) gives DAS and NFS-e away free. Nubank, Cora and the government do the same.
- **Google Ads viability: RISKY.** The low competition index is a warning sign, not an opportunity. Ads on "das mei" likely trip the government documents policy, and Google's page lists Brazil as a region needing exemption. Better targets are lower-volume software-intent terms ("aplicativo mei", "emitir nota fiscal mei automático", "nota fiscal de serviço" for service MEIs and, from Nov 2026, ME/EPP). Before building, run a R$300–500 smoke test with a landing page to check approval status and CTR.
- **Build feasibility: FEASIBLE, with onboarding friction.** Use NFS-e APIs (about R$0.4–0.8 per note plus monthly minimums) and Serpro Integra MEI (procuração plus e-CNPJ).
- **Unit economics (illustrative):** CPC R$1–5.7. If 3% of clicks start a trial and 15% of trials convert, that is about 0.45% click to paid, so CAC ≈ R$220–1,270. At R$29/month with about 8% monthly churn, LTV ≈ R$29 / 0.08 ≈ R$360 gross, before API costs of about R$2–5 per user per month. LTV/CAC is about 0.3–1.6. That only works with the cheaper CPCs, high conversion, annual prepay, or organic SEO (which competitors like Mei.ai, MEI Profissa and Berga are clearly pursuing).
- **Angle that may work:** ME/EPP in the Simples are forced onto the NFS-e Nacional from 1 Nov 2026. That is a new, higher-ticket segment with a fresh pain and certificates already in hand. Also: "emissão automática recorrente" for service MEIs with monthly clients.

### Gaps
- No live Ads Transparency or SERP data on current advertisers. No payer or revenue disclosures from any MEI app. No measured conversion or churn data. All unit-economics numbers above are assumptions.
