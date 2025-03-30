import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({type='regular'}) => {
    const {isAuthenticated,authType}=useSelector(state=>state.auth);
    const location=useLocation();
  return (
    <>
    {
        isAuthenticated && authType==type
        ? <Outlet/>
        : !isAuthenticated
        ? <Navigate to={type=='regular'?'/login':'/cms/login'} state={{from:location}} replace/>
        : <Navigate to={authType=='cms'?'/cms/home':'/home'} />
    }
    
    </>
)
}

export default RequireAuth