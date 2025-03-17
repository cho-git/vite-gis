import jsonp from "jsonp";
import { config } from "../Config";

// api 호출
export async function callApi(name) {
    return fetch(cmurl(name), {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(cmparam(name)),
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            throw new Error('err');
        }
    }).catch((err) => console.error('callapi err', err));
}

// vworld api
export function callVworld(name, callBack, { param }) {
    return new Promise((resolve, reject) => {
        const url = "https://api.vworld.kr/req/data?";
        const params = new URLSearchParams(cmparam(name));
        if (param) {
            Object.entries(param).forEach(([key, value]) => {
                params.append(key, value); // params에 추가
            });
        }
        jsonp(url + params.toString(), null, (err, apidata) => {
            if (apidata?.response?.status === "OK") {
                const item = apidata.response.result.featureCollection.features;
                if (callBack) callBack(item);
                else { resolve(item); }
            } else if (apidata?.response?.status === "NOT_FOUND") {
                callBack([])
            }
        });
    });
}
// ref , '[id=id]'
export function getWishElement(ref, type) {
    return ref.current.querySelector(type);
}

// ref , '[id=id]' , value
export function elementValueChange(ref, type, value) {
    const element = getWishElement(ref, type);
    if (element) {
        element.value = value;
    }
}

const cmurl = (name) => {
    const url = {
        // - GIS 22page 주제도-
        "CM_COORD_Q": "https://mogt.kdgas.co.kr:1301/CMPRO/CM_COORD_Q",
        "CCTV": "https://api.vworld.kr/req/data",
    }
    return url[name]
}


const cmparam = (name) => {
    const param = {
        // - GIS 22page 주제도-
        "CM_COORD_Q": {
            "api_name": "CM_COORD_Q",
            "fac_cond":
            {
                "COND": "반경",
                "TM_X": 231562.75979870147,
                "TM_Y": 329135.32101969444,
                "RADIUS": 3000,
                "FAC_TYPE": "",
                "CONST": "",
                "CRET_DATE_FROM": "",
                "CRET_DATE_TO": "",
                "SV_COMP": ""
            }
        },
        "CCTV": { // 2.0 JSON 으로 내려받긴함 . CORS 에러
            "KEY": config.vworldKey, // API 키
            "SERVICE": "data", // 기본값
            "VERSION": "2.0", // 기본값
            "request": "GetFeature", // GetFeature 또는 GetFeatureType
            "FORMAT": "json", // json 또는 xml
            "SIZE": "1000", // 데이터 크기 (기본값 10, 최대값 1000)
            "PAGE": 10, // 페이지 번호
            // "geomfilter": "BOX(14151285.172636375,4300114.2789779045,14190377.120627083,4339206.2269686125)", // 좌표 (예: 서울 시청)
            // "attrFilter":"locate:like:서울특별시 성동구청",
            "COLUMNS": "locate,cctvname,ag_geom", // 출력할 컬럼들 (소재지, CCTV명, 좌표 정보)
            "CRS": "EPSG:3857",
            "ERRORFORMAT": "json",
            "DATA": "LT_P_UTISCCTV", // 데이터 유형 (기본값)
            "GEOMETRY": true, // 좌표 정보 포함 여부
            "ATTRIBUTE": true, // 속성 정보 포함 여부
            "BUFFER": 0, // 버퍼 크기 (기본값: 0)
            "CALLBACK": "", // JSONP 콜백 (필요 시)
        }
        // "CCTV": {
        //     "VERSION": "1.0", // 기본값
        //     "KEY": config.vworldKey, // key
        //     "geometry": "POINT(127.0407943 37.5589599)", // 기본값
        //     "srsName": "EPSG:3857",// 기본값 4326
        //     "filter": "locate:like:서울특별시 성동구청",// GetFeature or GetFeatureType
        //     "pageIndex": "1",
        //     "pageUnit": "10",// emdCd(읍면동코드),locate(소재지),cctvname(cctv명),ag_geom(GEOMETRY 데이터)
        // }

    }
    return param[name]
}

