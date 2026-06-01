import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Content } from '../lib/mockData';
import { useMyList } from '../store/useAppStore';

interface HeroBannerProps {
  contents: Content[];
}

function HeroSlide({ content, isActive }: { content: Content; isActive: boolean }) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { inList, toggle } = useMyList(content);

  const handleToggleList = () => {
    toggle();
    toast.success(inList ? 'Removido da sua lista' : 'Adicionado à sua lista');
  };

  const synopsis = content.sinopse;
  const isLong = synopsis.length > 140;
  const displaySynopsis = isLong && !expanded
    ? synopsis.substring(0, 140) + '...'
    : synopsis;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={content.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Backdrop image */}
          <div className="absolute inset-0">
            {!imgError ? (
              <img
                src={content.backdrop_url}
                alt={content.titulo}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Sem imagem</span>
              </div>
            )}
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 pb-28 md:pb-32 px-8 md:px-16 max-w-2xl">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded uppercase">
                {content.tipo === 'serie' ? 'Série Original' : 'Filme DS'}
              </span>
              <span className="text-xs text-white/60 border border-white/20 px-2 py-0.5 rounded">
                {content.classificacao_etaria === 'L' ? 'Livre' : `${content.classificacao_etaria}+`}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 drop-shadow-lg"
            >
              {content.titulo}
            </motion.h1>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-4 text-sm text-white/70"
            >
              <span className="font-bold">Avaliação {content.avaliacao.toFixed(1)}</span>
              <span>{content.ano}</span>
              {content.duracao_min && <span>{content.duracao_min} min</span>}
              {content.temporadas && <span>{content.temporadas} temporadas</span>}
              <span>{content.generos.slice(0, 2).join(' · ')}</span>
            </motion.div>

            {/* Synopsis */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-white/70 text-sm leading-relaxed mb-6"
            >
              {displaySynopsis}
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-white/50 hover:text-white ml-1 underline text-xs"
                >
                  {expanded ? 'ver menos' : 'ver mais'}
                </button>
              )}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <button
                onClick={() => navigate(`/player/${content.id}`)}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg
                           hover:bg-white/90 transition-all shadow-lg text-sm"
              >
                <Play size={16} className="fill-black" />
                Assistir
              </button>
              <button
                onClick={() => navigate(`/details/${content.id}`)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3 rounded-lg
                           backdrop-blur-sm transition-all text-sm border border-white/20"
              >
                <Info size={16} />
                Mais informações
              </button>
              <button
                onClick={handleToggleList}
                className="w-10 h-10 rounded-full bg-black/50 border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                {inList ? <Check size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="w-10 h-10 rounded-full bg-black/50 border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroBanner({ contents }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroContents = contents.slice(0, 4);

  useEffect(() => {
    if (heroContents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContents.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroContents.length]);

  if (heroContents.length === 0) return null;

  return (
    <div className="relative h-[85vh] min-h-[500px] overflow-hidden bg-gray-950">
      {heroContents.map((content, idx) => (
        <HeroSlide key={content.id} content={content} isActive={idx === currentIndex} />
      ))}

      {/* Navigation arrows */}
      {heroContents.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + heroContents.length) % heroContents.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 
                       flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % heroContents.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 
                       flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {heroContents.length > 1 && (
        <div className="absolute bottom-24 right-8 md:right-16 flex gap-2 z-10">
          {heroContents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
