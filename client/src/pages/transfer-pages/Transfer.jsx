import { Box, Button, Container, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { setError } from "../../state/error-state/errorSlice";
import { reset, transferRequest } from "../../state/transaction-state/transferSlice";


const Transfer = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location=useLocation();
    const {targetUser,status,error}=useSelector(state=>state.transfer);

    const [formValues, setFormValues] = useState({
      info: "",
      amount: "",
    });
  
    const [formErrors, setFormErrors] = useState({
      info: "",
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
    const data={
      target_phone:targetUser?.phone,
      amount:formValues.amount,
      info:formValues.info,
      
    }
    dispatch(transferRequest(data)).unwrap()
    .then(()=>{
      navigate('/verify-transfer')
    })
    .catch(err=>console.log(err));
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
    <>
      {
        !targetUser
        ?<Navigate to="/target-user" state={{from:location}}/>
        :(
          <Container sx={{ my: 6 }}>
            <Box>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Target User Name:
                  </Typography>
                  <Typography variant="h6">{targetUser.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Target User Phone:
                  </Typography>
                  <Typography variant="h6">{targetUser.phone}</Typography>
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="info"
                  label="info"
                  name="info"
                  type="text"
                  autoComplete="info"
                  value={formValues.info}
                  onChange={handleChange}
                  error={Boolean(formErrors.info)}
                  helperText={formErrors.info}
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

export default Transfer