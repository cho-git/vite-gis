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

const cmurl = (name) =>{
    const url = {
        // - GIS 22page 주제도-
        "CM_COORD_Q" : "https://mogt.kdgas.co.kr:1301/CMPRO/CM_COORD_Q"
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
        }
    }
    return param[name]
}

