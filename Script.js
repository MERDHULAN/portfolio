const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;

// Theme (remembered)
const icon=$('#theme i');
function setTheme(t){root.dataset.theme=t;icon.className=t==='dark'?'fas fa-moon':'fas fa-sun';try{localStorage.setItem('theme',t)}catch(e){}}
let saved;try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
$('#theme').onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');

// Mobile menu
const menu=$('#menu'),links=$('#links');
menu.onclick=()=>menu.setAttribute('aria-expanded',links.classList.toggle('open'));
$$('#links a').forEach(a=>a.onclick=()=>links.classList.remove('open'));

// Typing
if(window.Typed)new Typed('#typed',{strings:['IT Web Developer','Shopify Developer','Python Developer'],typeSpeed:65,backSpeed:40,backDelay:1300,loop:true});

// Scroll progress, active link, back to top
const secs=$$('main section[id]'),navA=$$('#links a');
addEventListener('scroll',()=>{
  const h=root.scrollHeight-innerHeight;$('#progress').style.width=(scrollY/h*100)+'%';
  let cur='';secs.forEach(s=>{if(scrollY>=s.offsetTop-140)cur=s.id});
  navA.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+cur));
},{passive:true});

// Reveal + count up
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
['.section h2','.card','.job','.project','.cert','.contact-row','.form','.certs h3','.prose','.filters'].forEach(q=>$$(q).forEach(el=>{
  el.classList.add('rv');el.style.setProperty('--d',Math.min([...el.parentElement.children].indexOf(el),5)*90+'ms');io.observe(el);
}));
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=+el.dataset.n,d=+el.dataset.d||0,t0=performance.now();
  (function tick(t){const p=Math.min((t-t0)/1200,1);el.textContent=(end*(1-Math.pow(1-p,3))).toFixed(d);if(p<1)requestAnimationFrame(tick)})(t0);
}),{threshold:.6});
$$('[data-n]').forEach(el=>cio.observe(el));

// Card spotlight
$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));

// About read more
$('#aboutBtn').onclick=function(){const m=$('#aboutMore');m.hidden=!m.hidden;this.textContent=m.hidden?'Read more':'Show less';this.setAttribute('aria-expanded',!m.hidden)};

// Project filter + modal
const P=[
 {t:'Inventory CRM System',tags:['HTML','CSS','JavaScript','SQL'],l:['Built a web application with complete CRUD functionality on a frontend stack with structured SQL backend scripts.','Engineered relational schemas and optimized queries for transactional inventory and client data.','Adaptive viewports render metrics dashboards cleanly on desktop and mobile.','Built with an agile team at Pentagon Innovations to client specifications.']},
 {t:'Desktop Music Player',tags:['Python','YouTube Music API'],l:['Integrated the YouTube Music API for media streaming and query management.','Added playback UI controls for a desktop experience.','Built during the Python with AI internship at Careerschool HR Solutions.']},
 {t:'Terminal Logic Engines',tags:['Python','CLI'],l:['Interactive Dice Roll and Rock-Paper-Scissors simulators for the command line.','Strict user-input sanitization loops keep gameplay stable.','Randomized conditional tracking drives each round.']},
 {t:'Personal Portfolio',tags:['HTML','CSS','JavaScript','Vercel'],l:['Responsive portfolio with theme switching, animations and custom layouts.','Hosted on Vercel with continuous deployment for high-availability access.','This is the site you are looking at.']}
];
$$('.filters button').forEach(b=>b.onclick=()=>{
  $$('.filters button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.project').forEach(p=>p.classList.toggle('hide',b.dataset.f!=='all'&&p.dataset.cat!==b.dataset.f));
});
let lastFocus;
function openM(m,focus){lastFocus=document.activeElement;m.hidden=false;document.body.style.overflow='hidden';(focus||m.querySelector('button,input')).focus()}
function closeM(m){m.hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus()}
const modal=$('#modal');
$$('.project').forEach(p=>p.onclick=()=>{
  const d=P[p.dataset.i];$('#mTitle').textContent=d.t;
  $('#mTags').innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('');
  $('#mList').innerHTML=d.l.map(x=>`<li>${x}</li>`).join('');openM(modal,$('#mClose'));
});
$('#mClose').onclick=()=>closeM(modal);

