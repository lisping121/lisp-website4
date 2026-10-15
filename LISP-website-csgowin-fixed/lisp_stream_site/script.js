const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const streamers = [
  {name:'LISPKing', avatar:'♛', color:'red-avatar', weekly:42680, monthly:118240, all:483920, reward:50},
  {name:'AceHigh88', avatar:'A', color:'blue-avatar', weekly:38421, monthly:103400, all:451700, reward:40},
  {name:'BluffMaster', avatar:'B', color:'gold-avatar', weekly:32901, monthly:89220, all:398500, reward:35},
  {name:'PokerQueen', avatar:'Q', color:'green-avatar', weekly:28377, monthly:76110, all:365100, reward:30},
  {name:'CardShark', avatar:'C', color:'blue-avatar', weekly:24982, monthly:69400, all:330220, reward:25},
  {name:'TheGrind', avatar:'G', color:'gold-avatar', weekly:21564, monthly:61890, all:298760, reward:20},
  {name:'LuckyDegen', avatar:'L', color:'green-avatar', weekly:18430, monthly:52400, all:275300, reward:15},
  {name:'RiverRider', avatar:'R', color:'blue-avatar', weekly:15776, monthly:43320, all:248900, reward:10},
  {name:'FoldKing', avatar:'F', color:'red-avatar', weekly:12903, monthly:38670, all:226410, reward:5},
  {name:'BigStackSam', avatar:'S', color:'gold-avatar', weekly:10221, monthly:29110, all:198600, reward:5}
];
let period = 'weekly';
let toastTimer;
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}
function fmt(n){ return n.toLocaleString('en-US'); }
function renderLeaders(){
  const key = period === 'weekly' ? 'weekly' : period === 'monthly' ? 'monthly' : 'all';
  const rows = [...streamers].sort((a,b)=>b[key]-a[key]);
  $('#leaderRows').innerHTML = rows.map((s,i)=>`<div class="leader-row"><span class="rank">${i+1}</span><span class="streamer-cell"><span class="mini-avatar ${s.color}">${s.avatar}</span><b>${s.name}</b></span><span class="hours">${fmt(s[key])}</span><span class="reward">▤ +$${s.reward}</span></div>`).join('');
}
renderLeaders();
$$('[data-period]').forEach(btn=>btn.addEventListener('click',()=>{
  period=btn.dataset.period; $$('[data-period]').forEach(b=>b.classList.toggle('active',b===btn)); renderLeaders();
}));
$$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{
  const code=btn.dataset.copy;
  try { await navigator.clipboard.writeText(code); toast(`Code ${code} copied!`); }
  catch { const t=document.createElement('textarea');t.value=code;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast(`Code ${code} copied!`); }
}));
$$('[data-stream]').forEach(btn=>btn.addEventListener('click',()=>{
  window.open('https://kick.com/lisping','_blank','noopener,noreferrer');
}));
$('#claimBonus').addEventListener('click',()=>{
  const claimed=localStorage.getItem('lispDemoBonus');
  if(claimed){$('#claimStatus').textContent='Already checked in today ✓';toast('You already checked in today.');}
  else {localStorage.setItem('lispDemoBonus',new Date().toDateString());$('#claimStatus').textContent='Daily check-in recorded ✓';toast('Daily check-in recorded! Demo reward: 100 points.');}
});
$('#notifyBtn').addEventListener('click',()=>toast('You’re all caught up!'));
$('#mobileMenu').addEventListener('click',()=>$('#nav').classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$('#searchToggle').addEventListener('click',()=>{$('#searchDrawer').classList.toggle('open');if($('#searchDrawer').classList.contains('open'))$('#searchInput').focus();});
$('#closeSearch').addEventListener('click',()=>$('#searchDrawer').classList.remove('open'));
function searchStreams(q){
  const results=streamers.filter(s=>s.name.toLowerCase().includes(q.toLowerCase()));
  $('#searchResults').innerHTML=q.trim()?results.map(s=>`<div class="search-result" data-result="${s.name}"><b>${s.name}</b><small> · streamer</small></div>`).join('')||'<div class="empty-state">No streamers found.</div>':'';
  $$('[data-result]').forEach(el=>el.addEventListener('click',()=>{toast(`Selected ${el.dataset.result}`);$('#searchDrawer').classList.remove('open');}));
}
$('#searchInput').addEventListener('input',e=>searchStreams(e.target.value));
$('#viewAllLeaders').addEventListener('click',()=>toast('Showing all 10 demo leaderboard entries.'));
const backdrop=$('#modalBackdrop');
function openModal(type){
  const signup=type==='signup';
  $('#modalTitle').textContent=signup?'Create your account':'Welcome back';
  $('#modalIntro').textContent=signup?'Join the LISP community and start collecting rewards.':'Sign in to your LISP account.';
  $('#formSubmit').textContent=signup?'Create Account':'Login';
  $('#modalFoot').innerHTML=signup?'Already have an account? <button data-modal="login">Login</button>':'New here? <button data-modal="signup">Create an account</button>';
  backdrop.classList.add('open'); document.body.style.overflow='hidden';
  $('#password').autocomplete=signup?'new-password':'current-password';
  $$('#modalFoot [data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));
}
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));
function closeModal(){backdrop.classList.remove('open');document.body.style.overflow='';}
$('#modalClose').addEventListener('click',closeModal);
backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#searchDrawer').classList.remove('open');}});
$('#accountForm').addEventListener('submit',e=>{
  e.preventDefault(); const type=$('#formSubmit').textContent;
  toast(`${type} demo submitted. Real authentication is not configured.`);
  closeModal(); e.target.reset();
});
