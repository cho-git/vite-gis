import React, { useEffect, useRef } from "react";
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { useMapLayerStore } from "../../stores/MapLayerStore";
import '../../assets/css/base.css'
const MainGis = () => {
    const mapRef = useRef(null);
    const mapLayer = useMapLayerStore(a => a.mapLayerStatus)
    useEffect(() => {
        if (mapRef.current) {
            const map = new Map({
                view: new View({
                    center: fromLonLat([126.942069, 37.547771]), // 대흥역
                    zoom: 18,
                }),
                layers: [mapLayer.tilelayer],
                target: mapRef.current,
            });

            return () => {
                map.setTarget(null);
            };
        }
    }, []);

    return (
        < >
            <div className="main_gis" ref={mapRef}/>
        </ >
    );
};

export default MainGis;
