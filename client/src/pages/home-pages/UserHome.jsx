// import { useDispatch, useSelector } from "react-redux"
// import { logout, refresh } from "../../state/auth-state/authSlice";

// HomePage.js
// import React from "react";
// LoggedInHomePage.js
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import {
  AccountBalance,
  Send,
  History,
  AddCircleOutline,
  PaymentOutlined,
} from "@mui/icons-material";
import TotalBalance from "../../components/TotalBalance";
import RecentTransactions from "../../components/RecentTransactions";
import { Link, useNavigate } from "react-router-dom";
import ActionCard from "../../components/ActionCard";
import { useSelector } from "react-redux";



const UserHome = () => {
  const navigate=useNavigate(); 
  const {user}=useSelector(state=>state.auth); 
  return (
    <Box>
      {/* Account Overview */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Account Overview
        </Typography>
        <Grid container spacing={4}>
          {
            user?.guard!='chargingPoint' && <TotalBalance/>
          }
          <RecentTransactions/>
        </Grid>
      </Container>

      {/* Quick Actions */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={4}>
          {
            user?.guard=='user' && (
              <>
              <ActionCard
                  title='Send Money'
                  desc='Transfer funds to friends or family instantly.'
                  path='/target-user'
                  buttonTitle='Send Now'
                  icon={<Send fontSize="large" color="primary" />}
                />
              <ActionCard
                  title='Payment For A Company'
                  desc='Top up your wallet balance.'
                  path='/category'
                  buttonTitle='Payment'
                  icon={<PaymentOutlined fontSize="large" color="primary" />}
                />
                
              </>
            
            )
          }
          {
            user?.guard=='chargingPoint' && (
              <ActionCard
                title='Charging'
                desc='Charge User Wallets.'
                path='/charging-target-user'
                buttonTitle='Charge'
                icon={<PaymentOutlined fontSize="large" color="primary" />}
              />
            )
          }
          <ActionCard
            title='View Transactions'
            desc='Check your transaction history.'
            path='/transactions'
            buttonTitle='View Transactions History'
            icon={<History fontSize="large" color="primary" />}
          />
          {/* <ActionCard
            title='Payment For A Company'
            desc='Top up your wallet balance.'
            path='/category'
            bottonTitle='Payment'
            icon={<PaymentOutlined fontSize="large" color="primary" />}
          /> */}
          {/* <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Send fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  
                </Typography>
                <Typography>
                  
                </Typography>
              </CardContent>
              <CardActions>
                <Link to="">
                  <Button size="small" color="primary">
                    
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <History fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  View Transactions
                </Typography>
                <Typography>Check your transaction history.</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={()=>{navigate('/transactions')}} size="small" color="primary">
                  View Transactions History
                </Button>
              </CardActions>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <PaymentOutlined fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Payment For A Company
                </Typography>
                <Typography>Top up your wallet balance.</Typography>
              </CardContent>
              <CardActions>
                <Link to='/category'>
                  <Button size="small" color="primary">
                    Payment
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};


export default UserHome;



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