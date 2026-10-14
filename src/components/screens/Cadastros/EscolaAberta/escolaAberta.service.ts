import axios from "src/services/_base";

export const cadastrarEscolaAberta = async (payload: any) =>
  await axios.post("/escola-aberta/", payload);
