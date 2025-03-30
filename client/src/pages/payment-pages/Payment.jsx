import { Box, Button, Container, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { setError } from "../../state/error-state/errorSlice";
import { transferRequest } from "../../state/transaction-state/transferSlice";
import { axiosPrivate } from "../../api/axios";
import errorFormater from "../../../utils/errorFormater";
import { useQuery } from "@tanstack/react-query";
import { paymentRequest } from "../../state/transaction-state/paymentSlice";

const getCompany=async({companyId})=>{
    try {
        const response=await axiosPrivate.get(`api/company/${companyId}`);
        return response.data.result;
    } catch (error) {
        const errorObj=errorFormater(error);
        return Promise.reject(errorObj);   
    }
};

const Payment = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {companyId}=useParams();
    const {data,error:companyError,isLoading}=useQuery({
        queryKey:[`show-company-${companyId}`],
        queryFn:async()=>getCompany({companyId})
    })
    const {status,error}=useSelector(state=>state.payment);
    const [formValues, setFormValues] = useState({
      amount: "",
    });
  
    const [formErrors, setFormErrors] = useState({
      amount: "",
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
    const body={
      target_company_phone:data.company.phone,
      amount:formValues.amount,
    }
    dispatch(paymentRequest(body)).unwrap()
    .then(()=>{
      navigate('/verify-payment')
    })
    .catch(err=>console.log(err));
    };

    useEffect(()=>{
        console.log({companyError,error})
        if(companyError || error){
            const targetError=companyError || error;  
            if(targetError.type=='Validation'){
                const validationErrors={};
                for(let errorObj of targetError.errors){
                    validationErrors[errorObj.path]=errorObj.msg;
                }
                setFormErrors(validationErrors);
            }else{
                dispatch(setError({error:targetError}));
            }
      }
    },[error,companyError]);
  return (
    <>
      {
        isLoading
        ?<p>Loading...</p>
        :(
          <Container sx={{ my: 6 }}>
            <Box>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Target Company Category:
                    </Typography>
                    <Typography variant="h6">{data.company.category.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Target Company Name:
                  </Typography>
                  <Typography variant="h6">{data.company.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Target Company Phone:
                  </Typography>
                  <Typography variant="h6">{data.company.phone}</Typography>
                </Grid>
                
              </Grid>
            <Divider sx={{ width: "100%", my: 2 }} />
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
                  id="amount"
                  label="amount"
                  name="amount"
                  type="number"
                  autoComplete="amount"
                  autoFocus
                  value={formValues.amount}
                  onChange={handleChange}
                  error={Boolean(formErrors.amount)}
                  helperText={formErrors.amount}
                />
                <Button
                  type="submit"
                  disabled={status=='loading'}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>

    )

      }
    </>
    
      
    
  )
}

export default Payment