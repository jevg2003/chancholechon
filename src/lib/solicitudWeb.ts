interface Config { apiKey:string; projectId:string; appId:string; siteKey:string; endpoint:string; }
export function initSolicitudWeb(form: HTMLFormElement) {
 const config = JSON.parse(form.dataset.config ?? '{}') as Config;
 const estado = form.querySelector<HTMLElement>('#sol-estado')!;
 const fieldset = form.querySelector<HTMLFieldSetElement>('fieldset')!;
 const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 const buttonText = button.querySelector<HTMLElement>('.sol-btn-texto') ?? button;
 const exito = form.querySelector<HTMLElement>('.sol-exito');
 const setButton = (state: 'idle'|'enviando'|'ok') => {
  button.classList.toggle('is-enviando', state==='enviando');
  button.classList.toggle('is-ok', state==='ok');
  buttonText.textContent = state==='enviando' ? 'Enviando…' : state==='ok' ? '¡Enviada!' : 'Enviar solicitud';
 };
 let requestId = crypto.randomUUID();
 let sending = false;
 let appCheckPromise: Promise<import('firebase/app-check').AppCheck> | null = null;
 form.addEventListener('input',()=>{ if(sending) return; requestId = crypto.randomUUID(); if(estado.classList.contains('sol-estado-ok')){estado.textContent='';estado.classList.remove('sol-estado-ok');} });
 async function appCheck() {
  if(!appCheckPromise) appCheckPromise = (async()=>{
   const [{initializeApp,getApps},{initializeAppCheck,ReCaptchaEnterpriseProvider}] = await Promise.all([import('firebase/app'),import('firebase/app-check')]);
   const app = getApps().find(a=>a.name==='public-inquiries') ?? initializeApp({apiKey:config.apiKey,projectId:config.projectId,appId:config.appId},'public-inquiries');
   return initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(config.siteKey),isTokenAutoRefreshEnabled:false});
  })().catch(error=>{appCheckPromise=null;throw error;});
  return appCheckPromise;
 }
 // Confirmación visual: el botón se vuelve verde con un check y luego un panel
 // cubre el formulario desde el botón; a los pocos segundos vuelve a la forma normal.
 async function celebrar(ref: string) {
  setButton('ok');
  if(!exito) { form.reset(); return; }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { gsap } = await import('gsap');
  await new Promise(r=>setTimeout(r, reduce ? 300 : 650));
  const arriba = form.getBoundingClientRect().top;
  if(arriba < 70 || arriba > window.innerHeight*0.5) { window.scrollBy({top: arriba - 90, behavior: reduce ? 'auto' : 'smooth'}); await new Promise(r=>setTimeout(r, reduce ? 0 : 450)); }
  const strong = exito.querySelector('.sol-exito-ref strong'); if(strong) strong.textContent = ref;
  const f = form.getBoundingClientRect(), b = button.getBoundingClientRect();
  const x = b.left + b.width/2 - f.left, y = b.top + b.height/2 - f.top;
  const radio = Math.hypot(Math.max(x, f.width-x), Math.max(y, f.height-y));
  const contenido = exito.querySelectorAll('.sol-exito-titulo, .sol-exito-texto, .sol-exito-ref, .sol-exito-otra');
  const otra = exito.querySelector<HTMLButtonElement>('.sol-exito-otra');
  exito.hidden = false;
  otra?.focus({preventScroll:true});
  await new Promise<void>(resolve=>{
   let cerrado = false;
   const cerrar = () => {
    if(cerrado) return; cerrado = true;
    entrada.kill();
    form.reset(); // mientras el panel aún tapa el formulario
    otra?.removeEventListener('click', cerrar);
    gsap.to(exito, {autoAlpha:0, y: reduce ? 0 : -8, duration: reduce ? .2 : .45, ease:'power2.in', onComplete:()=>{
     exito.hidden = true; gsap.set(exito, {clearProps:'all'}); setButton('idle');
     estado.focus({preventScroll:true});
     gsap.fromTo(fieldset, {autoAlpha:0, y: reduce ? 0 : 10}, {autoAlpha:1, y:0, duration:.4, ease:'power2.out', clearProps:'all'});
     resolve();
    }});
   };
   otra?.addEventListener('click', cerrar);
   const entrada = gsap.timeline({defaults:{ease:'power3.out'}, onComplete:cerrar});
   if(reduce) {
    entrada.fromTo(exito, {autoAlpha:0}, {autoAlpha:1, duration:.25})
     .set('.sol-exito-circulo, .sol-exito-check', {strokeDashoffset:0}, 0)
     .to({}, {duration:5});
   } else {
    entrada.fromTo(exito, {clipPath:`circle(0px at ${x}px ${y}px)`}, {clipPath:`circle(${radio}px at ${x}px ${y}px)`, duration:.7, ease:'power2.inOut'})
     .fromTo(exito.querySelector('.sol-exito-icono'), {scale:.6, autoAlpha:0}, {scale:1, autoAlpha:1, duration:.5, ease:'back.out(1.8)'}, '-=.25')
     .fromTo(exito.querySelector('.sol-exito-circulo'), {strokeDashoffset:151}, {strokeDashoffset:0, duration:.6, ease:'power2.inOut'}, '<')
     .fromTo(exito.querySelector('.sol-exito-check'), {strokeDashoffset:36}, {strokeDashoffset:0, duration:.35, ease:'power2.out'}, '-=.15')
     .fromTo(exito.querySelector('.sol-exito-onda'), {scale:.8, opacity:.35}, {scale:1.9, opacity:0, duration:.9, ease:'power2.out'}, '<')
     .fromTo(contenido, {y:14, autoAlpha:0}, {y:0, autoAlpha:1, duration:.5, stagger:.08}, '-=.7')
     .fromTo(exito.querySelector('.sol-exito-barra'), {scaleX:1}, {scaleX:0, duration:5.5, ease:'none'}, '-=.2');
   }
  });
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending || !form.reportValidity()) return;
  const data = new FormData(form);
  const payload = {requestId,nombre:String(data.get('nombre')??'').trim(),telefono:String(data.get('telefono')??'').trim(),consulta:String(data.get('consulta')??'').trim(),consentimiento:data.get('consentimiento')==='on',website:String(data.get('website')??'')};
  sending=true;fieldset.disabled=true;form.setAttribute('aria-busy','true');setButton('enviando');estado.classList.remove('sol-estado-ok');estado.textContent='Estamos registrando tu solicitud…';
  const controller = new AbortController();
  const timeout = window.setTimeout(()=>controller.abort(),30000);
  try {
   const {getToken} = await import('firebase/app-check');
   const token = await getToken(await appCheck(),false);
   if(controller.signal.aborted) throw new Error('La conexión tardó demasiado. Reintenta o escríbenos por WhatsApp.');
   const response = await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json','X-Firebase-AppCheck':token.token},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit'});
   const result = await response.json();
   if(!response.ok) throw new Error(typeof result.error==='string'?result.error:'No pudimos confirmar el envío.');
   if(result.referencia!==requestId) throw new Error('No recibimos confirmación del registro. Reintenta o escríbenos por WhatsApp.');
   const ref = `#${String(result.referencia).slice(0,8).toUpperCase()}`;
   estado.classList.add('sol-estado-ok');
   estado.textContent=`✓ ¡Tu solicitud fue enviada con éxito! Referencia ${ref}. Te contactaremos para cotizar; tu reserva queda pendiente de confirmación.`;
   requestId=crypto.randomUUID();estado.focus({preventScroll:true});
   clearTimeout(timeout);
   await celebrar(ref).catch(()=>{ if(exito) exito.hidden = true; form.reset(); });
  } catch(error) {
   estado.textContent=`${error instanceof Error && !/firebase|appcheck|recaptcha/i.test(error.message)?error.message:'No pudimos confirmar el envío. Reintenta o escríbenos por WhatsApp.'} Tus datos siguen en el formulario.`;
   estado.focus();
  } finally {clearTimeout(timeout);sending=false;fieldset.disabled=false;form.removeAttribute('aria-busy');setButton('idle');}
 });
}
