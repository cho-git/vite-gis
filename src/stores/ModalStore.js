import { create } from "zustand"


export const popupStore = (set) => ({
    PopOpen: false,
    title: null,
    component: null,
    PopCallBack: null,
    setPopOpen: (open, title, compo, callBack) => set({ PopOpen: open, title: title, component: compo, PopCallBack: callBack }),
})
export const DialogStore = (set) => ({
    DialogOpen: false,
    text: null,
    DiaCallBack: null,
    setDialogOpen: (open, txt, callBack) => set({ DialogOpen: open, text: txt, DiaCallBack: callBack }),
})

export const useModalStore = create((...a) => ({
    ...popupStore(...a),
    ...DialogStore(...a),
}));

