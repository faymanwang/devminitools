import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const baseUrl = 'https://devminitools.com';
const failures = [];

function walkHtml(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const absolute = join(directory, entry.name);
        if (entry.isDirectory()) return entry.name === 'en' ? walkHtml(absolute) : [];
        return extname(entry.name) === '.html' ? [absolute] : [];
    });
}

function read(path) {
    return readFileSync(path, 'utf8');
}

function fail(message) {
    failures.push(message);
}

function normalizedRelative(path) {
    return relative(root, path).replace(/\\/g, '/');
}

function expectedUrl(path) {
    return `${baseUrl}/${normalizedRelative(path)}`;
}

const htmlFiles = walkHtml(root).sort();
const toolFiles = htmlFiles.filter(path => basename(path) !== 'index.html');

if (toolFiles.length !== 22) {
    fail(`expected 22 localized tool pages, found ${toolFiles.length}`);
}

for (const path of htmlFiles) {
    const file = normalizedRelative(path);
    const html = read(path);
    const isEnglish = file.startsWith('en/');
    const isRedirect = basename(path) === 'index.html';

    if (!/<title>[^<]+<\/title>/.test(html)) fail(`${file}: missing <title>`);
    if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html)) fail(`${file}: missing meta description`);
    if (!new RegExp(`<html\\s+lang="${isEnglish ? 'en' : 'zh-CN'}">`).test(html)) fail(`${file}: incorrect html lang`);

    if (isRedirect) {
        if (!/<meta\s+name="robots"\s+content="noindex,follow">/.test(html)) fail(`${file}: redirect page must be noindex,follow`);
    } else {
        const canonical = expectedUrl(path);
        const pageName = basename(path);
        const zhUrl = `${baseUrl}/${pageName}`;
        const enUrl = `${baseUrl}/en/${pageName}`;
        const h1Count = (html.match(/<h1\b/g) || []).length;
        if (h1Count !== 1) fail(`${file}: expected one h1, found ${h1Count}`);
        if (!html.includes(`<link rel="canonical" href="${canonical}">`)) fail(`${file}: incorrect canonical`);
        if (!html.includes(`<link rel="alternate" hreflang="zh-CN" href="${zhUrl}">`)) fail(`${file}: missing zh-CN hreflang`);
        if (!html.includes(`<link rel="alternate" hreflang="en" href="${enUrl}">`)) fail(`${file}: missing en hreflang`);
        if (!html.includes(`<link rel="alternate" hreflang="x-default" href="${zhUrl}">`)) fail(`${file}: missing x-default hreflang`);
        for (const property of ['og:type', 'og:site_name', 'og:locale', 'og:title', 'og:description', 'og:url']) {
            if (!html.includes(`property="${property}"`)) fail(`${file}: missing ${property}`);
        }
        for (const name of ['twitter:card', 'twitter:title', 'twitter:description']) {
            if (!html.includes(`name="${name}"`)) fail(`${file}: missing ${name}`);
        }
        const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (!jsonLdMatch) {
            fail(`${file}: missing JSON-LD`);
        } else {
            try {
                const schema = JSON.parse(jsonLdMatch[1]);
                if (schema['@type'] !== 'WebApplication') fail(`${file}: JSON-LD must use WebApplication`);
                if (schema.url !== canonical) fail(`${file}: JSON-LD URL mismatch`);
                if (schema.inLanguage !== (isEnglish ? 'en' : 'zh-CN')) fail(`${file}: JSON-LD language mismatch`);
            } catch (error) {
                fail(`${file}: invalid JSON-LD (${error.message})`);
            }
        }
        if (isEnglish && !html.includes('<script src="../js/i18n.js"></script>')) fail(`${file}: missing runtime i18n script`);
    }

    const resourcePattern = /<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g;
    let match;
    while ((match = resourcePattern.exec(html)) !== null) {
        const target = match[1].split(/[?#]/)[0];
        if (!target || /^(?:https?:|mailto:|#|data:)/.test(target) || target.endsWith('.html')) continue;
        if (!existsSync(resolve(dirname(path), target))) fail(`${file}: missing referenced asset ${target}`);
    }

    const linkPattern = /<a\b[^>]+href="([^"]+)"/g;
    while ((match = linkPattern.exec(html)) !== null) {
        const target = match[1].split(/[?#]/)[0];
        if (!target || /^(?:https?:|mailto:|#)/.test(target)) continue;
        if (target.endsWith('.html') && !existsSync(resolve(dirname(path), target))) fail(`${file}: missing linked page ${target}`);
    }
}

const sitemapPath = join(root, 'sitemap.xml');
const robotsPath = join(root, 'robots.txt');
if (!existsSync(sitemapPath)) {
    fail('missing sitemap.xml');
} else {
    const sitemap = read(sitemapPath);
    if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) fail('sitemap.xml: missing xhtml namespace');
    if (sitemap.includes(`<loc>${baseUrl}/</loc>`)) fail('sitemap.xml: redirect root must not be submitted');
    for (const path of toolFiles) {
        const url = expectedUrl(path);
        if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap.xml: missing ${normalizedRelative(path)}`);
    }
}

if (!existsSync(robotsPath)) {
    fail('missing robots.txt');
} else if (!read(robotsPath).includes(`Sitemap: ${baseUrl}/sitemap.xml`)) {
    fail('robots.txt: missing sitemap directive');
}

const packageJson = JSON.parse(read(join(root, 'package.json')));
if (!packageJson.build?.files?.includes('en/**/*.html')) fail('package.json: Electron build does not include English pages');

if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
}

console.log(`site check ok (${htmlFiles.length} html pages; ${toolFiles.length} localized tool pages)`);
