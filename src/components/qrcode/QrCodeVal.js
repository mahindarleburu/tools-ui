import { isEmpty } from "../../utils/function";
import validator from "validator";

export const QrCodeVal=(data)=>{
    let errors = {};
    data.long_url = !isEmpty(data.long_url) ? data.long_url : "";
    data.name = !isEmpty(data.name) ? data.name : "";
    
    if (!validator.isURL(data.long_url)) {
      errors.long_url = "URL is invalid";
    }
    if (isEmpty(data.long_url)) {
      errors.long_url = "URL is required";
    }
    if (isEmpty(data.name)) {
      errors.name = "name is required";
    }
    
    if (!isEmpty(errors)) {
      return errors
    }

}