import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute(){
    const { authorized } = useContext(UserContext);
    return authorized ? <Navigate to='/'/> : <Outlet/>
}

export default PublicRoute 