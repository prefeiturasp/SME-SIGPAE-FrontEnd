import { API_URL } from "../constants/config";
import authService from "./auth";
import axios from "./_base";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const getTotalAlunos = async () => {
  const url = `${API_URL}/codae/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results[0].quantidade_alunos;
  } catch (error) {
    return error.json;
  }
};

export const getKitLanches = async (uuid) =>
  await axios.get(`/kit-lanches/${uuid}/`);

export const checaNomeKitLanche = async (payload) =>
  await axios.get(`/kit-lanches/nome-existe/`, { params: payload });

export const createKitLanche = async (payload) =>
  await axios.post(`/kit-lanches/`, payload);

export const updateKitLanche = async (payload, uuid) =>
  await axios.put(`/kit-lanches/${uuid}/`, payload);
