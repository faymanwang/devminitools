(function (root) {
    'use strict';
    function parseJson(text, english) {
        const parsed = JSON.parse(text);
        const numbers = text.replace(/"(?:\\.|[^"\\])*"/g, '""').match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g) || [];
        if (numbers.some(token => !Number.isFinite(Number(token)) || (Number.isInteger(Number(token)) && !Number.isSafeInteger(Number(token))))) {
            throw new Error(english
                ? 'Number exceeds the safe precision range. Keep large identifiers in quotes; arbitrary-precision numbers are not supported.'
                : '数值超出安全精度范围。请将大整数标识写成字符串；此工具不支持任意精度数值。');
        }
        return parsed;
    }
    function dimensions(width, height, maxWidth, maxHeight, english) {
        const w = maxWidth === '' ? width : Number(maxWidth);
        const h = maxHeight === '' ? height : Number(maxHeight);
        if (![w, h].every(n => Number.isInteger(n) && n > 0)) {
            throw new Error(english ? 'Maximum dimensions must be positive integers or blank.' : '最大宽高必须为正整数或留空。');
        }
        const ratio = Math.min(1, w / width, h / height);
        return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) };
    }
    function imageBlob(canvas, mime, quality, english) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob && blob.type === mime) resolve(blob);
                else reject(new Error(english ? 'This browser cannot export the requested image format.' : '当前浏览器无法导出请求的图片格式。'));
            }, mime, quality);
        });
    }
    const api = { parseJson, dimensions, imageBlob };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.DevMiniToolsSafety = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
