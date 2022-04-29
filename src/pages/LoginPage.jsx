import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeOptions } from "../config/theme";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton/index";
import { useDispatch, useSelector } from "react-redux";
import { loginFail, fetching, loginSuccess, logout } from "../redux/userSlice";
import { Request } from "../utils/api";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}>
      {"Copyright © "}
      <Link color='inherit' href='https://mui.com/'>
        MobileStore
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme(themeOptions);

export default function SignInSide() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state);
  const navigate = useNavigate();
  const [showPass, setShowPass] = React.useState(false);

  const handleSuccess = (data) => {
    dispatch(loginSuccess(data));
    navigate("/");
  };
  const handleFailure = () => {
    dispatch(loginFail());
    setTimeout(() => dispatch(logout()), 5000);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(fetching());
    const data = new FormData(event.currentTarget);
    const formData = {
      UserName: data.get("UserName"),
      PassWord: data.get("PassWord"),
    };
    Request.post("AccountController/AdminLogin", formData)
      .then((res) =>
        res.data != null ? handleSuccess(res.data) : handleFailure()
      )
      .catch((err) => console.log(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component='main'
        sx={{
          height: "100vh",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}>
        <CssBaseline />
        <Box
          sx={{
            mx: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            height: "100%",
          }}>
          <svg
            width='48'
            height='89'
            viewBox='0 0 20 37'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M2.14676 27.699V34.8538H17.7847V27.699L19.9314 25.7567V35.5694L17.7847 37H2.14676L0 35.5694V25.7567L2.14676 27.699Z'
              fill='#F9FAFC'
            />
            <path
              d='M2.14676 24.735V16.3535L10.1188 24.3261L17.7847 16.3535V24.735L19.9314 23.3038V11.6516L10.1188 21.0554L0 11.6516V23.2016'
              fill='#F9FAFC'
            />
            <path
              d='M13.3895 10.9366V8.38092H6.54143V12.3672L11.2433 17.0691L9.81213 18.4997L4.7019 13.0828V8.07424L6.54143 6.23471H13.3895L15.2296 7.66533V12.3672L13.3895 10.9366Z'
              fill='#F9FAFC'
            />
            <path
              d='M13.3895 24.0194V29.028H6.54143V25.4506L4.7019 24.0194V29.4363L6.13252 30.8675H13.3895L15.2296 29.028V22.1793L13.3895 24.0194Z'
              fill='#F9FAFC'
            />
            <path
              d='M17.7847 10.8344V1.83953H2.14676V10.8344L0 9.09652V1.83953L1.84008 0H18.0914L19.9314 1.53284V9.09652L17.7847 10.8344Z'
              fill='#F9FAFC'
            />
            <path
              d='M18.1936 1.4306H1.53339V2.14619H18.1936V1.4306Z'
              fill='#F9FAFC'
            />
          </svg>
          <Typography component='h2' variant='h3' sx={{ position: "relative" }}>
            MobileStore
            <Typography
              component='span'
              variant='body1'
              sx={{ position: "absolute", right: "-3.5rem" }}>
              ADMIN
            </Typography>
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80%",
            borderRadius: "1rem",
            width: "35rem",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Đăng Nhập
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Tên người dùng'
              name='UserName'
              autoComplete='username'
              autoFocus
              error={userState.error}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='PassWord'
              label='Mật khẩu'
              type={showPass ? "text" : "password"}
              id='password'
              error={userState.error}
              autoComplete='current-password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' edge='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPass(!showPass)}
                      onMouseDown={(e) => e.preventDefault()}>
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Collapse in={userState.error}>
              <Alert severity='error'>
                <AlertTitle>Lỗi </AlertTitle>
                Thông tin admin không chính xác —{" "}
                <strong>vui lòng nhập lại</strong>
              </Alert>
            </Collapse>
            <LoadingButton
              loading={userState?.isFetching}
              type='submit'
              variant='contained'
              fullWidth
              sx={{ mt: 3, mb: 2, py: 1.5 }}>
              Đăng nhập
            </LoadingButton>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
