// TransactionDetailsPage.js
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import errorFormater from "../../../utils/errorFormater";
import { axiosPrivate } from "../../api/axios";
import { setError } from "../../state/error-state/errorSlice";
import { useDispatch } from "react-redux";

const showTransaction=async({id})=>{
  try {
    const response=await axiosPrivate.get(`api/transaction/${id}`)
    return response.data?.result;
  } catch (error) {
    const errorObj=errorFormater(error);
    return Promise.reject(errorObj);
  }
};


const TransactionReport = () => {
      const dispatch=useDispatch();
      const {transaction_id}=useParams();
      const {data,isLoading,error}=useQuery({
        queryKey:[`transaction-report-${transaction_id}`],
        queryFn:async()=>showTransaction({id:transaction_id})
      })

      useEffect(()=>{
        if(error){
          dispatch(setError(error))
        }
      },[error]);

  return (
    <>
      {isLoading
        ? <p>Loading...</p>
        :error
        ? <p>{error.message||'Something went wrong'}</p>
        :(
          <Box>
            {/* Transaction Details */}
            <Container sx={{ my: 6 }}>
              <Typography variant="h4" gutterBottom>
                Transaction ID: {data.transaction.id}
              </Typography>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Operation Type:
                    </Typography>
                    <Typography variant="h6">{data.transaction.operation_type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Date:
                    </Typography>
                    <Typography variant="h6">{new Date(data.transaction.date).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      // sx={{ color:data.yourIdentity=='sender'?"error.main":"success.main" }}
                    >
                      ${data.transaction.amount}
                    </Typography>
                  </Grid>
                  
                  <Divider sx={{ width: "100%", my: 2 }} />
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Sender:
                    </Typography>
                    <Typography variant="h6">{data.users.sourceUser.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Receiver:
                    </Typography>
                    <Typography variant="h6">{data.users.targetUser.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Sender Phone:
                    </Typography>
                    <Typography variant="h6">{data.users.sourceUser.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Receiver Phone:
                    </Typography>
                    <Typography variant="h6">{data.users.targetUser.phone}</Typography>
                  </Grid>
                  
                  {data.operation?.info && (
                    <>
                      <Divider sx={{ width: "100%", my: 2 }} />
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Info:
                        </Typography>
                        <Typography variant="h6">{data.operation?.info}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Container>
          </Box>
        )
      }
    </>

  );
};

export default TransactionReport;
