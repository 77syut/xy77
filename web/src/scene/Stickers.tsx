import { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { STICKERS } from '../data/stickers'
import { CHAPTERS, type ChapterId } from '../data/chapters'

type Point = [number, number]
// Partition nearby hit targets at the perpendicular bisector. Dense face stickers
// remain independently clickable on narrow screens; a later DOM node cannot steal
// the centre of a neighbouring sticker. Tooltip lives outside the clipped button.
function clipCell(polygon: Point[], dx: number, dy: number): Point[] {
  const limit = (dx * dx + dy * dy) / 2
  const output: Point[] = []
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length]
    const da = a[0] * dx + a[1] * dy - limit, db = b[0] * dx + b[1] * dy - limit
    if (da <= 0) output.push(a)
    if ((da <= 0) !== (db <= 0)) {
      const t = da / (da - db)
      output.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
    }
  }
  return output
}

export default function Stickers({ model, onSelect, onLocked, showDiscovery }: { model: THREE.Object3D; onSelect: (id: ChapterId) => void; onLocked: () => void; showDiscovery: boolean }) {
  const [discovered, setDiscovered] = useState(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const { camera, size } = useThree()
  const targets = useMemo(() => {
    model.updateMatrixWorld(true)
    return STICKERS.flatMap(spec => {
      const mesh = model.getObjectByName(spec.object) as THREE.Mesh | undefined
      if (!mesh?.geometry) return []
      mesh.geometry.computeBoundingBox()
      const center = mesh.geometry.boundingBox!.getCenter(new THREE.Vector3())
      mesh.localToWorld(center)
      model.parent?.worldToLocal(center)
      return [{ spec, center }]
    })
  }, [model])
  const projected = useMemo(() => targets.map(() => new THREE.Vector3()), [targets])
  useFrame(() => {
    const half = size.width < 681 ? 13 : 16
    targets.forEach((target, i) => projected[i].copy(target.center).project(camera))
    targets.forEach((_, i) => {
      let polygon: Point[] = [[-half, -half], [half, -half], [half, half], [-half, half]]
      for (let j = 0; j < targets.length; j++) {
        if (i === j) continue
        const dx = (projected[j].x - projected[i].x) * size.width / 2
        const dy = (projected[i].y - projected[j].y) * size.height / 2
        if (Math.abs(dx) < half * 3 && Math.abs(dy) < half * 3) polygon = clipCell(polygon, dx, dy)
      }
      const button = buttons.current[i]
      if (button) {
        button.style.width = button.style.height = `${half * 2}px`
        button.style.clipPath = `polygon(${polygon.map(([x, y]) => `${(x + half) / (half * 2) * 100}% ${(y + half) / (half * 2) * 100}%`).join(',')})`
      }
    })
  })
  return <>{targets.map(({ spec, center }, i) => {
    const chapter = CHAPTERS.find(item => item.id === spec.chapter)
    const label = chapter?.title ?? spec.label
    const select = () => { setDiscovered(true); if (spec.chapter) onSelect(spec.chapter); else onLocked() }
    return <Html key={spec.object} position={center} center wrapperClass="sticker-portal" style={{ pointerEvents: 'none' }} zIndexRange={[18, 12]}>
      <div className="sticker-target"><button ref={el => { buttons.current[i] = el }} className="sticker-hit" aria-label={'贴纸：' + label} data-sticker={spec.object}
        onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerUp={e => { e.stopPropagation(); e.currentTarget.releasePointerCapture(e.pointerId); if (e.button === 0) select() }}
        onClick={e => { e.stopPropagation(); if (e.detail === 0) select() }} />
        <span className="sticker-tooltip">{chapter ? label : '隐藏特质'}<span>{chapter ? '↗' : '…'}</span></span>
        {spec.object === 'decal-7' && showDiscovery && !discovered && <span className="sticker-discovery" role="note"><span aria-hidden="true">↙</span> 点点贴纸，认识我</span>}
      </div>
    </Html>
  })}</>
}
