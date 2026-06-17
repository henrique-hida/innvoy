import { motion } from 'motion/react';

const BRAND = 'rgb(51, 53, 100)';

export function EmptyBed() {
  return (
    <svg
      width="120"
      height="90"
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bed frame */}
      <rect x="10" y="50" width="100" height="8" rx="4" fill={BRAND} opacity="0.15" />
      <rect x="10" y="58" width="4" height="20" rx="2" fill={BRAND} opacity="0.2" />
      <rect x="106" y="58" width="4" height="20" rx="2" fill={BRAND} opacity="0.2" />

      {/* Headboard */}
      <rect x="8" y="30" width="8" height="28" rx="4" fill={BRAND} opacity="0.25" />

      {/* Pillow */}
      <motion.rect
        x="20"
        y="38"
        width="24"
        height="12"
        rx="6"
        fill={BRAND}
        opacity="0.2"
        animate={{ y: [38, 36, 38] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blanket/sheet */}
      <motion.path
        d="M18 50 Q35 42, 60 44 Q85 46, 102 50 L102 50 L18 50 Z"
        fill={BRAND}
        opacity="0.12"
        animate={{
          d: [
            'M18 50 Q35 42, 60 44 Q85 46, 102 50 L102 50 L18 50 Z',
            'M18 50 Q35 40, 60 42 Q85 44, 102 50 L102 50 L18 50 Z',
            'M18 50 Q35 42, 60 44 Q85 46, 102 50 L102 50 L18 50 Z',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Zzz */}
      <motion.text
        x="85"
        y="28"
        fontSize="14"
        fontWeight="bold"
        fill={BRAND}
        opacity="0.3"
        animate={{ y: [28, 24, 28], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        z
      </motion.text>
      <motion.text
        x="93"
        y="20"
        fontSize="11"
        fontWeight="bold"
        fill={BRAND}
        opacity="0.2"
        animate={{ y: [20, 16, 20], opacity: [0.2, 0.1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        z
      </motion.text>
      <motion.text
        x="99"
        y="14"
        fontSize="8"
        fontWeight="bold"
        fill={BRAND}
        opacity="0.15"
        animate={{ y: [14, 10, 14], opacity: [0.15, 0.05, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        z
      </motion.text>
    </svg>
  );
}
