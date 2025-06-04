import { deepCopy } from "src/helpers/utilities";
import {
  OcorrenciaFormInterface,
  RegistrarNovaOcorrenciaFormInterface,
} from "./interfaces";

const formatOcorrencias = (values_: RegistrarNovaOcorrenciaFormInterface) => {
  let respostas: Array<OcorrenciaFormInterface> = [];

  values_["grupos"].forEach((grupo: string, indexGrupo: number) => {
    Object.keys(grupo).forEach((key) => {
      const tipoOcorrenciaUUID = key.split("_")[2];
      const parametrizacaoUUID = key.split("_")[4];
      const resposta = grupo[key];
      const respostaDuplicada = respostas.find(
        (resposta: OcorrenciaFormInterface) =>
          resposta.parametrizacao === parametrizacaoUUID &&
          resposta.grupo === indexGrupo + 1
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
  solicitacaoMedicaoInicialUuid: string
) => {
  const values_ = deepCopy(values);
  values_["solicitacao_medicao_inicial"] = solicitacaoMedicaoInicialUuid;
  values_.ocorrencias = formatOcorrencias(values_);

  return values_;
};
