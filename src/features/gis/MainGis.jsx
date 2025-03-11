import React, { useEffect, useRef, useState } from "react";
import { changeDraw, changeLayer, changeMeasure, changeZoom, endDraw, removeSource, } from "../../function/MapFunction";
import { gisMap } from "../../resources/Map";
import { ScaleLine } from "ol/control";

import "../../assets/css/base.css"
import "../../assets/css/map.css"
const MainGis = () => {
    const mapRef = useRef(null);
    const Ref = useRef(null);
    const [zoom, setZoom] = useState();
    useEffect(() => {
        if (mapRef.current) {
            gisMap.setTarget();
            gisMap.setTarget(mapRef.current);
            gisMap.on("click", (e) => {
                console.log(e.coordinate);
            })
            console.log(gisMap);
            gisMap.addControl(
                new ScaleLine({
                    target: 'scale_div',
                })
            );
            // const scale = gisMap.getControls().getArray().find((item) => item instanceof ScaleLine);
            // scale.setTarget("scale_div");

        }
    }, []);

    const test = () => {
        console.log(gisMap.getView().getZoom());
        console.log(mapRef);
        debugger
    }

    const selectHandler = (type, value) => {

        switch (type) {
            case "endDraw":
                endDraw();
                Ref.current.querySelector('[id ="draw_select"]').value = "None";
                Ref.current.querySelector('[id ="measure_select"]').value = "None";
                break
            case "changeDraw":
                changeDraw(value)
                Ref.current.querySelector('[id = "measure_select"]').value = "None";
                break
            case "changeMeasure":
                changeMeasure(value);
                Ref.current.querySelector('[id = "draw_select"]').value = "None";
                break
            case "removeSource":
                removeSource(value);
                Ref.current.querySelector('[id ="draw_select"]').value = "None";
                Ref.current.querySelector('[id ="measure_select"]').value = "None";
                break
            default:
                break
        }

    }




    return (
        <>
            <div className="main_gis" ref={mapRef} />
            <div ref={Ref}>
                <div id="mapbtns">
                    <button type="button" vonClick={() => selectHandler("endDraw")}>그리기 종료</button>
                    <button type="button" vonClick={() => selectHandler("removeSource", "drawLayer")}>그리기 지우기</button>
                    <button type="button" vonClick={() => selectHandler("removeSource", "measureLayer")}>측정 지우기</button>
                    <button type="button" vonClick={() => changeZoom()}>center</button>
                    <button type="button" vid="osmLayer" onClick={() => changeLayer("osmLayer")}>OSMLayer</button>
                    <button type="button" vid="vworldLayer" onClick={() => changeLayer("vworldLayer")}>VWorldLayer</button>
                    <button type="button" vonClick={test}>test</button>
                </div>
                <div id="mapbtns2">
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
                </div >
                <div id="scale_div" />
            </div>
        </>
    );
};

export default MainGis;
