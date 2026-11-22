/* Famous Jalyuzi: sayt. Ma'lumot data.json dan o'qiladi. */
(function(){
"use strict";

var D = null, curCat = "all";
var PREVIEW_KEY = "fj_preview";

function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function fmt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ")}
function catOf(id){return (D.categories||[]).filter(function(c){return c.id===id})[0]||{}}
function visible(){return (D.products||[]).filter(function(p){return !p.hidden})}

/* Instagram havolasidan toza permalink */
function igPermalink(url){
  var m=String(url||"").match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if(!m) return null;
  var kind=m[1].toLowerCase()==="reels"?"reel":m[1].toLowerCase();
  return "https://www.instagram.com/"+kind+"/"+m[2]+"/";
}
function igUser(v){ v=String(v||"").trim(); if(!v) return ""; var m=v.match(/instagram\.com\/([A-Za-z0-9_.]+)/); return (m?m[1]:v).replace(/^@/,""); }
function tgUser(v){ v=String(v||"").trim(); if(!v) return ""; var m=v.match(/t\.me\/([A-Za-z0-9_]+)/); return (m?m[1]:v).replace(/^@/,""); }

/* rasm yoki chizilgan namuna */
function swatch(style,c1,c2){
  var n={drape:4,pleat:1,roll:2,zebra:1,mesh:1,slats:1}[style]||1;
  return '<div class="sw sw--'+esc(style||"roll")+'" style="--c1:'+esc(c1||"#b9a98c")+';--c2:'+esc(c2||"#efe8da")+'">'+new Array(n+1).join("<i></i>")+'</div>';
}
function media(img,style,c1,c2,alt){
  return img ? '<img src="'+esc(img)+'" alt="'+esc(alt)+'" loading="lazy">' : swatch(style,c1,c2);
}

function renderHero(){
  var s=D.settings||{};
  $("#heroTitle").textContent=s.heroTitle||"";
  $("#heroText").textContent=s.heroText||"";
  if(s.heroImg){ var a=$("#heroArt"); a.innerHTML=""; a.style.backgroundImage='url("'+s.heroImg.replace(/"/g,"%22")+'")'; }
  var soc="", tg=tgUser(s.telegram), ig=igUser(s.instagram);
  if(s.phone) soc+='<a class="ph" href="tel:'+esc(s.phone.replace(/[^\d+]/g,""))+'" aria-label="Qo\'ng\'iroq"><svg viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .3-1A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg><span>'+esc(s.phone)+'</span></a>';
  if(tg) soc+='<a class="tg" href="https://t.me/'+esc(tg)+'" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.3z"/></svg><span>Telegram</span></a>';
  if(ig) soc+='<a class="ig" href="https://instagram.com/'+esc(ig)+'" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 8c-.1-1.6-.4-3-1.6-4.2S17.6 2.2 16 2.1C14.4 2 9.6 2 8 2.1 6.4 2.2 5 2.5 3.8 3.7S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.4.2-8zm-2.1 9.8a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.3 3.3 0 0 1 6.6 4.6c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z"/></svg><span>Instagram</span></a>';
  $("#social").innerHTML=soc;
}

function renderFeatured(){
  var cats=(D.categories||[]).filter(function(c){return c.featured});
  if(!cats.length) cats=(D.categories||[]).slice(0,3);
  $("#featured").innerHTML=cats.map(function(c){
    var first=visible().filter(function(p){return p.cat===c.id&&p.img})[0];
    var img=c.img||(first&&first.img)||"";
    return '<article class="card"><div class="card__img">'+media(img,c.style,c.c1,c.c2,c.name)+'</div>'+
      '<div class="card__b"><h3>'+esc(c.name)+'</h3><button class="btn btn--gold btn--sm" data-cat="'+esc(c.id)+'">Ko\'rish</button></div></article>';
  }).join("");
}

function renderChips(){
  var used=(D.categories||[]).filter(function(c){return visible().some(function(p){return p.cat===c.id})});
  $("#chips").innerHTML='<button class="chip'+(curCat==="all"?" on":"")+'" data-chip="all">Barchasi</button>'+
    used.map(function(c){return '<button class="chip'+(curCat===c.id?" on":"")+'" data-chip="'+esc(c.id)+'">'+esc(c.name)+'</button>'}).join("");
}

function renderGrid(){
  var list=visible().filter(function(p){return curCat==="all"||p.cat===curCat});
  $("#grid").innerHTML=list.map(function(p){
    var c=catOf(p.cat);
    return '<article class="card prod"><div class="card__img">'+media(p.img,c.style,p.c1||c.c1,p.c2||c.c2,p.name)+'</div>'+
      '<div class="card__b"><span class="cat-l">'+esc(c.name||"")+'</span><h3>'+esc(p.name)+'</h3>'+
      (p.desc?'<p>'+esc(p.desc)+'</p>':'')+
      (p.price?'<div class="price">'+fmt(p.price)+' so\'m <small>/ m²</small></div>':'<div class="price"><small>Narxi kelishiladi</small></div>')+
      '<div class="acts"><button class="btn btn--line" data-calc="'+esc(p.id)+'">Hisoblash</button><button class="btn btn--gold" data-buy="'+esc(p.id)+'">Buyurtma</button></div></div></article>';
  }).join("");
  $("#empty").hidden=list.length>0;
}

/* kalkulyator */
function renderCalcSelect(){
  var sel=$("#cProd"), prev=sel.value;
  sel.innerHTML=visible().filter(function(p){return p.price}).map(function(p){
    return '<option value="'+esc(p.id)+'">'+esc(catOf(p.cat).name?catOf(p.cat).name+" — ":"")+esc(p.name)+' ('+fmt(p.price)+' so\'m/m²)</option>';
  }).join("");
  if(prev) sel.value=prev;
  calc();
}
function calc(){
  var p=visible().filter(function(x){return x.id===$("#cProd").value})[0];
  var w=+$("#cW").value||0, h=+$("#cH").value||0, q=Math.max(1,+$("#cQ").value||1);
  var area=Math.max(w*h/10000,1);  /* 1 dona uchun eng kamida 1 m² */
  var sum=p?area*q*p.price:0;
  $("#cRes").textContent=fmt(sum)+" so'm";
  $("#cArea").textContent=p?(area.toFixed(2)+" m² × "+q+" dona × "+fmt(p.price)+" so'm"):"";
  return {p:p,w:w,h:h,q:q,sum:sum};
}

/* Instagram videolar */
var igLoaded=false;
function renderVideos(){
  var vids=(D.videos||[]).filter(function(v){return igPermalink(v.url)});
  $("#videos").innerHTML=vids.map(function(v){
    var link=igPermalink(v.url);
    return '<div class="video"><blockquote class="instagram-media" data-instgrm-permalink="'+esc(link)+'?utm_source=ig_embed" data-instgrm-version="14">'+
      '<a class="video__fb" href="'+esc(link)+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Instagram\'da ko\'rish</a></blockquote>'+
      (v.title?'<div class="video__t">'+esc(v.title)+'</div>':'')+'</div>';
  }).join("");
  $("#vEmpty").hidden=vids.length>0;
  var ig=igUser(D.settings&&D.settings.instagram);
  $("#igMore").innerHTML=ig?'<a class="btn btn--line" href="https://instagram.com/'+esc(ig)+'" target="_blank" rel="noopener">Instagram sahifamiz</a>':"";
  if(!vids.length) return;
  if(window.instgrm){ window.instgrm.Embeds.process(); return; }
  if(igLoaded) return; igLoaded=true;
  var sc=document.createElement("script"); sc.async=true; sc.src="https://www.instagram.com/embed.js";
  sc.onload=function(){ if(window.instgrm) window.instgrm.Embeds.process(); };
  document.body.appendChild(sc);
}

function renderContacts(){
  var s=D.settings||{};
  $("#sexText").textContent=s.workshopText||"";
  $("#sAddr").textContent=s.address||"";
  $("#sTime").textContent=s.workTime||"";
  var ph=$("#sPhone"); ph.textContent=s.phone||""; ph.href="tel:"+String(s.phone||"").replace(/[^\d+]/g,"");
  var map=$("#map"), u=String(s.mapUrl||"").trim();
  var m=u.match(/src="([^"]+)"/); if(m) u=m[1];   /* <iframe> kodi tashlansa ham ishlaydi */
  if(/^https:\/\//.test(u)) map.innerHTML='<iframe src="'+esc(u)+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Xarita"></iframe>';
  $("#year").textContent=new Date().getFullYear();
}


/* ishlar galereyasi + lightbox */
var galIdx=0;
function gal(){ return (D.gallery||[]).filter(function(g){return g.img}); }
function renderGallery(){
  $("#gallery").innerHTML=gal().map(function(g,i){
    return '<figure data-gi="'+i+'"><img src="'+esc(g.img)+'" alt="'+esc(g.title||"Bizning ish")+'" loading="lazy">'+(g.title?'<figcaption>'+esc(g.title)+'</figcaption>':'')+'</figure>';
  }).join("");
  $("#ishlar").hidden=!gal().length;
}
function lbShow(i){ var g=gal(); if(!g.length) return; galIdx=(i+g.length)%g.length; $("#lbImg").src=g[galIdx].img; $("#lbImg").alt=g[galIdx].title||""; $("#lbCap").textContent=g[galIdx].title||""; $("#lb").classList.add("open"); }
function lbClose(){ $("#lb").classList.remove("open"); }

/* o'lchash va o'rnatish */
function renderSteps(){
  $("#steps").innerHTML=(D.steps||[]).map(function(s){return '<li><b>'+esc(s.title)+'</b><p>'+esc(s.text)+'</p></li>'}).join("");
  $("#tips").innerHTML=(D.measureTips||[]).map(function(s){return '<li><b>'+esc(s.title)+'</b><span>'+esc(s.text)+'</span></li>'}).join("");
}
function renderAreas(){
  var a=D.areas||[];
  $("#areasNote").textContent=(D.settings&&D.settings.areasNote)||"";
  $("#areas").innerHTML=a.map(function(x){return '<li>'+esc(x)+'</li>'}).join("");
  $(".areas").hidden=!a.length;
}

function renderAll(){ renderHero(); renderFeatured(); renderChips(); renderGrid(); renderGallery(); renderSteps(); renderCalcSelect(); renderVideos(); renderContacts(); renderAreas(); }

/* buyurtma oynasi */
var modal=$("#modal");
function openOrder(note){ $("#oNote").value=note||""; $("#oMsg").textContent=""; modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); closeNav(); setTimeout(function(){ $("#orderForm [name=name]").focus(); },50); }
function closeOrder(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }

$("#orderForm").addEventListener("submit",function(e){
  e.preventDefault();
  var f=e.target, s=D.settings||{}, msg=$("#oMsg");
  var data={name:f.name.value.trim(),phone:f.phone.value.trim(),note:f.note.value.trim(),page:location.href,time:new Date().toISOString()};
  var text="Yangi buyurtma (sayt)\nIsm: "+data.name+"\nTelefon: "+data.phone+(data.note?"\nIzoh: "+data.note:"");
  function done(t){ msg.textContent=t; f.reset(); setTimeout(closeOrder,2200); }
  if(s.leadEndpoint){
    msg.textContent="Yuborilmoqda...";
    fetch(s.leadEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)})
      .then(function(r){ if(!r.ok) throw 0; done("Rahmat! Tez orada qo'ng'iroq qilamiz."); })
      .catch(function(){ msg.textContent="Yuborilmadi. Iltimos, qo'ng'iroq qiling: "+(s.phone||""); });
    return;
  }
  var tg=tgUser(s.telegram);
  if(tg){ window.open("https://t.me/"+tg+"?text="+encodeURIComponent(text),"_blank","noopener"); done("Telegram ochildi, xabarni yuboring."); return; }
  if(s.phone){ location.href="tel:"+s.phone.replace(/[^\d+]/g,""); done("Qo'ng'iroq qilinmoqda..."); return; }
  msg.textContent="Aloqa ma'lumotlari hali kiritilmagan.";
});

