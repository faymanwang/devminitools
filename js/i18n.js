(function() {
    'use strict';

    if (document.documentElement.lang !== 'en') {
        return;
    }

    const exact = {
        '请输入JSON数据': 'Please enter JSON data',
        '请输入JSON数据！': 'Please enter JSON data.',
        '压缩成功，已移除多余空白字符。': 'JSON minified successfully. Extra whitespace was removed.',
        'JSON 校验通过。': 'JSON is valid.',
        '格式化成功。': 'JSON formatted successfully.',
        '请输入要转义的文本。': 'Enter text to escape.',
        '转义完成。': 'Text escaped successfully.',
        '请输入要去转义的字符串。': 'Enter a JSON string to unescape.',
        '去转义输入必须是 JSON 字符串': 'The input must be a JSON string',
        '去转义完成。': 'String unescaped successfully.',
        '没有可复制的内容。': 'There is no content to copy.',
        '结果已复制到剪贴板。': 'Result copied to the clipboard.',
        '没有可下载的内容。': 'There is no content to download.',
        '文件已生成下载。': 'The download is ready.',
        '等待输入 JSON 数据。': 'Waiting for JSON input.',
        '退出全屏': 'Exit Fullscreen',
        '全屏': 'Fullscreen',
        'HEX 颜色格式不正确': 'Invalid HEX color format',
        'RGB 颜色格式不正确': 'Invalid RGB color format',
        'HSL 颜色格式不正确': 'Invalid HSL color format',
        '请输入颜色值': 'Enter a color value',
        '仅支持 HEX、RGB 和 HSL 颜色格式': 'Only HEX, RGB and HSL color formats are supported',
        '颜色转换完成。': 'Color converted successfully.',
        '已载入示例。': 'Sample loaded.',
        '等待输入颜色。': 'Waiting for a color value.',
        '没有可复制的结果。': 'There is no result to copy.',
        '结果已复制。': 'Result copied.',
        '图片读取失败，请换一张图片重试。': 'The image could not be read. Try another image.',
        '当前浏览器无法导出该图片格式。': 'This browser cannot export the selected image format.',
        '请选择 JPEG、PNG、WebP 或 AVIF 图片。': 'Choose a JPEG, PNG, WebP or AVIF image.',
        '请先选择一张图片。': 'Choose an image first.',
        '正在压缩图片...': 'Compressing image...',
        '压缩完成，可以预览或下载结果。': 'Compression complete. Preview or download the result.',
        '图片压缩失败，请换一张图片重试。': 'Image compression failed. Try another image.',
        '还没有可下载的压缩结果。': 'There is no compressed result to download.',
        '压缩后显示结果。': 'The compressed result will appear here.',
        '选择图片后显示原图。': 'The original image will appear after selection.',
        '等待选择图片。': 'Waiting for an image.',
        '原图预览': 'Original preview',
        '压缩图片预览': 'Compressed image preview',
        'PNG无质量参数': 'PNG has no quality setting',
        '正在转换图片格式...': 'Converting image format...',
        '格式转换完成，可以预览或下载结果。': 'Conversion complete. Preview or download the result.',
        '图片格式转换失败，请换一张图片重试。': 'Image conversion failed. Try another image.',
        '还没有可下载的转换结果。': 'There is no converted result to download.',
        '转换后显示结果。': 'The converted result will appear here.',
        '转换图片预览': 'Converted image preview',
        '自定义每帧停留时间请输入 10 到 60000 ms 的整数。': 'Enter a whole-number frame duration from 10 to 60000 ms.',
        '生成后显示 GIF 预览。': 'The GIF preview will appear after generation.',
        '选择图片后会按此处顺序播放。可使用每一帧上的按钮调整顺序或移除图片。': 'Images play in the order shown here. Use each frame’s controls to reorder or remove it.',
        '至少选择两张图片后即可生成。': 'Select at least two images to create a GIF.',
        '有图片无法读取，请移除后重试。': 'An image could not be read. Remove it and try again.',
        'GIF 编码器未准备好，请刷新页面后重试。': 'The GIF encoder is not ready. Refresh the page and try again.',
        '正在读取图片并编码 GIF，请保持页面开启...': 'Reading images and encoding the GIF. Keep this page open...',
        'GIF 已生成，可以预览或下载。': 'GIF created. Preview or download it.',
        'GIF 生成失败，请减少图片数量或输出尺寸后重试。': 'GIF generation failed. Reduce the image count or output size and try again.',
        '生成的 GIF 预览': 'Generated GIF preview',
        '上移': 'Move up',
        '下移': 'Move down',
        '移除': 'Remove',
        '请输入 IP 地址。': 'Enter an IP address.',
        'IPv4 地址解析完成。': 'IPv4 address parsed successfully.',
        'IPv6 地址解析完成。': 'IPv6 address parsed successfully.',
        '错误：不是有效的 IPv4 或 IPv6 地址。': 'Error: not a valid IPv4 or IPv6 address.',
        '等待输入 IP 地址。': 'Waiting for an IP address.',
        '版本': 'Version',
        '标准格式': 'Normalized Address',
        '地址类型': 'Address Type',
        '十进制': 'Decimal',
        '十六进制': 'Hexadecimal',
        '二进制': 'Binary',
        '输入地址': 'Input Address',
        '包含压缩': 'Uses Compression',
        '是': 'Yes',
        '否': 'No',
        '私有地址 10.0.0.0/8': 'Private address 10.0.0.0/8',
        '私有地址 172.16.0.0/12': 'Private address 172.16.0.0/12',
        '私有地址 192.168.0.0/16': 'Private address 192.168.0.0/16',
        '回环地址 127.0.0.0/8': 'Loopback address 127.0.0.0/8',
        '链路本地地址 169.254.0.0/16': 'Link-local address 169.254.0.0/16',
        '多播地址 224.0.0.0/4': 'Multicast address 224.0.0.0/4',
        '本网络地址 0.0.0.0/8': 'Current-network address 0.0.0.0/8',
        '保留地址 240.0.0.0/4': 'Reserved address 240.0.0.0/4',
        '公网地址或可路由地址': 'Public or routable address',
        '回环地址 ::1': 'Loopback address ::1',
        '未指定地址 ::': 'Unspecified address ::',
        '链路本地地址 fe80::/10': 'Link-local address fe80::/10',
        '唯一本地地址 fc00::/7': 'Unique-local address fc00::/7',
        '多播地址 ff00::/8': 'Multicast address ff00::/8',
        '文档示例地址 2001:db8::/32': 'Documentation address 2001:db8::/32',
        '请输入要处理的文本': 'Enter text to process',
        '等待输入文本。': 'Waiting for text input.',
        '没有可复制的内容。': 'There is no content to copy.',
        '结果已放回输入框。': 'The result was moved back to the input.',
        '预览区域': 'Preview area',
        '预览已更新。': 'Preview updated.',
        '输入 Markdown 后自动预览。': 'The preview updates as you type Markdown.',
        '没有可复制的 HTML。': 'There is no HTML to copy.',
        'HTML 已复制。': 'HTML copied.',
        '未知浏览器': 'Unknown browser',
        '未知系统': 'Unknown operating system',
        '机器人/爬虫': 'Bot / crawler',
        '平板': 'Tablet',
        '手机': 'Mobile phone',
        '桌面设备': 'Desktop device',
        '未知引擎': 'Unknown engine',
        '请输入 User-Agent。': 'Enter a User-Agent string.',
        '浏览器': 'Browser',
        '浏览器版本': 'Browser Version',
        '操作系统': 'Operating System',
        '设备类型': 'Device Type',
        '渲染引擎': 'Rendering Engine',
        '是否移动端': 'Mobile Device',
        '原始长度': 'Original Length',
        'User-Agent 解析完成。': 'User-Agent parsed successfully.',
        '等待输入 User-Agent。': 'Waiting for a User-Agent string.',
        '没有可复制的内容！': 'There is no content to copy.',
        '请输入要对比的代码！': 'Enter code to compare.',
        '参数必须是数字': 'The parameter must be numeric',
        'JSON解析失败：': 'JSON parsing failed: ',
        '错误：': 'Error: ',
        '已复制到剪贴板！': 'Copied to the clipboard.',
        '复制失败，请手动选择文本复制': 'Copy failed. Select and copy the text manually.',
        '复制失败：': 'Copy failed: '
    };

    const replacements = [
        [/^已选择 (.+)，可以开始压缩。$/, 'Selected $1. Ready to compress.'],
        [/^已选择 (.+)，可以开始转换。$/, 'Selected $1. Ready to convert.'],
        [/^已添加 (\d+) 张图片，请确认播放顺序后生成 GIF。$/, 'Added $1 images. Confirm the frame order, then create the GIF.'],
        [/^正在编码 GIF：(\d+)%$/, 'Encoding GIF: $1%'],
        [/^增大 (.+)$/, 'Increased by $1'],
        [/^处理完成，共 (\d+) 行。$/, 'Processed $1 lines.'],
        [/^(\d+) 字符$/, '$1 characters'],
        [/^大小：(.+)$/, 'Size: $1'],
        [/^行数：(\d+)$/, 'Lines: $1'],
        [/^层级：(\d+)$/, 'Depth: $1'],
        [/^键数：(\d+)$/, 'Keys: $1'],
        [/^(.+)（第 (\d+) 行，第 (\d+) 列）$/, '$1 (line $2, column $3)'],
        [/^第 (\d+) 帧预览$/, 'Frame $1 preview'],
        [/^第 (\d+) 帧$/, 'Frame $1'],
        [/^上移第 (\d+) 帧$/, 'Move frame $1 up'],
        [/^下移第 (\d+) 帧$/, 'Move frame $1 down'],
        [/^移除第 (\d+) 帧$/, 'Remove frame $1']
    ];

    const sampleReplacements = {
        'devminitools 在线工具箱': 'DevMiniTools online toolbox',
        'JSON格式化': 'JSON formatting',
        'JSON压缩': 'JSON minification',
        'JSON转YAML': 'JSON to YAML',
        'JSON转TypeScript': 'JSON to TypeScript',
        'JSON转Go Struct': 'JSON to Go Struct',
        '张三': 'Alex Chen',
        '北京': 'London',
        '朝阳区': 'Camden',
        '建国路88号': '88 High Street',
        '阅读': 'Reading',
        '旅游': 'Travel',
        '摄影': 'Photography',
        '程序员': 'Developer',
        'Java开发者': 'Java developer',
        '开发者在线工具箱': 'Developer toolbox',
        '打开即用': 'ready to use',
        '时间戳转换': 'Timestamp conversion',
        '数据仅在浏览器本地处理': 'Data is processed locally in your browser',
        '工具': 'Tool',
        '状态': 'Status',
        '可用': 'Available'
    };

    function translate(text) {
        if (!text || !/[\u3400-\u9fff]/.test(text)) return text;
        const leading = text.match(/^\s*/)?.[0] || '';
        const trailing = text.match(/\s*$/)?.[0] || '';
        const value = text.trim();
        if (exact[value]) return `${leading}${exact[value]}${trailing}`;
        for (const [pattern, replacement] of replacements) {
            if (pattern.test(value)) return `${leading}${value.replace(pattern, replacement)}${trailing}`;
        }
        let result = value;
        for (const [source, target] of Object.entries(exact).sort((a, b) => b[0].length - a[0].length)) {
            result = result.split(source).join(target);
        }
        return `${leading}${result}${trailing}`;
    }

    function translateElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            const translated = translate(element.nodeValue);
            if (translated !== element.nodeValue) {
                element.nodeValue = translated;
            }
            return;
        }
        if (!(element instanceof Element)) return;
        for (const attribute of ['title', 'aria-label', 'alt', 'placeholder']) {
            if (element.hasAttribute(attribute)) {
                const current = element.getAttribute(attribute);
                const translated = translate(current);
                if (translated !== current) {
                    element.setAttribute(attribute, translated);
                }
            }
        }
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
            const translated = translate(node.nodeValue);
            if (translated !== node.nodeValue) {
                node.nodeValue = translated;
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'characterData') translateElement(mutation.target);
            mutation.addedNodes.forEach(translateElement);
        }
    });

    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });

    const originalAlert = window.alert.bind(window);
    window.alert = message => originalAlert(translate(String(message)));

    document.addEventListener('DOMContentLoaded', () => translateElement(document.body));
    document.addEventListener('click', event => {
        const id = event.target.closest('button')?.id || '';
        if (!/(sample|current-ua)/.test(id)) return;
        requestAnimationFrame(() => {
            document.querySelectorAll('textarea, input[type="text"]').forEach(control => {
                let value = control.value;
                for (const [source, target] of Object.entries(sampleReplacements)) {
                    value = value.split(source).join(target);
                }
                control.value = value;
            });
        });
    }, true);

    window.DevMiniToolsI18n = { translate };
})();
