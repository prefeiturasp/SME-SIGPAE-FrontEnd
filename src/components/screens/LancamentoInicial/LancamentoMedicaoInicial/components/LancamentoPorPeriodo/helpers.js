import { get, set } from "lodash";

const grupos = {
  convencional: "Convencional",
  grupoA: "Dieta especial Grupo A",
  grupoB: "Dieta especial Grupo B"
};

const camposMetadeFrequencia = {
  lanche_4h: "Lanche 4h",
  lanche: "Lanche",
  ref_enteral: "Refeição enteral",
  "refeicoes.0.ref_oferta": "Refeição 1ª oferta",
  "refeicoes.1.ref_oferta": "Refeição 2ª oferta",
  "refeicoes.0.sob_oferta": "Sobremesa 1ª oferta",
  "refeicoes.1.sob_oferta": "Sobremesa 2ª oferta"
};

export const objectFlattener = object => {
  return Reflect.apply(
    Array.prototype.concat,
    [],
    Object.keys(object).map(key => {
      if (object[key] instanceof Object) {
        return objectFlattener(object[key]);
      }
      return object[key];
    })
  );
};

export const tamanhoMaximoObsDiarias = value =>
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
        `Não é possível informar quantidade superior ao número de Dietas Ativas (${
          dadosMatriculados[grupo]
        }).`
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
      uuid: "36750ded-5790-433e-b765-0507303828df"
    }
  }
];

export const CORES = [
  "#198459",
  "#D06D12",
  "#2F80ED",
  "#831d1c",
  "#1F861F",
  "#9b51e0",
  "#B58B00",
  "#00f7ff",
  "#ff0095"
];

export const mockPeriodos = [
  {
    periodo: "Período Matutino",
    alimentacoes: {
      total: 200,
      refeicoes: 100,
      sobremesas: 60,
      lanches: 40
    }
  },
  {
    periodo: "Período Vespertino",
    alimentacoes: {
      total: 102,
      refeicoes: 50,
      sobremesas: 30,
      lanche: 20
    }
  },
  {
    periodo: "Período Integral",
    alimentacoes: {
      total: 350,
      refeicoes: 100,
      sobremesas: 100,
      lanches_4h: 70,
      lanche: 80
    }
  },
  {
    periodo: "Período Noturno - EJA",
    alimentacoes: {
      total: 280,
      refeicoes: 80,
      sobremesas: 80,
      lanches: 100,
      lanche: 20
    }
  },
  {
    periodo: "Programas e Projetos",
    alimentacoes: {
      total: 120,
      refeicoes: 20,
      sobremesas: 20,
      lanches_4h: 40,
      lanche: 40
    }
  },
  {
    periodo: "Solicitações de Alimentação",
    alimentacoes: {
      total: 80,
      lanches_emergenciais: 30,
      kit_lanches: 50
    }
  },
  {
    periodo: "ETEC",
    alimentacoes: {
      total: 0
    }
  }
];

export const OPCOES_AVALIACAO_A_CONTENTO = {
  SIM_SEM_OCORRENCIAS: 1,
  NAO_COM_OCORRENCIAS: 0
};
