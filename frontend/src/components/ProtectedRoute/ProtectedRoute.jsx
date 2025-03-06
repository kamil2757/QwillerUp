import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(){
    const { authorized, loading } = useContext(UserContext);

    if (loading) {
        return null; 
    }

    return authorized ?  <Outlet /> : <Navigate to='/' replace/>
}

export default ProtectedRoute