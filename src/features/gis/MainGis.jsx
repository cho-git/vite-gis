import React, { useEffect, useRef } from "react";
import { changeLayer, useMapStore } from "../../stores/MapLayerStore";
import '../../assets/css/base.css'

const MainGis = () => {
    const mapRef = useRef(null);
    const VarMap = useMapStore(a => a.VarMap);
    useEffect(() => {
        if (!mapRef?.current?.querySelector('[class="ol-viewport"]')) {
            VarMap.setTarget(mapRef.current);
        }
    }, []);


    return (
        <>
            <div className="main_gis" ref={mapRef} />
            <button onClick={() => changeLayer("osmLayer")}>OSMLayer</button>
            <button onClick={() => changeLayer("vworldLayer")}>VWorldLayer</button>
        </>
    );
};

export default MainGis;
