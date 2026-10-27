import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import Scene from './scene/Scene'
import ColorField from './ui/ColorField'
import LoadingScreen from './ui/LoadingScreen'
import Resume from './ui/Resume'
import Works from './ui/Works'
import { Lightbox, Modal, ProjectDetail } from './ui/PortfolioPanels'
import profile from './data/profile.json'
import { CHAPTERS, type ChapterId } from './data/chapters'
import { useStore } from './store'

export default function App() {
  const reduced = !!useReducedMotion()
  const [chapter, setChapter] = useState<ChapterId | null>(null)
  const [photo, setPhoto] = useState<number | null>(null)
  const [project, setProject] = useState<number | null>(null)
  const [index, setIndex] = useState(false)
  const [toast, setToast] = useState(false)
  const [traveling, setTraveling] = useState(false)
  const [showStickerHint, setShowStickerHint] = useState(() => window.scrollY < window.innerHeight * .3)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()
  const travel = useRef(0)
  const sceneRef = useRef<HTMLDivElement>(null)
  const photoTarget = useMotionValue(0)
  const photoSpring = useSpring(photoTarget, { stiffness: 95, damping: 25, mass: 1 })
  const photoProgress = reduced ? photoTarget : photoSpring
  const stageOpacity = useTransform(photoProgress, [0, .1, .48, 1], [1, 1, 0, 0])
  const outroReveal = useMotionValue(0)
  const readingOpacity = useMotionValue(1)
  const portraitOpacity = useTransform([stageOpacity, outroReveal, readingOpacity], ([stage, end, reading]) => Number(stage) * Number(reading) * (1 - Number(end) * .88))
  const portraitFilter = useTransform(outroReveal, value => `blur(${value * 12}px) saturate(${1 - value * .25})`)
  const [visible, setVisible] = useState(!document.hidden)
  const setActive = useStore(state => state.setActive)
  useEffect(() => {
    const sections = ['cover', ...CHAPTERS.map(item => item.id)].map(id => document.getElementById(id)!)
    const gallery = document.getElementById('photography')!
    const outro = document.querySelector('.portfolio-outro')!
    const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t) }
    let frame = 0
    const syncInteraction = () => {
      const phase = photoProgress.get()
      for (const section of sections) {
        const copy = section.querySelector<HTMLElement>('.chapter-copy')
        if (!copy) continue
        const alpha = Number(section.style.getPropertyValue('--chapter-alpha') || 1)
        copy.inert = alpha < .02 || ((section.id === 'builds' || section.id === 'offscreen') && phase > .35)
      }
      if (sceneRef.current) sceneRef.current.inert = phase > .22 || outroReveal.get() > .2 || readingOpacity.get() < .55
    }
    const stopPhoto = photoProgress.on('change', syncInteraction)
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const height = window.innerHeight
        setShowStickerHint(window.scrollY < height * .3)
        // Use the largest visible chapter, including the cover/outro, instead of
        // a late threshold that leaves the previous chapter selected on entry.
        let winner: ChapterId | null = null
        let largest = 0
        for (const section of [...sections, outro]) {
          const rect = section.getBoundingClientRect()
          const visibleHeight = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0))
          if (visibleHeight > largest) {
            largest = visibleHeight
            winner = CHAPTERS.find(item => item.id === section.id)?.id ?? null
          }
        }
        // A viewport-long runway feeds a damped progress value. Keep the
        // exported camera path, but let the photo composition arrive in stages.
        const rect = gallery.getBoundingClientRect()
        const enter = smooth((height * .9 - rect.top) / (height * .9))
        const leave = smooth((rect.bottom - height * .05) / (height * .85))
        const presence = enter * leave
        photoTarget.set(presence)
        setChapter(presence > .5 ? 'photography' : winner)
        const readingSection = sections.find(section => section.id === winner)
        if (window.innerWidth <= 680 && readingSection && winner !== 'photography') {
          const box = readingSection.getBoundingClientRect()
          const reading = smooth((-box.top - height * .07) / (height * .4))
          const remaining = smooth((box.bottom - height * .42) / (height * .33))
          readingOpacity.set(1 - reading * remaining)
        } else readingOpacity.set(1)
        const ending = outro.getBoundingClientRect()
        outroReveal.set(smooth((height * .95 - ending.top) / (height * .65)))
        for (const section of sections) {
          const copy = section.querySelector<HTMLElement>('.chapter-copy')
          if (!copy) continue
          const box = section.getBoundingClientRect()
          const enterCopy = smooth((height * .94 - box.top) / (height * .58))
          const leaveCopy = smooth((box.bottom - height * .04) / (height * .38))
          const alpha = enterCopy * leaveCopy
          section.style.setProperty('--chapter-alpha', String(alpha))
          section.style.setProperty('--chapter-rise', `${(1 - enterCopy) * 32 - (1 - leaveCopy) * 18}px`)
          section.style.setProperty('--chapter-blur', `${(1 - alpha) * 5}px`)
        }
        syncInteraction()

      })
    }
    const visibility = () => setVisible(!document.hidden)
    const interrupt = () => { cancelAnimationFrame(travel.current); setTraveling(false); setActive(null) }
    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    document.addEventListener('visibilitychange', visibility)
    update()
    return () => { stopPhoto(); cancelAnimationFrame(frame); cancelAnimationFrame(travel.current); clearTimeout(toastTimer.current); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); window.removeEventListener('wheel', interrupt); window.removeEventListener('touchstart', interrupt); document.removeEventListener('visibilitychange', visibility) }
  }, [setActive, photoTarget, photoProgress, outroReveal, readingOpacity])
  function jump(id: string) {
    setIndex(false)
    cancelAnimationFrame(travel.current)
    const section = document.getElementById(id)
    if (!section) return
    const from = window.scrollY
    const to = section.getBoundingClientRect().top + from
    const start = performance.now()
    const duration = id === 'photography' || chapter === 'photography' ? 1400 : 800
    setTraveling(true)
    setActive(CHAPTERS.some(item => item.id === id) ? id : null)
    // One cancellable journey avoids competing native smooth-scroll requests
    // when a second sticker is selected while the first transition is in flight.
    const step = (now: number) => {
      const t = reduced ? 1 : Math.min((now - start) / duration, 1)
      const ease = .5 - Math.cos(Math.PI * t) / 2
      window.scrollTo(0, from + (to - from) * ease)
      if (t < 1) travel.current = requestAnimationFrame(step)
      else { setTraveling(false); setActive(null) }
    }
    travel.current = requestAnimationFrame(step)
  }
  function locked() {
    clearTimeout(toastTimer.current)
    setToast(true)
    toastTimer.current = setTimeout(() => setToast(false), 2600)
  }
  const current = CHAPTERS.find(item => item.id === chapter)
  const currentIndex = CHAPTERS.findIndex(item => item.id === chapter)
  return <>
    <ColorField ending={outroReveal} photoProgress={photoProgress} />
    <motion.div ref={sceneRef} className="scene-bg" style={{ opacity: portraitOpacity, filter: portraitFilter }}><Canvas dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, .35, 3.65], fov: 47, near: .1, far: 100 }} gl={{ antialias: false, alpha: true }}><Suspense fallback={null}><Scene onSelect={jump} onLocked={locked} reduced={reduced} showStickerHint={showStickerHint} /></Suspense></Canvas></motion.div>
    <LoadingScreen />
    <motion.div className="scene-vignette" style={{ opacity: portraitOpacity }} aria-hidden="true" /><div className="scene-grain" aria-hidden="true" />
    <motion.div className="outro-mist" style={{ opacity: outroReveal }} aria-hidden="true" />
    <header className="site-header" data-chapter={chapter ?? 'cover'}><button className="wordmark" onClick={() => jump('cover')} aria-label="返回首页"><span className="brand-name">{profile.name}</span></button><button className="index-button" aria-haspopup="dialog" aria-expanded={index} onClick={() => setIndex(true)}>目录 <span>＋</span></button></header>
    <main className="content" aria-busy={traveling}>
      <section id="cover" className="hero chapter">

        <div className="hero-intro"><h1>保持好奇，<br />也制造惊喜</h1><p>{profile.bio}</p><button className="quiet-link" onClick={() => jump('about')}>走近一点 <span>↘</span></button></div>


      </section>
      <section className="chapter timeline-chapter about-chapter" id="about" data-point="focus-1"><article className="chapter-copy"><h2>不只一种可能</h2><p className="about-statement"><span>做产品，也做小玩意。</span><span>上山下海，什么都想试试。</span></p></article></section>
      <Resume profile={profile} /><Works onProject={setProject} onPhoto={setPhoto} stageOpacity={stageOpacity} photoProgress={photoProgress} />
      <footer className="portfolio-outro" id="closing"><div className="outro-layout"><div className="outro-copy"><h2>好奇未完，<br /><em>下次见。</em></h2><p className="outro-note">把风留在路上，<br />把好奇带去远方。</p><button className="quiet-link" onClick={() => jump('cover')}>再逛一遍 <span>↗</span></button><span className="outro-colophon">{profile.name} © 2026</span></div><figure className="self-portrait"><div className="portrait-mount"><img src={import.meta.env.BASE_URL + 'projects/self-portrait-77.webp'} alt="蓝与荧光黄之间，闭眼微笑的边牧" /><span className="portrait-corner" /></div></figure></div></footer>
    </main>
    {current && chapter !== 'photography' && <motion.button className="chapter-location" style={{ opacity: stageOpacity }} onClick={() => setIndex(true)} aria-label={'当前章节：' + current.title + '，打开目录'}><span className="location-number">0{currentIndex + 1}</span><span className="location-rule" aria-hidden="true" /><span>{current.short}</span><span className="location-detail">{current.title.split(' · ')[1]}</span></motion.button>}

    <AnimatePresence>{toast && <motion.div key="sticker-toast" className="sticker-toast" style={{ x: '-50%' }} role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><div>隐藏特质，待解锁</div></motion.div>}</AnimatePresence>
    {index && <Modal title="目录" onClose={() => setIndex(false)} className="index-panel"><span className="index-wordmark"><span className="brand-name">{profile.name}</span></span><div className="index-layout"><p className="index-heading">INDEX<span>目录 / 01—06</span></p><nav aria-label="章节目录">{CHAPTERS.map((item, i) => <button className="index-row" key={item.id} style={{ animationDelay: `${i * .035}s` }} aria-label={item.title} aria-current={chapter === item.id ? 'location' : undefined} onClick={() => jump(item.id)}><span className="index-no">0{i + 1}</span><span className="index-name"><strong>{item.short}</strong><small>{item.title.split(' · ')[1]}</small></span><span className="index-arrow">↗</span></button>)}</nav></div><p className="index-footer">{profile.name}</p></Modal>}

    {photo !== null && <Lightbox index={photo} onChange={setPhoto} onClose={() => setPhoto(null)} />}
    {project !== null && <ProjectDetail project={project} onClose={() => setProject(null)} />}
  </>
}
