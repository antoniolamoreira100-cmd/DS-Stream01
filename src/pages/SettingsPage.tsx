import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings, User, Bell, Shield, Palette, Globe,
  Monitor, Trash2, ChevronRight, LogOut, Moon, Sun,
  Check, Volume2, Subtitles, Wifi, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { useAppStore } from '../store/useAppStore';

type Section = 'account' | 'profiles' | 'preferences' | 'privacy' | 'appearance';

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('account');
  const activeProfile = useAppStore((s) => s.activeProfile);
  const user = useAppStore((s) => s.user);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const logout = useAppStore((s) => s.logout);

  const [audioLang, setAudioLang] = useState(activeProfile?.idioma_audio || 'pt-BR');
  const [subtitleLang, setSubtitleLang] = useState(activeProfile?.idioma_legenda || 'pt-BR');
  const [quality, setQuality] = useState(activeProfile?.qualidade || 'auto');
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleSavePreferences = () => {
    if (!activeProfile) return;
    updateProfile(activeProfile.id, {
      idioma_audio: audioLang,
      idioma_legenda: subtitleLang,
      qualidade: quality,
    });
    toast.success('Preferências salvas!');
  };

  const handleClearHistory = () => {
    if (!activeProfile) return;
    clearHistory(activeProfile.id);
    toast.success('Histórico limpo!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Até logo!');
  };

  const SECTIONS = [
    { id: 'account' as Section, label: 'Conta', icon: User },
    { id: 'profiles' as Section, label: 'Perfis', icon: User },
    { id: 'preferences' as Section, label: 'Preferências', icon: Monitor },
    { id: 'privacy' as Section, label: 'Privacidade', icon: Shield },
    { id: 'appearance' as Section, label: 'Aparência', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <Settings size={22} className="text-red-500" />
            <h1 className="text-white text-2xl md:text-3xl font-bold">Configurações</h1>
          </div>
          <p className="text-white/50 text-sm">Gerencie sua conta e preferências</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <nav className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-l-2 ${
                    activeSection === id
                      ? 'bg-red-600/10 border-red-500 text-white'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <div className="border-t border-white/10 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-600/10 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                  Sair da conta
                </button>
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Account */}
              {activeSection === 'account' && (
                <div>
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">Informações da conta</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2 block">E-mail</label>
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <span className="text-white/70 text-sm">{user?.email || 'usuario@email.com'}</span>
                        <button className="text-red-400 hover:text-red-300 text-xs transition-colors">Alterar</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2 block">Senha</label>
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <span className="text-white/70 text-sm">••••••••••••</span>
                        <button className="text-red-400 hover:text-red-300 text-xs transition-colors">Alterar</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2 block">Plano</label>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-white font-semibold">DS Premium</span>
                            <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Ativo</span>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-xs transition-colors">Gerenciar</button>
                        </div>
                        <p className="text-white/50 text-xs">4K Ultra HD · 5 telas · Downloads ilimitados</p>
                        <p className="text-white/40 text-xs mt-1">Próxima cobrança: 15/01/2025 — R$ 49,90</p>
                      </div>
                    </div>
                    
                    {/* Notifications */}
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3 block">Notificações</label>
                      <div className="space-y-3">
                        <ToggleRow
                          icon={Bell}
                          label="Notificações push"
                          description="Novidades e recomendações"
                          checked={notifications}
                          onChange={setNotifications}
                        />
                        <ToggleRow
                          icon={Globe}
                          label="E-mail de novidades"
                          description="Receba por e-mail"
                          checked={emailNotifications}
                          onChange={setEmailNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profiles */}
              {activeSection === 'profiles' && (
                <div>
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">Gerenciar perfis</h2>
                  </div>
                  <div className="p-6">
                    <button
                      onClick={() => navigate('/profiles')}
                      className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                          {activeProfile?.nome?.charAt(0) || 'U'}
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Ir para seleção de perfis</p>
                          <p className="text-white/50 text-xs">Criar, editar e gerenciar perfis</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-white/40" />
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div>
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">Preferências de reprodução</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                        <Volume2 size={13} />Áudio padrão
                      </label>
                      <select
                        value={audioLang}
                        onChange={(e) => setAudioLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-all"
                      >
                        <option value="pt-BR" className="bg-gray-900">Português (Brasil)</option>
                        <option value="en-US" className="bg-gray-900">English (US)</option>
                        <option value="es-ES" className="bg-gray-900">Español</option>
                        <option value="fr-FR" className="bg-gray-900">Français</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                        <Subtitles size={13} />Legenda padrão
                      </label>
                      <select
                        value={subtitleLang}
                        onChange={(e) => setSubtitleLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-all"
                      >
                        <option value="off" className="bg-gray-900">Sem legendas</option>
                        <option value="pt-BR" className="bg-gray-900">Português (Brasil)</option>
                        <option value="en-US" className="bg-gray-900">English (US)</option>
                        <option value="es-ES" className="bg-gray-900">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                        <Wifi size={13} />Qualidade de reprodução
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'auto', label: 'Automático', desc: 'Ajusta conforme conexão' },
                          { val: 'hd', label: 'HD 1080p', desc: 'Melhor qualidade' },
                          { val: '4k', label: '4K Ultra HD', desc: 'Máxima qualidade' },
                          { val: 'sd', label: '480p', desc: 'Econômico' },
                        ].map(({ val, label, desc }) => (
                          <button
                            key={val}
                            onClick={() => setQuality(val)}
                            className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                              quality === val
                                ? 'bg-red-600/10 border-red-500'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              quality === val ? 'border-red-500 bg-red-500' : 'border-white/30'
                            }`}>
                              {quality === val && <Check size={10} className="text-white" />}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{label}</p>
                              <p className="text-white/40 text-xs">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <ToggleRow
                      icon={Monitor}
                      label="Reprodução automática"
                      description="Iniciar próximo episódio automaticamente"
                      checked={autoplay}
                      onChange={setAutoplay}
                    />

                    <button
                      onClick={handleSavePreferences}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                    >
                      <Save size={15} />
                      Salvar preferências
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeSection === 'privacy' && (
                <div>
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">Privacidade e dados</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white font-medium text-sm">Histórico de reprodução</p>
                          <p className="text-white/50 text-xs mt-0.5">
                            {activeProfile
                              ? `Perfil: ${activeProfile.nome}`
                              : 'Nenhum perfil ativo'}
                          </p>
                        </div>
                        <button
                          onClick={handleClearHistory}
                          className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 
                                     px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
                        >
                          <Trash2 size={12} />
                          Limpar histórico
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white font-medium text-sm">Histórico de buscas</p>
                          <p className="text-white/50 text-xs mt-0.5">Buscas recentes salvas</p>
                        </div>
                        <button
                          onClick={() => toast.success('Histórico de buscas limpo!')}
                          className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 
                                     px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
                        >
                          <Trash2 size={12} />
                          Limpar buscas
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-amber-600/20 rounded-xl p-4">
                      <p className="text-white font-medium text-sm mb-1">Excluir conta</p>
                      <p className="text-white/50 text-xs mb-3">
                        Esta ação é irreversível e removerá todos os seus dados permanentemente.
                      </p>
                      <button
                        onClick={() => toast.error('Entre em contato com o suporte para excluir sua conta.')}
                        className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                      >
                        Solicitar exclusão de conta →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div>
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">Aparência</h2>
                  </div>
                  <div className="p-6">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-4 block">Tema</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          theme === 'dark'
                            ? 'bg-red-600/10 border-red-500'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Moon size={20} className={theme === 'dark' ? 'text-red-400' : 'text-white/50'} />
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Escuro</p>
                          <p className="text-white/40 text-xs">Fundo preto</p>
                        </div>
                        {theme === 'dark' && <Check size={16} className="text-red-400 ml-auto" />}
                      </button>
                      <button
                        onClick={() => { if (theme !== 'light') toggleTheme(); }}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          theme === 'light'
                            ? 'bg-red-600/10 border-red-500'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Sun size={20} className={theme === 'light' ? 'text-yellow-400' : 'text-white/50'} />
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Claro</p>
                          <p className="text-white/40 text-xs">Fundo branco</p>
                        </div>
                        {theme === 'light' && <Check size={16} className="text-red-400 ml-auto" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-white/50" />
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-white/40 text-xs">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? 'bg-red-600' : 'bg-white/20'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
