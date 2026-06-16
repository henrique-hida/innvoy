import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import GuestList from './pages/GuestList';
import GuestCreate from './pages/GuestCreate';
import GuestEdit from './pages/GuestEdit';
import imagotipo from './assets/imagotipo_white.svg';
import { LangProvider, useLang } from './i18n/context';

function LangToggle() {
  const { lang, setLang } = useLang();
  const next: typeof lang = lang === 'en' ? 'pt' : 'en';
  return (
    <button
      onClick={() => setLang(next)}
      className="rounded-md px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/30 hover:bg-white/10"
    >
      {next.toUpperCase()}
    </button>
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
