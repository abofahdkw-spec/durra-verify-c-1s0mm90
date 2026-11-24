/* الاسم المعروض للشركة — مصدر واحد لكل الصفحات */
(function(){
  var DEFAULT='اسم الشركة';
  var GKEY='durra_company_name_global';
  function keyFor(id){ return 'durra_company_name_'+(id||'default'); }
  function get(){
    try{ var s=localStorage.getItem(GKEY); return (s&&s.trim())?s:DEFAULT; }
    catch(e){ return DEFAULT; }
  }
  function getFor(id){
    try{ var s=localStorage.getItem(keyFor(id)); if(s&&s.trim()) return s; }catch(e){}
    return get();
  }
  function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}); }
  function split(name){
    var n=String(name||DEFAULT);
    var p=n.replace(/^شركة\s*/,'').split(/\s+(?=للتجارة|لل)/);
    return { main:p[0]||n, sub:p.slice(1).join(' ') };
  }
  function notify(){
    try{ window.dispatchEvent(new Event('durra:company-changed')); }catch(e){}
    try{ if(window.durra&&window.durra.setCompanyName) window.durra.setCompanyName(get()); }catch(e){}
  }
  function set(name,id){
    name=String(name||'').trim(); if(!name) name=DEFAULT;
    try{ localStorage.setItem(GKEY,name); if(id) localStorage.setItem(keyFor(id),name); }catch(e){}
    notify();
  }
  window.DurraCompany={ get:get, getFor:getFor, set:set, esc:esc, split:split, DEFAULT:DEFAULT, notify:notify };
  function apply(){
    var name=get(), parts=split(name);
    function each(sel,fn){ var n=document.querySelectorAll(sel); for(var i=0;i<n.length;i++) fn(n[i]); }
    each('[data-company-name]',function(el){ el.textContent=name; });
    each('[data-company-main]',function(el){ el.textContent=parts.main; });
    each('[data-company-sub]',function(el){ el.textContent=parts.sub; });
    each('[data-company-empty]',function(el){ el.textContent=''; });
    document.title=document.title.split(DEFAULT).join(name);
    notify();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply); else apply();
})();
