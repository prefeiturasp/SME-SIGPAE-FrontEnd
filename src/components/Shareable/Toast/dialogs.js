import { toast } from "react-toastify";
import "./style.scss";

let baseConfig = {
  position: toast.POSITION.TOP_CENTER,
  icon: false,
};

export const toastSuccess = (message, toastId = null) => {
  toast.success(message, { ...baseConfig, toastId });
};

export const toastError = (message, toastId = null) => {
  toast.error(message, { ...baseConfig, toastId });
};

export const toastWarn = (message, toastId = null) => {
  toast.warn(message, { ...baseConfig, toastId });
};

export const toastInfo = (message, toastId = null) => {
  toast.info(message, { ...baseConfig, toastId });
};

export const toastDefault = (message, toastId = null) => {
  toast(message, { ...baseConfig, toastId });
};
