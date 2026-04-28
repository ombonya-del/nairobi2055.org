// Nairobi 2055 VIZ runtime patch v4
// Injects missing templates + VIZ entries + getVizKey routing
(function(){
  if(!window.VIZ||!window.getVizKey) return;




  // Inject MKOKOTENI_TECH template if missing
  if(!document.getElementById('viz-tpl-mkokoteni_tech-map')){
    var m=document.createElement('template');
    m.id='viz-tpl-mkokoteni_tech-map';
    m.innerHTML='<svg viewBox="0 0 544 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;border-radius:10px"><rect width="544" height="500" fill="#1A1D16" rx="10"/><text x="20" y="28" fill="#F0EAD6" font-size="13" font-weight="700" font-family="Georgia,serif">Mkokoteni → E-Trike: The Vehicle Transition</text><text x="20" y="44" fill="#A0A898" font-size="9" font-family="system-ui">Technical comparison · Embakasi local assembly · Hire-purchase economics · 4× more productive</text><rect x="20" y="54" width="504" height="20" fill="rgba(93,191,122,0.12)" rx="4"/><text x="272" y="68" text-anchor="middle" fill="#5DBF7A" font-size="8" font-weight="700" font-family="system-ui">SAME OPERATOR · SAME ROUTES · ENTIRELY DIFFERENT MACHINE · 4× MORE PRODUCTIVE</text><rect x="20" y="84" width="238" height="202" fill="#21251C" rx="7" stroke="#E85050" stroke-width="1.2"/><text x="139" y="104" text-anchor="middle" fill="#E85050" font-size="10" font-weight="700" font-family="system-ui">MKOKOTENI (TODAY)</text><text x="139" y="118" text-anchor="middle" fill="#A0A898" font-size="7.5" font-family="system-ui">Wooden/steel frame · 4 wheels · human-powered</text><line x1="30" y1="128" x2="250" y2="128" stroke="#E85050" stroke-width="0.5" opacity=".3"/><text x="32" y="144" fill="#C4BFA8" font-size="8" font-family="system-ui">Power:</text><text x="100" y="144" fill="#E85050" font-size="8" font-family="system-ui">Human muscle only</text><text x="32" y="158" fill="#C4BFA8" font-size="8" font-family="system-ui">Capacity:</text><text x="100" y="158" fill="#C4BFA8" font-size="8" font-family="system-ui">50–100kg practical max</text><text x="32" y="172" fill="#C4BFA8" font-size="8" font-family="system-ui">Speed:</text><text x="100" y="172" fill="#C4BFA8" font-size="8" font-family="system-ui">3–5 km/h loaded</text><text x="32" y="186" fill="#C4BFA8" font-size="8" font-family="system-ui">Weather:</text><text x="100" y="186" fill="#E85050" font-size="8" font-family="system-ui">Rain 
    document.body.appendChild(m);
  }




  if(!document.getElementById('viz-tpl-mkokoteni_tech-panel')){
    var p=document.createElement('template');
    p.id='viz-tpl-mkokoteni_tech-panel';
    p.innerHTML='<div class="vsect">Global Benchmark</div><a class="bench-link" href="https://roam-electric.com/" target="_blank" rel="noopener"><div class="cmp-flag">🇰🇪</div><div><div class="cmp-cn">Roam Electric — Nairobi EV Assembly Proof</div><div class="cmp-sy">Roam already assembles electric motorcycles in Nairobi, proving local EV assembly in Kenya is commercially viable. The Embakasi cargo trike hub scales this model — same supply chain, larger vehicle, higher margins per unit.</div></div><div class="ext-ico">↗</div></a><a class="bench-link" href="https://www.unep.org/resources/report/electric-vehicles-africa" target="_blank" rel="noopener"><div class="cmp-flag">🌍</div><div><div class="cmp-cn">UNEP — Electric Vehicles in Africa</div><div class="cmp-sy">UNEP identifies cargo e-trikes as the highest-impact EV category for African cities — greater emissions reduction per dollar than cars or buses. Kenya’s 16% import duty exemption on EV components makes the economics stronger still.</div></div><div class="ext-ico">↗</div></a><a class="bench-link" href="https://www.ctc-n.org/news/nigeria-coldhubs" target="_blank" rel="noopener"><div class="cmp-flag">🇳🇬</div><div><div class="cmp-cn">Nigeria — ColdHubs Cold-Chain Last-Mile</div><div class="cmp-sy">ColdHubs demonstrated solar-powered cold storage + e-trike last-mile delivery reaches informal markets profitably. The cold-chain attachment box — the premium tier for Gikomba perishables — doubles revenue per trip.</div></div><div class="ext-ico">↗</div></a><div class="vsect2">4 Design Lessons</div><div class="lsn"><span class="lsn-n">1</span><span><strong>48V is the right voltage</strong> — lighter, safer (below shock hazard), cheaper to maintain, chargeable from solar without complex inverters. 72V gives more speed but unnecessary complexity for urban cargo work at Nairobi scale.</span></div><div class="lsn"><span class="lsn-n">2</span><span><strong>Local frame fabrication is non-negotiable</strong> — an imported frame severs the circular economy link. Matatu scrap steel → trike frame is the value chain that makes this intervention transformative for Nairobi manufacturing, not just transport.</span></div><div class="lsn"><span class="lsn-n">3</span><span><strong>Cold-chain box is the premium product</strong> — the standard cargo platform is the base. The insulated cold-chain box for Gikomba and Marikiti perishables doubles revenue per trip. Ward cooperatives own the boxes collectively.</span></div><div class="lsn"><span class="lsn-n">4</span><span><strong>GPS + M-Pesa builds the first credit history</strong> — 2 years of delivery logs and M-Pesa transactions gives an operator a formal financial record for the first time. This unlocks bank accounts, business loans, and housing finance previously inaccessible.</span></div>';
    document.body.appendChild(p);
  }




  // VIZ entries
  var E={
    EV_CARGO_TRIKE:{t:'Cargo E-Trike Network — City Logistics System',s:'80,000 operators · 5 hub zones · 85 ward cooperatives',m:'ev_cargo_trike'},
    E_MKOKOTENI:{t:'E-Mkokoteni — The Handcart Worker’s Journey',s:'Ibrahim’s day before & after · The buyback · Dignity',m:'e_mkokoteni'},
    MKOKOTENI_TECH:{t:'Mkokoteni → E-Trike: The Vehicle Transition',s:'Technical comparison · Embakasi assembly · 4× more productive',m:'mkokoteni_tech'},
    ACT2055:{t:'Nairobi 2055 Act — Statutory Entrenchment',s:'County Assembly · National Assembly · Senate',m:'act2055'}
  };
  Object.keys(E).forEach(function(k){
    if(VIZ[k]) return;
    var e=E[k];
    VIZ[k]={title:e.t,subtitle:e.s,
      getMap:function(){return(document.getElementById('viz-tpl-'+e.m+'-map')||{}).innerHTML||'';},
      getPanel:function(){return(document.getElementById('viz-tpl-'+e.m+'-panel')||{}).innerHTML||'';}
  // Override getVizKey - must intercept BEFORE orig for conflicting titles
  var _origGVK=window.getVizKey;
  window.getVizKey=function(t){
    if(!t) return null;
    var u=t.toUpperCase();
    // These exact P-data titles must be intercepted BEFORE orig is called
    if(u==='CARGO E-TRIKE NETWORK — HANDCART FORMALISATION'||u==='CARGO E-TRIKE NETWORK -- HANDCART FORMALISATION') return 'EV_CARGO_TRIKE';
    if(u.includes('MKOKOTENI E-TRIKE TRANSITION')||u.includes('MKOKOTENI TRIKE')) return 'MKOKOTENI_TECH';
    if(u.includes('HANDCART FORMALISATION')) return 'EV_CARGO_TRIKE';
    if(u.includes('E-MKOKOTENI')||u.includes('HANDCART BUYBACK')) return 'E_MKOKOTENI';
    if(u.includes('NAIROBI 2055 ACT')||u.includes('STATUTORY ENTRENCHMENT')||u.includes('MASTERPLAN BILL')) return 'ACT2055';
    return _origGVK(t);
  };
