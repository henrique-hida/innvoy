import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeftIcon } from 'lucide-react';
import GuestForm from '../components/GuestForm';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/i18n/context';

export default function GuestEdit() {
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const guest = (location.state as { guest?: Guest } | null)?.guest;

  if (!guest) {
    void navigate('/guests', { replace: true });
    return null;
  }

  const handleSubmit = async (updated: Guest) => {
    await guestsApi.update(updated);
    toast.success(t.guestUpdated);
    void navigate('/guests');
  };

  const handleDeactivate = async () => {
    await guestsApi.deactivate(guest.id!);
    toast.success(t.guestDeactivated);
    void navigate('/guests');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-xl py-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/guests"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground/15"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-[rgb(51,53,100)]">
          {t.editGuestTitle}
        </h2>
        {!guest.active && <Badge variant="destructive">{t.inactive}</Badge>}
      </div>
      <GuestForm
        initial={guest}
        onSubmit={handleSubmit}
        onDeactivate={guest.active ? handleDeactivate : undefined}
        submitLabel={t.saveChanges}
      />
    </motion.div>
  );
}
