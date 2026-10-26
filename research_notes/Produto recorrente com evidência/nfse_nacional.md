# SaaS de emissão automática/recorrente de NFS-e Padrão Nacional (ME/EPP do Simples, MEI, autônomos) — Brasil, out/2026

Research date: 2026-10-26. Method note: WebFetch and curl were blocked in this session (proxy 403 / DNS failure), so every finding below comes from **search-result excerpts**, not full page reads. None of the claims was checked against a primary page (DOU, Planalto, Google policy page). "VERIFIED (secondary)" means at least one or two consistent secondary sources reported it. "ESTIMATE" means my own assumption or calculation. The Keyword Planner demand numbers came from the owner and are taken as given.

## 1. Regulation and pain: what changes on 1 Nov 2026, who must comply, penalties, problems with the free Emissor Nacional, how many companies

### Takeaway
From **1 Nov 2026**, ME/EPP in the Simples Nacional must issue service invoices on the national NFS-e standard. They can do it through the free Emissor Nacional (web/app) or through an API integration. This comes from Resolução CGSN 191/2026, which moved the earlier 1 Sep 2026 date set by CGSN 189/2026. MEIs have been required to use the national standard since Sep 2023. The pain is real but mostly about the change: instability, rejections, no recurring-invoice automation, and login friction. It is not a story of a broken free tool with no alternative.

