import { API_URL } from "src/constants/config";
import authService from "./auth";

const authHeader = {
  "Content-Type": "application/json",
  Authorization: `JWT ${authService.getToken()}`,
};

export const getTemplatesMensagem = async () => {
  try {
    const response = await fetch(`${API_URL}/templates-mensagem/`, {
      method: "GET",
      headers: authHeader,
    });
    const json = await response.json();
    return json;
  } catch (err) {
    return console.log(`getEmailConfigurationError: ${err}`);
  }
};

export const getTemplateMensagemDetalhe = async (uuid) => {
  try {
    const response = await fetch(`${API_URL}/templates-mensagem/${uuid}/`, {
      method: "GET",
      headers: authHeader,
    });
    const json = await response.json();
    return json;
  } catch (err) {
    return console.log(`getEmailConfigurationError: ${err}`);
  }
};

export const atualizarTemplateMensagem = async (uuid, values) => {
  try {
    const response = await fetch(`${API_URL}/templates-mensagem/${uuid}/`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify(values),
    });
    let json = await response.json();
    const status = await response.status;
    json.status = status;
    return json;
  } catch (err) {
    return console.log(`getEmailConfigurationError: ${err}`);
  }
};
