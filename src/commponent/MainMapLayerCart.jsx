// LayerCart.js
import React from 'react';
import { useMapStore } from '../stores/MapStore';

const MainMapLayerCart = () => {
    const map = useMapStore(a => a.map);
    return (
        <>
            <div id="mainmap_layer_cart">
                <div className="layer_cart">
                    <div className="cart_item">
                        <button className="cart_btn" id="normal_map">
                            <span className="cart_label">일반지도</span>
                        </button>
                    </div>
                    <div className="cart_item">
                        <button className="cart_btn" id="sate_map">
                            <span className="cart_label">위성지도</span>
                        </button>
                    </div>
                    <div className="cart_item">
                        <button className="cart_btn" id="geo_map">
                            <span className="cart_label">지형지도</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainMapLayerCart;