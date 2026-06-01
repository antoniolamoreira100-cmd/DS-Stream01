import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Content } from '../lib/mockData';
import { ContentCard } from './ContentCard';
import { useAppStore } from '../store/useAppStore';

interface ContentRowProps {
  title: string;
  contents: Content[];
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ContentRow({ title, contents, showProgress, size = 'md' }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeProfile = useAppStore((s) => s.activeProfile);
  const watchHistory = useAppStore((s) => s.watchHistory);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  if (contents.length === 0) return null;

  return (
    <motion.div
      className="mb-8 group/row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-white font-semibold text-base md:text-lg mb-3 px-4 md:px-8">
        {title}
      </h2>
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-8 z-10 w-10 md:w-14 bg-gradient-to-r from-black/80 to-transparent
                     flex items-center justify-start pl-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft size={28} className="text-white drop-shadow-lg" />
        </button>

        {/* Content scroll */}
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {contents.map((content) => {
            const history = activeProfile
              ? (watchHistory[activeProfile.id] || []).find((h) => h.content_id === content.id)
              : undefined;
            return (
              <ContentCard
                key={content.id}
                content={content}
                showProgress={showProgress}
                progressSeconds={history?.progresso_segundos}
                durationSeconds={content.duracao_min ? content.duracao_min * 60 : undefined}
                size={size}
              />
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-8 z-10 w-10 md:w-14 bg-gradient-to-l from-black/80 to-transparent
                     flex items-center justify-end pr-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight size={28} className="text-white drop-shadow-lg" />
        </button>
      </div>
    </motion.div>
  );
}
