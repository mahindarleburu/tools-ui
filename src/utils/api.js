import { toast } from "react-toastify";
import {instance} from './axiosInstance'

export const generateQrcode = async ({ long_url }) => {
  try {
    const response = await instance.post("/api/qrcode", { long_url });
    return response.data;
  } catch (error) {
    console.error(error);

    toast.error(error?.message);
    throw error?.message;
  }
};

export const generateOnelink = async ({ long_url, user_id }) => {
  try {
    const response = await instance.post("/api/onelink/create", { long_url, user_id });
    if (response?.data?.success === true) {
      toast.success(response?.data?.message);
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.message);
    //   throw error?.message;
  }
};

export const editOnelink = async ({ onelink_code, long_url, user_id }) => {
  try {
    const response = await instance.put("/api/onelink/update", { onelink_code, long_url, user_id });
    if (response?.data?.success === true) {
      toast.success(response?.data?.message);
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.message);
    //   throw error?.message;
  }
};

export const deleteOnelink = async ({ onelink_code, user_id }) => {
  try {
    const response = await instance.post("/api/onelink/delete", { onelink_code, user_id });
    if (response?.data?.success === true) {
      toast.success(response?.data?.message);
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.message);
    //   throw error?.message;
  }
};

export const getListOnelinkbyId = async ({ user_id }) => {
  try {
    const response = await instance.get(`/api/onelink/get_all/${user_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.message);
    //   throw error?.message;
  }
};
