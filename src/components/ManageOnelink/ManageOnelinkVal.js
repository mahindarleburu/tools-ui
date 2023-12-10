import { isEmpty } from "../../utils/function";
import validator from "validator";

export const createOnelinkValidation=(data)=>{
    let errors = {};
    data.long_url = !isEmpty(data.long_url) ? data.long_url : "";
    data.user_id = !isEmpty(data.user_id) ? data.user_id : "";
    data.name = !isEmpty(data.name) ? data.name : "";
    if (isEmpty(data.long_url)) {
      errors.long_url = "long_url is required";
    }
  
    if (!validator.isURL(data.long_url)) {
      errors.long_url = "long_url is invalid";
    }

    if (isEmpty(data.name)) {
      errors.name = "name is required";
    }
    // if (isEmpty(data.user_id)) {
    //   errors.user_id = "user_id is required";
    // }
    
    if (!isEmpty(errors)) {
      return errors
    }

}