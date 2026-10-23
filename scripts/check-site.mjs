import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pageRegistry, publicUrl, site, productionErrors } from './site-content.mjs';
const errors=[];const titles=new Set();const root=process.cwd();
const pages=pageRegistry();const sitemap=readFileSync('sitemap.xml','utf8');
if(process.argv.includes('--production'))errors.push(...productionErrors());
for(const {file,type} of pages){
    if(!existsSync(file)){errors.push(`${file}: missing page`);continue;}
    const html=readFileSync(file,'utf8');const en=file.startsWith('en/');const url=publicUrl(file);
    const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
    if(!title||titles.has(title))errors.push(`${file}: missing or duplicate title`);titles.add(title);
    if(!/<meta name="description" content="[^"]+"/.test(html))errors.push(`${file}: missing description`);
    if(!html.includes(`<html lang="${en?'en':'zh-CN'}">`))errors.push(`${file}: incorrect language`);
    if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${file}: expected one h1`);
    if(!html.includes(`<link rel="canonical" href="${url}">`))errors.push(`${file}: canonical mismatch`);
    if(!sitemap.includes(`<loc>${url}</loc>`))errors.push(`${file}: missing sitemap entry`);
    if(/noindex|http-equiv="refresh"|location\.replace\(/.test(html))errors.push(`${file}: unexpected indexing restriction or redirect`);
    if(type!=='landing'){
        const pair=en?file.slice(3):'en/'+file;
        for(const [language,target] of [['zh-CN',en?pair:file],['en',en?file:pair]])if(!html.includes(`<link rel="alternate" hreflang="${language}" href="${publicUrl(target)}">`))errors.push(`${file}: hreflang mismatch`);
    }
    if(file==='index.html'&&/hreflang="zh-CN"[^>]*json-format/.test(html))errors.push('index: formatter is not a homepage translation');
    const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if(!schemas.length)errors.push(`${file}: missing structured data`);
    for(const match of schemas){try{const s=JSON.parse(match[1]);if(s.url!==url)errors.push(`${file}: schema URL mismatch`);if(type==='tool'&&s['@type']!=='WebApplication')errors.push(`${file}: wrong tool schema`);if(type==='guide'&&s['@type']!=='TechArticle')errors.push(`${file}: wrong article schema`);}catch{errors.push(`${file}: invalid JSON-LD`);}}
    if(type==='tool'&&en&&!html.includes('src="../js/i18n.js"'))errors.push(`${file}: missing dynamic translations`);
    for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
        const target=m[1].split(/[?#]/)[0];if(!target||/^(https?:|mailto:|data:|blob:)/.test(target))continue;
        const absolute=resolve(dirname(file),target);
        if(relative(root,absolute).startsWith('..')||!existsSync(absolute))errors.push(`${file}: broken local resource/link ${target}`);
    }
    if(/adsbygoogle|googlesyndication/.test(html))errors.push(`${file}: unexpected advertising`);
    if(!html.includes('<!-- dmt:footer -->'))errors.push(`${file}: missing supporting links`);
}
if((sitemap.match(/<loc>/g)||[]).length!==pages.length||/<loc>[^<]*\.html<\/loc>/.test(sitemap))errors.push('sitemap page registry mismatch or non-canonical URLs');
if(!readFileSync('robots.txt','utf8').includes(`Sitemap: ${site.url}/sitemap.xml`))errors.push('robots: wrong sitemap');
for(const dir of ['js','electron','scripts'])for(const f of readdirSync(dir).filter(f=>/\.(?:m?js)$/.test(f))){const result=spawnSync(process.execPath,['--check',join(dir,f)],{encoding:'utf8'});if(result.status)errors.push(result.stderr);}
const pkg=JSON.parse(readFileSync('package.json','utf8'));
for(const pattern of ['en/**/*.html','guides/**/*.html','THIRD_PARTY_NOTICES.md'])if(!pkg.build.files.includes(pattern))errors.push(`desktop: missing ${pattern}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`site check ok (${pages.length} pages; ${pages.filter(p=>p.type==='tool').length} localized tool pages)`);
