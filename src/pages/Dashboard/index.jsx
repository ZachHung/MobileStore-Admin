import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../../components/listItem";
import { Outlet, useLocation } from "react-router-dom";
import { themeOptions } from "../../config/theme";
import * as locales from "@mui/material/locale";
import logo from "../../logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {"Copyright © "}
      <Link color='inherit' href='https://mui.com/'>
        MobileStore
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;
const logoStyle = {
  filter:
    "invert(56%) sepia(67%) saturate(1338%) hue-rotate(172deg) brightness(100%) contrast(95%)",
  width: "24px",
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.primary.main,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme(themeOptions, locales["viVN"]);
const pathMap = {
  "/": "Tổng Quan",
  "/products": "Sản Phẩm",
  "/comments": "Bình Luận",
  "/news": "Tin Tức",
  "/sales": "Doanh Thu",
  "/popular": "Sản Phẩm Bán Chạy",
  "/orders": "Hoá Đơn",
  "/users": "Khách Hàng",
};

const Dashboard = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const userState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {pathMap[pathname]}
            </Typography>
            <Avatar
              alt={userState.current.FullName}
              src={userState.current.Avatar}
              sx={{ mr: 2 }}
            />
            <Typography component='h2' variant='h6' color='inherit' noWrap>
              {userState.current.FullName}
            </Typography>
            <Tooltip
              title='Đăng xuất'
              sx={{ ml: 1 }}
              onClick={() => {
                dispatch(logout());
              }}
            >
              <IconButton color='inherit'>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              px: [1],
            }}
          >
            <img className='logo' style={logoStyle} src={logo} alt='' />
            <span style={mdTheme.typography.h6}>MobileStore</span>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component='nav' sx={{ position: "relative" }}>
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
            <Divider />
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.background.default
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container
            maxWidth={pathname === "/comments" ? "xl" : "lg"}
            sx={{ mt: 4, mb: 4 }}
          >
            <Grid container spacing={3}>
              <Outlet />
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
