import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Plus, Check, ThumbsUp, ThumbsDown, Share2, ArrowLeft,
  Clock, Calendar, Star, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { ContentCard } from '../components/ContentCard';
import { StarRating } from '../components/ui/StarRating';
import { MOCK_CONTENTS, MOCK_EPISODES } from '../lib/mockData';
import { useAppStore, useMyList } from '../store/useAppStore';

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const activeProfile = useAppStore((s) => s.activeProfile);
  const rateContent = useAppStore((s) => s.rateContent);
  const getRating = useAppStore((s) => s.getRating);
  const getWatchProgress = useAppStore((s) => s.getWatchProgress);

  const content = MOCK_CONTENTS.find((c) => c.id === id);
  const { inList, toggle } = useMyList(content || MOCK_CONTENTS[0]);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Conteúdo não encontrado</p>
          <button onClick={() => navigate('/home')} className="text-red-400 hover:text-red-300">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  const episodes = MOCK_EPISODES.filter(
    (ep) => ep.content_id === content.id && ep.temporada === selectedSeason
  );

  const seasons = content.temporadas
    ? Array.from({ length: content.temporadas }, (_, i) => i + 1)
    : [];

  const similar = MOCK_CONTENTS
    .filter((c) => c.id !== content.id && c.generos.some((g) => content.generos.includes(g)))
    .slice(0, 6);

  const rating = activeProfile ? getRating(activeProfile.id, content.id) : undefined;
  const watchProgress = activeProfile ? getWatchProgress(activeProfile.id, content.id) : undefined;

  const handleToggleList = () => {
    toggle();
    toast.success(inList ? 'Removido da sua lista' : 'Adicionado à sua lista');
  };

  const handleRate = (curtiu: boolean) => {
    if (!activeProfile) return;
    rateContent(activeProfile.id, content.id, curtiu);
    toast.success(curtiu ? 'Você curtiu!' : 'Avaliado!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      toast.success('Link copiado!');
    }).catch(() => {
      toast.success('Link copiado!');
    });
  };

  const progressPercent = watchProgress && content.duracao_min
    ? Math.min((watchProgress.progresso_segundos / (content.duracao_min * 60)) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[65vh] overflow-hidden">
        <img
          src={content.backdrop_url}
          alt={content.titulo}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/40" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Content detail */}
      <div className="relative z-10 -mt-32 px-6 md:px-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded uppercase">
              {content.tipo === 'serie' ? 'Série Original' : 'Filme DS'}
            </span>
            <span className="text-xs text-white/60 border border-white/20 px-2 py-0.5 rounded">
              {content.classificacao_etaria === 'L' ? 'Livre' : `${content.classificacao_etaria}+`}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white text-3xl md:text-5xl font-black mb-3 leading-tight">
            {content.titulo}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <StarRating rating={content.avaliacao} />
            <div className="flex items-center gap-1.5 text-white/60">
              <Calendar size={13} />
              <span>{content.ano}</span>
            </div>
            {content.duracao_min && (
              <div className="flex items-center gap-1.5 text-white/60">
                <Clock size={13} />
                <span>{content.duracao_min} min</span>
              </div>
            )}
            {content.temporadas && (
              <div className="flex items-center gap-1.5 text-white/60">
                <span>{content.temporadas} temporadas</span>
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-5">
            {content.generos.map((g) => (
              <span key={g} className="text-xs text-white/60 border border-white/15 px-2.5 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Watch progress */}
          {watchProgress && progressPercent > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                <span>Progresso de reprodução</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => navigate(`/player/${content.id}`)}
              className="flex items-center gap-2.5 bg-white text-black font-bold px-7 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg text-sm"
            >
              <Play size={17} className="fill-black" />
              {watchProgress && progressPercent > 0 ? 'Continuar' : 'Assistir'}
            </button>
            <button
              onClick={handleToggleList}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm"
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
              {inList ? 'Na minha lista' : 'Minha lista'}
            </button>
            <button
              onClick={() => handleRate(true)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                rating?.curtiu === true ? 'bg-green-600 border-green-500' : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <ThumbsUp size={16} className="text-white" />
            </button>
            <button
              onClick={() => handleRate(false)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                rating?.curtiu === false ? 'bg-red-600 border-red-500' : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <ThumbsDown size={16} className="text-white" />
            </button>
            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <Share2 size={16} className="text-white" />
            </button>
          </div>

          {/* Layout: main + sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Synopsis */}
            <div className="md:col-span-2">
              <h2 className="text-white font-semibold text-lg mb-3">Sinopse</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                {expanded ? content.sinopse : content.sinopse.substring(0, 200) + (content.sinopse.length > 200 ? '...' : '')}
                {content.sinopse.length > 200 && (
                  <button onClick={() => setExpanded(!expanded)} className="text-red-400 ml-1 hover:text-red-300 text-sm">
                    {expanded ? ' ver menos' : ' ver mais'}
                  </button>
                )}
              </p>

              {/* Cast */}
              {content.elenco && content.elenco.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3">Elenco principal</h3>
                  <div className="flex flex-wrap gap-3">
                    {content.elenco.map((actor, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xs font-bold">
                          {actor.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{actor.nome}</p>
                          <p className="text-white/40 text-xs">{actor.personagem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details sidebar */}
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Gêneros</p>
                <p className="text-white/80 text-sm">{content.generos.join(', ')}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Ano</p>
                <p className="text-white/80 text-sm">{content.ano}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Classificação</p>
                <p className="text-white/80 text-sm">
                  {content.classificacao_etaria === 'L' ? 'Livre' : `${content.classificacao_etaria} anos`}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Avaliação</p>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-white/80 text-sm">{content.avaliacao}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes for series */}
          {content.tipo === 'serie' && seasons.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-xl">Episódios</h2>
                <div className="relative">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-red-500"
                  >
                    {seasons.map((s) => (
                      <option key={s} value={s} className="bg-gray-900">
                        Temporada {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                {episodes.length > 0 ? episodes.map((ep) => (
                  <motion.div
                    key={ep.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 cursor-pointer group transition-all"
                    onClick={() => navigate(`/player/${content.id}?episode=${ep.id}`)}
                  >
                    <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-800">
                      <img src={ep.thumbnail_url} alt={ep.titulo} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Play size={14} className="fill-black text-black ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] px-1 rounded font-bold">
                        E{ep.numero_episodio}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white text-sm font-semibold">{ep.titulo}</h4>
                        <span className="text-white/40 text-xs flex-shrink-0 flex items-center gap-1">
                          <Clock size={10} />{ep.duracao_min}min
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mt-1 line-clamp-2">{ep.sinopse}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">Episódios em breve</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Similar content */}
          {similar.length > 0 && (
            <div className="mt-10">
              <h2 className="text-white font-semibold text-xl mb-4">Você também pode gostar</h2>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {similar.map((item) => (
                  <ContentCard key={item.id} content={item} size="md" />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
