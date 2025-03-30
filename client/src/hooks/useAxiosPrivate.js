import { useEffect } from "react"
import { axiosPrivate } from "../api/axios"
import { useSelector } from "react-redux"


const useAxiosPrivate = () => {
  const authState=useSelector(state=>state.auth);
  useEffect(()=>{
    const requestIntercept=axiosPrivate.interceptors.request.use(
      config=>{
        if(!config.headers['Authorization']){
          if(authState.token){
            config.headers['Authorization']=`Bearer ${authState.token}`
          }
        }
      },
      error=>{
        return Promise.reject(error);
      }
    );

    // clean up
    return ()=>{
      axiosPrivate.interceptors.request.eject(requestIntercept);
    }
  },[])
  
  return axiosPrivate;
 
}

export default useAxiosPrivate