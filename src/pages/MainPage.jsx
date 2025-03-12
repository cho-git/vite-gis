import { useState } from "react";
import MainMap from "../features/gis/MainMap";
import ReactMap from "../features/gis/ReactMap";


const MainPage = () => {

    const [target, setTarget] = useState("map");

    const mapChange = (type) => {
        setTarget(type)
    };
    
    return (
        <>
            <div id="mapChangeDiv">
                <button type="button" onClick={() => { mapChange("map") }}>학습지도</button>
                <button type="button" onClick={() => { mapChange("mainMap") }}>개발지도</button>
            </div>
            {target && target === "map" ? <ReactMap /> : <MainMap />}
        </>
    )
}

export default MainPage