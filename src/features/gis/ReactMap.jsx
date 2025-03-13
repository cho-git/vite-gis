import React, { useEffect, useRef, useState } from "react";
import { changeDraw, changeLayer, changeMeasure, endDraw, getLayer, getSource, moveCenter, ZoomControl } from "../../function/MapFunc";
import { callApi, elementValueChange, } from "../../function/CommonFunc";
import { useMapStore } from "../../stores/MapStore";
import { Feature, Overlay, } from "ol";

import { CMPopup } from "../../modal/modals/child/ChildPopup";
import { useModalStore } from "../../stores/ModalStore";
import mapflag from "../../assets/img/map/mapflag.png";
import CircleStyle from "ol/style/Circle";
import { ScaleLine } from "ol/control";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import * as olProj from 'ol/proj';
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import { Point } from "ol/geom";

import "../../assets/css/map.css";
import MainMap from "./MainMap";

const ReactMap = () => {

    const map = useMapStore(a => a.map);
    const modalstore = useModalStore(a => a);

    const ref = useRef();
    const [tooltip, setToolTip] = useState([]);

    useEffect(() => {
        map.setTarget(null);
        map.setTarget("map");


        if (ref.current) {
            // map event
            map.on("click", mapClick); // 맵 클릭시 
            map.on("moveend", (e) => mapmove(e)); // 맵 이동시
            ref.current.tabIndex = 0; // 키보드 이벤트 감지 위해 필수
            ref.current.addEventListener("keydown", handleKeyDown);

            // map scale
            const scale = new ScaleLine({
                units: "metric",
                minWidth: 100,
            })

            map.addControl(scale);
        }
        return () => {
            map.un("click", mapClick);
            map.un("moveend", mapmove);
            if (ref.current)
                ref.current.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (tooltip.length === 0) return
        const overlays = map.getOverlays().getArray();

        tooltip.forEach((item) => {
            const element = ref.current.querySelector(`[id="${item.id}"]`);
            if (!element) return;
            const div = new Overlay({
                element: element,
                position: item.coordi,
                className: "tooltip_overlay"
            });
            const existOverlay = overlays.find((over) => over.getElement()?.id === item.id);

            map.removeOverlay(existOverlay);
            map.addOverlay(div);
        })
    }, [tooltip])

    const test = () => {
        console.log(map);
        debugger
    }

    const mapClick = (e) => {
        const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature
        });
        if (!feature) {
            console.log('singleClick', e.coordinate);
        } else {
            switch (feature.get('name')) {
                case "CM_COORD_Q": // GIS PAGE 24
                    const item = feature.values_.data.item;
                    modalstore.setPopOpen(true, "측량데이터", <CMPopup item={item} />, null);
                    break;
                default:
                    break;
            }
        }
    };

    const mapmove = () => {
        const center = map.getView().getCenter();
        const minZoom = map.getView().getMinZoom()
        const currntZoom = map.getView().getZoom();

        if (currntZoom === minZoom) {
            alert("center : " + center + "\nzoom : " + currntZoom)
        }
    }

    const handleKeyDown = (e) => { // esc 이벤트
        if (e.key.toLowerCase() === "escape") {
            endDraw();
        }
    };

    const selectHandler = (func, type) => {
        endDraw();
        switch (func) {
            case "endDraw": // 그리기 종료
                elementValueChange(ref, '[id ="odd_draw_select"]', "None");
                elementValueChange(ref, '[id ="draw_select"]', "None");
                elementValueChange(ref, '[id ="measure_select"]', "None");
                break
            case "changeDraw": // 그리기 
                changeDraw(type);
                elementValueChange(ref, '[id ="odd_draw_select"]', "None");
                elementValueChange(ref, '[id ="measure_select"]', "None");
                break
            case "changeMeasure": // 측정
                changeMeasure(type, setToolTip);
                elementValueChange(ref, '[id ="odd_draw_select"]', "None");
                elementValueChange(ref, '[id ="draw_select"]', "None");
                break
            case "oddDraw": // 홀수 그리기
                changeDraw(type, "odd");
                elementValueChange(ref, '[id ="draw_select"]', "None");
                elementValueChange(ref, '[id ="measure_select"]', "None");
                break
            case "thematic": // 주제도
                const layer = getLayer("thematic1");

                if (type == "None") {
                    layer.setVisible(false);
                } else {
                    callApi("CM_COORD_Q").then((res) => {
                        layer.setVisible(true);
                        const features = res.data;

                        features.map((item) => ({
                            "item": item,
                            "coordi": olProj.transform([item.tm_x, item.tm_y], "EPSG:5187", "EPSG:3857"),
                        })).forEach((data) => {
                            const feature = new Feature({
                                id: data.item.id,
                                name: "CM_COORD_Q",
                                geometry: new Point(data.coordi),
                                data: data,
                            });
                            const style = new Style({
                                image: new CircleStyle({
                                    radius: 7,
                                    fill: new Fill({ color: '#ffcc33' }),
                                    stroke: new Stroke({ color: '#ffcc33', width: 2 })
                                }),
                                text: new Text({
                                    text: data.item.fac_type || '',
                                    font: '12px sans-serif',
                                    fill: new Fill({ color: '#000' }),
                                    stroke: new Stroke({ color: '#fff', width: 2 }),
                                    offsetY: -15
                                }),
                                image: new Icon({
                                    src: mapflag,
                                    scale: 0.05,
                                })
                            });
                            feature.setStyle(style);
                            layer.getSource().addFeature(feature);
                        });
                        moveCenter(olProj.transform([features[0].tm_x, features[0].tm_y], "EPSG:5187", "EPSG:3857"));
                    });
                }
                break
            default:
                break
        }
    }
    const removeSource = (layer) => {
        endDraw();
        const source = getSource(layer);
        source.clear();
        if (layer === "measureLayer") {
            const overlay = map.getOverlays().getArray().filter((item) => item.element.className === "tooltip_overlay");
            if (!overlay || overlay.length === 0) return
            for (let key in overlay) {
                map.removeOverlay(overlay[key])
            }
        }
        elementValueChange(ref, '[id ="draw_select"]', "None");
        elementValueChange(ref, '[id ="measure_select"]', "None");
    }
    const remove = () => {
        removeSource("drawLayer");
        removeSource("measureLayer");
    }

    const getGeoServerLayer = () => {
        const layer = map.getLayers().getArray().find((item) => item.values_.id === "geoserver");
        const visible = layer.getVisible()
        layer.setVisible(!visible);
        moveCenter(!visible && [14081451.202739127, 4406399.457892129], !visible && 10);
    }
   
    return (
        <>
            <div ref={ref}>
                <div id="map" />
                <div id="map_control_div">
                    <div id="map_zoom_div">
                        <button type="button" id="zoom_in" onClick={() => ZoomControl("in")}>+</button>
                        <button type="button" id="zoom_out" onClick={() => ZoomControl("out")}>-</button>
                    </div>

                    <div id="map_btn_div">
                        <button type="button" id="endDraw" onClick={() => { getGeoServerLayer() }}>지오서버</button>
                        <button type="button" id="endDraw" onClick={() => { selectHandler("endDraw") }}>그리기 종료</button>
                        <button type="button" id="removeDraw" onClick={() => { removeSource("drawLayer") }}>그리기 지우기</button>
                        <button type="button" id="removeMeasure" onClick={() => { removeSource("measureLayer") }}>측정 지우기</button>
                        <button type="button" id="moveCenter" onClick={() => moveCenter()}>center</button>
                        <button type="button" id="OSMLayer" onClick={() => { changeLayer("osmLayer") }}>OSMLayer</button>
                        <button type="button" id="VworldLayer" onClick={() => { changeLayer("vworldLayer") }}>VWorldLayer</button>
                        <button type="button" id="removeBtn" onClick={() => { remove("remove") }}>지우기</button>
                        <button type="button" id="TEST" onClick={() => test()}>debugger</button>
                    </div>

                    <div id="map_sel_div">
                        <select id="odd_draw_select" onChange={(e) => selectHandler("oddDraw", e.target.value)}>
                            <option value="None">홀수 그리기</option>
                            <option value="Point">점</option>
                            <option value="LineString">선</option>
                            <option value="Polygon">면</option>
                        </select>

                        <select id="draw_select" onChange={(e) => selectHandler("changeDraw", e.target.value)}>
                            <option value="None">그리기</option>
                            <option value="Point">점</option>
                            <option value="LineString">선</option>
                            <option value="Polygon">면</option>
                        </select>
                        <select id="measure_select" onChange={(e) => selectHandler("changeMeasure", e.target.value)}>
                            <option value="None">측정</option>
                            <option value="LineString">선</option>
                            <option value="Polygon">면</option>
                        </select>
                        <select id="thematic_select" onChange={(e) => selectHandler("thematic", e.target.value)}>
                            <option value="None">주제도</option>
                            <option value="thematic1">thematic</option>
                        </select>
                    </div>
                    {tooltip && tooltip.length > 0 ?
                        tooltip.map((item) => {
                            return (
                                <div className="tooltip_box" key={item.id} id={item.id} dangerouslySetInnerHTML={{ __html: item.measure }} />
                            )
                        })
                        : null
                    }
                </div>
            </div >
        </>
    )

}


export default ReactMap;





