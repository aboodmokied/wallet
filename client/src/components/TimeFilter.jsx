import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

function TimeFilter({setFrom,setTo}) {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [timeDetails, setTimeDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleFilter = () => {
    if (startDateTime && endDateTime) {
      const from=startDateTime.valueOf();
      const to=endDateTime.valueOf();
      if(from<to){
        setError(null);
        setFrom(from);
        setTo(to);
        setTimeDetails(
          `Start: ${startDateTime.format('MM/DD/YYYY HH:mm')} | End: ${endDateTime.format('MM/DD/YYYY HH:mm')}`
        );
      }else{
        setError('Invalid Timing')
      }
      
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Time Range
        </Typography>
        {error&&<Alert className='my-4' severity="error">{error}</Alert>}
        <DateTimePicker
          label="Start Date & Time"
          value={startDateTime}
          onChange={(newValue) => setStartDateTime(newValue)}
          slots={{ textField: (params) => <TextField {...params} /> }}
        />
        <DateTimePicker
          label="End Date & Time"
          value={endDateTime}
          onChange={(newValue) => setEndDateTime(newValue)}
          slots={{ textField: (params) => <TextField {...params} /> }}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleFilter}>
            Filter
          </Button>
        </Box>
        {timeDetails && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">{timeDetails}</Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default TimeFilter;
