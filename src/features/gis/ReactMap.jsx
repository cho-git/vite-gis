import { changeDraw, changeLayer, changeMeasure, changeZoom, endDraw, removeSource } from "../../function/MapFunc";
import { useEffect, useRef } from "react";
import { useMapStore } from "../../stores/MapStore";
import "../../assets/css/map.css"

const ReactMap = () => {

    const map = useMapStore(a => a.map);
    const mapRef = useRef();
    const Ref = useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            map.setTarget();
            map.setTarget(mapRef.current);
            map.on('click', function (e) {
                console.log(e.coordinate);
            })
        }
    }, [])

    const selectHandler = (type, value) => {

        switch (type) {
            case "endDraw":
                endDraw();
                Ref.current.querySelector('[id ="draw_select"]').value = "None";
                Ref.current.querySelector('[id ="measure_select"]').value = "None";
                break
            case "changeDraw":
                changeDraw(value)
                Ref.current.querySelector('[id = "measure_select"]').value = "None";
                break
            case "changeMeasure":
                changeMeasure(value);
                Ref.current.querySelector('[id = "draw_select"]').value = "None";
                break
            case "removeSource":
                removeSource(value);
                Ref.current.querySelector('[id ="draw_select"]').value = "None";
                Ref.current.querySelector('[id ="measure_select"]').value = "None";
                break
            default:
                break
        }

    }
    const test = () => {
        console.log(map.getView().getZoom());
        console.log(mapRef);
        debugger
    }

    return (
        <>
            <div>
                <div ref={mapRef} className="map" />
                {/* <div ref={Ref}>
                    <div id="mapbtns">
                        <button onClick={() => selectHandler("endDraw")}>그리기 종료</button>
                        <button onClick={() => selectHandler("removeSource", "drawLayer")}>그리기 지우기</button>
                        <button onClick={() => selectHandler("removeSource", "measureLayer")}>측정 지우기</button>
                        <button onClick={() => changeZoom()}>center</button>
                        <button id="osmLayer" onClick={() => changeLayer("osmLayer")}>OSMLayer</button>
                        <button id="vworldLayer" onClick={() => changeLayer("vworldLayer")}>VWorldLayer</button>
                        <button onClick={test}>test</button>
                    </div>
                    <div id="mapbtns2">
                        <select id="draw_select" onChange={(e) => selectHandler("changeDraw", e.target.value)}>
                            <option value="None">그리기</option>
                            <option value="Point">점</option>
                            <option value="LineString">선</option>
                            <option value="Polygon">면</option>
                        </select>
                        <select id="measure_select" onChange={(e) => selectHandler("changeMeasure", e.target.value)}>
                            <option value="None">측정</option>
                            <option value="LineString">선</option>
                            <option value="Polygon">면</option>
                        </select>
                    </div >
                </div> */}
            </div>
        </>
    )

}


export default ReactMap;