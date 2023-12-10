import { DateTime } from "luxon";
import QRCodeStyling from "qr-code-styling";
import CarsomeLogo from "../assets/logo.png";
export const generateLongUrl = (data) => {
  var joinType;
  data.url.match(/\?/gm) ? (joinType = "&") : (joinType = "?");
  const utm_content = data.UTM_CONTENT ? data.UTM_CONTENT : "none";
  const utm_term = data.UTM_TERM ? data.UTM_TERM : "none";
  const decodeURL = decodeURI(data.url);
  let longUrl =
    decodeURL +
    joinType +
    "utm_source=" +
    data.UTM_SOURCE +
    "&utm_medium=" +
    data.UTM_MEDIUM +
    "&utm_campaign=" +
    data.UTM_COUNTRY +
    "-" +
    data.UTM_LOB +
    "-" +
    data.UTM_LANGUAGE +
    "-" +
    data.UTM_TYPE +
    "-" +
    data.UTM_CAMPAIGN +
    "&utm_content=" +
    utm_content +
    "&utm_term=" +
    utm_term;
  return encodeURI(longUrl);
};

export const generateLongAppsflyerUrl = (data) => {
  var joinType;
  data.url.match(/\?/gm) ? (joinType = "&") : (joinType = "?");
  let longUrl =
    data.url +
    joinType +
    "pid=" +
    data.pid +
    "&af_channel=" +
    data.af_channel +
    "&c=" +
    data.UTM_COUNTRY +
    "-" +
    data.UTM_LOB +
    "-" +
    data.UTM_LANGUAGE +
    "-" +
    data.UTM_TYPE +
    "-" +
    data.c +
    "&af_adset=" +
    data.af_adset +
    "&af_ad=" +
    data.af_ad +
    "&deep_link_value=" +
    data.deep_link_value +
    "&af_web_dp=" +
    data.af_web_dp +
    "&af_android_url=" +
    data.af_android_url +
    "&af_ios_url=" +
    data.af_ios_url +
    "&af_dp=app://open.carsome.consumer";
  return encodeURI(longUrl);
};

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const convertToLocalTimeZone = (value) => {
  var local = DateTime.local();
  const localTime = DateTime.fromISO(value, { zone: local.zoneName }).toFormat("MMM dd, yyyy hh:mm a");
  return localTime;
};

export const filterMedium = (sources, source) => {
  const found = sources.find((element) => element.name === source);
  return found?.utm_medium ? found?.utm_medium : [];
};

export const foundSourceDisplayName = (sources, source) => {
  const found = sources.find((element) => element.name === source);
  return found?.display_name ? found?.display_name : '';
};

export const downloadCustomQRcode = ({ url, name }) => {
  const qrCode = new QRCodeStyling({
    width: 1200,
    height: 1200,
    dotsOptions: {
      color: "#000000",
      type: "extra-rounded",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
    },
    // backgroundOptions:{
    //   color:"#82bc0000"
    // }
  });
  qrCode.update({
    data: url,
  });
  qrCode.download({
    extension: "png",
    name: name ? name : "qrcode",
  });
};
