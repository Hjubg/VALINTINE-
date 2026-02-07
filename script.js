const qs = s=>document.querySelector(s);
const landing = qs('#landing');
const romance = qs('#romance');
const week = qs('#week');
const yesBtn = qs('#yes');
const noBtn = qs('#no');
const openWeekBtn = qs('#openWeek');
const nextDayBtn = qs('#nextDay');
const todayInfo = qs('#todayInfo');
const dayCard = qs('#dayCard');

const DAYS = [
  'Prelude Day',
  'Rose Day',
  'Propose Day',
  'Chocolate Day',
  'Teddy Day',
  'Promise Day',
  'Hug Day',
  'Kiss Day'
];

/* --- Evasive NO button behavior --- */
function randomMove(el){
  const box = el.parentElement.getBoundingClientRect();
  const px = Math.max(0, box.width - el.offsetWidth);
  const py = Math.max(0, 60); // small vertical range
  const x = Math.floor(Math.random()*px);
  const y = Math.floor(Math.random()*py) - 10;
  el.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener('mouseenter', ()=>{ randomMove(noBtn); });
noBtn.addEventListener('click', ()=>{ randomMove(noBtn); });

/* --- View switching --- */
yesBtn.addEventListener('click', ()=>{
  landing.classList.add('hidden');
  romance.classList.remove('hidden');
  // pulse the yes button briefly for effect
  yesBtn.classList.add('pulse');
  setTimeout(()=> yesBtn.classList.remove('pulse'), 3000);
});
openWeekBtn.addEventListener('click', ()=>{
  romance.classList.add('hidden');
  week.classList.remove('hidden');
  startWeekFlow();
});

/* --- Valentine Week unlock logic --- */
function atMidnight(date){ // return midnight of given date local
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d;
}

function loadState(){
  const raw = localStorage.getItem('val_start');
  if(raw) return new Date(raw);
  const today = new Date();
  const start = atMidnight(today);
  localStorage.setItem('val_start', start.toISOString());
  return start;
}

let startDate, currentIndex=0, countdownInterval=null;

function startWeekFlow(){
  startDate = loadState();
  // find latest unlocked index
  const now = new Date();
  for(let i=DAYS.length-1;i>=0;i--){
    const unlock = new Date(startDate);
    unlock.setDate(unlock.getDate()+i);
    if(now >= unlock){ currentIndex = i; break; }
  }
  renderDay();
  if(countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(renderDay, 1000);
}

function renderDay(){
  const now = new Date();
  const dayName = DAYS[currentIndex] || '—';
  const unlockDate = new Date(startDate);
  unlockDate.setDate(unlockDate.getDate()+currentIndex);

  // Today info + date
  todayInfo.innerHTML = `<strong>${dayName}</strong> — ${unlockDate.toLocaleDateString()} `;

  const isUnlocked = now >= unlockDate;
  if(isUnlocked){
    dayCard.innerHTML = `<h3>${dayName}</h3><p class="wish">WISH: Happy ${dayName}! 🌹</p><p>Today is Day ${currentIndex+1} of Valentine Week.</p>`;
    nextDayBtn.disabled = (currentIndex >= DAYS.length-1);
  } else {
    const diff = unlockDate - now;
    const hrs = Math.floor(diff/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    dayCard.innerHTML = `<h3>Locked</h3><p>Opens at local midnight: ${unlockDate.toLocaleString()}</p><p class="countdown">${hrs}h ${mins}m ${secs}s</p>`;
    nextDayBtn.disabled = true;
  }

  // show extra message for day 1
  if(currentIndex===0){
    dayCard.innerHTML += `<div class="note"><p>Today is the 1st day of Valentine Week — ${DAYS[0]}.</p></div>`;
  }
}

nextDayBtn.addEventListener('click', ()=>{
  const nextIndex = Math.min(DAYS.length-1, currentIndex+1);
  const unlockDate = new Date(startDate); unlockDate.setDate(unlockDate.getDate()+nextIndex);
  if(new Date() >= unlockDate){ currentIndex = nextIndex; renderDay(); }
});

// initial tiny interaction: nudge no button randomly every 5s to be playful
setInterval(()=>{ randomMove(noBtn); }, 5000);

/* create floating hearts */
function createHearts(n=12){
  const container = document.querySelector('.hearts');
  if(!container) return;
  for(let i=0;i<n;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const left = Math.random()*100;
    const size = 10 + Math.floor(Math.random()*20);
    h.style.left = left + '%';
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.animationDuration = (6 + Math.random()*8) + 's';
    h.style.animationDelay = -(Math.random()*10) + 's';
    container.appendChild(h);
  }
}

createHearts(18);