// Quick navigation (Ctrl/Cmd + K)
const pal=$('#palette'),pIn=$('#pIn'),pList=$('#pList');
const items=[['Home','#home'],['About','#about'],['Experience','#experience'],['Skills','#skills'],['Services','#services'],['Projects','#projects'],['Contact','#contact'],['Download CV','mithu.pdf'],['Toggle theme','theme']];
let sel=0,shown=items;
function render(){pList.innerHTML=shown.map((x,i)=>`<li class="${i===sel?'sel':''}" data-i="${i}">${x[0]}</li>`).join('')}
function go(i){const x=shown[i];if(!x)return;closeM(pal);if(x[1]==='theme')$('#theme').click();else if(x[1].endsWith('.pdf')){const a=document.createElement('a');a.href=x[1];a.download='';a.click()}else location.hash=x[1]}
function openP(){pIn.value='';shown=items;sel=0;render();openM(pal,pIn)}
$('#openPalette').onclick=openP;
pIn.oninput=()=>{shown=items.filter(x=>x[0].toLowerCase().includes(pIn.value.toLowerCase()));sel=0;render()};
pList.onclick=e=>{const li=e.target.closest('li');if(li)go(+li.dataset.i)};
pIn.onkeydown=e=>{
  if(e.key==='ArrowDown'){sel=Math.min(sel+1,shown.length-1);render();e.preventDefault()}
  if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);render();e.preventDefault()}
  if(e.key==='Enter')go(sel);
};
addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?openP():closeM(pal)}
  if(e.key==='Escape'){[modal,pal].forEach(m=>{if(!m.hidden)closeM(m)})}
});
[modal,pal].forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeM(m)}));

// Contact: copy email + mailto form
$('#copyMail').onclick=async()=>{
  try{await navigator.clipboard.writeText('merdhulan373ppt@gmail.com');$('#copyMsg').textContent='Copied'}catch(e){$('#copyMsg').textContent='Press Ctrl+C'}
  setTimeout(()=>$('#copyMsg').textContent='Copy',1800);
};
// Contact form posts to api/contact.js on this same site (set up on Vercel).
// If you clear FORM_ENDPOINT, the form falls back to opening the visitor's email app.
const FORM_ENDPOINT='/api/contact';
const fm=$('#formMsg');
fm.textContent=FORM_ENDPOINT?'Your message goes straight to my inbox.':'This opens your email app with the message filled in.';
$('#form').onsubmit=async e=>{
  e.preventDefault();const f=new FormData(e.target);
  if(!FORM_ENDPOINT){
    const body=`${f.get('msg')}\n\nFrom: ${f.get('name')} (${f.get('email')})`;
    location.href=`mailto:merdhulan373ppt@gmail.com?subject=${encodeURIComponent('Portfolio message from '+f.get('name'))}&body=${encodeURIComponent(body)}`;
    return;
  }
  const btn=e.target.querySelector('button[type=submit]');btn.disabled=true;fm.textContent='Sending...';
  try{
    const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(f))});
    if(!r.ok)throw new Error('HTTP '+r.status);
    e.target.reset();fm.textContent='Thanks, your message was sent. I will reply soon.';
  }catch(err){console.error('Contact form:',err.message);fm.textContent='Could not send. Please email merdhulan373ppt@gmail.com directly.'}
  btn.disabled=false;
};

// Hero name: letter-by-letter entrance
(()=>{const h=$('.hero h1'),t=h.textContent.trim();let i=0;h.setAttribute('aria-label',t);
 h.innerHTML=t.split(' ').map(w=>'<span class="w" aria-hidden="true">'+[...w].map(c=>`<span style="--i:${i++}">${c}</span>`).join('')+'</span>').join(' ');})();

// Marquee loop
(()=>{const tr=$('.track');tr.innerHTML+=tr.innerHTML})();

// Photo tilt following the pointer (desktop only)
if(matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches){
  const hp=$('.hero-photo'),hero=$('.hero');
  hero.addEventListener('pointermove',e=>{const r=hp.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))/innerWidth,y=(e.clientY-(r.top+r.height/2))/innerHeight;
    hp.style.transform=`perspective(1000px) rotateY(${x*14}deg) rotateX(${-y*14}deg)`});
  hero.addEventListener('pointerleave',()=>hp.style.transform='');
}

// Header: shrink on scroll, sliding link indicator, staggered links, theme icon spin
$$('#links li').forEach((li,i)=>li.style.setProperty('--i',i));
const ind=document.createElement('span');ind.className='ind';links.appendChild(ind);
function moveInd(){const a=$('#links a.act');if(!a){ind.style.width='0';return}ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px'}
addEventListener('scroll',()=>{$('.nav').classList.toggle('scrolled',scrollY>40);moveInd()},{passive:true});
addEventListener('resize',moveInd);addEventListener('load',moveInd);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  $('#theme').addEventListener('click',()=>icon.animate([{transform:'rotate(-120deg) scale(.4)',opacity:0},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,.8,.2,1)'}));
}
// Show the right shortcut label on Mac
if(/Mac|iPhone|iPad/.test(navigator.platform))$('#openPalette').textContent='\u2318 K';