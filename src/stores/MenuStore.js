import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export const useMenuListStore = (set) => ({
    menulist: [],
    currentMenuItem: null,
    setMenuList: (list) => set({ menulist: list }),
    setCurrentMenuItem: (menu) => set({ currentMenuItem: menu }),
});

export const useMenuStore = create(persist((...a) => ({
    ...useMenuListStore(...a),
}),
    {
        name: 'menu-storage',
        storage: createJSONStorage(() => sessionStorage),
    },
));
