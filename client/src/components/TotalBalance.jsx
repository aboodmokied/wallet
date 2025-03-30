import { AccountBalance } from '@mui/icons-material'
import { Grid, Paper, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import errorFormater from '../../utils/errorFormater';
import { axiosPrivate } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { setError } from '../state/error-state/errorSlice';
import { useEffect } from 'react';


const getCurrentUserWallet=async()=>{
    try {
      const response=await axiosPrivate.get('api/current-user-wallet');
      return response?.data?.result;
    } catch (error) {
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);    
    }
}

const TotalBalance = () => {
    const dispatch=useDispatch();
    const {data,isLoading,error}=useQuery({
        queryKey:['user-wallet'],
        queryFn:getCurrentUserWallet
      })
    useEffect(()=>{
    if(error){
        dispatch(setError(error));
    }
    },[error])
  return (
    <>
        {
            error
            ? <p>{error.message||'Something Went Wrong'}</p>
            :(
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                        <AccountBalance fontSize="large" color="primary" />
                        <Typography variant="h6" gutterBottom>
                        Total Balance
                        </Typography>
                        <Typography variant="h5">{isLoading?'Loading...':`${data?.wallet?.balance}$`}</Typography>
                    </Paper>
                </Grid>
            )
        }
    </>
    
  )
}

export default TotalBalance