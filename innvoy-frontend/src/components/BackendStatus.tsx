import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useLang } from '@/i18n/context';

type Status = 'online' | 'offline' | 'connecting';

const PING_URL = '/api/';
const POLL_INTERVAL = 30_000;
const RETRY_INTERVAL = 3_000;

async function ping(): Promise<boolean> {
  try {
    const res = await fetch(PING_URL, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

function StatusDot({ status }: { status: Status }) {
  const color = { online: 'bg-green-400', offline: 'bg-red-400', connecting: 'bg-yellow-400' }[
    status
  ];

  return (
    <span className="relative flex h-2 w-2">
      <AnimatePresence>
        {status === 'connecting' && (
          <motion.span
            key="pulse"
            className={`absolute inline-flex h-full w-full rounded-full ${color}`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export function BackendStatus() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>('connecting');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasOffline = useRef(false);

  const notify = useCallback(() => {
    toast.success(t.backendConnected);
    window.dispatchEvent(new Event('guests-changed'));
  }, [t]);

  const check = useCallback(async () => {
    const ok = await ping();
    if (ok && wasOffline.current) {
      wasOffline.current = false;
      notify();
    }
    if (!ok) wasOffline.current = true;
    setStatus(ok ? 'online' : 'offline');
  }, [notify]);

  useEffect(() => {
    const timer = setTimeout(() => void check(), 0);
    intervalRef.current = setInterval(() => void check(), POLL_INTERVAL);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [check]);

  const handleClick = () => {
    if (status !== 'offline') return;
    setStatus('connecting');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => void check(), RETRY_INTERVAL);
  };

  const label = {
    online: t.backendOnline,
    offline: t.backendOffline,
    connecting: t.backendConnecting,
  }[status];

  return (
    <button
      onClick={handleClick}
      disabled={status === 'online'}
      className="group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white disabled:cursor-default"
      title={label}
    >
      <StatusDot status={status} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
