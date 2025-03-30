import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper, TextField, Button, Box } from '@mui/material';
import UsersCard from "../../components/UsersCard";
import CreateChargingPointCard from "../../components/CreateChargingPointCard";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../api/axios";
import errorFormater from "../../../utils/errorFormater";
import { Link } from 'react-router-dom';
  
  
  const getRecentSystemTransactions=async()=>{
    try {
      const response=await axiosPrivate.get('api/report/system-transactions?limit=5&sort=-date');
      return response?.data?.result;
    } catch (error) {
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);    
    }
}


const CmsHome = () => {
  const {data,isLoading,error}=useQuery({
    queryKey:['recent-system-transactions'],
    queryFn:getRecentSystemTransactions
  })

  return (
    <div className="page py-5">
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>

          {/* System Transactions */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography className="my-2" variant="h5">Recent System Transactions</Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {
                      isLoading
                      ?'Loading...'
                      :data?.transactions?.length
                      ?data.transactions?.map(transaction=><Typography key={transaction.data.id}>- [{transaction.data.operation_type}] - from({transaction.users.sourceUser.name}) - to({transaction.users.targetUser.name}) - {transaction.data.amount}$ - ({new Date(transaction.data.date).toLocaleString()})</Typography>)
                      :'No Transactions yet'
                  }
              </Box>
              <Link to={'/cms/transactions-report'}>
                <Button size="small" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                    Show All
                </Button>
              </Link>
            </Paper>
          </Grid>

          {/* Create Category */}
          {/* <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5">Create Category</Typography>
              <Box component="form" noValidate autoComplete="off">
                <TextField fullWidth label="Category Name" variant="outlined" sx={{ marginBottom: 2 }} />
                <Button variant="contained" color="primary">Create Category</Button>
              </Box>
            </Paper>
          </Grid> */}

          {/* Show Users */}
          <UsersCard guard="user" title="System Users"/>
          {/* Show Companies */}
          <UsersCard guard="company" title="System Companies"/>
          {/* Show Charging Points */}
          <UsersCard guard="chargingPoint" title="Charging Points"/>
          {/* Create Charging Point */}
          <CreateChargingPointCard/>

        </Grid>
      </Container>
    </div>
  );
};

export default CmsHome;
