import React, { useEffect, useRef, useState } from "react";
import { endDraw, ZoomControl } from "../../function/MapFunc";
import { useMapStore } from "../../stores/MapStore";

import "../../assets/css/map.css";

import { CMPopup } from "../../modal/modals/child/ChildPopup";
import { useModalStore } from "../../stores/ModalStore";
import MainMapLayerCart from "../../commponent/MainMapLayerCart";
import MainMapBar from "../../commponent/MainMapBar";

const MainMap = () => {

    const map = useMapStore(a => a.map);
    const modalstore = useModalStore(a => a);

    const ref = useRef();

    useEffect(() => {
        map.setTarget(null);
        map.setTarget("mainMap");
    }, []);

    return (
        <>
            <div id="mainmap_div" ref={ref}>
                <div id="mainMap" />
                <MainMapBar /> 
                <MainMapLayerCart />
            </div >
        </>
    )

}


export default MainMap;





