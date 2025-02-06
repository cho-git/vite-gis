import { Map, View } from "ol"
import { fromLonLat } from "ol/proj"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Layers } from "../resources/MapLayer"
import { ScaleLine, defaults } from 'ol/control.js';
import { gisMap } from "../resources/Map"


export const mapStatusStore = (set) => ({
    map: gisMap,
    // map: gisMap(),
})

export const useMapStore = create(persist((...a) => ({
    ...mapStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))

