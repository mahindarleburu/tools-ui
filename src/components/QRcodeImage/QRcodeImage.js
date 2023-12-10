import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
const qrCode = new QRCodeStyling({
  width: 250,
  height: 250,
  dotsOptions: {
    color: "#000000",
    type: "extra-rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
  backgroundOptions: {
    //   color:"#82bc0000"
  },
});
const QRcodeImage = (props) => {
  const { url } = props;
  const ref = useRef(null);
  useEffect(() => {
    qrCode.update({
      data: url,
    });
  }, [url]);
  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  return <div ref={ref} />;
};

export default QRcodeImage;
