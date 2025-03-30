import { InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import axiosRequest from "../api/axios";

const fetchCompanyCategories=async()=>{
  const {data}=await axiosRequest.get('api/category');
  return data?.result;
}

const CategoryList = (props) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey:['company-categories'],
    queryFn:fetchCompanyCategories,
  });
  return (
    <div>
    { isLoading
      ?<p>Loading...</p>
      :isError
      ? <p>{error?.message}</p>
      :(
        <>
            <TextField
            {...props}
            // margin="normal"
            // id="category"
            // name="category_id"
            // required
            // fullWidth
            // select
            // label="Category"
            // value={value}
            // onChange={onChangeHandler}
            // variant="outlined" // You can use "filled" or "standard" for different styles
            // error={category_id_error}
            // helperText={helperText}
          >
            {
              data?.categories?.map(category=><MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)
            }
          </TextField>
      </>
        
      )
    }
      
    </div>
  )
}

export default CategoryList