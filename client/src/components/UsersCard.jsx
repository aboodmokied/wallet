import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import errorFormater from '../../utils/errorFormater';
import { axiosPrivate } from '../api/axios';
import { Link } from 'react-router-dom';

const getSystemUsers=async({guard})=>{
    try {
      const response=await axiosPrivate.get(`api/wallet-user/${guard}/all?limit=5&sort=-createdAt`);
      return response?.data?.result;
    } catch (error) {
        console.log(error)
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);    
    }
}

const UsersCard = ({guard='user',title='System Users'}) => {
    const {data,isLoading,error}=useQuery({
        queryKey:[`system-user-${guard}`],
        queryFn:async()=>getSystemUsers({guard})
    })
  return (
    <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography className="my-2" variant="h5">{title}</Typography>
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {   error
                    ?error.message || 'Something Went Wrong' 
                    :isLoading
                    ?'Loading...'
                    :data?.users?.length
                    ?data.users?.map(user=><Typography key={user.id}>- [{user.id}] - Name: {user.name} - Phone: {user.phone}</Typography>)
                    :'No Users yet'
                }
            </Box>
            <Link to={`/cms/users/${guard}`}>
              <Button size="small" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Show All
              </Button>
            </Link>
        </Paper>
    </Grid>
  )
}

export default UsersCard