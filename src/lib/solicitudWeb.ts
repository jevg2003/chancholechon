interface Config { apiKey:string; projectId:string; appId:string; siteKey:string; endpoint:string; }
export function initSolicitudWeb(form: HTMLFormElement) {
 const config = JSON.parse(form.dataset.config ?? '{}') as Config;
 const estado = form.querySelector<HTMLElement>('#sol-estado')!;
 const fieldset = form.querySelector<HTMLFieldSetElement>('fieldset')!;
 const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 const fecha = form.querySelector<HTMLInputElement>('[name=fecha]')!;
 const entrega = form.querySelector<HTMLSelectElement>('[name=entrega]')!;
 const zona = form.querySelector<HTMLInputElement>('[name=zona]')!;
 const now = new Date(Date.now()-5*60*60*1000);
 fecha.min = now.toISOString().slice(0,10);
 let requestId = crypto.randomUUID();
 let sending = false;
 let appCheckPromise: Promise<import('firebase/app-check').AppCheck> | null = null;
 form.addEventListener('input',()=>{ if(!sending) requestId = crypto.randomUUID(); });
 entrega.addEventListener('change',()=>{ zona.required = entrega.value === 'domicilio'; zona.minLength = zona.required ? 3 : 0; });
 async function appCheck() {
  if(!appCheckPromise) appCheckPromise = (async()=>{
   const [{initializeApp,getApps},{initializeAppCheck,ReCaptchaEnterpriseProvider}] = await Promise.all([import('firebase/app'),import('firebase/app-check')]);
   const app = getApps().find(a=>a.name==='public-inquiries') ?? initializeApp({apiKey:config.apiKey,projectId:config.projectId,appId:config.appId},'public-inquiries');
   return initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(config.siteKey),isTokenAutoRefreshEnabled:false});
  })().catch(error=>{appCheckPromise=null;throw error;});
  return appCheckPromise;
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending || !form.reportValidity()) return;
  const data = new FormData(form);
  const payload = {requestId,nombre:String(data.get('nombre')??'').trim(),telefono:String(data.get('telefono')??'').trim(),producto:String(data.get('producto')),cantidad:Number(data.get('cantidad')),fecha:String(data.get('fecha')),hora:String(data.get('hora')??''),entrega:String(data.get('entrega')),zona:String(data.get('zona')??'').trim(),notas:String(data.get('notas')??'').trim(),consentimiento:data.get('consentimiento')==='on',website:String(data.get('website')??'')};
  sending=true;fieldset.disabled=true;form.setAttribute('aria-busy','true');button.textContent='Enviando…';estado.textContent='Estamos registrando tu solicitud…';
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
   estado.textContent=`¡Recibimos tu solicitud!\nReferencia: ${result.referencia}\nTe contactaremos para cotizar. Tu reserva está pendiente de confirmación.`;
   form.reset();zona.required=false;zona.minLength=0;requestId=crypto.randomUUID();estado.focus();
  } catch(error) {
   estado.textContent=`${error instanceof Error && !/firebase|appcheck|recaptcha/i.test(error.message)?error.message:'No pudimos confirmar el envío. Reintenta o escríbenos por WhatsApp.'} Tus datos siguen en el formulario.`;
   estado.focus();
  } finally {clearTimeout(timeout);sending=false;fieldset.disabled=false;form.removeAttribute('aria-busy');button.textContent='Enviar solicitud';}
 });
}
