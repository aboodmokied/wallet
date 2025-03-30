import { useDispatch, useSelector } from "react-redux"
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";
import { reset } from "../../state/error-state/errorSlice";
const AsyncErrorBoundary = ({children}) => {
    const {hasError,error}=useSelector(state=>state.error);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    // const blackList=['Validation'];
    const onRetryHandler=()=>{
        dispatch(reset());
        navigate("/");
    }

    // if(hasError&&blackList.includes(error.type)){
    //     return children;
    // }
    return hasError?<ErrorPage error={error} onRetry={onRetryHandler}/>:children
}

export default AsyncErrorBoundary
