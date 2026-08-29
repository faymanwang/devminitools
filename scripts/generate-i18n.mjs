import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const baseUrl = 'https://devminitools.com';
const lastModified = '2026-08-29';

const pages = {
    'json-format.html': {
        zhTitle: 'JSON格式化工具 - 在线JSON美化、压缩、校验工具',
        enTitle: 'JSON Formatter - Format, Minify and Validate JSON Online',
        zhDescription: '免费在线JSON格式化工具，支持JSON美化、压缩、校验、复制、下载、树形查看、JSON转YAML、JSON转XML、JSON转TypeScript、JSON转Go Struct，所有数据仅在浏览器本地处理。',
        enDescription: 'Free online JSON formatter to format, minify, validate, copy and download JSON, with tree view and conversions to YAML, XML, TypeScript and Go Struct. All data stays in your browser.',
        zhH1: '在线 JSON 格式化工具',
        enH1: 'Online JSON Formatter'
    },
    'convert.html': {
        zhTitle: 'JSON转换工具 - 在线生成Java、Go、C#、Rust实体',
        enTitle: 'JSON Converter - Generate Java, Go, C# and Rust Types',
        zhDescription: '免费在线JSON转换工具，支持将JSON转换为Java实体、Go Struct、C#实体、Rust Struct、Ruby类、XML和YAML，数据仅在浏览器本地处理。',
        enDescription: 'Convert JSON online to Java classes, Go structs, C# classes, Rust structs, Ruby classes, XML and YAML. All processing happens locally in your browser.',
        zhH1: 'JSON 转实体类和结构体',
        enH1: 'JSON to Classes and Structs'
    },
    'image-compress.html': {
        zhTitle: '图片压缩工具 - 在线照片压缩和 WebP JPEG PNG 转换',
        enTitle: 'Image Compressor - Compress JPEG, PNG and WebP Online',
        zhDescription: '免费在线图片压缩工具，支持 JPEG、PNG、WebP 图片在浏览器本地压缩，可设置输出格式、质量、最大宽高并下载压缩后的图片。',
        enDescription: 'Compress JPEG, PNG, WebP and AVIF images online. Choose output format, quality and maximum dimensions, then download the result. Images stay in your browser.',
        zhH1: '在线图片压缩工具',
        enH1: 'Online Image Compressor'
    },
    'image-convert.html': {
        zhTitle: '图片格式转换工具 - PNG JPG WebP 在线互转',
        enTitle: 'Image Converter - Convert PNG, JPEG and WebP Online',
        zhDescription: '免费在线图片格式转换工具，支持 PNG、JPEG、WebP、AVIF 图片在浏览器本地转换为 JPEG、PNG 或 WebP，并可预览和下载转换结果。',
        enDescription: 'Convert PNG, JPEG, WebP and AVIF images online to JPEG, PNG or WebP. Preview and download the result without uploading your images.',
        zhH1: '在线图片格式转换工具',
        enH1: 'Online Image Converter'
    },
    'image-gif.html': {
        zhTitle: '图片合成 GIF - 多张图片本地制作动图',
        enTitle: 'Images to GIF - Create an Animated GIF Online',
        zhDescription: '免费在线图片合成 GIF 工具，选择多张 PNG、JPG、WebP 或 AVIF 图片，在浏览器本地调整顺序、帧间隔和尺寸后导出 GIF。',
        enDescription: 'Create an animated GIF from multiple PNG, JPEG, WebP or AVIF images. Reorder frames, set timing and size, then export locally in your browser.',
        zhH1: '在线图片合成 GIF 工具',
        enH1: 'Online Images to GIF Maker'
    },
    'color-convert.html': {
        zhTitle: '颜色转换工具 - HEX RGB HSL 在线互转',
        enTitle: 'Color Converter - Convert HEX, RGB and HSL Online',
        zhDescription: '免费在线颜色转换工具，支持HEX、RGB、HSL颜色互转，自动生成CSS颜色值和颜色预览，数据仅在浏览器本地处理。',
        enDescription: 'Convert colors between HEX, RGB and HSL online, generate CSS color values and preview the result. All processing stays in your browser.',
        zhH1: '在线颜色转换工具',
        enH1: 'Online Color Converter'
    },
    'user-agent.html': {
        zhTitle: 'User-Agent解析工具 - 在线识别浏览器、系统和设备',
        enTitle: 'User-Agent Parser - Detect Browser, OS and Device Online',
        zhDescription: '免费在线User-Agent解析工具，支持识别浏览器、操作系统、设备类型、渲染引擎和常见机器人，数据仅在浏览器本地处理。',
        enDescription: 'Parse User-Agent strings online to detect browser, operating system, device type, rendering engine and common bots. Data stays in your browser.',
        zhH1: '在线 User-Agent 解析工具',
        enH1: 'Online User-Agent Parser'
    },
    'diff.html': {
        zhTitle: '代码对比工具 - 在线文本Diff和代码差异比较',
        enTitle: 'Code Diff Tool - Compare Text and Code Online',
        zhDescription: '免费在线代码对比工具，支持文本和多种编程语言差异对比、语法高亮、忽略空白、忽略大小写、同步滚动和文件上传，数据仅在浏览器本地处理。',
        enDescription: 'Compare text and code online with syntax highlighting, whitespace and case options, synchronized scrolling and local file upload. Data stays in your browser.',
        zhH1: '在线代码对比工具',
        enH1: 'Online Code Diff Tool'
    },
    'markdown-preview.html': {
        zhTitle: 'Markdown预览工具 - 在线Markdown转HTML预览',
        enTitle: 'Markdown Preview - Convert Markdown to HTML Online',
        zhDescription: '免费在线Markdown预览工具，支持标题、列表、引用、代码块、链接、表格的实时预览和HTML复制，数据仅在浏览器本地处理。',
        enDescription: 'Preview Markdown online with headings, lists, quotes, code blocks, links and tables, then copy the generated HTML. Data stays in your browser.',
        zhH1: '在线 Markdown 预览工具',
        enH1: 'Online Markdown Preview'
    },
    'line-tools.html': {
        zhTitle: '多行文本处理工具 - 在线拼接添加前后缀',
        enTitle: 'Line Tools - Join Lines and Add Prefixes or Suffixes',
        zhDescription: '免费在线多行文本处理工具，支持多行拼接、添加前缀后缀、包裹引号、逗号分隔、删除换行，数据仅在浏览器本地处理。',
        enDescription: 'Process multiline text online by joining lines, adding prefixes or suffixes, wrapping quotes and removing blank lines. Data stays in your browser.',
        zhH1: '在线多行文本处理工具',
        enH1: 'Online Line Tools'
    },
    'ip-lookup.html': {
        zhTitle: 'IP信息查询工具 - 在线校验IPv4和IPv6地址类型',
        enTitle: 'IP Address Tool - Validate IPv4 and IPv6 Online',
        zhDescription: '免费在线IP信息查询工具，支持IPv4和IPv6格式校验、私有地址、回环地址、链路本地、多播地址识别，数据仅在浏览器本地处理。',
        enDescription: 'Validate IPv4 and IPv6 addresses online and identify private, loopback, link-local, multicast and other address types locally in your browser.',
        zhH1: '在线 IP 地址查询工具',
        enH1: 'Online IP Address Tool'
    }
};

