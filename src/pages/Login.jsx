import { useRef } from "react";
import { useLoginStore } from "../stores/LoginStore";
import { useNavigate } from "react-router-dom";


export const Login = () => {
    const navigate = useNavigate();
    const ref = useRef();
    const loginHandler = () => {
        if (ref.current.querySelector('[name="user_id"]').value === "") {
            return alert("ID를 입력해주세요")
        }
        if (ref.current.querySelector('[name="user_id"]').value !== "jin") {
            return alert("ID가 옳바르지 않습니다.")
        }
        useLoginStore.getState().setLoginStatus(true)
        navigate("/");
    }
    return (
        <>
            <form ref={ref} onSubmit={loginHandler}>
                <section>
                    <label htmlFor="user_id">USER_ID</label>
                    <input
                        type="text"
                        name="user_id"
                        onFocus={true}
                    />
                </section>
                <button type="submit" className="login_btn" style={{ border: "1px solid #000" }}>login</button>
            </form>
        </>
    )
}
