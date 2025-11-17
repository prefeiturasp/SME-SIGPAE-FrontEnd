import axios from "./_base";

export const cadastrarRecreioNasFerias = async (payload) =>
  await axios.post("/medicao-inicial/recreio-nas-ferias/", payload);