const translations = {
    '数据仅在浏览器本地处理，不上传服务器': 'Data is processed locally in your browser and is never uploaded',
    'DevMiniTools 首页': 'DevMiniTools home',
    '工具导航': 'Tool navigation',
    '语言选择': 'Language selection',
    'JSON格式化工作台': 'JSON formatting workspace',
    'JSON格式化': 'JSON Formatter',
    'JSON转换': 'JSON Converter',
    '图像': 'Images',
    '图片压缩': 'Image Compressor',
    '图片格式转换': 'Image Converter',
    '图片合成 GIF': 'Images to GIF',
    '调试': 'Developer',
    '代码对比': 'Code Diff',
    '颜色转换': 'Color Converter',
    'User-Agent解析': 'User-Agent Parser',
    'IP信息查询': 'IP Address',
    '文本': 'Text',
    'Markdown预览': 'Markdown Preview',
    '多行文本处理': 'Line Tools',
    '输入JSON': 'Input JSON',
    '输入 JSON': 'Input JSON',
    '请在此处粘贴 JSON 数据...': 'Paste JSON data here...',
    '格式化': 'Format',
    '压缩': 'Minify',
    '校验': 'Validate',
    '转义': 'Escape',
    '去转义': 'Unescape',
    '复制结果': 'Copy Result',
    '下载 JSON': 'Download JSON',
    '示例': 'Sample',
    '清空': 'Clear',
    '全屏': 'Fullscreen',
    '格式化结果': 'Formatted Result',
    '选择输出模式': 'Select output mode',
    '树形查看': 'Tree View',
    '转 YAML': 'To YAML',
    '转 XML': 'To XML',
    '转 TypeScript': 'To TypeScript',
    '转 Go Struct': 'To Go Struct',
    '等待输入 JSON 数据。': 'Waiting for JSON input.',
    '0 字符': '0 characters',
    '大小：0 B': 'Size: 0 B',
    '行数：0': 'Lines: 0',
    '层级：0': 'Depth: 0',
    '键数：0': 'Keys: 0',
    '在线 JSON 美化、压缩、校验工具': 'Online JSON Formatting, Minification and Validation',
    '这个 JSON 工具适合接口调试、日志排查、配置文件整理和数据结构查看。输入内容不会上传到服务器，所有解析、转换和复制操作都在当前浏览器内完成。': 'Use this JSON tool for API debugging, log analysis, configuration cleanup and data-structure inspection. Input is never uploaded; parsing, conversion and copying happen entirely in your browser.',
    'JSON 转多语言实体': 'JSON to Language Types',
    'JSON/代码对比': 'JSON / Code Diff',
    '类名/结构体名（可选）': 'Class or struct name (optional)',
    '例如：User、Product，留空使用 Root': 'For example: User or Product; leave blank to use Root',
    '包名/命名空间（可选，仅 Java/C#）': 'Package or namespace (optional, Java/C# only)',
    '例如：com.example.model': 'For example: com.example.model',
    'Java实体': 'Java Class',
    'C#实体': 'C# Class',
    'Ruby类': 'Ruby Class',
    '转换结果': 'Conversion Result',
    '自动识别字符串、数字、布尔、数组和嵌套对象。生成结果建议结合项目规范再做命名和类型调整。': 'Strings, numbers, booleans, arrays and nested objects are detected automatically. Review generated names and types against your project conventions.',
    '支持复杂 JSON 结构转换，所有生成过程均在当前浏览器内完成。': 'Complex JSON structures are supported, and all generation happens in your browser.',
    '在线 JSON 转实体类和结构体': 'Convert JSON to Classes and Structs Online',
    'JSON 转换工具可以快速把接口响应、配置样例和调试数据转换成常见语言的数据结构，减少手写字段和类型声明的重复工作。': 'Convert API responses, configuration samples and debug data into common language types without repeatedly writing fields and type declarations by hand.',
    '压缩设置': 'Compression Settings',
    '选择图片': 'Choose Image',
    '点击选择或拖入图片': 'Click to choose or drop an image',
    '支持 JPEG、PNG、WebP、AVIF，建议单张处理。': 'Supports JPEG, PNG, WebP and AVIF. Process one image at a time.',
    '输出格式': 'Output Format',
    '最大宽度': 'Maximum Width',
    '最大高度': 'Maximum Height',
    '可选': 'Optional',
    '压缩质量：': 'Compression quality: ',
    '压缩图片': 'Compress Image',
    '下载结果': 'Download Result',
    '重置': 'Reset',
    '等待选择图片。': 'Waiting for an image.',
    '压缩结果': 'Compression Result',
    '原始大小': 'Original Size',
    '压缩后': 'Compressed',
    '节省比例': 'Space Saved',
    '输出尺寸': 'Output Dimensions',
    '原图预览': 'Original Preview',
    '选择图片后显示原图。': 'The original image will appear after selection.',
    '压缩预览': 'Compressed Preview',
    '压缩后显示结果。': 'The compressed result will appear here.',
    'JPEG/WebP 会按质量重新编码；PNG 主要通过缩放尺寸减小体积。转换为 JPEG 时透明区域会使用白色背景。': 'JPEG and WebP are re-encoded at the selected quality. PNG size is mainly reduced by resizing. Transparent areas use a white background when converting to JPEG.',
    '在线图片压缩': 'Compress Images Online',
    '图片压缩工具适合把手机照片、博客配图和上传前素材快速变小。处理过程使用浏览器内置 Canvas 完成，图片不会离开当前设备。': 'Quickly reduce mobile photos, blog images and upload assets. Processing uses the browser Canvas API, so images never leave your device.',
    '转换设置': 'Conversion Settings',
    '支持 JPEG、PNG、WebP、AVIF，转换结果可直接下载。': 'Supports JPEG, PNG, WebP and AVIF. Download the converted result directly.',
    '目标格式': 'Target Format',
    '输出质量：': 'Output quality: ',
    '转换格式': 'Convert Format',
    '原始格式': 'Original Format',
    '目标格式': 'Target Format',
    '转换后': 'Converted',
    '尺寸': 'Dimensions',
    '转换预览': 'Converted Preview',
    '转换后显示结果。': 'The converted result will appear here.',
    '转换为 JPEG 时透明区域会使用白色背景；PNG 输出不使用质量参数，JPEG 和 WebP 会按质量重新编码。': 'Transparent areas use a white background when converting to JPEG. PNG ignores the quality setting, while JPEG and WebP are re-encoded at the selected quality.',
    '在线图片格式转换': 'Convert Image Formats Online',
    '图片格式转换工具使用浏览器 Canvas 完成本地解码和重新编码，适合把透明 PNG 转为 JPG、把照片转为 WebP，或临时调整图片格式以适配上传限制。': 'This tool decodes and re-encodes images locally with the browser Canvas API. Convert transparent PNG files to JPEG, photos to WebP, or adapt an image to upload restrictions.',
    'GIF 设置': 'GIF Settings',
    '点击选择或拖入多张图片': 'Click to choose or drop multiple images',
    '支持 JPEG、PNG、WebP、AVIF，至少选择两张图片。': 'Supports JPEG, PNG, WebP and AVIF. Select at least two images.',
    '每帧停留': 'Frame Duration',
    '1 秒': '1 second',
    '2 秒': '2 seconds',
    '自定义': 'Custom',
    '自定义每帧停留时间（毫秒）': 'Custom frame duration in milliseconds',
    '首帧尺寸': 'First-frame size',
    '长边 1280 px': 'Long edge 1280 px',
    '长边 1024 px': 'Long edge 1024 px',
    '长边 768 px': 'Long edge 768 px',
    '长边 512 px': 'Long edge 512 px',
    '编码质量': 'Encoding Quality',
    '高质量（较慢）': 'High quality (slower)',
    '均衡': 'Balanced',
    '较小文件': 'Smaller file',
    '循环播放': 'Loop animation',
    '生成 GIF': 'Create GIF',
    '下载 GIF': 'Download GIF',
    '至少选择两张图片后即可生成。': 'Select at least two images to create a GIF.',
    '帧序列': 'Frame Sequence',
    '图片数量': 'Image Count',
    'GIF 大小': 'GIF Size',
    '选择图片后会按此处顺序播放。可使用每一帧上的按钮调整顺序或移除图片。': 'Images play in the order shown here. Use each frame’s controls to reorder or remove it.',
    'GIF 预览': 'GIF Preview',
    '生成后显示 GIF 预览。': 'The GIF preview will appear after generation.',
    '在线制作 GIF 动图': 'Create an Animated GIF Online',
    '图片会在当前浏览器中解码、绘制和编码，不会发送到服务器。为获得更稳定的生成速度，建议使用尺寸接近的图片；较大的图片或大量帧会占用更多本机 CPU 和内存。': 'Images are decoded, drawn and encoded in your browser and are never sent to a server. For stable performance, use similarly sized images; large images or many frames require more CPU and memory.',
    '输入颜色': 'Input Color',
    '#1677ff 或 rgb(22, 119, 255) 或 hsl(215, 100%, 54%)': '#1677ff, rgb(22, 119, 255), or hsl(215, 100%, 54%)',
    '转换': 'Convert',
    '等待输入颜色。': 'Waiting for a color value.',
    '输入 User-Agent': 'Input User-Agent',
    '粘贴 User-Agent 字符串...': 'Paste a User-Agent string...',
    '解析': 'Parse',
    '使用当前浏览器 UA': 'Use Current Browser UA',
    '解析结果': 'Parsed Result',
    '等待输入 User-Agent。': 'Waiting for a User-Agent string.',
    '代码语言': 'Code Language',
    '纯文本': 'Plain Text',
    '忽略空白': 'Ignore whitespace',
    '忽略大小写': 'Ignore case',
    '同步滚动': 'Sync scrolling',
    '开始对比': 'Compare',
    '新增': 'Added',
    '删除': 'Removed',
    '修改': 'Changed',
    '相同': 'Unchanged',
    '原始代码': 'Original Code',
    '对比代码': 'Compared Code',
    '复制': 'Copy',
    '上传文件': 'Upload file',
    '上传': 'Upload',
    '在此输入或粘贴原始代码...': 'Enter or paste the original code here...',
    '在此输入或粘贴要对比的代码...': 'Enter or paste the code to compare here...',
    '双击对比结果区域可回到编辑状态。所有对比过程均在当前浏览器内完成。': 'Double-click a diff result to return to editing. All comparisons happen locally in your browser.',
    '在线代码差异对比和文本 Diff': 'Compare Code and Text Differences Online',
    '代码对比工具适合比较接口返回、配置文件、脚本片段和普通文本差异。输入内容不会上传服务器，文件读取和差异计算都在本地浏览器完成。': 'Compare API responses, configuration files, scripts and plain text. Input is never uploaded; file reading and diff calculation happen locally in your browser.',
    '输入 Markdown 后自动预览。': 'The preview updates as you type Markdown.',
    '复制 HTML': 'Copy HTML',
    '输入 Markdown 内容...': 'Enter Markdown content...',
    '预览': 'Preview',
    '输入文本': 'Input Text',
    '每行一条内容...': 'One item per line...',
    '前缀': 'Prefix',
    '后缀': 'Suffix',
    '分隔符': 'Separator',
    '换行': 'New Line',
    '逗号': 'Comma',
    '逗号+空格': 'Comma + space',
    '空格': 'Space',
    '自定义分隔符': 'Custom separator',
    '去除首尾空格': 'Trim whitespace',
    '去除空行': 'Remove empty lines',
    '包裹单引号': 'Wrap in single quotes',
    '处理': 'Process',
    '处理结果': 'Processed Result',
    '结果放回输入': 'Move Result to Input',
    '等待输入文本。': 'Waiting for text input.',
    '输入 IP': 'Input IP Address',
    '例如：192.168.1.1 或 2001:db8::1': 'For example: 192.168.1.1 or 2001:db8::1',
    '查询': 'Analyze',
    '公网 IPv4': 'Public IPv4',
    '私有 IPv4': 'Private IPv4',
    'IPv6 回环': 'IPv6 Loopback',
    '查询结果': 'Analysis Result',
    '等待输入 IP 地址。': 'Waiting for an IP address.',
    '本工具不联网查询地理位置，只做本地格式和地址类型判断。': 'This tool does not query geolocation. It only validates formats and address types locally.'
};

