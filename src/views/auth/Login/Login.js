import React from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import FormGenerator from 'components/forms/FormGenerator'
import { Paper, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react';
import axios from 'axios'
import { setUser } from 'store/reducers/user.slice'
import { useDispatch } from 'react-redux'
import { openSnack } from 'store/reducers/snack.slice'
import db from 'db'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  }
})

function Login() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const validationUserAndPassword = (arr, values) => {
    let user = null
    arr.forEach(item => {
      const { username, password } = item.fields;
      if (username === values.username && password === values.password) user = item
    })
    return user
  }

  const onSubmit = async (values) => {
    try {
      const { data: { records } } = await axios.get('/credenitals?view=Grid%20view')
      const user = validationUserAndPassword(records, values)
      if (Boolean(user)) {
        dispatch(openSnack({ type: "success", text: "login success" }))
        localStorage.setItem('user', JSON.stringify(user))
        await db.open();
        dispatch(setUser(user))
      } else dispatch(openSnack({ type: "error", text: "Wrong username or password" }))
    } catch (error) {
      console.log(error.message)
    }
    reset({
      username: "",
      password: ""
    })
  }
  return (
    <div className={classes.root}>
      <Paper elevation={1} sx={{ width: { xs: '100%', md: 500 }, p: 3, m: "auto", minHeight: 500 }}>
        <Typography variant="h3">Login</Typography>
        <br />
        <Icon style={{ fontSize: 200 }} icon="arcticons:lock" />
        <FormGenerator
          control={control}
          child={[
            { type: 'text', name: 'username', label: "username", gridProps: { xs: 12 } },
            { type: 'password', name: 'password', label: "password", gridProps: { xs: 12 } },
          ]}
        />
        <br />
        <Button onClick={handleSubmit(onSubmit)} fullWidth>Login</Button>
        <br />
        <br />
        <Typography variant="h6" component={Link} to="/register">Not registered? Click here.</Typography>
      </Paper>
    </div >
  )
}

export default Login