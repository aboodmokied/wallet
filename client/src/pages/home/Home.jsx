// import { useDispatch, useSelector } from "react-redux"
// import { logout, refresh } from "../../state/auth-state/authSlice";

// HomePage.js
// import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Grid,
    Paper,
    IconButton,
  } from "@mui/material";
  import { AccountBalanceWallet, Security, TrendingUp } from "@mui/icons-material";
import { Link } from "react-router-dom";
  
  const Home = () => {
    return (
      <Box className="page">
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Online Wallet
            </Typography>
            <Link to='/login'>
              <Button color="inherit">Login</Button>
            </Link>
            <Link to='/register'>
              <Button color="inherit">Register</Button>
            </Link>
          </Toolbar>
        </AppBar>
  
        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: "primary.light",
            color: "white",
            py: 10,
            textAlign: "center",
          }}
        >
          <Container>
            <Typography variant="h3" gutterBottom>
              Manage Your Finances Seamlessly
            </Typography>
            <Typography variant="h6" gutterBottom>
              Secure, Fast, and Easy-to-Use Online Wallet for All Your Needs
            </Typography>
            <Link to='/login'>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 3 }}
              >
                Get Started
              </Button>
            </Link>
          </Container>
        </Box>
  
        {/* Features Section */}
        <Container sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <IconButton color="primary" size="large">
                  <AccountBalanceWallet fontSize="large" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  All-in-One Wallet
                </Typography>
                <Typography>
                  Store, send, and receive money securely all in one place.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <IconButton color="primary" size="large">
                  <Security fontSize="large" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Top-Notch Security
                </Typography>
                <Typography>
                  Enjoy peace of mind with industry-leading security measures.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <IconButton color="primary" size="large">
                  <TrendingUp fontSize="large" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Track Your Growth
                </Typography>
                <Typography>
                  Analyze spending trends and achieve your financial goals.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
  
        {/* Footer */}
        <Box
          sx={{
            backgroundColor: "grey.900",
            color: "white",
            py: 3,
            mt: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Online Wallet. All rights reserved.
          </Typography>
        </Box>
      </Box>
    );
  };
  
  export default Home;
  
  
  
  // const UserHome = () => {
  //   const dispatch=useDispatch();
  //   const authState=useSelector(state=>state.auth);
  //   const clickHandler=()=>{
  //     dispatch(logout());
  //   }
  //   const logoutHandler=()=>{
  //     dispatch(refresh());
  //   }
  //   return (
  //     <section>
  //       <div className="grid grid-cols-2">
  //         <div className="item">1</div>
  //         <div className="item">2</div>
  //         <div className="item">3</div>
  //         <div className="item">4</div>
  //       </div>
  //     </section>
  //   )
  // }
  
  // export default UserHome