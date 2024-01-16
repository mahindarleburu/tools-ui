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
import { downloadCustomQRcode, foundSourceDisplayName, generateLongUrl, isEmpty } from "../../utils/function";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { stepOneValidation } from "./UtmValidation";
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

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
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
  const [url, setUrl] = useState("");
  const [campaign, setCampaign] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [finalUtmLink, setFinalUtmLink] = useState("");
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
    validationDataWeb.url = url;
    validationDataWeb.campaign = campaign;
    const valError = stepOneValidation(validationDataWeb);

    if (isEmpty(valError)) {
      setErrors({});
      handleNext();
      let data = {};
      data.url = url;
      data.UTM_SOURCE = source;
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
  };

  const onClickCopyOnelink = () => {
    navigator.clipboard.writeText(onelink);
    toast.info("Copy to clipboard success");
  };
 

  useEffect(() => {
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
    setUrl("");
    setCampaign("");
    setUtmContent("");
    setUtmTerm("");
    setFinalUtmLink("");
    setSourceObject([]);
    setErrors({});
    setActiveStep(0);
    if (params.id) {
      navigate("/manage-links");
    }
  };

  const handleFetchOnelinkById = async (id) => {
    try {
      const response = await instance.get(getOnelinkById + id);
      if (response.data) {
        const data = response?.data?.data?.meta;
        const onelinkData = response?.data?.data?.onelink;
        setOldObject(data);
        setSource(data.source);
        setMedium(data.medium);
        setUrl(data.url);
        setCampaign(data.campaign);
        setUtmContent(data.utmContent);
        setUtmTerm(data.utmTerm);
        setErrors({});
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

  return (
    <>
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
                    <Grid container spacing={2}>

                    <Grid item xs={12} md={8} sm={12} >
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
                      
                      <Grid item xs={12} md={4} sm={12} >
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

                      <Grid item xs={12} md={4} sm={12}>
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

                      <Grid item xs={12} md={4} sm={12}>
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

                      <Grid item xs={12} md={4} sm={12} >
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

                      <Grid item xs={12} md={4} sm={12} >
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
                    <img height="200" src={short_qr_code} alt={"Shorten QR Code"}/>
                    <QRcodeImage url={onelink} />
                    <Button
                      className="dwn-btn"
                      onClick={() => {
                        downloadCustomQRcode({ url: onelink, name: campaign });
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