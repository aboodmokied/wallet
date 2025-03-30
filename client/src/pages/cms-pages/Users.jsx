// TransactionHistoryPage.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";
import { axiosPrivate } from "../../api/axios";
import errorFormater from "../../../utils/errorFormater";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setError } from "../../state/error-state/errorSlice";
// import { queryClient } from "../../main";
import { Link, useParams } from "react-router-dom";

const getWalletUsers=async({guard,page})=>{
  try {
    const response=await axiosPrivate.get(`api/wallet-user/${guard}/all?limit=10&page=${page+1}&sort=-createdAt`)
    console.log(response);
    return response.data?.result;
  } catch (error) {
    console.log(error);
    const errorObj=errorFormater(error);
    return Promise.reject(errorObj);
  } 
};

const Users = () => {
  const [page, setPage] = useState(0);  
  const {guard}=useParams();
  const {data,isLoading,error}=useQuery({
    queryKey:[`wallet-users-${guard}-page-${[page]}`],
    queryFn:async()=>getWalletUsers({page,guard})
  })
  const dispatch=useDispatch();
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(error){
      dispatch(setError(error))
    }
  },[error])
  return (
    <div className="">
      {isLoading
        ? <p>Loading...</p>
        :error
        ? <p>{error.message||'Something went wrong'}</p>
        :(
          <Box>
            {/* Transactions Table */}
            <Container sx={{ my: 6 }}>
              <Typography variant="h4" gutterBottom>
                {`Wallet Users (${guard})`}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>verified</TableCell>
                      {/* <TableCell>Description</TableCell> */}
                      <TableCell align="right">Operations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.users
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.verified+''}</TableCell>
                          <TableCell align="right"><Link to={`/cms/users/${guard}/${user.id}`}><Button variant="contained">View</Button></Link></TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={data.responseMetaData.totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={10}
                rowsPerPageOptions={[]}
              />
            </Container>
          </Box>
        )
      }
        
    </div>
    
  );
};

export default Users;
