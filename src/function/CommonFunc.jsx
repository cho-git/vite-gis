



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
