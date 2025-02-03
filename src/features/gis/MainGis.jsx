import React, { useEffect, useRef } from "react";
import { useMapStore } from "../../stores/MapLayerStore";
import { changeDraw, changeLayer, changeZoom } from "../../function/MapFunction";
import '../../assets/css/base.css'
import { Control, defaults, ScaleLine } from "ol/control";
import "../../assets/css/map.css"
import "../../assets/css/base.css"
const MainGis = () => {
    const mapRef = useRef(null);
    const gismap = useMapStore.getState().gisMap;
    useEffect(() => {
        if (!mapRef.current.querySelector('[class="ol-viewport"]')) {
            gismap.setTarget(null);
            gismap.setTarget(mapRef.current);
            gismap.on("click", (e) => {
                console.log(e.coordinate);
            })
            let mapbtn = new Control({
                element: mapRef.current.querySelector('[id="mapbtns"]')
            })
            gismap.addControl(mapbtn);
        }
    }, []);

    const test = () => {
        console.log(gismap.getView().getZoom());
        debugger
    }

    return (
        <>
            <div className="main_gis" ref={mapRef} />
            <div id="mapbtns">
                <button onClick={() => changeZoom()}>center</button>
                <button id="osmLayer" onClick={() => changeLayer("osmLayer")}>OSMLayer</button>
                <button id="vworldLayer" onClick={() => changeLayer("vworldLayer")}>VWorldLayer</button>
                <button id="drawLayer" onClick={() => changeLayer("drawLayer")}>drawLayer</button>
                <button onClick={test}>test</button>
                <select id="draw_select" onChange={(e) => changeDraw(e.target.value)}>
                    <option value="">null</option>
                    <option value="Point">point</option>
                    <option value="LineString">LineString</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Circle">Circle</option>
                </select>
            </div>
        </>
    );
};

export default MainGis;
