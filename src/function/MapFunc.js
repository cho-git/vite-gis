import { LineString, MultiPoint, Polygon } from "ol/geom";
import { getArea, getLength } from 'ol/sphere.js';
import { useMapStore } from "../stores/MapStore";
import { getWishElement } from "./CommonFunc";
import Modify from "ol/interaction/Modify";
import CircleStyle from "ol/style/Circle";
import { unByKey } from "ol/Observable";
import Draw from "ol/interaction/Draw";
import { getCenter } from "ol/extent";
import Stroke from "ol/style/Stroke";
import { Control } from "ol/control";
import { fromLonLat } from "ol/proj";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

//////////////////////////////////////////////////////////////////
//////////////////////////ReactMap////////////////////////////////
//////////////////////////////////////////////////////////////////


// Layer id
export function getSource(id) {
    const map = useMapStore.getState().map;
    const array = map.getLayers().getArray();
    const layer = array.find((item) => item.values_.id === id)
    if (!layer) return
    return layer.values_.source
}
// Layer id
export function getLayer(id) {
    const map = useMapStore.getState().map;
    return map.getLayers().getArray().find((item) => item.values_.id === id) || null;
}

// <div ref={ref}><button/><select/>....<div> << 추가할 통째
export function addControlDiv(ref, type, style) {
    const map = useMapStore.getState().map;
    const element = getWishElement(ref, type);
    if (!element) return

    const controls = map.getControls().getArray();
    if (controls?.find((item) => item.element.id === element.id)) return

    const div = new Control({
        element: element,
        style: style
    });
    map.addControl(div);
}

// ref , [id,id,id,id,...]
export function addControl(ref) {
    const map = useMapStore.getState().map;
    for (let key in ids) {
        const item = ref.current.querySelector(`[id=${ids[key]}]`)
        if (!item) return
        let control = new Control({
            element: item
        })
        map.addControl(control);
    }
}
// coordi or 대흥역
export function moveCenter(coordi) {
    const map = useMapStore.getState().map;
    if (coordi) {
        map.getView().setCenter(coordi);
    } else {
        map.getView().setCenter(fromLonLat([126.942069, 37.547771])); // 대흥역
    }
    map.getView().setZoom(18);
}
// type ="Poing , LineString , Polygon"
export function changeDraw(type) {
    const map = useMapStore.getState().map;

    const layer = getLayer("measureLayer");
    const source = getSource("drawLayer");
    if (!source) return
    const draw = new Draw({
        source: source,
        type: type
    })
    layer.setStyle(style);
    return map.addInteraction(draw);
}
// type ="LineString , Polygon" , setToolTip
export function changeMeasure(type, setToolTip) {
    const map = useMapStore.getState().map;
    const source = getSource("measureLayer");
    const layer = getLayer("measureLayer");
    if (!source) return
    let sktch;
    let listener;
    let measure;
    let coordi;

    layer.setStyle(style);
    const draw = new Draw({
        source: source,
        type: type,
    })
    const modi = new Modify({ source: source });
    draw.on('drawstart', function (evt) {
        sktch = evt.feature;
        listener = sktch.getGeometry().on('change', function (evt) {
            const geom = evt.target;

            if (geom instanceof Polygon) {
                measure = formatArea(geom);

            } else if (geom instanceof LineString) {
                measure = formatLength(geom);
            }
        });
    });

    draw.on('drawend', function (evt) {
        sktch = null;
        unByKey(listener);
        const geometry = evt.feature.getGeometry()
        if (geometry instanceof LineString) {
            coordi = evt.feature.getGeometry().getLastCoordinate()
        } else if (geometry instanceof Polygon) {
            coordi = getCenter(geometry.getExtent());
        }
        return setToolTip((pre) => [
            ...pre,
            {
                id: evt.feature.ol_uid, // ID
                measure: measure, // 계산된 값
                coordi: coordi,// 마지막 지점
                modi: false,
            }
        ]);
    })
    modi.on('modifyend', function (evt) {
        sktch = evt.features;

        setToolTip((pre) => {
            return pre.map((item) => {
                const feature = evt.features.getArray().find(f => f.ol_uid === item.id);
                if (!feature) return item;

                const geometry = feature.getGeometry();
                let measure, coordi;

                if (geometry instanceof LineString) {
                    measure = (getLength(geometry) / 1000).toFixed(2) + " km";
                    coordi = geometry.getLastCoordinate();
                } else if (geometry instanceof Polygon) {
                    measure = getArea(geometry).toFixed(2) + " m²";
                    coordi = getCenter(geometry.getExtent());
                }

                return { ...item, measure: measure, coordi: coordi, modi: true };
            });
        });
    });
    const formatLength = function (line) {
        const length = getLength(line);
        return (length / 1000).toFixed(2) + ' km';
    };

    const formatArea = function (polygon) {
        const area = getArea(polygon);
        return Math.round(area * 100) / 100 + ' m²';
    };


    map.addInteraction(modi);
    return map.addInteraction(draw);
}


//
export function endDraw() {
    const map = useMapStore.getState().map;
    const draw = map.getInteractions().getArray().find((item) => item instanceof Draw);
    const modi = map.getInteractions().getArray().find((item) => item instanceof Modify);

    if (draw) {
        map.removeInteraction(draw);
    }
    if (modi) {
        map.removeInteraction(modi);
    }
}
//in or out
export function ZoomControl(type) {
    const map = useMapStore.getState().map;
    if (!map) return
    const currentZoom = map.getView().getZoom();

    if (type === "in") {
        map.getView().setZoom(currentZoom + 1);
    } else {
        map.getView().setZoom(currentZoom - 1);
    }

}

export function changeLayer(id) {
    const map = useMapStore.getState().map;
    const layers = map.getLayers().getArray();
    for (let key in layers) {
        layers[key].setVisible(layers[key].values_.id === id);
    }
}


const style = [
    new Style({
        stroke: new Stroke({
            color: "#3388FF",
            width: 5
        }),
        fill: new Fill({
            color: "rgba(51, 136, 255, 0.2)"
        })
    }),
    new Style({
        image: new CircleStyle({
            radius: 8,
            fill: new Fill({
                color: "white"
            }),
            stroke: new Stroke({
                color: "#0072ff",
                width: 4
            })
        }),
        geometry: function (feature) {
            const coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
        }
    })
];