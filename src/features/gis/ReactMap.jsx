import { addControlDiv, changeDraw, changeMeasure, endDraw, moveCenter } from "../../function/MapFunc";
import { elementValueChange, getWishElement } from "../../function/CommonFunc";
import { useMapStore } from "../../stores/MapStore";
import { useEffect, useRef } from "react";

import "../../assets/css/map.css"

const ReactMap = () => {

    const map = useMapStore(a => a.map);

    const mapRef = useRef();
    const Ref = useRef();

    useEffect(() => {
        if (!mapRef.current || !Ref.current) return;
        map.setTarget(mapRef.current);
        const mapClick = (e) => {
            console.log(e.coordinate);
        };

        map.on("click", mapClick); // 새 이벤트 등록

        const btndiv = getWishElement(Ref, '[id="map_btn_div"]');
        const seldiv = getWishElement(Ref, '[id="map_sel_div"]');
        addControlDiv(btndiv);
        addControlDiv(seldiv);

        return () => {
            map.un("click", mapClick);
        };
    }, []);


    const test = () => {
        console.log(map.getView().getZoom());
        console.log(mapRef);
        debugger
    }


    // const [user, setUser] = useState(1);
    // useEffect(() => {
    //     console.log('return 이전 ', user);
    //     return () => {
    //         console.log('return 이후 ', user);
    //     }
    // }, [user])

    const selectHandler = (func, type) => {
        switch (func) {
            case "endDraw":
                endDraw();
                elementValueChange(mapRef, '[id ="draw_select"]', "None");
                elementValueChange(mapRef, '[id ="measure_select"]', "None");
                break
            case "changeDraw":
                changeDraw(type);
                elementValueChange(mapRef, '[id ="measure_select"]', "None");
                break
            case "changeMeasure":
                changeMeasure(value);
                elementValueChange(mapRef, '[id ="draw_select"]', "None");
                break
            // case "removeSource":
            //     removeSource(value);
            //     Ref.current.querySelector('[id ="draw_select"]').value = "None";
            //     Ref.current.querySelector('[id ="measure_select"]').value = "None";
            //     break
            default:
                break
        }


    }


    return (
        <>
            <div ref={Ref}>
                <div ref={mapRef} className="map" />
                <div id="map_btn_div">
                    <button id="endDraw" onClick={() => { selectHandler("endDraw") }}>그리기 종료</button>
                    <button id="removeDraw" onClick={() => { setUser(() => user + 1) }}>그리기 지우기</button>
                    <button id="removeMeasure" onClick={() => { setUser(() => user + 1) }}>측정 지우기</button>
                    <button id="moveCenter" onClick={() => moveCenter()}>center</button>
                    <button id="OSMLayer" onClick={() => { setUser(() => user + 1) }}>OSMLayer</button>
                    <button id="VworldLayer" onClick={() => { setUser(() => user + 1) }}>VWorldLayer</button>
                    <button id="TEST" onClick={() => test()}>TEST</button>
                </div>
                <div id="map_sel_div">
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
                </div>
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
                </div> */}
            </div>
        </>
    )

}


export default ReactMap;