# XY77 · Breenda YUAN

个人 3D 网站：可点击的角色贴纸、教育与实习经历、Builder 项目、摄影展厅，以及潜水和滑雪。

React、TypeScript、React Three Fiber、Framer Motion；纯静态站点，无后端和运行时密钥。

## 本地运行

使用 Node.js 24 LTS，所有前端命令在 `web/` 执行：

```sh
cd web
npm ci
npm run dev
npm run build
npm run lint
```

构建输出为 `web/dist/`。模型、摄影、字体与图标均使用项目内素材，不依赖远程字体或临时图片链接。

## 发布

正式网址：[xy77.vercel.app](https://xy77.vercel.app/)

备用网址：[77syut.github.io/xy77](https://77syut.github.io/xy77/)

源代码：[77syut/xy77](https://github.com/77syut/xy77)。

- Vercel 从此仓库自动部署；项目根目录设为仓库根，`vercel.json` 配置安装、构建命令及 `web/dist` 输出目录。
- GitHub Pages 使用 `.github/workflows/deploy.yml` 自动构建，作为独立备用入口；Pages 设置中的 Source 为 GitHub Actions。
- 推送 `main` 后自动更新；请先运行构建与 lint。
- 无需在仓库中填写账号、访问令牌或其他密钥。

## 内容与素材

- `web/src/data/profile.json`：教育、课程与三段实习；不发布原始简历和联系方式。
- `web/src/data/chapters.ts`、`focusPoints.ts`、`stickers.ts`：六个板块与原生贴纸/镜头映射。
- `web/src/data/projects.ts`：复古照片滤镜 Skill、每日一签；后者仅链接公开网页，不公开私有仓库。
- `web/src/data/photographs.json` 与 `web/public/photography/`：九张摄影及标题、地点；大图保持完整比例。
- `web/public/models/YXY3D.glb`：用户导出的角色、16 张贴纸与 CameraAction，保留原生镜头。
- `web/public/projects/`：滤镜对比图和自画像。
- `web/public/fonts/`：本地 Cormorant Upright 400/500 与 OFL 许可。
- `web/public/favicon.svg`：荧光绿与克莱因蓝的小水母。
- `web/public/icons/cursor-*.svg`：圆角大箭头，悬停反色，连续双色描边适应蓝绿背景；触屏保留系统行为。

保留克莱因蓝 `#1535ed` 与荧光绿 `#ccff21` 拼接、文艺字体和透明磨砂提示。摄影分阶段展开，两个项目的详情优先在一屏完整显示。

原模板角色、Blender 文件、原作者作品与品牌素材、未使用的试稿和图标候选已移除。源资料、设计预览和本机工作记录不上传；原始用户文件不随网站发布。

## 来源与授权

改造自 [dayinji/sen-3d-resume](https://github.com/dayinji/sen-3d-resume)，代码遵循原仓库 MIT 许可；保留 `LICENSE` 与 `NOTICE`。当前人物、摄影、自画像及个人内容使用用户素材，不属于 MIT 授权范围。
