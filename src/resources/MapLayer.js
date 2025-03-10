import { OSM, XYZ } from "ol/source";
import { config } from "../Config";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";


// layers: [Layers.find((item) => item.values_.id === ${id]})]
export const Layers = [
    // Open Street Map Layer
    new TileLayer({
        id: 'osmLayer',
        source: new OSM(),
        visible: false,
    }),

    // vworld Layer
    new TileLayer({
        id: 'vworldLayer',
        source: new XYZ({
            url: `https://api.vworld.kr/req/wmts/1.0.0/${config.vworldKey}/Base/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
            attributionsCollapsible: false,
        }),
        visible: true,
        // minResolution: 0.25,
    }),

    // drawLayer 그리기
    new VectorLayer({
        id: 'drawLayer',
        source: new VectorSource({ wrapX: false }),
        visible: true,
    }),

    // measureLayer 측정
    new VectorLayer({
        id: 'measureLayer',
        source: new VectorSource({ wrapX: false }),
        style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        },
        visible: true,
    }),

    new VectorLayer({
        id: 'thematic1',
        source: new VectorSource({ wrapX: false }),
        style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 100,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        },
        visible: false,
    })


]

//fromlonlat :  4326 > 3857
// source: new OSM(), // 레이어의 소스
// properties: { name: 'base-osm' }, // 임의 속성 get(),set() 으로 조작 가능
// zIndex: 1, // 우선순위
// minZoom: 7, // 최소 표시 줌 레벨
// maxZoom: 20, // 최대 표시 줌 레벨
// minResolution: 10,// 최소 표시 해상도
// maxResolution: 200,// 최대 표시 해상도
// preload: Infinity, //지정한 레벨까지 저해상도 타일을 미리 로드 (0은 미사용)
// extent : true // 레이어의 렌더링 범위 , 해당 범위를 넘어가면 데이터 표시 x
// visible // 표시 여부
// opacity // 투명도
// className // 클래스명
// useInterimTilesOnError // 오류 시 중간 타일 사용 여부