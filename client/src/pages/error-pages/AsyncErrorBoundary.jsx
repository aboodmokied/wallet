import { useDispatch, useSelector } from "react-redux"
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";
import { reset } from "../../state/error-state/errorSlice";
const AsyncErrorBoundary = ({children}) => {
    const {hasError,error}=useSelector(state=>state.error);
    console.log('Error Boundary:',{error,hasError});
    const navigate=useNavigate();
    const dispatch=useDispatch();
    // const blackList=['Validation'];
    const onRetryHandler=async()=>{
        await dispatch(reset())
        console.log('Naviage to root')
        navigate("/");
    }

    // if(hasError&&blackList.includes(error.type)){
    //     return children;
    // }
    return hasError?<ErrorPage error={error} onRetry={onRetryHandler}/>:children
}

export default AsyncErrorBoundary
