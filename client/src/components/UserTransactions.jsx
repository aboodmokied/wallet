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
// import { axiosPrivate } from "../../api/axios";
// import errorFormater from "../../../utils/errorFormater";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
// import { setError } from "../../state/error-state/errorSlice";
// import { queryClient } from "../../main";
import { Link } from "react-router-dom";
import TimeFilter from "./TimeFilter";
import { axiosPrivate } from "../api/axios";
import errorFormater from "../../utils/errorFormater";
import { setError } from "../state/error-state/errorSlice";

const getUserTransactions=async({page,from,to,user_id,guard})=>{
    try {
      let route=`api/report/system-user-transactions/${guard}/${user_id}?limit=10&page=${page+1}&sort=-date`;
      if(from&&to){
        // const from=startDateTime.valueOf();
        // const to=endDateTime.valueOf();
        route+=`&dateFiltering=true&from=${from}&to=${to}`
      }
      const response=await axiosPrivate.get(route);
      return response.data?.result;
    } catch (error) {
      const errorObj=errorFormater(error);
      return Promise.reject(errorObj);
    } 
  };
const UserTransactions = ({user_id,guard}) => {
    const [page, setPage] = useState(0);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);  
  const {data,isLoading,error}=useQuery({
    queryKey:[`system-user-transactions-report-${guard}-${user_id}-${from+to}-${[page]}`],
    queryFn:async()=>getUserTransactions({page,from,to,guard,user_id})
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
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
            User Transactions
        </Typography>
        <TimeFilter setFrom={setFrom} setTo={setTo} />
        {isLoading
        ? <p>Loading...</p>
        :error
        ? <p>{error.message||'Something went wrong'}</p>
        :(
          <>
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
                          <TableCell align="right"><Link to={`/cms/transaction-report/${transaction.data.id}`}><Button variant="contained">View</Button></Link></TableCell>
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
              </>
              )}
    </Paper>
  )
}

export default UserTransactions