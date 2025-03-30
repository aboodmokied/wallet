import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

const AuthorizeGuard = ({guards}) => {
    const {user}=useSelector(state=>state.auth);
    const location=useLocation();
  return (
    <>
    {
        guards.includes(user?.guard)
        ? <Outlet/>
        : <Navigate to={'/'} state={{from:location}} replace/>
    }
    </>
)
}

export default AuthorizeGuard