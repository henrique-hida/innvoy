import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { FrownIcon, MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { useLang } from '@/i18n/context';
import type { Translations } from '@/i18n/translations';

const formatCPF = (cpf: string) =>
  /^\d{11}$/.test(cpf) ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;

const PAGE_SIZE = 10;

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

function pageRange(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

interface GuestRowProps {
  guest: Guest;
  onEdit: (g: Guest) => void;
  onDeactivate: (id: number) => void;
}

function GuestRow({ guest: g, onEdit, onDeactivate }: GuestRowProps) {
  const { t } = useLang();
  return (
    <TableRow>
      <TableCell>{g.fullName}</TableCell>
      <TableCell className="font-mono text-xs">{formatCPF(g.cpf)}</TableCell>
      <TableCell>{g.email}</TableCell>
      <TableCell>{g.phone}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(g)}>{t.edit}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
              onClick={() => onDeactivate(g.id!)}
            >
              {t.deactivateGuest}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface PaginationBarProps {
  page: number;
  total: number;
  onPageChange: (p: number) => void;
}

function PaginationBar({ page, total, onPageChange }: PaginationBarProps) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={page === 1} />
        </PaginationItem>
        {pageRange(page, total).map((p, i) => (
          <PaginationItem key={i}>
            {p === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => onPageChange(page + 1)} disabled={page === total} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function renderBody(
  guests: Guest[],
  loading: boolean,
  error: string,
  onEdit: (g: Guest) => void,
  onDeactivate: (id: number) => void,
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
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <FrownIcon className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">{t.noGuests}</p>
      </div>
    );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.fullName}</TableHead>
          <TableHead>{t.cpf}</TableHead>
          <TableHead>{t.email}</TableHead>
          <TableHead>{t.phone}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((g) => (
          <GuestRow key={g.id} guest={g} onEdit={onEdit} onDeactivate={onDeactivate} />
        ))}
      </TableBody>
    </Table>
  );
}

export default function GuestList() {
  const { t } = useLang();
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    void guestsApi
      .findAll({ active: true })
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

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDeactivate = (id: number) => {
    if (!window.confirm(t.deactivateConfirm)) return;
    void guestsApi
      .deactivate(id)
      .then(() => guestsApi.findAll({ active: true }))
      .then((data) => setGuests(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to deactivate guest');
      });
  };

  const filtered = applySearch(guests ?? [], search);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium tracking-tight">{t.guests}</h2>
        <Link to="/guests/new" className={buttonVariants()}>
          <PlusIcon />
          {t.newGuest}
        </Link>
      </div>
      <div className="mb-5">
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="max-w-sm"
        />
      </div>
      {renderBody(displayed, guests === null, error, handleEdit, handleDeactivate, t)}
      {totalPages > 1 && <PaginationBar page={page} total={totalPages} onPageChange={setPage} />}
    </div>
  );
}
