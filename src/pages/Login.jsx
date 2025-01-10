import { useRef } from "react";
import { useLoginStore } from "../stores/LoginStore";
import { useNavigate } from "react-router-dom";
import { useMenuStore } from "../stores/MenuStore";


export const Login = () => {
    const navigate = useNavigate();
    const ref = useRef();
    const loginHandler = () => {
        if (ref.current.querySelector('[name="user_id"]').value === "") {
            return alert("ID를 입력해주세요");
        }
        if (ref.current.querySelector('[name="user_id"]').value !== "gis") {
            return alert("ID가 옳바르지 않습니다.");
        }
        const menu = [{
            MENU_IDX: 1,
            MENU_NM: "gis",
            PAGE_ROUTE: "/gis/MainGis.view"
        }]
        useMenuStore.getState().setMenuList(menu); // 메뉴 불러오기 .
        useLoginStore.getState().setLoginStatus(true);
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
                        />
                    </section>
                    <button type="submit" className="login_btn">login</button>
                </div>
            </form>
        </>
    )
}
