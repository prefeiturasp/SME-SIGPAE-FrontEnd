import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { deepCopy } from "src/helpers/utilities";
import {
  AtualizarOcorrenciaFormInterface,
  OcorrenciaFormInterface,
  RegistrarNovaOcorrenciaFormInterface,
} from "./interfaces";

const formatOcorrencias = (values_: RegistrarNovaOcorrenciaFormInterface) => {
  let respostas: Array<OcorrenciaFormInterface> = [];

  values_["grupos"].forEach((grupo: string, indexGrupo: number) => {
    Object.keys(grupo).forEach((key) => {
      const keyParts = key.split("_");
      const tipoOcorrenciaUUID = keyParts[1];
      const parametrizacaoUUID = keyParts[3];
      const resposta = grupo[key];
      const respostaDuplicada = respostas.find(
        (resposta: OcorrenciaFormInterface) =>
          resposta.parametrizacao === parametrizacaoUUID &&
          resposta.grupo === indexGrupo + 1,
      );
      if (respostaDuplicada) {
        if (typeof respostaDuplicada.resposta === "string") {
          respostaDuplicada.resposta = resposta;
        }
      } else {
        respostas.push({
          tipoOcorrencia: tipoOcorrenciaUUID,
          parametrizacao: parametrizacaoUUID,
          resposta: resposta,
          grupo: indexGrupo + 1,
        });
      }
    });
  });
  return respostas;
};

export const formataPayload = (
  values: RegistrarNovaOcorrenciaFormInterface,
  solicitacaoMedicaoInicialUuid: string,
) => {
  const values_ = deepCopy(values);
  values_["solicitacao_medicao_inicial"] = solicitacaoMedicaoInicialUuid;
  values_.ocorrencias = formatOcorrencias(values_);

  return values_;
};

export const formataPayloadEdicao = (
  values: RegistrarNovaOcorrenciaFormInterface,
  tipoOcorrenciaUuid: string,
  grupo: number,
): AtualizarOcorrenciaFormInterface => ({
  tipo_ocorrencia: tipoOcorrenciaUuid,
  grupo,
  data: values.datas[0],
  ocorrencias: formatOcorrencias(values).map((ocorrencia) => ({
    ...ocorrencia,
    grupo,
  })),
});

export const getUrlListaOcorrencias = (parametros: {
  ano?: string;
  mes?: string;
  editalUuid?: string;
  solicitacaoMedicaoInicialUuid?: string;
}) => {
  const searchParams = new URLSearchParams();

  if (parametros.ano) searchParams.set("ano", parametros.ano);
  if (parametros.mes) searchParams.set("mes", parametros.mes);
  if (parametros.editalUuid) {
    searchParams.set("editalUuid", parametros.editalUuid);
  }
  if (parametros.solicitacaoMedicaoInicialUuid) {
    searchParams.set(
      "solicitacaoMedicaoInicialUuid",
      parametros.solicitacaoMedicaoInicialUuid,
    );
  }

  const queryString = searchParams.toString();

  return `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}${
    queryString ? `?${queryString}` : ""
  }`;
};

export const getIntervaloMes = (
  mes?: string,
  ano?: string,
  dataReferencia: Date = new Date(),
): { minDate: Date | null; maxDate: Date | null } => {
  const mesNumero = Number(mes);
  const anoNumero = Number(ano);
  if (!mes || !ano || Number.isNaN(mesNumero) || Number.isNaN(anoNumero)) {
    return { minDate: null, maxDate: null };
  }

  const minDate = new Date(anoNumero, mesNumero - 1, 1);
  const ultimoDiaMes = new Date(anoNumero, mesNumero, 0);
  const ontem = new Date(
    dataReferencia.getFullYear(),
    dataReferencia.getMonth(),
    dataReferencia.getDate() - 1,
  );

  return {
    minDate,
    maxDate: ontem < ultimoDiaMes ? ontem : ultimoDiaMes,
  };
};
