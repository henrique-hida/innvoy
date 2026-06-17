import type { Guest } from '@/types/guest';
import { useLang } from '@/i18n/context';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PenLineIcon, Trash2Icon } from 'lucide-react';

const formatCPF = (cpf: string) =>
  /^\d{11}$/.test(cpf) ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;

const formatPhone = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
};

const formatDate = (date: string) => {
  const parts = date.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return date;
};

const formatZipCode = (zip: string) => {
  const d = zip.replace(/\D/g, '');
  if (d.length === 8) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return zip;
};

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  );
}

interface GuestDetailModalProps {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (guest: Guest) => void;
  onDeactivate: (id: number) => void;
}

export function GuestDetailModal({
  guest,
  open,
  onOpenChange,
  onEdit,
  onDeactivate,
}: GuestDetailModalProps) {
  const { t } = useLang();

  if (!guest) return null;

  const { address } = guest;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{t.guestDetails}</DialogTitle>
            <Badge variant={guest.active ? 'default' : 'secondary'}>
              {guest.active ? t.active : t.inactive}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.personalInfo}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <DetailRow label={t.fullName} value={guest.fullName} />
              </div>
              <DetailRow label={t.cpf} value={formatCPF(guest.cpf)} />
              <DetailRow label={t.dateOfBirth} value={formatDate(guest.dateOfBirth)} />
              <DetailRow label={t.phone} value={formatPhone(guest.phone)} />
              <DetailRow label={t.email} value={guest.email} />
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.address}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label={t.street} value={address.street} />
              <DetailRow label={t.number} value={address.number} />
              <DetailRow label={t.complement} value={address.complement} />
              <DetailRow label={t.neighborhood} value={address.neighborhood} />
              <DetailRow label={t.city} value={address.city.name} />
              <DetailRow label={t.state} value={address.city.state.name} />
              <DetailRow label={t.zipCode} value={formatZipCode(address.zipCode)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onDeactivate(guest.id!);
            }}
          >
            <Trash2Icon />
            {t.deactivate}
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onEdit(guest);
            }}
          >
            <PenLineIcon />
            {t.edit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
