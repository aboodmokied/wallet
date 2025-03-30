import { SearchOutlined } from '@mui/icons-material'
import { TextField,InputAdornment } from '@mui/material'

const SearchInput = ({search,handleChangeSearch,submitSearchHandler}) => {
  return (
    <div>
      <form className='flex items-center m-3 mt-5' onSubmit={submitSearchHandler}>
          <TextField
          style={{
            marginTop:"0px",
            marginBottom:"0px",
            borderRadius:'0px',
          }}
          margin="normal"
          id="search"
          label="Search For A Company"
          name="search"
          type="text"
          autoComplete="search"
          InputProps={{
            endAdornment:(
              <InputAdornment position='end'>
                <button type='submit'>
                  <SearchOutlined/>
                </button>
              </InputAdornment>
            )
          }}
          value={search}
          onChange={(e)=>handleChangeSearch(e)}
          />
        
      </form>
    </div>
  )
}

export default SearchInput