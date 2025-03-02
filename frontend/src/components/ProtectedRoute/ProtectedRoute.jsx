import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(){
    const { authorized } = useContext(UserContext);

    return authorized ?  <Outlet /> : <Navigate to='/login' replace/>
}

export default ProtectedRoute