import Draw from "ol/interaction/Draw";
import { Layers } from "../resources/MapLayer";
import { useMapStore } from "../stores/MapLayerStore";
import { fromLonLat } from "ol/proj";

// source 가져와야하는 적이 많아서 생성.
export function getSource(id) {
    const gismap = useMapStore.getState().gisMap
    const array = gismap.getLayers().array_
    const layer = array.find((item) => item.values_.id === id)
    if (!layer) return
    return layer.values_.source
}

export function changeDraw(type) {
    const gismap = useMapStore.getState().gisMap
    const mapobj = useMapStore.getState().MapObj
    const setMapObj = useMapStore.getState().setMapObj
    if (mapobj?.draw) {
        console.log(mapobj.draw)
        gismap.removeInteraction(mapobj.draw);
    }
    const draw = new Draw({
        source: getSource("vworldLayer"),
        type: type
    })
    gismap.addInteraction(draw)
    // setMapObj({ draw: draw });
}

// 상황별 켜야하는 Layer
export function changeLayer(id) {
    if (!id) return
    switch (id) {

        case "drawLayer":
            Layers.find((item) => item.values_.id === id).setVisible(true)
            break

        case "":
            break

        default:
            for (let key in Layers) {
                Layers[key].setVisible(Layers[key].values_.id === id)
            }
            break

    }
}

export function changeZoom(state, coordi) {
    const gismap = useMapStore.getState().gisMap;
    switch (state) {
        case "move":
            gismap.getView().setCenter(coordi);
            break;
        default:
            gismap.getView().setCenter(fromLonLat([126.942069, 37.547771]));
            break;
    }
    gismap.getView().setZoom(18);
}