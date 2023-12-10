import React from "react";
import { listAllUser, listUserSelector, updateUser } from "../Admin/Users/UsersSlice";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { martech_token } from "../../utils/constant";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ConstructionIcon from '@mui/icons-material/Construction';
import "./profile.css"
import { CopyAllOutlined } from "@mui/icons-material";


const Profile = () => {
  const { user } = useSelector(listUserSelector);
  const auth = getAuth();
  const googleUser = auth.currentUser;
  const onCopy = () => {
    navigator.clipboard.writeText(martech_token);
    toast.success("coppied");
    window.analytics.track("Api Token Copied", {
      "page_name": 'profile',
      "copy_url":martech_token,
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
  };

  return (
    <>
      <Grid container spacing={2}>
          <Grid item xs={0} md={3}></Grid>
          <Grid item xs={12} md={6} justify='center' alignItems='center'>
            <Card>
              <CardContent>
                <img className="user-avatar m-t-20" alt={googleUser.displayName} src={googleUser.photoURL}></img>
                <Typography className="text-center" variant="h4">{user.displayName}</Typography>
                <Typography className="m-t-10 text-center" variant="h6">{user.email}</Typography>
                <Typography className="m-t-10 p-l-20 b-t-1 p-t-20" variant="body2">User Id: {googleUser.uid}</Typography>
                <Typography className="m-t-10 p-l-20 m-b-50" variant="body2">API Token: {martech_token}  <IconButton onClick={onCopy}>  <CopyAllOutlined/></IconButton> </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={0} md={3}></Grid>
      </Grid>
    </>
    
  );
};

export default Profile;
