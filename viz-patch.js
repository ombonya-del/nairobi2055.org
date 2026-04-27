// Nairobi 2055 — VIZ runtime patch
// Fixes frozen panels for EV_CARGO_TRIKE and E_MKOKOTENI
(function(){
  if(!window.VIZ) return;
  var E={
    EV_CARGO_TRIKE:{t:'Cargo E-Trike Network — Replacing the Handcart',s:'80,000 operators formalised',m:'ev_cargo_trike'},
    E_MKOKOTENI:{t:'E-Mkokoteni — Electric Cargo Trike Programme',s:'Voluntary buyback · 5,000 handcarts',m:'e_mkokoteni'}
  };
  Object.keys(E).forEach(function(k){
    if(VIZ[k]) return;
    var e=E[k];
    VIZ[k]={
      title:e.t, subtitle:e.s,
      getMap:function(){return(document.getElementById('viz-tpl-'+e.m+'-map')||{}).innerHTML||'';},
      getPanel:function(){return(document.getElementById('viz-tpl-'+e.m+'-panel')||{}).innerHTML||'';}
    };
  });
  // Patch getVizKey for missing title variants
  if(window.getVizKey){
    var orig=window.getVizKey;
    window.getVizKey=function(t){
      if(!t) return null;
      var u=t.toUpperCase();
      if(u.includes('E-MKOKOTENI')||u.includes('MKOKOTENI E-TRIKE')||u.includes('HANDCART BUYBACK')||u.includes('CARGO E-TRIKE NETWORK')||u.includes('HANDCART FORMALISATION')) return 'E_MKOKOTENI';
      if(u.includes('CARGO E-TRIKE')||u.includes('EV CARGO TRIKE')) return 'EV_CARGO_TRIKE';
      return orig(t);
    };
  }
})();
