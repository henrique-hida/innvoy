import { useNavigate, Link } from 'react-router-dom';
import GuestForm from '../components/GuestForm';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { useLang } from '@/i18n/context';

export default function GuestCreate() {
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (guest: Guest) => {
    await guestsApi.create(guest);
    void navigate('/guests');
  };

  return (
    <div className="py-8 mx-auto max-w-xl">
      <Link
        to="/guests"
        className="mb-5 inline-flex items-center gap-1 text-sm text-primary hover:opacity-80"
      >
        {t.backToGuests}
      </Link>
      <h2 className="mb-6 text-2xl font-medium tracking-tight">{t.newGuestTitle}</h2>
      <GuestForm onSubmit={handleSubmit} submitLabel={t.createGuest} />
    </div>
  );
}
