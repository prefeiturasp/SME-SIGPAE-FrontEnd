import axios from "src/services/_base";
export const getMesesAnos = async () => {
  return await axios.get("/relatorio-controle-frequencia/meses-anos/");
};
export const getFiltros = async (mes, ano) => {
  const params = { mes, ano };
  return await axios.get("relatorio-controle-frequencia/filtros/", { params });
};
export const getTotalAlunosMatriculados = async (filtros) => {
  return await axios.get("relatorio-controle-frequencia/filtrar/", {
    params: filtros,
  });
};
export const imprimirRelatorioControleFrequencia = async (filtros) => {
  const response = await axios.get(
    "relatorio-controle-frequencia/imprimir-pdf/",
    {
      params: filtros,
    }
  );
  return response.data;
};
