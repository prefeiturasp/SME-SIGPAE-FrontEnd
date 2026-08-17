import axios from "./_base";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export interface EmpresaPosRecebimento {
  uuid: string;
  cnpj: string;
  nome_fantasia: string;
  razao_social?: string;
}

export interface ContratoPosRecebimento {
  uuid: string;
  numero: string;
  processo: string;
}

export interface CronogramaPosRecebimento {
  uuid: string;
  numero: string;
}

export interface CronogramaDetalhePosRecebimento {
  uuid: string;
  numero: string;
  produto: string | null;
  processo_sei: string | null;
  unidade_medida: string | null;
  unidade_medida_abreviacao: string | null;
}

export interface FiscalPosRecebimento {
  uuid: string;
  nome: string;
}

export interface TermoRecebimentoDefinitivoPayload {
  empresa: string;
  contrato: string;
  cronogramas: string[];
  valor_contrato: string;
  quantidade_total_recebida: string;
  fiscal_1: string;
  fiscal_2: string;
  fiscal_3: string;
  texto_termo: string;
}

interface ResultadoLista<T> {
  results: T[];
}

export const getEmpresasPosRecebimento = async (): Promise<
  ResultadoLista<EmpresaPosRecebimento>
> => {
  try {
    return await axios.get("/terceirizadas/lista-empresas-pos-recebimento/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};

export const getContratosPosRecebimento = async (
  empresaId: string,
): Promise<ResultadoLista<ContratoPosRecebimento>> => {
  try {
    return await axios.get("/contratos/lista-contratos-pos-recebimento/", {
      params: { empresa_id: empresaId },
    });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};

export const getCronogramasPosRecebimento = async (
  contratoId: string,
): Promise<ResultadoLista<CronogramaPosRecebimento>> => {
  try {
    return await axios.get("/cronogramas/lista-cronogramas-pos-recebimento/", {
      params: { contrato_id: contratoId },
    });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};

export const getCronogramaPosRecebimento = async (
  cronogramaId: string,
): Promise<CronogramaDetalhePosRecebimento> => {
  try {
    return await axios.get(
      `/cronogramas/${cronogramaId}/dados-cronograma-pos-recebimento/`,
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};

export const getFiscaisPosRecebimento = async (): Promise<
  ResultadoLista<FiscalPosRecebimento>
> => {
  try {
    return await axios.get("/usuarios/fiscais/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};

export const cadastraTermoRecebimentoDefinitivo = async (
  payload: TermoRecebimentoDefinitivoPayload,
) => {
  try {
    return await axios.post("/pos-recebimento/termos/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
    throw error;
  }
};
