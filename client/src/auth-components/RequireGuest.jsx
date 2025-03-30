import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

const RequireGuest = () => {
  const {isAuthenticated,authType}=useSelector(state=>state.auth);
  const location=useLocation();
  return (
    <>
    {
        !isAuthenticated
        ? <Outlet/>
        : <Navigate to={authType=='cms'?'/home':'/cms/home'} state={{from:location}} replace/>
    }
    
    </>
)
}

export default RequireGuest