import { useLoginStore } from "../stores/LoginStore";
import { menuParse, useMenuStore } from "../stores/MenuStore";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


export const Login = () => {
    const navigate = useNavigate();
    const ref = useRef();
    const loginHandler = () => {
        event.preventDefault()
        if (ref.current.querySelector('[name="user_id"]').value === "") {
            return alert("ID를 입력해주세요");
        }
        if (ref.current.querySelector('[name="user_id"]').value !== "gis") {
            return alert("ID가 옳바르지 않습니다.");
        }
        const menu = [ // DB로 관리할 메뉴 임시 설정
            {
                MENU_IDX: 0,
                LVL: 1,
                MENU_NM: "메인화면",
                PAGE_ROUTE: "/main/Home.view",
                SORT_ORDER: 0,
                USE_TN: "Y"
            },
            {
                MENU_IDX: 1,
                LVL: 1,
                MENU_NM: "GIS",
                PAGE_ROUTE: "/gis/MainGis.view",
                SORT_ORDER: 1,
                USE_TN: "Y"
            },
            {
                MENU_IDX: 2,
                LVL: 1,
                MENU_NM: "ReactMap",
                PAGE_ROUTE: "/gis/ReactMap.view",
                SORT_ORDER: 1,
                USE_TN: "Y"
            }
        ]
        useMenuStore.getState().setMenuList(menu); // FETCH 후 SET 변경
        useLoginStore.getState().setLoginStatus(true);
        menuParse(0); // 메인화면 default
        navigate("/");
    }
    return (
        <>
            <form ref={ref} onSubmit={loginHandler}>
                <div className="loginbody">
                    <section>
                        <label htmlFor="user_id" className="login_label">USER_ID</label>
                        <input
                            type="text"
                            className="login_input"
                            name="user_id"
                            id="user_id"
                            placeholder=" "
                        />
                    </section>
                    <button type="submit" className="login_btn">login</button>
                </div>
            </form>
        </>
    )
}
