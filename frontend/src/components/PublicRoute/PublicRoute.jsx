import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PublicRoute(){
    const location = useLocation();
    const { authorized } = useContext(UserContext);
    console.log('authorized: ' + authorized)
    
    return (!authorized || location.pathname == '/registration') ? <Outlet/> :  <Navigate to='/'/>
}

export default PublicRoute 