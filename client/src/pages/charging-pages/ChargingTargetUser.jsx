import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, CssBaseline, TextField, Typography } from "@mui/material";
import { setError } from "../../state/error-state/errorSlice";
import { getChargingTargetUser, reset } from "../../state/transaction-state/chargingSlice";


const ChargingTargetUser = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {error,status}=useSelector(state=>state.charging);
    const [formValues, setFormValues] = useState({
      target_phone: "",
    });
  
    const [formErrors, setFormErrors] = useState({
      target_phone: "",
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
      target_phone:formValues.target_phone,
    }
        dispatch(getChargingTargetUser(data)).unwrap()
        .then(()=>{
            navigate('/charging');
        })
        .catch(err=>console.log(err))
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
          dispatch(reset())
        }
      }
    },[error]);
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
            Charging
        </Typography>
        <p className="text-xs my-2">
            for testing use this phone: 0597201294
        </p>
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
            id="target_phone"
            label="Target User Phone"
            name="target_phone"
            autoComplete="target_phone"
            autoFocus
            value={formValues.target_phone}
            onChange={handleChange}
            error={Boolean(formErrors.target_phone)}
            helperText={formErrors.target_phone}
          />
          <Button
            type="submit"
            disabled={status=='loading'}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enter
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default ChargingTargetUser