import { useState } from "react";
import MainMap from "../features/gis/MainMap";
import ReactMap from "../features/gis/ReactMap";
import { changeLayer, endDraw, moveCenter } from "../function/MapFunc";
import { useMapStore } from "../stores/MapStore";
import { gisMap } from "../resources/Map";


const MainPage = () => {
    const map = useMapStore(a => a.map);

    const [mapConfig, setMapConfig] = useState({
        target: "map",
        view: true,
    });

    const mapChange = (type) => {
        const layers = map.getAllLayers();
        for (const layer of layers) {
            const source = layer.getSource();

            // 그려진거 지우기
            if (source && typeof source.getFeatures === "function") { 
                const features = source.getFeatures();
                if (features.length > 0) { 
                    source.clear();
                }
            }
        }
        const overlay = map.getOverlays().getArray().filter((item) => item.element.className === "tooltip_overlay");
        // 측정 overlay 지우기
        if (!overlay || overlay.length > 0) { 
            for (let key in overlay) {
                map.removeOverlay(overlay[key])
            }
        }
        changeLayer("vworldLayer");
        endDraw();
        moveCenter();
        setMapConfig((pre) => ({
            ...pre,
            target: type
        }));
    };
    const mapViewHandler = () => {
        setMapConfig((pre) => ({
            ...pre,
            view: !pre.view
        }))
    }

    return (
        <>
            <div id="mapChangeDiv">
                {mapConfig.view &&
                    <>
                        <button type="button" onClick={() => { mapChange("map") }}>학습지도</button>
                        <button type="button" onClick={() => { mapChange("mainMap") }}>개발지도</button>
                    </>
                }
                <button type="button" onClick={() => { mapViewHandler() }}>{mapConfig?.view ? "숨기" : "보기"}</button>
            </div>
            {mapConfig && mapConfig.target === "map" ? <ReactMap target={mapConfig?.target} /> : <MainMap />}
        </>
    )
}

export default MainPage;