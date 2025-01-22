import { Map, View } from "ol"
import Layer from "ol/layer/Layer"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from "ol/layer/VectorTile"
import { fromLonLat } from "ol/proj"
import { OSM } from "ol/source"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Layers } from "../resources/MapLayer"



export const mapStatusStore = (set) => ({
    VarMap: new Map({
        view: new View({
            center: fromLonLat([126.942069, 37.547771]),
            zoom: 18,
        }),
        layers: Layers,
        target: null,
    }),
})

export const useMapStore = create(persist((...a) => ({
    ...mapStatusStore(...a)
}),
    {
        name: 'map-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))

export const changeLayer = (id) => {
    if (!id) return
    for (let key in Layers) {
        Layers[key].setVisible(Layers[key].values_.id === id)
    }
}

