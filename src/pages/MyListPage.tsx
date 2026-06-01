import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, SortAsc, Film, Tv, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { ContentCard } from '../components/ContentCard';
import { MOCK_CONTENTS } from '../lib/mockData';
import { useAppStore } from '../store/useAppStore';

type SortOption = 'added' | 'name' | 'rating';
type TypeFilter = 'all' | 'filme' | 'serie';

export function MyListPage() {
  const activeProfile = useAppStore((s) => s.activeProfile);
  const myList = useAppStore((s) => s.myList);
  const removeFromMyList = useAppStore((s) => s.removeFromMyList);
  const [sortBy, setSortBy] = useState<SortOption>('added');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const profileList = activeProfile ? (myList[activeProfile.id] || []) : [];

  const listContents = useMemo(() => {
    let items = profileList
      .map((item) => ({
        ...item,
        content: MOCK_CONTENTS.find((c) => c.id === item.content_id),
      }))
      .filter((item) => item.content !== undefined);

    if (typeFilter !== 'all') {
      items = items.filter((item) => item.content!.tipo === typeFilter);
    }

    switch (sortBy) {
      case 'name':
        items.sort((a, b) => a.content!.titulo.localeCompare(b.content!.titulo));
        break;
      case 'rating':
        items.sort((a, b) => b.content!.avaliacao - a.content!.avaliacao);
        break;
      case 'added':
      default:
        items.sort((a, b) => new Date(b.adicionado_em).getTime() - new Date(a.adicionado_em).getTime());
        break;
    }

    return items;
  }, [profileList, sortBy, typeFilter]);

  const handleRemove = (contentId: string, titulo: string) => {
    if (!activeProfile) return;
    removeFromMyList(activeProfile.id, contentId);
    toast.success(`"${titulo}" removido da lista`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <List size={24} className="text-red-500" />
            <h1 className="text-white text-2xl md:text-3xl font-bold">Minha Lista</h1>
          </div>
          <p className="text-white/50 text-sm">
            {listContents.length} {listContents.length === 1 ? 'item' : 'itens'} salvos
          </p>
        </motion.div>

        {/* Filters & Sort */}
        {profileList.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Type filter */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
              {([['all', 'Todos'], ['filme', 'Filmes'], ['serie', 'Séries']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTypeFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    typeFilter === val ? 'bg-red-600 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {val === 'filme' && <Film size={12} />}
                  {val === 'serie' && <Tv size={12} />}
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc size={14} className="text-white/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 transition-all"
              >
                <option value="added" className="bg-gray-900">Mais recentes</option>
                <option value="name" className="bg-gray-900">Nome A-Z</option>
                <option value="rating" className="bg-gray-900">Melhor avaliados</option>
              </select>
            </div>

            {/* Clear all */}
            {profileList.length > 0 && (
              <button
                onClick={() => {
                  if (!activeProfile) return;
                  profileList.forEach((item) => removeFromMyList(activeProfile.id, item.content_id));
                  toast.success('Lista limpa!');
                }}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs transition-colors ml-auto"
              >
                <Trash2 size={12} />
                Limpar tudo
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {listContents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-6 text-base text-white/70">Sem itens na lista</div>
              <h2 className="text-white text-xl font-semibold mb-2">
                {profileList.length === 0 ? 'Sua lista está vazia' : 'Nenhum resultado'}
              </h2>
              <p className="text-white/50 text-sm max-w-sm">
                {profileList.length === 0
                  ? 'Adicione filmes e séries à sua lista para assistir mais tarde. Basta clicar no + em qualquer conteúdo.'
                  : 'Tente outro filtro ou tipo de conteúdo.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {listContents.map(({ content, adicionado_em }) => (
                content && (
                  <motion.div
                    key={content.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group"
                  >
                    <ContentCard content={content} />
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(content.id, content.titulo)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 border border-white/20 
                                 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20
                                 hover:bg-red-600 hover:border-red-500"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                    <p className="text-white/30 text-[10px] mt-1 px-0.5">
                      Adicionado {new Date(adicionado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </motion.div>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
