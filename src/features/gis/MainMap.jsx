import React, { useEffect, useRef, useState } from "react";
import { endDraw, ZoomControl } from "../../function/MapFunc";
import { useMapStore } from "../../stores/MapStore";
import { Overlay, } from "ol";

import "../../assets/css/map.css";

import { CMPopup } from "../../modal/modals/child/ChildPopup";
import { useModalStore } from "../../stores/ModalStore";
import { ScaleLine } from "ol/control";

const MainMap = () => {

    const map = useMapStore(a => a.map);
    const modalstore = useModalStore(a => a);

    const ref = useRef();

    const [tooltip, setToolTip] = useState([]);

    useEffect(() => {
        map.setTarget(null);
        map.setTarget("mainMap");
    }, []);

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

    return (
        <>
            <div ref={ref}>
                testtest
                <div id="mainMap" />
                
                <div id="map_control_div">
                    <div id="map_zoom_div">
                        <button type="button" id="zoom_in" onClick={() => ZoomControl("in")}>+</button>
                        <button type="button" id="zoom_out" onClick={() => ZoomControl("out")}>-</button>
                    </div>
                </div>
            </div >
        </>
    )

}


export default MainMap;





