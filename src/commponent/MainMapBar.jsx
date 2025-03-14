import React from 'react';
import logo from "../assets/img/logo.png";
import { useMapStore } from '../stores/MapStore';
import { changeLayer } from '../function/MapFunc';

const MainMapBar = () => {
    const map = useMapStore(a => a.map);

    return (
        <>
            <div id="mainmap_bar">
                <h1 className="logo_box" onClick={() => { changeLayer("vworldLayer"); }}><img className="log_img" src={logo} /></h1>
            </div>
        </>
    )
}

export default MainMapBar;