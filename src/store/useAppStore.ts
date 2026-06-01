import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Content } from '../lib/mockData';

export interface Profile {
  id: string;
  user_id: string;
  nome: string;
  avatar_url: string | null;
  is_kids: boolean;
  pin: string | null;
  idioma_audio: string;
  idioma_legenda: string;
  qualidade: string;
  created_at: string;
}

export interface WatchHistoryItem {
  content_id: string;
  episode_id?: string;
  progresso_segundos: number;
  assistido_em: string;
  concluido: boolean;
}

export interface MyListItem {
  content_id: string;
  adicionado_em: string;
}

export interface RatingItem {
  content_id: string;
  curtiu: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
}

interface AppState {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // Profiles
  profiles: Profile[];
  activeProfile: Profile | null;
  
  // Per-profile data
  watchHistory: Record<string, WatchHistoryItem[]>;
  myList: Record<string, MyListItem[]>;
  ratings: Record<string, RatingItem[]>;
  
  // UI
  theme: 'dark' | 'light';
  
  // Actions
  login: (user: { id: string; email: string; nome: string }) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => Promise<void>;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (profile: Profile | null) => void;
  loadUserProfiles: (userId: string) => Promise<void>;
  
  // Watch history
  updateWatchProgress: (profileId: string, contentId: string, progressSeconds: number, episodeId?: string, concluded?: boolean) => void;
  getWatchProgress: (profileId: string, contentId: string) => WatchHistoryItem | undefined;
  clearHistory: (profileId: string) => void;
  
  // My List
  addToMyList: (profileId: string, contentId: string) => void;
  removeFromMyList: (profileId: string, contentId: string) => void;
  isInMyList: (profileId: string, contentId: string) => boolean;
  
  // Ratings
  rateContent: (profileId: string, contentId: string, curtiu: boolean) => void;
  getRating: (profileId: string, contentId: string) => RatingItem | undefined;
  
  // Theme
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      profiles: [],
      activeProfile: null,
      watchHistory: {},
      myList: {},
      ratings: {},
      theme: 'dark',

      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.log('Supabase signOut error:', error);
        }
        set({
          user: null,
          isAuthenticated: false,
          activeProfile: null,
          profiles: [],
        });
      },

      clearAuth: () => set({ user: null, isAuthenticated: false, activeProfile: null, profiles: [] }),

      setProfiles: (profiles) => set({ profiles }),
      
      addProfile: async (profile) => {
        set((state) => ({ profiles: [...state.profiles, profile] }));
        const userId = profile.user_id;
        if (!userId) return;

        const { data, error } = await supabase
          .from('profiles')
          .insert({
            user_id: profile.user_id,
            nome: profile.nome,
            avatar_url: profile.avatar_url,
            is_kids: profile.is_kids,
            pin: profile.pin,
            idioma_audio: profile.idioma_audio,
            idioma_legenda: profile.idioma_legenda,
            qualidade: profile.qualidade,
          } as any);

        if (error) {
          console.log('Supabase insert profile error:', error);
        } else {
          console.log('Supabase inserted profile:', data);
        }
      },
      
      updateProfile: (id, updates) => set((state) => ({
        profiles: state.profiles.map((p) => p.id === id ? { ...p, ...updates } : p),
        activeProfile: state.activeProfile?.id === id
          ? { ...state.activeProfile, ...updates }
          : state.activeProfile,
      })),
      
      removeProfile: (id) => set((state) => ({
        profiles: state.profiles.filter((p) => p.id !== id),
        activeProfile: state.activeProfile?.id === id ? null : state.activeProfile,
      })),

      setActiveProfile: (profile) => set({ activeProfile: profile }),
      loadUserProfiles: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.log('Supabase loadUserProfiles error:', error);
          return;
        }

        set({ profiles: data ?? [] });
      },

      updateWatchProgress: (profileId, contentId, progressSeconds, episodeId, concluded = false) => {
        set((state) => {
          const profileHistory = state.watchHistory[profileId] || [];
          const existingIndex = profileHistory.findIndex(
            (h) => h.content_id === contentId && h.episode_id === episodeId
          );
          const newItem: WatchHistoryItem = {
            content_id: contentId,
            episode_id: episodeId,
            progresso_segundos: progressSeconds,
            assistido_em: new Date().toISOString(),
            concluido: concluded,
          };
          const updatedHistory = existingIndex >= 0
            ? profileHistory.map((h, i) => i === existingIndex ? newItem : h)
            : [newItem, ...profileHistory];
          return {
            watchHistory: { ...state.watchHistory, [profileId]: updatedHistory },
          };
        });
      },

      getWatchProgress: (profileId, contentId) => {
        const profileHistory = get().watchHistory[profileId] || [];
        return profileHistory.find((h) => h.content_id === contentId);
      },

      clearHistory: (profileId) => set((state) => ({
        watchHistory: { ...state.watchHistory, [profileId]: [] },
      })),

      addToMyList: (profileId, contentId) => {
        set((state) => {
          const profileList = state.myList[profileId] || [];
          if (profileList.some((item) => item.content_id === contentId)) return state;
          return {
            myList: {
              ...state.myList,
              [profileId]: [...profileList, { content_id: contentId, adicionado_em: new Date().toISOString() }],
            },
          };
        });
      },

      removeFromMyList: (profileId, contentId) => {
        set((state) => ({
          myList: {
            ...state.myList,
            [profileId]: (state.myList[profileId] || []).filter((item) => item.content_id !== contentId),
          },
        }));
      },

      isInMyList: (profileId, contentId) => {
        return (get().myList[profileId] || []).some((item) => item.content_id === contentId);
      },

      rateContent: (profileId, contentId, curtiu) => {
        set((state) => {
          const profileRatings = state.ratings[profileId] || [];
          const existingIndex = profileRatings.findIndex((r) => r.content_id === contentId);
          const newRating: RatingItem = { content_id: contentId, curtiu };
          const updatedRatings = existingIndex >= 0
            ? profileRatings.map((r, i) => i === existingIndex ? newRating : r)
            : [...profileRatings, newRating];
          return {
            ratings: { ...state.ratings, [profileId]: updatedRatings },
          };
        });
      },

      getRating: (profileId, contentId) => {
        return (get().ratings[profileId] || []).find((r) => r.content_id === contentId);
      },

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'ds-stream-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        profiles: state.profiles,
        watchHistory: state.watchHistory,
        myList: state.myList,
        ratings: state.ratings,
        theme: state.theme,
      }),
    }
  )
);

// Selector for active profile's my list
export function useMyList(content: Content) {
  const activeProfile = useAppStore((s) => s.activeProfile);
  const isInMyList = useAppStore((s) => s.isInMyList);
  const addToMyList = useAppStore((s) => s.addToMyList);
  const removeFromMyList = useAppStore((s) => s.removeFromMyList);
  
  const inList = activeProfile ? isInMyList(activeProfile.id, content.id) : false;
  
  const toggle = () => {
    if (!activeProfile) return;
    if (inList) {
      removeFromMyList(activeProfile.id, content.id);
    } else {
      addToMyList(activeProfile.id, content.id);
    }
  };
  
  return { inList, toggle };
}
