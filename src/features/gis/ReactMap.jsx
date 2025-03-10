import React, { useEffect, useRef, useState } from "react";
import { addControlDiv, changeDraw, changeLayer, changeMeasure, endDraw, getAllLayer, getLayer, getSource, moveCenter, ZoomControl } from "../../function/MapFunc";
import { callApi, elementValueChange, getWishElement } from "../../function/CommonFunc";
import { useMapStore } from "../../stores/MapStore";
import { Overlay } from "ol";

import "../../assets/css/map.css"
import { ScaleLine } from "ol/control";

const ReactMap = () => {

    const map = useMapStore(a => a.map);

    const mapRef = useRef();
    const Ref = useRef();

    const [tooltip, setToolTip] = useState([]);

    useEffect(() => {
        if (!mapRef.current || !Ref.current) return;
        if (map.getTarget()) return // 맵 중복생성 방지
        map.setTarget(mapRef.current);

        const mapClick = (e) => {
            console.log(e.coordinate);
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
        return () => {
            map.un("click", mapClick);
            map.un("moveend", mapmove);
        };
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
                if (type == "None") return
                // - GIS 22page 주제도-
                const param = {
                    "api_name": "CM_COORD_Q",
                    "fac_cond":
                    {
                        "COND": "반경",
                        "TM_X": 231562.75979870147,
                        "TM_Y": 329135.32101969444,
                        "RADIUS": 3000,
                        "FAC_TYPE": "",
                        "CONST": "",
                        "CRET_DATE_FROM": "",
                        "CRET_DATE_TO": "",
                        "SV_COMP": ""
                    }
                }
                const url = "https://mogt.kdgas.co.kr:1301/CMPRO/CM_COORD_Q";

                callApi(url, param).then((data) => {
                    console.log(data);
                    debugger
                });

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
