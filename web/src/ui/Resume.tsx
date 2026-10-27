import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FOCUS_POINTS } from '../data/focusPoints'
import type { Entry, Profile } from '../data/chapters'

export function Entries({ entries }: { entries: Entry[] }) {
  return <div className="entry-list">{entries.map(entry => <article key={entry.title}>
    <span className="entry-period">{entry.period}</span><h3>{entry.title}</h3><p className="entry-role">{entry.role}</p>
    {entry.hook && <p className="entry-hook">{entry.hook}</p>}<p className="entry-description">{entry.description}</p>
    {entry.tags && <div className="entry-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
  </article>)}</div>
}
function Experience({ entries }: { entries: Entry[] }) {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const entry = entries[selected]
  return <div className="career-stories"><div className="career-tabs" role="tablist" aria-label="实习故事">{entries.map((item, i) => <button key={item.title} role="tab" id={'career-tab-' + i} aria-selected={i === selected} aria-controls={'career-panel-' + i} tabIndex={i === selected ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (selected + (e.key === 'ArrowRight' ? 1 : -1) + entries.length) % entries.length; setSelected(next); document.getElementById('career-tab-' + next)?.focus() } }}><span>0{i + 1}</span>{['vivo', '抖音', '百度文库'][i]}</button>)}</div>
    <AnimatePresence mode="wait"><motion.article key={entry.title} className="career-panel" role="tabpanel" id={'career-panel-' + selected} aria-labelledby={'career-tab-' + selected} initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .3 }}><span className="entry-period">{entry.period}</span><h3>{selected === 0 ? <><span className="plain-latin">vivo</span> · 蓝心小 <span className="plain-latin">v</span></> : entry.title}</h3><p className="entry-role">{entry.role}</p><p className="entry-hook">{entry.hook}</p><p className="entry-description">{entry.description}</p><div className="entry-tags">{entry.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>{entry.highlight && <p className="entry-highlight"><span>↗</span>{entry.highlight}</p>}</motion.article></AnimatePresence>
  </div>
}
export default function Resume({ profile }: { profile: Profile }) {
  return <div className="resume">
    <section className="chapter timeline-chapter" id="learning" data-point={FOCUS_POINTS[1]}><article className="chapter-copy"><h2>从市场，<br />到数据科学</h2><p className="intro-line">换一种方式，理解问题</p><Entries entries={profile.education} /></article></section>
    <section className="chapter timeline-chapter" id="experience" data-point={FOCUS_POINTS[2]}><article className="chapter-copy"><h2 className="experience-heading">把 AI 带进日常</h2><p className="intro-line">三段经历，关于 AI 产品「好用」的不同答案</p><Experience entries={profile.experience} /></article></section>
  </div>
}
