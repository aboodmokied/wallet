import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyEmailRequest } from '../../state/verify-email-state/verifyEmailSlice';
import { setError } from '../../state/error-state/errorSlice';
const VerificationError = () => {
    const {status,error}=useSelector(state=>state.verifyEmail);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const verifyEmailRequestHandler=async()=>{
        dispatch(verifyEmailRequest()).unwrap()
        .then(()=>{
            navigate('/verify-email')
        })
        .catch(err=>console.log(err));
    }
    useEffect(()=>{
        if(error){
            dispatch(setError(error))
        }
    },[error])
  return (
    <Container maxWidth="sm">
            <Box
                textAlign="center"
                py={5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h2" color="error" gutterBottom>
                Verification Required!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                {'Your Account have to be verified to complete this process.'}
                </Typography>
                <Button
                    variant="contained"
                    color="primary" 
                    onClick={verifyEmailRequestHandler} 
                    sx={{ mt: 3 }}
                    disabled={status=='loading'}
                    >
                Verify Account
                </Button>
            </Box>
            </Container>
  )
}

export default VerificationError