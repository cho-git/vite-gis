import { persist, createJSONStorage } from 'zustand/middleware'
import { create } from 'zustand';

export const useMenuListStore = (set) => ({
    menuList: [],
    runningPage: [],
    currentMenuItem: null,
    setMenuList: (list) => set({ menuList: list }),
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

export const menuParse = async (idx) => {
    const setCurrentMenu = useMenuStore.getState().setCurrentMenuItem;
    const menu = useMenuStore.getState().menuList;
    if (!menu || menu.length === 0) return
    const targetmenu = menu.find((item) => item.MENU_IDX === idx);
    const route = targetmenu.PAGE_ROUTE;
    const folder = route.split('/')[1];
    const page = route.split('/')[2].replace(/.view/gi, '');
    try {
        const component = await import(`../features/${folder}/${page}`);
        // console.log(component)
        setCurrentMenu({
            idx: targetmenu.MENU_IDX,
            name: targetmenu.MENU_NM,
            PAGE_ROUTE: targetmenu.PAGE_ROUTE,
            PageComponent: component.default, // 반드시 export default 포함
        })
    } catch (error) {
        console.error(`Failed to load component at ../features/${folder}/${page}:`, error);
    }
}