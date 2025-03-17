import Draggable from "react-draggable";
import { useModalStore } from "../../stores/ModalStore";



const DialogModal = () => {
    const modalstore = useModalStore(a => a);

    const DialogHanlder = (bull) => {
        if (bull) {
            modalstore.DiaCallBack()
        }
        modalstore.setDialogOpen(false, null, null)
    }

    return (
        <>
            {modalstore.DialogOpen &&
                <Draggable handle=".test">
                    <div className="popup_content">
                        <h3 className="test">
                            {modalstore.text}
                        </h3>
                        <span className="dialog_footer">
                            <button type="button" onClick={() => DialogHanlder(true)}>예</button>
                            <button type="button" onClick={() => DialogHanlder(false)}>아니오</button>
                        </span>
                    </div>
                </Draggable>
            }
        </>
    )
}

export default DialogModal;