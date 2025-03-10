import { useModalStore } from "../../stores/ModalStore";

const PopupModal = () => {

    const modalstore = useModalStore(a => a);
    return (
        <>
            {modalstore.PopOpen &&
                <div className="popup_content">
                    <h3 className="popup_title">{modalstore.title}
                        <button onClick={() => { modalstore.setPopOpen(false, null, null, null) }}>x</button>
                    </h3>
                    {modalstore.component}
                </div>
            }
        </>
    )
}

export default PopupModal;