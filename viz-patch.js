// Nairobi 2055 viz-patch.js v9
(function(){
  var orig = window.getVizKey;
  window.getVizKey = function(t){
    if(!t) return null;
    var u = t.toUpperCase();
    if(u.indexOf('CARGO E-TRIKE NETWORK')>=0) return 'EV_CARGO_TRIKE';
    if(u.indexOf('HANDCART FORMALISATION')>=0) return 'EV_CARGO_TRIKE';
    if(u.indexOf('E-MKOKOTENI')>=0) return 'E_MKOKOTENI';
    if(u.indexOf('HANDCART BUYBACK')>=0) return 'E_MKOKOTENI';
    if(u.indexOf('MKOKOTENI E-TRIKE TRANSITION')>=0) return 'MKOKOTENI_TECH';
    if(u.indexOf('VEHICLE TRANSITION')>=0) return 'MKOKOTENI_TECH';
    if(u.indexOf('NAIROBI 2055 ACT')>=0) return 'ACT2055';
    if(u.indexOf('STATUTORY ENTRENCHMENT')>=0) return 'ACT2055';
    return orig ? orig(t) : null;
  };
})();
