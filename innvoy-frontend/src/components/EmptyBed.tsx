import { BedDoubleIcon } from 'lucide-react';
import { motion } from 'motion/react';

const zFloat = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } as const;

export function EmptyBed() {
  return (
    <div className="relative inline-flex items-end">
      <BedDoubleIcon className="size-16 text-[rgb(51,53,100)] opacity-20" strokeWidth={1.2} />
      <div className="absolute -right-1 top-0">
        <motion.span
          className="absolute bottom-0 right-0 text-base font-extrabold text-[rgb(51,53,100)]"
          animate={{ y: [0, -6, 0], opacity: [0.35, 0.08, 0.35] }}
          transition={zFloat}
        >
          z
        </motion.span>
        <motion.span
          className="absolute -top-2.5 right-[-8px] text-sm font-extrabold text-[rgb(51,53,100)]"
          animate={{ y: [0, -6, 0], opacity: [0.25, 0.04, 0.25] }}
          transition={{ ...zFloat, delay: 0.5 }}
        >
          z
        </motion.span>
        <motion.span
          className="absolute -top-4 right-[-14px] text-xs font-extrabold text-[rgb(51,53,100)]"
          animate={{ y: [0, -6, 0], opacity: [0.18, 0.02, 0.18] }}
          transition={{ ...zFloat, delay: 1 }}
        >
          z
        </motion.span>
      </div>
    </div>
  );
}
