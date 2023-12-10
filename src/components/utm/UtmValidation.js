import { toast } from "react-toastify";
import validator from "validator";
import { isEmpty } from "../../utils/function";
export const stepOneValidation = (data) => {
  const errors = {};

  if (isEmpty(data.source)) {
    errors.source = "Source field is required";
  }
  if (isEmpty(data.medium)) {
    errors.medium = "Medium field is required";
  }
  if (isEmpty(data.country)) {
    errors.country = "Country field is required";
  }
  if (isEmpty(data.lob)) {
    errors.lob = "Lob field is required";
  }
  if (isEmpty(data.language)) {
    errors.language = "Language field is required";
  }
  if (isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (!validator.isURL(data.url)) {
    errors.url = "URL is inValid";
    toast.error("URL is Invalid")
  }

  if (isEmpty(data.campaign)) {
    errors.campaign = "Campaign field is required";
  }
  console.log(errors);
  return errors;
};

export const stepTwoValidation = (data) => {
  const errors = {};

  if (isEmpty(data.source)) {
    errors.source = "Source field is required";
  }
  if (isEmpty(data.medium)) {
    errors.medium = "Medium field is required";
  }
  if (isEmpty(data.country)) {
    errors.country = "Country field is required";
  }
  if (isEmpty(data.lob)) {
    errors.lob = "Lob field is required";
  }
  if (isEmpty(data.language)) {
    errors.language = "Language field is required";
  }
  if (isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (!validator.isURL(data.url)) {
    errors.url = "URL is inValid";
    toast.error("URL is Invalid")
  }

  if (isEmpty(data.campaign)) {
    errors.campaign = "Campaign field is required";
  }
  if (data.redirect === "app") {
    if (isEmpty(data.deeplink)) {
      errors.deeplink = "Deeplink field is required";
    }
    if (data.fallback) {
      if (isEmpty(data.androidFallback)) {
        errors.androidFallback = "androidFallback field is required";
      }
      if (!validator.isURL(data.androidFallback)) {
        errors.androidFallback = "androidFallback is inValid";
      }
      if (isEmpty(data.iosFallback)) {
        errors.iosFallback = "iosFallback field is required";
      }
      if (!validator.isURL(data.iosFallback)) {
        errors.iosFallback = "iosFallback is inValid";
      }
    }
  }
  console.log(errors);
  return errors;
};
