import {
    Box,
    Typography,
    CssBaseline,
    Grid,
  } from "@mui/material";
import GuardTabs from '../../components/GuardTabs';
import CompanyRegisterForm from '../../components/CompanyRegisterForm';
import UserRegisterForm from '../../components/UserRegisterForm';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import ChargingPointRegisterForm from "../../components/ChargingPointRegisterForm";

const Register = () => {
  const authState=useSelector(state=>state.auth);
  return (
    <main className="page flex flex-col justify-center items-center max-w-[500px] px-5 sm:px-3 lg-px-0 py-6 w-full">
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
        Register
      </Typography>
      <GuardTabs/>
      {
        authState.authPagesGuard==='user'
        ?<UserRegisterForm/>
        :authState.authPagesGuard==='chargingPoint'
        ?<h1>Public registeration not allowed for charging point..</h1>
        :authState.authPagesGuard==='company'
        ?<CompanyRegisterForm/>
        :<h1>Invalid Guard.</h1>
      }
      <Grid container>
          <Grid item>
              <Link to="/login">
                {"Already have an account? Login"}
              </Link>
          </Grid>
        </Grid>
    </Box>
  </main>
  )
}

export default Register