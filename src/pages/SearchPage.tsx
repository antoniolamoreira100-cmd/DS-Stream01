import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ContentCard } from '../components/ContentCard';
import { MOCK_CONTENTS } from '../lib/mockData';

const GENRES = ['Ação', 'Drama', 'Ficção Científica', 'Suspense', 'Terror', 'Romance', 'Fantasia', 'Comédia', 'Mistério', 'Thriller'];
const TYPES = ['Todos', 'Filme', 'Série'];
const RATINGS = ['Todos', 'L', '10', '12', '14', '16', '18'];

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const updateDebounced = useCallback(
    debounce((val: string) => setDebouncedQuery(val), 300),
    []
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateDebounced(val);
  };

  const filteredContents = useMemo(() => {
    let results = MOCK_CONTENTS;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.titulo.toLowerCase().includes(q) ||
          c.sinopse.toLowerCase().includes(q) ||
          c.generos.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (selectedType !== 'Todos') {
      const tipo = selectedType === 'Filme' ? 'filme' : 'serie';
      results = results.filter((c) => c.tipo === tipo);
    }

    if (selectedGenre) {
      results = results.filter((c) => c.generos.includes(selectedGenre));
    }

    if (selectedRating !== 'Todos') {
      results = results.filter((c) => c.classificacao_etaria === selectedRating);
    }

    return results;
  }, [debouncedQuery, selectedType, selectedGenre, selectedRating]);

  const popularCategories = [
    { label: 'Ação & Aventura', genre: 'Ação' },
    { label: 'Ficção Científica', genre: 'Ficção Científica' },
    { label: 'Drama', genre: 'Drama' },
    { label: 'Suspense', genre: 'Suspense' },
    { label: 'Terror', genre: 'Terror' },
    { label: 'Romance', genre: 'Romance' },
    { label: 'Fantasia', genre: 'Fantasia' },
    { label: 'Comédia', genre: 'Comédia' },
  ];

  const hasFilters = selectedType !== 'Todos' || selectedGenre !== '' || selectedRating !== 'Todos';

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-red-600/40 text-white rounded px-0.5">{part}</mark> : part
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 pb-16">
        {/* Search input */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Buscar filmes, séries, gêneros..."
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white 
                         placeholder:text-white/30 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDebouncedQuery(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              showFilters || hasFilters
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:block">Filtros</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-white" />}
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type filter */}
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Tipo</p>
                  <div className="flex gap-2 flex-wrap">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedType === t ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre filter */}
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Gênero</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {GENRES.slice(0, 6).map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedGenre === g ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating filter */}
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Classificação</p>
                  <div className="flex gap-2 flex-wrap">
                    {RATINGS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedRating === r ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {r === 'Todos' ? 'Todos' : r === 'L' ? 'Livre' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={() => { setSelectedType('Todos'); setSelectedGenre(''); setSelectedRating('Todos'); }}
                  className="mt-3 text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                >
                  <X size={12} />
                  Limpar filtros
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state — browse categories */}
        {!debouncedQuery && !hasFilters ? (
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">Explorar por categoria</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
              {popularCategories.map((cat) => (
                <motion.button
                  key={cat.genre}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGenre(cat.genre)}
                  className="relative h-20 rounded-xl overflow-hidden bg-gradient-to-br from-red-900/50 to-gray-900 border border-white/10
                             flex items-center justify-center px-4 hover:border-white/30 transition-all group"
                >
                  <span className="text-white font-semibold text-sm">{cat.label}</span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all" />
                </motion.button>
              ))}
            </div>

            <h2 className="text-white font-semibold text-lg mb-4">Populares agora</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {MOCK_CONTENTS.sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 6).map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </div>
        ) : (
          /* Search results */
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                {debouncedQuery && (
                  <p className="text-white/60 text-sm">
                    {filteredContents.length} resultado{filteredContents.length !== 1 ? 's' : ''} para{' '}
                    <span className="text-white font-medium">"{debouncedQuery}"</span>
                  </p>
                )}
                {!debouncedQuery && hasFilters && (
                  <p className="text-white/60 text-sm">
                    {filteredContents.length} resultado{filteredContents.length !== 1 ? 's' : ''} com os filtros aplicados
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredContents.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                >
                  {filteredContents.map((content) => (
                    <div key={content.id} onClick={() => navigate(`/details/${content.id}`)}>
                      <ContentCard content={content} />
                      {debouncedQuery && (
                        <p className="text-white/60 text-[10px] mt-1 px-0.5 line-clamp-1">
                          {highlightText(content.titulo, debouncedQuery)}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-white/50 text-sm">
                    Tente outra busca ou ajuste os filtros
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
