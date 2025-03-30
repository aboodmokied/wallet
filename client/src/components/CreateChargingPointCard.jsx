import React, { useEffect, useState } from 'react'
import { setError } from '../state/error-state/errorSlice';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { axiosPrivate } from '../api/axios';
import errorFormater from '../../utils/errorFormater';
import { Alert, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';

const registerChargingPoint=async(userData)=>{
    try {
      const {data}=await axiosPrivate.post('api/auth/register-by-admin/request',userData);
      return data?.result;
    } catch (error) {
        console.log(error)
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);
    }
  };

const CreateChargingPointCard = () => {
    const dispatch=useDispatch();
    const {mutate,data,isLoading,error}=useMutation({
        mutationFn:registerChargingPoint,
        onSuccess:()=>{
            setFormValues({
                ...formValues,
                email:''
            })
        }
    });

    const [formValues, setFormValues] = useState({
        email: "",
      });
    
      const [formErrors, setFormErrors] = useState({
        email: "",
      });
      const submitHandler=async(e)=>{
        e.preventDefault();
        const data={
            guard:'chargingPoint',
            email:formValues.email
        }
        mutate(data);
    };
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
    <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography className='my-2' variant="h5">Create Charging Point</Typography>
            {!isLoading&&data?.message &&<Alert>{data?.message}</Alert>}
            
            <Box component="form" onSubmit={submitHandler} noValidate autoComplete="off">
                {/* <TextField fullWidth label="Charging Point Email" variant="outlined" sx={{ marginBottom: 2 }} /> */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    error={Boolean(formErrors.email)}
                    helperText={formErrors.email}
                />
                <Button size='small' type='submit' disabled={isLoading} variant="contained" color="primary">Create Charging Point</Button>
            </Box>
        </Paper>
    </Grid>
  )
}

export default CreateChargingPointCard