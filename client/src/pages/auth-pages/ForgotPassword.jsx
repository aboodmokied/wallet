import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  Grid,
} from "@mui/material";
import GuardTabs from '../../components/GuardTabs';
import { passwordResetRequest, reset } from '../../state/forgot-password-state/forgotPasswordSlice';
import { setError } from '../../state/error-state/errorSlice';



function ForgotPassword() {
  const {authPagesGuard}=useSelector(state=>state.auth);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {error,status}=useSelector(state=>state.forgotPassword);

  const [formValues, setFormValues] = useState({
    email: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

// 2100254
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  
  const submitHandler=(e)=>{
    e.preventDefault();
    const requestBody={
        guard:authPagesGuard,
        email:formValues.email,
    }
    dispatch(passwordResetRequest(requestBody)).unwrap()
    .then(()=>{ 
      navigate('/forgot-password/code');
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
        dispatch(reset())
      }
    }
  },[error]);

  return (
    // <Container component="main" maxWidth="xs">
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
          Forgot Password
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
          />
          <Button
            type="submit"
            disabled={status=='loading'}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send
          </Button>
          <Grid container>
            <Grid item>
            <Link to="/login">
                {"Try To Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </main>

    // </Container>
  );
}

export default ForgotPassword;
