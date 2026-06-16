import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guestsApi } from '../api/guests';
import type { Guest } from '../types/guest';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type Status = 'all' | 'active' | 'inactive';
const PAGE_SIZE = 10;

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

function filterByStatus(list: Guest[], status: Status): Guest[] {
  if (status === 'all') return list;
  return list.filter((g) => g.active === (status === 'active'));
}

function deactivateInList(prev: Guest[] | null, id: number): Guest[] | null {
  if (!prev) return null;
  return prev.map((g) => (g.id === id ? { ...g, active: false } : g));
}

function pageRange(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

interface StatusFilterProps {
  value: Status;
  onChange: (v: string | null) => void;
}

const STATUS_LABELS: Record<Status, keyof Translations> = {
  all: 'all',
  active: 'active',
  inactive: 'inactive',
};

function StatusFilter({ value, onChange }: StatusFilterProps) {
  const { t } = useLang();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-auto min-w-0 border-none bg-transparent p-0 text-xs font-medium uppercase tracking-wide text-muted-foreground shadow-none hover:text-foreground focus-visible:ring-0">
        <SelectValue>{(v: Status) => t[STATUS_LABELS[v]]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t.all}</SelectItem>
        <SelectItem value="active">{t.active}</SelectItem>
        <SelectItem value="inactive">{t.inactive}</SelectItem>
      </SelectContent>
    </Select>
  );
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
      <TableCell>{g.active ? <ActiveBadge /> : <InactiveBadge />}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(g)}>{t.edit}</DropdownMenuItem>
            {g.active && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
                  onClick={() => onDeactivate(g.id!)}
                >
                  {t.deactivateGuest}
                </DropdownMenuItem>
              </>
            )}
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
              <PaginationLink isActive={p === page} onClick={() => onPageChange(p as number)}>
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
  status: Status,
  onStatusChange: (v: string | null) => void,
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
          <TableHead>
            <StatusFilter value={status} onChange={onStatusChange} />
          </TableHead>
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
  const [status, setStatus] = useState<Status>('all');
  const [page, setPage] = useState(1);
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

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatus = (value: string | null) => {
    setStatus((value ?? 'all') as Status);
    setPage(1);
  };

  const handleDeactivate = (id: number) => {
    if (!window.confirm(t.deactivateConfirm)) return;
    void guestsApi.deactivate(id).then(() => {
      setGuests((prev) => deactivateInList(prev, id));
    });
  };

  const byStatus = filterByStatus(guests ?? [], status);
  const filtered = applySearch(byStatus, search);
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
      {renderBody(displayed, guests === null, error, status, handleStatus, handleEdit, handleDeactivate, t)}
      {totalPages > 1 && (
        <PaginationBar page={page} total={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
