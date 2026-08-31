// JSON格式化工具脚本
document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const outputPre = document.getElementById('output-pre');
    const outputMode = document.getElementById('output-mode');
    const formatBtn = document.getElementById('format-btn');
    const compressBtn = document.getElementById('compress-btn');
    const outputCompressBtn = document.getElementById('output-compress-btn');
    const outputFormatBtn = document.getElementById('output-format-btn');
    const outputCopyBtn = document.getElementById('output-copy-btn');
    const escapeBtn = document.getElementById('escape-btn');
    const unescapeBtn = document.getElementById('unescape-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const message = document.getElementById('json-message');
    const inputStats = document.getElementById('input-stats');
    const statSize = document.getElementById('stat-size');
    const statLines = document.getElementById('stat-lines');
    const statDepth = document.getElementById('stat-depth');
    const statKeys = document.getElementById('stat-keys');

    if (!jsonInput || !jsonOutput) {
        return;
    }

    let lastJson = null;
    let lastOutput = '';
    let autoFormatTimer = null;
    const isEnglish = document.documentElement.lang === 'en';

    function treeToggleLabel(expanded, path) {
        if (isEnglish) return `${expanded ? 'Collapse' : 'Expand'} ${path}`;
        return `${expanded ? '收起' : '展开'} ${path}`;
    }

    function parseInput() {
        const inputText = jsonInput.value.trim();
        if (!inputText) {
            throw new Error('请输入JSON数据');
        }
        return JSON.parse(inputText);
    }

    function setMessage(text, type) {
        message.textContent = text;
        message.className = `json-message ${type || ''}`.trim();
    }

    function setOutput(text, language) {
        lastOutput = text;
        jsonOutput.textContent = text;
        jsonOutput.className = language || 'json';

        if (typeof hljs !== 'undefined' && language !== 'json-error-output') {
            jsonOutput.removeAttribute('data-highlighted');
            hljs.highlightElement(jsonOutput);
        }
    }

    function isContainer(value) {
        return value !== null && typeof value === 'object';
    }

    function formatTreeValue(value) {
        if (value === null) return { text: 'null', type: 'null' };
        if (typeof value === 'string') return { text: JSON.stringify(value), type: 'string' };
        if (typeof value === 'number') return { text: String(value), type: 'number' };
        if (typeof value === 'boolean') return { text: String(value), type: 'boolean' };
        return { text: String(value), type: 'value' };
    }

    function renderJsonTree(value) {
        lastOutput = JSON.stringify(value, null, 2);
        jsonOutput.className = 'json-tree';
        jsonOutput.removeAttribute('data-highlighted');
        jsonOutput.replaceChildren(createTreeNode(value, null, true, 'root'));
    }

    function createTreeNode(value, key, expanded, path) {
        const row = document.createElement('span');
        row.className = 'json-tree-node';

        const line = document.createElement('span');
        line.className = 'json-tree-line';
        row.appendChild(line);

        if (isContainer(value)) {
            const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value);
            const opening = Array.isArray(value) ? '[' : '{';
            const closing = Array.isArray(value) ? ']' : '}';
            const typeName = Array.isArray(value) ? 'Array' : 'Object';
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'json-tree-toggle';
            toggle.setAttribute('aria-expanded', String(expanded));
            toggle.setAttribute('aria-label', treeToggleLabel(expanded, path));
            toggle.textContent = expanded ? '−' : '+';
            line.appendChild(toggle);

            appendTreeKey(line, key);

            const bracket = document.createElement('span');
            bracket.className = 'json-tree-bracket';
            bracket.textContent = opening;
            bracket.hidden = !expanded;
            line.appendChild(bracket);

            const summary = document.createElement('span');
            summary.className = 'json-tree-summary';
            summary.textContent = `${typeName}{…} · ${entries.length}`;
            summary.hidden = expanded;
            line.appendChild(summary);

            const children = document.createElement('span');
            children.className = 'json-tree-children';
            children.hidden = !expanded;
            entries.forEach(([childKey, childValue]) => {
                children.appendChild(createTreeNode(childValue, childKey, true, `${path}.${childKey}`));
            });
            row.appendChild(children);

            const closingLine = document.createElement('span');
            closingLine.className = 'json-tree-closing';
            closingLine.textContent = closing;
            closingLine.hidden = !expanded;
            row.appendChild(closingLine);

            toggle.addEventListener('click', () => {
                const nextExpanded = toggle.getAttribute('aria-expanded') !== 'true';
                toggle.setAttribute('aria-expanded', String(nextExpanded));
                toggle.setAttribute('aria-label', treeToggleLabel(nextExpanded, path));
                toggle.textContent = nextExpanded ? '−' : '+';
                children.hidden = !nextExpanded;
                closingLine.hidden = !nextExpanded;
                bracket.hidden = !nextExpanded;
                summary.hidden = nextExpanded;
            });
        } else {
            const spacer = document.createElement('span');
            spacer.className = 'json-tree-spacer';
            line.appendChild(spacer);
            appendTreeKey(line, key);
            const formatted = formatTreeValue(value);
            const primitive = document.createElement('span');
            primitive.className = `json-tree-${formatted.type}`;
            primitive.textContent = formatted.text;
            line.appendChild(primitive);
        }

        return row;
    }

    function appendTreeKey(parent, key) {
        if (key === null) return;
        const keyElement = document.createElement('span');
        keyElement.className = 'json-tree-key';
        keyElement.textContent = typeof key === 'number' ? `${key}: ` : `${JSON.stringify(String(key))}: `;
        parent.appendChild(keyElement);
    }

    function formatBytes(bytes) {
        if (bytes < 1024) {
            return `${bytes} B`;
        }
        return `${(bytes / 1024).toFixed(2)} KB`;
    }

    function getByteSize(text) {
        return new Blob([text]).size;
    }

    function getDepth(value) {
        if (value === null || typeof value !== 'object') {
            return 0;
        }
        const children = Array.isArray(value) ? value : Object.values(value);
        if (children.length === 0) {
            return 1;
        }
        return 1 + Math.max(...children.map(getDepth));
    }

    function countKeys(value) {
        if (value === null || typeof value !== 'object') {
            return 0;
        }
        if (Array.isArray(value)) {
            return value.reduce((sum, item) => sum + countKeys(item), 0);
        }
        return Object.keys(value).length + Object.values(value).reduce((sum, item) => sum + countKeys(item), 0);
    }

    function updateStats(value, sourceText) {
        inputStats.textContent = `${jsonInput.value.length} 字符`;
        statSize.textContent = `大小：${formatBytes(getByteSize(sourceText || jsonInput.value))}`;
        statLines.textContent = `行数：${jsonInput.value ? jsonInput.value.split('\n').length : 0}`;
        statDepth.textContent = `层级：${value ? getDepth(value) : 0}`;
        statKeys.textContent = `键数：${value ? countKeys(value) : 0}`;
    }

    function locateJsonError(error, source) {
        const match = /position\s+(\d+)/i.exec(error.message);
        if (!match) {
            return error.message;
        }

        const position = Number(match[1]);
        const before = source.slice(0, position);
        const line = before.split('\n').length;
        const column = before.length - before.lastIndexOf('\n');
        return `${error.message}（第 ${line} 行，第 ${column} 列）`;
    }

    function renderCurrent(mode) {
        if (lastJson === null) {
            return;
        }

        switch (mode) {
            case 'tree':
                renderJsonTree(lastJson);
                break;
            case 'yaml':
                setOutput(jsonToYaml(lastJson), 'yaml');
                break;
            case 'xml':
                setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(lastJson, 'root')}`, 'xml');
                break;
            case 'typescript':
                setOutput(jsonToTypeScript(lastJson), 'typescript');
                break;
            case 'go':
                setOutput(jsonToGoStruct(lastJson), 'go');
                break;
            default:
                renderJsonTree(lastJson);
        }
    }

    function handleJsonAction(action) {
        const inputText = jsonInput.value.trim();
        try {
            if (!inputText) {
                throw new Error('请输入JSON数据');
            }

            lastJson = JSON.parse(inputText);

            if (action === 'compress') {
                outputMode.value = 'json';
                setOutput(JSON.stringify(lastJson), 'json');
                setMessage('压缩成功，已移除多余空白字符。', 'success');
            } else {
                outputMode.value = 'json';
                renderJsonTree(lastJson);
                setMessage('格式化成功。', 'success');
            }

            updateStats(lastJson, inputText);
        } catch (error) {
            lastJson = null;
            const errorText = `错误：${locateJsonError(error, inputText)}`;
            setOutput(errorText, 'json-error-output');
            updateStats(null, inputText);
            setMessage(errorText, 'error');
        }
    }

    function escapeInput() {
        const text = jsonInput.value;
        if (!text) {
            setMessage('请输入要转义的文本。', 'error');
            return;
        }
        setOutput(JSON.stringify(text), 'json');
        setMessage('转义完成。', 'success');
    }

    function unescapeInput() {
        const text = jsonInput.value.trim();
        if (!text) {
            setMessage('请输入要去转义的字符串。', 'error');
            return;
        }

        try {
            const value = JSON.parse(text);
            if (typeof value !== 'string') {
                throw new Error('去转义输入必须是 JSON 字符串');
            }
            setOutput(value, 'plaintext');
            setMessage('去转义完成。', 'success');
        } catch (error) {
            setMessage(`错误：${error.message}`, 'error');
        }
    }

    function copyResult() {
        const text = lastOutput || jsonOutput.textContent;
        if (!text) {
            setMessage('没有可复制的内容。', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(function() {
            setMessage('结果已复制到剪贴板。', 'success');
        }).catch(function(err) {
            setMessage(`复制失败：${err}`, 'error');
        });
    }

    function downloadJson() {
        const text = lastOutput || jsonOutput.textContent;
        if (!text) {
            setMessage('没有可下载的内容。', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = outputMode.value === 'json' ? 'formatted.json' : `json-result.${outputMode.value}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setMessage('文件已生成下载。', 'success');
    }

    function loadSample() {
        const sample = {
            id: 1001,
            name: 'devminitools 在线工具箱',
            owner: {
                name: 'devminitools',
                github: 'devminitools'
            },
            features: ['JSON格式化', 'JSON压缩', 'JSON转YAML', 'JSON转TypeScript', 'JSON转Go Struct'],
            localOnly: true,
            links: {
                docs: 'https://www.devminitools.com',
                api: 'https://www.devminitools.com'
            }
        };
        jsonInput.value = JSON.stringify(sample, null, 2);
        handleJsonAction('format');
    }

    function clearAll() {
        jsonInput.value = '';
        lastJson = null;
        lastOutput = '';
        setOutput('', 'json');
        setMessage('等待输入 JSON 数据。', '');
        updateStats(null, '');
    }

    function autoFormatInput() {
        window.clearTimeout(autoFormatTimer);
        const inputText = jsonInput.value.trim();
        updateStats(lastJson, jsonInput.value);

        if (!inputText) {
            clearAll();
            return;
        }

        autoFormatTimer = window.setTimeout(() => {
            try {
                lastJson = JSON.parse(inputText);
                renderCurrent(outputMode.value);
                updateStats(lastJson, inputText);
                setMessage(isEnglish ? 'JSON formatted automatically.' : '已自动格式化。', 'success');
            } catch (error) {
                lastJson = null;
                const errorText = `错误：${locateJsonError(error, inputText)}`;
                setOutput(errorText, 'json-error-output');
                updateStats(null, inputText);
                setMessage(errorText, 'error');
            }
        }, 300);
    }

    function updateFullscreenLabel() {
        const workbench = document.querySelector('.json-workbench');
        const isFullscreen = Boolean(document.fullscreenElement) || Boolean(workbench && workbench.classList.contains('is-fullscreen'));
        fullscreenBtn.textContent = isFullscreen ? '退出全屏' : '全屏';
    }

    function toggleFullscreen() {
        const workbench = document.querySelector('.json-workbench');
        if (!workbench) {
            return;
        }

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        } else if (typeof workbench.requestFullscreen === 'function') {
            workbench.requestFullscreen().catch(() => {
                workbench.classList.add('is-fullscreen');
            });
        } else {
            workbench.classList.toggle('is-fullscreen');
        }
        updateFullscreenLabel();
    }

    function jsonToTree(value, label = 'root', depth = 0) {
        const indent = '  '.repeat(depth);
        if (value === null || typeof value !== 'object') {
            return `${indent}${label}: ${String(value)}\n`;
        }

        const type = Array.isArray(value) ? 'Array' : 'Object';
        let result = `${indent}${label}: ${type}\n`;
        const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value);
        entries.forEach(([key, child]) => {
            result += jsonToTree(child, key, depth + 1);
        });
        return result;
    }

    function jsonToYaml(value, depth = 0) {
        const indent = '  '.repeat(depth);
        if (Array.isArray(value)) {
            return value.map(item => {
                if (item !== null && typeof item === 'object') {
                    return `${indent}-\n${jsonToYaml(item, depth + 1)}`;
                }
                return `${indent}- ${formatYamlValue(item)}\n`;
            }).join('');
        }

        if (value !== null && typeof value === 'object') {
            return Object.entries(value).map(([key, item]) => {
                if (item !== null && typeof item === 'object') {
                    return `${indent}${key}:\n${jsonToYaml(item, depth + 1)}`;
                }
                return `${indent}${key}: ${formatYamlValue(item)}\n`;
            }).join('');
        }

        return `${indent}${formatYamlValue(value)}\n`;
    }

    function formatYamlValue(value) {
        if (value === null) {
            return 'null';
        }
        if (typeof value === 'string') {
            if (value === '' || /[:#\n"'{}\[\],&*?|-]/.test(value)) {
                return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
            }
            return value;
        }
        return String(value);
    }

    function jsonToXml(value, nodeName, depth = 0) {
        const indent = '  '.repeat(depth);
        if (Array.isArray(value)) {
            return value.map(item => jsonToXml(item, nodeName, depth)).join('');
        }

        if (value !== null && typeof value === 'object') {
            let xml = `${indent}<${safeXmlName(nodeName)}>\n`;
            Object.entries(value).forEach(([key, item]) => {
                xml += jsonToXml(item, key, depth + 1);
            });
            xml += `${indent}</${safeXmlName(nodeName)}>\n`;
            return xml;
        }

        return `${indent}<${safeXmlName(nodeName)}>${escapeXml(String(value ?? ''))}</${safeXmlName(nodeName)}>\n`;
    }

    function safeXmlName(name) {
        const normalized = String(name).replace(/[^A-Za-z0-9_-]/g, '_');
        return /^[A-Za-z_]/.test(normalized) ? normalized : `item_${normalized}`;
    }

    function escapeXml(text) {
        return text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function jsonToTypeScript(value) {
        const definitions = [];
        const rootType = buildTypeScriptType(value, 'Root', definitions);
        if (!definitions.some(definition => definition.startsWith('interface Root '))) {
            definitions.unshift(`type Root = ${rootType};`);
        }
        return definitions.join('\n\n');
    }

    function buildTypeScriptType(value, name, definitions) {
        if (value === null) return 'null';
        if (Array.isArray(value)) {
            return value.length ? `${buildTypeScriptType(value[0], singularize(name), definitions)}[]` : 'unknown[]';
        }
        if (typeof value === 'object') {
            const interfaceName = toPascalCase(name);
            const fields = Object.entries(value).map(([key, item]) => {
                return `  ${safeTsKey(key)}: ${buildTypeScriptType(item, key, definitions)};`;
            });
            const definition = `interface ${interfaceName} {\n${fields.join('\n')}\n}`;
            if (!definitions.includes(definition)) {
                definitions.push(definition);
            }
            return interfaceName;
        }
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        return 'string';
    }

    function jsonToGoStruct(value) {
        const structs = [];
        const rootType = buildGoType(value, 'Root', structs);
        if (rootType !== 'Root') {
            structs.unshift(`type Root ${rootType}`);
        }
        return structs.join('\n\n');
    }

    function buildGoType(value, name, structs) {
        if (value === null) return 'interface{}';
        if (Array.isArray(value)) {
            return value.length ? `[]${buildGoType(value[0], singularize(name), structs)}` : '[]interface{}';
        }
        if (typeof value === 'object') {
            const structName = toPascalCase(name);
            const fields = Object.entries(value).map(([key, item]) => {
                return `    ${toPascalCase(key)} ${buildGoType(item, key, structs)} \`json:"${key}"\``;
            });
            const definition = `type ${structName} struct {\n${fields.join('\n')}\n}`;
            if (!structs.includes(definition)) {
                structs.push(definition);
            }
            return structName;
        }
        if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
        if (typeof value === 'boolean') return 'bool';
        return 'string';
    }

    function toPascalCase(text) {
        const normalized = String(text)
            .replace(/[^A-Za-z0-9]+/g, ' ')
            .trim()
            .split(/\s+/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        return /^[A-Za-z]/.test(normalized) ? normalized : `Field${normalized || 'Value'}`;
    }

    function safeTsKey(key) {
        return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
    }

    function singularize(text) {
        return String(text).endsWith('s') ? String(text).slice(0, -1) : text;
    }

    formatBtn.addEventListener('click', () => handleJsonAction('format'));
    compressBtn.addEventListener('click', () => handleJsonAction('compress'));
    outputCompressBtn.addEventListener('click', () => handleJsonAction('compress'));
    outputFormatBtn.addEventListener('click', () => handleJsonAction('format'));
    escapeBtn.addEventListener('click', escapeInput);
    unescapeBtn.addEventListener('click', unescapeInput);
    clearBtn.addEventListener('click', clearAll);
    sampleBtn.addEventListener('click', loadSample);
    copyBtn.addEventListener('click', copyResult);
    outputCopyBtn.addEventListener('click', copyResult);
    downloadBtn.addEventListener('click', downloadJson);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenLabel);
    outputMode.addEventListener('change', () => renderCurrent(outputMode.value));
    jsonInput.addEventListener('input', autoFormatInput);

    updateStats(null, '');
});
