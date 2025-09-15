import { get, set } from "lodash";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";
import { usuarioEhDiretorUE, capitalize } from "src/helpers/utilities";

const grupos = {
  convencional: "Convencional",
  grupoA: "Dieta especial Grupo A",
  grupoB: "Dieta especial Grupo B",
};

const camposMetadeFrequencia = {
  lanche_4h: "Lanche 4h",
  lanche: "Lanche",
  ref_enteral: "Refeição enteral",
  "refeicoes.0.ref_oferta": "Refeição 1ª oferta",
  "refeicoes.1.ref_oferta": "Refeição 2ª oferta",
  "refeicoes.0.sob_oferta": "Sobremesa 1ª oferta",
  "refeicoes.1.sob_oferta": "Sobremesa 2ª oferta",
};

export const objectFlattener = (object) => {
  return Reflect.apply(
    Array.prototype.concat,
    [],
    Object.keys(object).map((key) => {
      if (object[key] instanceof Object) {
        return objectFlattener(object[key]);
      }
      return object[key];
    })
  );
};

export const tamanhoMaximoObsDiarias = (value) =>
  value && value.length > 90
    ? `Observações diárias devem ter 90 caracteres ou menos`
    : undefined;

export const validateFormLancamento = (
  formValues,
  panorama,
  dadosMatriculados
) => {
  let erros = {};
  if (
    get(formValues, "convencional.eh_dia_de_sobremesa_doce") === true &&
    get(formValues, "convencional.tem_sobremesa_doce_na_semana") === true &&
    get(formValues, "convencional.observacoes") === undefined
  ) {
    set(
      erros,
      `convencional.observacoes`,
      "Deve preencher observações diárias"
    );
  }
  for (let grupo of Object.keys(grupos)) {
    if (formValues[grupo] === undefined) continue;
    if (grupo === "convencional" && panorama.horas_atendimento === 4) {
      if (
        (get(formValues, "convencional.lanche_4h") !== undefined &&
          get(formValues, "convencional.refeicoes.0.ref_oferta") !==
            undefined) ||
        (get(formValues, "convencional.lanche_4h") === undefined &&
          get(formValues, "convencional.refeicoes.0.ref_oferta") === undefined)
      ) {
        const msgErro =
          'O atendimento dessa escola nesse período é de apenas 4 horas. Preencha OU "Lanche 4h" OU "Refeição 1ª oferta"';
        set(erros, `convencional.lanche_4h`, msgErro);
        set(erros, `convencional.refeicoes.0.ref_oferta`, msgErro);
      }
    }
    if (formValues[grupo].frequencia === undefined) {
      set(erros, `${grupo}.frequencia`, "Deve preencher a frequência");
      continue;
    }
    const frequencia = formValues[grupo]
      ? parseInt(formValues[grupo].frequencia)
      : 0;
    if (frequencia > dadosMatriculados[grupo]) {
      set(
        erros,
        `${grupo}.frequencia`,
        `Não é possível informar quantidade superior ao número de Dietas Ativas (${dadosMatriculados[grupo]}).`
      );
    }
    for (let [nomeCampo, nomeAmigavelCampo] of Object.entries(
      camposMetadeFrequencia
    )) {
      const valorCampo = get(formValues[grupo], nomeCampo);
      if (valorCampo) {
        const valorChave = parseInt(valorCampo);
        if (
          valorChave < frequencia / 2 &&
          get(formValues[grupo], "observacoes") === undefined
        ) {
          set(
            erros,
            `${grupo}.${nomeCampo}`,
            "Deve preencher observações diárias"
          );
          set(
            erros,
            `${grupo}.observacoes`,
            "Deve preencher observações diárias"
          );
        }
        if (valorChave > frequencia) {
          set(
            erros,
            `${grupo}.${nomeCampo}`,
            `O valor de ${nomeAmigavelCampo} não pode ser maior que a frequência`
          );
        }
      }
    }
  }

  return erros;
};

export const mockLogs = [
  {
    criado_em: "13/07/2022 18:17:32",
    descricao: "6105374: LAURA PORTO GONCALVES",
    justificativa: "",
    resposta_sim_nao: false,
    status_evento_explicacao: "Em aberto para preenchimento pela UE",
    usuario: {
      cargo: "ANALISTA DE SAUDE NIVEL I",
      cpf: null,
      crn_numero: null,
      date_joined: "10/07/2020 13:15:23",
      email: "escolaemef@admin.com",
      nome: "SUPER USUARIO ESCOLA EMEF",
      registro_funcional: "8115257",
      tipo_usuario: "escola",
      uuid: "36750ded-5790-433e-b765-0507303828df",
    },
  },
];

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
  textoCabecalho
) => {
  const obj = quantidadeAlimentacoesLancadas.find(
    (each) =>
      each.nome_periodo_grupo === nomePeriodoGrupo(grupo, textoCabecalho)
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
  textoCabecalho
) => {
  const obj = quantidadeAlimentacoesLancadas.find(
    (each) =>
      each.nome_periodo_grupo === nomePeriodoGrupo(grupo, textoCabecalho)
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
  textoCabecalho
) => {
  if (
    !solicitacaoMedicaoInicial ||
    ["Não Preenchido", "MEDICAO_ENVIADA_PELA_UE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho
      )
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
      textoCabecalho
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
  textoCabecalho
) => {
  return ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
    solicitacaoMedicaoInicial.status
  ) ||
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho
      )
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
          textoCabecalho
        )
      )
    ? "Corrigir"
    : "Editar";
};

export const styleBotaoCardLancamento = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial,
  grupo = null,
  textoCabecalho
) => {
  return ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
    solicitacaoMedicaoInicial.status
  ) ||
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_APROVADA_PELA_CODAE"].includes(
      statusPeriodo(
        quantidadeAlimentacoesLancadas,
        solicitacaoMedicaoInicial,
        grupo,
        textoCabecalho
      )
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
          textoCabecalho
        )
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
    usuarioEhDiretorUE()
  );
};

export const verificaSeEnviarCorrecaoDisabled = (
  quantidadeAlimentacoesLancadas,
  solicitacaoMedicaoInicial
) => {
  return (
    quantidadeAlimentacoesLancadas.some(
      (periodo) =>
        ![
          "MEDICAO_APROVADA_PELA_DRE",
          "MEDICAO_APROVADA_PELA_CODAE",
          "MEDICAO_CORRIGIDA_PELA_UE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
        ].includes(periodo.status)
    ) ||
    (solicitacaoMedicaoInicial.com_ocorrencias &&
      ![
        "MEDICAO_APROVADA_PELA_DRE",
        "MEDICAO_APROVADA_PELA_CODAE",
        "MEDICAO_CORRIGIDA_PELA_UE",
        "MEDICAO_CORRIGIDA_PARA_CODAE",
      ].includes(solicitacaoMedicaoInicial.ocorrencia.status))
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
