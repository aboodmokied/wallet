const errorFormater=(error)=>{
    let errorObj={
        type:"unknown",
        message:'something went wrong while login'
    }
    if(error.response){
        errorObj=error.response.data.error;
    }else if(error.message){
        errorObj.type='AxiosError';
        errorObj.message=error.message;
    }
    return errorObj;
}

export default errorFormater; 
