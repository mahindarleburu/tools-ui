import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button, Container, Switch } from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { downloadCustomQRcode, foundSourceDisplayName, generateLongAppsflyerUrl, generateLongUrl, isEmpty } from "../../utils/function";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { stepTwoValidation, stepOneValidation } from "./UtmValidation";
import FormHelperText from "@mui/material/FormHelperText";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./utm.css";
import {
  createOnelink,
  utmSelector,
  listAllSource,
  listAllMediumBySourceName,
  clearState,
  editOnelink,
} from "./UtmSlice";

import { appsflyerUrl } from "../../utils/constant";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Grid from "@mui/material/Grid";
import { instance } from "../../utils/axiosInstance";
import { getOnelinkById } from "../../utils/urls";
import QRcodeImage from "../QRcodeImage/QRcodeImage";

export default function Utm() {
  let navigate = useNavigate();
  const params = useParams();
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [country, setCountry] = useState("");
  const [lob, setLob] = useState("");
  const [language, setLanguage] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [campaign, setCampaign] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [finalUtmLink, setFinalUtmLink] = useState("");
  const [redirect, setRedirect] = useState("web");
  const [deeplink, setDeepLink] = useState("");
  const [fallback, setFallBack] = useState(false);
  const [androidFallback, setAndroidFallback] = useState("");
  const [iosFallback, setIosFallback] = useState("");
  const [sourceObject, setSourceObject] = useState([]);
  const [errors, setErrors] = useState({});
  const [oldObject, setOldObject] = useState({});
  const [shorten_qrcode, setShorten_qrcode] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [disableReset, setDisableReset] = useState(false);


  const { isFetching, isSuccess, isError, errorMessage, short_qr_code, onelink, sources, mediums } =
    useSelector(utmSelector);
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = auth.currentUser;


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const downloadShortQRCode = () => {
    var a = document.createElement("a");
    a.href = shorten_qrcode;
    a.download = "Image.png";
    a.click();
  };

  const getuser = async () => {
    const querySnapshot = await getDocs(collection(db, "sourceObject"));
    let arrayData = [];
    querySnapshot.forEach((doc) => {
      arrayData.push(doc.data());
    });
    setSourceObject(arrayData);
  };

  const handleStepOne = () => {
    let validationDataWeb = {};

    validationDataWeb.source = source;
    validationDataWeb.medium = medium;
    validationDataWeb.country = country;
    validationDataWeb.lob = lob;
    validationDataWeb.language = language;
    validationDataWeb.type = type;
    validationDataWeb.url = url;
    validationDataWeb.campaign = campaign;
    const valError = stepOneValidation(validationDataWeb);

    if (isEmpty(valError)) {
      setErrors({});
      handleNext();
      let data = {};
      data.url = url;
      data.UTM_SOURCE = source;
      data.UTM_COUNTRY = country;
      data.UTM_LOB = lob;
      data.UTM_LANGUAGE = language;
      data.UTM_TYPE = type;
      data.UTM_MEDIUM = medium;
      data.UTM_CAMPAIGN = campaign;
      data.UTM_CONTENT = utmContent ? utmContent : "none";
      data.UTM_TERM = utmTerm ? utmTerm : "none";
      const longUrl = generateLongUrl(data);
      setFinalUtmLink(longUrl);
      setDisableReset(true)
    } else {
      setErrors(valError);
    }
  };

  const handleStepTwo = () => {
    window.analytics.track("Generate Button Clicked", {
      page_name: "utm_builder",
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
    var regex = /[^0-9a-zA-Z]/gm;
    let validationDataWeb = {};
    if (isEmpty(redirect)) {
      setErrors({ ...redirect, redirect: "Redirect is Required" });
    }
    validationDataWeb.source = source;
    validationDataWeb.medium = medium;
    validationDataWeb.country = country;
    validationDataWeb.lob = lob;
    validationDataWeb.language = language;
    validationDataWeb.type = type;
    validationDataWeb.url = url;
    validationDataWeb.campaign = campaign;
    validationDataWeb.utmContent = utmContent;
    validationDataWeb.utmTerm = utmTerm;
    validationDataWeb.redirect = redirect;
    validationDataWeb.deeplink = deeplink;
    validationDataWeb.fallback = fallback;
    validationDataWeb.androidFallback = androidFallback;
    validationDataWeb.iosFallback = iosFallback;
    if (JSON.stringify(validationDataWeb) === JSON.stringify(oldObject)) {
      handleNext();
    } else {
      setOldObject(validationDataWeb);
      const valError2 = stepTwoValidation(validationDataWeb);
      if (redirect === "web") {
        if (isEmpty(valError2)) {
          setErrors({});
          let data = {};
          data.url = url;
          data.UTM_SOURCE = source;
          data.UTM_COUNTRY = country;
          data.UTM_LOB = lob;
          data.UTM_LANGUAGE = language;
          data.UTM_TYPE = type;
          data.UTM_MEDIUM = medium;
          data.UTM_CAMPAIGN = campaign ? campaign.toLowerCase().replace(regex, "_") : "";
          data.UTM_CONTENT = utmContent ? utmContent.toLowerCase().replace(regex, "_") : "";
          data.UTM_TERM = utmTerm ? utmTerm.toLowerCase().replace(regex, "_") : "";
          const longUrl = generateLongUrl(data);
          if (params?.id) {
            dispatch(
              editOnelink({
                onelink_code: params.id,
                long_url: longUrl,
                user_id: user.uid,
                user_name: user.displayName,
                user_email: user.email,
                name: campaign,
                type: "utm",
                meta: JSON.stringify(validationDataWeb),
              })
            );
          } else {
            dispatch(
              createOnelink({
                long_url: longUrl,
                user_id: user.uid,
                user_name: user.displayName,
                user_email: user.email,
                name: campaign,
                type: "utm",
                meta: JSON.stringify(validationDataWeb),
              })
            );
          }
          setFinalUtmLink(longUrl);
          handleNext();
        } else {
          setErrors(valError2);
        }
      }
      if (redirect === "app") {
        if (isEmpty(valError2)) {
          setErrors({});
          let data = {};
          data.url = appsflyerUrl;
          data.pid = source;
          data.UTM_COUNTRY = country;
          data.UTM_LOB = lob;
          data.UTM_LANGUAGE = language;
          data.UTM_TYPE = type;
          data.af_channel = medium;
          data.c = campaign ? campaign.toLowerCase().replace(regex, "_") : "";
          data.af_adset = utmContent ? utmContent.toLowerCase().replace(regex, "_") : "";
          data.af_ad = utmTerm ? utmTerm.toLowerCase().replace(regex, "_") : "";
          data.deep_link_value = deeplink ? encodeURI(JSON.stringify({ path: deeplink })) : null;
          data.af_web_dp = url;
          data.fallback = fallback;
          data.af_android_url = androidFallback;
          data.af_ios_url = iosFallback;
          const longUrl = generateLongAppsflyerUrl(data);
          if (params?.id) {
            dispatch(
              editOnelink({
                onelink_code: params.id,
                long_url: longUrl,
                user_id: user.uid,
                user_name: user.displayName,
                user_email: user.email,
                name: campaign,
                type: "utm",
                meta: JSON.stringify(validationDataWeb),
              })
            );
          } else {
            dispatch(
              createOnelink({
                long_url: longUrl,
                user_id: user.uid,
                user_name: user.displayName,
                user_email: user.email,
                name: campaign,
                type: "utm",
                meta: JSON.stringify(validationDataWeb),
              })
            );
          }

          setFinalUtmLink(longUrl);
          handleNext();
        } else {
          setErrors(valError2);
        }
      }
    }
  };

  const handlegenerateOnelink = async () => {
    dispatch(createOnelink({ long_url: finalUtmLink, user_id: user.uid, name: campaign }));
  };

  const onSourceChange = (e, newValue) => {
    setSource(newValue.name);
    dispatch(listAllMediumBySourceName({ sources: sources, source: newValue.name }));
  };
  const onMediumChange = (e, newValue) => {
    setMedium(newValue.name);
  };
  const onClickCopyLongUrl = () => {
    navigator.clipboard.writeText(finalUtmLink);
    toast.info("Copy to clipboard success");
    window.analytics.track("Copy Button Clicked", {
      page_name: "utm_builder",
      copy_url: finalUtmLink,
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
  };

  const onClickCopyOnelink = () => {
    navigator.clipboard.writeText(onelink);
    toast.info("Copy to clipboard success");
    window.analytics.track("Copy Button Clicked", {
      page_name: "utm_builder",
      copy_url: onelink,
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
  };
  const handleFallbackChange = () => {
    setFallBack(!fallback);
    if (fallback) {
      setAndroidFallback("");
      setIosFallback("");
    }
  };
  React.useEffect(() => {
    getuser();
  }, []);

  useEffect(() => {
    dispatch(listAllSource());
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (short_qr_code) {
      setShorten_qrcode(short_qr_code);
    }
  }, [short_qr_code]);

  const handleReset = () => {
    dispatch(clearState());
    setSource("");
    setMedium("");
    setCountry("");
    setLob("");
    setLanguage("");
    setType("");
    setUrl("");
    setCampaign("");
    setUtmContent("");
    setUtmTerm("");
    setFinalUtmLink("");
    setSourceObject([]);
    setErrors({});
    setRedirect("web");
    setFallBack(false);
    setAndroidFallback("");
    setIosFallback("");
    setActiveStep(0);
    if (params.id) {
      navigate("/manage-links");
    }
  };
  const handleRedirectChange = (e) => {
    setRedirect(e.target.value);
    if (e.target.value === "web") {
      setFallBack(false);
      setAndroidFallback("");
      setIosFallback("");
      setDeepLink("");
    }
  };

  const handleFetchOnelinkById = async (id) => {
    try {
      const response = await instance.get(getOnelinkById + id);
      if (response.data) {
        const data = response?.data?.data?.meta;
        const onlinkData = response?.data?.data?.onelink;
        setOldObject(data);
        setSource(data.source);
        setMedium(data.medium);
        setCountry(data.country);
        setLob(data.lob);
        setLanguage(data.language);
        setType(data.type);
        setUrl(data.url);
        setCampaign(data.campaign);
        setUtmContent(data.utmContent);
        setUtmTerm(data.utmTerm);
        setErrors({});
        setRedirect(data.redirect);
        setDeepLink(data.deeplink);
        setFallBack(data.fallback);
        setAndroidFallback(data.androidFallback);
        setIosFallback(data.iosFallback);
        setShorten_qrcode(data.src);
        setActiveStep(0);
        dispatch(listAllSource(data.source));

        // dispatch(listAllMediumBySourceName({sources, source:data.source}));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.id) {
      handleFetchOnelinkById(params.id);
    }
  }, []);
  const segmentTracking = () => {
    window.analytics.track("Download Qrcode Button Clicked", {
      page_name: "qr_code",
      url_path: window.location.host + "" + window.location.pathname,
      full_url: window.location.href,
    });
  };
  return (
    <>
      <div className="breadcum m-b-10">
        <HomeIcon
          className="cp"
          sx={{ fontSize: 18, verticalAlign: "sub" }}
          onClick={() => navigate("/home")}
        />
        <span className="fs-14"> / UTM</span>

        <span className="request-source-btn">
          <a
            className="btn-primary-theme"
            data-az-l="13f70d08-f8e9-446b-b5fd-a10179152a60"
          >
            Request to add new source
          </a>
        </span>
      </div>

      <div className="container">
        <Box sx={{ maxWidth: "100%" }}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
          >
            <Step key={0}>
              <StepLabel>{"Enter UTM Details"}</StepLabel>
              <StepContent>
                <Box sx={{ maxWidth: "100%" }}>
                  <Box sx={{ minWidth: "100%" }}>
                    <Grid
                      container
                      spacing={2}
                    >
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl sx={{ m: 1, width: "100%" }}>
                          <Autocomplete
                            id="source"
                            disableClearable
                            defaultValue={source ? source : ""}
                            onChange={onSourceChange}
                            options={sources}
                            getOptionLabel={(option) => {
                              if (params?.id) {
                                // const found = sources.find((element) => element.name === source);
                                return option?.display_name ? option?.display_name : foundSourceDisplayName(sources, source);
                              } else {
                                return option.display_name ? option.display_name : foundSourceDisplayName(sources, source)
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                error={errors.source}
                                helperText={errors.source}
                                {...params}
                                label="Source"
                              />
                            )}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                              >
                                {option.display_name}
                              </Box>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl sx={{ m: 1, width: "100%" }}>
                          <Autocomplete
                            id="medium"
                            disableClearable
                            defaultValue={medium ? medium : ""}
                            onChange={onMediumChange}
                            options={mediums}
                            getOptionLabel={(option) => {
                              const found = mediums.find((element) => element.name === medium);
                              return found?.display_name ? found?.display_name : "";
                            }}
                            renderInput={(params) => (
                              <TextField
                                // value={"medium"}
                                error={errors.medium}
                                helperText={errors.medium}
                                {...params}
                                label="Medium"
                              />
                            )}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                              >
                                {option.display_name}
                              </Box>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl
                          sx={{ m: 1, width: "100%" }}
                          error={errors.country}
                        >
                          <InputLabel id="demo-simple-select-label">Country</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-country"
                            value={country}
                            label="Country"
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <MenuItem value="id">Indonesia</MenuItem>
                            <MenuItem value="my">Malaysia</MenuItem>
                            <MenuItem value="ph">Philippines</MenuItem>
                            <MenuItem value="sg">Singapore</MenuItem>
                            <MenuItem value="th">Thailand</MenuItem>
                            <MenuItem value="vn">Vietnam</MenuItem>
                          </Select>
                          <FormHelperText>{errors.country}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl
                          sx={{ m: 1, width: "100%" }}
                          error={errors.lob}
                        >
                          <InputLabel id="demo-simple-select-label">LOB</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-lob"
                            value={lob}
                            label="Lob"
                            onChange={(e) => setLob(e.target.value)}
                          >
                            <MenuItem value="b2c">B2C</MenuItem>
                            <MenuItem value="b2b">B2B</MenuItem>
                            <MenuItem value="cad">CARSOME Academy</MenuItem>
                            <MenuItem value="ccp">CARSOME Capital</MenuItem>
                            <MenuItem value="c2b">C2B</MenuItem>
                            <MenuItem value="csc">CARSOME Service Center</MenuItem>
                            <MenuItem value="gen">Generic</MenuItem>
                            <MenuItem value="after-sales-service">After Sales Landing Page</MenuItem>
                          </Select>
                          <FormHelperText>{errors.lob}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl
                          sx={{ m: 1, width: "100%" }}
                          error={errors.lob}
                        >
                          <InputLabel id="demo-simple-select-label">Language</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-language"
                            value={language}
                            label="Language"
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <MenuItem value="zh">Chinese</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="id">Indonesian</MenuItem>
                            <MenuItem value="ms">Malay</MenuItem>
                            <MenuItem value="mu">Multi</MenuItem>
                            <MenuItem value="na">None</MenuItem>
                            <MenuItem value="fil">Philippines</MenuItem>
                            <MenuItem value="th">Thai</MenuItem>
                            <MenuItem value="vn">Vietnamese</MenuItem>
                          </Select>
                          <FormHelperText>{errors.language}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <FormControl
                          sx={{ m: 1, width: "100%" }}
                          error={errors.type}
                        >
                          <InputLabel id="demo-simple-select-label">Type</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-type"
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                          >
                            <MenuItem value="branding">Branding</MenuItem>
                            <MenuItem value="conv">Conversion</MenuItem>
                          </Select>
                          <FormHelperText>{errors.type}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={8}
                        sm={12}
                      >
                        <TextField
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          sx={{ m: 1, width: "100%" }}
                          id="landing-page-url"
                          label="Landing Page URL"
                          variant="outlined"
                          error={errors.url}
                          autoComplete="off"
                          helperText={errors.url}
                        ></TextField>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <TextField
                          value={campaign}
                          onChange={(e) => setCampaign(e.target.value)}
                          sx={{ m: 1, width: "100%" }}
                          id="campaign-name"
                          label="Campaign Name"
                          variant="outlined"
                          error={errors.campaign}
                          autoComplete="off"
                          helperText={errors.campaign}
                        ></TextField>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <TextField
                          value={utmContent}
                          onChange={(e) => setUtmContent(e.target.value)}
                          sx={{ m: 1, width: "100%" }}
                          id="campaign-content"
                          label="Campaign Content"
                          autoComplete="off"
                          variant="outlined"
                        ></TextField>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        sm={12}
                      >
                        <TextField
                          value={utmTerm}
                          onChange={(e) => setUtmTerm(e.target.value)}
                          sx={{ m: 1, width: "100%" }}
                          id="campaign-term"
                          label="Campaign Term"
                          autoComplete="off"
                          variant="outlined"
                        ></TextField>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      className="btn-primary-theme"
                      variant="contained"
                      onClick={handleStepOne}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {0 === 4 - 1 ? "Finish" : "Next"}
                    </Button>
                    {!disableReset ?   <Button
                      className="btn-secondary"
                      variant="contained"
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Reset
                    </Button>:''}
                  </div>
                </Box>
              </StepContent>
            </Step>

            <Step key={1}>
              <StepLabel>{"Deeplinking & Redirection Details"}</StepLabel>
              <StepContent>
                <Typography className="description-text">{"Configure to redirect app or web"}</Typography>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sm={12}
                  >
                    <FormControl
                      sx={{ m: 1, width: "100%" }}
                      error={errors.redirect}
                    >
                      <InputLabel id="redirection">Redirect</InputLabel>
                      <Select
                        labelId="redirection"
                        id="redirection"
                        value={redirect}
                        label="Redirect"
                        onChange={(e) => handleRedirectChange(e)}
                      >
                        <MenuItem value="web">Web</MenuItem>
                        <MenuItem value="app">App</MenuItem>
                      </Select>
                      <FormHelperText>{errors.redirect}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={4}
                    sm={12}
                  >
                    <FormControl
                      sx={{ m: 1, width: "100%" }}
                      error={errors.deeplink}
                    >
                      <InputLabel id="demo-simple-select-label">DeepLink</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-deeplink"
                        value={deeplink}
                        label="DeepLink"
                        onChange={(e) => setDeepLink(e.target.value)}
                        disabled={redirect !== "app"}
                      >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="/homePage">Home</MenuItem>
                        <MenuItem value="/newsHomePage">News</MenuItem>
                        <MenuItem value="/shopCarPage">Browse Cars</MenuItem>
                        <MenuItem value="/sellCar">Sell Car</MenuItem>
                        <MenuItem value="/AppointmentPage">My Appointments</MenuItem>
                        <MenuItem value="/TestDrivePage">My Test Drives</MenuItem>
                        <MenuItem value="/favorite">My Favorites</MenuItem>
                        <MenuItem value="/VoucherPage">My Vouchers</MenuItem>
                        <MenuItem value="/account">My Account</MenuItem>
                        <MenuItem value="/pageViewHistory">Browsing History</MenuItem>
                        <MenuItem value="/personalInformationPage">Personal Information</MenuItem>
                        <MenuItem value="/about">About</MenuItem>


                        {/* <MenuItem value="/pageSearch">SearchPage</MenuItem> */}
                        {/* <MenuItem value="/SettingsPage">settings</MenuItem> */}
                        {/* <MenuItem value="/OrderListPage">order</MenuItem> */}
                        {/* <MenuItem value="/carDetail">CarDetailPage</MenuItem> */}
                        {/* <MenuItem value="/myWebView">WebViewPage</MenuItem> */}
                        {/* <MenuItem value="/login">LoginPage</MenuItem> */}
                        {/* <MenuItem value="/storylyViewNative">StorylyView</MenuItem> */}
                        {/* <MenuItem value="/myWebView">After Sales Landing Page</MenuItem> */}
                      </Select>
                      <FormHelperText>{errors.deeplink}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                  >
                    <FormGroup className="m-l-10">
                      <FormControlLabel
                        className="fs-12"
                        control={
                          <Switch
                            onChange={handleFallbackChange}
                            checked={fallback}
                            disabled={redirect !== "app"}
                          />
                        }
                        label="Enable Fall back URL"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                  >
                    <TextField
                      value={androidFallback}
                      onChange={(e) => setAndroidFallback(e.target.value)}
                      sx={{ m: 1, width: "100%" }}
                      id="outlined-basic-android-fallback"
                      label="Android Fallback URL"
                      variant="outlined"
                      disabled={!fallback}
                      error={errors.androidFallback}
                      autoComplete="off"
                      helperText={errors.androidFallback}
                    ></TextField>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                  >
                    <TextField
                      value={iosFallback}
                      onChange={(e) => setIosFallback(e.target.value)}
                      sx={{ m: 1, width: "100%" }}
                      id="outlined-basic-ios-fallback"
                      label="iOS Fallback URL"
                      variant="outlined"
                      disabled={!fallback}
                      error={errors.iosFallback}
                      autoComplete="off"
                      helperText={errors.iosFallback}
                    ></TextField>
                  </Grid>
                </Grid>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <div className="m-l-10">
                    <Button
                      className="btn-primary-theme m-r-20"
                      variant="contained"
                      onClick={handleStepTwo}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {redirect === "web" ? "Skip & Generate" : "Generate"}
                    </Button>
                    <Button
                      className="btn-secondary"
                      disabled={1 === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>

            <Step key={2}>
              <StepLabel>{"Get your details here"}</StepLabel>
              <StepContent>
                {finalUtmLink ? (
                  <>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      Long URL
                    </Typography>
                    <>
                      <Typography
                        className="long-url"
                        variant="body2"
                        color="text.secondary"
                      >
                        {finalUtmLink}
                      </Typography>
                      <ContentCopyIcon
                        className="copy-btn"
                        onClick={onClickCopyLongUrl}
                        fontSize="large"
                      />
                    </>
                  </>
                ) : (
                  ""
                )}

                {/* Shorten URL */}
                {onelink ? (
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
                        {onelink}
                      </Typography>
                      <ContentCopyIcon
                        className="copy-btn"
                        onClick={onClickCopyOnelink}
                        fontSize="large"
                      />
                    </>
                  </div>
                ) : (
                  ""
                )}
                {onelink ? (
                  <div className="m-t-10">
                    {/* <img height="200" src={short_qr_code} alt={"Shorten QR Code"}/> */}
                    <QRcodeImage url={onelink} />
                    <Button
                      className="dwn-btn"
                      onClick={() => {
                        downloadCustomQRcode({ url: onelink, name: campaign });
                        segmentTracking();
                      }}
                      size="small"
                    >
                      <QrCode2Icon
                        className="va-btm"
                        fontSize="medium"
                      />
                      Click to Download QR Code
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                <Box sx={{ mb: 2 }}>
                  <div className="m-t-40">
                    <Button
                      className="btn-primary-theme"
                      variant="contained"
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Done
                    </Button>
                    <Button
                      className="btn-secondary"
                      disabled={1 === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </div>
    </>
  );
}
