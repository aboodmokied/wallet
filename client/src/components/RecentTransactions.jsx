import { AccountBalance } from '@mui/icons-material'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import errorFormater from '../../utils/errorFormater';
import { axiosPrivate } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { setError } from '../state/error-state/errorSlice';
import { useEffect } from 'react';


const getRecentTransactions=async()=>{
    try {
      const response=await axiosPrivate.get('api/current-user-transactions?limit=5&sort=-date');
      return response?.data?.result;
    } catch (error) {
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);    
    }
}

const RecentTransactions = () => {
    const dispatch=useDispatch();
    const {data,isLoading,error}=useQuery({
        queryKey:['recent-transactions'],
        queryFn:getRecentTransactions
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
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Transactions
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                        {
                            isLoading
                            ?'Loading...'
                            :data?.transactions?.length
                            ?data.transactions?.map(transaction=><Typography key={transaction.data.id}>- [{transaction.data.operation_type}] - from({transaction.users.sourceUser.name}) - to({transaction.users.targetUser.name}) - {transaction.data.amount}$ - ({new Date(transaction.data.date).toLocaleString()})</Typography>)
                            :'No Transactions yet'
                        }
                    </Box>
                    </Paper>
                </Grid>
            )
        }
    </>
    
  )
}

export default RecentTransactions