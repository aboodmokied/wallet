import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { memo } from "react"
import { Link } from "react-router-dom";

const CompaniesTable = ({data,page,handleChangePage}) => {
  return (
    <Box>
                <Container sx={{ my: 6 }}>
                  <div className="flex justify-between items-center">
                    <Typography variant="h4" gutterBottom>
                      {data?.category?.name} Companies
                    </Typography>
                    
                  </div>
                  <TableContainer className="min-h-[300px]" component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Verified</TableCell>
                          <TableCell align="right">Operations</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.companies
                          .map((company) => (
                            <TableRow key={company.id}>
                              <TableCell>{company.name}</TableCell>
                              <TableCell>{company.phone}</TableCell>
                              <TableCell>
                                {company.verified?"True":"False"}
                                </TableCell>
                              <TableCell align="right"><Link to={`/payment/${company.id}`}><Button variant="contained">Select</Button></Link></TableCell>
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
                    rowsPerPage={1}
                    rowsPerPageOptions={[]}
                  />
                </Container>
              </Box>
  )
}

export default memo(CompaniesTable);