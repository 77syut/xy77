import { motion, useTransform, type MotionValue, type MotionStyle } from 'framer-motion'

// Only the split colour field remains behind the interactive character.
export default function ColorField({ ending, photoProgress }: { ending: MotionValue<number>; photoProgress: MotionValue<number> }) {
  const fieldWidth = useTransform(photoProgress, [0, .85], ['54%', '30%'])
  const fieldOpacity = useTransform([ending, photoProgress], ([end, photo]) => 1 - Math.max(Number(end), Number(photo)))
  return <motion.div className="world-atmosphere" style={{ '--field-width': fieldWidth, '--field-opacity': fieldOpacity } as MotionStyle} aria-hidden="true">
    <div className="color-field" />
  </motion.div>
}
