import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { posix } from 'node:path';
import { execFileSync } from 'node:child_process';

export const site = {
    name: 'DevMiniTools', url: 'https://devminitools.com', operator: 'faymanwang',
    repository: 'https://github.com/faymanwang/devminitools',
    feedback: 'https://github.com/faymanwang/devminitools/issues', issuesEnabled: false,
    contactEmail: 'faymanwang@gmail.com', adsEnabled: false
};
export function productionErrors(config = site) {
    const errors=[];
    if(!config.issuesEnabled&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail||''))errors.push('production: enable and verify GitHub Issues, or configure a real contact email');
    if(config.adsEnabled)errors.push('production: advertising is not implemented or validated');
    return errors;
}
export const toolFiles = ['json-format.html','convert.html','image-compress.html','image-convert.html','image-gif.html','color-convert.html','user-agent.html','diff.html','markdown-preview.html','line-tools.html','ip-lookup.html'];
export const guides = [
    { slug: 'json-safety', tool: 'json-format.html', zh: 'JSON 校验、树形查看与大整数精度', en: 'JSON Validation, Tree View and Large Integer Safety' },
    { slug: 'image-compress', tool: 'image-compress.html', zh: '图片压缩：尺寸、格式与透明背景', en: 'Image Compression: Dimensions, Formats and Transparency' },
    { slug: 'code-diff', tool: 'diff.html', zh: '代码对比：空白和大小写如何影响结果', en: 'Code Diff: How Whitespace and Case Affect Results' }
];
const info = {
    about: ['关于 DevMiniTools','About DevMiniTools'], privacy: ['隐私政策','Privacy Policy'],
    contact: ['联系与反馈','Contact and Feedback'], credits: ['开源说明','Open Source Notices']
};
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const relative = (from, to) => posix.relative(posix.dirname(from), to) || posix.basename(to);
export function publicUrl(file) {
    return site.url + '/' + (file === 'index.html' ? '' : file.replace(/index\.html$/, '').replace(/\.html$/, ''));
}
export function pageRegistry() {
    const records = [{file:'index.html',type:'landing'},{file:'en/index.html',type:'landing'}];
    for (const prefix of ['', 'en/']) {
        toolFiles.forEach(file => records.push({file:prefix+file,type:'tool'}));
        Object.keys(info).forEach(slug=>records.push({file:prefix+slug+'.html',type:'info'}));
        records.push({file:prefix+'guides/index.html',type:'guide-index'});
        guides.forEach(g=>records.push({file:prefix+'guides/'+g.slug+'.html',type:'guide'}));
    }
    return records;
}
export function cleanManaged(html) {
    return html.replace(/\s*<!-- dmt:[\w-]+ -->[\s\S]*?<!-- \/dmt:[\w-]+ -->/g,'');
}
function managed(name, value) { return `\n<!-- dmt:${name} -->${value}<!-- /dmt:${name} -->`; }
function footerLinks(html, file, english) {
    const prefix = english ? 'en/' : '';
    const links = [['guides/index.html',english?'Guides':'使用教程'],['about.html',english?'About':'关于'],['contact.html',english?'Contact':'联系'],['privacy.html',english?'Privacy':'隐私'],['credits.html',english?'Open source':'开源说明']];
    html=html.replace('class="site-footer"','class="site-footer dmt-footer"');
    html=html.replace('</head>',managed('footer-style',`<link rel="stylesheet" href="${relative(file,'css/footer.css')}">`)+'\n</head>');
    return html.replace(/(<div class="footer-links">)([\s\S]*?)(<\/div>)/, (_,open,body,close)=>open+body.trimEnd()+managed('footer',links.map(([url,label])=>`<a href="${relative(file,prefix+url)}">${label}</a>`).join(''))+close);
}
export function enhancePage(html, file, english) {
    const filename = posix.basename(file);
    const guide = guides.find(g=>g.tool===filename);
    if (guide) {
        const link = relative(file,(english?'en/':'')+'guides/'+guide.slug+'.html');
        const note = english
            ? filename==='json-format.html' ? 'Unsafe numeric identifiers are rejected to prevent precision loss. Keep IDs in quotes. Syntax validation does not validate business rules.'
                : filename==='image-compress.html' ? 'JPEG fills transparent areas with white. PNG quality is not adjustable. Re-encoding can increase file size; compare the downloaded result.'
                : 'Ignore whitespace normalizes whitespace within each line; ignore case affects comparison only. A visually identical result does not prove semantic equivalence.'
            : filename==='json-format.html' ? '超出安全整数范围的数值会被拒绝，请将业务标识写成字符串。语法通过不代表符合业务规则。'
                : filename==='image-compress.html' ? 'JPEG 会把透明区域填为白色；PNG 无质量参数。重新编码可能让文件更大，请比较下载结果。'
                : '忽略空白会规范化每一行内的空白；忽略大小写只改变比较规则。对比一致不代表程序语义相同。';
        html=html.replace(/\s*<\/main>/,managed('tool-guide',`<section class="section-block dmt-tool-note"><h2>${english?'Example and limitations':'案例与使用边界'}</h2><p>${note}</p><a href="${link}">${guide[english?'en':'zh']}</a></section>`)+'\n</main>');
    }
    if (['json-format.html','convert.html','image-compress.html','image-convert.html'].includes(filename)) {
        html=html.replace(/\s*(<script src="(?:\.\.\/)?js\/(?:script|convert|image-compress|image-convert)\.js"><\/script>)/,managed('safety',`<script src="${relative(file,'js/input-safety.js')}"></script>` )+'\n$1');
    }
    return footerLinks(html,file,english);
}
export function enhanceLanding(html, english) {
    const file=english?'en/index.html':'index.html';
    // The language landing is not a translation of the JSON application.
    if (!english) html=html.replace(/\s*<link rel="alternate" hreflang="(?:zh-CN|en)"[^>]*>/g,'');
    else html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'DevMiniTools English Developer Tools',url:publicUrl(file),inLanguage:'en'})}</script>\n</head>`);
    const links=guides.map(g=>`<a class="tool-card" href="${relative(file,(english?'en/':'')+'guides/'+g.slug+'.html')}"><h3>${g[english?'en':'zh']}</h3></a>`).join('');
    const section=`<section class="section-block"><div class="section-heading"><div><h2>${english?'Practical guides':'实用教程 / Practical guides'}</h2><p>${english?'Reproducible examples using these tools.':'用真实输入和输出理解工具；教程提供中英文版本。'}</p></div></div><div class="tool-grid">${links}</div></section>`;
    return footerLinks(html.replace(/\s*<\/main>/,managed('home-guides',section)+'\n</main>'),file,english);
}
function markdown(text) {
    let inCode=false,code=[],html=[];
    const inline=s=>escape(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{ if(!/^(https?:\/\/|\.\.?\/|[\w/-]+\.html)/.test(url)) throw new Error('Unsupported Markdown link');return `<a href="${escape(url)}">${label}</a>`; }).replace(/`([^`]+)`/g,'<code>$1</code>');
    for(const line of text.split(/\r?\n/)) {
        if(line.startsWith('```')) { if(inCode){html.push('<pre><code>'+escape(code.join('\n'))+'</code></pre>');code=[];}inCode=!inCode;continue; }
        if(inCode){code.push(line);continue;}
        const heading=/^(#{1,3}) (.+)/.exec(line);
        if(heading) html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
        else if(line.trim()) html.push(`<p>${inline(line)}</p>`);
    }
    if(inCode) throw new Error('Unclosed Markdown code fence');
    return html.join('\n');
}
function modified(file) {
    if(!existsSync(file))file='scripts/site-content.mjs';
    try {
        const dirty=execFileSync('git',['status','--porcelain','--',file],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
        const date=execFileSync('git',['log','-1','--format=%cs','--',file],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
        if(date&&!dirty)return date;
    }catch{}
    return statSync(file).mtime.toISOString().slice(0,10);
}
function page(file,title,body,type,source) {
    const english=file.startsWith('en/');const pair=english?file.slice(3):'en/'+file;
    const home=relative(file,english?'en/index.html':'index.html');
    const schema={'@context':'https://schema.org','@type':type==='guide'?'TechArticle':'WebPage',name:title,url:publicUrl(file),inLanguage:english?'en':'zh-CN',dateModified:modified(source)};
    if(type==='guide')schema.author={'@type':'Person',name:site.operator,url:site.repository};
    let html=`<!DOCTYPE html><html lang="${english?'en':'zh-CN'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escape(title)} - DevMiniTools</title><meta name="description" content="${escape(title)} — DevMiniTools ${english?'examples, instructions and limitations':'案例、说明与使用边界'}"><link rel="canonical" href="${publicUrl(file)}"><link rel="alternate" hreflang="zh-CN" href="${publicUrl(english?pair:file)}"><link rel="alternate" hreflang="en" href="${publicUrl(english?file:pair)}"><link rel="stylesheet" href="${relative(file,'css/style.css')}"><link rel="stylesheet" href="${relative(file,'css/content.css')}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body class="tool-page"><header class="site-header"><a class="brand" href="${relative(file,'index.html')}"><span class="brand-dev">Dev</span><span class="brand-name">MiniTools</span></a><div class="language-switch" aria-label="${english?'Language selection':'语言选择'}"><a href="${relative(file,pair)}" lang="${english?'zh-CN':'en'}">${english?'中文':'EN'}</a></div></header><main class="tool-shell dmt-article"><p><a href="${home}">${english?'Tools':'工具入口'}</a> / <a href="${relative(file,(english?'en/':'')+'guides/index.html')}">${english?'Guides':'使用教程'}</a></p><h1>${escape(title)}</h1>${body}</main><footer class="site-footer"><div><strong>DevMiniTools</strong></div><div class="footer-links"><a href="${site.repository}" target="_blank" rel="noopener">GitHub</a></div></footer></body></html>`;
    html=footerLinks(html,file,english);mkdirSync(posix.dirname(file),{recursive:true});writeFileSync(file,html+'\n');
}
function infoBody(slug,en) {
    if(slug==='contact' && site.contactEmail) return en
        ? `<p>Email: <a href="mailto:${escape(site.contactEmail)}">${escape(site.contactEmail)}</a>.</p><p>Include the tool name, browser version, steps, expected and actual result. Use redacted or synthetic samples. Do not send passwords, API keys, personal information or original business files.</p>`
        : `<p>联系邮箱：<a href="mailto:${escape(site.contactEmail)}">${escape(site.contactEmail)}</a>。</p><p>请提供工具名、浏览器版本、重现步骤、预期与实际结果，并使用脱敏或合成样例。不要发送密码、密钥、个人资料或业务原文件。</p>`;
    if(slug==='contact' && !site.issuesEnabled && !site.contactEmail) return en
        ? `<p>The maintainer's public repository is <a href="${site.repository}">faymanwang/devminitools</a>. GitHub Issues is currently disabled, so a working issue-submission channel is not yet available. No contact email has been published.</p><p>The maintainer must enable and verify a feedback channel before publishing this release. Do not submit secrets or personal files through public repository content.</p>`
        : `<p>维护者公开仓库为 <a href="${site.repository}">faymanwang/devminitools</a>。该仓库当前未启用 GitHub Issues，暂不能提交 Issue；本版也未公布联系邮箱。</p><p>正式发布前需由维护者开通并验证反馈渠道。不要把密钥或个人文件提交到公开仓库内容中。</p>`;
    const bodies={
        about: en
            ? `<p>DevMiniTools provides 11 browser-based developer tools, with Chinese and English interfaces. It focuses on JSON inspection, images, text and debugging without a file-upload service.</p><h2>Maintainer</h2><p>The public maintainer is <a href="${site.repository}">${site.operator}</a>. The project builds on Rodert/jsonformat; its upstream authors do not operate this website.</p><p>Examples describe the supported behavior, not a guarantee for every input. Review conversion results before using them in production.</p>`
            : `<p>DevMiniTools 提供 11 个浏览器开发工具及中英文界面，围绕 JSON、图片、文本和调试场景，不提供收集用户文件的上传服务。</p><h2>维护者</h2><p>公开维护者为 <a href="${site.repository}">${site.operator}</a>。项目基于 Rodert/jsonformat 发展，上游作者不代表本站运营方。</p><p>教程说明具体操作和支持范围，不保证所有输入都适用。转换结果在用于实际业务前需要复核。</p>`,
        contact: en
            ? `<p>Report reproducible problems through <a href="${site.feedback}">GitHub Issues</a>. A GitHub account may be required; please follow GitHub's privacy policy when submitting.</p><p>Include the tool name, browser version, steps, expected result and actual result. Use synthetic or redacted examples. Do not submit API keys, passwords, personal data or original business files. Issues are public.</p><p>There is no published contact email for this release. Local tools do not require you to send files to the maintainer.</p>`
            : `<p>通过 <a href="${site.feedback}">GitHub Issues</a> 反馈可复现问题。提交可能需要 GitHub 账号，信息处理适用 GitHub 的政策。</p><p>请提供工具名称、浏览器版本、重现步骤、预期与实际结果。使用合成或脱敏示例，不要提交 API Key、密码、个人资料或业务原文件。Issue 内容公开可见。</p><p>本版未公布联系邮箱。使用本地工具不需要向维护者发送文件。</p>`,
        privacy: en
            ? `<h2>Tool inputs</h2><p>Text and files in the 11 tools are processed in your browser. The site has no service that uploads these inputs for processing. Clipboard, local file selection and downloads are triggered by your actions.</p><h2>Website requests and analytics</h2><p>Loading the site requests HTML, styles, scripts and assets from its hosting/CDN providers. Providers may process IP addresses, request times, paths and browser metadata for delivery and security. Cloudflare's analytics beacon has been observed on the live site; local processing of tool inputs does not mean that visits generate no network requests.</p><p>Cloudflare describes its analytics at <a href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</a> and its handling of information in the <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare Privacy Policy</a>. Retention and access depend on the deployed service configuration.</p><h2>External links and desktop updates</h2><p>Opening GitHub or other external links sends a request to that service. The desktop application loads the tools locally and may check the configured GitHub repository for new releases. Update checks do not include tool inputs; GitHub can receive request metadata.</p><h2>Advertising and changes</h2><p>This release does not include AdSense or advertising cookies. Any future advertising integration requires an updated disclosure and applicable consent configuration before launch. Privacy questions can be raised through the contact page using redacted information.</p>`
            : `<h2>工具输入</h2><p>11 个工具的文本与文件在当前浏览器内处理，本站没有用于上传这些输入并代为处理的服务。剪贴板、文件选择和下载由你的操作触发。</p><h2>访问请求与统计</h2><p>加载网站会向托管/CDN 服务请求页面、样式、脚本和资源。服务商可能为内容交付和安全处理 IP、请求时间、路径及浏览器信息。线上已观察到 Cloudflare 分析脚本；工具内容本地处理，不等于访问网站不会产生网络请求。</p><p>相关说明见 <a href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</a> 与 <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare 隐私政策</a>。日志保留和访问权限取决于实际部署配置。</p><h2>外部链接与桌面更新</h2><p>打开 GitHub 等外部链接会向对方发送访问请求。桌面版从本地加载工具，并可能向配置的 GitHub 仓库检查新版本；更新请求不包含工具输入，GitHub 可能接收访问元数据。</p><h2>广告与变更</h2><p>本版未接入 AdSense 或广告 Cookie。未来接入前需要更新披露并完成适用的同意配置。隐私问题可通过联系页反馈，请只提交脱敏信息。</p>`,
        credits: en
            ? `<p>This project builds on <a href="https://github.com/Rodert/jsonformat">Rodert/jsonformat</a>, originally attributed to 王仕宇 / JavaPub (Rodert) and contributors.</p><p>The repository's root LICENSE is Apache-2.0. Earlier MIT labels in README/package metadata conflicted with that file and have been corrected to match it. Third-party licenses are unchanged.</p><p>highlight.js uses BSD-3-Clause and gif.js uses MIT. Full notices accompany the distribution in <a href="${relative('en/credits.html','THIRD_PARTY_NOTICES.md')}">THIRD_PARTY_NOTICES.md</a>.</p>`
            : `<p>本项目基于 <a href="https://github.com/Rodert/jsonformat">Rodert/jsonformat</a>，原作者署名为王仕宇 / JavaPub（Rodert）及贡献者。</p><p>仓库根 LICENSE 为 Apache-2.0。原 README/package 中的 MIT 标签与根文件冲突，现按根许可证修正元数据，未改写第三方授权。</p><p>highlight.js 使用 BSD-3-Clause，gif.js 使用 MIT。原文随发行包保留，见 <a href="THIRD_PARTY_NOTICES.md">THIRD_PARTY_NOTICES.md</a>。</p>`
    };return bodies[slug];
}
export function buildSupportingPages() {
    for(const en of [false,true]) {
        const prefix=en?'en/':'';
        for(const [slug,titles]of Object.entries(info)) page(prefix+slug+'.html',titles[en?1:0],infoBody(slug,en),'info','scripts/site-content.mjs');
        let list='';
        for(const guide of guides) {
            const source=`content/guides/${en?'en':'zh'}/${guide.slug}.md`;
            page(prefix+'guides/'+guide.slug+'.html',guide[en?'en':'zh'],markdown(readFileSync(source,'utf8')),'guide',source);
            list+=`<li><a href="${guide.slug}.html">${guide[en?'en':'zh']}</a></li>`;
        }
        page(prefix+'guides/index.html',en?'Practical Guides':'使用教程',`<p>${en?'Real inputs, reproducible steps and explicit limitations.':'真实输入、可复现步骤和明确的支持边界。'}</p><ul>${list}</ul>`,'guide-index','scripts/site-content.mjs');
    }
}
export function writeMetadata() {
    const entries=pageRegistry().map(p=>{
        const en=p.file.startsWith('en/');
        const pair=en?p.file.slice(3):'en/'+p.file;
        const source=p.type==='guide'?`content/guides/${en?'en':'zh'}/${posix.basename(p.file,'.html')}.md`:p.type==='info'||p.type==='guide-index'?'scripts/site-content.mjs':p.file;
        const alternate=p.type==='landing'?p.file==='index.html'?`<xhtml:link rel="alternate" hreflang="x-default" href="${site.url}/" />`:'':`<xhtml:link rel="alternate" hreflang="zh-CN" href="${publicUrl(en?pair:p.file)}" /><xhtml:link rel="alternate" hreflang="en" href="${publicUrl(en?p.file:pair)}" />`;
        return `  <url><loc>${publicUrl(p.file)}</loc>${alternate}<lastmod>${modified(source)}</lastmod></url>`;
    });
    writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
    writeFileSync('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
}
