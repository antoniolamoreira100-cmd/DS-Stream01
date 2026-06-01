import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, X, LogOut, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const NAV_LINKS = [
  { label: 'Início', path: '/home' },
  { label: 'Séries', path: '/home?tipo=serie' },
  { label: 'Filmes', path: '/home?tipo=filme' },
  { label: 'Novidades', path: '/home?novo=true' },
  { label: 'Minha Lista', path: '/my-list' },
];

const AVATAR_COLORS = [
  'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600',
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeProfile = useAppStore((s) => s.activeProfile);
  const profiles = useAppStore((s) => s.profiles);
  const logout = useAppStore((s) => s.logout);
  const setActiveProfile = useAppStore((s) => s.setActiveProfile);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profileInitial = activeProfile?.nome?.charAt(0).toUpperCase() || 'U';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-black text-sm">DS</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight hidden sm:block">
            DS<span className="text-red-500">Stream</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                location.pathname === link.path.split('?')[0] && !link.path.includes('?')
                  ? 'text-white font-semibold'
                  : 'text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => navigate('/search')}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="p-2 text-white/70 hover:text-white transition-colors relative hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 group"
            >
              <div className={`w-8 h-8 rounded ${AVATAR_COLORS[0]} flex items-center justify-center text-white font-bold text-sm`}>
                {activeProfile?.avatar_url
                  ? <img src={activeProfile.avatar_url} alt="" className="w-full h-full rounded object-cover" />
                  : profileInitial
                }
              </div>
              <ChevronDown
                size={14}
                className={`text-white/70 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-black/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  {/* Profile switcher */}
                  <div className="p-2 border-b border-white/10">
                    <p className="text-white/40 text-xs px-2 py-1 uppercase tracking-wider font-semibold">Perfis</p>
                    {profiles.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => { setActiveProfile(p); setProfileMenuOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                          activeProfile?.id === p.id ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className={`w-7 h-7 rounded ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold`}>
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm flex-1 text-left">{p.nome}</span>
                        {activeProfile?.id === p.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/profiles'); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <User size={15} className="text-white/60" />
                      <span className="text-white/80 text-sm">Gerenciar Perfis</span>
                    </button>
                    <button
                      onClick={() => { navigate('/settings'); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Settings size={15} className="text-white/60" />
                      <span className="text-white/80 text-sm">Configurações</span>
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-red-600/20 transition-colors"
                    >
                      <LogOut size={15} className="text-red-400" />
                      <span className="text-red-400 text-sm">Sair</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10"
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/80 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
