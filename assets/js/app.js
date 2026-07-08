/* ═══════════════════════════════════════════════════════════════
   APP STATE
═══════════════════════════════════════════════════════════════ */

// Check if Firebase is available
const useFirebase = typeof firebase !== 'undefined' && firebase.apps.length > 0;

const pageRoutes = {
  home: 'index.html',
  check: 'check.html',
  dashboard: 'dashboard.html',
  auth: 'signin.html',
};

const state = {
  page: document.body.dataset.page || 'home',
  user: loadJSON('phishguard_user', null),
  history: loadJSON('phishguard_history', []),
  scanning: false,
  dashFilter: 'all',
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveSession() {
  try {
    // Always save to localStorage as backup
    if (state.user) localStorage.setItem('phishguard_user', JSON.stringify(state.user));
    else localStorage.removeItem('phishguard_user');
    localStorage.setItem('phishguard_history', JSON.stringify(state.history));
    
    // Also save to Firebase if available and user is logged in
    if (useFirebase && state.user && state.user.uid) {
      updateUserProfile(state.user.uid, {
        name: state.user.name
      }).catch(err => console.log('Firebase update error:', err));
    }
  } catch {
    // Some browser privacy modes restrict storage; the app can still run for the current page.
  }
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════════ */
(function initParticles(){
  const c = document.getElementById('particle-canvas');
  const ctx = c.getContext('2d');
  let raf;
  function resize(){ c.width=innerWidth; c.height=innerHeight; }
  resize(); addEventListener('resize', resize);
  const pts = Array.from({length:55},()=>({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
    r:Math.random()*1.2+.4, g:Math.random()>.4
  }));
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>c.width) p.vx*=-1;
      if(p.y<0||p.y>c.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.g?'rgba(34,197,94,.5)':'rgba(74,222,128,.25)';
      ctx.fill();
      pts.slice(i+1).forEach(q=>{
        const d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<110){
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(34,197,94,${.04*(1-d/110)})`;
          ctx.lineWidth=.6; ctx.stroke();
        }
      });
    });
    raf=requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════════════════
   SPA NAVIGATION
═══════════════════════════════════════════════════════════════ */
function navigateSPA(page){
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(20px)';
    p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  setTimeout(()=>{
    // Remove active class from all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Add active class to target page
    const targetPage = document.getElementById(`page-${page}`);
    if(targetPage){
      targetPage.classList.add('active');
      targetPage.style.opacity = '1';
      targetPage.style.transform = 'translateY(0)';
      
      // Update state
      state.page = page;
      document.body.dataset.page = page;
      
      // Update nav active states
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
      });
      
      // Scroll to top smoothly
      window.scrollTo({top: 0, behavior: 'smooth'});
      
      // Initialize page-specific content
      if(page === 'dashboard') renderDashboard();
      if(page === 'check') renderHistory();
      if(page === 'profile') renderProfile();
    }
  }, 300);
}

/* ═══════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════ */
addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled', scrollY>24);
});

function navigate(page){
  navigateSPA(page);
}

let mobOpen=false;
function toggleMob(){ mobOpen=!mobOpen; document.getElementById('mob-menu').classList.toggle('open',mobOpen); }
function closeMob(){ mobOpen=false; document.getElementById('mob-menu').classList.remove('open'); }

let userMenuOpen=false;
function toggleUserMenu(){
  userMenuOpen=!userMenuOpen;
  document.getElementById('avatar-btn').classList.toggle('open',userMenuOpen);
  document.getElementById('user-dropdown').classList.toggle('open',userMenuOpen);
}
function closeUserMenu(){
  userMenuOpen=false;
  document.getElementById('avatar-btn').classList.remove('open');
  document.getElementById('user-dropdown').classList.remove('open');
}
document.addEventListener('mousedown',e=>{
  const wrap=document.getElementById('user-menu-wrap');
  if(wrap && !wrap.contains(e.target)) closeUserMenu();
});

function updateNavAuth(){
  const u=state.user;
  const userMenuWrap = document.getElementById('user-menu-wrap');
  const signinBtn = document.getElementById('signin-nav-btn');
  const mobAuth = document.getElementById('mob-auth');
  const mobUser = document.getElementById('mob-user');
  
  if(!userMenuWrap || !signinBtn || !mobAuth || !mobUser) return;
  
  userMenuWrap.style.display=u?'block':'none';
  signinBtn.style.display=u?'none':'';
  mobAuth.style.display=u?'none':'';
  mobUser.style.display=u?'block':'none';
  
  if(u){
    const avatarBtn = document.getElementById('avatar-btn');
    const ddName = document.getElementById('dd-name');
    const ddEmail = document.getElementById('dd-email');
    const mobEmail = document.getElementById('mob-email');
    
    if(!avatarBtn || !ddName || !ddEmail || !mobEmail) return;
    
    // Always show first letter avatar
    avatarBtn.style.backgroundImage = 'none';
    avatarBtn.textContent = u.name[0].toUpperCase();
    
    ddName.textContent=u.name;
    ddEmail.textContent=u.email;
    mobEmail.textContent=u.email;
  }
}

function logout(){
  // Sign out from Firebase if available
  if (useFirebase) {
    signOutUser().catch(err => console.log('Firebase signout error:', err));
  }
  
  state.user = null;
  state.history = [];
  saveSession();
  updateNavAuth();
  closeUserMenu();
  showToast('Signed out successfully','success');
  setTimeout(()=>navigateSPA('home'),500);
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className='show '+type;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.className='',2800);
}

/* ═══════════════════════════════════════════════════════════════
   URL VALIDATION & ANALYSIS
═══════════════════════════════════════════════════════════════ */
function isValidURL(input){
  let test=input.trim();
  if(!/^https?:\/\//i.test(test)) test='https://'+test;
  try{
    const u=new URL(test);
    const host=u.hostname;
    if(!host||!host.includes('.')) return false;
    const parts=host.split('.');
    const tld=parts[parts.length-1];
    if(!/^[a-zA-Z]{2,13}$/.test(tld)) return false;
    if(parts.some(p=>p.length===0)) return false;
    return true;
  }catch{return false;}
}

function analyzeURL(url){
  let norm=url.trim();
  if(!/^https?:\/\//i.test(norm)) norm='https://'+norm;
  const l=norm.toLowerCase();
  let score=100;
  const flags=[];
  if(['.xyz','.tk','.ml','.ga','.cf','.zip','.click'].some(t=>l.includes(t))){ score-=25; flags.push('Suspicious TLD'); }
  if(['paypa1','arnazon','g00gle','micros0ft','app1e','faceb00k','roblox-free','netflix-login','signin-','login-','verify-','secure-update'].some(t=>l.includes(t))){ score-=40; flags.push('Lookalike domain pattern'); }
  if(/https?:\/\/\d{1,3}\.\d{1,3}/.test(l)){ score-=35; flags.push('IP address instead of domain'); }
  const dom=l.replace(/https?:\/\//,'').split('/')[0];
  if(dom.split('.').length>4){ score-=20; flags.push('Excessive subdomains'); }
  if(l.startsWith('http://')){ score-=20; flags.push('No SSL (HTTP only)'); }
  const pw=['login','verify','secure','account','update','password','confirm','suspended','urgent'];
  const found=pw.filter(w=>l.includes(w));
  if(found.length>=2){ score-=18; flags.push('Phishing keywords: '+found.slice(0,2).join(', ')); }
  if(['bit.ly','tinyurl','t.co','ow.ly','goo.gl'].some(s=>l.includes(s))){ score-=15; flags.push('URL shortener'); }
  if(norm.length>120){ score-=12; flags.push('Unusually long URL'); }
  if(norm.includes('@')&&!norm.includes('mailto')){ score-=20; flags.push('@ symbol in URL'); }
  const safe=['google.com','github.com','microsoft.com','apple.com','amazon.com','wikipedia.org','youtube.com','anthropic.com','stripe.com','cloudflare.com'];
  if(safe.some(d=>l.includes(d))) score=Math.max(score,88);
  score=Math.max(0,Math.min(100,score));
  let status,clr,bgClr;
  if(score>=80){status='Safe';clr='#22C55E';bgClr='rgba(34,197,94,.12)';}
  else if(score>=58){status='Suspicious';clr='#f5a623';bgClr='rgba(245,166,35,.12)';}
  else if(score>=32){status='Phishing';clr='#fb7f3a';bgClr='rgba(251,127,58,.12)';}
  else{status='Malicious';clr='#ff4d4d';bgClr='rgba(255,77,77,.12)';}
  let domain='Unknown';
  try{domain=new URL(norm).hostname;}catch{}
  const ssl=l.startsWith('https://');
  return{score,status,clr,bgClr,flags,domain,
    ssl:ssl?'Valid':'None',sslClr:ssl?'#22C55E':'#ff4d4d',
    reputation:score>=80?'Clean':score>=58?'Flagged':'Blacklisted',
    repClr:score>=80?'#22C55E':score>=58?'#f5a623':'#ff4d4d',
    risk:score>=80?'Low':score>=58?'Medium':score>=32?'High':'Critical',
    riskClr:score>=80?'#22C55E':score>=58?'#f5a623':score>=32?'#fb7f3a':'#ff4d4d',
    safe:score>=80, url:norm
  };
}

/* ═══════════════════════════════════════════════════════════════
   CHECK PAGE
═══════════════════════════════════════════════════════════════ */
function onUrlInput(){
  const v=document.getElementById('url-input').value.trim();
  document.getElementById('scan-btn').disabled=!v;
  document.getElementById('url-input').classList.remove('error');
  document.getElementById('url-error').classList.remove('show');
}

async function pasteURL(){
  try{
    const t=await navigator.clipboard.readText();
    if(t){
      document.getElementById('url-input').value=t;
      onUrlInput();
    }
  }catch(err){
    // Fallback for browsers that don't support clipboard API or when permission is denied
    console.log('Clipboard access denied or not supported');
    showToast('Unable to access clipboard. Please paste manually.','error');
  }
}

const scanSteps=['Resolving hostname...','Verifying SSL certificate...','Querying threat databases...','Analyzing URL structure...','Generating threat report...'];

function doScan(){
  const rawUrl=document.getElementById('url-input').value.trim();
  if(!rawUrl||state.scanning) return;
  if(!isValidURL(rawUrl)){
    document.getElementById('url-input').classList.add('error');
    document.getElementById('url-err-msg').textContent='Invalid URL — please enter a valid web address (e.g. https://example.com)';
    document.getElementById('url-error').classList.add('show');
    document.getElementById('scan-result').classList.remove('show');
    return;
  }
  document.getElementById('url-input').classList.remove('error');
  document.getElementById('url-error').classList.remove('show');
  state.scanning=true;
  document.getElementById('scan-btn').disabled=true;
  document.getElementById('scan-result').classList.remove('show');
  document.getElementById('threat-flags').classList.remove('show');
  document.getElementById('visit-btn-wrap').classList.remove('show');
  document.getElementById('scan-progress').classList.add('show');
  document.getElementById('prog-bar').style.width='0';
  document.getElementById('prog-pct').textContent='0%';
  let step=0;
  document.getElementById('step-msg').textContent=scanSteps[0];
  const iv=setInterval(()=>{
    step++;
    if(step<scanSteps.length){
      document.getElementById('step-msg').textContent=scanSteps[step];
      const pct=Math.round(step/scanSteps.length*100);
      document.getElementById('prog-bar').style.width=pct+'%';
      document.getElementById('prog-pct').textContent=pct+'%';
    } else {
      clearInterval(iv);
      document.getElementById('prog-bar').style.width='100%';
      document.getElementById('prog-pct').textContent='100%';
      setTimeout(()=>{
        const r=analyzeURL(rawUrl);
        state.scanning=false;
        document.getElementById('scan-btn').disabled=false;
        document.getElementById('scan-progress').classList.remove('show');
        showResult(r,rawUrl);
        
        const scanResult = {...r, url:rawUrl, date:new Date().toLocaleString()};
        state.history.unshift(scanResult);
        if(state.history.length>100) state.history.pop();
        
        saveSession(); // Save history to localStorage
        
        // Save to Firebase if user is logged in
        if (useFirebase && state.user && state.user.uid) {
          saveScanResult(state.user.uid, scanResult).catch(err => 
            console.log('Firebase save error:', err)
          );
        }
        
        renderHistory();
      },500);
    }
  },620);
}

function showResult(r,rawUrl){
  // Glow with animation
  const resultGlow = document.getElementById('result-glow');
  resultGlow.style.background=`radial-gradient(ellipse at 70% 0%,${r.bgClr},transparent 65%)`;
  resultGlow.style.opacity = '0';
  setTimeout(()=>resultGlow.style.opacity = '1', 100);
  
  // Status pill
  const pill=document.getElementById('status-pill');
  pill.style.background=r.bgClr;
  pill.style.border=`1px solid ${r.clr}30`;
  pill.style.transform = 'scale(0.9)';
  setTimeout(()=>pill.style.transform = 'scale(1)', 100);
  
  const dot=document.getElementById('status-dot');
  dot.style.background=r.clr;
  dot.style.boxShadow=`0 0 8px ${r.clr}`;
  document.getElementById('status-name').textContent=r.status;
  document.getElementById('status-name').style.color=r.clr;
  
  // Score with animation
  const sn=document.getElementById('score-num');
  sn.style.color=r.clr;
  sn.style.textShadow=`0 0 30px ${r.clr}50`;
  
  // Animate score counting
  let currentScore = 0;
  const scoreInterval = setInterval(()=>{
    currentScore += Math.ceil(r.score / 20);
    if(currentScore >= r.score){
      sn.textContent = r.score;
      clearInterval(scoreInterval);
    } else {
      sn.textContent = currentScore;
    }
  }, 50);
  
  // Meter
  const mf=document.getElementById('meter-fill');
  mf.style.width='0';
  mf.style.background=r.clr;
  mf.style.boxShadow=`0 0 14px ${r.clr}60`;
  setTimeout(()=>mf.style.width=r.score+'%',50);
  
  // URL display
  document.getElementById('scanned-url-display').textContent=rawUrl;
  
  // Metrics
  document.getElementById('m-reputation').textContent=r.reputation;
  document.getElementById('m-reputation').style.color=r.repClr;
  document.getElementById('m-ssl').textContent=r.ssl;
  document.getElementById('m-ssl').style.color=r.sslClr;
  document.getElementById('m-risk').textContent=r.risk;
  document.getElementById('m-risk').style.color=r.riskClr;
  const dom=r.domain;
  document.getElementById('m-domain').textContent=dom.length>18?dom.slice(0,18)+'…':dom;
  
  // Flags
  if(r.flags.length>0){
    document.getElementById('flag-count').textContent=`Threat Indicators (${r.flags.length})`;
    document.getElementById('flag-list').innerHTML=r.flags.map((f,idx)=>`<div class="flag-item" style="animation:fadeUp .4s ${idx*0.1}s ease both"><span class="flag-x">✗</span><span class="flag-text">${f}</span></div>`).join('');
    document.getElementById('threat-flags').classList.add('show');
  }
  
  // Visit button - only show if safe AND uses HTTPS (not HTTP)
  if(r.safe && r.url.toLowerCase().startsWith('https://')){
    document.getElementById('visit-btn').href=r.url;
    document.getElementById('visit-btn-wrap').classList.add('show');
  } else {
    document.getElementById('visit-btn-wrap').classList.remove('show');
  }
  document.getElementById('scan-result').classList.add('show');
}

function renderHistory(){
  const h=state.history;
  const el=document.getElementById('scan-history');
  const list=document.getElementById('history-list');
  if(!h.length){ el.classList.remove('show'); return; }
  el.classList.add('show');
  list.innerHTML=h.slice(0,6).map((item,i)=>`
    <div class="history-item" onclick="loadHistory(${i})">
      <div class="h-dot" style="background:${item.clr};box-shadow:0 0 6px ${item.clr}"></div>
      <div class="h-url mono">${item.url}</div>
      <div class="h-status" style="color:${item.clr}">${item.status}</div>
      <div class="h-score">${item.score}/100</div>
    </div>`).join('');
}

function loadHistory(i){
  const item=state.history[i];
  document.getElementById('url-input').value=item.url;
  onUrlInput();
  doScan();
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function renderDashboard(){
  const u=state.user;
  const locked=document.getElementById('dash-locked');
  const content=document.getElementById('dash-content');
  if(!u){ locked.classList.add('show'); content.classList.remove('show'); return; }
  locked.classList.remove('show'); content.classList.add('show');

  // Profile
  document.getElementById('dash-welcome').textContent='Welcome back, '+u.name;
  document.getElementById('profile-avatar').textContent=u.name[0].toUpperCase();
  document.getElementById('profile-name').textContent=u.name;
  document.getElementById('profile-email-display').textContent=u.email;

  const h=state.history;
  const total=h.length;
  const safeN=h.filter(x=>x.safe).length;
  const suspN=h.filter(x=>x.status==='Suspicious').length;
  const malN=h.filter(x=>!x.safe && x.status!=='Suspicious').length;

  // Metrics
  const metrics=[
    {l:'Total Scanned',v:total,ic:'🔍',c:'#22C55E'},
    {l:'Safe URLs',v:safeN,ic:'✅',c:'#22C55E'},
    {l:'Suspicious',v:suspN,ic:'⚠️',c:'#f5a623'},
    {l:'Malicious',v:malN,ic:'🚨',c:'#ff4d4d'},
  ];
  document.getElementById('dash-metrics').innerHTML=metrics.map((m,idx)=>`
    <div class="dash-metric lg shine" style="animation:fadeUp .5s ${idx*0.1}s ease both">
      <div class="dash-metric-icon">${m.ic}</div>
      <div class="dash-metric-val serif" style="color:${m.c};text-shadow:0 0 20px ${m.c}40" data-target="${m.v}">0</div>
      <div class="dash-metric-label">${m.l}</div>
      <div class="dash-metric-glow" style="background:radial-gradient(circle,${m.c}18,transparent 70%)"></div>
    </div>`).join('');
  
  // Animate metric numbers
  document.querySelectorAll('.dash-metric-val').forEach((el,idx)=>{
    const target = parseInt(el.dataset.target);
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(()=>{
      current += increment;
      if(current >= target){
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 30);
  });

  // Charts (rendered after DOM settles)
  requestAnimationFrame(()=>{
    drawLineChart();
    drawPieChart(safeN,suspN,malN,total);
  });

  renderDashTable();
}

function drawLineChart(){
  const canvas=document.getElementById('line-chart-canvas');
  if(!canvas) return;
  const wrap=canvas.parentElement;
  canvas.width=wrap.clientWidth*devicePixelRatio||600;
  canvas.height=180*devicePixelRatio;
  canvas.style.height='180px';
  const ctx=canvas.getContext('2d');
  ctx.scale(devicePixelRatio,devicePixelRatio);
  const W=wrap.clientWidth||600, H=180;
  
  // Generate real data from scan history (last 7 days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    // Count scans for this day from history
    const dayScans = state.history.filter(scan => {
      if (!scan.date) return false;
      const scanDate = new Date(scan.date);
      return scanDate.toDateString() === date.toDateString();
    });
    
    const safe = dayScans.filter(x => x.safe).length;
    const suspicious = dayScans.filter(x => x.status === 'Suspicious').length;
    const malicious = dayScans.filter(x => !x.safe && x.status !== 'Suspicious').length;
    
    data.push({d: dayName, s: safe, w: suspicious, m: malicious});
  }
  
  const pad={l:30,r:16,t:10,b:28};
  const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
  
  // Calculate max value from actual data
  const maxV = Math.max(
    10, // Minimum scale
    ...data.map(d => Math.max(d.s, d.w, d.m))
  );
  
  function xPos(i){return pad.l+i*(cw/(data.length-1));}
  function yPos(v){return pad.t+ch*(1-v/maxV);}
  
  // Grid (dynamic based on maxV)
  const gridSteps = [0, Math.round(maxV/3), Math.round(maxV*2/3), maxV];
  gridSteps.forEach(v=>{
    const y=yPos(v);
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y);
    ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.25)'; ctx.font=`${11*devicePixelRatio/devicePixelRatio}px Outfit`;
    ctx.fillText(v,2,y+4);
  });
  
  // X labels
  data.forEach((d,i)=>{
    ctx.fillStyle='rgba(255,255,255,.25)'; ctx.font='11px Outfit';
    ctx.textAlign='center'; ctx.fillText(d.d,xPos(i),H-6);
  });
  
  // Lines with glow effect
  [['s','#22C55E',[]], ['w','#f5a623',[4,3]], ['m','#ff4d4d',[2,4]]].forEach(([key,color,dash])=>{
    // Draw glow
    ctx.beginPath();
    ctx.setLineDash(dash); ctx.strokeStyle=color; ctx.lineWidth=4; ctx.globalAlpha=0.2;
    data.forEach((d,i)=>{
      i===0?ctx.moveTo(xPos(i),yPos(d[key])):ctx.lineTo(xPos(i),yPos(d[key]));
    });
    ctx.stroke();
    
    // Draw main line
    ctx.beginPath();
    ctx.lineWidth=2; ctx.globalAlpha=1;
    data.forEach((d,i)=>{
      i===0?ctx.moveTo(xPos(i),yPos(d[key])):ctx.lineTo(xPos(i),yPos(d[key]));
    });
    ctx.stroke(); ctx.setLineDash([]);
    
    // Draw points
    data.forEach((d,i)=>{
      ctx.beginPath();
      ctx.arc(xPos(i),yPos(d[key]),3,0,Math.PI*2);
      ctx.fillStyle=color;
      ctx.fill();
      ctx.strokeStyle='rgba(11,15,18,0.8)';
      ctx.lineWidth=2;
      ctx.stroke();
    });
  });
  
  // Add hover interaction
  let tooltip = document.getElementById('line-chart-tooltip');
  if(!tooltip){
    tooltip = document.createElement('div');
    tooltip.id = 'line-chart-tooltip';
    tooltip.style.cssText = 'position:absolute;background:rgba(26,31,38,.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 12px;font-size:12px;pointer-events:none;opacity:0;transition:opacity .2s;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,.4)';
    wrap.style.position = 'relative';
    wrap.appendChild(tooltip);
  }
  
  canvas.onmousemove = (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find closest data point
    let closest = -1;
    let minDist = Infinity;
    data.forEach((d,i)=>{
      const px = xPos(i);
      const dist = Math.abs(x - px);
      if(dist < minDist && dist < 30){
        minDist = dist;
        closest = i;
      }
    });
    
    if(closest >= 0){
      const d = data[closest];
      tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:4px;color:#22C55E">${d.d}</div>
        <div style="color:rgba(255,255,255,.7)">Safe: ${d.s} | Suspicious: ${d.w} | Malicious: ${d.m}</div>`;
      tooltip.style.left = (xPos(closest) + 10) + 'px';
      tooltip.style.top = '10px';
      tooltip.style.opacity = '1';
    } else {
      tooltip.style.opacity = '0';
    }
  };
  
  canvas.onmouseleave = ()=>{
    tooltip.style.opacity = '0';
  };
}

function drawPieChart(safeN,suspN,malN,total){
  const canvas=document.getElementById('pie-chart-canvas');
  if(!canvas) return;
  const wrap=canvas.parentElement;
  const size=Math.min(wrap.clientWidth,160);
  canvas.width=size*devicePixelRatio; canvas.height=size*devicePixelRatio;
  canvas.style.width=size+'px'; canvas.style.height='160px';
  const ctx=canvas.getContext('2d');
  ctx.scale(devicePixelRatio,devicePixelRatio);
  const cx=size/2, cy=size/2-10, r=60, innerR=38;
  const segs=[
    {v:safeN,c:'#22C55E',label:'Safe'},
    {v:suspN,c:'#f5a623',label:'Suspicious'},
    {v:malN,c:'#ff4d4d',label:'Malicious'}
  ];
  
  let hoveredSegment = -1;
  
  function draw(hoverIndex = -1){
    ctx.clearRect(0,0,size,size);
    let angle=-Math.PI/2;
    
    segs.forEach((s,idx)=>{
      const sweep=(s.v/total)*Math.PI*2;
      const isHovered = idx === hoverIndex;
      const currentR = isHovered ? r + 4 : r;
      
      ctx.beginPath(); 
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,currentR,angle,angle+sweep);
      ctx.closePath(); 
      
      // Add glow for hovered segment
      if(isHovered){
        ctx.shadowColor = s.c;
        ctx.shadowBlur = 15;
      }
      
      ctx.fillStyle=s.c; 
      ctx.fill();
      
      ctx.shadowBlur = 0;
      angle+=sweep+.04;
    });
    
    // Donut hole
    ctx.beginPath(); 
    ctx.arc(cx,cy,innerR,0,Math.PI*2);
    ctx.fillStyle='#0B0F12'; 
    ctx.fill();
    
    // Center text
    if(hoverIndex >= 0){
      const seg = segs[hoverIndex];
      ctx.fillStyle = seg.c;
      ctx.font = 'bold 16px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(seg.v/total*100)+'%', cx, cy-5);
      ctx.fillStyle = 'rgba(255,255,255,.6)';
      ctx.font = '11px Outfit';
      ctx.fillText(seg.label, cx, cy+10);
    }
  }
  
  draw();
  
  // Pie legend with hover
  const names=['Safe','Suspicious','Malicious'];
  const vals=[safeN,suspN,malN];
  const colors=['#22C55E','#f5a623','#ff4d4d'];
  const legendEl = document.getElementById('pie-legend');
  legendEl.innerHTML=names.map((n,i)=>`
    <div class="pie-legend-row" data-segment="${i}" style="cursor:pointer;transition:all .2s;padding:6px;margin:-6px;border-radius:8px">
      <div class="pie-legend-left"><div class="pie-legend-dot" style="background:${colors[i]};transition:transform .2s"></div>${n}</div>
      <div class="pie-legend-pct" style="color:${colors[i]}">${Math.round(vals[i]/total*100)}%</div>
    </div>`).join('');
  
  // Add hover listeners to legend
  legendEl.querySelectorAll('.pie-legend-row').forEach((row,idx)=>{
    row.onmouseenter = ()=>{
      hoveredSegment = idx;
      draw(idx);
      row.style.background = 'rgba(255,255,255,.04)';
      row.querySelector('.pie-legend-dot').style.transform = 'scale(1.3)';
    };
    row.onmouseleave = ()=>{
      hoveredSegment = -1;
      draw();
      row.style.background = 'transparent';
      row.querySelector('.pie-legend-dot').style.transform = 'scale(1)';
    };
  });
  
  // Add hover to canvas
  canvas.onmousemove = (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (size / rect.width);
    const y = (e.clientY - rect.top) * (size / rect.height);
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if(dist >= innerR && dist <= r + 4){
      let angle = Math.atan2(dy, dx);
      if(angle < 0) angle += Math.PI * 2;
      angle = (angle + Math.PI/2) % (Math.PI * 2);
      
      let currentAngle = 0;
      let foundSegment = -1;
      segs.forEach((s,idx)=>{
        const sweep = (s.v/total) * Math.PI * 2;
        if(angle >= currentAngle && angle < currentAngle + sweep){
          foundSegment = idx;
        }
        currentAngle += sweep + .04;
      });
      
      if(foundSegment !== hoveredSegment){
        hoveredSegment = foundSegment;
        draw(foundSegment);
        canvas.style.cursor = 'pointer';
      }
    } else {
      if(hoveredSegment !== -1){
        hoveredSegment = -1;
        draw();
        canvas.style.cursor = 'default';
      }
    }
  };
  
  canvas.onmouseleave = ()=>{
    hoveredSegment = -1;
    draw();
    canvas.style.cursor = 'default';
  };
}

let dashFilter='all';
function setFilter(btn){
  dashFilter=btn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderDashTable();
}

function exportCSV(){
  if(!state.history || state.history.length === 0){
    showToast('No scan history to export', 'error');
    return;
  }
  
  // CSV Header
  let csv = 'URL,Status,Score,Reputation,SSL,Risk Level,Date\n';
  
  // Add data rows
  state.history.forEach(scan => {
    const url = `"${(scan.url || '').replace(/"/g, '""')}"`;
    const status = scan.status || 'Unknown';
    const score = scan.score || 0;
    const reputation = scan.reputation || 'Unknown';
    const ssl = scan.ssl || 'Unknown';
    const risk = scan.risk || 'Unknown';
    const date = scan.date || new Date().toLocaleString();
    
    csv += `${url},${status},${score},${reputation},${ssl},${risk},"${date}"\n`;
  });
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `phishguard-scan-history-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('CSV exported successfully!', 'success');
}

function renderDashTable(){
  const search=(document.getElementById('dash-search').value||'').toLowerCase();
  const filtered=state.history.filter(h=>{
    const fm=dashFilter==='all'||h.status.toLowerCase()===dashFilter;
    const sm=h.url.toLowerCase().includes(search);
    return fm&&sm;
  });
  const tbody=document.getElementById('dash-tbody');
  if(!filtered.length){
    tbody.innerHTML=`<tr><td colspan="4" class="dash-empty">${state.history.length===0?'No scans yet — try the URL scanner!':'No matches found.'}</td></tr>`;
    return;
  }
  tbody.innerHTML=filtered.map((h,idx)=>`
    <tr class="dash-row" style="animation:fadeUp .4s ${idx*0.05}s ease both">
      <td class="mono" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--txt3)">${h.url}</td>
      <td><span class="status-badge" style="background:${h.bgClr};color:${h.clr};border:1px solid ${h.clr}20">${h.status}</span></td>
      <td class="mono" style="color:${h.clr};font-weight:700">${h.score}/100</td>
      <td>${h.date}</td>
    </tr>`).join('');
}

/* ═══════════════════════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════════════════════ */
let authMode='signin';

function switchMode(mode){
  authMode=mode;
  document.getElementById('signin-tab').classList.toggle('active',mode==='signin');
  document.getElementById('signup-tab').classList.toggle('active',mode==='signup');
  const isSignup=mode==='signup';
  
  // Use classList instead of style.display for animations
  document.getElementById('signup-fields').classList.toggle('show', isSignup);
  document.getElementById('signup-fields-2').classList.toggle('show', isSignup);
  document.getElementById('terms-row').classList.toggle('show', isSignup);
  document.getElementById('forgot-wrap').classList.toggle('show', !isSignup);
  
  document.getElementById('submit-btn').textContent=isSignup?'Create Account →':'Sign In →';
  document.getElementById('auth-left-title').textContent=isSignup?'Join PhishGuard.':'Welcome back.';
  document.getElementById('auth-left-sub').textContent=isSignup
    ?'Create an account and start protecting yourself from phishing threats.'
    :'Sign in to access your security dashboard and full scan history.';
  // Clear errors and inputs
  ['name','email','password','confirm','terms'].forEach(k=>clearErr(k));
  ['f-name','f-email','f-password','f-confirm'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('f-terms').checked=false;
  document.getElementById('terms-err').className='';
}

function clearErr(key){
  const errEl=document.getElementById('err-'+key);
  const inputEl=document.getElementById('f-'+key);
  if(errEl){ errEl.textContent=''; errEl.className='field-err'; }
  if(inputEl) inputEl.classList.remove('err');
}

function showErr(key,msg){
  const errEl=document.getElementById('err-'+key);
  const inputEl=document.getElementById('f-'+key);
  if(errEl){ errEl.textContent=msg; errEl.className='field-err show'; }
  if(inputEl) inputEl.classList.add('err');
}

/* ═══════════════════════════════════════════════════════════════
   FORGOT PASSWORD
═══════════════════════════════════════════════════════════════ */
function forgotPassword(){
  const email = prompt('Please enter your email address to reset your password:');
  
  if(!email){
    return; // User cancelled
  }
  
  // Basic email validation
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Try Firebase password reset if available
  if(useFirebase && typeof firebase !== 'undefined' && firebase.auth){
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        showToast('Password reset email sent! Check your inbox.', 'success');
      })
      .catch((error) => {
        console.log('Firebase reset error:', error);
        if(error.code === 'auth/user-not-found'){
          showToast('No account found with this email address', 'error');
        } else if(error.code === 'auth/invalid-email'){
          showToast('Invalid email address', 'error');
        } else if(error.code === 'auth/too-many-requests'){
          showToast('Too many attempts. Please try again later.', 'error');
        } else {
          showToast('Failed to send reset email. Please try again.', 'error');
        }
      });
  } else {
    // Fallback for demo mode (no Firebase)
    const users = JSON.parse(localStorage.getItem('phishguard_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if(!user){
      showToast('No account found with this email address', 'error');
      return;
    }
    
    // Simulate sending email
    showToast('Password reset email sent! (Demo mode - check console)', 'success');
    console.log(`Password reset link for ${email}: Use this to reset your password`);
    
    // Show reset dialog after a moment
    setTimeout(() => {
      const newPassword = prompt(`Enter new password for ${email}:`);
      if(newPassword && newPassword.length >= 6){
        const confirmPassword = prompt('Confirm new password:');
        if(newPassword === confirmPassword){
          // Update password
          const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
          if(userIndex !== -1){
            users[userIndex].password = newPassword;
            localStorage.setItem('phishguard_users', JSON.stringify(users));
            
            // If current user, update session
            if(state.user && state.user.email.toLowerCase() === email.toLowerCase()){
              state.user.password = newPassword;
              saveSession();
            }
            
            showToast('Password updated successfully!', 'success');
          }
        } else {
          showToast('Passwords do not match', 'error');
        }
      } else if(newPassword !== null) {
        showToast('Password must be at least 6 characters', 'error');
      }
    }, 1500);
  }
}

function submitAuth(){
  const email=document.getElementById('f-email').value.trim();
  const password=document.getElementById('f-password').value;
  const name=document.getElementById('f-name').value.trim();
  const confirm=document.getElementById('f-confirm').value;
  const terms=document.getElementById('f-terms').checked;
  let valid=true;

  // Clear all
  ['name','email','password','confirm','terms'].forEach(k=>clearErr(k));
  document.getElementById('terms-err').className='';

  if(!email.includes('@')){ showErr('email','Invalid email address'); valid=false; }
  if(password.length<6){ showErr('password','Minimum 6 characters'); valid=false; }
  if(authMode==='signup'){
    if(!name){ showErr('name','Full name required'); valid=false; }
    if(password!==confirm){ showErr('confirm','Passwords don\'t match'); valid=false; }
    if(!terms){
      document.getElementById('terms-err').textContent='Please accept the terms';
      document.getElementById('terms-err').className='show';
      valid=false;
    }
  }
  if(!valid) return;

  const btn=document.getElementById('submit-btn');
  btn.disabled=true;
  btn.innerHTML=`<span style="width:16px;height:16px;border:2px solid rgba(5,10,7,.25);border-top-color:#050a07;border-radius:50%;display:inline-block;animation:spin .8s linear infinite"></span> ${authMode==='signin'?'Signing in…':'Creating account…'}`;

  // Use Firebase if available
  if (useFirebase) {
    if (authMode === 'signup') {
      signUpWithEmail(email, password, name).then(result => {
        if (result.success) {
          state.user = {
            uid: result.user.uid,
            name: name,
            email: email,
            loginMethod: 'Email',
            memberSince: new Date().toLocaleDateString()
          };
          saveSession();
          updateNavAuth();
          showToast('Account created successfully!', 'success');
          btn.disabled=false;
          btn.textContent='Create Account →';
          setTimeout(() => navigateSPA('dashboard'), 800);
        } else {
          showToast(result.error, 'error');
          btn.disabled=false;
          btn.textContent='Create Account →';
        }
      });
    } else {
      signInWithEmail(email, password).then(result => {
        if (result.success) {
          state.user = {
            uid: result.user.uid,
            name: result.profile.name,
            email: result.profile.email,
            loginMethod: result.profile.loginMethod,
            memberSince: result.profile.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
          };
          
          // Load user's scan history from Firebase
          getUserScans(result.user.uid).then(scans => {
            state.history = scans;
            saveSession();
            updateNavAuth();
            showToast('Welcome back!', 'success');
            btn.disabled=false;
            btn.textContent='Sign In →';
            setTimeout(() => navigateSPA('dashboard'), 800);
          });
        } else {
          showToast(result.error, 'error');
          btn.disabled=false;
          btn.textContent='Sign In →';
        }
      });
    }
  } else {
    // Fallback to localStorage (existing demo mode)
    setTimeout(()=>{
      state.user={
        name: name||email.split('@')[0], 
        email,
        loginMethod: 'Email',
        memberSince: new Date().toLocaleDateString(),
        password: password
      };
      saveSession();
      updateNavAuth();
      showToast(authMode==='signin'?'Welcome back!':'Account created!','success');
      btn.disabled=false;
      btn.textContent=authMode==='signin'?'Sign In →':'Create Account →';
      setTimeout(()=>navigateSPA('dashboard'),900);
    },1500);
  }
}

function initPage(){
  updateNavAuth();
  document.querySelectorAll('.nav-link').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===state.page);
  });
  
  // Check for hash navigation (e.g., from extension dashboard link)
  const hash = window.location.hash.substring(1); // Remove #
  if(hash && ['home', 'check', 'dashboard', 'profile', 'auth'].includes(hash)){
    state.page = hash;
    document.body.dataset.page = hash;
  }
  
  // Show the current page
  const currentPage = document.getElementById(`page-${state.page}`);
  if(currentPage){
    currentPage.classList.add('active');
    currentPage.style.opacity = '1';
    currentPage.style.transform = 'translateY(0)';
  }
  
  if(state.page==='dashboard') renderDashboard();
  if(state.page==='check') renderHistory();
  if(state.page==='profile') renderProfile();
  
  // Auth page: setup event listeners for form inputs
  if(state.page==='auth'){
    const inputs = document.querySelectorAll('.field-input');
    inputs.forEach(el=>{
      el.addEventListener('keydown',e=>{ if(e.key==='Enter') submitAuth(); });
    });
  }
}

// Wait for DOM to be ready before initializing
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

/* ═══════════════════════════════════════════════════════════════
   FIREBASE AUTH STATE LISTENER
═══════════════════════════════════════════════════════════════ */
// Listen to Firebase auth state changes
if (useFirebase) {
  onAuthStateChanged((authData) => {
    if (authData) {
      // User is signed in
      state.user = {
        uid: authData.user.uid,
        name: authData.profile.name,
        email: authData.profile.email,
        loginMethod: authData.profile.loginMethod,
        memberSince: authData.profile.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
      };
      
      // Load scan history from Firebase
      getUserScans(authData.user.uid).then(scans => {
        state.history = scans;
        saveSession();
        updateNavAuth();
        
        // Refresh dashboard if on dashboard page
        if (state.page === 'dashboard') {
          renderDashboard();
        }
      });
    } else {
      // User is signed out - handled by logout function
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════════ */
function renderProfile(){
  const u = state.user;
  if(!u){
    navigateSPA('auth');
    return;
  }
  
  // Set form values
  const nameInput = document.getElementById('profile-name-input');
  const emailInput = document.getElementById('profile-email-input');
  if(nameInput) nameInput.value = u.name || '';
  if(emailInput) emailInput.value = u.email || '';
  
  // Set account info
  const memberSince = document.getElementById('profile-member-since');
  const totalScans = document.getElementById('profile-total-scans');
  const loginMethod = document.getElementById('profile-login-method');
  
  if(memberSince) memberSince.textContent = u.memberSince || new Date().toLocaleDateString();
  if(totalScans) totalScans.textContent = state.history.length;
  if(loginMethod) loginMethod.textContent = u.loginMethod || 'Email';
}

function updateProfile(){
  const name = document.getElementById('profile-name-input').value.trim();
  
  // Clear errors
  document.getElementById('err-profile-name').textContent = '';
  document.getElementById('err-profile-name').classList.remove('show');
  
  // Validate
  if(!name){
    document.getElementById('err-profile-name').textContent = 'Name is required';
    document.getElementById('err-profile-name').classList.add('show');
    return;
  }
  
  // Update user
  state.user.name = name;
  saveSession();
  updateNavAuth();
  showToast('Profile updated successfully!', 'success');
}

function changePassword(){
  const currentPassword = document.getElementById('profile-current-password').value;
  const newPassword = document.getElementById('profile-new-password').value;
  const confirmPassword = document.getElementById('profile-confirm-password').value;
  
  // Clear errors
  ['current-password', 'new-password', 'confirm-password'].forEach(id => {
    document.getElementById(`err-${id}`).textContent = '';
    document.getElementById(`err-${id}`).classList.remove('show');
  });
  
  // Validate
  let valid = true;
  
  if(!currentPassword){
    document.getElementById('err-current-password').textContent = 'Current password required';
    document.getElementById('err-current-password').classList.add('show');
    valid = false;
  }
  
  if(newPassword.length < 6){
    document.getElementById('err-new-password').textContent = 'Minimum 6 characters';
    document.getElementById('err-new-password').classList.add('show');
    valid = false;
  }
  
  if(newPassword !== confirmPassword){
    document.getElementById('err-confirm-password').textContent = 'Passwords don\'t match';
    document.getElementById('err-confirm-password').classList.add('show');
    valid = false;
  }
  
  if(!valid) return;
  
  // Update password with Firebase if available
  if (useFirebase && typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    
    // Re-authenticate user with current password first
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    
    user.reauthenticateWithCredential(credential)
      .then(() => {
        // Re-authentication successful, now update password
        return user.updatePassword(newPassword);
      })
      .then(() => {
        // Password updated successfully in Firebase
        if(state.user) {
          state.user.password = newPassword;
          saveSession();
        }
        
        // Clear fields
        document.getElementById('profile-current-password').value = '';
        document.getElementById('profile-new-password').value = '';
        document.getElementById('profile-confirm-password').value = '';
        
        showToast('Password updated successfully!', 'success');
      })
      .catch((error) => {
        console.log('Password update error:', error);
        
        // Handle specific errors
        if (error.code === 'auth/wrong-password') {
          document.getElementById('err-current-password').textContent = 'Current password is incorrect';
          document.getElementById('err-current-password').classList.add('show');
        } else if (error.code === 'auth/weak-password') {
          document.getElementById('err-new-password').textContent = 'Password is too weak';
          document.getElementById('err-new-password').classList.add('show');
        } else if (error.code === 'auth/requires-recent-login') {
          showToast('Please sign out and sign in again to change password', 'error');
        } else {
          showToast('Failed to update password. Please try again.', 'error');
        }
      });
  } else {
    // Fallback to localStorage for demo mode
    // Verify current password
    if (state.user && state.user.password && state.user.password !== currentPassword) {
      document.getElementById('err-current-password').textContent = 'Current password is incorrect';
      document.getElementById('err-current-password').classList.add('show');
      return;
    }
    
    // Update password in state
    if(state.user) {
      state.user.password = newPassword;
      saveSession();
    }
    
    // Clear fields
    document.getElementById('profile-current-password').value = '';
    document.getElementById('profile-new-password').value = '';
    document.getElementById('profile-confirm-password').value = '';
    
    showToast('Password updated successfully!', 'success');
  }
}

function clearHistory(){
  if(!confirm('Are you sure you want to clear all scan history? This cannot be undone.')){
    return;
  }
  
  // Clear from Firebase if available
  if (useFirebase && state.user && state.user.uid) {
    clearUserScans(state.user.uid).then(() => {
      state.history = [];
      saveSession();
      showToast('Scan history cleared', 'success');
      renderProfile();
    }).catch(err => {
      console.log('Firebase clear error:', err);
      state.history = [];
      saveSession();
      showToast('Scan history cleared', 'success');
      renderProfile();
    });
  } else {
    state.history = [];
    saveSession();
    showToast('Scan history cleared', 'success');
    renderProfile();
  }
}

function deleteAccount(){
  if(!confirm('Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.')){
    return;
  }
  
  const confirmText = prompt('Type "DELETE" to confirm account deletion:');
  if(confirmText !== 'DELETE'){
    showToast('Account deletion cancelled', 'error');
    return;
  }
  
  // Delete from Firebase if available
  if (useFirebase && state.user && state.user.uid) {
    deleteUserProfile(state.user.uid).then(() => {
      // Clear all local data
      state.user = null;
      state.history = [];
      localStorage.clear();
      
      showToast('Account deleted successfully', 'success');
      setTimeout(() => navigateSPA('home'), 1000);
    }).catch(err => {
      console.log('Firebase delete error:', err);
      showToast('Error deleting account. Please try again.', 'error');
    });
  } else {
    // Clear all data (localStorage only)
    state.user = null;
    state.history = [];
    localStorage.clear();
    
    showToast('Account deleted successfully', 'success');
    setTimeout(() => navigateSPA('home'), 1000);
  }
}

function signInWithGoogle(){
  // Use Firebase Google Sign In if available
  if (useFirebase) {
    signInWithGoogleProvider().then(result => {
      if (result.success) {
        state.user = {
          uid: result.user.uid,
          name: result.profile.name,
          email: result.profile.email,
          loginMethod: 'Google',
          memberSince: result.profile.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
        };
        
        // Load user's scan history
        getUserScans(result.user.uid).then(scans => {
          state.history = scans;
          saveSession();
          updateNavAuth();
          showToast('Signed in with Google!', 'success');
          setTimeout(() => navigateSPA('dashboard'), 800);
        });
      } else {
        showToast(result.error, 'error');
      }
    });
  } else {
    // Fallback to demo mode
    showToast('Google Sign In coming soon!', 'error');
    
    // Demo: Auto sign in with Google account
    setTimeout(() => {
      const googleUser = {
        name: 'Google User',
        email: 'user@gmail.com',
        loginMethod: 'Google',
        memberSince: new Date().toLocaleDateString(),
        password: null // Google users don't have passwords
      };
      
      state.user = googleUser;
      saveSession();
      updateNavAuth();
      showToast('Signed in with Google!', 'success');
      setTimeout(() => navigateSPA('dashboard'), 900);
    }, 1500);
  }
}

/* ═══════════════════════════════════════════════════════════════
   TEAM MEMBER EXPAND/COLLAPSE
═══════════════════════════════════════════════════════════════ */
function toggleTeamMember(card){
  const linksDiv = card.nextElementSibling;
  const expandIcon = card.querySelector('.expand-icon');
  const isExpanded = linksDiv.classList.contains('expanded');
  
  if(isExpanded){
    // Collapse
    linksDiv.classList.remove('expanded');
    expandIcon.style.transform = 'rotate(0deg)';
  } else {
    // Expand
    linksDiv.classList.add('expanded');
    expandIcon.style.transform = 'rotate(180deg)';
  }
}
