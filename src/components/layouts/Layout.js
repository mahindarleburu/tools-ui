import  React, {useEffect} from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from '@mui/material/Drawer';
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { signOutGoogle } from "../../utils/firebase";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import { getAuth } from "firebase/auth";
import { getUserById, listUserSelector } from "../Admin/Users/UsersSlice";
import { useDispatch, useSelector } from "react-redux";
import InsertLink from "@mui/icons-material/InsertLink";
import Construction from "@mui/icons-material/Construction";
import { AccountBox, ArrowDropDown, Logout, Person } from "@mui/icons-material";
import AddLinkIcon from '@mui/icons-material/AddLink';
import BrandImage from "../../assets/heroImage.png"
import "./layout.css"
import { useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 250;

const Layout = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch()
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedMenu, setselectedMenu] = React.useState("home");
  const { isFetching, isSuccess, isError, errorMessage, user } = useSelector(listUserSelector);
  const auth = getAuth();
  const googleUser = auth.currentUser;

  let navigate = useNavigate();
  let location = useLocation();

  const handleDrawerToggle = (menuName) => {
    setMobileOpen(!mobileOpen);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const signoutandredirect = () => {
    signOutGoogle();
  };
  const listDataapi = async (uid) => {
    dispatch(getUserById());
  };

  useEffect(() => {
    listDataapi();
  }, []);
  
  useEffect(() => {
    setselectedMenu(location.pathname)
  }, [location]);
  

  
  return (

      <Box sx={{ display: "flex" }}>
        {/* <CssBaseline /> */}

        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, fontFamily: 'inherit', }}
          className="header">
          
          <Toolbar sx={{ pr: "24px", }}>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              <img alt="Company Logo" className="brand-image" src={BrandImage} />
            </Typography>

            <Typography
              className="header-title"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, marginLeft: '5vw'}}>
              {/* MarTech Tools */}
            </Typography>
            
            <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' }, }}>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt={googleUser.displayName} src={googleUser.photoURL} />
              </IconButton>
              <span className="fw-500 p-l-10">{googleUser.displayName}</span>
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={()=> handleDrawerToggle('Drawer') }
              sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </AppBar>
        
        <Box component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders">
         
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={()=>handleDrawerToggle('Drawer Close')}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, top: '55px' },
            }}
          >
            <List component="nav">
              <React.Fragment>
                <ListItemButton selected={selectedMenu === "/utm"} onClick={() => {navigate("/utm"); handleDrawerToggle('UTM Builder');}}>
                  <ListItemIcon>
                    <Construction />
                  </ListItemIcon>
                  <ListItemText primary="UTM Builder" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/qrcode"} onClick={() => {navigate("/qrcode"); handleDrawerToggle('QR Code');}}>
                  <ListItemIcon>
                    <QrCodeIcon />
                  </ListItemIcon>
                  <ListItemText primary="QR Code" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/shorten-url"} onClick={() => {navigate("/shorten-url"); handleDrawerToggle('Shorten URL');}}>
                  <ListItemIcon>
                    <AddLinkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Shorten URL" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/manage-links"} onClick={() => {navigate("/manage-links"); handleDrawerToggle('Manage Link');}}>
                  <ListItemIcon>
                    <InsertLink />
                  </ListItemIcon>
                  <ListItemText primary="Manage Link" />
                </ListItemButton>
                <Divider sx={{ my: 1 }} />
              { user?.role ==="super_admin" ? <>
                <ListSubheader
                  component="div"
                  id="nested-list-subheader">
                  Admin
                </ListSubheader>
                <ListItemButton selected={selectedMenu === "/manage_utm"} onClick={() => {navigate("/manage-utm"); handleDrawerToggle('Manage UTM');}}>
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage UTM" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/manage-users"} onClick={() => {navigate("/manage-users"); handleDrawerToggle('Manage Users');}}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>
                </> :'' }  
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                >
                  Account
                </ListSubheader>
                <ListItemButton selected={selectedMenu === "/profile"} onClick={() => {navigate("/profile"); handleDrawerToggle('Profile')}}>
                  <ListItemIcon>
                    <AccountBox />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton onClick={() =>  {signoutandredirect(); handleDrawerToggle('Logout')}}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </React.Fragment>
            </List>
          </Drawer>
     
          <Drawer variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#f5f5f5', height: '100vh', border: '0px' },
                }}
                open>
            <Toolbar />
            <List component="nav">
              <React.Fragment>
                <ListItemButton selected={selectedMenu === "/utm"} onClick={() => {navigate("/utm");handleDrawerToggle('UTM Builder');}}>
                  <ListItemIcon>
                    <Construction />
                  </ListItemIcon>
                  <ListItemText primary="UTM Builder" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/qrcode"} onClick={() => {navigate("/qrcode");handleDrawerToggle('QR Code');}}>
                  <ListItemIcon>
                    <QrCodeIcon />
                  </ListItemIcon>
                  <ListItemText primary="QR Code" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/shorten-url"} onClick={() => {navigate("/shorten-url");handleDrawerToggle('Shorten URL');}}>
                  <ListItemIcon>
                    <AddLinkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Shorten URL" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/manage-links"} onClick={() => {navigate("/manage-links");handleDrawerToggle('Manage Links');}}>
                  <ListItemIcon>
                    <InsertLink />
                  </ListItemIcon>
                  <ListItemText primary="Manage Link" />
                </ListItemButton>
                <Divider sx={{ my: 1 }} />
              { user?.role ==="super_admin" ? <>
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="bg-legend2">
                  Admin
                </ListSubheader>
                <ListItemButton selected={selectedMenu === "/manage-utm"} onClick={() => {navigate("/manage-utm");handleDrawerToggle('Manage UTM');}}>
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage UTM" />
                </ListItemButton>
                <ListItemButton selected={selectedMenu === "/manage-users"} onClick={() => {navigate("/manage-users");handleDrawerToggle('Manage Users');}}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>
                </> :'' }  
                <ListItemButton onClick={() =>  {signoutandredirect(); handleDrawerToggle('Logout');}}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </React.Fragment>
            </List>
          </Drawer>
        </Box>

        <Box component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          
          <Toolbar />
          {props.children}
          
        </Box>
      </Box>
  );
};

export default Layout;

