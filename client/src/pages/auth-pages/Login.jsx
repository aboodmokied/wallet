import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, resetError, togglePersist } from '../../state/auth-state/authSlice';
import { setError } from '../../state/error-state/errorSlice';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  Grid,
  Checkbox,
} from "@mui/material";
import GuardTabs from '../../components/GuardTabs';



function Login() {
  const {error,isLoading}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const from=location.state?.from?.pathname || '/home';


  const authState=useSelector(state=>state.auth);
  

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
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

  const persistHandler=()=>{
    dispatch(togglePersist());
  }
  const submitHandler=(e)=>{
    e.preventDefault();
    const requestBody={
        guard:authState.authPagesGuard,
        email:formValues.email,
        password:formValues.password,
    }
    dispatch(login(requestBody)).unwrap()
    .then(()=>{
        navigate(from);
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
      }else if(error.type=='Authentication'){
        if(error.message=='Wrong Credintials'){
          setFormErrors({
            ...formErrors,
            email: error.message,
          });
        }else if(error.message=='Wrong Password'){
          setFormErrors({
            ...formErrors,
            password: error.message,
          });
        } 
      }else{
        dispatch(setError({error}));
        dispatch(resetError())
      }
    }
  },[error]);

  return (
    // <Container component="main" maxWidth="xs">
    <>
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
          Login
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
          <label className='flex justify-start items-center gap-[1px] cursor-pointer'>
          <Checkbox
            id="persist"
            checked={authState.persist}
            onChange={persistHandler}
          />
          <h6>Remember Me</h6>
          </label>
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: mutation.isLoading ? 'grey.500' : 'primary.main',
              '&:hover': {
                backgroundColor: mutation.isLoading ? 'grey.500' : 'primary.dark',
              },
            }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </main>
      <Link className='absolute bottom-2 right-2 text-blue-500' to="/cms/login">
        {"CMS Login"}
      </Link>
  </>
    // </Container>
  );
}

export default Login;
