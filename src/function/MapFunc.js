import { Circle, LineString, MultiPoint, Polygon } from "ol/geom";
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
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { config } from "../Config";

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
// 특정 Layer
export function getLayer(id) {
    const map = useMapStore.getState().map;
    return map.getLayers().getArray().find((item) => item.values_.id === id) || null;
}
// coordi or 대흥역
export function moveCenter(coordi, zoom) {
    const map = useMapStore.getState().map;
    if (coordi) {
        map.getView().setCenter(coordi);
    } else {
        map.getView().setCenter(fromLonLat([126.942069, 37.547771])); // 대흥역
    }
    map.getView().setZoom(zoom || 10);
}
// type ="Poing , LineString , Polygon"
export function changeDraw(type, odd) {
    const map = useMapStore.getState().map;
    if (type == "None") {
        return endDraw()
    }

    const layer = getLayer("drawLayer");
    const source = getSource("drawLayer");
    if (!source) return


    const draw = new Draw({
        source: source,
        type: type
    })
    let newstyle = style;
    if (odd) {
        draw.on("drawstart", function (e) {
            console.log('11');
        })
        draw.on("drawend", function (e) {
            draw.on("dbclick",function(e){
                console.log('drawabort1');
            })
            draw.on("change:active",function(e){
                console.log('drawabort2');
            })
            draw.on("drawabort",function(e){
                console.log('drawabort3');
            })
            debugger
            const feature = e.feature;
            const length = source.getFeatures().length;
            if (length % 2 === 0) {
                const oddStyle = new Style({
                    stroke: new Stroke({
                        color: "red",
                        width: 5
                    }),
                    fill: new Fill({
                        color: "rgba(255, 0, 0, 0.2)"
                    })
                })
                feature.setStyle(oddStyle);
            }
        });
    }

    layer.setStyle(newstyle);
    return map.addInteraction(draw);
}
// type ="LineString , Polygon" , setState , callBack
export function changeMeasure(type, setItem, callBack) {
    const map = useMapStore.getState().map;

    if (type == "None") {
        return endDraw()
    }

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
            } else if (geom instanceof Circle) {
                const radius = geom.getRadius();
                measure = Math.PI * Math.pow(radius, 2);
            }

        });
    });

    draw.on('drawend', function (evt) {
        sktch = null;
        unByKey(listener);
        const geometry = evt.feature.getGeometry()
        if (geometry instanceof LineString) {
            coordi = evt.feature.getGeometry().getLastCoordinate();
        } else if (geometry instanceof Polygon) {
            coordi = getCenter(geometry.getExtent());
        } else if (geometry instanceof Circle) {
            coordi = evt.feature.getGeometry().getFirstCoordinate();
        }

        if (setItem) {
            return setItem((pre) => [
                ...pre,
                {
                    id: evt.feature.ol_uid, // ID
                    measure: measure, // 계산된 값
                    coordi: coordi,// 마지막 지점
                    modi: false,
                }
            ]);
        }
        if (callBack) {
            const item = {
                id: evt.feature.ol_uid,
                measure: measure,
                coordi: coordi,
                modi: false,
            }
            callBack(item);
        }
    })
    modi.on('modifyend', function (evt) {
        sktch = evt.features;
        if (setItem) {
            setItem((pre) => {
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
        }
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
        if (layers[key] instanceof TileLayer) {
            layers[key].setVisible(layers[key].values_.id === id);
        }
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
            const geometry = feature.getGeometry();
            if (!geometry) return null;

            const coordinates = geometry.getCoordinates();

            if (geometry.getType() === "Point") {
                return new MultiPoint([coordinates]);
            } else if (geometry.getType() === "Polygon") {
                return new MultiPoint(coordinates[0]);
            }
        }
    })
];


export const calculateBBox = (coordi, radius) => {
    // 중심 좌표 (경도, 위도)
    const [lon, lat] = coordi;

    // 반지름을 좌표 단위로 변환 (예: 미터 -> 경도, 위도)
    const latToMeter = 111320; // 위도 1도에 대한 미터 값 (대략적인 값)
    const lonToMeter = 111320; // 경도 1도에 대한 미터 값 (대략적인 값)

    // 경도, 위도에 대한 미터 단위로 반지름을 변환
    const latRadius = radius / latToMeter; // 위도 반지름
    const lonRadius = radius / lonToMeter; // 경도 반지름

    // Bounding Box 계산
    const maxLat = lat + latRadius;
    const minLat = lat - latRadius;
    const maxLon = lon + lonRadius;
    const minLon = lon - lonRadius;

    return { maxLat, minLat, maxLon, minLon };
};
