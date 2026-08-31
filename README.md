# DevMiniTools

DevMiniTools 是一个轻量、开源的开发者在线工具箱。工具直接在浏览器中运行，输入的数据不会上传到服务器，同时提供 Windows 离线桌面版。

## 在线使用

[https://devminitools.com/](https://devminitools.com/)

## 工具列表

| 分类 | 工具 |
| --- | --- |
| JSON | JSON 格式化、压缩及类型转换；JSON 转 Java、Go、C#、Rust、Ruby、XML、YAML |
| 图片 | 图片压缩、PNG/JPEG/WebP/AVIF 格式转换、多图合成 GIF |
| 文本与代码 | 代码差异对比、Markdown 实时预览、多行文本处理 |
| 查询与转换 | HEX/RGB/HSL 颜色转换、IPv4/IPv6 地址识别、User-Agent 解析 |

## 特点

- 纯前端处理，常用数据无需上传
- 无需注册，打开页面即可使用
- 响应式界面，支持桌面和移动设备
- 提供中文与英文静态页面，工具页可直接切换语言
- 可通过 Electron 打包为 Windows 离线应用
- 使用原生 HTML、CSS 和 JavaScript，部署简单

## 本地运行

克隆项目：

```bash
git clone https://github.com/faymanwang/devminitools.git
cd devminitools
```

可以直接用浏览器打开 `index.html`，也可以使用任意静态文件服务器启动项目。

运行项目完整性检查：

```bash
npm run generate:i18n
npm run check:site
```

`generate:i18n` 会根据中文工具页重新生成 `en/` 下的英文页面、双语 SEO 元数据和 sitemap。修改页面文案或结构后，请先运行该命令，再运行站点检查。

## 桌面版

安装依赖并启动 Electron：

```bash
npm ci
npm run start
```

构建 Windows x64 安装版和便携版：

```bash
npm run dist:win
```

推送到 `main` 分支后，GitHub Actions 会自动部署 GitHub Pages，并构建 Windows 桌面包发布到 Releases。也可以在 Actions 页面手动触发相应工作流。

> Windows 安装包目前未配置代码签名，系统可能显示 SmartScreen 提示。

## 项目结构

```text
├── index.html          # 站点入口
├── *.html              # 各工具页面
├── en/                 # 英文工具页面
├── css/                # 公共样式
├── js/                 # 工具逻辑与运行时英文提示
├── vendor/             # 本地第三方前端资源
├── electron/           # Electron 桌面端入口
├── scripts/            # 项目检查脚本
└── .github/workflows/  # Pages 部署与桌面版构建
```

## 技术栈

- HTML5、CSS3、JavaScript
- highlight.js
- Electron、electron-builder
- GitHub Actions、GitHub Pages

## 许可证

[MIT](LICENSE)

## 参与贡献

欢迎提交 [Issue](https://github.com/faymanwang/devminitools/issues) 或 Pull Request。
