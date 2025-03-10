import React, { useEffect, useRef, useState } from "react";
import { addControlDiv, changeDraw, changeLayer, changeMeasure, endDraw, getAllLayer, getLayer, getSource, getVisibleLayer, moveCenter, ZoomControl } from "../../function/MapFunc";
import { callApi, elementValueChange } from "../../function/CommonFunc";
import { useMapStore } from "../../stores/MapStore";
import { Feature, Overlay } from "ol";

import "../../assets/css/map.css";

import mapflag from "../../assets/img/mapFlag.png";
import CircleStyle from "ol/style/Circle";
import { ScaleLine } from "ol/control";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import * as olProj from 'ol/proj';
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import { Point } from "ol/geom";
import { useModalStore } from "../../stores/ModalStore";

const ReactMap = () => {

    const map = useMapStore(a => a.map);

    const modalOpen = useModalStore(a => a.setOpen);
    const mapRef = useRef();
    const Ref = useRef();

    const [tooltip, setToolTip] = useState([]);

    useEffect(() => {
        if (mapRef.current) {
            if (map.getTarget()) return // 맵 중복생성 방지
            map.setTarget(mapRef.current);

            const mapClick = (e) => {
                // console.log(e.coordinate);
                // const layers = getVisibleLayer();

                const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
                    return feature
                });
                if (!feature) {
                    console.log('singleClick', e.coordinate);
                } else {
                    // alert(feature.get('name'));
                    switch (feature.get('name')) {
                        case "CM_COORD_Q": // GIS PAGE 24
                            const item = feature.values_.data.item;
                            console.log('CM_COORD_Q', item);
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
            map.on("click", mapClick); // 맵 클릭시 
            map.on("moveend", mapmove); // 맵 이동시

            addControlDiv(Ref, '[id="map_btn_div"]'); // 그리기 종료 라인
            addControlDiv(Ref, '[id="map_sel_div"]'); // 그리기 , 측정 라인
            addControlDiv(Ref, '[id="map_zoom_div"]'); // + - zoomin,out 라인

            const scale = new ScaleLine({
                units: "metric",
                minWidth: 100,
            })
            map.addControl(scale);
            // return () => { //   if (map.getTarget()) 찾기 전 소스
            //     map.un("click", mapClick);
            //     map.un("moveend", mapmove);
            // };
        }
    }, []);

    useEffect(() => {
        if (tooltip.length === 0) return
        const overlays = map.getOverlays().getArray();

        tooltip.forEach((item) => {
            const element = Ref.current.querySelector(`[id="${item.id}"]`);
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


    const selectHandler = (func, type) => {
        endDraw();
        switch (func) {
            case "endDraw":
                elementValueChange(mapRef, '[id ="draw_select"]', "None");
                elementValueChange(mapRef, '[id ="measure_select"]', "None");
                break
            case "changeDraw":
                changeDraw(type);
                elementValueChange(mapRef, '[id ="measure_select"]', "None");
                break
            case "changeMeasure":
                changeMeasure(type, setToolTip);
                elementValueChange(mapRef, '[id ="draw_select"]', "None");
                break
            case "thematic":
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
                        moveCenter(olProj.transform([features[0].tm_x, features[0].tm_y], "EPSG:5187", "EPSG:3857"))
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
        elementValueChange(mapRef, '[id ="draw_select"]', "None");
        elementValueChange(mapRef, '[id ="measure_select"]', "None");
    }
    const remove = () => {
        const layer = getAllLayer(["measureLayer", "drawLayer"]);
        for (let key in layer) {
            layer[key].getSource().clear()
            if (layer[key].values_.id === "measureLayer") {
                const overlay = map.getOverlays().getArray().filter((item) => item.element.className === "tooltip_overlay");
                if (!overlay || overlay.length === 0) return
                for (let key in overlay) {
                    map.removeOverlay(overlay[key])
                }
            }
        }
    }

    return (
        <>
            <div ref={Ref}>
                <div ref={mapRef} className="map" />
                <div id="map_zoom_div">
                    <button id="zoom_in" onClick={() => ZoomControl("in")}>+</button>
                    <button id="zoom_out" onClick={() => ZoomControl("out")}>-</button>
                </div>

                <div id="map_btn_div">
                    <button id="endDraw" onClick={() => { selectHandler("endDraw") }}>그리기 종료</button>
                    <button id="removeDraw" onClick={() => { removeSource("drawLayer") }}>그리기 지우기</button>
                    <button id="removeMeasure" onClick={() => { removeSource("measureLayer") }}>측정 지우기</button>
                    <button id="moveCenter" onClick={() => moveCenter()}>center</button>
                    <button id="OSMLayer" onClick={() => { changeLayer("osmLayer") }}>OSMLayer</button>
                    <button id="VworldLayer" onClick={() => { changeLayer("vworldLayer") }}>VWorldLayer</button>
                    <button id="removeBtn" onClick={() => { remove("remove") }}>지우기</button>
                    <button id="TEST" onClick={() => test()}>TEST</button>
                </div>

                <div id="map_sel_div">
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
            </div >
        </>
    )

}


export default ReactMap;





const CmCoordiForm = (item) => {

    return (
        <>

        </>
    )

}
