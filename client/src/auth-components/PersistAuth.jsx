import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { refresh } from '../state/auth-state/authSlice';

const PersistAuth = () => {
  const {isAuthenticated,persist}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  const [isLoading,setIsLoading]=useState(true);
  useEffect(()=>{
    const refreshHandler=()=>{
      setIsLoading(true);
      dispatch(refresh()).unwrap()
      .then(()=>{
        setIsLoading(false);
      })
      .catch(error=>{
        console.log(error);
      })
      .finally(()=>{
        setIsLoading(false);
      })
    }
      if(persist){
        !isAuthenticated?refreshHandler():setIsLoading(false);
      }
  },[isAuthenticated,persist,dispatch]);
  return (
    <>
    {   !persist
        ?<Outlet/>
        :isLoading
        ?<h1>Loading...</h1>
        :<Outlet/>
    }
    
    </>
)
}

export default PersistAuth