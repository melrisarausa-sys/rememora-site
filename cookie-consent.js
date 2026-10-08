(()=>{
  'use strict';
  const storageKey='rememora_cookie_consent_v1';
  const version=1;
  const readConsent=()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
      return saved?.version===version?saved:null;
    }catch{return null}
  };
  const saveConsent=status=>{
    const consent={version,status,necessary:true,analytics:false,marketing:false,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(storageKey,JSON.stringify(consent))}catch{}
    window.rememoraConsent=consent;
    window.dispatchEvent(new CustomEvent('rememora:consent',{detail:consent}));
    return consent;
  };
  const mount=()=>{
    const banner=document.createElement('section');
    banner.className='cookie-banner';
    banner.setAttribute('role','region');
    banner.setAttribute('aria-label','Consentimento de cookies');
    banner.innerHTML='<p>Usamos apenas recursos técnicos necessários para o funcionamento do site e para lembrar suas preferências. Saiba mais na <a href="cookies-policy.html">Política de Cookies</a>.</p><div class="cookie-actions"><button class="cookie-button" type="button" data-cookie-action="accept">Aceitar</button><button class="cookie-button cookie-button-secondary" type="button" data-cookie-action="reject">Recusar</button><button class="cookie-button cookie-button-link" type="button" data-cookie-action="preferences">Preferências</button></div>';
    const dialog=document.createElement('dialog');
    dialog.className='cookie-dialog';
    dialog.setAttribute('aria-labelledby','cookie-dialog-title');
    dialog.innerHTML='<div class="cookie-dialog-inner"><h2 id="cookie-dialog-title">Preferências de cookies</h2><p class="cookie-dialog-intro">Atualmente, este site não utiliza cookies de análise ou publicidade. Você pode confirmar abaixo o uso dos recursos estritamente necessários.</p><div class="cookie-option"><div><strong>Estritamente necessários</strong><small>Permitem funções básicas e registram sua escolha de privacidade.</small><span class="cookie-status">Sempre ativos</span></div><input type="checkbox" checked disabled aria-label="Cookies estritamente necessários sempre ativos"></div><div class="cookie-option"><div><strong>Desempenho e estatísticas</strong><small>Não utilizados atualmente.</small></div><input type="checkbox" disabled aria-label="Cookies de desempenho não utilizados"></div><div class="cookie-option"><div><strong>Marketing e publicidade</strong><small>Não utilizados atualmente.</small></div><input type="checkbox" disabled aria-label="Cookies de marketing não utilizados"></div><div class="cookie-actions"><button class="cookie-button cookie-button-secondary" type="button" data-cookie-action="reject">Recusar não essenciais</button><button class="cookie-button" type="button" data-cookie-action="save">Salvar preferências</button></div></div>';
    document.body.append(banner,dialog);
    const hideBanner=()=>{banner.hidden=true};
    const closeDialog=()=>{if(dialog.open)dialog.close()};
    const commit=status=>{saveConsent(status);hideBanner();closeDialog()};
    banner.addEventListener('click',event=>{
      const action=event.target.closest('[data-cookie-action]')?.dataset.cookieAction;
      if(action==='accept')commit('accepted');
      if(action==='reject')commit('rejected');
      if(action==='preferences')dialog.showModal();
    });
    dialog.addEventListener('click',event=>{
      const action=event.target.closest('[data-cookie-action]')?.dataset.cookieAction;
      if(action==='reject')commit('rejected');
      if(action==='save')commit('preferences-saved');
    });
    document.querySelectorAll('[data-open-cookie-preferences]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
    const consent=readConsent();
    window.rememoraConsent=consent;
    banner.hidden=Boolean(consent);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
