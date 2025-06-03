import { deepCopy } from "src/helpers/utilities";
const formatOcorrencias = (values_) => {
  let respostas = [];
  values_["grupos"].forEach((grupo, indexGrupo) => {
    Object.keys(grupo).forEach((key) => {
      const tipoOcorrenciaUUID = key.split("_")[2];
      const parametrizacaoUUID = key.split("_")[4];
      const resposta = grupo[key];
      const respostaDuplicada = respostas.find(
        (resposta) =>
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
export const formataPayload = (values, solicitacaoMedicaoInicialUuid) => {
  const values_ = deepCopy(values);
  values_["solicitacao_medicao_inicial"] = solicitacaoMedicaoInicialUuid;
  values_.ocorrencias = formatOcorrencias(values_);
  return values_;
};
