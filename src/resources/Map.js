import { Map, View } from "ol";
import { defaults, ScaleLine } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Layers } from "./MapLayer";

export let gisMap = new Map({
    controls: defaults({
        attribution: true,
        // zoom: false,
        rotate: false,
        scaleLine: false,
        attribution: false, //기본 버튼
    }),
    view: new View({
        center: fromLonLat([126.942069, 37.547771]),
        zoom: 18,
        maxZoom: 21,
        minZoom: 5,
    }),
    layers: Layers,
    target: "main_gis",
})