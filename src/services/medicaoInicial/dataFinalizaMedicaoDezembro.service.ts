import axios from "src/services/_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const getDataFinalizaMedicaoDezembro = async () => {
  const url = "medicao-inicial/data-finaliza-medicao-dezembro/";
  const response: any = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};