### Cited Findings
- **VERIFIED (secondary).** Resolução CGSN nº 191 is dated 4 Aug 2026. It makes the national-standard NFS-e mandatory for ME/EPP in the Simples, issued "por meio do Emissor Nacional da NFS-e, seja pela aplicação web, seja por integração via API". It revokes CGSN 189/2026 and moves the date from Sep 2026 to **1 Nov 2026**. Rules on CBS/IBS for Simples companies take effect only from **1 Jan 2027**. — [LegisWeb](https://www.legisweb.com.br/noticia/?id=34185); [Fenacon](https://fenacon.org.br/reforma-tributaria/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026/); [COAD](https://coad.com.br/home/noticias-detalhe/139271/nfs-e-nacional-sera-obrigatoria-para-optantes-do-simples-nacional-a-partir-de-1-11-2026)
- One source says the resolution was published in the DOU on 10 Aug 2026. Until 31 Oct 2026, providers keep issuing in their municipal systems. — [Senior – Portal de Exigências Legais](https://documentacao.senior.com.br/exigenciaslegais/noticias/federal/2026/2026-08-11-simples-nacional-resolucao-cgsn-no-191-2026-utilizacao-do-emissor-da-nfs-e-de-padrao-nacional-sera-a-partir-de-novembro)
- The earlier CGSN 189 (23 Apr 2026) set 1 Sep 2026 and said municipal NFS-e issuance would be **blocked** for Simples companies after the date. It excludes operations subject only to ICMS. Several blogs still quote the outdated September date. — [meutudo](https://meutudo.com.br/blog/noticias/2026/04/30/simples-nacional-exigira-nota-fiscal-de-servico-em-padrao-nacional-a-partir-de-setembro-de-2026/); [Inventti](https://inventti.com.br/?p=24436)
- **MEI:** has issued NFS-e on the national standard since Sep 2023 (Resolução CGNFS-e nº 3, 30 Aug 2023), via Emissor Web or the NFS-e Mobile app. The invoice is mandatory for services to legal entities and optional for services to individuals. — [Suno](https://www.suno.com.br/noticias/mei-instabilidade-emitir-nota-fiscal-sistema-nacional-cpf/amp/); [Jornal Contábil](https://jornalcontabil.com.br/noticia/meis-enfrentam-dificuldades-na-emissao-de-nota-fiscal-nacional-devido-a-problemas-no-site/)
- **LC 214/2025, art. 62 §1:** municipalities had until **1 Jan 2026** to authorize national-standard NFS-e issuance or share their data with the national environment. Under §7, a municipality that does not comply loses voluntary federal transfers. — [Decreto Bacabal](https://www.bacabal.ma.gov.br/uploads/PDF/2025/12/decreto-n-1-001-d-1827.pdf); [Decreto Serra](https://sefa.serra.es.gov.br/dec1885.pdf); [Decreto Carnaúba dos Dantas](https://www.carnaubadosdantas.rn.gov.br/wp-content/uploads/2025/11/Decreto-022.2025.pdf)
- **Municipal adoption was incomplete:** one survey found only about a third of municipalities ready, with 501 not yet adhered (survey date unclear). Systax says about 35% of conveniados were active in early 2026, and the Receita cited about 2,000 active municipalities. — [Contábeis](https://www.contabeis.com.br/noticias/74396/painel-aponta-que-501-municipios-ainda-nao-aderiram-a-nfs-e/); [Systax](https://www.systax.com.br/?p=42540); [Fenacon](https://fenacon.org.br/reforma-tributaria/contadores-relatam-instabilidade-para-emissao-de-nfs-e-nacional-receita-orienta-buscar-os-municipios/)
- **Penalties:** I found no federal fine aimed at taxpayers. Penalties are municipal. For example, Natal's decree says failing to issue the NFS-e Padrão Nacional subjects the offender to legal penalties. — [Portal SPED Brasil (Natal)](https://portalspedbrasil.com.br/forum/nfs-e-natal-municipio-de-natal-adocao-do-ambiente-e-do-emissor-nacional/)
- **Complaints, Jan 2026:** accountants reported instability, differences in code requests, a monthly report that is hard to use, and "cadastro não encontrado" errors (Fortaleza, São Paulo, Juiz de Fora and smaller towns). The Receita admitted instability until 5 Jan (blamed on volume), said on 6 Jan there was no blocking problem, and told users to contact their municipalities. — [Fenacon](https://fenacon.org.br/reforma-tributaria/contadores-relatam-instabilidade-para-emissao-de-nfs-e-nacional-receita-orienta-buscar-os-municipios/); [Nota Gateway](https://notagateway.com.br/blog/instabilidades-no-emissor-nacional-da-nfs-e-geram-dificuldades-para-contribuintes-em-todo-o-pais/); [Nota Gateway – Bragança Paulista](https://notagateway.com.br/blog/nfs-e-nacional-apresenta-instabilidade-desde-inicio-de-2026-em-braganca-paulista-sp/)
- **Complaints, 2023 MEI rollout:** about 2 million notes in three weeks. Reclame Aqui complaints covered failed issuance and login problems, and some PJ providers had payments delayed because they could not issue. — [Suno](https://www.suno.com.br/noticias/?p=461359)
- **Usability gaps in the free emissor (vendor sources, so biased):** recurring invoices must be redone manually every month on the Emissor Nacional, while integrated systems automate them. gov.br login is only for MEI. **ME/EPP must log in with a digital certificate or a username and password.** A wrong tax code causes rejections. — [faznota](https://faznota.com.br/blog/emissor-nacional-nfse-ou-sistema.php); [berga.app](https://berga.app/blog/emissor-nacional-nfse-obrigatorio)
- **Number of companies:** "more than 23 million" Simples optantes in 2026, per a secondary source citing the Receita. It is unclear whether MEIs are included. — [Planning](https://planning.com.br/simples-nacional-mudancas-pequenas-empresas/) / [search excerpt](https://razonet.com.br/contabilidade-digital/super-simples-o-que-e-e-quais-empresas-podem-optar-em-2026). In Jan 2024, 657,050 new ME/EPP Simples options were approved, separate from 77,362 SIMEI requests. — [Fenacon](https://fenacon.org.br/noticias/mais-de-650-mil-empresas-aderem-ao-simples-em-2024/)

### Inferences
- The 1 Nov 2026 date explains the jump in "nfse nacional" searches (22.2k → 201k). Expect a further peak in Nov–Dec 2026, then a decline toward a lower but steady base as ME/EPP get used to it. Part of the search volume is temporary.
- ESTIMATE: if 23M+ optantes includes about 15–16M MEIs (my prior, not verified here), ME/EPP is roughly 6–8M. Only the service-providing share (perhaps 40–60%, unverified) is in scope, so about 3–5M ME/EPP plus several million MEI service providers. Either way the addressable base is in the millions.
- The strongest product wedge is not "issue an invoice". The free tool does that. The wedges are: (a) automatic recurring invoices for monthly retainers, which the gov portal does not do (per vendor sources); (b) emailing the PDF/XML to the client; (c) pre-validated service codes to avoid rejections; (d) letting ME/EPP skip the certificate-based login by storing the A1 once.

### Gaps
- I did not read the official CGSN 191 text in the DOU, the official Emissor Nacional FAQ, or the LC 214 art. 62 text on Planalto. All quotes are secondary.
- No official count of ME/EPP service providers in the Simples. No reliable split of MEI vs ME/EPP for 2026.
- No news found on instability after January 2026, and nothing on behavior in the days before 1 Nov 2026. Check the news in the first week of November.
- No Reclame Aqui complaint counts found for the gov emissor or for the paid vendors.

## 2. Google Ads policy risk on "nfse nacional" / "emissor nacional nfse"

### Takeaway
Probably not disapproved per se, but there is real risk. The "Government documents and official services" policy (tightened in Sep 2025 and enforced from **5 Oct 2026**) targets ads for **direct acquisition of a government-issued document or service**. A third-party software that issues the taxpayer's own invoice through the official API is a private software product, not a government document. But (a) the keyword is navigational to a free gov service, (b) Google's enforcement is automated and has reached tax services, and (c) ad copy implying official status ("Emissor Nacional", "oficial", gov look-alike) would very likely get flagged under this policy or the misrepresentation policy. I found no evidence about which advertisers bid on these terms today. This needs a live SERP or Ads Transparency check.

### Cited Findings
- **VERIFIED (secondary).** Changes take effect on **5 Oct 2026**, announced in Google's change log on 4 Aug 2026. Non-government advertisers must be "authorized providers": a public government site must link to the domain and explicitly name it for that specific document or service. Business licenses, contracts and registrations do not qualify, even when government-managed. — [Search Engine Land](https://searchengineland.com/google-tightens-ads-policy-for-government-document-providers-484342); [TechWyse](https://www.techwyse.com/news/platform-updates/google-ads-government-documents-services-policy-update-october-2026); [Relevant Audience](https://www.relevantaudience.com/google-ads-en/google-ads-government-documents-services-policy-october-2026/)
- The September 2025 policy update page exists, but I could not fetch it. — [Google Ads policy update Sep 2025](https://support.google.com/adspolicy/answer/16561193?hl=en)
- **Example scope list** (Google video guide, via PPC Land): regional ID numbers, birth/death certificates, name/address changes, **business identifiers**, criminal background checks, health/welfare programs, **unclaimed tax rebates**, visas, passports, driver's licenses, vehicle registrations, hunting/fishing licenses, government lotteries. Tax filing or invoicing software is **not** listed. — [PPC Land](https://ppc.land/google-releases-video-guide-on-government-document-advertising-policy/); [Metricfixer](https://metricfixer.com/publications/online-advertising/google-ads-government-documents-policy-october-2026)
- Anecdote: an advertiser selling "Business Legal Registration and License, Tax Filing services" received disapprovals under this policy. Commenters said enforcement seems to reach tax consultancy. This is a forum post, not official. — [BlackHatWorld](https://www.blackhatworld.com/seo/google-ads-policy-issues-related-to-government-documents-and-official-services.1638803/)
- Context on scam ads in Brazil: Google sponsored links have been used to impersonate public agencies (Detran-GO etc.), and the press warns users to rely on .gov.br. The MEI annual declaration has a known pattern of sites charging for a free government service. — [Detran-GO](https://goias.gov.br/detran/2479/); [Monitor do Mercado](https://monitordomercado.com.br/noticias/348877-se-voce-e-microempreendedor-individual-desconfie-de-sites-que-cobram-taxas-para-realizar-a-sua-declaracao-anual-obrigatoria-do-mei/)
- I found no NFS-e-specific fake-ad case. — (search returned none)

### Inferences
- Classification (my reading, not Google's): a SaaS that signs the taxpayer's DPS with their own certificate and sends it to the SEFIN Nacional is a **tool**, like accounting software. It does not obtain a document from the government on the user's behalf in the way passport or visa services do. The closest risk is "business identifiers / tax" categories plus the automated classifier matching "nfse nacional" plus a landing page. ESTIMATE: low-to-moderate risk of disapproval if the copy says "software/sistema privado, não oficial" and avoids gov branding. High risk if copy or landing page imitates the gov portal.
- Brazil precedent (MEI declaration "despachantes") makes it likely Google's reviewers treat "pay to do what the government does free" with suspicion. A visible disclaimer ("Não somos o site oficial. O Emissor Nacional é gratuito em gov.br/nfse") is a prudent mitigation.
- The cheap CPC (R$1.39–9.83) and **competition index 1** on "nfse nacional" most likely reflect **navigational intent**: people looking for the free gov portal, not buyers. Established vendors bid little on it. Conversion from this term will be poor. "emissor de nfse" (competition 25, CPC up to R$22.53) is the commercial-intent term and costs 2–3x more. The real CAC should be modeled on that.

### Gaps
- No live SERP or Google Ads Transparency Center data (manifold/adplane MCP and fetch were all unavailable). I cannot confirm whether Focus NFe, NFE.io, eNotas, Conta Azul, Omie, Bling, Nuvem Fiscal, Emitte or Qipu bid on these terms or how their ads are worded. **Action:** check adstransparency.google.com for each domain plus a manual SERP for "nfse nacional" / "emissor nfse" from Brazil before spending.
- I could not read the official Oct 2026 policy text to confirm the full category list for Brazil.

## 3. Proof of recurring payment (prices, customers, revenue, acquisitions)

### Takeaway
There is strong proof that small Brazilian companies pay monthly for invoice issuance. eNotas reached about 130k companies and was bought by Hotmart. Focus NFe claims 50k+ companies. Omie has 180k+ customers and R$500M revenue (2024). Conta Azul had about 100k customers (2024). Bling was bought by Locaweb for R$524.3M. Price points for small users are about **R$49.90–R$89.90/month** for issuance-only tools and R$190+/month for API-volume plans.

### Cited Findings
- **eNotas:** acquired by **Hotmart**, announced 5 July (year appears to be 2022, from the article image path; not directly confirmed). Paid in cash plus shares, terms undisclosed. At the time it served about **130k companies** and had issued R$71bn+ in invoices over 18 months. Clients included TOTVS, Shopee, Globo. — [NeoFeed](https://neofeed.com.br/startups/capitalizada-hotmart-compra-startup-enotas-e-promete-mais-mas/); [Startups](https://startups.com.br/negocios/hotmart-volta-as-compras-e-leva-startup-enotas/)
- **Focus NFe:** homepage claims **50k+ companies**. LinkedIn says 20M+ notes. Pricing: **Solo R$89.90/month** (1 CNPJ, 100 notes, R$0.10 per extra note). **Start R$113.90/month** (3 CNPJs, R$37.90 per extra CNPJ). **Growth R$548/month** (unlimited CNPJs, 4,000 notes, R$0.12 per extra). No setup fee, no lock-in. — [Focus NFe](https://focusnfe.com.br/); [Focus NFe preços](https://focusnfe.com.br/precos/); [LinkedIn](https://br.linkedin.com/company/focus-nfe)
- **NFE.io:** NFS-e plans R$190/month (up to 250 notes), R$265 (500), R$375 (1,000). — [NFE.io preços](https://nfe.io/precos/emissao-nfse/)
- **Actana:** issuance tool from **R$49.90/month**, 10-day trial with no card. — [Actana](https://actana.com.br/emissor-de-nota-fiscal-nfe)
- **contabilidade.com:** Emissor Nacional access bundled free into online-accounting plans. This is a substitute channel: accountants bundle issuance. — [contabilidade.com](https://contabilidade.com/emissor-nacional/)
- **Omie:** 180k+ customers, 25k+ partner accountants, about 1,600 staff (2026 report). Revenue R$500M in 2024, growing about 50% a year. Target: US$1bn and 1M customers by 2030. — [Jornal Contábil](https://jornalcontabil.com.br/noticia/com-foco-nos-impactos-da-reforma-tributaria-omie-leva-inovacao-e-gestao-pratica-ao-ccav-2026/); [Bloomberg Línea](https://www.bloomberglinea.com.br/startups/na-luta-contra-o-excel-omie-dobra-a-aposta-em-contadores-e-mira-us-1-bi-em-2030/)
- **Conta Azul:** about 100k customers and a projected R$500M revenue in 2026 (figures from a 2024 article). About 20% of customers use financial services. — [Startups](https://startups.com.br/negocios/fintech/conta-azul-mira-alta-de-150-com-servicos-financeiros-para-2025/)
- **Bling:** bought by Locaweb for **R$524.3M** (2021). Locaweb's platform subscriber base (Bling+Tray+others) grew from 183.4k to 195.9k year over year in its 1Q25 presentation (not Bling-only). — [Suno](https://www.suno.com.br/noticias/locaweb-lwsa3-aquisicao-bling); [Locaweb RI 1Q25](https://api.mziq.com/mzfilemanager/v2/d/a8a11432-9651-4cc3-9064-ff466658c119/55eba443-c7f8-de83-4540-4c3dd04e49d3?origin=2)
- **New entrants are already targeting this exact moment:** berga.app and faznota publish "Emissor Nacional obrigatório em novembro" content. A TabNews post pitches an NFS-e Nacional API for the 01/11 deadline. — [berga.app](https://berga.app/blog/emissor-nacional-nfse-obrigatorio); [faznota](https://faznota.com.br/blog/emissor-nacional-nfse-ou-sistema.php); [TabNews](https://www.tabnews.com.br/nexorabr/pitch-nfs-e-nacional-obrigatoria-para-me-epp-do-simples-em-01-11-o-que-muda-no-emissor-web-e-na-api-dps-endpoints-cnc)

### Inferences
- Why companies pay instead of using the free emissor (vendors' framing plus my inference): automatic recurrence for monthly clients, integration with billing/boleto/Pix, emailing the client, batch issuance, avoiding re-typing and code errors, and multi-CNPJ for accountants. Pure single-invoice issuance is a weak reason to pay, because the gov tool is free.
- The market is crowded at both ends. ERPs (Omie, Conta Azul, Bling) bundle issuance. Accountants bundle it. API vendors (Focus, NFE.io) sell to developers. Stand-alone cheap emitters (Actana R$49.90, berga, faznota) already target this niche. Proof of payment ✓, differentiation ✗ unless the product is specifically "recurring billing plus NFS-e on autopilot for service retainers".

### Gaps
- No verified funding data for NFE.io (the search returned unrelated Neon results). No pricing found for Nuvem Fiscal, PlugNotas, Emitte, Qipu, berga or faznota.
- No current Bling-only customer number. Conta Azul numbers are from 2024.
- No Reclame Aqui counts for any vendor.

## 4. Build feasibility for a solo developer

### Takeaway
Feasible. The national system offers an **API (SEFIN Nacional for issuance, ADN for distribution/query)** that third-party software uses. The CGSN 191 text itself names "integração via API" as an allowed route. Authentication is **mTLS with the provider's own ICP-Brasil A1 e-CNPJ certificate** plus an XML signature. In practice the SaaS must hold each customer's A1 (.pfx + password), which is sensitive data to store securely. Open-source libraries already exist (PHP/Laravel, Perl). Alternatively, build on a vendor API (Focus NFe etc.), at a cost per CNPJ.

### Cited Findings
- CGSN 191 allows issuance "pela aplicação web, seja por integração via API". — [Fenacon](https://fenacon.org.br/reforma-tributaria/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026/)
- The gov.br NFS-e technical library includes an API manual for contributors (e.g., the emissor público API for administrative/judicial decisions). The national system supports "API e Web Service" for taxpayers' own systems. — [gov.br NFS-e manual](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-emissao-decisao-administrativa-e-judicial.pdf); [Edicom](https://edicomgroup.com/blog/new-national-standard-electronic-invoice-brazil)
- A developer forum describes issuing against SEFIN "produção restrita" with an **A1 e-CNPJ of the provider itself, mTLS, signed XML (XMLDSig)**. It also asks, without an answer, whether a special municipal or SEFIN enablement is needed for API issuance. — [ACBr forum](https://www.projetoacbr.com.br/forum/topic/92867-nfs-e-nacional-sefin-produ%C3%A7%C3%A3o-restrita-%E2%80%94-e999-mesmo-com-xmldsig-ok-e-dps-equivalente-ao-emissor-web/)
- NFE.io docs: ADN capture of NFS-e uses the company's certificate via mTLS, and capture is disabled without a valid certificate. — [NFE.io docs](https://nfe.io/docs/distribuicao-comum-an-vs-adn/)
- SEFIN Nacional is parameterized with each municipality's rules (rates, service codes, withholdings) and applies them at issuance. — [Londrina NT 2025-001](https://repositorio.londrina.pr.gov.br/index.php/menu-fazenda/ggf/nfse-nacional/71715-nt-2025-001-implantacao-da-nfse-padrao-nacional/file)
- Open-source packages implement DPS, A1 signing, SEFIN send, ADN parameter queries, cancel/replace and DANFSE download. — [rumbleh/laravel-nfse](https://packagist.org/packages/rumbleh/laravel-nfse); [gildonei/nfse-nacional](https://packagist.org/packages/gildonei/nfse-nacional); [Business::BR::NFSe](https://metacpan.org/pod/Business::BR::NFSe)
- Developer pitfall: MEI XML is rejected if the aliquot (pAliq) is sent as zero. — [Suno/ACBr excerpt via search](https://www.projetoacbr.com.br/forum/profile/114227-jo%C3%A3o-carlos-gielow/content/)
- ME/EPP already need a digital certificate (or a username/password) to log in to the free emissor, since gov.br login is MEI-only (vendor source citing the official FAQ). — [berga.app](https://berga.app/blog/como-emitir-nfse-padrao-nacional)
- Vendor API pricing: Focus NFe Solo R$89.90 per CNPJ per month (too expensive to resell at R$49). Growth R$548/month for unlimited CNPJs and 4,000 notes. NFE.io from R$190/month. — [Focus NFe preços](https://focusnfe.com.br/precos/); [NFE.io](https://nfe.io/precos/emissao-nfse/)

### Inferences
- **A1 friction:** ME/EPP: moderate. Many already have an e-CNPJ for eCAC/Simples, and the free emissor's own login pushes them toward one. MEI: high. MEIs use gov.br login and rarely own an A1, so a paid MEI product requires buying a certificate (ESTIMATE about R$150–250/year, not verified), which kills the value proposition at a low price point. **Target ME/EPP first, not MEI.**
- **Vendor-API dependence:** using Focus/NFE.io is a normal supplier relationship, not a "partner" in the owner's sense. But the unit economics only work on the Growth plan (R$548 fixed). Per customer, that is about R$5.50 at 100 customers × 10 notes. Below about 15–20 customers it costs more than direct integration. A solo dev can integrate SEFIN directly using the open-source libraries. The vendor fallback covers municipalities that are not yet on the national system.
- Main technical risks: service-code mapping per municipality, municipalities not yet live on the national system, the CBS/IBS fields required from 1 Jan 2027 (a schema change to maintain), secure custody of customers' A1 certificates (LGPD and security liability), and API instability like that seen in Jan 2026.

### Gaps
- I did not confirm whether third-party software needs any registration or enablement with SEFIN, or whether issuing via a procurador certificate (e.g., the software company's own e-CNPJ with a power of attorney) is accepted.
- No verified cost of an A1 e-CNPJ in 2026. No Nuvem Fiscal or PlugNotas prices.

## 5. Economics sketch (assumptions marked)

### Takeaway
LTV/CAC is plausible at ≥3 only if traffic comes from commercial-intent terms and onboarding (A1 upload) converts well. On the navigational head term "nfse nacional" it is likely below 2. The variance is wide, so test with R$1–2k before committing.

### Cited Findings
- Competitor price anchors: Actana R$49.90/month, Focus Solo R$89.90/month, NFE.io R$190/month. — [Actana](https://actana.com.br/emissor-de-nota-fiscal-nfe); [Focus NFe](https://focusnfe.com.br/precos/); [NFE.io](https://nfe.io/precos/emissao-nfse/)
- Generic SaaS churn benchmarks: 3–8% per month on average (attributed to Recurly 2023). Self-serve below US$1k ACV runs 5–7% per month. A Chilean SMB SaaS cited at 3.5% per month. Low-quality sources, order-of-magnitude only. — [Rework](https://resources.rework.com/pt/libraries/pipeline-management/churn-rate); [Ecosistema Startup](https://ecosistemastartup.com/?p=59797)
- CPC inputs (owner's Keyword Planner): "nfse nacional" R$1.39–9.83; "emissor de nfse" R$3.97–22.53.

### Inferences
All figures below are ESTIMATES built from these assumptions:
- Price R$59/month. Gross margin about 85% after infrastructure plus optional vendor-API share, so about R$50/month contribution.
- **Base case:** blended CPC R$5. Click→trial 4%. Trial→paid 15%, so click→paid 0.6% and **CAC ≈ R$833**. Churn 5%/month gives a 20-month life, so **LTV ≈ R$1,000 and LTV/CAC ≈ 1.2** ✗.
- **Good case** (commercial long-tail such as "emitir nota fiscal recorrente", "emissor nfse automático", good landing page): CPC R$4, click→paid 1.5%, so **CAC ≈ R$267**. Churn 3% gives a 33-month life, so **LTV ≈ R$1,650 and LTV/CAC ≈ 6** ✓.
- **Bad case** (navigational "nfse nacional" traffic looking for free gov.br): CPC R$2, click→paid 0.2%, so **CAC ≈ R$1,000** and LTV/CAC is about 1 ✗.
- The break point is a click→paid rate of about 1% at CPC R$4–5 with churn ≤4%. That is achievable for a strong-intent niche offer ("recurring retainer invoices on autopilot"), not for "I need the free emissor".
- Retention tailwind: invoicing software is sticky once certificate and recurring schedules are configured. ESTIMATE: churn could be 2–4% for ME/EPP with recurring clients. Headwind: accountants and ERPs bundle the same feature.
- Seasonality risk: the demand spike is tied to the 1 Nov 2026 deadline. Base volume after the peak is unknown, and the 110k average is inflated by the ramp.

### Gaps
- No Brazilian SMB trial-to-paid benchmark found. No vendor churn data (Focus, NFE.io, eNotas) found.
- No measured conversion data. Requires a real test campaign.

## 6. Verdict against gates

### Takeaway
**Conditional pass / medium confidence.** The demand, recurring-payment and buildability gates pass. Real pain passes, but it is change-driven and partly covered by a free tool. Ads/legal risk is moderate, not low. LTV/CAC ≥3 is plausible only with a sharp "recurring NFS-e on autopilot for ME/EPP service providers" position and commercial keywords. Recommend a **2–4 week paid validation** (landing page plus waitlist or trial, R$1–2k budget, copy marked "software privado, não oficial") before a full build.

### Cited Findings
- Demand gate: owner-provided Keyword Planner data. "nfse nacional" averages 110k/month and "emissor nacional nfse" 27.1k, both ≥20k ✓. The trigger is confirmed by the 1 Nov 2026 obligation. — [LegisWeb](https://www.legisweb.com.br/noticia/?id=34185)
- Recurring payment ✓: eNotas about 130k companies (acquired by Hotmart), Focus NFe 50k+, Omie 180k+ customers and R$500M revenue. — [NeoFeed](https://neofeed.com.br/startups/capitalizada-hotmart-compra-startup-enotas-e-promete-mais-mas/); [Focus NFe](https://focusnfe.com.br/); [Bloomberg Línea](https://www.bloomberglinea.com.br/startups/na-luta-contra-o-excel-omie-dobra-a-aposta-em-contadores-e-mira-us-1-bi-em-2030/)
- Software-only ✓: official API route plus open-source libraries. — [Fenacon](https://fenacon.org.br/reforma-tributaria/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026/); [laravel-nfse](https://packagist.org/packages/rumbleh/laravel-nfse)
- Ads risk ⚠: Google's policy enforced from 5 Oct 2026, with automated enforcement reaching tax services anecdotally. — [TechWyse](https://www.techwyse.com/news/platform-updates/google-ads-government-documents-services-policy-update-october-2026); [BlackHatWorld](https://www.blackhatworld.com/seo/google-ads-policy-issues-related-to-government-documents-and-official-services.1638803/)
- Pain ✓ (moderate): instability, manual monthly recurrence, certificate login for ME/EPP. — [Fenacon](https://fenacon.org.br/reforma-tributaria/contadores-relatam-instabilidade-para-emissao-de-nfs-e-nacional-receita-orienta-buscar-os-municipios/); [faznota](https://faznota.com.br/blog/emissor-nacional-nfse-ou-sistema.php)

### Inferences
| Gate | Result | Confidence |
|---|---|---|
| Measured demand ≥20k | ✓ (110k / 27.1k avg), but mostly navigational and seasonal around the deadline | High on volume, low on buyer intent |
| Proof of recurring payment | ✓ eNotas, Focus, Omie, Conta Azul, Bling | High |
| LTV/CAC ≥3 plausible | ⚠ only in the good case (needs ≥1% click→paid, ≤4% churn) | Low–medium (all assumptions) |
| Software-only buildable | ✓ API plus libraries. A1 custody and service-code mapping are the hard parts | Medium-high |
| Low ads/legal risk | ⚠ moderate: government-docs/misrepresentation risk on gov-named keywords. LGPD liability for certificate custody | Medium |
| Real pain | ✓ for ME/EPP with recurring clients. Weak for occasional issuers (free tool suffices) and for MEI (A1 cost) | Medium |
- Key differentiator to test: scheduled recurring NFS-e for monthly clients, auto-email PDF/XML, Pix/boleto charge link, pre-validated service codes, "upload your A1 once". Price R$49–69. Target ME/EPP service providers (agencies, consultants, clinics, IT freelancers with a PJ). Exclude MEI from paid acquisition at first.
- Keyword strategy: put "nfse nacional"/"emissor nacional" in a separate, capped campaign with "gratuito/gov/login/portal" negatives. Prioritize "emissor de nfse", "emitir nota fiscal de serviço", and long-tail "recorrente/automática".

### Gaps
- Live advertiser and ad-copy evidence (Ads Transparency/SERP) is missing and is the most important pre-spend check.
- Post-deadline (Nov 2026+) search baseline unknown.
- Whether Google's classifier disapproves NFS-e software ads in Brazil is unverified empirically. Test with one small ad group first.
