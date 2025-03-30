import { History } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ActionCard = ({title,desc,path,buttonTitle,icon}) => {
  const navigate=useNavigate();
  return (
    <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                {icon}
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
                <Typography>{desc}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={()=>{navigate(path)}} size="small" color="primary">
                  {buttonTitle}
                </Button>
              </CardActions>
            </Card>
          </Grid>
  )
}

export default ActionCard