import { Map, View } from "ol"
import { fromLonLat } from "ol/proj"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Layers } from "../resources/MapLayer"
import { ScaleLine, defaults } from 'ol/control.js';


export const mapStatusStore = (set) => ({
    map : new Map({
        controls: defaults({
            attribution: true,
            // zoom: false,
            rotate: false,
            scaleLine: false,
            attribution: false, //기본 버튼
        }).extend([
            new ScaleLine({
                units: 'degrees', // imperial inch , un inch , nautical mile , metric
            })
        ]),
        view: new View({
            center: fromLonLat([126.942069, 37.547771]),
            zoom: 18,
            maxZoom: 21,
            minZoom: 5.9,
        }),
        layers: Layers,
        target: '',
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

