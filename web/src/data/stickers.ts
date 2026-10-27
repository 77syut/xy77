import type { ChapterId } from './chapters'
// Object names verified against YXY3D.glb's embedded textures. Keep native decal geometry.
export const STICKERS: { object: string; label: string; chapter?: ChapterId }[] = [
  { object: 'decal-0', label: '城市灵感' },
  { object: 'decal-1', label: '调色盘', chapter: 'builds' },
  { object: 'decal-2', label: '音乐星球' },
  { object: 'decal-3', label: '旅行记录' },
  { object: 'decal-4', label: '可达鸭读书', chapter: 'learning' },
  { object: 'decal-5', label: '妙蛙种子档案', chapter: 'offscreen' },
  { object: 'decal-6', label: '好奇雷达' },
  { object: 'decal-7', label: 'Good eye 相机', chapter: 'photography' },
  { object: 'decal-8', label: '抹茶小猫' },
  { object: 'decal-9', label: '星际探索' },
  { object: 'decal-10', label: '耿鬼电脑', chapter: 'experience' },
  { object: 'decal-11', label: '异星眼镜' },
  { object: 'decal-12', label: '飞碟乘客' },
  { object: 'decal-13', label: '出走旅行' },
  { object: 'decal-14', label: 'Hello 小猫' },
  { object: 'decal-15', label: 'HI 手势', chapter: 'about' },
]
