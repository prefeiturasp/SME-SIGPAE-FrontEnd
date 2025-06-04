import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

export const getAPIVersion = async () => {
  const url = `/api-version/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
