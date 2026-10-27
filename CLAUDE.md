# 当前 77 版本（2026-10-26）

先读 README.md 与 design/character-brief.md。项目命令在 web/。资料/临时输出只归本项目，不复制原始简历与聊天缓存。

直接加载 YXY3D.glb：16原生decal、CameraAction、focus0封面与focus1…6。Scene.tsx 保留上游 Mixer帧擦除、DOM焦点、停顿与插值，NODE_LINE=0。禁止重新生成镜头或重复贴纸。无独立眼球，景深按导出关闭。

Stickers.tsx 投影HTML按钮，屏幕最近邻裁剪，包装层pointer-events:none。6主映射data/stickers.ts；10装饰toast。App使用可取消的RAF导航。摄影使用photoTarget→阻尼photoProgress，滚动入场跨.9屏/退场跨.85屏，photography区间145svh；原GLB轨迹不改。人物在进度.1–.48淡出；照片.28–.94从右侧揭开，标题.5–.92后入；蓝绿分界54%→30%连续移动。PhotoGallery按真实动画进度≥.95开放交互；舞台>.22、项目>.35失活，回程实时恢复，防止透明层拦截项目点击。摄影节点导航1400ms正弦缓动，其他800ms，可中断。普通copy按可见程度渐入与轻微失焦，手机正文阅读时舞台淡出。

桌面鼠标为原生SVG圆角蓝绿拼色大箭头（48×60px），可点击处反色并放大为56×70px；仅hover:hover/pointer:fine启用，不加跟随DOM层，文字输入与禁用状态保留系统光标。

品牌文字统一Breenda YUAN（profile.name），favicon为最初的蓝绿小水母（web/public/favicon.svg）。保留克莱因蓝#1535ed+荧光绿#ccff21大面积拼接，ColorField.tsx只留纯色背景。根据用户浏览器标注，删除全部人物背后大字、轮廓线、底部装饰口号/编号、页眉副标、章节kicker和无内容价值的英文标签；禁止恢复这些装饰。首页正文不留贴纸提示，改由Stickers.tsx在decal-7附近显示轻磨砂气泡「点点贴纸，认识我」；跟随脸部，手机避开页眉，仅cover出现，点击任意贴纸后隐藏，pointer-events:none。中文系统宋体，英文本地Cormorant；Tooltip透明磨砂圆角18px，禁止改回白底蓝字。无底部胶囊；顶部目录；位置提示仅桌面普通章节，编号/章节名/说明统一Helvetica Neue/PingFang、12px/400/18px。

文案按最新标注精简：首页bio只留第一句且放大；关于我改成用户提供的两行「做产品，也做小玩意。／上山下海，什么都想试试。」并保留句号。教育标题「从市场，到数据科学」，短介绍；本科Python标签不拼机器学习，硕士机器学习/云计算拆开。vivo和v用plain-latin直立字体。仅.about-statement、.photo-heading和.portfolio-outro保留句号，其余全部删除句号（含英文末尾句点，日期/链接不动）；页眉横线和顶部滚动进度线删除。

profile.json按用户2026-10-26提供的Word简历改写，港大日期用户明确确认2025–2027（Word原文2026.12，不反改）。教育2项、实习vivo/抖音/百度文库3项，不能新增未经来源确认的经历或数字。仅展示授权经历，不发布源简历与联系方式。

Builder为复古照片滤镜Skill和每日一签（见data/projects.ts）；详情采用图文双列/手机紧凑纵列、视口自适应图片，优先整屏展示但禁止剪掉正文和外链。每日一签仓库私有，网站只外链用户提供的公开站点。兴趣为潜水、滑雪、动手创造。摄影九张不裁切且有指定标题地点，缩略图只横滚自身。photo-room固定视口同步淡入，不使用不透明面板切人物。竖图必须absolute/inset0/object-fit:contain，手机photo-stage align-self:stretch，避免撑破网格。

页尾透明，人物只保留12%并模糊成背景，self-portrait-77.webp使用用户边牧图片；文案「把风留在路上，把好奇带去远方。」，不用文字解释自画像；手机标题/图片必须完整可见。不得恢复不透明横向遮挡。旧版Git检查点774031c保留。

验证build、lint及桌面/窄屏的真实贴纸和内容点击。Node.js 24 LTS；Vercel配置位于根vercel.json，GitHub Pages备用工作流在.github/workflows/deploy.yml。发布只使用web/dist，原模板素材和试稿已清理。design内保留本机参考，.agent内保留本机工作记录，不随公开源码发布。
