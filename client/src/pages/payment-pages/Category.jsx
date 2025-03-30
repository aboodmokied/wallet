import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CssBaseline, TextField, Typography } from "@mui/material";
import CategoryList from "../../components/CategoryList";


const Category = () => {
    const navigate=useNavigate();
    const [categoryId,setCategoryId]=useState("");
    const enterHandler=async(e)=>{
        navigate(`/category-companies/${categoryId}`);
    };
    const changeHandler=async(e)=>{
        setCategoryId(e.target.value);
    };
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
            Select Category
        </Typography>
        <div className="w-full">
            <CategoryList
                margin="normal"
                id="category"
                name="category_id"
                required
                fullWidth
                select
                label="Category"
                value={categoryId}
                onChange={changeHandler}
                variant="outlined"
            /> 
        </div>
          <Button
            type="submit"
            onClick={enterHandler}
            // disabled={status=='loading'}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enter
          </Button>
      </Box>
    </div>
  )
}

export default Category