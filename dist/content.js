var Z=Object.defineProperty;var Q=(p,h,g)=>h in p?Z(p,h,{enumerable:!0,configurable:!0,writable:!0,value:g}):p[h]=g;var b=(p,h,g)=>Q(p,typeof h!="symbol"?h+"":h,g);(function(){"use strict";const p={enabled:!0,mode:"live",apiKey:"",apiBaseUrl:"https://api.openai.com/v1",model:"gpt-4o-mini",detailLevel:"concise",readingLevel:"beginner",showAnalogies:!0,showExamples:!0,theme:"system"},h=400,g=600,L=2;function M(i){const e=i.replace(/\s+/g," ").trim();if(e.length<=h)return e;const t=e.slice(0,h),n=t.lastIndexOf(" ");return n>h/2?t.slice(0,n):t}function I(i){const e=i.trim();return e.length>=L&&/[a-zA-Z]/.test(e)}function m(i,e){const t=i.replace(/\s+/g," ").trim();return t.length<=e?t:`${t.slice(0,e-1)}…`}const A=new Set(["P","LI","TD","DD","DT","BLOCKQUOTE","PRE","ARTICLE","SECTION","DIV","MAIN"]),w=new Set(["H1","H2","H3","H4","H5","H6"]);function N(i){let e=i instanceof Element?i:(i==null?void 0:i.parentElement)??null;for(;e&&!A.has(e.tagName);)e=e.parentElement;return e}function $(i){let e=i instanceof Element?i:(i==null?void 0:i.parentElement)??null;for(;e;){let t=e.previousElementSibling;for(;t;){if(w.has(t.tagName))return m(t.textContent??"",120);const n=t.querySelector("h1,h2,h3,h4,h5,h6");if(n)return m(n.textContent??"",120);t=t.previousElementSibling}if(w.has(e.tagName))return m(e.textContent??"",120);e=e.parentElement}return""}function R(i){const e=M(i.toString()),t=i.anchorNode,n=N(t);return{selectedText:e,surroundingText:m((n==null?void 0:n.textContent)??"",g),pageTitle:m(document.title,150),pageUrl:location.href.split("#")[0]??location.href,nearestHeading:$(t)}}function C(i){let e=i instanceof Element?i:(i==null?void 0:i.parentElement)??null;for(;e;){const t=e.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.isContentEditable)return!0;e=e.parentElement}return!1}const z=`
  :host {
    all: initial;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    --paper: #fffdf7;
    --ink: #26303c;
    --muted: #6b7484;
    --accent: #b45309;
    --accent-strong: #92400e;
    --accent-soft: #fdf1dc;
    --border: #e7dfcd;
    --shadow: 0 4px 6px rgba(38, 48, 60, 0.06), 0 12px 32px rgba(38, 48, 60, 0.14);
    --code-bg: #f4efe3;
    --success: #15803d;
    --danger: #b91c1c;
    --serif: Charter, 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.5;
    color: var(--ink);
  }

  .root[data-theme='dark'] {
    --paper: #1c232e;
    --ink: #e9e4d8;
    --muted: #98a1b0;
    --accent: #e8a33d;
    --accent-strong: #f3b95f;
    --accent-soft: #2c2a20;
    --border: #333e4d;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.45);
    --code-bg: #141a23;
    --success: #4ade80;
    --danger: #f87171;
  }

  /* ---- Floating action button ---- */
  .fab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 6px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    box-shadow: var(--shadow);
    animation: rise 140ms ease-out;
  }
  .fab:hover { border-color: var(--accent); color: var(--accent-strong); }
  .fab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .fab svg { display: block; }

  /* ---- Card ---- */
  .card {
    width: 360px;
    max-width: calc(100vw - 24px);
    max-height: min(480px, calc(100vh - 24px));
    display: flex;
    flex-direction: column;
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
    animation: rise 160ms ease-out;
  }
  .card:focus { outline: none; }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px 8px;
    border-bottom: 1px solid var(--border);
  }
  .card-title-wrap { flex: 1; min-width: 0; }
  .card-eyebrow {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2px;
  }
  .card-title {
    font-family: var(--serif);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.25;
    overflow-wrap: break-word;
  }
  .badges { display: flex; gap: 6px; margin-top: 5px; flex-wrap: wrap; }
  .badge {
    font-size: 10.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: transparent;
  }
  .badge.difficulty { color: var(--accent-strong); background: var(--accent-soft); border-color: transparent; }

  .card-body {
    padding: 12px 14px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .short { font-size: 14px; line-height: 1.55; }

  .section { margin-top: 12px; }
  .section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .section p { font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; }
  .example {
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.55;
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    white-space: pre-wrap;
    overflow-x: auto;
  }
  .analogy {
    font-family: var(--serif);
    font-style: italic;
    border-left: 3px solid var(--accent);
    padding-left: 10px;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .chip {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    color: var(--ink);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 10px;
    cursor: pointer;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent-strong); }
  .chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    border-top: 1px solid var(--border);
  }
  .spacer { flex: 1; }
  .source {
    font-size: 11px;
    color: var(--muted);
    padding-left: 4px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    background: transparent;
    border: none;
    border-radius: 7px;
    padding: 6px 8px;
    cursor: pointer;
  }
  .btn:hover { color: var(--ink); background: var(--accent-soft); }
  .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
  .btn[disabled] { opacity: 0.5; cursor: default; }
  .btn.saved { color: var(--success); }
  .btn svg { display: block; }

  .icon-btn { padding: 6px; border-radius: 7px; }

  .expand-btn {
    margin-top: 12px;
    color: var(--accent-strong);
    padding-left: 0;
  }
  .expand-btn:hover { background: transparent; text-decoration: underline; }

  /* ---- Loading skeleton ---- */
  .skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--code-bg) 25%, var(--accent-soft) 50%, var(--code-bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
    margin-bottom: 10px;
  }
  .skeleton-line.w60 { width: 60%; }
  .skeleton-line.w90 { width: 90%; }
  .skeleton-line.w75 { width: 75%; }
  .skeleton-title { height: 18px; width: 45%; margin-bottom: 14px; }

  /* ---- Error state ---- */
  .error-box { padding: 4px 0; }
  .error-title { font-weight: 700; color: var(--danger); font-size: 13.5px; margin-bottom: 4px; }
  .error-msg { font-size: 13px; color: var(--ink); margin-bottom: 10px; }
  .retry-btn {
    color: var(--paper);
    background: var(--accent);
    padding: 6px 14px;
  }
  .retry-btn:hover { background: var(--accent-strong); color: var(--paper); }

  .not-cs { color: var(--muted); font-size: 13px; margin-top: 8px; }

  @keyframes rise {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fab, .card { animation: none; }
    .skeleton-line { animation: none; background: var(--code-bg); }
  }
`;function y(i){return i!=="system"?i:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function k(i,e){const t=document.createElement("div");t.id=i,t.style.cssText="position:fixed;top:0;left:0;z-index:2147483646;width:0;height:0;overflow:visible;";const n=t.attachShadow({mode:"closed"}),o=document.createElement("style");o.textContent=z,n.appendChild(o);const s=document.createElement("div");return s.className="root",s.dataset.theme=y(e),n.appendChild(s),document.documentElement.appendChild(t),{host:t,root:s,setTheme(c){s.dataset.theme=y(c)},destroy(){t.remove()}}}function E(i,e,t,n,o=12){return{x:Math.min(Math.max(i,o),Math.max(o,window.innerWidth-t-o)),y:Math.min(Math.max(e,o),Math.max(o,window.innerHeight-n-o))}}const u=(i,e=14)=>`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>`,_=(i=16)=>`<svg width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 5 3.5 12 7 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 5l3.5 7L17 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="10.2" r="3.4" stroke="currentColor" stroke-width="2"/>
    <path d="M12 13.6v2.6M10.7 18.4h2.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,O=u('<path d="M18 6 6 18M6 6l12 12"/>'),T=u('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),B=u('<path d="M20 6 9 17l-5-5"/>'),D=u('<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>'),U='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>',G=u('<path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/>'),W=u('<path d="m6 9 6 6 6-6"/>',12),F=u('<path d="m18 15-6-6-6 6"/>',12);class V{constructor(e,t){b(this,"shadowHost",null);this.theme=e,this.onClick=t}show(e){this.hide(),this.shadowHost=k("cs-concept-companion-fab",this.theme);const t=document.createElement("button");t.className="fab",t.type="button",t.setAttribute("aria-label","Explain highlighted text with CS Concept Companion"),t.innerHTML=`${_(15)}<span>Explain</span>`,t.addEventListener("mousedown",f=>f.preventDefault()),t.addEventListener("click",()=>this.onClick()),this.shadowHost.root.appendChild(t);const n=96,o=32;let s=e.bottom+8;s+o>window.innerHeight-12&&(s=e.top-o-8);const{x:c,y:a}=E(e.left+e.width/2-n/2,s,n,o);this.shadowHost.host.style.transform=`translate(${Math.round(c)}px, ${Math.round(a)}px)`}hide(){var e;(e=this.shadowHost)==null||e.destroy(),this.shadowHost=null}setTheme(e){var t;this.theme=e,(t=this.shadowHost)==null||t.setTheme(e)}get visible(){return this.shadowHost!==null}contains(e){var t;return e instanceof Node&&((t=this.shadowHost)==null?void 0:t.host.contains(e))===!0}}function r(i,e="",t=""){const n=document.createElement(i);return e&&(n.className=e),t&&(n.textContent=t),n}function S(i,e,t=""){const n=r("button",`btn icon-btn ${t}`.trim());return n.type="button",n.setAttribute("aria-label",e),n.title=e,n.innerHTML=i,n}class j{constructor(e,t){b(this,"shadowHost",null);b(this,"card",null);b(this,"anchorRect",null);b(this,"expanded",!1);this.theme=e,this.callbacks=t}get visible(){return this.shadowHost!==null}contains(e){var t;return e instanceof Node&&((t=this.shadowHost)==null?void 0:t.host.contains(e))===!0}setTheme(e){var t;this.theme=e,(t=this.shadowHost)==null||t.setTheme(e)}close(){var e;(e=this.shadowHost)==null||e.destroy(),this.shadowHost=null,this.card=null,this.expanded=!1}showLoading(e){const t=r("div");t.appendChild(r("div","skeleton-line skeleton-title"));for(const n of["w90","w75","w90","w60"])t.appendChild(r("div",`skeleton-line ${n}`));this.render(t,{anchorRect:e,label:"Loading explanation"})}showError(e,t,n){const o=r("div","error-box");if(o.appendChild(r("div","error-title","Could not explain that")),o.appendChild(r("p","error-msg",e)),t){const s=r("button","btn retry-btn","Try again");s.type="button",s.addEventListener("click",()=>this.callbacks.onRetry()),o.appendChild(s)}this.render(o,{anchorRect:n,label:"Explanation error"})}showExplanation(e,t){const n=r("div");if(n.appendChild(r("p","short",e.shortExplanation)),e.notCsConcept){n.appendChild(r("p","not-cs","Tip: this works best on specific technical terms.")),e.relatedConcepts.length>0&&n.appendChild(this.chips(e.relatedConcepts)),this.render(n,{explanation:e,label:`About ${e.concept}`,anchorRect:t});return}const o=r("div");if(o.hidden=!this.expanded,e.detailedExplanation&&o.appendChild(this.section("In more depth",e.detailedExplanation)),e.example){const a=r("div","section");a.appendChild(r("div","section-label","Example")),a.appendChild(r("pre","example",e.example)),o.appendChild(a)}if(e.analogy){const a=r("div","section");a.appendChild(r("div","section-label","Analogy"));const f=r("p","analogy",e.analogy);a.appendChild(f),o.appendChild(a)}if(e.whyItMatters&&o.appendChild(this.section("Why it matters",e.whyItMatters)),e.relatedConcepts.length>0){const a=r("div","section");a.appendChild(r("div","section-label","Related concepts")),a.appendChild(this.chips(e.relatedConcepts)),o.appendChild(a)}const s=r("button","btn expand-btn");s.type="button";const c=()=>{s.innerHTML=this.expanded?`${F}<span>Show less</span>`:`${W}<span>Show more</span>`,s.setAttribute("aria-expanded",String(this.expanded))};c(),s.addEventListener("click",()=>{this.expanded=!this.expanded,o.hidden=!this.expanded,c()}),n.appendChild(o),n.appendChild(s),this.render(n,{explanation:e,label:`Explanation of ${e.concept}`,anchorRect:t})}section(e,t){const n=r("div","section");return n.appendChild(r("div","section-label",e)),n.appendChild(r("p","",t)),n}chips(e){const t=r("div","chips");for(const n of e){const o=r("button","chip",n);o.type="button",o.setAttribute("aria-label",`Explain ${n}`),o.addEventListener("click",()=>this.callbacks.onExplainRelated(n)),t.appendChild(o)}return t}render(e,t){t.anchorRect&&(this.anchorRect=t.anchorRect);const n=this.shadowHost;this.shadowHost=k("cs-concept-companion-card",this.theme);const o=r("div","card");o.setAttribute("role","dialog"),o.setAttribute("aria-label",t.label),o.tabIndex=-1,this.card=o,o.appendChild(this.header(t.explanation));const s=r("div","card-body");if(s.appendChild(e),o.appendChild(s),t.explanation&&!t.explanation.notCsConcept)o.appendChild(this.footer(t.explanation));else if(t.explanation){const c=r("div","card-footer");c.appendChild(r("span","source",t.explanation.source)),o.appendChild(c)}this.shadowHost.root.appendChild(o),this.position(),n==null||n.destroy(),o.focus({preventScroll:!0})}header(e){const t=r("div","card-header"),n=r("div","card-title-wrap");if(n.appendChild(r("div","card-eyebrow","CS Concept Companion")),e){if(n.appendChild(r("h2","card-title",e.concept)),!e.notCsConcept){const s=r("div","badges");s.appendChild(r("span","badge difficulty",e.difficulty)),s.appendChild(r("span","badge",e.source)),n.appendChild(s)}}else n.appendChild(r("h2","card-title","Looking that up…"));t.appendChild(n);const o=S(O,"Close explanation");return o.addEventListener("click",()=>this.callbacks.onClose()),t.appendChild(o),t}footer(e){const t=r("div","card-footer"),n=r("button","btn");n.type="button";const o=a=>{n.innerHTML=a?`${U}<span>Saved</span>`:`${D}<span>Save</span>`,n.classList.toggle("saved",a),n.setAttribute("aria-label",a?"Saved to your library":"Save concept to library"),n.disabled=a};o(!1),this.callbacks.isSaved(e.concept).then(a=>{a&&o(!0)}),n.addEventListener("click",()=>{this.callbacks.onSave(e).then(a=>o(a))});const s=r("button","btn");s.type="button",s.innerHTML=`${T}<span>Copy</span>`,s.setAttribute("aria-label","Copy explanation to clipboard"),s.addEventListener("click",()=>{const a=[e.concept,"",e.shortExplanation,e.example?`
Example:
${e.example}`:"",e.whyItMatters?`
Why it matters: ${e.whyItMatters}`:""].join(`
`).trim();navigator.clipboard.writeText(a).then(()=>{s.innerHTML=`${B}<span>Copied</span>`,setTimeout(()=>{s.innerHTML=`${T}<span>Copy</span>`},1500)})});const c=S(G,"Regenerate explanation");return c.addEventListener("click",()=>this.callbacks.onRegenerate()),t.appendChild(n),t.appendChild(s),t.appendChild(c),t.appendChild(r("div","spacer")),t.appendChild(r("span","source",e.source)),t}position(){if(!this.shadowHost||!this.card)return;const e=this.anchorRect,t=this.card.getBoundingClientRect(),n=t.width||360,o=t.height||240,s=e?e.left:window.innerWidth/2-n/2;let c=e?e.bottom+10:window.innerHeight/2-o/2;e&&c+o>window.innerHeight-12&&(c=e.top-o-10);const a=E(s,c,n,o);this.shadowHost.host.style.transform=`translate(${Math.round(a.x)}px, ${Math.round(a.y)}px)`}}const q=120,Y=180;function P(){if(window.__csConceptCompanionLoaded)return;window.__csConceptCompanionLoaded=!0;let i=p,e=null,t=null,n,o=null,s=0;const c=new j(p.theme,{onClose:()=>c.close(),onRetry:()=>{e&&x(e)},onRegenerate:()=>{e&&x(e)},onSave:async d=>!!await f({type:"save-concept",explanation:d,pageTitle:(e==null?void 0:e.pageTitle)??document.title,pageUrl:(e==null?void 0:e.pageUrl)??location.href}),onExplainRelated:d=>{e&&x({...e,selectedText:d,surroundingText:"",nearestHeading:""})},isSaved:async d=>{const l=await f({type:"is-saved",concept:d});return(l==null?void 0:l.saved)===!0}}),a=new V(p.theme,()=>{a.hide(),e&&x(e)});function f(d){return chrome.runtime.sendMessage(d).catch(()=>{})}function x(d){e=d;const l=++s;c.showLoading(t??void 0),o=null,f({type:"explain",request:d}).then(K=>{if(l!==s||!c.visible)return;const v=K;if(!v){c.showError("The extension was reloaded. Refresh this page and try again.",!1);return}v.ok?c.showExplanation(v.explanation):c.showError(v.error,v.retryable)})}function H(){const d=window.getSelection();if(!d||d.isCollapsed||d.rangeCount===0||C(d.anchorNode)||C(d.focusNode)||!I(d.toString()))return null;const l=d.getRangeAt(0).getBoundingClientRect();return l.width===0&&l.height===0?null:{request:R(d),rect:l}}function X(){if(!i.enabled)return;const d=H();if(!d){a.hide();return}e=d.request,t=d.rect,o=null,c.visible||a.show(d.rect)}document.addEventListener("selectionchange",()=>{window.clearTimeout(n),n=window.setTimeout(X,Y)}),document.addEventListener("mousedown",d=>{a.contains(d.target)||c.contains(d.target)||(a.hide(),c.visible&&c.close())},!0),document.addEventListener("keydown",d=>{d.key==="Escape"&&(c.visible||a.visible)&&(a.hide(),c.close())}),window.addEventListener("scroll",()=>{!a.visible&&!c.visible||(o===null&&(o=window.scrollY),Math.abs(window.scrollY-o)>q&&(a.hide(),c.close(),o=null))},{passive:!0}),window.addEventListener("popstate",()=>{a.hide(),c.close()}),chrome.runtime.onMessage.addListener(d=>{if(d.type==="explain-shortcut"){const l=H();l&&(e=l.request,t=l.rect,a.hide(),x(l.request))}}),chrome.storage.onChanged.addListener((d,l)=>{l!=="local"||!d.settings||(i={...p,...d.settings.newValue},c.setTheme(i.theme),a.setTheme(i.theme),i.enabled||(a.hide(),c.close()))}),chrome.storage.local.get("settings").then(d=>{i={...p,...d.settings},c.setTheme(i.theme),a.setTheme(i.theme)}).catch(()=>{})}P()})();
