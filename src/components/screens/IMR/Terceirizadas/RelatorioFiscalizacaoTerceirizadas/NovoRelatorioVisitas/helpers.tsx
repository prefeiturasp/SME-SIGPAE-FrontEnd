import {
  ArquivoInterface,
  TipoOcorrenciaInterface,
  EscolaLabelInterface,
  NovoRelatorioVisitasFormInterface,
} from "src/interfaces/imr.interface";
import { deepCopy } from "src/helpers/utilities";

export const formataPayloadUpdate = (
  values: NovoRelatorioVisitasFormInterface,
  escolaSelecionada: EscolaLabelInterface,
  anexos: Array<ArquivoInterface>,
  notificacoes_assinadas: Array<ArquivoInterface>,
  respostasOcorrenciaNaoSeAplica?: Array<any>
) => {
  let values_ = deepCopy(values);
  values_.escola = escolaSelecionada.uuid;
  values_.acompanhou_visita = values.acompanhou_visita === "sim";

  const { respostas: ocorrencias_nao_se_aplica } = formatOcorrenciasNaoSeAplica(
    values,
    respostasOcorrenciaNaoSeAplica
  );

  const { respostas: ocorrencias } = formatOcorrencias(values);

  const ocorrencias_sim = formatOcorrenciasSim(values);

  return {
    ...values_,
    ocorrencias_nao_se_aplica,
    ocorrencias,
    ocorrencias_sim,
    anexos,
    notificacoes_assinadas,
  };
};

export const formataPayload = (
  values: NovoRelatorioVisitasFormInterface,
  escolaSelecionada: EscolaLabelInterface,
  anexos: Array<ArquivoInterface>,
  notificacoes_assinadas: Array<ArquivoInterface>
) => {
  let values_ = deepCopy(values);
  values_.escola = escolaSelecionada.uuid;
  values_.acompanhou_visita = values.acompanhou_visita === "sim";

  const { respostas: ocorrencias_nao_se_aplica } = formatOcorrenciasNaoSeAplica(
    values,
    []
  );
  const { respostas: ocorrencias } = formatOcorrencias(values);

  return {
    ...values_,
    ocorrencias_nao_se_aplica,
    ocorrencias,
    anexos,
    notificacoes_assinadas,
  };
};

const formatOcorrenciasSim = (values: NovoRelatorioVisitasFormInterface) => {
  const ocorrencias_sim = [];

  Object.keys(values).forEach((key) => {
    if (key.includes("ocorrencia_") && values[key] === "sim") {
      const tipoOcorrenciaUUID = key.split("_")[1];
      ocorrencias_sim.push(tipoOcorrenciaUUID);
    }
  });

  return ocorrencias_sim;
};

const formatOcorrenciasNaoSeAplica = (
  values: NovoRelatorioVisitasFormInterface,
  respostasOcorrenciaNaoSeAplica?: Array<any>
) => {
  const ocorrencias_nao_se_aplica = [];

  Object.keys(values).forEach((key) => {
    if (key.includes("ocorrencia_") && values[key] === "nao_se_aplica") {
      const tipoOcorrenciaUUID = key.split("_")[1];
      const descricao = values[`descricao_${tipoOcorrenciaUUID}`];
      const _resposta = respostasOcorrenciaNaoSeAplica.find(
        (_resposta) => _resposta.tipo_ocorrencia === tipoOcorrenciaUUID
      );
      const uuidResposta = _resposta ? _resposta.uuid : null;
      ocorrencias_nao_se_aplica.push({
        tipo_ocorrencia: tipoOcorrenciaUUID,
        descricao,
        uuid: uuidResposta,
      });
    }
  });

  return { respostas: ocorrencias_nao_se_aplica };
};

