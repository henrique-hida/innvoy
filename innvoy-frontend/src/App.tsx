import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import GuestList from './pages/GuestList';
import GuestCreate from './pages/GuestCreate';
import GuestEdit from './pages/GuestEdit';
import { guestsApi } from './api/guests';
import imagotipo from './assets/imagotipo_white.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { DatabaseIcon, GlobeIcon } from 'lucide-react';
import { LangProvider, useLang } from './i18n/context';
import type { Lang } from './i18n/translations';

const LANG_LABELS: Record<Lang, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-white/50">
        <GlobeIcon className="h-3.5 w-3.5" />
        {lang.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={l === lang ? 'font-semibold' : ''}
          >
            {LANG_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DataToggle() {
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSeed = () => {
    void guestsApi.seed().then(() => {
      toast.success(t.seedSuccess);
      void navigate('/guests');
      window.dispatchEvent(new Event('guests-changed'));
    });
  };

  const handleClear = () => {
    void guestsApi.clearAll().then(() => {
      toast.success(t.clearSuccess);
      void navigate('/guests');
      window.dispatchEvent(new Event('guests-changed'));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-white/50">
        <DatabaseIcon className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSeed}>{t.seedData}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleClear}
          className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
        >
          {t.clearData}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Shell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="flex items-center justify-between px-8 py-3"
        style={{ backgroundColor: 'rgb(51,53,100)' }}
      >
        <Link to="/guests" className="flex items-center">
          <img src={imagotipo} alt="innvoy" className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <DataToggle />
          <LangToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/guests" replace />} />
          <Route path="/guests" element={<GuestList />} />
          <Route path="/guests/new" element={<GuestCreate />} />
          <Route path="/guests/:id/edit" element={<GuestEdit />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <Shell />
        <Toaster position="bottom-right" richColors closeButton />
      </LangProvider>
    </BrowserRouter>
  );
}
