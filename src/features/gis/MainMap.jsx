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

    const mapChange = (type) => {
        map.setTarget(type);
    }
    return (
        <>
            <div ref={ref}>
                testtest
                <div id="mainMap" />

                <div id="mapChangeDiv">
                    <button type="button" onClick={() => { mapChange("map") }}>학습지도</button>
                    <button type="button" onClick={() => { mapChange("mainMap") }}>개발지도</button>
                </div>

                <div id="map_control_div">
                    <div id="map_zoom_div">
                        <button type="button" id="zoom_in" onClick={() => ZoomControl("in")}>+</button>
                        <button type="button" id="zoom_out" onClick={() => ZoomControl("out")}>-</button>
                    </div>
                </div>
            </div >
            개발지도 : 개발지도 component
        </>
    )

}


export default MainMap;





