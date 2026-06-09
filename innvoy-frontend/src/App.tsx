import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import GuestList from './pages/GuestList';
import GuestCreate from './pages/GuestCreate';
import GuestEdit from './pages/GuestEdit';
import isotipo from './assets/isotipo_blue.svg';
import { LangProvider, useLang } from './i18n/context';

function LangToggle() {
  const { lang, setLang } = useLang();
  const next: typeof lang = lang === 'en' ? 'pt' : 'en';
  return (
    <button
      onClick={() => setLang(next)}
      className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border hover:bg-muted"
    >
      {next.toUpperCase()}
    </button>
  );
}

function Shell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-8 py-3">
        <Link to="/guests" className="flex items-center gap-2.5">
          <img src={isotipo} alt="" className="h-8 w-auto" aria-hidden="true" />
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ color: 'rgb(51,53,100)' }}
          >
            innvoy
          </span>
        </Link>
        <LangToggle />
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
      </LangProvider>
    </BrowserRouter>
  );
}
