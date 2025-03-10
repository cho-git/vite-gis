import { Map, View } from "ol";
import { defaults, ScaleLine } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Layers } from "./MapLayer";
import proj4 from "proj4";
import { register } from 'ol/proj/proj4';


// EPSG:5187
proj4.defs([
    ['EPSG:5187', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs']
]);
register(proj4);
export const gisMap = new Map({
    controls: defaults({
        // attribution: true,
        zoom: false,
        rotate: false,
        scaleLine: false,
        attribution: false, //기본 버튼
    }),
    view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat([126.942069, 37.547771]),
        zoom: 18,
        maxZoom: 20,
        minZoom: 5,
    }),

    layers: Layers,
    target: "",
})

// export const gisMap = () => {
//     proj4.defs("EPSG:5187", "+proj=tmerc +lat_0=38 +lon_0=128 +k=1 +x_0=400000 +y_0=600000 +ellps=GRS80 +units=m +no_defs");
//     register(proj4);

//     return new Map({
//         controls: defaults({
//             // attribution: true,
//             zoom: false,
//             rotate: false,
//             scaleLine: false,
//             attribution: false, //기본 버튼
//         }),
//         view: new View({
//             center: fromLonLat([126.942069, 37.547771]),
//             zoom: 18,
//             maxZoom: 20,
//             minZoom: 5,
//             projection: 'EPSG:3857',
//         }),

//         layers: Layers,
//         target: "",
//     })
// }