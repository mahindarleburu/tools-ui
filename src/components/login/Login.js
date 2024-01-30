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
import HeroImg from "../../assets/hero-img.png"
import "../../index.css"
import "../../helper.css"
import Container from '@mui/material/Container';
import GIcon from '../../assets/g-icon.webp'
import CompanyLogo from '../../assets/heroImage.png'


export default function SignInSide() {
  let navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
  };

  useEffect(() => {
    onAuthStateChanged(auth,async (user) => {
        if (user) {
            navigate("/utm");
        } else {
          return;
        }
      });

    return () => {};
  }, []);

  return (
    <>
    <Container maxWidth="xl">
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid item xs={12} sm={12} md={12}>
          <Box className="hero-text" 
              sx={{
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <img alt="Connectwyze logo" className="company-img" src={CompanyLogo} />
              {/* <Typography component="h6" variant="subtitle1">Generate UTM, Short Links, QR Codes & lot more.</Typography> */}
              <Box component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}>
                <Button className="btn-primary-login google-signin-btn"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, pl: 7, pr: 7 }}
                  onClick={()=>signInWithGooglePopup('Get Started')}>
                  <img alt="Google Sign In Button" className="google-img p-r-15" src={GIcon}/>
                  <h6 >Sign in with Google</h6>
                </Button>
              </Box>
          </Box>
        </Grid>

      </Grid>
      </Container>
      
    </>
  );
}
