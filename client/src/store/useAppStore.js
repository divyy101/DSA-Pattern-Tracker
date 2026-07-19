import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Auth & Profile State
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })(),

  // LeetCode Data Cache
  leetcodeStats: null,
  leetcodeLoading: false,
  leetcodeError: null,

  // UI States
  isCommandPaletteOpen: false,
  activeView: 'table', // 'table' | 'kanban' | 'grid'
  themeMode: 'dark', // 'dark' | 'light'

  // Action Methods
  setLoggedIn: (isLoggedIn, userData = {}) => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
    set({ isLoggedIn, user: userData });
  },

  updateUser: (updatedFields) => {
    const newUser = { ...get().user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
  },

  setLeetCodeStats: (stats) => set({ leetcodeStats: stats, leetcodeLoading: false, leetcodeError: null }),
  setLeetCodeLoading: (loading) => set({ leetcodeLoading: loading }),
  setLeetCodeError: (error) => set({ leetcodeError: error, leetcodeLoading: false }),

  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setActiveView: (view) => set({ activeView: view }),
  toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
}));
