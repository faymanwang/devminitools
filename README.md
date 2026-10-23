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

本地预览使用 `npm run preview`，默认地址为 `http://127.0.0.1:4173`。它直接读取当前分支源码，不读取旧 `dist`，并支持线上使用的无扩展名地址。

运行项目完整性检查：

```bash
npm run generate:i18n
npm run check:site
```

`generate:i18n` 会根据中文工具页和 `content/guides/zh`、`content/guides/en` 的成对 Markdown，生成双语页面、说明页面、页脚入口和搜索元数据。修改后请先生成，再检查。`npm test` 验证重复生成一致、main 原有页头及 CSS 不变，并覆盖精度、图片和 IPv6 边界。

本次基线为 main 的 39fc952，保留 11 个工具及现有导航。新增样式分别限制于文章和页脚；详情见 [工具盘点](docs/TOOL_INVENTORY.md) 与 [发布清单](docs/RELEASE_CHECKLIST.md)。广告保持关闭。

正式发布前运行 `npm run check:production`。联系渠道使用维护者提供的 faymanwang@gmail.com，Issues 保持关闭；缺少真实渠道时生产检查会失败。邮件实际收发需维护者自行验证。

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

[Apache-2.0](LICENSE)。根许可证保留原文；原 MIT 标签与根文件不一致，现按实际根许可证修正。上游来源和第三方原文见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 参与贡献

欢迎提交 [Issue](https://github.com/faymanwang/devminitools/issues) 或 Pull Request。
