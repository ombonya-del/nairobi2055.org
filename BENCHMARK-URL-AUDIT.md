# Benchmark URL audit — Nairobi 2055

Scope: ~278 unique external benchmark/reference URLs (`bench-link`, `also-link`,
`bench-item`). Checked for (i) broken 404/403, (ii) relevance, (iii) Wikipedia.

---

## PART 1 — FIXED (committed)
All confirmed issues corrected in `index.html`:

| Case | Was | Now |
|---|---|---|
| 2026 Kenya Floods (×2, **Wikipedia**) | `en.wikipedia.org/wiki/2026_Kenya_floods` | ReliefWeb — Nairobi flooding & displacement |
| Rotterdam — Benthemplein Water Square (**404**) | `rotterdam.nl/…/benthempleinwaterplein/` | `urbanisten.nl/work/benthemplein` (designer's page) |
| Durban — Riparian relocation (**404**) | `durban.gov.za/City_Services/…climate_protection/` | weADAPT — Transformative Riverine Management |
| Medellín — Urban Acupuncture (**dead + generic**) | `medellin.gov.co/` | Metropolis — "Juan Bobo" case study |
| Chengdu 100 Parks (**wrong country**) | `addisababacity.gov.et/` (Addis!) | World Cities Culture Forum — Chengdu Park City |
| Helsinki 3D City Model (**wrong link**) | `whimapp.com` (the MaaS app) | `hel.fi/…/helsinki-3d` (official) |
| EdTech / KENET (**typo domain**) | `kenia.go.ke` | `kenet.or.ke` |
| Mathare Youth Sports (MYSA) (**generic**) | `kenya.go.ke/` | `mysakenya.org` |
| Swahili Content (**irrelevant**) | `africanunion.org/` | UNESCO — World Kiswahili Language Day |

Wikipedia links remaining: **0**.

---

## PART 2 — link-checker sweep: COMPLETE

Ran `check-benchmark-links.sh` (real HTTP from an unrestricted machine) over all 142
benchmark URLs. Result: 57 flagged. Triage + fixes:

**Fixed (~38 links, relevance-matched live replacements found via web search):**
Perry Preschool→highscope /project/; UN-Habitat Nairobi Profile PDF; BDRCS CPP (slug
fix); Tokyo J-Alert/Jichikai→TMG bosai; ILO green-jobs cards→WRI Ruhr / Ajira Digital /
ILO green-jobs-initiative; JICA Dhaka→JICA Bangladesh; JTC→juronginnovationdistrict &
one-north estate; ready.gov NRF→FEMA; WIEGO waste-pickers (working slug); CcHUB→
cchubnigeria.com; Kenya Vision2030 legal→vision2030.go.ke; LA UAM→Urban Movement Labs;
Singapore LTP→URA; NParks Community-in-Bloom→gardeningsg; Kallang River→PUB Bishan;
HOT→hotosm.org; scrap-to-rail→DB Cargo; Rotterdam→C40; Seoul→seoulsolution 2030 plan /
english.seoul.go.kr; SEWA→Mahila Housing Trust; Addis Renewal→Arup; Entoto Park→
entoto-natural-park.org; Rwanda sport (typo minispot→minisports.gov.rw); AP RTGS→
rtgs.ap.gov.in; UK creative→gov.uk; Istanbul Metrobüs→C40; Lamu→UNESCO WHC 1055;
Mumbai drains→FPJ; Ibirapuera→parquedoibirapuera.org; GoDown→thegodown.org; Accra EV→
electrive; Douta Seck→culture.gouv.sn; SPLUMA→gov.za; Thailand UHC→TDRI; Medellín
Metro→metrodemedellin, transformation→ArchDaily, Metrocable→CPI; Ghana/Tern/kaptis/
silafrica/parliament.go.rw→relevant live sources.

**Left as-is — false positives (live sites that block bots, verified by inspection):**
All 403s (UNESCO WHC, FEMA, IFRC, London.gov, UNEP, UNDRR, PreventionWeb, Amsterdam,
si.edu, Curitiba, NDRRMC, elbil) + `jumia.com.ke` and `whimapp.com` (both returned 000
to curl but render fine in a browser; whimapp.com is the correct Whim MaaS target).

Re-run `./check-benchmark-links.sh` any time to re-verify. Remaining `>>>` lines after
this will be the bot-block false positives above.

---

## PART 2 (original) — full sweep: findings + limitation

### Relevance (all 278, by inspection)
139 links point at a bare homepage/portal. **Most are legitimately the official site**
for that thing (e.g. `what3words.com`, `x-road.global`, `thehighline.org`,
`centralparknyc.org`) and are fine. The genuine mismatches were the ones fixed in Part 1.
No further clear mismatches found on inspection.

### Still dead (fix recommended)
- **Medellín — POT** → `medellin.gov.co/irj/portal/medellin` also times out. Suggested:
  point at the same Metropolis Juan Bobo case, or a Medellín POT planning source.

### Reachability sweep — NOT reliable for 404s
A cross-origin (no-cors) reachability sweep of all 355 external URLs flagged 68 as
"unreachable" — **but this method is too noisy to trust**: many major live sites
(amref.org, ilo.org, bloomberg.org, london.gov.uk, legislation.gov.za, marinabay.sg,
nuveen.com, karnataka.gov.in, citiesalliance.org, itf-oecd.org …) block cross-origin
fetch and show up as false positives. no-cors also can't see page-level 404s on live
domains (which is how the Rotterdam/Durban ones broke). So it can't be the authority.

**Obscure domains from the sweep worth a manual spot-check** (may be genuine 404s or
just fetch-blocking — verify by opening each):
`lamata.lagosstate.gov.ng/brt-lite/`, `ndrrmc.gov.ph`, `minispot.gov.rw`, `erc.et`,
`ibb.istanbul/en`, `kenyadiasporainvestment.com`, `ams-global.com/drone-emergency-services`,
`digitalskillsafrica.com`, `cchub.ng`, `mlgrd.gov.gh`, `nhso.go.th/eng/`,
`ibirapuera.org.br`, `museudofutebol.org.br`, `konza.go.ke`, `ilabnafrica.strathmore.edu`,
`cities4rights.uclg.org/…`, `lespace.africa`, `mabonengprecinct.com`, `nairobiriver.org`,
`kaptis.com`, `gwopa.org`, `godown.or.ke`, `lamuarchipelago.org`, `bibb.de/en/`.

### Recommended for a definitive 404/403 pass
Browser fetch and `web_fetch` both hit walls at this scale (CORS noise / timeouts). A
proper HTTP link-checker (server-side HEAD/GET) is the reliable tool. Options:
- Run `lychee` (Rust) or `linkchecker` locally against the built site, or
- Point an online broken-link checker (e.g. W3C, deadlinkchecker.com) at the deployed
  `nairobi2055.org`.
That will return real status codes for all 278 in one pass. I can then fix whatever it flags.
