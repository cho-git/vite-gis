import React, { useEffect, useRef, useState } from "react";
import { endDraw, ZoomControl } from "../../function/MapFunc";
import { useMapStore } from "../../stores/MapStore";

import "../../assets/css/map.css";

import { CCTVPopup, CMPopup } from "../../modal/modals/child/ChildPopup";
import { useModalStore } from "../../stores/ModalStore";
import MainMapLayerCart from "../../commponent/MainMapLayerCart";
import MainMapBar from "../../commponent/MainMapBar";
import MainMapToolBox from "../../commponent/MainMapToolBox";

const MainMap = () => {

    const map = useMapStore(a => a.map);
    const modalstore = useModalStore(a => a);

    const ref = useRef();

    useEffect(() => {
        map.setTarget(null);
        map.setTarget("mainMap");
        const mapClick = (e) => {
            const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
                return feature
            });
            if (!feature) {
                console.log('singleClick', e.coordinate);
            } else {
                switch (feature.get('name')) {
                    case 'LT_P_UTISCCTV': //vworld cctv
                        const data = feature.getProperties().data
                        modalstore.setPopOpen(true, "CCTV", <CCTVPopup item={data} />, null);
                        break;
                    default:
                        console.log(feature.get('id'));
                        break;
                }
            }
        };
        map.on("click", mapClick);
        return () => {
            map.un("click", mapClick);
        }
    }, []);

    return (
        <>
            <div id="mainmap_div" ref={ref}>
                <div id="mainMap" />
                <MainMapBar />
                <MainMapLayerCart />
                <MainMapToolBox />
            </div >
        </>
    )

}


export default MainMap;