function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function cleanPath(file, language = 'zh') {
    const slug = file.replace(/\.html$/, '');
    return language === 'en' ? `/en/${slug}` : `/${slug}`;
}

function publicUrl(file, language = 'zh') {
    return `${baseUrl}${cleanPath(file, language)}`;
}

function seoBlock(file, config, language) {
    const isEnglish = language === 'en';
    const canonical = publicUrl(file, language);
    const zhUrl = publicUrl(file, 'zh');
    const enUrl = publicUrl(file, 'en');
    const title = isEnglish ? config.enTitle : config.zhTitle;
    const description = isEnglish ? config.enDescription : config.zhDescription;
    const locale = isEnglish ? 'en_US' : 'zh_CN';
    const alternateLocale = isEnglish ? 'zh_CN' : 'en_US';
    const inLanguage = isEnglish ? 'en' : 'zh-CN';
    const name = isEnglish ? config.enH1 : config.zhH1;
    const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        url: canonical,
        description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript and a modern web browser',
        inLanguage,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    }, null, 2);

    return `    <link rel="canonical" href="${canonical}">\n` +
        `    <link rel="alternate" hreflang="zh-CN" href="${zhUrl}">\n` +
        `    <link rel="alternate" hreflang="en" href="${enUrl}">\n` +
        `    <link rel="alternate" hreflang="x-default" href="${baseUrl}/">\n` +
        `    <meta property="og:type" content="website">\n` +
        `    <meta property="og:site_name" content="DevMiniTools">\n` +
        `    <meta property="og:locale" content="${locale}">\n` +
        `    <meta property="og:locale:alternate" content="${alternateLocale}">\n` +
        `    <meta property="og:title" content="${escapeHtml(title)}">\n` +
        `    <meta property="og:description" content="${escapeHtml(description)}">\n` +
        `    <meta property="og:url" content="${canonical}">\n` +
        `    <meta name="twitter:card" content="summary">\n` +
        `    <meta name="twitter:title" content="${escapeHtml(title)}">\n` +
        `    <meta name="twitter:description" content="${escapeHtml(description)}">\n` +
        `    <script type="application/ld+json">\n${schema.split('\n').map(line => `    ${line}`).join('\n')}\n    </script>`;
}

