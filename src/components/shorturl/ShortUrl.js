import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { createShortUrl, shortUrlSelector, clearState, editShortenCode } from "./ShortUrlSlice";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { downloadCustomQRcode, isEmpty } from "../../utils/function";
import { shortUrlVal } from "./ShortUrlVal";
import "./shorturl.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Grid from "@mui/material/Grid";
import { QrCode2Sharp } from "@mui/icons-material";
import { instance } from "../../utils/axiosInstance";
import { getOnelinkById } from "../../utils/urls";
import QRcodeImage from "../QRcodeImage/QRcodeImage";
export default function ShortUrl() {
  let navigate = useNavigate();
  const [long_url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  const params = useParams();
  const { isFetching, isSuccess, isError, errorMessage, shortUrl, short_qr_code } = useSelector(shortUrlSelector);
  const dispatch = useDispatch();
  const onClickBuild = async (e) => {
    e.preventDefault();
    window.analytics.track("Generate Button Clicked", {
      "page_name": 'shorten_url',
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
    const data = {
      long_url: long_url,
      user_id: user.uid,
      user_name: user.displayName,
      user_email: user.email,
      name: name,
      type: "shorturl",
    };
    const validation = shortUrlVal(data);
    if (isEmpty(validation)) {
      if (params?.id) {
        data.onelink_code = params?.id;
        dispatch(editShortenCode(data));
      } else {
        dispatch(createShortUrl(data));
      }
    } else {
      setErrors(validation);
    }
  };
  const onResetButtonClick = () => {
    dispatch(clearState());
    setName("");
    setUrl("");
  };
  const downloadShortQRCode = () => {
    var a = document.createElement("a");
    a.href = short_qr_code;
    a.download = "Image.png";
    a.click();
  };
  const onClickCopyOnelink = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.info("Copy to clipboard success");
    window.analytics.track("Copy Button Clicked", {
      "page_name": 'shorten_url',
      "copy_url":shortUrl,
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
  };

  useEffect(() => {
    if (short_qr_code && params?.id) {
      setName("");
      setUrl("");
      navigate("/manage-links");
    } else {
      // setUrl("");
      // setName('');
      setErrors({});
    }
    return () => {};
  }, [short_qr_code]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  const segmentTracking = ()=>{
    window.analytics.track("Download Qrcode Button Clicked", {
      "page_name": 'shorten_url',
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
  }
  const handleFetchOnelinkById = async (id) => {
    try {
      const response = await instance.get(getOnelinkById + id);
      if (response.data) {
        const { data } = response.data;
        setName(data.name);
        setUrl(data.long_url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.id) {
    handleFetchOnelinkById(params?.id);
    }
  }, []);

  return (
    <>
      <div className="breadcum">
        <HomeIcon
          className="cp"
          sx={{ fontSize: 18, verticalAlign: "sub" }}
          onClick={() => navigate("/home")}
        />
        <span className="fs-14"> / {params?.id ? "Edit Short URL": "Short URL"  }</span>
      </div>

      <Box className="container vh-80">
        <form onSubmit={onClickBuild}>
          <Grid
            container
            spacing={0}
          >
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
            >
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ m: 1, width: "100%" }}
                id="outlined-basic-shorturl-url-name"
                label="Enter name"
                variant="outlined"
                name="name"
                error={errors.name}
                helperText={errors.name}
              ></TextField>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
            >
              <TextField
                value={long_url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ m: 1, width: "100%" }}
                id="outlined-basic-shorturl-url"
                label="Paste URL Here"
                variant="outlined"
                name="long_url"
                error={errors.long_url}
                helperText={errors.long_url}
              ></TextField>
            </Grid>
            <Box className="m-t-20">
              <Button
                type="submit"
                className="btn-primary m-l-10 m-r-20"
                variant="contained"
              >
             {params?.id ? "Update Shorten URL": "Generate Shorten URL"  }    
              </Button>
              <Button
                onClick={onResetButtonClick}
                className="btn-secondary"
                variant="contained"
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </form>

        {shortUrl ? (
          <div className="m-t-30">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
            >
              Shorten URL
            </Typography>
            <>
              <Typography
                className="short-url"
                variant="body2"
                color="text.secondary"
              >
                {shortUrl}
              </Typography>
              <ContentCopyIcon
                className="copy-btn va-btm"
                onClick={onClickCopyOnelink}
                fontSize="large"
              />
            </>
          </div>
        ) : (
          ""
        )}

        {short_qr_code ? (
          <>
            <QRcodeImage url={shortUrl}/>
            <Button
              className="qr-code-dwn-btn"
              onClick={()=> {downloadCustomQRcode({url:shortUrl, name:name}); segmentTracking()}}
              size="small"
            >
              <QrCode2Sharp
                className="va-text-btm"
                fontSize="medium"
              />
              Click to Download QR Code
            </Button>
          </>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
