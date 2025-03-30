import {  useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RequireVerification = () => {
    const {user}=useSelector(state=>state.auth);
    const location=useLocation();
  return (
    <>
    {
        user?.verified
        ? <Outlet/>
        : <Navigate to='/verification-error' state={{from:location}} replace/>
    }
    
    </>
)
}

export default RequireVerification