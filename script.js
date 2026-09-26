const root=document.documentElement;
const credentials=document.querySelector('.credential-list');
if(credentials){credentials.classList.remove('reveal');credentials.querySelectorAll('p').forEach(item=>item.classList.add('reveal'))}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const careObjective=[...document.querySelectorAll('.objective')].find(section=>section.querySelector('h2')?.textContent.trim()==='Do programa');
if(careObjective){
  careObjective.classList.add('care-objective');
  careObjective.querySelector('h2')?.remove();
}
const careManifestoLabel=document.querySelector('.care-manifesto > aside p');
if(careManifestoLabel?.textContent.trim().toLowerCase()==='o programa'){
  careManifestoLabel.closest('aside')?.setAttribute('aria-hidden','true');
  careManifestoLabel.remove();
}
const footerCredit=document.querySelector('footer > p');
if(footerCredit && !footerCredit.querySelector('span')){
  const copyright=document.createElement('span');
  copyright.textContent=footerCredit.textContent;
  const developerCredit=document.createElement('span');
  developerCredit.textContent='Desenvolvido por Melri Siragusa Designer';
  footerCredit.replaceChildren(copyright,developerCredit);
}
const faqButtons=[...document.querySelectorAll('.faq-item button')];
faqButtons.forEach(button=>button.addEventListener('click',()=>{
  const willOpen=button.getAttribute('aria-expanded')!=='true';
  faqButtons.forEach(other=>{
    other.setAttribute('aria-expanded','false');
    other.closest('.faq-item')?.classList.remove('is-open');
  });
  if(willOpen){
    button.setAttribute('aria-expanded','true');
    button.closest('.faq-item')?.classList.add('is-open');
  }
}));
const ecosMotionGroups=[
  document.querySelector('.ecos-manifesto .ecos-intro'),
  document.querySelector('.ecos-manifesto .ecos-chain')
].filter(Boolean);
if(reduced){
  ecosMotionGroups.forEach(group=>group.classList.add('ecos-motion-visible'));
}else{
  ecosMotionGroups.forEach(group=>group.classList.add('ecos-motion-ready'));
  const ecosMotionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('ecos-motion-visible');
      ecosMotionObserver.unobserve(entry.target);
    }
  }),{threshold:.2,rootMargin:'0px 0px -10%'});
  ecosMotionGroups.forEach(group=>ecosMotionObserver.observe(group));
}
if(!reduced){
  const flowObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting)),{rootMargin:'160px 0px'});
  document.querySelectorAll('.values,.credential-list').forEach(container=>{
    const cards=[...container.children];
    if(cards.length<2)return;
    const track=document.createElement('div');
    const group=document.createElement('div');
    track.className='flow-track';
    group.className='flow-group';
    cards.forEach(card=>{card.classList.remove('reveal');group.append(card)});
    const duplicate=group.cloneNode(true);
    duplicate.setAttribute('aria-hidden','true');
    duplicate.inert=true;
    track.append(group,duplicate);
    container.replaceChildren(track);
    container.classList.add('continuous-ready');
    container.tabIndex=0;
    container.setAttribute('role','region');
    container.setAttribute('aria-label',container.closest('section')?.querySelector('h2')?.textContent.trim()||'');
    flowObserver.observe(container);
    container.addEventListener('pointerdown',()=>container.classList.add('flow-held'));
    for(const event of ['pointerup','pointercancel','pointerleave'])container.addEventListener(event,()=>container.classList.remove('flow-held'));
  });
}
const careNarrative=document.querySelector('.care-manifesto .human + .prose.columns');
if(careNarrative){
  const paragraphs=[...careNarrative.children];
  if(paragraphs.length===17){
    const themes=[
      {title:3,body:[0,1,2,4,5,6]},
      {title:7,body:[8,9,10,11]},
      {title:12,body:[13,14]},
      {title:15,body:[16]}
    ];
    const themeGrid=document.createElement('div');
    themeGrid.className='care-theme-grid';
    themes.forEach((theme,index)=>{
      const article=document.createElement('article');
      article.className='care-theme reveal';
      article.style.setProperty('--care-theme-delay',`${index*110}ms`);
      const marker=document.createElement('span');
      marker.className='care-module-icon';
      marker.setAttribute('aria-hidden','true');
      const title=paragraphs[theme.title];
      title.className='care-theme-title';
      const body=document.createElement('div');
      body.className='care-theme-copy';
      theme.body.forEach(paragraphIndex=>body.append(paragraphs[paragraphIndex]));
      article.append(marker,title,body);
      themeGrid.append(article);
    });
    careNarrative.replaceWith(themeGrid);
  }
}
const careConclusionSource=document.querySelector('.care-manifesto .statement + .prose.offset');
if(careConclusionSource){
  const paragraphs=[...careConclusionSource.children];
  if(paragraphs.length===10){
    const conclusion=document.createElement('div');
    conclusion.className='care-conclusion';
    conclusion.id='care-conclusion';
    const makeDiamondList=(source,className)=>{
      const list=document.createElement('div');
      list.className=`care-diamond-list ${className}`;
      source.innerHTML.split(/<br\s*\/?>/i).map(part=>part.trim()).filter(Boolean).forEach((content,index)=>{
        const item=document.createElement('p');
        item.className='care-diamond-item reveal';
        item.style.setProperty('--care-diamond-delay',`${index*110}ms`);
        const marker=document.createElement('span');
        marker.className='care-diamond';
        marker.setAttribute('aria-hidden','true');
        const copy=document.createElement('span');
        copy.className='care-diamond-text';
        copy.innerHTML=content;
        item.append(marker,copy);
        list.append(item);
      });
      return list;
    };
    paragraphs[0].className='care-conclusion-impact reveal';
    paragraphs[1].className='care-conclusion-note care-conclusion-note-right reveal';
    conclusion.append(paragraphs[0],paragraphs[1],makeDiamondList(paragraphs[2],'care-diamond-list-primary'));
    const flow=document.createElement('div');
    flow.className='care-conclusion-flow';
    paragraphs.slice(3,7).forEach(paragraph=>{
      paragraph.className='care-flow-item reveal';
      flow.append(paragraph);
    });
    conclusion.append(flow);
    paragraphs[7].className='care-conclusion-impact care-conclusion-impact-secondary reveal';
    paragraphs[8].className='care-conclusion-note care-conclusion-note-final reveal';
    conclusion.append(paragraphs[7],paragraphs[8],makeDiamondList(paragraphs[9],'care-diamond-list-final'));
    careConclusionSource.replaceWith(conclusion);
  }
}
const items=[...document.querySelectorAll('.reveal')];
items.forEach((item,index)=>{item.style.setProperty('--delay',`${(index%3)*90}ms`);item.dataset.reveal=index%3===0?'left':index%3===1?'up':'right'});
document.querySelectorAll('.program-goals li').forEach((item,index)=>{item.dataset.reveal=index%2===0?'left':'right';item.style.setProperty('--delay','0ms')});
document.querySelectorAll('.numbered li').forEach((item,index)=>{item.dataset.reveal=index%2===0?'left':'right';item.style.setProperty('--delay',`${(index%4)*70}ms`)});
document.querySelectorAll('.credential-list p').forEach((item,index)=>{item.dataset.reveal=index%2===0?'left':'right';item.style.setProperty('--delay','0ms')});
if(reduced){items.forEach(item=>item.classList.add('visible'))}else{
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -8%'});
  items.forEach(item=>observer.observe(item));
}
const updateScroll=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  const progress=max>0?scrollY/max:0;
  root.style.setProperty('--scroll-progress',progress);
  root.style.setProperty('--hero-shift',`${Math.min(scrollY*.12,110)}px`);
  document.body.classList.toggle('scrolled',scrollY>40);
};
updateScroll();
let scrollFrame=0;
addEventListener('scroll',()=>{
  if(scrollFrame)return;
  scrollFrame=requestAnimationFrame(()=>{
    scrollFrame=0;
    updateScroll();
  });
},{passive:true});
