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
import { Link } from "react-router-dom";

const getCurrentUserTransactions=async({page})=>{
  try {
    const response=await axiosPrivate.get(`api/current-user-transactions?limit=10&page=${page+1}&sort=-date`)
    return response.data?.result;
  } catch (error) {
    const errorObj=errorFormater(error);
    return Promise.reject(errorObj);
  } 
};

const Transactions = () => {
  const [page, setPage] = useState(0);  
  const {data,isLoading,error}=useQuery({
    queryKey:[`current-user-transactions-page-${[page]}`],
    queryFn:async()=>getCurrentUserTransactions({page})
  })
  const dispatch=useDispatch();
  // const client=useQueryClient(queryClient);
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(error){
      dispatch(setError(error))
    }
  },[error])
  // useEffect(()=>{
  //   client.invalidateQueries(['current-user-transactions']);
  // },[page])
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
                Transaction History
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Operation</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>From(Name)</TableCell>
                      <TableCell>To(Name)</TableCell>
                      {/* <TableCell>Description</TableCell> */}
                      <TableCell>Amount ($)</TableCell>
                      <TableCell align="right">Operations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.transactions
                      .map((transaction) => (
                        <TableRow key={transaction.data.id}>
                          <TableCell>{transaction.data.operation_type}</TableCell>
                          <TableCell>{new Date(transaction.data.date).toLocaleString()}</TableCell>
                          <TableCell>
                            {transaction.users.sourceUser.name}
                            </TableCell>
                          <TableCell>
                            {transaction.users.targetUser.name}
                          </TableCell>
                          <TableCell>
                            {transaction.data.amount}
                          </TableCell>
                          {/* <TableCell>{transaction.description}</TableCell> */}
                          <TableCell align="right"><Link to={`/transactions/${transaction.data.id}`}><Button variant="contained">View</Button></Link></TableCell>
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

export default Transactions;
