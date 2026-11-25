(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => motion.matches ? 'instant' : 'smooth';
  const clamp = (v, min=0, max=1) => Math.max(min, Math.min(max,v));
  const canonical = 'https://akshaykarvi2605-svg.github.io/Wedding-invite/';
  const endpoint = 'https://akshay-yashada-blessings.justguppy64.chatgpt.site/api/blessings';

  const menu = $('menu'), menuButton = $('menuToggle');
  function showMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  }
  menuButton.onclick = () => showMenu(menu.hidden);
  document.addEventListener('click', e => {
    if (e.target.closest('#menu a') || (!menu.contains(e.target) && !menuButton.contains(e.target))) showMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { showMenu(false); menuButton.focus(); }
  });
  let progressFrame;
  function updateProgress(){
    progressFrame = 0;
    const total = document.documentElement.scrollHeight - innerHeight;
    $('progress').style.transform = 'scaleX(' + clamp(total > 0 ? scrollY / total : 0) + ')';
  }
  function scheduleProgress(){ if(!progressFrame) progressFrame=requestAnimationFrame(updateProgress); }
  window.addEventListener('scroll', scheduleProgress, {passive:true});
  window.addEventListener('resize', scheduleProgress);
  updateProgress();

  const audio = $('score'), music = $('music');
  function soundState() {
    const playing = !audio.paused;
    music.setAttribute('aria-pressed',String(playing));
    music.querySelector('span').textContent = playing ? 'Sound on' : 'Sound off';
  }
  audio.volume=.38;
  audio.addEventListener('play',soundState); audio.addEventListener('pause',soundState);
  music.onclick=async()=>{
    if(!audio.paused){ audio.pause(); soundState(); return; }
    try { await audio.play(); } catch { music.querySelector('span').textContent='Retry sound'; }
  };

  const entrance = $('entrance'), curtains = $('curtains'), sheet = $('coupleSheet');
  const wax = $('wax'), envelope = $('envelope');
  let partAmount = 0, curtainDrag = null, revealTimer, scrollTimer;
  let entered = false, focusOnReveal = false;

  function drawCurtains(amount) {
    partAmount = clamp(amount);
    for (const curtain of curtains.children) {
      curtain.style.transform = `translateX(-${partAmount * 99}%) scaleX(${1 - .16 * partAmount})`;
    }
    sheet.style.opacity = String(clamp((partAmount - .12) / .85));
  }
  function finishEntrance() {
    clearTimeout(revealTimer);
    entered = true;
    curtains.classList.add('settling');
    drawCurtains(1);
    entrance.classList.add('unveiled');
    sheet.inert = false;
    sheet.removeAttribute('aria-hidden');
    if (focusOnReveal || document.activeElement === curtains) $('coupleTitle').focus({preventScroll:true});
    focusOnReveal = false;
    curtains.inert = true;
    curtains.style.pointerEvents = 'none';
  }
  function scheduleReveal() {
    clearTimeout(revealTimer);
    if (!entered && !curtainDrag) revealTimer = setTimeout(finishEntrance, motion.matches ? 0 : 190);
  }
  curtains.onclick = finishEntrance;
  curtains.onpointerdown = e => {
    if (entered || !e.isPrimary || e.button !== 0) return;
    clearTimeout(revealTimer);
    curtains.classList.remove('settling');
    const middle = curtains.getBoundingClientRect().left + curtains.clientWidth / 2;
    curtainDrag = {id:e.pointerId, x:e.clientX, dir:e.clientX < middle ? -1 : 1, start:partAmount};
    curtains.setPointerCapture(e.pointerId);
  };
  curtains.onpointermove = e => {
    if (curtainDrag?.id === e.pointerId)
      drawCurtains(curtainDrag.start + (e.clientX - curtainDrag.x) * curtainDrag.dir / (curtains.clientWidth * .4));
  };
  curtains.onpointerup = curtains.onpointercancel = e => {
    if (curtainDrag?.id !== e.pointerId) return;
    curtainDrag = null;
    finishEntrance();
  };

  function resetEnvelope() {
    clearTimeout(scrollTimer);
    envelope.classList.remove('opening');
    wax.removeAttribute('aria-busy');
  }
  wax.onclick = () => {
    if (wax.hasAttribute('aria-busy')) return;
    wax.setAttribute('aria-busy','true');
    envelope.classList.add('opening');
    scrollTimer = setTimeout(() => {
      focusOnReveal = true;
      entrance.scrollIntoView({behavior:behavior(), block:'start'});
      if (entered || !('IntersectionObserver' in window)) finishEntrance();
    }, motion.matches ? 0 : 1080);
  };

  if ('IntersectionObserver' in window) {
    const arrival = new IntersectionObserver(([entry]) => {
      entrance.classList.toggle('in-view',entry.isIntersecting);
      if (entry.isIntersecting) scheduleReveal();
      else clearTimeout(revealTimer);
    }, {rootMargin:'0px 0px -25% 0px'});
    arrival.observe(entrance);
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.bottom <= innerHeight / 2) resetEnvelope();
    }, {rootMargin:'-10% 0px 0px 0px'}).observe(wax);
  } else {
    finishEntrance();
  }
  const petals = entrance.querySelector('.petals');
  for (let i=0;i<7;i++) {
    const petal = document.createElement('i');
    petal.style.left = (8 + i * 13) + '%';
    petal.style.setProperty('--delay',(-1.37 * i) + 's');
    petals.append(petal);
  }

  const roll=$('roll'), tassel=$('tassel');
  let amount=0,rollDrag=null,suppressClick=false;
  const minRoll=35, maxRoll=224;
  function setRoll(value,animate=false) {
    amount=clamp(value);
    roll.style.transition=animate&&!motion.matches?'height .45s ease':'none';
    roll.style.height=(minRoll+amount*(maxRoll-minRoll))+'px';
    roll.setAttribute('aria-hidden',String(amount<.98));
    $('unroll').textContent=amount>.98?'Hide details':'Ceremony details';
  }
  function toggleRoll(){setRoll(amount>.98?0:1,true);}
  tassel.onpointerdown=e=>{
    if(!e.isPrimary||e.button!==0)return;
    const shown=(roll.getBoundingClientRect().height-minRoll)/(maxRoll-minRoll);
    setRoll(shown);rollDrag={id:e.pointerId,y:e.clientY,start:amount};suppressClick=false;tassel.setPointerCapture(e.pointerId);
  };
  tassel.onpointermove=e=>{
    if(rollDrag?.id!==e.pointerId)return;
    const delta=e.clientY-rollDrag.y;
    if(Math.abs(delta)>4)suppressClick=true;
    setRoll(rollDrag.start+delta/(maxRoll-minRoll));
  };
  tassel.onpointerup=tassel.onpointercancel=e=>{if(rollDrag?.id===e.pointerId){rollDrag=null;if(e.type==='pointercancel')suppressClick=true;}};
  tassel.onclick=e=>{if(!suppressClick||e.detail===0)toggleRoll();suppressClick=false;};
  tassel.onkeydown=e=>{
    const changes={ArrowDown:amount+.1,ArrowUp:amount-.1,Home:0,End:1};
    if(e.key in changes){e.preventDefault();setRoll(changes[e.key]);}
  };
  $('unroll').onclick=toggleRoll;setRoll(0);

  const tickNodes=[...document.querySelectorAll('.count b')], ceremony=Date.parse('2027-02-28T12:14:00+05:30');
  function tick(){
    const seconds=Math.max(0,Math.floor((ceremony-Date.now())/1000));
    const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
    values.forEach((v,i)=>{tickNodes[i].textContent=String(v).padStart(2,'0');});
    if(!seconds) $('clockTitle').textContent='The wedding day has arrived.';
  }
  tick();setInterval(()=>{if(!document.hidden)tick();},1000);document.addEventListener('visibilitychange',tick);
  const deck=$('deck'),cards=[...deck.querySelectorAll('article')];
  let deckIndex=0, deckFrame;
  function syncDeck(){
    deckFrame=0;
    const center=deck.getBoundingClientRect().left+deck.clientWidth/2;
    const gaps=cards.map(card=>Math.abs(card.getBoundingClientRect().left+card.offsetWidth/2-center));
    deckIndex=gaps.indexOf(Math.min(...gaps));$('cardStatus').textContent=(deckIndex+1)+' of '+cards.length;
    $('cardPrev').disabled=deckIndex===0;$('cardNext').disabled=deckIndex===cards.length-1;
  }
  function toCard(index){
    const c=cards[clamp(index,0,cards.length-1)];
    deck.scrollBy({left:c.getBoundingClientRect().left+c.offsetWidth/2-deck.getBoundingClientRect().left-deck.clientWidth/2,behavior:behavior()});
  }
  deck.onscroll=()=>{if(!deckFrame)deckFrame=requestAnimationFrame(syncDeck);};
  $('cardPrev').onclick=()=>toCard(deckIndex-1);$('cardNext').onclick=()=>toCard(deckIndex+1);
  deck.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();toCard(deckIndex+(e.key==='ArrowRight'?1:-1));}};
  window.addEventListener('resize',syncDeck);syncDeck();

  const foil=$('foil'), card=$('scratchCard'),note=$('hiddenNote'),ctx=foil.getContext('2d',{willReadFrequently:true});
  let scratchId=null,last=null,checkTime=0,read=false,touched=false;
  foil.width=648;foil.height=400;
  function paintFoil(texture){
    if(touched||read||!ctx)return;
    ctx.globalCompositeOperation='source-over';ctx.fillStyle='#cba559';ctx.fillRect(0,0,648,400);
    if(texture)ctx.drawImage(texture,0,0,648,400);
    ctx.strokeStyle='#735025';ctx.lineWidth=1;ctx.strokeRect(18,18,612,364);
    ctx.fillStyle='#553517';ctx.textAlign='center';ctx.font='italic 500 52px Cormorant,Georgia,serif';ctx.fillText('A note for you',324,210);
    ctx.strokeStyle='#795b32';ctx.beginPath();ctx.moveTo(288,241);ctx.lineTo(360,241);ctx.stroke();
  }
  paintFoil();
  const texture=new Image();texture.onload=()=>{paintFoil(texture);document.fonts?.ready.then(()=>paintFoil(texture));};
  function loadFoil(){texture.src='assets/foil.webp';}
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){loadFoil();io.disconnect();}},{rootMargin:'400px'});io.observe(card);}else loadFoil();
  function revealNote(){read=true;card.classList.add('revealed');note.removeAttribute('aria-hidden');$('revealNote').textContent='Note revealed';$('revealNote').disabled=true;}
  function scratchPoint(e){
    const rect=foil.getBoundingClientRect(), dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2;
    const angle=2*Math.PI/180, x=(dx*Math.cos(angle)-dy*Math.sin(angle))/foil.clientWidth+.5,y=(dx*Math.sin(angle)+dy*Math.cos(angle))/foil.clientHeight+.5;
    return [x*foil.width,y*foil.height];
  }
  function erase(e){
    if(read||!ctx)return;
    touched=true;const p=scratchPoint(e);
    ctx.globalCompositeOperation='destination-out';ctx.lineWidth=55;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(...(last||p));ctx.lineTo(p[0]+.01,p[1]+.01);ctx.stroke();last=p;
  }
  function coverage(){
    if(read||!ctx)return;
    const data=ctx.getImageData(0,0,foil.width,foil.height).data;
    let erased=0,total=0;
    for(let y=5;y<foil.height;y+=12){for(let x=5;x<foil.width;x+=12){if(data[(y*foil.width+x)*4+3]<64)erased++;total++;}}
    if(erased/total>.54)revealNote();
  }
  foil.onpointerdown=e=>{if(read||!e.isPrimary||e.button!==0)return;scratchId=e.pointerId;last=null;foil.setPointerCapture(e.pointerId);erase(e);};
  foil.onpointermove=e=>{if(scratchId!==e.pointerId)return;const events=e.getCoalescedEvents?.();(events?.length?events:[e]).forEach(erase);if(performance.now()-checkTime>180){checkTime=performance.now();coverage();}};
  foil.onpointerup=foil.onpointercancel=e=>{if(e.pointerId===scratchId){scratchId=null;last=null;coverage();}};
  $('revealNote').onclick=revealNote;

  function openDoors(){
    const open=!$('doorframe').classList.contains('doors-open');
    $('doorframe').classList.toggle('doors-open',open);$('address').inert=!open;$('address').setAttribute('aria-hidden',String(!open));
    $('doorHit').hidden=open;$('openDoors').textContent=open?'Hide address':'View address';$('openDoors').setAttribute('aria-expanded',String(open));
    if(open)$('address').querySelector('a').focus({preventScroll:true});
  }
  $('openDoors').onclick=openDoors;$('doorHit').onclick=openDoors;
  let sending=false, pending=null;
  $('blessForm').onsubmit=async e=>{
    e.preventDefault();if(sending)return;
    const name=$('guest').value.trim(),message=$('wish').value.trim(),status=$('wishStatus');
    if(!name||!message){status.textContent='Please add your name and a blessing.';return;}
    if(!pending||pending.name!==name||pending.message!==message)pending={name,message,receipt:crypto.randomUUID()};
    sending=true;$('sendWish').disabled=true;status.textContent='Sending your blessing…';
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending),signal:controller.signal});
      if(!res.ok)throw Error('Unavailable');
      const saved=await res.json();if(!saved.saved||saved.receipt!==pending.receipt)throw Error('Unconfirmed');
      $('blessForm').reset();pending=null;status.textContent='Thank you. Your blessing has been saved for Akshay and Yashada.';
    } catch{status.textContent='Your blessing could not be confirmed. Your words are still here. Please try again.';}
    finally{clearTimeout(timeout);sending=false;$('sendWish').disabled=false;}
  };
  $('share').onclick=async()=>{
    const status=$('shareStatus');status.textContent='';
    try{
      if(navigator.share){await navigator.share({title:'Akshay & Yashada · Wedding Invitation',url:canonical});}
      else if(navigator.clipboard){await navigator.clipboard.writeText(canonical);status.textContent='Invitation link copied.';}
      else status.textContent=canonical;
    } catch(error){if(error.name!=='AbortError')status.textContent=canonical;}
  };
  $('replay').onclick=()=>{location.replace(location.href.split('#')[0]+'#cover');location.reload();};
  if(!location.hash)history.scrollRestoration='manual';
})();
