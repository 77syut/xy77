export const CHAPTERS = [
  { id: 'about', title: '自述 · 关于我', short: '自述', en: 'A little about me', point: 'focus-1' },
  { id: 'learning', title: '求知 · 教育经历', short: '求知', en: 'Always a student', point: 'focus-2' },
  { id: 'experience', title: '履迹 · 实习经历', short: '履迹', en: 'Into the real world', point: 'focus-3' },
  { id: 'builds', title: '造物 · Builder 作品', short: '造物', en: 'Things I make', point: 'focus-4' },
  { id: 'photography', title: '观照 · 摄影作品', short: '观照', en: 'Through my eyes', point: 'focus-5' },
  { id: 'offscreen', title: '热爱 · 兴趣爱好', short: '热爱', en: 'Life, offscreen', point: 'focus-6' },
] as const
export type ChapterId = typeof CHAPTERS[number]['id']
export type Entry = { title: string; role: string; period: string; description: string; hook?: string; tags?: string[]; highlight?: string }
export type Profile = { name: string; bio: string; education: Entry[]; experience: Entry[] }