function removeGeneratedSeo(html) {
    return html
        .replace(/\s*<meta\s+name="keywords"[^>]*>/gi, '')
        .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
        .replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>/gi, '')
        .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>/gi, '')
        .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
        .replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}

function addSeo(html, file, config, language) {
    const title = language === 'en' ? config.enTitle : config.zhTitle;
    const description = language === 'en' ? config.enDescription : config.zhDescription;
    html = removeGeneratedSeo(html)
        .replace(/<html\s+lang="[^"]+">/, `<html lang="${language === 'en' ? 'en' : 'zh-CN'}">`)
        .replace(/<meta\s+name="description"\s+content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
    return html.replace(/(<title>[\s\S]*?<\/title>)/, `$1\n${seoBlock(file, config, language)}`);
}

function addPageTitle(html, title) {
    html = html.replace(/\s*<h1\s+class="page-title">[\s\S]*?<\/h1>/, '');
    return html.replace(/(<main\s+class="tool-shell">)/, `$1\n        <h1 class="page-title">${title}</h1>`);
}

function addLanguageSwitch(html, file, language) {
    html = html.replace(/\s*<div\s+class="language-switch"[\s\S]*?<\/div>/, '');
    const switcher = language === 'en'
        ? `<div class="language-switch" aria-label="Language selection"><a href="../${file}" lang="zh-CN" hreflang="zh-CN">中文</a><span aria-current="page">EN</span></div>`
        : `<div class="language-switch" aria-label="语言选择"><span aria-current="page">中文</span><a href="en/${file}" lang="en" hreflang="en">EN</a></div>`;
    return html.replace(/(<span\s+class="header-note">)/, `${switcher}\n        $1`);
}

function translateHtml(html) {
    const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
    for (const [source, target] of entries) {
        html = html.split(source).join(target);
    }
    return html;
}

function adjustEnglishPaths(html, file) {
    const pageNames = new Set([...Object.keys(pages), 'index.html']);
    html = html.replace(/(href|src)="([^"]+)"/g, (match, attribute, target) => {
        if (/^(?:https?:|mailto:|#|data:)/.test(target)) return match;
        const [path, suffix = ''] = target.split(/(?=[?#])/);
        if (pageNames.has(path)) return `${attribute}="${path}${suffix}"`;
        if (path.startsWith('../')) return match;
        return `${attribute}="../${target}"`;
    });
    html = html.replace(/<script\s+src="\.\.\/js\/i18n\.js"><\/script>\s*/g, '');
    return html.replace(/(<script\s+src="\.\.\/(?:vendor|js)\/)/, `<script src="../js/i18n.js"></script>\n    $1`);
}

function assertEnglish(file, html) {
    const withoutSchemaOrComments = html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    const matches = [...withoutSchemaOrComments.matchAll(/[\u3400-\u9fff]+/g)].map(match => match[0]);
    const allowed = new Set(['中文']);
    const unexpected = [...new Set(matches.filter(value => !allowed.has(value)))];
    if (unexpected.length) {
        throw new Error(`${file}: untranslated Chinese text: ${unexpected.join(', ')}`);
    }
}

mkdirSync(join(root, 'en'), { recursive: true });

for (const [file, config] of Object.entries(pages)) {
    const sourcePath = join(root, file);
    let chinese = readFileSync(sourcePath, 'utf8');
    chinese = chinese.replaceAll('https://github.com/devminitools', 'https://github.com/faymanwang/devminitools');
    chinese = addSeo(chinese, file, config, 'zh');
    chinese = addPageTitle(chinese, config.zhH1);
    chinese = addLanguageSwitch(chinese, file, 'zh');
    writeFileSync(sourcePath, chinese, 'utf8');

    let english = translateHtml(chinese);
    english = addSeo(english, file, config, 'en');
    english = addPageTitle(english, config.enH1);
    english = addLanguageSwitch(english, file, 'en');
    english = adjustEnglishPaths(english, file);
    assertEnglish(file, english);
    writeFileSync(join(root, 'en', file), english, 'utf8');
}

const englishCards = Object.entries(pages).map(([file, config]) => `            <a class="tool-card" href="${file}"><span class="tool-badge">Free</span><h3>${config.enH1}</h3><p>${config.enDescription}</p></a>`).join('\n');
const englishIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Explore DevMiniTools browser-based JSON, image, code, text and developer utilities in English.">
    <title>DevMiniTools English Developer Tools</title>
    <link rel="canonical" href="${baseUrl}/en/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="DevMiniTools">
    <meta property="og:title" content="DevMiniTools English Developer Tools">
    <meta property="og:description" content="Free browser-based developer tools with local data processing.">
    <meta property="og:url" content="${baseUrl}/en/">
    <meta name="twitter:card" content="summary">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="home-page">
    <header class="site-header"><a href="../index.html" class="brand" aria-label="DevMiniTools home"><span class="brand-dev">Dev</span><span class="brand-name">MiniTools</span></a><div class="language-switch" aria-label="Language selection"><a href="../index.html" lang="zh-CN">中文</a><span aria-current="page">EN</span></div></header>
    <main class="home-shell">
        <section class="hero-panel"><div><p class="eyebrow">Free · Private · Browser-based</p><h1>English Developer Tools</h1><p class="hero-desc">Use JSON, image, code and text utilities without uploading your data.</p></div><a class="language-choice" href="../index.html" lang="zh-CN">访问中文入口</a></section>
        <section class="section-block"><div class="section-heading"><div><h2>All tools</h2><p>Choose a tool to get started.</p></div></div><div class="tool-grid home-tool-grid">${englishCards}</div></section>
    </main>
    <footer class="site-footer"><div><strong>DevMiniTools</strong><p>Free developer tools that run in your browser.</p></div><div class="footer-links"><a href="https://github.com/faymanwang/devminitools" target="_blank" rel="noopener">GitHub</a></div></footer>
</body>
</html>
`;
writeFileSync(join(root, 'en', 'index.html'), englishIndex, 'utf8');

const rootIndex = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="DevMiniTools 免费开发者在线工具箱，提供中文与 English JSON、图片、代码和文本工具，数据仅在浏览器本地处理。">
    <title>DevMiniTools 开发者工具 / Developer Tools</title>
    <link rel="canonical" href="${baseUrl}/">
    <link rel="alternate" hreflang="zh-CN" href="${publicUrl('json-format.html', 'zh')}">
    <link rel="alternate" hreflang="en" href="${baseUrl}/en/">
    <link rel="alternate" hreflang="x-default" href="${baseUrl}/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="DevMiniTools">
    <meta property="og:title" content="DevMiniTools 开发者工具 / Developer Tools">
    <meta property="og:description" content="Free browser-based developer tools in Chinese and English.">
    <meta property="og:url" content="${baseUrl}/">
    <meta name="twitter:card" content="summary">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"DevMiniTools","url":"${baseUrl}/","inLanguage":["zh-CN","en"]}</script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="home-page">
    <header class="site-header"><a href="index.html" class="brand" aria-label="DevMiniTools 首页"><span class="brand-dev">Dev</span><span class="brand-name">MiniTools</span></a></header>
    <main class="home-shell">
        <section class="hero-panel language-hero"><div><p class="eyebrow">Free · Private · Browser-based</p><h1>开发者工具 / Developer Tools</h1><p class="hero-desc">选择语言开始使用。Choose your language to get started.</p></div><div class="language-options"><a class="language-choice" href="json-format.html" lang="zh-CN"><strong>中文工具</strong><span>进入中文版 JSON、图片、代码与文本工具</span></a><a class="language-choice" href="en/index.html" lang="en"><strong>English Tools</strong><span>Open the English developer tool collection</span></a></div></section>
        <section class="section-block"><div class="section-heading"><div><h2>热门工具 / Popular tools</h2><p>所有处理均在浏览器本地完成。</p></div></div><div class="tool-grid language-tool-grid"><a class="tool-card" href="json-format.html"><span class="tool-badge">中文</span><h3>JSON 格式化</h3><p>美化、压缩、校验和转换 JSON。</p></a><a class="tool-card" href="en/json-format.html"><span class="tool-badge">EN</span><h3>JSON Formatter</h3><p>Format, minify, validate and convert JSON.</p></a><a class="tool-card" href="image-compress.html"><span class="tool-badge">中文</span><h3>图片压缩</h3><p>在浏览器中压缩常见图片格式。</p></a><a class="tool-card" href="en/image-compress.html"><span class="tool-badge">EN</span><h3>Image Compressor</h3><p>Compress common image formats locally.</p></a></div></section>
    </main>
    <footer class="site-footer"><div><strong>DevMiniTools</strong><p>数据仅在浏览器本地处理 · Data stays in your browser.</p></div><div class="footer-links"><a href="https://github.com/faymanwang/devminitools" target="_blank" rel="noopener">GitHub</a></div></footer>
</body>
</html>
`;
writeFileSync(join(root, 'index.html'), rootIndex, 'utf8');

const sitemapEntries = Object.keys(pages).flatMap(file => {
    const zhUrl = publicUrl(file, 'zh');
    const enUrl = publicUrl(file, 'en');
    return [
        { loc: zhUrl, zhUrl, enUrl },
        { loc: enUrl, zhUrl, enUrl }
    ];
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n  <url>\n    <loc>${baseUrl}/</loc>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />\n    <lastmod>${lastModified}</lastmod>\n  </url>\n  <url>\n    <loc>${baseUrl}/en/</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>\n${sitemapEntries.map(entry => `  <url>\n    <loc>${entry.loc}</loc>\n    <xhtml:link rel="alternate" hreflang="zh-CN" href="${entry.zhUrl}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${entry.enUrl}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />\n    <lastmod>${lastModified}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(root, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${Object.keys(pages).length} English tool pages and bilingual SEO metadata.`);
