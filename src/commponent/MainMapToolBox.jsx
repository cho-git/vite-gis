import React, { useEffect, useState } from 'react';
import { useMapStore } from '../stores/MapStore';
import { activeLable } from '../function/CompoFunc';
import { callVworld } from '../function/CommonFunc';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Feature } from 'ol';
import * as olProj from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import { calculateBBox, changeMeasure, getLayer } from '../function/MapFunc';
import { Point } from "ol/geom";
import mapcctv from "../assets/img/map/map_cctv.png";
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import { useModalStore } from '../stores/ModalStore';

const MainMapToolBox = () => {
    const map = useMapStore(a => a.map);
    const modalstore = useModalStore(a => a);
    const [result, setResult] = useState([]);

    useEffect(() => {
        activeLable()
    }, [])
    useEffect(() => {

    }, [result])

    const addCCTVLayer = () => {
        const layer = getLayer("themetic2");
        const measurelayer = getLayer("measureLayer");
        const callback = (cctvData) => {
            measurelayer.getSource().clear()
            if (!cctvData || cctvData.length === 0) return
            layer.setVisible(true);
            layer.getSource().clear()
            cctvData.forEach((feature) => {
                const { geometry, properties, id } = feature;
                const { coordinates } = geometry;
                const { cctvname, locate } = properties;

                const featureObj = new Feature({
                    id,
                    name: 'LT_P_UTISCCTV',
                    geometry: new Point(coordinates),
                    data: feature,
                });
                const style = new Style({

                    image: new Icon({
                        src: mapcctv,
                        scale: 0.05,
                    })
                });
                featureObj.setStyle(style);
                layer.getSource().addFeature(featureObj);
            });
        }
        const callApi = () => {
            const measureCallback = (item) => {
                const mea = calculateBBox(item.coordi, item.measure);
                callVworld("CCTV", callback, { param: { geomfilter: `BOX(${mea.minLon},${mea.minLat},${mea.maxLon},${mea.maxLat})` } });
            }
            changeMeasure('Circle', null, measureCallback);
        }
        modalstore.setDialogOpen(true, "원하시는 지역을 드래그 해주십시오.", callApi);

    }
    return (
        <>
            <div id="mainmap_toolbox">
                <div className='toolbox_wrap' onClick={() => { addCCTVLayer() }} >
                    <button className='tool_theme'><span className='blind'>테마</span></button>
                </div>
            </div>
        </>
    )
}

export default MainMapToolBox;