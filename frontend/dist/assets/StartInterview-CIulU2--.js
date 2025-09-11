import{r as c,u as E,b as w,R as t}from"./index-DMsRDNzL.js";/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),k=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,s)=>s?s.toUpperCase():r.toLowerCase()),u=a=>{const e=k(a);return e.charAt(0).toUpperCase()+e.slice(1)},d=(...a)=>a.filter((e,r,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===r).join(" ").trim(),v=a=>{for(const e in a)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=c.forwardRef(({color:a="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:s,className:o="",children:n,iconNode:l,...m},p)=>c.createElement("svg",{ref:p,...b,width:e,height:e,stroke:a,strokeWidth:s?Number(r)*24/Number(e):r,className:d("lucide",o),...!n&&!v(m)&&{"aria-hidden":"true"},...m},[...l.map(([h,f])=>c.createElement(h,f)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(a,e)=>{const r=c.forwardRef(({className:s,...o},n)=>c.createElement(g,{ref:n,iconNode:e,className:d(`lucide-${y(u(a))}`,`lucide-${a}`,s),...o}));return r.displayName=u(a),r};/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],C=i("book-open",N);/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],R=i("briefcase",x);/**
 * @license lucide-react v0.543.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],_=i("circle-question-mark",A),I=()=>{const a=E(),e=w(),{jobTitle:r,jobTopic:s,questions:o,fromResume:n}=e.state||{},l=()=>{a("/interview-mode",{state:{jobTitle:r,jobTopic:s,questions:o}})};return t.createElement("div",{className:"start-screen"},t.createElement("div",{className:"card"},t.createElement("h2",{className:"title"},n?"📄 Resume Uploaded Successfully!":"Ready for Your Interview?"),t.createElement("p",{className:"subtitle"},n?"Your resume has been analyzed. Click below to start your AI-based interview.":"Take a deep breath! This practice interview will help you sharpen your skills and gain confidence."),t.createElement("div",{className:"info-box"},t.createElement("div",{className:"info-item"},t.createElement(R,{size:22,className:"icon"}),t.createElement("span",null,t.createElement("strong",null,"Role:")," ",r||"Software Engineer")),t.createElement("div",{className:"info-item"},t.createElement(C,{size:22,className:"icon"}),t.createElement("span",null,t.createElement("strong",null,"Topic:")," ",s||"React Basics")),t.createElement("div",{className:"info-item"},t.createElement(_,{size:22,className:"icon"}),t.createElement("span",null,t.createElement("strong",null,"Questions:")," ",o?.length||10," expected"))),t.createElement("button",{className:"start-btn",onClick:l},"🚀 Start Interview")))};export{I as default};
