import { create } from "zustand";
import type { AuthorizeTypes } from "@/types/authTypes/authorizeTypes";

export const useAuthorizeStore = create<AuthorizeTypes>((set) => ({
  role: null,
  permissions: [],
  initializing: true,

  setRole: (role) => set({ role }),
  setPermissions: (permissions) => set({ permissions }),
  setInitializing: (initializing) => set({ initializing }),
  clearState: () => set({ role: null, permissions: [], initializing: false }),
}));
