import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Info, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Content } from '../lib/mockData';
import { useAppStore, useMyList } from '../store/useAppStore';
import { StarRating } from './ui/StarRating';

interface ContentCardProps {
  content: Content;
  showProgress?: boolean;
  progressSeconds?: number;
  durationSeconds?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ContentCard({
  content,
  showProgress,
  progressSeconds = 0,
  durationSeconds,
  size = 'md',
}: ContentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const activeProfile = useAppStore((s) => s.activeProfile);
  const { inList, toggle } = useMyList(content);

  const sizeClasses = {
    sm: 'w-32 md:w-36',
    md: 'w-40 md:w-48',
    lg: 'w-48 md:w-56',
  };

  const progressPercent = durationSeconds && durationSeconds > 0
    ? Math.min((progressSeconds / durationSeconds) * 100, 100)
    : 0;

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProfile) return;
    toggle();
    toast.success(inList ? 'Removido da sua lista' : 'Adicionado à sua lista');
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/player/${content.id}`);
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/details/${content.id}`);
  };

  return (
    <motion.div
      className={`relative flex-shrink-0 ${sizeClasses[size]} cursor-pointer group`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/details/${content.id}`)}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
        {!imgError ? (
          <img
            src={content.thumbnail_url}
            alt={content.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Sem imagem</span>
          </div>
        )}

        {/* Classification badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/30">
          {content.classificacao_etaria === 'L' ? 'Livre' : `${content.classificacao_etaria}+`}
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
          {content.tipo === 'serie' ? 'Série' : 'Filme'}
        </div>

        {/* Progress bar */}
        {showProgress && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-red-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col justify-end p-2"
            >
              <div className="flex gap-1.5 justify-center mb-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlay}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                >
                  <Play size={14} className="text-black fill-black ml-0.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleList}
                  className="w-8 h-8 rounded-full bg-black/80 border border-white/40 flex items-center justify-center"
                >
                  {inList ? (
                    <Check size={13} className="text-white" />
                  ) : (
                    <Plus size={13} className="text-white" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleInfo}
                  className="w-8 h-8 rounded-full bg-black/80 border border-white/40 flex items-center justify-center"
                >
                  <Info size={13} className="text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-white text-xs font-semibold leading-tight line-clamp-1 group-hover:text-red-400 transition-colors">
          {content.titulo}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-white/50 text-[10px]">{content.ano}</span>
          {showProgress && progressSeconds > 0 && (
            <span className="flex items-center gap-0.5 text-white/40 text-[10px]">
              <Clock size={8} />
              {Math.floor(progressSeconds / 60)}min
            </span>
          )}
        </div>
        <StarRating rating={content.avaliacao} size={10} />
      </div>
    </motion.div>
  );
}
