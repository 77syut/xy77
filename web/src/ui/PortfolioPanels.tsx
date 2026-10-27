import { useEffect, useRef, useState, type ReactNode } from 'react'
import photographs from '../data/photographs.json'
import DailySignPreview from './DailySignPreview'
import { PROJECTS } from '../data/projects'
const BASE = import.meta.env.BASE_URL
function Modal({ children, onClose, title, className = '' }: { children: ReactNode; onClose: () => void; title: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const node = ref.current!; const previous = document.body.style.overflow; node.showModal(); document.body.style.overflow = 'hidden'; return () => { node.close(); document.body.style.overflow = previous } }, [])
  return <dialog ref={ref} className={'modal ' + className} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }}><button className="close-button" onClick={onClose} aria-label="关闭">✕</button>{children}</dialog>
}
function Lightbox({ index, onChange, onClose }: { index: number; onChange: (index: number) => void; onClose: () => void }) {
  const photo = photographs[index]
  useEffect(() => { function key(e: KeyboardEvent) { if (e.key === 'ArrowRight') onChange((index + 1) % photographs.length); if (e.key === 'ArrowLeft') onChange((index - 1 + photographs.length) % photographs.length) } window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [index, onChange])
  return <Modal title={photo.title} onClose={onClose} className="lightbox"><img src={BASE + photo.src} alt={photo.title} /><div className="lightbox-bottom"><button onClick={() => onChange((index - 1 + photographs.length) % photographs.length)} aria-label="上一张">←</button><div><strong>{photo.title}</strong>{photo.location && <span className="lightbox-location">摄于 · {photo.location}</span>}<p>{photo.subtitle} / {String(index + 1).padStart(2, '0')} OF 09</p></div><button onClick={() => onChange((index + 1) % photographs.length)} aria-label="下一张">→</button></div></Modal>
}
function ProjectDetail({ project, onClose }: { project: number; onClose: () => void }) {
  const [split, setSplit] = useState(50)
  const item = PROJECTS[project]
  return <Modal title={item.title} onClose={onClose} className="project-modal">
    <div className="project-detail">
      <div className="project-visual">
        <div className="project-artwork">{project === 0 ? <div className="compare"><img src={BASE + 'projects/olise-before.webp'} alt="原始运动照片" /><img style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} src={BASE + 'projects/olise-after.webp'} alt="应用复古滤镜后的照片" /><span style={{ left: split + '%' }} className="compare-line" /><span className="compare-label">RETRO / ORIGINAL</span></div> : <DailySignPreview large />}</div>
        {project === 0 && <><label className="slider-label">拖动，看看另一种颜色<input aria-label="调整原图与效果对比" type="range" min="0" max="100" value={split} onChange={e => setSplit(Number(e.target.value))} /></label><p className="project-footnote">60+ 使用者 · 发布 10 天收获 160+ 赞评</p></>}
      </div>
      <div className="project-story">
        <h2>{item.title}</h2>
        <p className="project-summary">{project === 0 ? '把扫描线、冷青影调和旧屏幕颗粒，做成可对话使用的复古照片滤镜 Skill，它会随人像、运动或静物调整处理方式，让一句话也能得到有情绪的照片' : '从三件日常物件中选一个，得到一张生活签，可以保留今日定签、保存海报，或在签历里回看那些普通却值得记住的日子'}</p>
        {project === 1 && <div className="project-features"><span>日常物件三选一</span><span>保留今日定签</span><span>海报与签历</span></div>}
        <div className="project-links"><div className="entry-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="quiet-link" href={item.url} target="_blank" rel="noopener noreferrer">{project === 0 ? '查看 Skill 仓库' : '去抽一张签'} <span>↗</span></a></div>
      </div>
    </div>
  </Modal>
}

export { Lightbox, ProjectDetail, Modal }
