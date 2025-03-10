import { createJSONStorage, persist } from "zustand/middleware"
import { gisMap } from "../resources/Map"
import { create } from "zustand"


export const modalStatusStore = (set) => ({
    open: false,
    title: null,
    compo: null,
    setOpen: (open, title, component) => set({ open: open, title: title, compo, component }),
})

export const useModalStore = create(persist((...a) => ({
    ...modalStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))

