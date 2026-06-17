import { motion } from 'motion/react';

const B = 'rgb(51, 53, 100)';

const breathe = { duration: 4, repeat: Infinity, ease: 'easeInOut' } as const;
const zFloat = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } as const;

export function EmptyBed() {
  return (
    <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
      {/* Shadow */}
      <ellipse cx="80" cy="98" rx="55" ry="4" fill={B} opacity="0.05" />

      {/* Legs */}
      <rect x="28" y="82" width="5" height="14" rx="2.5" fill={B} opacity="0.2" />
      <rect x="127" y="82" width="5" height="14" rx="2.5" fill={B} opacity="0.2" />

      {/* Bed frame */}
      <rect x="24" y="72" width="112" height="12" rx="6" fill={B} opacity="0.15" />

      {/* Headboard */}
      <path d="M18 40 Q18 32, 26 32 L30 32 Q32 32, 32 34 L32 84 L18 84 Z" fill={B} opacity="0.25" />

      {/* Mattress */}
      <rect x="32" y="64" width="100" height="10" rx="4" fill={B} opacity="0.07" />

      {/* Pillow 1 */}
      <motion.rect
        x="38"
        y="54"
        width="28"
        height="13"
        rx="6.5"
        fill={B}
        opacity="0.18"
        animate={{ y: [54, 51, 54] }}
        transition={breathe}
      />

      {/* Pillow 2 */}
      <motion.rect
        x="60"
        y="56"
        width="24"
        height="11"
        rx="5.5"
        fill={B}
        opacity="0.12"
        animate={{ y: [56, 53, 56] }}
        transition={{ ...breathe, delay: 0.4 }}
      />

      {/* Blanket */}
      <motion.path
        fill={B}
        opacity="0.1"
        animate={{
          d: [
            'M32 72 C50 58, 80 60, 100 62 C115 63, 128 68, 132 72 Z',
            'M32 72 C50 55, 85 57, 100 59 C118 61, 128 66, 132 72 Z',
            'M32 72 C50 58, 80 60, 100 62 C115 63, 128 68, 132 72 Z',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blanket fold */}
      <motion.path
        stroke={B}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.08"
        animate={{
          d: [
            'M40 68 Q70 62, 100 64 Q120 66, 126 68',
            'M40 68 Q70 60, 100 62 Q120 64, 126 68',
            'M40 68 Q70 62, 100 64 Q120 66, 126 68',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Footboard */}
      <rect x="130" y="60" width="6" height="24" rx="3" fill={B} opacity="0.13" />

      {/* Z large */}
      <motion.g animate={{ y: [0, -10, 0], opacity: [0.3, 0.08, 0.3] }} transition={zFloat}>
        <text x="105" y="42" fontSize="16" fontWeight="800" fill={B}>
          Z
        </text>
      </motion.g>

      {/* Z medium */}
      <motion.g
        animate={{ y: [0, -10, 0], opacity: [0.2, 0.04, 0.2] }}
        transition={{ ...zFloat, delay: 0.5 }}
      >
        <text x="118" y="30" fontSize="12" fontWeight="800" fill={B}>
          Z
        </text>
      </motion.g>

      {/* Z small */}
      <motion.g
        animate={{ y: [0, -10, 0], opacity: [0.14, 0.02, 0.14] }}
        transition={{ ...zFloat, delay: 1 }}
      >
        <text x="128" y="20" fontSize="9" fontWeight="800" fill={B}>
          Z
        </text>
      </motion.g>
    </svg>
  );
}
