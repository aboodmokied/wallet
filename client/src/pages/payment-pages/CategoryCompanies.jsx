import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { axiosPrivate } from '../../api/axios'
import errorFormater from '../../../utils/errorFormater';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError } from '../../state/error-state/errorSlice';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import CompaniesTable from '../../components/CompaniesTable';
import SearchInput from '../../components/SearchInput';

const getCategoryCompanies=async({categoryId,page,search})=>{
    try {
        const response=await axiosPrivate.get(`api/category-companies/${categoryId}?limit=1&page=${page+1}${search?"&search="+search:""}`);
        return response.data?.result;
    } catch (error) {
        const errorObj=errorFormater(error);
        return Promise.reject(errorObj);        
    }

}

const CategoryCompanies = () => {
    const {categoryId}=useParams();
    const dispatch=useDispatch();
    const [page, setPage] = useState(0);  
    const [search, setSearch] = useState("");  
    const [searchTerm,setSearchTerm]=useState('');
    const submitSearchHandler=(e)=>{
        e.preventDefault();
        setSearchTerm(search);
    }
    // const deferredSearch=useDeferredValue(search);
    // const fn=debounce(()=>{
    //     console.log('value:',deferredSearch)
    //     setSearchTerm(deferredSearch);
    // },3000)
    const {data,isLoading,error}=useQuery({
        queryKey:[`category-companies-${categoryId}-page-${page}-${searchTerm}`],
        queryFn:async()=>getCategoryCompanies({categoryId,page,search:searchTerm})
    })
    const handleChangePage =(event,newPage) =>{
        setPage(newPage)
    };
    const handleChangeSearch = (event) => {
        setSearch(event.target.value)
    };
    useEffect(()=>{
        if(error){
            dispatch(setError(error));
        }
    },[error])

    
    return (
        <div>
            <div className='flex justify-end'>
                <SearchInput search={search} handleChangeSearch={handleChangeSearch} submitSearchHandler={submitSearchHandler}/>
            </div>
          {isLoading
            ? <p>Loading...</p>
            :error
            ? <p>{error.message||'Something went wrong'}</p>
            :(<>
              <CompaniesTable data={data} page={page} handleChangePage={handleChangePage} />
              </>)
          }
            
        </div>
        
      );
}

export default CategoryCompanies