import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Lottie from "react-lottie";
import * as animationData from "./loader.json";
const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box sx={{ display: "flex", margin:"50vh auto"}}>
      <Lottie
        options={defaultOptions}
        height={"15%"}
        width={"15%"}
      />
    </Box>
  );
};

export default Loading;
