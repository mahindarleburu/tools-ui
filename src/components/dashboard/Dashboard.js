import * as React from "react";
import Layout from "../layouts/Layout";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"
import ConstructionIcon from '@mui/icons-material/Construction';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import "../../helper.css"
import Box from "@mui/material/Box";
import HomeIcon from '@mui/icons-material/Home';

export default function MediaCard() {
  let navigate = useNavigate();
  return (
    <>
      <div className="breadcum"> 
        <HomeIcon sx={{ fontSize: 18, verticalAlign: 'sub', }}/>  
        <span className="fs-14 fs-600"> /  Home</span>
      </div>
      <Box className="dashboard-cards-spacing">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} sm={4} onClick={()=>navigate('/utm')}>
            <Card className="cp feature-card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className="fw-500">
                  <ConstructionIcon className="va-middle p-r-5 ff-inherit" fontSize="large" /> UTM Links
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sm={4} onClick={()=>navigate('/qrcode')}>
            <Card className="cp feature-card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className="fw-500">
                  <QrCode2Icon className="va-middle p-r-5" fontSize="large"/>QR Code
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sm={4} onClick={()=>navigate('/shorten-url')}>
            <Card className="cp feature-card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className="fw-500">
                  <InsertLinkIcon className="va-middle p-r-5" fontSize="large"/>Shorten URL
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
    
  );
}
