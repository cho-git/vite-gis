// import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"


export const popupStore = (set) => ({
    PopOpen: false,
    title: null,
    component: null,
    callBack: null,
    setPopOpen: (open, title, compo, callBack) => set({ PopOpen: open, title: title, component: compo, callBack: callBack }),
})


export const useModalStore = create((...a) => ({
    ...popupStore(...a),
}));

