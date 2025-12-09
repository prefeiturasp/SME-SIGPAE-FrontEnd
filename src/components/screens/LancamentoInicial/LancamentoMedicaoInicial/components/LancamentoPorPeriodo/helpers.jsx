import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";
import {
  capitalize,
  escolaNaoPossuiAlunosRegulares,
  usuarioEhDiretorUE,
} from "src/helpers/utilities";

export const CORES = [
  "#198459",
  "#D06D12",
  "#2F80ED",
  "#831d1c",
  "#1F861F",
  "#9b51e0",
  "#B58B00",
  "#ff0095",
  "#00f7ff",
  "#599E00",
  "#D7A800",
  "#B40C02",
];

export const OPCOES_AVALIACAO_A_CONTENTO = {
  SIM_SEM_OCORRENCIAS: 1,
  NAO_COM_OCORRENCIAS: 0,
};

export const removeObjetosDuplicados = (arr, key) => {
  return [...new Map(arr.map((obj) => [obj[key], obj])).values()];
};

export const nomePeriodoGrupo = (grupo = null, textoCabecalho) => {
  let nome = "";
  if (grupo) {
    nome += grupo;
  }
  if (textoCabecalho) {
    nome += textoCabecalho;
  }
  return nome.trim();
};

export const statusPeriodo = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
  grupo = null,
  textoCabecalho,
) => {
  const obj = quantidadeAlimentacoesLancadas.find(
    (each) =>
      each.nome_periodo_grupo === nomePeriodoGrupo(grupo, textoCabecalho),
  );
  if (obj) {
    return obj.status;
  } else if (
    solicitacaoMedicaoInicial.status ===
    "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE"
  ) {
    return solicitacaoMedicaoInicial.status;
  } else {
    return "Não Preenchido";
  }
};

export const justificativaPeriodo = (
  quantidadeAlimentacoesLancadas,
  grupo = null,
  textoCabecalho,
) => {
  const obj = quantidadeAlimentacoesLancadas.find(
    (each) =>
      each.nome_periodo_grupo === nomePeriodoGrupo(grupo, textoCabecalho),
  );
  if (obj) {
    return obj.justificativa;
  } else {
    return null;
  }
};

export const desabilitarBotaoEditar = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
  grupo = null,
  textoCabecalho,
) => {
  if (
    !solicitacaoMedicaoInicial ||
    ["Não Preenchido", "MEDICAO_ENVIADA_PELA_UE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho,
      ),
    )
  ) {
    return true;
  } else if (
    [
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    ].includes(solicitacaoMedicaoInicial.status) ||
    statusPeriodo(
      quantidadeAlimentacoesLancadas,
      solicitacaoMedicaoInicial,
      grupo,
      textoCabecalho,
    ) === "MEDICAO_APROVADA_PELA_DRE"
  ) {
    return false;
  }
  return (
    solicitacaoMedicaoInicial.status !==
    "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE"
  );
};

export const textoBotaoCardLancamento = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
  grupo = null,
  textoCabecalho,
) => {
  return ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
    solicitacaoMedicaoInicial.status,
  ) ||
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho,
      ),
    )
    ? "Visualizar"
    : [
          "MEDICAO_CORRECAO_SOLICITADA",
          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        ].includes(solicitacaoMedicaoInicial.status) &&
        [
          "MEDICAO_CORRECAO_SOLICITADA",
          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
          "MEDICAO_CORRIGIDA_PELA_UE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
        ].includes(
          statusPeriodo(
            quantidadeAlimentacoesLancadas,
            solicitacaoMedicaoInicial,
            grupo,
            textoCabecalho,
          ),
        )
      ? "Corrigir"
      : "Editar";
};

export const styleBotaoCardLancamento = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
  grupo = null,
  textoCabecalho,
) => {
  return ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
    solicitacaoMedicaoInicial.status,
  ) ||
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho,
      ),
    )
    ? BUTTON_STYLE.GREEN_OUTLINE
    : [
          "MEDICAO_CORRECAO_SOLICITADA",
          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        ].includes(solicitacaoMedicaoInicial.status) &&
        [
          "MEDICAO_CORRECAO_SOLICITADA",
          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
          "MEDICAO_CORRIGIDA_PELA_UE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
        ].includes(
          statusPeriodo(
            quantidadeAlimentacoesLancadas,
            solicitacaoMedicaoInicial,
            grupo,
            textoCabecalho,
          ),
        )
      ? BUTTON_STYLE.GREEN
      : BUTTON_STYLE.GREEN_OUTLINE;
};

export const renderBotaoEnviarCorrecao = (solicitacaoMedicaoInicial) => {
  return (
    solicitacaoMedicaoInicial &&
    [
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    ].includes(solicitacaoMedicaoInicial.status) &&
    (usuarioEhDiretorUE() ||
      escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial))
  );
};

export const verificaSeEnviarCorrecaoDisabled = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
) => {
  return (
    quantidadeAlimentacoesLancadas.some(
      (periodo) =>
        ![
          "MEDICAO_APROVADA_PELA_DRE",
          "MEDICAO_APROVADA_PELA_CODAE",
          "MEDICAO_CORRIGIDA_PELA_UE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
        ].includes(periodo.status),
    ) ||
    (solicitacaoMedicaoInicial.ocorrencia &&
      ![
        "MEDICAO_APROVADA_PELA_DRE",
        "MEDICAO_APROVADA_PELA_CODAE",
        "MEDICAO_CORRIGIDA_PELA_UE",
        "MEDICAO_CORRIGIDA_PARA_CODAE",
        "OCORRENCIA_EXCLUIDA_PELA_ESCOLA",
      ].includes(solicitacaoMedicaoInicial.ocorrencia.status))
  );
};

export const verificaSeEnviaCorrecaoSemOcorrenciaDisabled = (
  solicitacaoMedicaoInicial,
) => {
  return (
    !solicitacaoMedicaoInicial?.com_ocorrencias &&
    [
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRECAO_SOLICITADA",
    ].includes(solicitacaoMedicaoInicial?.status) &&
    [
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRECAO_SOLICITADA",
    ].includes(solicitacaoMedicaoInicial?.ocorrencia?.status)
  );
};

export const formataPeriodosNormais = (periodo) => {
  switch (periodo) {
    case "MANHA":
      return "Manhã";
    case "INTERMEDIARIO":
      return "Intermediário";
    default:
      return capitalize(periodo);
  }
};
