(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let toastTimer;
function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);} window.toast=toast;
$('#mobileMenu')?.addEventListener('click',()=>$('#nav')?.classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav')?.classList.remove('open')));
$('#notifyBtn')?.addEventListener('click',()=>toast('You’re all caught up!'));
$('#searchToggle')?.addEventListener('click',()=>{$('#searchDrawer')?.classList.toggle('open');$('#searchInput')?.focus();});
$('#closeSearch')?.addEventListener('click',()=>$('#searchDrawer')?.classList.remove('open'));
$('#searchInput')?.addEventListener('input',e=>{
 const q=e.target.value.trim().toLowerCase(); const names=['LISP','LISPKing','AceHigh88','BluffMaster','PokerQueen','CardShark','TheGrind','LuckyDegen','RiverRider','FoldKing','BigStackSam'];
 const results=names.filter(n=>n.toLowerCase().includes(q));
 $('#searchResults').innerHTML=q?results.map(n=>`<div class="search-result" data-name="${n}">${n}</div>`).join('')||'<div class="empty-state">No results found.</div>':'';
 $$('[data-name]').forEach(el=>el.addEventListener('click',()=>{toast(`Streamer: ${el.dataset.name}`);$('#searchDrawer').classList.remove('open');}));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#searchDrawer')?.classList.remove('open')});

})();
