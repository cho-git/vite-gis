import { createJSONStorage, persist } from "zustand/middleware"
import { gisMap } from "../resources/Map"
import { create } from "zustand"


export const mapStatusStore = () => ({
    map: gisMap,
})

export const useMapStore = create(persist((...a) => ({
    ...mapStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))

