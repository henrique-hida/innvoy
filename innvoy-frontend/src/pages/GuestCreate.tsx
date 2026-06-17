import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import GuestForm from '../components/GuestForm';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { useLang } from '@/i18n/context';

export default function GuestCreate() {
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (guest: Guest) => {
    await guestsApi.create(guest);
    toast.success(t.guestCreated);
    void navigate('/guests');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-xl py-8"
    >
      <Link
        to="/guests"
        className="mb-5 inline-flex items-center gap-1 text-sm text-primary hover:opacity-80"
      >
        {t.backToGuests}
      </Link>
      <h2 className="mb-6 text-2xl font-medium tracking-tight">{t.newGuestTitle}</h2>
      <GuestForm onSubmit={handleSubmit} submitLabel={t.createGuest} />
    </motion.div>
  );
}
