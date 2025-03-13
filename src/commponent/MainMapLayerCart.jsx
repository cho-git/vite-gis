// LayerCart.js
import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { changeLayer, getLayer } from '../function/MapFunc';

const MainMapLayerCart = () => {
    const map = useMapStore(a => a.map);
    const test = () => {
        console.log(map);
        debugger
    }
    return (
        <>
            <div id="mainmap_layer_cart">
                <div className="layer_cart">
                    <div className="cart_item" onClick={() => { changeLayer("vworldLayer") }}>
                        <button type="button" className="cart_btn" id="normal_map" >
                            <span className="cart_label">일반지도</span>
                        </button>
                    </div>
                    <div className="cart_item" onClick={() => { changeLayer("Satellite") }}>
                        <button type="button" className="cart_btn" id="sate_map" >
                            <span className="cart_label" >위성지도</span>
                        </button>
                    </div>
                    <div className="cart_item" onClick={() => { changeLayer("Hybrid") }}>
                        <button type="button" className="cart_btn" id="hybrid_map">
                            <span className="cart_label">하이브리드</span>
                        </button>
                    </div>
                    <div className="cart_item" onClick={() => { changeLayer("White") }}>
                        <button type="button" className="cart_btn" id="white_map">
                            <span className="cart_label">백지도</span>
                        </button>
                    </div>
                    <div className="cart_item" onClick={() => { changeLayer("Midnight") }}>
                        <button type="button" className="cart_btn" id="midnight_map">
                            <span className="cart_label">야간지도</span>
                        </button>
                    </div>
                    {/* <div className="cart_item" onClick={() => { test() }}>
                        <button type="button" className="cart_btn" id="geo_map">
                            <span className="cart_label">debugger</span>
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default MainMapLayerCart;