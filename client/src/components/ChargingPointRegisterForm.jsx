import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosRequest from '../api/axios';
import errorFormater from '../../utils/errorFormater';
import {
    Box,
    Button,
    TextField,
  } from "@mui/material";
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {setError} from '../state/error-state/errorSlice';
import { reset } from '../state/transaction-state/chargingSlice';

const registerNewUser=async(userData)=>{
  try {
    const {data}=await axiosRequest.post('api/register',userData);
    return data?.result;
  } catch (error) {
    const errorObj=errorFormater(error);
    return Promise.reject(errorObj);
  }
};

const ChargingPointRegisterForm = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {mutate,isLoading,error}=useMutation({
        mutationFn:registerNewUser
    });

    const [formValues, setFormValues] = useState({
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      name: "",
      national_id: ""
    });
  
    const [formErrors, setFormErrors] = useState({
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      name: "",
      national_id: ""
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
  
  

  const submitHandler=async(e)=>{
    e.preventDefault();
    const data={
        guard:'chargingPoint',
        name:formValues.name,
        email:formValues.email,
        phone:formValues.phone,
        password:formValues.password,
        confirm_password:formValues.confirm_password,
    }
        mutate(data,{
            onSuccess:()=>{
                navigate('/login');
            },
        });
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
          dispatch(reset());
        }
      }
    },[error]);
  return (
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
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formValues.name}
            onChange={handleChange}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
          />
        <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
          />
        <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
            value={formValues.phone}
            onChange={handleChange}
            error={Boolean(formErrors.phone)}
            helperText={formErrors.phone}
          />
        <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="password"
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
          />
        <TextField
            margin="normal"
            required
            fullWidth
            id="confirm_password"
            label="Confirm Password"
            name="confirm_password"
            type="password"
            autoComplete="confirm_password"
            value={formValues.confirm_password}
            onChange={handleChange}
            error={Boolean(formErrors.confirm_password)}
            helperText={formErrors.confirm_password}
          />
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
  )
}

export default ChargingPointRegisterForm