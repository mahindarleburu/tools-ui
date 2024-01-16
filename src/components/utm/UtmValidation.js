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
