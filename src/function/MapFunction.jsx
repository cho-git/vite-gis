import Draw from "ol/interaction/Draw";
import { Layers } from "../resources/MapLayer";
import { fromLonLat } from "ol/proj";
import { gisMap } from "../resources/Map";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from 'ol/style/Circle.js';
import { Overlay } from "ol";
import { getArea, getLength } from 'ol/sphere.js';
import { unByKey } from 'ol/Observable.js';
import Modify from 'ol/interaction/Modify.js';
import { Circle, LineString, Polygon } from "ol/geom";

//////////////////////////////////////////////////////////////////
//////////////////////////MainGis/////////////////////////////////
//////////////////////////////////////////////////////////////////

// source
export function getSource(id) {
    const array = gisMap.getLayers().array_
    const layer = array.find((item) => item.values_.id === id)
    if (!layer) return
    return layer.values_.source
}

// 그리기
export function changeDraw(type) {
    endDraw()
    if (type !== "None") {
        const draw = new Draw({
            source: getSource("drawLayer"),
            type: type
        })
        return gisMap.addInteraction(draw)
    }
}
// 측정
export function changeMeasure(type) {
    let sketch;
    let helpTooltipElement;
    let helpTooltip;
    let measureTooltipElement;
    let measureTooltip;
    const continewPolygonMsg = 'Click to continue drawing the polygon';
    const continueLineMsg = 'Click to continue drawing the line';

    const style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
        }),
    });

    const addInteraction = () => {
        const draw = new Draw({
            source: getSource("measureLayer"),
            type: type,
            style: function (feature) {
                const geometryType = feature.getGeometry().getType();
                if (geometryType === type || geometryType === 'Point') {
                    return style;
                }
            }
        })
        const modify = new Modify({ source: getSource("measureLayer") });

        gisMap.addInteraction(modify);
        gisMap.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        let listener;

        draw.on('drawstart', function (evt) {
            sketch = evt.feature;

            let tooltipCoord = evt.coordinate;
            listener = sketch.getGeometry().on('change', function (evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
            draw.on('drawend', function () {
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);

                sketch = null;

                measureTooltipElement = null;
                createMeasureTooltip();
                unByKey(listener);
            });
        });
        // modify.on('modifystart', function (evt) {
        //     let moditooltip;
        //     debugger
        //     sketch = evt.features;
        //     console.log(sketch);
        //     let tooltipCoord = evt.coordinate;
        //     console.log(tooltipCoord);
        //     listener = sketch.getGeometry().on('change', function (evt) {
        //         const geom = evt.target;
        //         let output;
        //         if (geom instanceof Polygon) {
        //             output = formatArea(geom);
        //             tooltipCoord = geom.getInteriorPoint().getCoordinates();
        //         } else if (geom instanceof LineString) {
        //             output = formatLength(geom);
        //             tooltipCoord = geom.getLastCoordinate();
        //         }
        //         measureTooltipElement.innerHTML = output;
        //         measureTooltip.setPosition(tooltipCoord);
        // modify.on('modifyend', function (evt, item) {
        //     console.log(measureTooltipElement)
        //     debugger
        //     measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        //     measureTooltip.setOffset([0, -7]);

        //     sketch = null;

        //     measureTooltipElement = null;
        //     createMeasureTooltip();
        //     unByKey(listener);
        // });
        //     });
        // });
    }

    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.remove();
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        gisMap.addOverlay(measureTooltip);
    }

    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.remove();
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        gisMap.addOverlay(helpTooltip);
    }




    const pointerMoveHandler = function (e) {
        if (e.dragging) return
        let helpMsg = 'Click to start drawing';

        if (sketch) {
            const geom = sketch.getGeometry();
            if (type === "Polygon") {
                helpMsg = continewPolygonMsg;
            } else if (type === "LineString") {
                helpMsg = continueLineMsg;
            }
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(e.coordinate);

        helpTooltipElement.classList.remove('hidden');
    }


    const formatLength = function (line) {
        const length = getLength(line);
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };
    const formatArea = function (polygon) {
        const area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    endDraw()
    if (type !== "None") {
        addInteraction()
    }
}
// 현재 draw get
const getCurrentDraw = () => {
    return gisMap.getInteractions().getArray().find(item => item instanceof Draw) || null;
};
const getCurrentModify = () => {
    return gisMap.getInteractions().getArray().find(item => item instanceof Modify) || null;
}
// end draw and modify
export function endDraw() {
    const draw = getCurrentDraw();
    const modify = getCurrentModify();
    if (draw) {
        gisMap.removeInteraction(draw);
    }
    if (modify) {
        gisMap.removeInteraction(modify);
    }
}
// 그리기 측정 지우기
export function removeSource(layer) {
    endDraw()
    const source = getSource(layer);
    if (!source) return;

    source.clear();
    if (layer === "measureLayer") {
        const tooltip = gisMap.getOverlays().getArray().filter((item) => item.values_.element.className === "ol-tooltip ol-tooltip-static");
        if (tooltip && tooltip.length > 0) {
            for (let key in tooltip) {
                gisMap.removeOverlay(tooltip[key]);
            }
        }
    }
}

// 상황별 켜야하는 Layer
export function changeLayer(id) {
    if (!id) return
    switch (id) {

        case "drawLayer":
            Layers.find((item) => item.values_.id === id).setVisible(true)
            break

        case "":
            break

        default:
            for (let key in Layers) {
                if (Layers[key].values_.id === "drawLayer") return
                Layers[key].setVisible(Layers[key].values_.id === id)
            }
            break

    }
}
// move zoom  or center (대흥역)
export function changeZoom(state, coordi) {
    switch (state) {
        case "move":
            gisMap.getView().setCenter(coordi);
            break;
        default:
            gisMap.getView().setCenter(fromLonLat([126.942069, 37.547771]));
            break;
    }
    gisMap.getView().setZoom(18);
}

