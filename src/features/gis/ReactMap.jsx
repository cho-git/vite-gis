import { useEffect, useRef } from "react";
import { useMapStore } from "../../stores/MapStore";
import "../../assets/css/map.css"

const ReactMap = () => {

    const map = useMapStore(a => a.map);
    const mapRef = useRef();

    useEffect(() => {
        map.setTarget();
        if (!mapRef.current) return
        console.log(map);
        map.setTarget(mapRef.current);
        map.on('click', function (e) {
            console.log(e.coordinate);
        })
    }, [])

    return (
        <>
            <div ref={mapRef} className="main_gis" />
        </>
    )

}


export default ReactMap;