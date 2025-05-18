import { create } from 'zustand';

type User = {
  id: string | undefined;
  name: string | undefined;
  email: string| undefined;
  profilePic:string | undefined;
};

type UserInfo = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  loadUser: () => void; // A method to load user from localStorage
};

export const useUserStore = create<UserInfo>((set) => ({
  user: null,

  // Load user from localStorage when the app starts
  loadUser: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },

  // Set user and save to localStorage
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Clear user data from both state and localStorage
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
