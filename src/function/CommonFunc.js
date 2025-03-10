
export async function callApi(url, param) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(param),
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
