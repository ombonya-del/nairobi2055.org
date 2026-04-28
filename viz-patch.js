// Nairobi 2055 VIZ runtime patch v3 - all missing entries + routing
(function(){
  if(!window.VIZ||!window.getVizKey) return;
  var E={
    EV_CARGO_TRIKE:{t:'Cargo E-Trike Network — City Logistics System',s:'80,000 operators · 5 hub zones · 85 ward cooperatives · BRT last-mile feeder',m:'ev_cargo_trike'},
    E_MKOKOTENI:{t:'E-Mkokoteni — The Handcart Worker’s Journey',s:'Who mkokoteni operators are · Ibrahim’s day · The buyback · Dignity is the real measure',m:'e_mkokoteni'},
    MKOKOTENI_TECH:{t:'Mkokoteni → E-Trike: The Vehicle Transition',s:'Technical comparison · Embakasi assembly · Hire-purchase economics · 4× more productive',m:'mkokoteni_tech'},
    ACT2055:{t:'Nairobi 2055 Act — Statutory Entrenchment',s:'County Assembly · National Assembly · Senate · Binding all future administrations',m:'act2055'}
  };
  Object.keys(E).forEach(function(k){
    if(VIZ[k]) return;
    var e=E[k];
    VIZ[k]={title:e.t,subtitle:e.s,
      getMap:function(){return(document.getElementById('viz-tpl-'+e.m+'-map')||{}).innerHTML||'';},
      getPanel:function(){return(document.getElementById('viz-tpl-'+e.m+'-panel')||{}).innerHTML||'';}
    };
  });
  var orig=window.getVizKey;
  window.getVizKey=function(t){
    if(!t) return null;
    var u=t.toUpperCase();
    if(u.includes('MKOKOTENI E-TRIKE TRANSITION')||u.includes('VEHICLE TRANSITION')||u.includes('MKOKOTENI TRIKE')) return 'MKOKOTENI_TECH';
    if(u.includes('CARGO E-TRIKE NETWORK')||u.includes('HANDCART FORMALISATION')) return 'EV_CARGO_TRIKE';
    if(u.includes('E-MKOKOTENI')||u.includes('HANDCART BUYBACK')||u.includes('MKOKOTENI E-TRIKE')) return 'E_MKOKOTENI';
    if(u.includes('CARGO E-TRIKE')||u.includes('EV CARGO TRIKE')) return 'EV_CARGO_TRIKE';
    if(u.includes('NAIROBI 2055 ACT')||u.includes('STATUTORY ENTRENCHMENT')||u.includes('MASTERPLAN BILL')) return 'ACT2055';
    return orig(t);
  };
})();
