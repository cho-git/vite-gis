import { create } from'zustand';
import { persist, createJSONStorage  } from 'zustand/middleware'

export const useLoginStatusStore = (set) => ({
    LoginStatus: false,
    setLoginStatus: (bull) => set({LoginStatus : bull}),
});

export const useLoginStore = create(persist((...a) => ({
    ...useLoginStatusStore(...a),
    }),
    {
      name: 'login-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
));