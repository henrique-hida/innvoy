import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLang } from '@/i18n/context';
import type { Translations } from '@/i18n/translations';

const formatCPF = (cpf: string) =>
  /^\d{11}$/.test(cpf) ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;

function ActiveBadge() {
  const { t } = useLang();
  return (
    <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
      {t.active}
    </Badge>
  );
}

function InactiveBadge() {
  const { t } = useLang();
  return <Badge variant="destructive">{t.inactive}</Badge>;
}

function matchesSearch(g: Guest, q: string): boolean {
  const digits = q.replace(/\D/g, '');
  const byText = g.fullName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
  if (!digits) return byText;
  return byText || g.cpf.includes(digits) || g.phone.replace(/\D/g, '').includes(digits);
}

function applySearch(list: Guest[], search: string): Guest[] {
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter((g) => matchesSearch(g, q));
}

function renderBody(
  guests: Guest[],
  loading: boolean,
  error: string,
  onEdit: (g: Guest) => void,
  t: Translations,
) {
  if (loading) return <p className="py-4 text-muted-foreground">{t.loading}</p>;
  if (error)
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
        {error}
      </p>
    );
  if (guests.length === 0)
    return <p className="py-12 text-center text-muted-foreground">{t.noGuests}</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.fullName}</TableHead>
          <TableHead>{t.cpf}</TableHead>
          <TableHead>{t.email}</TableHead>
          <TableHead>{t.phone}</TableHead>
          <TableHead>{t.status}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((g) => (
          <TableRow key={g.id}>
            <TableCell>{g.fullName}</TableCell>
            <TableCell className="font-mono text-xs">{formatCPF(g.cpf)}</TableCell>
            <TableCell>{g.email}</TableCell>
            <TableCell>{g.phone}</TableCell>
            <TableCell>{g.active ? <ActiveBadge /> : <InactiveBadge />}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onEdit(g)}>
                {t.edit}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function GuestList() {
  const { t } = useLang();
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    void guestsApi
      .findAll({})
      .then((data) => {
        if (!ignore) setGuests(data);
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load guests');
          setGuests([]);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleEdit = (guest: Guest) => {
    void navigate(`/guests/${guest.id}/edit`, { state: { guest } });
  };

  const filtered = applySearch(guests ?? [], search);

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium tracking-tight">{t.guests}</h2>
        <Link to="/guests/new" className={buttonVariants()}>
          {t.newGuest}
        </Link>
      </div>
      <div className="mb-5">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="max-w-sm"
        />
      </div>
      {renderBody(filtered, guests === null, error, handleEdit, t)}
    </div>
  );
}
