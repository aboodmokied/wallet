import { Box, Button, Container, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { setError } from "../../state/error-state/errorSlice";
import { reset, verifyCharging } from "../../state/transaction-state/chargingSlice";

const VerifyCharging = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location=useLocation();
    const {transaction,verifiedTransactionId,codeWasSent,message,isVerified,targetUser,operationDetails,status,error}=useSelector(state=>state.charging);

    const [formValues, setFormValues] = useState({
      verification_code: "",
    });
  
    const [formErrors, setFormErrors] = useState({
      verification_code: "",
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
  
  
  const doneHandler=()=>{
    dispatch(reset());
    navigate('/');
  }  
  const submitHandler=async(e)=>{
    e.preventDefault();
    const data={
      transaction_id:transaction.id,
      verification_code:formValues.verification_code,
    }
    dispatch(verifyCharging(data))
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
    <>
      {
        !codeWasSent
        ?<Navigate to="/charging-target-user" state={{from:location}}/>
        :(
          <Container sx={{ my: 6 }}>
            <Box>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Operation Type:
                    </Typography>
                    <Typography variant="h6">{transaction.operation_type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Date:
                    </Typography>
                    <Typography variant="h6">{new Date(transaction.date).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color:"error.main" }}
                    >
                      ${transaction.amount}
                    </Typography>
                  </Grid>
                  
                  <Divider sx={{ width: "100%", my: 2 }} />
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Receiver:
                    </Typography>
                    <Typography variant="h6">{targetUser.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Receiver Phone:
                    </Typography>
                    <Typography variant="h6">{targetUser.phone}</Typography>
                  </Grid>
                  <Divider sx={{ width: "100%", my: 2 }} />
                  {operationDetails.opertaionInfo.info && (
                    <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Info:
                    </Typography>
                    <Typography variant="h6">{operationDetails.opertaionInfo.info}</Typography>
                  </Grid>
                  )}
              </Grid>
            <Divider sx={{ width: "100%", my: 2 }} />
            {
          isVerified && verifiedTransactionId==transaction.id
          ?(
            <>
                <p className='my-3 text-center text-sm lg:text-base'>
                  {message}
                </p>
                <Button
                disabled={status=='loading'}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={doneHandler}
              >
                Done
              </Button>
            </>
          )
          :(
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
                  id="verification_code"
                  label="verification_code"
                  name="verification_code"
                  type="text"
                  autoComplete="verification_code"
                  autoFocus
                  value={formValues.verification_code}
                  onChange={handleChange}
                  error={Boolean(formErrors.verification_code)}
                  helperText={formErrors.verification_code}
                />
                
                <Button
                  type="submit"
                  disabled={status=='loading'}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Verify
                </Button>
              </Box>
          )
        }
            
            </Paper>
          </Box>
        </Container>

    )

      }
    </>
    
      
    
  )
}

export default VerifyCharging