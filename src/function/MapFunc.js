import Draw from "ol/interaction/Draw";
import { fromLonLat } from "ol/proj";
import { useMapStore } from "../stores/MapStore";
import { Control } from "ol/control";
import Modify from "ol/interaction/Modify";

//////////////////////////////////////////////////////////////////
//////////////////////////ReactMap////////////////////////////////
//////////////////////////////////////////////////////////////////


// Layer id
export function getSource(id) {
    const map = useMapStore.getState().map;
    const array = map.getLayers().getArray();
    const layer = array.find((item) => item.values_.id === id)
    if (!layer) return
    return layer.values_.source
}
// Layer id
export function getLayer(id) {
    const map = useMapStore.getState().map;
    return map.getLayers().getArray().find((item) => item.values_.id === id) || null;
}
// <div ref={ref}><button/><select/>....<div> << 추가할 통째
export function addControlDiv(element) {
    const map = useMapStore.getState().map;
    if (!element) return
    const div = new Control({
        element: element
    });
    map.addControl(div);
}

// ref , [id,id,id,id,...]
export function addControl(ref, ids) {
    const map = useMapStore.getState().map;
    for (let key in ids) {
        const item = ref.current.querySelector(`[id=${ids[key]}]`)
        if (!item) return
        let control = new Control({
            element: item
        })
        map.addControl(control);
    }
}
// coordi or 대흥역
export function moveCenter(coordi) {
    const map = useMapStore.getState().map;
    if (coordi) {
        map.getView().setCenter(coordi);
    } else {
        map.getView().setCenter(fromLonLat([126.942069, 37.547771])); // 대흥역
    }
    map.getView().setZoom(18);
}
// type
export function changeDraw(type) {
    const map = useMapStore.getState().map;

    const source = getSource("drawLayer");
    if (!source) return
    const draw = new Draw({
        source: source,
        type: type
    })
    return map.addInteraction(draw);
}
export function changeMeasure() {
    const map = useMapStore.getState().map;
}

export function endDraw() {
    const map = useMapStore.getState().map;
    const draw = map.getInteractions().getArray().find((item) => item instanceof Draw);
    const modi = map.getInteractions().getArray().find((item) => item instanceof Modify);

    if (draw) {
        map.removeInteraction(draw);
    }
    if (modi) {
        map.removeInteraction(modi);
    }

}