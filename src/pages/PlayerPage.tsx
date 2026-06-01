import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, ArrowLeft, Settings, Subtitles,
  X, List
} from 'lucide-react';
import { MOCK_CONTENTS, MOCK_EPISODES } from '../lib/mockData';
import { useAppStore } from '../store/useAppStore';

const DEMO_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const episodeId = searchParams.get('episode');

  const content = MOCK_CONTENTS.find((c) => c.id === id);
  const episodes = MOCK_EPISODES.filter((ep) => ep.content_id === id);
  const currentEpisode = episodeId ? episodes.find((ep) => ep.id === episodeId) : episodes[0];
  const episodeIndex = currentEpisode ? episodes.indexOf(currentEpisode) : -1;
  const nextEpisode = episodeIndex >= 0 && episodeIndex < episodes.length - 1 ? episodes[episodeIndex + 1] : null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(5);
  const [quality, setQuality] = useState('Auto');
  const [showSettings, setShowSettings] = useState(false);

  const activeProfile = useAppStore((s) => s.activeProfile);
  const updateWatchProgress = useAppStore((s) => s.updateWatchProgress);
  const getWatchProgress = useAppStore((s) => s.getWatchProgress);

  // Resume from saved position
  useEffect(() => {
    if (!videoRef.current || !activeProfile || !content) return;
    const history = getWatchProgress(activeProfile.id, content.id);
    if (history && history.progresso_segundos > 30) {
      videoRef.current.currentTime = history.progresso_segundos;
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (!activeProfile || !content || currentTime < 5) return;
    const timer = setInterval(() => {
      updateWatchProgress(
        activeProfile.id,
        content.id,
        Math.floor(currentTime),
        currentEpisode?.id,
        duration > 0 && currentTime >= duration * 0.9
      );
    }, 10000);
    return () => clearInterval(timer);
  }, [currentTime, activeProfile, content, duration]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Next episode countdown
  useEffect(() => {
    if (!showNextEpisode) return;
    setNextCountdown(5);
    const timer = setInterval(() => {
      setNextCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (nextEpisode) navigate(`/player/${id}?episode=${nextEpisode.id}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showNextEpisode]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        skip(10);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skip(-10);
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'm':
        setMuted((m) => !m);
        break;
    }
  }, [togglePlay, skip, toggleFullscreen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = muted;
  }, [volume, muted]);

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Conteúdo não encontrado</p>
          <button onClick={() => navigate('/home')} className="text-red-400">Voltar</button>
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onMouseMove={resetControlsTimer}
      onClick={() => { togglePlay(); resetControlsTimer(); }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={DEMO_VIDEO}
        className="w-full h-full object-contain"
        onTimeUpdate={(e) => {
          const t = (e.target as HTMLVideoElement).currentTime;
          setCurrentTime(t);
          if (duration > 0 && t / duration > 0.95 && nextEpisode && !showNextEpisode) {
            setShowNextEpisode(true);
          }
        }}
        onDurationChange={(e) => setDuration((e.target as HTMLVideoElement).duration)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { if (nextEpisode) setShowNextEpisode(true); }}
        preload="metadata"
      />

      {/* Buffering */}
      <AnimatePresence>
        {buffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-sm md:text-base">{content.titulo}</h2>
                {currentEpisode && (
                  <p className="text-white/60 text-xs">
                    T{currentEpisode.temporada} E{currentEpisode.numero_episodio} — {currentEpisode.titulo}
                  </p>
                )}
              </div>
              {episodes.length > 0 && (
                <button
                  onClick={() => setShowEpisodes(!showEpisodes)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
                >
                  <List size={16} />
                  <span className="hidden md:block">Episódios</span>
                </button>
              )}
            </div>

            {/* Bottom controls */}
            <div className="bg-gradient-to-t from-black/90 to-transparent px-4 md:px-8 pb-6 pt-16">
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/70 text-xs w-12 text-right">{formatTime(currentTime)}</span>
                <div className="relative flex-1 group/seek">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progressPercent}
                    onChange={(e) => {
                      e.stopPropagation();
                      const val = (parseFloat(e.target.value) / 100) * duration;
                      if (videoRef.current) videoRef.current.currentTime = val;
                      setCurrentTime(val);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #e50914 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                    }}
                  />
                </div>
                <span className="text-white/70 text-xs w-12">{formatTime(duration)}</span>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); skip(-10); }}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Voltar 10s (←)"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/90 transition-all"
                >
                  {playing
                    ? <Pause size={20} className="fill-black" />
                    : <Play size={20} className="fill-black ml-0.5" />
                  }
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); skip(10); }}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Avançar 10s (→)"
                >
                  <SkipForward size={20} />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      e.stopPropagation();
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      if (val > 0) setMuted(false);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200 h-1 rounded-full appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    style={{
                      background: `linear-gradient(to right, white ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(muted ? 0 : volume) * 100}%)`,
                    }}
                  />
                </div>

                <div className="flex-1" />

                <span className="text-white/60 text-xs hidden md:block">{quality}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Subtitles size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-28 right-8 bg-black/90 border border-white/10 rounded-xl p-4 w-52 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-semibold">Qualidade</span>
              <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                <X size={14} />
              </button>
            </div>
            {['Auto', 'HD 1080p', 'HD 720p', '480p'].map((q) => (
              <button
                key={q}
                onClick={() => { setQuality(q); setShowSettings(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  quality === q ? 'bg-red-600 text-white' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episodes panel */}
      <AnimatePresence>
        {showEpisodes && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute top-0 right-0 h-full w-72 bg-black/95 border-l border-white/10 z-30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Episódios</h3>
              <button onClick={() => setShowEpisodes(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => { navigate(`/player/${id}?episode=${ep.id}`); setShowEpisodes(false); }}
                  className={`w-full text-left flex gap-3 p-2 rounded-xl transition-all ${
                    ep.id === episodeId ? 'bg-red-600/20 border border-red-600/30' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <img src={ep.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">E{ep.numero_episodio} — {ep.titulo}</p>
                    <p className="text-white/40 text-[10px]">{ep.duracao_min}min</p>
                  </div>
                </button>
              ))}
              {episodes.length === 0 && (
                <p className="text-white/40 text-sm text-center py-8">Sem episódios disponíveis</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next episode card */}
      <AnimatePresence>
        {showNextEpisode && nextEpisode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-28 right-8 bg-black/90 border border-white/10 rounded-2xl p-4 w-72 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs">Próximo episódio em {nextCountdown}s</span>
              <button onClick={() => setShowNextEpisode(false)} className="text-white/40 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                <img src={nextEpisode.thumbnail_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">E{nextEpisode.numero_episodio}</p>
                <p className="text-white/60 text-xs line-clamp-1">{nextEpisode.titulo}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/player/${id}?episode=${nextEpisode.id}`)}
              className="w-full mt-3 bg-white text-black font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-white/90 transition-all"
            >
              <Play size={14} className="fill-black" />
              Próximo episódio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play icon when paused */}
      <AnimatePresence>
        {!playing && !buffering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
              <Play size={36} className="text-white fill-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
