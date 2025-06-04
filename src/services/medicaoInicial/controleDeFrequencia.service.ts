import {
  FiltrosInterface,
  RelatorioControleFrequenciaResponse,
  ResponseTotalAlunosMatriculados,
} from "interfaces/controle_de_frequencia";
import axios from "src/services/_base";

export const getMesesAnos = async () => {
  return await axios.get("/relatorio-controle-frequencia/meses-anos/");
};

export const getFiltros = async (mes: string, ano: string) => {
  const params = { mes, ano };

  return await axios.get("relatorio-controle-frequencia/filtros/", { params });
};

export const getTotalAlunosMatriculados = async (filtros: FiltrosInterface) => {
  return await axios.get<ResponseTotalAlunosMatriculados>(
    "relatorio-controle-frequencia/filtrar/",
    {
      params: filtros,
    }
  );
};

export const imprimirRelatorioControleFrequencia = async (
  filtros: FiltrosInterface
) => {
  const response = await axios.get<RelatorioControleFrequenciaResponse>(
    "relatorio-controle-frequencia/imprimir-pdf/",
    {
      params: filtros,
    }
  );
  return response.data;
};
