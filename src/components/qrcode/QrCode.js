import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { createShortUrlQrcode, createQrCode, qrCodeSelector, clearState, editQrCode } from "./QrCodeSlice";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import { QrCodeVal } from "./QrCodeVal";
import { isEmpty } from "@firebase/util";
import "./qrcode.css";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Grid from "@mui/material/Grid";
import { getAuth } from "firebase/auth";
import { ContentCopy, QrCode2Sharp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { instance } from "../../utils/axiosInstance";
import { getOnelinkById } from "../../utils/urls";
import { downloadCustomQRcode } from "../../utils/function";
import QRcodeImage from "../QRcodeImage/QRcodeImage";

export default function QrCode() {
  let navigate = useNavigate();
  const params = useParams();
  const [long_url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const { isFetching, isSuccess, isError, errorMessage, short_qr_code, shortUrl } = useSelector(qrCodeSelector);
  const dispatch = useDispatch();
  const onClickBuild = async (e) => {
    e.preventDefault();
    window.analytics.track("Generate Button Clicked", {
      "page_name": 'qr_code',
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
    const data = {
      long_url: long_url,
      name: name,
      type: "qrcode",
      user_id: user.uid,
      user_name: user.displayName,
      user_email: user.email,
    };
    const validation = QrCodeVal(data);
    if (isEmpty(validation)) {
      if (params.id) {
        data.onelink_code = params.id
        dispatch(editQrCode(data));
      } else {
        dispatch(createShortUrlQrcode(data));
      }
    } else {
      setErrors(validation);
    }
  };
  const onResetButtonClick = () => {
    dispatch(clearState());
    setUrl("");
    setName("");
    setErrors("");
  };
  const downloadQRCode = () => {
    var a = document.createElement("a");
    a.href = short_qr_code;
    a.download = "Image.png";
    a.click();
  };
  const onClickCopyOnelink = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.info("Copy to clipboard success");
    window.analytics.track("Copy Button Clicked", {
      "page_name": 'qr_code',
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

  const segmentTracking = ()=>{
    window.analytics.track("Download Qrcode Button Clicked", {
      "page_name": 'qr_code',
      "url_path": window.location.host + '' + window.location.pathname,
      "full_url": window.location.href,
  });
  }

  useEffect(() => {
    return () => {
      onResetButtonClick();
    };
  }, []);

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
    if (params.id) {
      handleFetchOnelinkById(params.id);
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
        <span className=" fs-14"> / {params?.id ? "Edit QR Code": "QR Code"  } </span>
      </div>
      <Box className="container vh-80">
        <form onSubmit={onClickBuild}>
          <Grid
            container
            spacing={2}
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
                id="outlined-basic-qrcode-url"
                label="Paste URL Here"
                variant="outlined"
                name="long_url"
                error={errors.long_url}
                helperText={errors.long_url}
              ></TextField>

              <Box className="m-t-20">
                <Button
                  type="submit"
                  className="btn-primary m-l-10 m-r-20"
                  variant="contained"
                >
               {params?.id ? "Update QR Code": "Generate QR Code"  }    
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
          </Grid>
        </form>

        {shortUrl ? (
          <>
            <QRcodeImage url={shortUrl}/>
            <Button
              className="qr-code-dwn-btn"
              onClick={()=> {downloadCustomQRcode({url:shortUrl, name:name}); segmentTracking()} }
              size="small"
            >
              <QrCode2Icon
                className="va-text-btm"
                fontSize="medium"
              />
              Click to Download QR Code
            </Button>
          </>
        ) : (
          ""
        )}

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
              <ContentCopy
                className="copy-btn va-btm"
                onClick={onClickCopyOnelink}
                fontSize="large"
              />
            </>
          </div>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
