import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
} from "@mui/material";
import { setError } from '../../state/error-state/errorSlice';
import { verifyEmail } from '../../state/verify-email-state/verifyEmailSlice';





function VerifyEmail() {
  const dispatch=useDispatch();
  const {message,error,status,codeWasSent}=useSelector(state=>state.verifyEmail);
  const navigate=useNavigate();
  const [formValues, setFormValues] = useState({
    code: "",
  });

  const [formErrors, setFormErrors] = useState({
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });


    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  
  const submitHandler=(e)=>{
    e.preventDefault();
    const requestBody={
        code:formValues.code
    }
    dispatch(verifyEmail(requestBody)).unwrap()
    .then(()=>{ 
      navigate('/');
    })
    .catch(error=>{
      console.log(error);
    })
    
};

  useEffect(()=>{
    if(error){
      if(error.type=='Validation'){
        const validationErrors={};
        for(let errorObj of error.errors){
           validationErrors[errorObj.path]=errorObj.msg;
        }
        setFormErrors(validationErrors);
      }else{
        dispatch(setError({error}));
      }
    }
  },[error]);

  return (
    <>
    {
        !codeWasSent
        ?<Navigate to='/verification-error'/>
        :(
    <main className="page container flex flex-col justify-center items-center max-w-[500px] px-5 sm:px-3 lg-px-0">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Verify Code
        </Typography>
        {
          message&&(
            <p className='my-3 text-center text-sm lg:text-base'>
              {message}
            </p>
          )
        }
        
        <Box
          component="form"
          onSubmit={submitHandler}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Verification Code"
            name="code"
            autoComplete="code"
            autoFocus
            value={formValues.code}
            onChange={handleChange}
            error={Boolean(formErrors.code)}
            helperText={formErrors.code}
          />
          <Button
            type="submit"
            disabled={status==='loading'}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Verify
          </Button>
        </Box>
      </Box>
    </main>
         )
    }
    </>
    
    // <Container component="main" maxWidth="xs">
    

    // </Container>
  );
}

export default VerifyEmail;
