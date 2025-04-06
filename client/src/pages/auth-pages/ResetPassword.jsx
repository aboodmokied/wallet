import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
} from "@mui/material";
import GuardTabs from '../../components/GuardTabs';
import { passwordReset, reset } from '../../state/forgot-password-state/forgotPasswordSlice';
import { setError } from '../../state/error-state/errorSlice';



function ResetPassword() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {error,status,isVerified}=useSelector(state=>state.forgotPassword);
  const [formValues, setFormValues] = useState({
    password: "",
    confirm_password: "",
  });

  const [formErrors, setFormErrors] = useState({
    password: "",
    confirm_password: "",
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
        password:formValues.password,
        confirm_password:formValues.confirm_password
    }
    dispatch(passwordReset(requestBody)).unwrap()
    .then(()=>{ 
      navigate('/login');
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
        dispatch(setError({error}))
        dispatch(reset());
      }
    }
  },[error]);

  return (
    <>
    {
        !isVerified
        ?<Navigate to='/forgot-password'/>
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
          Reset Password
        </Typography>
        <GuardTabs/>
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            autoComplete="confirm_password"
            value={formValues.confirm_password}
            onChange={handleChange}
            error={Boolean(formErrors.confirm_password)}
            helperText={formErrors.confirm_password}
          />
          <Button
            type="submit"
            disabled={status=='loading'}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset
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

export default ResetPassword;
