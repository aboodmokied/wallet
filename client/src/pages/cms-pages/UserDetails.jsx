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
import UserTransactions from "../../components/UserTransactions";

const showUser=async({guard,user_id})=>{
  try {
    const response=await axiosPrivate.get(`api/wallet-user/${guard}/${user_id}`)
    return response.data?.result;
  } catch (error) {
    const errorObj=errorFormater(error);
    return Promise.reject(errorObj);
  }
};


const UserDetails = () => {
      const dispatch=useDispatch();
      const {user_id,guard}=useParams();
      const {data,isLoading,error}=useQuery({
        queryKey:[`wallet-user-${guard}-${user_id}`],
        queryFn:async()=>showUser({user_id,guard})
      })

      useEffect(()=>{
        if(error){
          dispatch(setError(error))
        }
      },[error]);

  return (
    <>
          <Box>
            {/* Transaction Details */}
            <Container sx={{ my: 6 }}>
                {isLoading
                ? <p>Loading...</p>
                :error
                ? <p>{error.message||'Something went wrong'}</p>
                :( 
                    <>
                    <Typography variant="h4" gutterBottom>
                        User ID: {data.user.id}
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" color="textSecondary">
                            Name:
                            </Typography>
                            <Typography variant="h6">{data.user.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">
                            Phone:
                            </Typography>
                            <Typography variant="h6">{data.user.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">
                            Verfied:
                            </Typography>
                            <Typography
                            variant="h6"
                            // sx={{ color:data.yourIdentity=='sender'?"error.main":"success.main" }}
                            >
                            {data.user.verified+''}
                            </Typography>
                        </Grid>
                        {
                            data.user.guard!=='chargingPoint'&&(
                                <>
                                    <Divider sx={{ width: "100%", my: 2 }} />
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Wallet ID:
                                        </Typography>
                                        <Typography variant="h6">{data.wallet.id}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Current Balance:
                                        </Typography>
                                        <Typography variant="h6">${data.wallet.balance}</Typography>
                                    </Grid>
                                </>      
                            )
                        }
                        
                        </Grid>
                    </Paper>
                    </>
                 ) 
                    }
             <UserTransactions guard={guard} user_id={user_id}/>
            </Container>
          </Box>
        {/* ) */}
      {/* } */}
    </>

  );
};

export default UserDetails;
