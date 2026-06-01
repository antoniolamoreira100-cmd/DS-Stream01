import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Lock, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import type { Profile } from '../store/useAppStore';
import { AVATAR_OPTIONS } from '../lib/mockData';

const AVATAR_COLORS = [
  'from-red-600 to-red-800',
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-green-600 to-green-800',
  'from-orange-600 to-orange-800',
];

export function SelectProfilePage() {
  const navigate = useNavigate();
  const profiles = useAppStore((s) => s.profiles);
  const setActiveProfile = useAppStore((s) => s.setActiveProfile);
  const addProfile = useAppStore((s) => s.addProfile);
  const removeProfile = useAppStore((s) => s.removeProfile);
  const user = useAppStore((s) => s.user);

  const [editMode, setEditMode] = useState(false);
  const [pinModal, setPinModal] = useState<Profile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKids, setNewKids] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const handleSelectProfile = (profile: Profile) => {
    if (editMode) return;
    if (profile.is_kids && profile.pin) {
      setPinModal(profile);
      setPinInput('');
      setPinError('');
      return;
    }
    setActiveProfile(profile);
    navigate('/home');
  };

  const handlePinSubmit = () => {
    if (!pinModal) return;
    if (pinInput === pinModal.pin) {
      setActiveProfile(pinModal);
      navigate('/home');
    } else {
      setPinError('PIN incorreto');
      setPinInput('');
    }
  };

  const handleAddProfile = async () => {
    if (!newName.trim()) {
      toast.error('Digite um nome para o perfil');
      return;
    }
    if (profiles.length >= 5) {
      toast.error('Máximo de 5 perfis por conta');
      return;
    }
    if (!user) {
      toast.error('Usuário não autenticado. Faça login novamente.');
      return;
    }
    await addProfile({
      id: `p-${Date.now()}`,
      user_id: user.id,
      nome: newName.trim(),
      avatar_url: null,
      is_kids: newKids,
      pin: newKids ? '0000' : null,
      idioma_audio: 'pt-BR',
      idioma_legenda: 'pt-BR',
      qualidade: 'auto',
      created_at: new Date().toISOString(),
    });
    toast.success('Perfil criado com sucesso!');
    setAddModal(false);
    setNewName('');
    setNewKids(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-sm">DS</span>
            </div>
            <span className="text-white font-black text-xl">DS<span className="text-red-500">Stream</span></span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-semibold">
            {editMode ? 'Gerenciar perfis' : 'Quem está assistindo?'}
          </h1>
        </motion.div>

        {/* Profiles grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {profiles.map((profile, idx) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="relative">
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                              flex items-center justify-center text-3xl md:text-4xl font-black text-white
                              group-hover:ring-4 group-hover:ring-white transition-all duration-200
                              ${editMode ? 'opacity-80' : ''} shadow-xl select-none`}
                >
                  {AVATAR_OPTIONS[idx] || profile.nome.charAt(0).toUpperCase()}
                </div>

                {/* Edit overlay */}
                {editMode && (
                  <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                    <Pencil size={22} className="text-white" />
                  </div>
                )}

                {/* Kids badge */}
                {profile.is_kids && (
                  <div className="absolute -bottom-1.5 -right-1.5 bg-blue-500 rounded-full p-1">
                    <Lock size={10} className="text-white" />
                  </div>
                )}

                {/* Delete button in edit mode */}
                {editMode && profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProfile(profile.id);
                      toast.success('Perfil removido');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 z-10"
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
              <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                {profile.nome}
              </span>
              {profile.is_kids && (
                <span className="text-blue-400 text-xs -mt-1.5">Infantil</span>
              )}
            </motion.div>
          ))}

          {/* Add profile button */}
          {!editMode && profiles.length < 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: profiles.length * 0.07 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => setAddModal(true)}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-2 border-dashed border-white/20 
                              flex items-center justify-center group-hover:border-white/50 transition-all">
                <Plus size={32} className="text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
              <span className="text-white/40 text-sm group-hover:text-white/70 transition-colors">
                Adicionar perfil
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-6 py-2.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 
                       rounded-lg text-sm font-medium transition-all"
          >
            {editMode ? 'Concluído' : 'Gerenciar perfis'}
          </button>
        </div>
      </div>

      {/* PIN Modal */}
      <AnimatePresence>
        {pinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPinModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-xs text-center"
            >
              <Lock size={32} className="text-white/50 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-1">Perfil Infantil</h3>
              <p className="text-white/50 text-sm mb-6">Digite o PIN para acessar</p>
              
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="w-full text-center text-2xl tracking-[0.5em] bg-white/5 border border-white/10 
                           rounded-xl py-3 text-white focus:outline-none focus:border-red-500 transition-all"
                placeholder="••••"
                autoFocus
              />
              {pinError && <p className="text-red-400 text-sm mt-2">{pinError}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setPinModal(null)}
                  className="flex-1 py-2.5 border border-white/10 text-white/70 rounded-xl hover:bg-white/5 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all text-sm font-medium"
                >
                  Entrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Profile Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Novo perfil</h3>
                <button onClick={() => setAddModal(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Avatar picker */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {AVATAR_OPTIONS.slice(0, 8).map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAvatar(i)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all
                               ${selectedAvatar === i ? 'bg-red-600 ring-2 ring-red-400' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do perfil"
                maxLength={20}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm
                           focus:outline-none focus:border-red-500 transition-all mb-4"
              />

              <label className="flex items-center gap-3 cursor-pointer mb-6">
                <button
                  type="button"
                  onClick={() => setNewKids(!newKids)}
                  className={`w-10 h-6 rounded-full transition-all relative ${newKids ? 'bg-blue-500' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newKids ? 'left-5' : 'left-1'}`} />
                </button>
                <div>
                  <p className="text-white text-sm font-medium">Perfil infantil</p>
                  <p className="text-white/40 text-xs">Filtra conteúdo por idade</p>
                </div>
              </label>

              <button
                onClick={handleAddProfile}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Criar perfil
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