/* menyu */
var nav=$("#nav"), burger=$("#burger");
function closeNav(){ nav.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }
burger.addEventListener("click",function(){ var o=nav.classList.toggle("open"); burger.setAttribute("aria-expanded",o?"true":"false"); });
$$(".nav a").forEach(function(a){ a.addEventListener("click",closeNav); });

/* aktiv bo'lim */
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ $$(".nav a").forEach(function(a){ a.classList.toggle("on",a.getAttribute("href")==="#"+en.target.id); }); } }); },{rootMargin:"-45% 0px -50% 0px"});
  ["katalog","ishlar","dokon"].forEach(function(id){ var el=document.getElementById(id); if(el) io.observe(el); });
}

document.addEventListener("click",function(e){
  var gf=e.target.closest("[data-gi]"); if(gf) return lbShow(+gf.dataset.gi);
  if(e.target.closest("[data-lbx]")||e.target.id==="lb") return lbClose();
  var ln=e.target.closest("[data-lbn]"); if(ln) return lbShow(galIdx+(+ln.dataset.lbn));
  var t=e.target.closest("[data-order],[data-close],[data-cat],[data-chip],[data-buy],[data-calc]");
  if(!t) return;
  if(t.hasAttribute("data-order")) return openOrder("");
  if(t.hasAttribute("data-close")) return closeOrder();
  if(t.dataset.cat){ curCat=t.dataset.cat; renderChips(); renderGrid(); $("#katalog").scrollIntoView({behavior:"smooth"}); return; }
  if(t.dataset.chip){ curCat=t.dataset.chip; renderChips(); renderGrid(); return; }
  if(t.dataset.buy){ var p=visible().filter(function(x){return x.id===t.dataset.buy})[0]; return openOrder(p?(catOf(p.cat).name||"")+": "+p.name:""); }
  if(t.dataset.calc){ $("#cProd").value=t.dataset.calc; calc(); $("#kalkulyator").scrollIntoView({behavior:"smooth"}); }
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){ closeOrder(); closeNav(); lbClose(); }
  if($("#lb").classList.contains("open")){ if(e.key==="ArrowRight") lbShow(galIdx+1); if(e.key==="ArrowLeft") lbShow(galIdx-1); }
});
["#cProd","#cW","#cH","#cQ"].forEach(function(s){ $(s).addEventListener("input",calc); });
$("#cOrder").addEventListener("click",function(){
  var r=calc(); if(!r.p) return openOrder("");
  openOrder(r.p.name+", "+r.w+"×"+r.h+" sm, "+r.q+" dona ≈ "+fmt(r.sum)+" so'm");
});

/* ma'lumotni yuklash: admin "Saytda ko'rish" bossa qoralama, aks holda data.json */
function start(d){ D=d||{settings:{},categories:[],products:[],videos:[],gallery:[],steps:[],measureTips:[],areas:[]}; renderAll(); }
var preview=/[?&]preview=1/.test(location.search);
if(preview){ try{ var pd=JSON.parse(localStorage.getItem(PREVIEW_KEY)); if(pd){ start(pd); return; } }catch(e){} }
fetch("data.json?v="+Date.now(),{cache:"no-store"})
  .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
  .then(start)
  .catch(function(){
    start(null);
    var b=document.createElement("div");
    b.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;z-index:99;background:#7a1f1f;color:#fff;padding:12px 16px;border-radius:10px;font-weight:600";
    b.textContent="data.json o'qilmadi. Saytni faylni ikki marta bosib emas, start.bat orqali (yoki hostingda) oching.";
    document.body.appendChild(b);
  });
})();
