import {ArrowBackIos, Home, HomeMax, Logout } from '@mui/icons-material'
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { logout } from '../state/auth-state/authSlice'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'

const Header = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const {user}=useSelector(state=>state.auth);
  const logoutHandler=()=>{
    dispatch(logout());
  }
  return (
    // <header className='bg-[#1976d2] flex justify-center items-center p-3 w-full relative text-white'>
      <AppBar position="static">
        <Toolbar>
          {
            location.pathname!=='/home' && (
                <Home className='cursor-pointer mx-2' onClick={()=>{navigate('/')}}/>
            )
          }
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.name}!
          </Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={logoutHandler}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    // </header>
    
  )
}

export default memo(Header);