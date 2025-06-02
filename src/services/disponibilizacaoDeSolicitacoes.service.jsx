import axios from "./_base";
import { API_URL } from "../constants/config";
import { AUTH_TOKEN } from "./constants";

export const getSolicitacoesDisponibilizadas = async () =>
  await axios.get("/solicitacao-remessa/");

export const enviaSolicitacaoRemessa = async (uuid) => {
  const url = `${API_URL}/solicitacao-remessa/${uuid}/envia-solicitacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: AUTH_TOKEN,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const enviaSolicitacoesDaGrade = async (values) => {
  const url = `${API_URL}/solicitacao-remessa-envio/envia-grade/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "POST",
    body: JSON.stringify({ solicitacoes: values }),
  };
  let status = 0;
  return await fetch(url, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return { data: error, status: status };
    });
};
