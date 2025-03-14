import { createJSONStorage, persist } from "zustand/middleware"
import { gisMap } from "../resources/Map"
import { create } from "zustand"


export const mapStatusStore = (set) => ({
    map: gisMap,
    // setMap: (mapInstance) => set({ map: mapInstance }),
})

export const useMapStore = create(persist((...a) => ({
    ...mapStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))

