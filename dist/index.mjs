var $=Object.defineProperty;var y=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var S=(t,i,e)=>i in t?$(t,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[i]=e,m=(t,i)=>{for(var e in i||(i={}))O.call(i,e)&&S(t,e,i[e]);if(y)for(var e of y(i))b.call(i,e)&&S(t,e,i[e]);return t};var d=(t,i,e)=>new Promise((s,a)=>{var r=n=>{try{l(e.next(n))}catch(p){a(p)}},o=n=>{try{l(e.throw(n))}catch(p){a(p)}},l=n=>n.done?s(n.value):Promise.resolve(n.value).then(r,o);l((e=e.apply(t,i)).next())});import c from"fs";var g=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"),w=(t,i,e)=>{let s=Object.keys(e).reduce((a,r)=>(r.includes("[")||Object.assign(a,{[r]:{path:r}}),a),{});return Object.entries(e).forEach(([a])=>{let r=t[a];r&&(Array.isArray(r)?r.forEach(o=>{o&&Object.assign(s,{[o.path]:o})}):Object.assign(s,{[(r==null?void 0:r.path)||a]:r}))}),`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(s).filter(([a,r])=>r).map(([a,r])=>{var u,f;if(!r)return"";let{path:o,changeFreq:l,image:n,lastMod:p,priority:D}=r;return`  <url>
    <loc>${i}${o||a}</loc>
  
  ${p?`<lastmod>${p}</lastmod>`:""}
  ${D?`<priority>${l}</priority>`:""}
  ${l?`<changefreq>${l}</changefreq>`:""}
  ${n?`
    <image:image>
      <image:loc>${g(n.url)}</image:loc>
      <image:title>${g((u=n.title)!=null?u:" ")}</image:title>
      <image:caption>${g((f=n.altText)!=null?f:" ")}</image:caption>
    </image:image>`:""}
  </url>
  `}).join(`
`)}
</urlset>`},h=(t,i)=>{let e=[],s=a=>{let r=Object.entries(a.paths).reduce((o,[l,n])=>(n?o.allow.push(l):o.disallow.push(l),o),{allow:[],disallow:[]});Array.isArray(a.userAgent)?a.userAgent.forEach(o=>{e.push(m({agent:o,crawlDelay:a.crawlDelay},r))}):e.push(m({agent:a.userAgent||"*",crawlDelay:a.crawlDelay},r))};return typeof t=="boolean"?e.push({agent:"*",allow:t===!0?["/"]:[],disallow:t===!1?["/"]:[]}):Array.isArray(t)?t.forEach(s):s(t),`${e.map(({agent:a,crawlDelay:r,allow:o,disallow:l})=>`User-agent: ${a}
Sitemap: ${i}/sitemap.xml
${r?`Crawl-delay: ${r}`:""}
${o.map(n=>`Allow: ${n}`).join(`
`)}
${l.map(n=>`Disallow: ${n}`).join(`
`)}
`.replace(/\n\n/g,`
`).replace(/\n\n/g,`
`)).join(`
`)}
`.trim()},R=t=>{let i=c.readdirSync(t);return i.some(e=>e==="+page.svelte")?!0:i.some(e=>{let s=t+"/"+e;return c.statSync(s).isDirectory()?R(s):!1})},x=t=>{let i={},e=s=>{let a=c.statSync(s).isDirectory(),r=a&&R(s);a&&r&&c.readdirSync(s).forEach(p=>e(s+"/"+p));let o=s.replace(t,"").replace("/+page.svelte",""),l=s.replace("/+page.svelte",""),n=c.statSync(l).isDirectory()&&c.readdirSync(s.replace("/+page.svelte","")).some(p=>c.statSync(l+"/"+p).isDirectory());!s.endsWith("+page.svelte")&&!n||!o.includes("/api")&&!t.includes("/api")&&Object.assign(i,{[o||"/"]:n})};return c.readdirSync(t).forEach(s=>!t.includes("/api")&&e(t+"/"+s)),i};var k=(t,i={})=>a=>d(void 0,[a],function*({event:e,resolve:s}){if(e.url.host.startsWith("www."))return new Response(null,{status:301,headers:{location:e.url.href.replace("//www.","//")}});if(e.url.pathname==="/sitemap.xml"){let r=i.getRoutes?yield i.getRoutes(e):{};return new Response(w(r,e.url.origin,t),{status:200,headers:{"Content-Type":"application/xml"}})}if(e.url.pathname==="/robots.txt"){let r=i.getRobots?yield i.getRobots(e):!0;return new Response(h(r,e.url.origin),{headers:{"content-type":"text/plain","cache-control":`max-age=${60*60*24}`}})}return s(e)});import A from"fs";var T=({routesDir:t="./src/routes",sitemapFile:i="./src/sitemap.ts"}={})=>{function e(){A.writeFileSync(i,`import type { RO_Sitemap } from '@fayez-nazzal/sveltekit-sitemap';

export const sitemap = (<const>${JSON.stringify(x(t),null,3).replace(/\uFFFF/g,'\\"')}) satisfies RO_Sitemap

export type Sitemap = typeof sitemap
`)}return e(),{name:"@fayez-nazzal/sveltekit-sitemap",configureServer(s){s.watcher.on("add",e).on("unlink",e).on("unlinkDir",e)}}};export{g as encodeXML,h as generateRobots,w as generateSitemap,x as getRoutes,k as sitemapHook,T as sitemapPlugin};
//# sourceMappingURL=index.mjs.map