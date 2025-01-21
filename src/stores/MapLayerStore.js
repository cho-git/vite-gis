import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"



export const mapLayerStatusStore = (set) => ({
    mapLayerStatus: {
        tilelayer: new TileLayer({
            source: new OSM(),
        }),
        
    }
})

export const useMapLayerStore = create(persist((...a) => ({
    ...mapLayerStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))