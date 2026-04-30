// Nairobi 2055 — viz-patch.js v6 (Georgia fonts + illustrated vehicles)
(function(){
  var orig = window.getVizKey;
  window.getVizKey = function(t){
    if(!t) return null;
    var u = t.toUpperCase();
    if(u.includes('MKOKOTENI E-TRIKE TRANSITION')||u.includes('VEHICLE TRANSITION')||u.includes('MKOKOTENI TECH')) return 'MKOKOTENI_TECH';
    if(u.includes('CARGO E-TRIKE NETWORK')||u.includes('HANDCART FORMALISATION')) return 'EV_CARGO_TRIKE';
    if(u.includes('E-MKOKOTENI')||u.includes('HANDCART BUYBACK')||u.includes('HANDCART WORKER')) return 'E_MKOKOTENI';
    if(u.includes('NAIROBI 2055 ACT')||u.includes('STATUTORY ENTRENCHMENT')||u.includes('MASTERPLAN BILL')) return 'ACT2055';
    return orig ? orig(t) : null;
  };

  function injectTemplate(id, html){
    if(document.getElementById(id)) return;
    var t = document.createElement('template');
    t.id = id;
    t.innerHTML = html;
    document.body.appendChild(t);
  }

  function addVIZ(key, title, sub, mapId, panelId){
    if(!window.VIZ || window.VIZ[key]) return;
    window.VIZ[key]={title:title,subtitle:sub,
      getMap:function(){return(document.getElementById(mapId)||{}).innerHTML||'';},
      getPanel:function(){return(document.getElementById(panelId)||{}).innerHTML||'';}
    };
  }

  document.addEventListener('DOMContentLoaded',function(){
    // Only inject templates if missing (index.html has them already)
    addVIZ('EV_CARGO_TRIKE','Cargo E-Trike Network — City Logistics System','80,000 operators · 5 hub zones · 85 ward cooperatives · BRT last-mile feeder','viz-tpl-ev_cargo_trike-map','viz-tpl-ev_cargo_trike-panel');
    addVIZ('E_MKOKOTENI','E-Mkokoteni — The Handcart Worker’s Journey','Who mkokoteni operators are · The vehicles · The transition · Dignity as the measure','viz-tpl-e_mkokoteni-map','viz-tpl-e_mkokoteni-panel');
    addVIZ('MKOKOTENI_TECH','Mkokoteni E-Trike Transition — The Vehicle','Side-by-side specs · Embakasi assembly · Hire-purchase economics · Cooperative model','viz-tpl-mkokoteni_tech-map','viz-tpl-mkokoteni_tech-panel');
    addVIZ('ACT2055','Nairobi 2055 Act — Statutory Entrenchment','County Assembly · National Assembly · Senate · Binding all future administrations','viz-tpl-act2055-map','viz-tpl-act2055-panel');
  });
})();
