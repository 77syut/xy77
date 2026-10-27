import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import photographs from '../data/photographs.json'
import DailySignPreview from './DailySignPreview'
import { PROJECTS } from '../data/projects'
import { FOCUS_POINTS } from '../data/focusPoints'
const BASE = import.meta.env.BASE_URL

export function BuildList({ onOpen }: { onOpen: (index: number) => void }) {
  return <div className="build-list">{PROJECTS.map((item, i) => <button className="build-line" onClick={() => onOpen(i)} key={item.title}><div className="build-preview">{i === 0 ? <img src={BASE + 'projects/olise-after.webp'} alt="复古照片滤镜效果" /> : <DailySignPreview />}</div><span className="build-copy"><small>0{i + 1} / {item.category}</small><strong>{item.title}</strong><em>{item.en}</em></span><span className="line-arrow">↗</span></button>)}</div>
}
function InterestDrawing({ type }: { type: 'dive' | 'ski' | 'build' }) {
  return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">{type === 'dive' ? <><path d="M14 35c13-7 39-7 52 0l-5 17c-8 8-14-5-21-5s-13 13-21 5zM40 33v14M62 38V20c0-8-12-8-12 0"/><circle cx="24" cy="18" r="3"/><circle cx="31" cy="9" r="1.5"/><path d="M9 64c9-5 14 5 24 0s14 5 24 0 11 3 15 0"/></> : type === 'ski' ? <><path d="M7 51 29 16 51 51M24 24l6 5 5-4M42 40l13-19 18 30M13 66l49-6c5 0 8-3 8-6M12 73l49-6c5 0 8-3 8-6M35 48l10 18M48 45l8 19"/></> : <><path d="m29 23-17 17 17 17M51 23l17 17-17 17M46 14 34 66"/><circle cx="67" cy="14" r="3"/><path d="M12 68h12"/></>}</svg>
}
export function InterestList() {
  return <div className="interest-list">{[
    { title: '潜水', en: 'Below the noise', text: '把声音调低，去另一种蓝里待一会儿', type: 'dive' as const },
    { title: '滑雪', en: 'One turn at a time', text: '在雪道上，把注意力交给下一个弯', type: 'ski' as const },
    { title: '动手创造', en: 'What if I made it?', text: '想到「不如试试」，就真的试试', type: 'build' as const },
  ].map(item => <article key={item.title}><InterestDrawing type={item.type} /><div><h3>{item.title}<em>{item.en}</em></h3><p>{item.text}</p></div></article>)}</div>
}

// A dedicated screening room: preserve each photograph's frame, with a contact
// strip for browsing and a full-resolution lightbox. No forced crop or autoplay.
function PhotoGallery({ onOpen, progress }: { onOpen: (index: number) => void; progress: MotionValue<number> }) {
  const room = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const current = photographs[selected]
  const opacity = useTransform(progress, [.28, .72], [0, 1])
  const visibility = useTransform(progress, value => value < .01 ? 'hidden' : 'visible')
  const reveal = useTransform(progress, [.28, .94], ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'])
  const frameX = useTransform(progress, [.28, .94], [32, 0])
  const headingOpacity = useTransform(progress, [.5, .92], [0, 1])
  const headingY = useTransform(progress, [.5, .92], [24, 0])
  useEffect(() => {
    const sync = (value: number) => {
      if (room.current) { room.current.inert = value < .95; room.current.dataset.interactive = String(value >= .95) }
    }
    sync(progress.get())
    return progress.on('change', sync)
  }, [progress])
  const move = (step: number) => setSelected(i => (i + step + photographs.length) % photographs.length)
  return <motion.div ref={room} className="photo-room" style={{ opacity, visibility }}>
    <motion.div className="photo-heading" style={{ opacity: headingOpacity, y: reduced ? 0 : headingY }}><h2>把世界，<br />看成自己的。</h2><p>不急着解释。<br />让光线、色彩与片刻自己说话。</p><div className="photo-counter"><strong>{String(selected + 1).padStart(2, '0')}</strong><span> / 09 FRAMES</span></div><div className="photo-controls"><button onClick={() => move(-1)} aria-label="浏览上一张摄影作品">←</button><button onClick={() => move(1)} aria-label="浏览下一张摄影作品">→</button></div></motion.div>
    <motion.div className="photo-stage" style={{ clipPath: reduced ? 'none' : reveal, x: reduced ? 0 : frameX }} onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1) } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) } }}>
      <button className="photo-screen" onClick={() => onOpen(selected)} aria-label={'放大摄影作品：' + current.title}>
        <AnimatePresence mode="wait"><motion.img key={current.id} src={BASE + current.src} alt={current.title} initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.025, clipPath: reduced ? 'inset(0)' : 'inset(0 0 8% 0)' }} animate={{ opacity: 1, scale: 1, clipPath: 'inset(0)' }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: reduced ? 0 : .42, ease: [.22, 1, .36, 1] }} /></AnimatePresence><span className="photo-expand">↗ <span>全屏观看</span></span>
      </button>
      <div className="photo-caption"><div><strong>{current.title}</strong>{current.location && <span className="photo-location">摄于 · {current.location}</span>}</div><em>{current.subtitle}</em></div>
      <div className="photo-contact" aria-label="摄影作品缩略图">{photographs.map((photo, i) => <button key={photo.id} className={i === selected ? 'selected' : ''} onClick={e => { setSelected(i); const strip = e.currentTarget.parentElement!; strip.scrollTo({ left: strip.scrollLeft + e.currentTarget.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - e.currentTarget.clientWidth) / 2, behavior: reduced ? 'auto' : 'smooth' }) }} aria-label={'选看照片：' + photo.title} aria-pressed={selected === i}><img src={BASE + photo.src} alt="" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span></button>)}</div>
    </motion.div>
  </motion.div>
}
export default function Works({ onProject, onPhoto, stageOpacity, photoProgress }: { onProject: (index: number) => void; onPhoto: (index: number) => void; stageOpacity: MotionValue<number>; photoProgress: MotionValue<number> }) {
  return <>
    <section className="chapter builds-chapter" id="builds" data-point={FOCUS_POINTS[3]}><motion.article className="chapter-copy" style={{ opacity: stageOpacity }}><h2>让想法，有形</h2><p className="intro-line">一点代码，一点审美，和一点不安分</p><BuildList onOpen={onProject} /></motion.article></section>
    <section className="photography-chapter" id="photography" data-point={FOCUS_POINTS[4]}><PhotoGallery onOpen={onPhoto} progress={photoProgress} /></section>
    <section className="chapter interests-chapter" id="offscreen" data-point={FOCUS_POINTS[5]}><motion.article className="chapter-copy" style={{ opacity: stageOpacity }}><h2>认真热爱</h2><p className="intro-line">简历之外，也是我</p><InterestList /></motion.article></section>
  </>
}
