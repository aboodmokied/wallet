import { Box, Tab, Tabs } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setAuthPagesGuard } from "../state/auth-state/authSlice";

const GuardTabs = () => {
  const {authPagesGuard}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  const tabsOnChangeHandler=(e,newValue)=>{
    dispatch(setAuthPagesGuard({guard:newValue}));
  }
  return (
    <Box className='my-2'>
          <Tabs value={authPagesGuard} onChange={tabsOnChangeHandler} centered>
              <Tab label='User' value='user'/>  
              <Tab label='Company' value='company'/>
              <Tab label='Charging Point' value='chargingPoint'/>
            </Tabs>
        </Box>
  )
}

export default GuardTabs