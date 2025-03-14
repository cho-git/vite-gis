import React, { useEffect } from 'react';
import { useMapStore } from '../stores/MapStore';
import { activeLable } from '../function/CompoFunc';
import { callVworld } from '../function/CommonFunc';
import { Circle, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Vector } from 'ol/source';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Feature } from 'ol';

const MainMapToolBox = () => {
    const map = useMapStore(a => a.map);

    useEffect(() => {
        activeLable()
    }, [])

    const addCCTVLayer = () => {
        const callback = (cctvData) => {
            console.log('cctv', cctvData);
            
            const features = cctvData.map((feature) => {
                const { geometry, properties } = feature;
                const { coordinates } = geometry;
                const { cctvname, locate } = properties;

                return new Feature({
                    geometry: new Point(fromLonLat([coordinates[0], coordinates[1]])),
                    name: cctvname,
                    location: locate,
                });
            });

            const vectorSource = new Vector({
                features: features,
            });

            const vectorLayer = new Vector({
                source: vectorSource,
                style: new Style({
                    image: new Circle({
                        radius: 5,
                        fill: new Fill({ color: "red" }),
                        stroke: new Stroke({ color: "white", width: 2 }),
                    }),
                }),
            });
            map.addLayer(vectorLayer); // 지도에 CCTV 레이어 추가
        }
        callVworld("CCTV", callback);

    }
    return (
        <>
            <div id="mainmap_toolbox">
                <div className='toolbox_wrap' onClick={() => { addCCTVLayer() }} >
                    <button className='tool_theme'><span className='blind'>테마</span></button>
                </div>
                <div className='toolbox_wrap'>

                </div>
                <div className='toolbox_wrap'>

                </div>
                <div className='toolbox_wrap'>

                </div>
            </div>
        </>
    )
}

export default MainMapToolBox;