const formatOcorrencias = (values: NovoRelatorioVisitasFormInterface) => {
  let values_ = deepCopy(values);
  let respostas = [];
  let ocorrenciasNao = [];
  let grupos = {};

  const getGrupoRespostas = (tipoOcorrenciaUUID: string) => {
    return Object.keys(values_).reduce((acc, _key) => {
      if (_key.includes(`grupos_${tipoOcorrenciaUUID}`)) {
        acc[_key] = values_[_key];
      }
      return acc;
    }, {});
  };

  const processRespostas = (
    grupo: any,
    tipoOcorrenciaUUID: string,
    indexGrupo: number
  ) => {
    Object.keys(grupo).forEach((keyGrupo: string) => {
      const itemsKey = keyGrupo.split("_");
      const parametrizacaoUUID = itemsKey[3];
      const resposta = grupo[keyGrupo];
      const respostaUUID = itemsKey[5];
      const respostaObj = respostaUUID
        ? {
            uuid: respostaUUID,
            tipoOcorrencia: tipoOcorrenciaUUID,
            parametrizacao: parametrizacaoUUID,
            resposta: resposta,
            grupo: indexGrupo + 1,
          }
        : {
            tipoOcorrencia: tipoOcorrenciaUUID,
            parametrizacao: parametrizacaoUUID,
            resposta: resposta,
            grupo: indexGrupo + 1,
          };
      // condição específica para remover keys usadas apenas para auxiliar o componente de datas
      if (itemsKey.length === 6 || itemsKey.length === 5) {
        respostas.push(respostaObj);
      }
    });
  };

  Object.keys(values_).forEach((key: string) => {
    if (key.startsWith("ocorrencia_") && values_[key] === "nao") {
      const tipoOcorrenciaUUID = key.split("_")[1];
      ocorrenciasNao.push(tipoOcorrenciaUUID);
      const grupoRespostas = getGrupoRespostas(tipoOcorrenciaUUID);

      Object.keys(grupoRespostas).forEach((_key) => {
        const gruposDeRespostas = grupoRespostas[_key];
        grupos[tipoOcorrenciaUUID] = gruposDeRespostas;
        if (gruposDeRespostas) {
          gruposDeRespostas.forEach((grupo: any, indexGrupo: number) => {
            if (grupo) {
              processRespostas(grupo, tipoOcorrenciaUUID, indexGrupo);
            }
          });
        }
      });
    }
  });

  return { ocorrenciasNao, respostas, grupos };
};

export const validarFormulariosTiposOcorrencia = (
  values: NovoRelatorioVisitasFormInterface,
  tiposOcorrencia: Array<TipoOcorrenciaInterface>
) => {
  const { respostas, ocorrenciasNao, grupos } = formatOcorrencias(values);

  // valida todos os tipos de ocorrência assinalados como "não"
  const listaValidacaoPorTipoOcorrencia = ocorrenciasNao
    .map((_ocorrenciaUUID) => {
      const _tipoOcorrencia = tiposOcorrencia.find(
        (_tipo_ocorrencia) => _tipo_ocorrencia.uuid === _ocorrenciaUUID
      );

      if (!_tipoOcorrencia) {
        return null;
      }
      let _validacaoTodosOsGrupos = [];
      // pega os grupos de resposta por tipo de ocorrência
      const gruposPorTipoOcorrencia = grupos[_tipoOcorrencia.uuid];
      if (gruposPorTipoOcorrencia) {
        _validacaoTodosOsGrupos = gruposPorTipoOcorrencia.map(
          (_respostas, indexGrupo) => {
            const _validacaoPorGrupo = _tipoOcorrencia.parametrizacoes.map(
              (_parametrizacao) => {
                // valida a existência de resposta de cada parametrização da ocorrência
                const _resposta = respostas.find(
                  (_resp) =>
                    _resp.grupo === indexGrupo + 1 &&
                    _resp.parametrizacao === _parametrizacao.uuid
                );
                return (_resposta && _resposta.resposta) || false;
              }
            );
            const grupoIsValid = _validacaoPorGrupo.every(Boolean);
            return grupoIsValid;
          }
        );
      }
      // checa o resultado da validação de todas as parametrizações do tipo de ocorrência
      const isValid = _validacaoTodosOsGrupos.every(Boolean);

      return { tipo_ocorrencia: _ocorrenciaUUID, valid: isValid };
    })
    .filter((resultado) => resultado !== null);

  const formulariosValidos = listaValidacaoPorTipoOcorrencia.every(
    (resultado) => resultado.valid
  );
  return { listaValidacaoPorTipoOcorrencia, formulariosValidos };
};

export const validarFormulariosParaCategoriasDeNotificacao = (
  values: NovoRelatorioVisitasFormInterface,
  tiposOcorrencia: Array<TipoOcorrenciaInterface>
) => {
  const tiposOcorrenciaFiltradosPorCategoria = tiposOcorrencia.filter(
    (tipo) =>
      tipo.categoria.nome ===
        "QUANTIDADE/QUALIDADE DE UTENSÍLIOS/MOBILIÁRIOS/EQUIPAMENTOS" ||
      tipo.categoria.nome === "MANUTENÇÃO DE EQUIPAMENTOS/REPARO E ADAPTAÇÃO"
  );
  const _validarFormulariosTiposOcorrencia = validarFormulariosTiposOcorrencia(
    values,
    tiposOcorrenciaFiltradosPorCategoria
  );

  return _validarFormulariosTiposOcorrencia;
};
