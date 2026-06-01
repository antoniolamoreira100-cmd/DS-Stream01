import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { ContentRow } from '../components/ContentRow';
import { SkeletonRow, SkeletonHero } from '../components/ui/SkeletonCard';
import { MOCK_CONTENTS } from '../lib/mockData';
import { useAppStore } from '../store/useAppStore';

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeProfile = useAppStore((s) => s.activeProfile);
  const watchHistory = useAppStore((s) => s.watchHistory);


  const filterTipo = searchParams.get('tipo');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const contents = useMemo(() => {
    let filtered = MOCK_CONTENTS;
    if (activeProfile?.is_kids) {
      filtered = filtered.filter((c) => c.classificacao_etaria === 'L' || c.classificacao_etaria === '10' || c.classificacao_etaria === '12');
    }
    if (filterTipo) {
      filtered = filtered.filter((c) => c.tipo === filterTipo);
    }
    return filtered;
  }, [filterTipo, activeProfile]);

  const profileHistory = activeProfile ? (watchHistory[activeProfile.id] || []) : [];
  const continueWatching = contents.filter((c) =>
    profileHistory.some((h) => h.content_id === c.id && !h.concluido && h.progresso_segundos > 0)
  );

  const popular = [...contents].sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 8);
  const newContent = [...contents].sort((a, b) => b.ano - a.ano).slice(0, 8);
  const series = contents.filter((c) => c.tipo === 'serie');
  const movies = contents.filter((c) => c.tipo === 'filme');
  const action = contents.filter((c) => c.generos.some((g) => ['Ação', 'Thriller'].includes(g)));
  const drama = contents.filter((c) => c.generos.includes('Drama'));
  const scifi = contents.filter((c) => c.generos.some((g) => ['Ficção Científica', 'Sci-Fi'].includes(g)));

  const heroContents = contents.filter((c) => c.avaliacao >= 8.5).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* Hero */}
      {loading ? <SkeletonHero /> : <HeroBanner contents={heroContents.length > 0 ? heroContents : contents.slice(0, 4)} />}

      {/* Content rows */}
      <div className="relative z-10 -mt-10 md:-mt-16 pb-16">
        {loading ? (
          <div className="px-4 md:px-8 pt-12">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {continueWatching.length > 0 && (
              <ContentRow
                title="Continuar assistindo"
                contents={continueWatching}
                showProgress
              />
            )}
            <ContentRow title="Populares agora" contents={popular} size="md" />
            {!filterTipo && (
              <>
                <ContentRow title="Adicionados recentemente" contents={newContent} />
                {series.length > 0 && <ContentRow title="Séries em destaque" contents={series} />}
                {movies.length > 0 && <ContentRow title="Filmes imperdíveis" contents={movies} />}
                {action.length > 0 && <ContentRow title="Ação & Suspense" contents={action} />}
                {drama.length > 0 && <ContentRow title="Drama & Emoção" contents={drama} />}
                {scifi.length > 0 && <ContentRow title="Ficção Científica" contents={scifi} />}
              </>
            )}
            {filterTipo === 'serie' && <ContentRow title="Todas as séries" contents={series} size="lg" />}
            {filterTipo === 'filme' && <ContentRow title="Todos os filmes" contents={movies} size="lg" />}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-[10px]">DS</span>
            </div>
            <span className="text-white/30 text-sm font-bold">DS<span className="text-red-600/50">Stream</span></span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {['Áudio e legendas', 'Central de ajuda', 'Imprensa', 'Privacidade'].map((item) => (
              <button key={item} className="text-white/30 text-xs hover:text-white/60 text-left transition-colors">
                {item}
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs">© 2024 DS Stream. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
