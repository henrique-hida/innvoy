import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeftIcon } from 'lucide-react';
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
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/guests"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[rgb(51,53,100)] transition-colors hover:bg-[rgba(51,53,100,0.1)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-[rgb(51,53,100)]">
          {t.newGuestTitle}
        </h2>
      </div>
      <GuestForm onSubmit={handleSubmit} submitLabel={t.createGuest} />
    </motion.div>
  );
}
