import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {
  auth,
  signInWithGooglePopup,
  getCurrentUser,
  createUserDocumentFromAuth,
} from "../../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css"
import CarsomLogo from "../../assets/logo.png"
import HeroImg from "../../assets/hero-img.png"
import "../../index.css"
import "../../helper.css"
import Container from '@mui/material/Container';


export default function SignInSide() {
  let navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  useEffect(() => {
    onAuthStateChanged(auth,async (user) => {

        if (user) {
            navigate("/home");
        } else {
          // User is signed out
          return;
        }
      });

    return () => {};
  }, []);

  return (
    <>
    <Container maxWidth="xl" className="bg-clr">
      <Box className="header-login">
          <img className="carsome-logo" src={CarsomLogo}></img>
          <Button
                className="btn-secondary-login position-right m-0"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, pl: 5, pr:5}}
                onClick={()=>signInWithGooglePopup("Login")}>
                Login
              </Button>
      </Box>

      <Grid container component="main" sx={{ height: "100vh" }}>
        
        <Grid item xs={12} sm={12} md={7} square>
          <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
              }}>
           <img src={HeroImg}></img>
          </Box>
        </Grid>
      
        <Grid item xs={12} sm={12} md={5} square>
          <Box className="hero-text" 
              sx={{
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
              }}>
              <Typography component="h1" variant="h3">Get things done with peace of mind.</Typography>
              <Typography component="h6" variant="subtitle1">Generate UTM, Short Links, QR Codes & lot more.</Typography>
              <Box component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}>
                <Button className="btn-primary-login"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, pl: 7, pr: 7 }}
                  onClick={()=>signInWithGooglePopup('Get Started')}>
                  Get Started
                </Button>
              </Box>
          </Box>
        </Grid>

      </Grid>
      </Container>
    </>
  );
}
