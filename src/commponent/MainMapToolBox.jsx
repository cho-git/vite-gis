import React, { useEffect } from 'react';
import { useMapStore } from '../stores/MapStore';
import { activeLable } from '../function/CompoFunc';

const MainMapToolBox = () => {
    // const map = useMapStore(a => a.map);

    useEffect(()=>{
        activeLable()
    },[])

    return (
        <>
        </>
    )
}

export default MainMapToolBox;