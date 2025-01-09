import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "../stores/LoginStore";
import { useEffect } from "react";

export default function PrivateRoute() {
    const isLogin = useLoginStore((state) => state.LoginStatus);

    useEffect(()=>{
        console.log(isLogin);
    },[isLogin])
    
    if (isLogin === null || isLogin === false) {
        return <Navigate replace to="/login" />;
    }

    return <Outlet />;
}

