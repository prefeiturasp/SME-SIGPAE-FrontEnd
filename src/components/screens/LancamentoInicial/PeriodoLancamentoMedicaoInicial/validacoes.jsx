import {
  deepCopy,
  escolaNaoPossuiAlunosRegulares,
} from "src/helpers/utilities";
import { ALUNOS_EMEBS } from "../constants";

export const repeticaoSobremesaDoceComValorESemObservacao = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  const value =
    values[`repeticao_sobremesa__dia_${dia}__categoria_${categoria.id}`];
  const value2 =
    values[`repeticao_2_sobremesa__dia_${dia}__categoria_${categoria.id}`];
  const observacoesValue =
    values[`observacoes__dia_${dia}__categoria_${categoria.id}`];

  return (
    ((value && value !== "0" && Number(value) !== 0) ||
      (value2 && value2 !== "0" && Number(value2) !== 0)) &&
    diasSobremesaDoce.includes(
      `${new Date(location.state.mesAnoSelecionado).getFullYear()}-${(
        new Date(location.state.mesAnoSelecionado).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dia.toString().padStart(2, "0")}`,
    ) &&
    !observacoesValue
  );
};

export const botaoAddObrigatorioDiaNaoLetivoComInclusaoAutorizada = (
  values,
  dia,
  categoria,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo,
) => {
  if (
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria.id}`),
    )
  ) {
    if (
      Number(values[`frequencia__dia_${dia}__categoria_${categoria.id}`]) ===
        0 ||
      !validacaoDiaLetivo(dia)
    ) {
      return true;
    }
  }
};

export const campoComInclusaoContinuaValor0ESemObservacao = (
  dia,
  categoria,
  dadosValoresInclusoesAutorizadasState,
  values,
) => {
  const alimentacoes = ["lanche_4h", "lanche", "refeicao", "sobremesa"];
  let erro = false;
  alimentacoes.forEach((alimentacao) => {
    if (
      `${alimentacao}__dia_${dia}__categoria_${categoria.id}` in
        dadosValoresInclusoesAutorizadasState &&
      Number(
        values[`${alimentacao}__dia_${dia}__categoria_${categoria.id}`],
      ) === 0 &&
      !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]
    ) {
      erro = true;
    }
  });
  return erro;
};

export const campoLancheEmergencialComZeroOuSemObservacao = (
  values,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  const value =
    values[`lanche_emergencial__dia_${column.dia}__categoria_${categoria.id}`];

  return (
    (!value || Number(value) === 0) &&
    !values[`observacoes__dia_${column.dia}__categoria_${categoria.id}`] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length > 0
  );
};

export const campoLancheEmergencialSemAutorizacaoSemObservacao = (
  values,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  const value =
    values[`lanche_emergencial__dia_${column.dia}__categoria_${categoria.id}`];

  return (
    value &&
    !values[`observacoes__dia_${column.dia}__categoria_${categoria.id}`] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length === 0
  );
};

export const campoComInclusaoContinuaValorMaiorQueAutorizadoESemObservacao = (
  dia,
  categoria,
  dadosValoresInclusoesAutorizadasState,
  values,
) => {
  const alimentacoes = ["lanche_4h", "lanche", "refeicao", "sobremesa"];
  let erro = false;
  alimentacoes.forEach((alimentacao) => {
    if (
      `${alimentacao}__dia_${dia}__categoria_${categoria.id}` in
        dadosValoresInclusoesAutorizadasState &&
      Number(values[`${alimentacao}__dia_${dia}__categoria_${categoria.id}`]) >
        Number(
          dadosValoresInclusoesAutorizadasState[
            `${alimentacao}__dia_${dia}__categoria_${categoria.id}`
          ],
        ) &&
      !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]
    ) {
      erro = true;
    }
  });
  return erro;
};

export const campoFrequenciaValor0ESemObservacao = (dia, categoria, values) => {
  let erro = false;
  if (
    categoria.nome === "ALIMENTAÇÃO" &&
    values[`frequencia__dia_${dia}__categoria_${categoria.id}`] &&
    Number(values[`frequencia__dia_${dia}__categoria_${categoria.id}`]) === 0 &&
    !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]
  ) {
    erro = true;
  }
  return erro;
};

export const campoComSuspensaoAutorizadaESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  suspensoesAutorizadas,
) => {
  let erro = false;
  let alimentacoes = [];
  suspensoesAutorizadas &&
    suspensoesAutorizadas
      .filter((suspensao) => suspensao.dia === column.dia)
      .forEach((suspensao) => {
        alimentacoes = alimentacoes.concat(suspensao.alimentacoes);
      });
  alimentacoes.forEach((alimentacao) => {
    if (
      categoria.nome === "ALIMENTAÇÃO" &&
      formValuesAtualizados[
        `${alimentacao}__dia_${column.dia}__categoria_${categoria.id}`
      ] &&
      Number(
        formValuesAtualizados[
          `${alimentacao}__dia_${column.dia}__categoria_${categoria.id}`
        ],
      ) > 0 &&
      !formValuesAtualizados[
        `observacoes__dia_${column.dia}__categoria_${categoria.id}`
      ]
    ) {
      erro = true;
    }
  });
  return erro;
};

export const campoRefeicaoComRPLAutorizadaESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  let erro = false;
  if (
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("RPL"),
    ).length > 0 &&
    formValuesAtualizados[
      `refeicao__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    Number(
      formValuesAtualizados[
        `refeicao__dia_${column.dia}__categoria_${categoria.id}`
      ],
    ) !== 0 &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  ) {
    erro = true;
  }
  return erro;
};

export const campoLancheComLPRAutorizadaESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  let erro = false;
  if (
    categoria.nome === "ALIMENTAÇÃO" &&
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("LPR"),
    ).length > 0 &&
    (formValuesAtualizados[
      `lanche__dia_${column.dia}__categoria_${categoria.id}`
    ] ||
      formValuesAtualizados[
        `lanche_4h__dia_${column.dia}__categoria_${categoria.id}`
      ])
  ) {
    erro = true;
  }
  return erro;
};

export const camposKitLancheSolicitacoesAlimentacaoESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  kitLanchesAutorizadas,
) => {
  let erro = false;
  const kitLancheValue =
    formValuesAtualizados[
      `kit_lanche__dia_${column.dia}__categoria_${categoria.id}`
    ];
  if (
    kitLanchesAutorizadas &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !kitLancheValue &&
    kitLanchesAutorizadas
      .filter((kit) => kit.dia === column.dia)
      .reduce(function (total, kitLanche) {
        return total + parseInt(kitLanche.numero_alunos);
      }, 0) > 0
  ) {
    erro = true;
  }
  if (
    kitLanchesAutorizadas &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    kitLancheValue &&
    (kitLanchesAutorizadas
      .filter((kit) => kit.dia === column.dia)
      .reduce(function (total, kitLanche) {
        return total + parseInt(kitLanche.numero_alunos);
      }, 0) !== Number(kitLancheValue) ||
      kitLanchesAutorizadas.filter((kit) => kit.dia === column.dia).length ===
        0)
  ) {
    erro = true;
  }
  return erro;
};

export const camposLancheEmergTabelaEtec = (
  formValuesAtualizados,
  column,
  categoria,
  inclusoesEtecAutorizadas,
  ehGrupoETECUrlParam,
) => {
  let erro = false;
  const inclusaoEtec = ehGrupoETECUrlParam
    ? inclusoesEtecAutorizadas.filter((inc) => inc.dia === column.dia)
    : [];
  const refeicaoValue =
    formValuesAtualizados[
      `refeicao__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const repeticaoRefeicaoValue =
    formValuesAtualizados[
      `repeticao_refeicao__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const sobremesaValue =
    formValuesAtualizados[
      `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const repeticaoSobremesaValue =
    formValuesAtualizados[
      `repeticao_sobremesa__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const repeticao2SobremesaValue =
    formValuesAtualizados[
      `repeticao_sobremesa__dia_${column.dia}__categoria_${categoria.id}`
    ];

  const existeRefeicaoOuSobremesaValue =
    (refeicaoValue && refeicaoValue > 0) ||
    (repeticaoRefeicaoValue && repeticaoRefeicaoValue > 0) ||
    (sobremesaValue && sobremesaValue > 0) ||
    (repeticaoSobremesaValue && repeticaoSobremesaValue > 0) ||
    (repeticao2SobremesaValue && repeticao2SobremesaValue > 0);
  if (
    ehGrupoETECUrlParam &&
    categoria.nome === "ALIMENTAÇÃO" &&
    inclusaoEtec.length &&
    inclusaoEtec[0].alimentacoes.includes("lanche_emergencial") &&
    existeRefeicaoOuSobremesaValue
  ) {
    erro = true;
  }
  return erro;
};

export const botaoAdicionarObrigatorioTabelaAlimentacao = (
  formValuesAtualizados,
  dia,
  categoria,
  diasSobremesaDoce,
  location,
  row,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo,
  column,
  suspensoesAutorizadas,
  alteracoesAlimentacaoAutorizadas,
  kitLanchesAutorizadas,
  inclusoesEtecAutorizadas,
  ehGrupoETECUrlParam = false,
  feriadosNoMes,
) => {
  if (
    location.state.grupo === "Programas e Projetos" &&
    feriadosNoMes.includes(dia)
  ) {
    return false;
  } else {
    return (
      repeticaoSobremesaDoceComValorESemObservacao(
        formValuesAtualizados,
        dia,
        categoria,
        diasSobremesaDoce,
        location,
      ) ||
      campoComInclusaoContinuaValorMaiorQueAutorizadoESemObservacao(
        dia,
        categoria,
        dadosValoresInclusoesAutorizadasState,
        formValuesAtualizados,
      ) ||
      campoFrequenciaValor0ESemObservacao(
        dia,
        categoria,
        formValuesAtualizados,
      ) ||
      campoComSuspensaoAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        suspensoesAutorizadas,
        row,
      ) ||
      campoRefeicaoComRPLAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas,
      ) ||
      campoLancheComLPRAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas,
      ) ||
      camposKitLancheSolicitacoesAlimentacaoESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        kitLanchesAutorizadas,
      ) ||
      camposLancheEmergTabelaEtec(
        formValuesAtualizados,
        column,
        categoria,
        inclusoesEtecAutorizadas,
        ehGrupoETECUrlParam,
      ) ||
      campoLancheEmergencialComZeroOuSemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas,
      )
    );
  }
};

export const botaoAdicionarObrigatorio = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  return (
    repeticaoSobremesaDoceComValorESemObservacao(
      values,
      dia,
      categoria,
      diasSobremesaDoce,
      location,
    ) || campoFrequenciaValor0ESemObservacao(dia, categoria, values)
  );
};

export const validarFormulario = (
  values,
  diasSobremesaDoce,
  location,
  categoriasDeMedicao,
  dadosValoresInclusoesAutorizadasState,
  weekColumns,
) => {
  const categoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO"),
  );
  let erro = false;

  const values_ = deepCopy(values);
  Object.keys(values_).forEach((value) => {
    if (
      !weekColumns
        .map((wc) => wc.dia)
        .includes(
          value.includes("__dia_") &&
            value.split("__dia_")[1].split("__categoria")[0],
        )
    ) {
      delete values_[value];
    }
  });

  let dias = [];
  weekColumns.forEach((c) => dias.push(c.dia));

  categoriasDeMedicao.forEach((categoria) => {
    diasSobremesaDoce.forEach((dia) => {
      if (
        repeticaoSobremesaDoceComValorESemObservacao(
          values_,
          dia.split("-")[2],
          categoria,
          diasSobremesaDoce,
          location,
        )
      ) {
        erro = `Dia ${
          dia.split("-")[2]
        } é de sobremesa doce. Justifique o lançamento de repetição nas observações`;
      }
    });

    categoria.id === categoriaAlimentacao.id &&
      Object.keys(dadosValoresInclusoesAutorizadasState).forEach((inclusao) => {
        const dia = inclusao.split("__dia_")[1].split("__categoria")[0];
        if (
          campoComInclusaoContinuaValorMaiorQueAutorizadoESemObservacao(
            dia,
            categoria,
            dadosValoresInclusoesAutorizadasState,
            values_,
          )
        ) {
          erro = `Dia ${dia} está com valor maior que o autorizado. Justifique nas observações`;
        }
      });
  });

  let arrayDiasInclusoesAutorizadasEmValues = [];
  let keysFromValues = Object.keys(values_);

  for (const key in Object.fromEntries(
    Object.entries(dadosValoresInclusoesAutorizadasState),
  )) {
    if (keysFromValues.includes(key)) {
      const keySplitted = key.split("__");
      const dia = keySplitted[1].match(/\d/g).join("");
      arrayDiasInclusoesAutorizadasEmValues.push(dia);
    }
  }

  arrayDiasInclusoesAutorizadasEmValues = [
    ...new Set(arrayDiasInclusoesAutorizadasEmValues),
  ];

  return erro;
};

export const validacoesTabelaAlimentacao = (
  rowName,
  dia,
  categoria,
  value,
  allValues,
  dadosValoresInclusoesAutorizadasState,
  suspensoesAutorizadas,
  alteracoesAlimentacaoAutorizadas,
  validacaoDiaLetivo,
  location,
  feriadosNoMes,
  valoresPeriodosLancamentos,
  escolaEhEMEBS,
  alunosTabSelecionada,
) => {
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`],
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  if (location.state && location.state.grupo === "Programas e Projetos") {
    if (feriadosNoMes.includes(dia)) {
      return undefined;
    }
    if (
      value &&
      !["Mês anterior", "Mês posterior"].includes(value) &&
      [NaN].includes(maxFrequencia) &&
      (inputName.includes("refeicao") ||
        inputName.includes("sobremesa") ||
        inputName.includes("lanche") ||
        inputName.includes("repeticao"))
    ) {
      return "Frequência acima inválida ou não preenchida.";
    }
  }

  const existeAlteracaoAlimentacaoRPL =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("RPL"),
    ).length > 0;

  const existeAlteracaoAlimentacaoLPR =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("LPR"),
    ).length > 0;

  const maxMatriculados = Number(
    allValues[`matriculados__dia_${dia}__categoria_${categoria}`],
  );

  const maxNumeroDeAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`],
  );

  if (
    `${rowName}__dia_${dia}__categoria_${categoria}` ===
      `frequencia__dia_${dia}__categoria_${categoria}` &&
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria}`),
    ) &&
    !(["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0)
  ) {
    if (validacaoDiaLetivo(dia) && (!value || (value && Number(value) !== 0))) {
      return `Foi autorizada inclusão de alimentação ${
        location.state && location.state.grupo ? "contínua" : ""
      } nesta data. Informe a frequência de alunos.`;
    }
  } else if (
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    [NaN].includes(maxFrequencia) &&
    (inputName.includes("refeicao") ||
      inputName.includes("sobremesa") ||
      inputName.includes("lanche") ||
      inputName.includes("repeticao")) &&
    !inputName.includes("emergencial") &&
    !(inputName in dadosValoresInclusoesAutorizadasState)
  ) {
    return "Frequência acima inválida ou não preenchida.";
  } else if (
    inputName in dadosValoresInclusoesAutorizadasState &&
    !escolaNaoPossuiAlunosRegulares(location.state.solicitacaoMedicaoInicial) &&
    !location.state.periodoEspecifico
  ) {
    if (
      validacaoDiaLetivo(dia) &&
      allValues[inputName] >
        maxFrequencia + Number(dadosValoresInclusoesAutorizadasState[inputName])
    ) {
      let msg = `Número máximo de alimentações foi excedido. Foi autorizada a inclusão de `;
      msg += `${dadosValoresInclusoesAutorizadasState[inputName]} alimentações neste dia. `;
      msg += `O lançamento deve considerar as alimentações do dia (até o limite dos frequentes) + as alimentações autorizadas.`;
      return msg;
    }
    if (!validacaoDiaLetivo(dia) && allValues[inputName] > maxFrequencia) {
      return `Número apontado de alimentação é maior que número de alunos frequentes. Ajuste o apontamento. `;
    }
    return undefined;
  } else if (
    value &&
    existeAlteracaoAlimentacaoRPL &&
    inputName.includes("lanche") &&
    !inputName.includes("emergencial") &&
    (!allValues[`refeicao__dia_${dia}__categoria_${categoria}`] ||
      Number(allValues[`refeicao__dia_${dia}__categoria_${categoria}`]) === 0)
  ) {
    if (Number(value) > 2 * maxFrequencia) {
      return "Lançamento maior que 2x a frequência de alunos no dia.";
    } else {
      return undefined;
    }
  } else if (
    value &&
    existeAlteracaoAlimentacaoLPR &&
    inputName.includes("refeicao") &&
    !inputName.includes("repeticao") &&
    (!allValues[`lanche__dia_${dia}__categoria_${categoria}`] ||
      Number(allValues[`lanche__dia_${dia}__categoria_${categoria}`]) === 0) &&
    (!allValues[`lanche_4h__dia_${dia}__categoria_${categoria}`] ||
      Number(allValues[`lanche_4h__dia_${dia}__categoria_${categoria}`]) === 0)
  ) {
    if (Number(value) > 2 * maxFrequencia) {
      return "Lançamento maior que 2x a frequência de alunos no dia.";
    } else {
      return undefined;
    }
  } else if (
    value &&
    Number(value) > maxFrequencia &&
    (inputName.includes("refeicao") ||
      inputName.includes("sobremesa") ||
      inputName.includes("lanche")) &&
    !inputName.includes("repeticao") &&
    !inputName.includes("emergencial")
  ) {
    return "Lançamento maior que a frequência de alunos no dia.";
  } else if (
    value &&
    Number(value) >
      (location.state &&
      (location.state.grupo === "Programas e Projetos" ||
        escolaNaoPossuiAlunosRegulares(
          location.state.solicitacaoMedicaoInicial,
        ) ||
        location.state.periodoEspecifico)
        ? maxNumeroDeAlunos
        : maxMatriculados) &&
    inputName.includes("frequencia")
  ) {
    const complemento =
      location.state &&
      (location.state.grupo === "Programas e Projetos" ||
        escolaNaoPossuiAlunosRegulares(
          location.state.solicitacaoMedicaoInicial,
        ) ||
        location.state.periodoEspecifico)
        ? "em Número de Alunos"
        : "de alunos matriculados";
    return `A quantidade de alunos frequentes não pode ser maior do que a quantidade ${complemento}.`;
  } else if (
    escolaEhEMEBS &&
    maxNumeroDeAlunos &&
    value &&
    inputName.includes("frequencia") &&
    !["Mês anterior", "Mês posterior"].includes(value)
  ) {
    const tabSelecionada = Object.entries(ALUNOS_EMEBS).filter(
      ([, v]) => v.key === alunosTabSelecionada,
    )[0][0];
    const infantilOuFundamentalParaFiltrar =
      tabSelecionada === "INFANTIL" ? "FUNDAMENTAL" : "INFANTIL";
    const objValorFrequenciaDaOutraTab = valoresPeriodosLancamentos.filter(
      (valor) =>
        valor.nome_campo === "frequencia" &&
        String(valor.dia) === String(dia) &&
        String(valor.categoria_medicao) === String(categoria) &&
        valor.infantil_ou_fundamental === infantilOuFundamentalParaFiltrar,
    )[0];
    if (
      objValorFrequenciaDaOutraTab &&
      Number(objValorFrequenciaDaOutraTab.valor) + Number(value) >
        maxNumeroDeAlunos
    ) {
      return "A quantidade somada de alunos frequentes no infantil e fundamental é maior que a quantidade de Número de Alunos.";
    }
  }
  return undefined;
};

const validaFrequenciaDietasEscolaSemAlunosRegulares = (
  location,
  categoria,
  dia,
  value,
  rowName,
  medicaoUuid,
  maxDietasAutorizadas,
) => {
  if (rowName !== "frequencia") return false;
  const totalFrequencia = location.state.frequenciasDietasEscolaSemAlunoRegular
    .filter(
      (campoFrequencia) =>
        campoFrequencia.categoria_medicao === categoria &&
        Number(campoFrequencia.dia) === Number(dia) &&
        campoFrequencia.medicao_uuid !== medicaoUuid,
    )
    .reduce(function (total, cf) {
      return total + Number(cf.valor);
    }, 0);
  if (
    maxDietasAutorizadas !== 0 &&
    Number(value) + totalFrequencia > maxDietasAutorizadas
  ) {
    return "Quantidade de dietas especiais autorizadas foi excedida";
  }
  return false;
};

export const validacoesTabelasDietas = (
  categoriasDeMedicao,
  rowName,
  dia,
  categoria,
  value,
  allValues,
  location,
  medicaoUuid,
  validacaoDiaLetivo,
  dadosValoresInclusoesAutorizadasState,
  inclusoesAutorizadas,
  alteracoesAlimentacaoAutorizadas,
) => {
  const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO"),
  ).id;

  const maxDietasAutorizadas = Number(
    allValues[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`],
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`],
  );
  const maxFrequenciaAlimentacao = Number(
    allValues[`frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`],
  );
  const lanche_4h_value = Number(
    allValues[`lanche_4h__dia_${dia}__categoria_${categoria}`],
  );
  const lanche_value = Number(
    allValues[`lanche__dia_${dia}__categoria_${categoria}`],
  );
  const totalLanchesDieta = lanche_4h_value + lanche_value;
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  const alimentacoesDoDia = Object.keys(allValues).filter(
    (key) =>
      String(key).includes(`dia_${dia}__categoria_${categoria}`) &&
      !String(key).includes("numero_de_alunos") &&
      !String(key).includes("frequencia"),
  );

  const EH_INCLUSAO_SOMENTE_SOBREMESA =
    inclusoesAutorizadas.length &&
    inclusoesAutorizadas.every((i) => i.alimentacoes === "sobremesa");

  const somaDosValoresPorCampo = (campo) =>
    categoriasDeMedicao.reduce((total, categoria) => {
      const valor = Number(
        allValues[`${campo}__dia_${dia}__categoria_${categoria.id}`],
      );
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

  if (
    rowName === "frequencia" &&
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria}`),
    ) &&
    !(["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0) &&
    alimentacoesDoDia.some((ali) => allValues[ali])
  ) {
    if (
      !EH_INCLUSAO_SOMENTE_SOBREMESA &&
      validacaoDiaLetivo(dia) &&
      ((maxDietasAutorizadas !== 0 && !value) ||
        (value && Number(value) !== 0)) &&
      alimentacoesDoDia
        .map((ali_dia) => ali_dia.split("__dia")[0])
        .some((item) =>
          item.includes(
            inclusoesAutorizadas
              .find((inc) => inc.dia === dia)
              .alimentacoes.split(", "),
          ),
        )
    ) {
      return `Foi autorizada inclusão de alimentação ${
        location.state && location.state.grupo ? "contínua" : ""
      } nesta data. Informe a frequência de alunos.`;
    }
  }
  if (
    value &&
    Number(value) > maxDietasAutorizadas &&
    inputName.includes("frequencia")
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos com dietas autorizadas.";
  } else if (
    value &&
    Number(value) > maxFrequencia &&
    (inputName.includes("lanche_4h") ||
      inputName.includes("lanche") ||
      inputName.includes("refeicao"))
  ) {
    return "A quantidade não pode ser maior do que a quantidade inserida em Frequência.";
  } else if (
    value &&
    Number(value) > 0 &&
    somaDosValoresPorCampo("refeicao") > maxFrequenciaAlimentacao &&
    inputName.includes("refeicao")
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Refeição na planilha de Alimentação.";
  } else if (
    value &&
    Number(value) !== 0 &&
    somaDosValoresPorCampo("lanche") > maxFrequenciaAlimentacao &&
    inputName.includes("lanche") &&
    !inputName.includes("_4h") &&
    (!alteracoesAlimentacaoAutorizadas ||
      alteracoesAlimentacaoAutorizadas.length === 0 ||
      alteracoesAlimentacaoAutorizadas.filter(
        (alteracao) =>
          alteracao.dia === dia && alteracao.motivo.includes("RPL"),
      ).length === 0)
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Lanche na planilha de Alimentação.";
  } else if (
    value &&
    Number(value) !== 0 &&
    somaDosValoresPorCampo("lanche_4h") > maxFrequenciaAlimentacao &&
    inputName.includes("lanche_4h") &&
    (!alteracoesAlimentacaoAutorizadas ||
      alteracoesAlimentacaoAutorizadas.length === 0 ||
      alteracoesAlimentacaoAutorizadas.filter(
        (alteracao) =>
          alteracao.dia === dia && alteracao.motivo.includes("RPL"),
      ).length === 0)
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Lanche na planilha de Alimentação.";
  } else if (
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    [NaN].includes(maxFrequencia) &&
    (inputName.includes("lanche_4h") ||
      inputName.includes("lanche") ||
      inputName.includes("refeicao"))
  ) {
    return "Frequência acima inválida ou não preenchida.";
  } else if (
    inputName.includes("frequencia") &&
    !location.state.periodo?.includes("INTEGRAL") &&
    categoria !== idCategoriaAlimentacao &&
    value &&
    totalLanchesDieta &&
    Number(value) < totalLanchesDieta
  ) {
    return "Quantidade de dietas especiais autorizadas foi excedida.";
  }
  if (
    escolaNaoPossuiAlunosRegulares(location.state.solicitacaoMedicaoInicial) ||
    location.state.periodoEspecifico
  ) {
    return validaFrequenciaDietasEscolaSemAlunosRegulares(
      location,
      categoria,
      dia,
      value,
      rowName,
      medicaoUuid,
      maxDietasAutorizadas,
    );
  }
  return undefined;
};

export const validacoesTabelaEtecAlimentacao = (
  rowName,
  dia,
  categoria,
  value,
  allValues,
  validacaoDiaLetivo,
  validacaoSemana,
) => {
  const maxNumeroAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`],
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`],
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;
  if (
    rowName === "frequencia" &&
    !allValues[`frequencia__dia_${dia}__categoria_${categoria}`] &&
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`] &&
    validacaoDiaLetivo(dia) &&
    !validacaoSemana(dia)
  ) {
    return "Há solicitação de alimentação autorizada para esta data. Insira o número de frequentes.";
  }
  if (
    value &&
    Number(value) > maxNumeroAlunos &&
    inputName.includes("frequencia")
  ) {
    return "O número de frequentes não pode ser maior que o número de autorizados.";
  } else if (
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    ((maxFrequencia !== 0 && !maxFrequencia) ||
      [NaN].includes(maxFrequencia)) &&
    !inputName.includes("numero_de_alunos") &&
    !inputName.includes("frequencia")
  ) {
    return "Frequência acima inválida ou não preenchida.";
  } else if (
    value &&
    Number(value) > maxFrequencia &&
    !inputName.includes("numero_de_alunos") &&
    !inputName.includes("repeticao")
  ) {
    return "A quantidade não pode ser maior do que a quantidade inserida em Frequência.";
  }
  return undefined;
};

export const exibirTooltipErroQtdMaiorQueAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  dadosValoresInclusoesAutorizadasState,
) => {
  return (
    `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
      dadosValoresInclusoesAutorizadasState &&
    Number(
      formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ],
    ) >
      Number(
        dadosValoresInclusoesAutorizadasState[
          `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
        ],
      ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const exibeTooltipInclusoesAutorizadasComZero = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  inclusoesAutorizadas,
  ehProgramasEProjetosLocation = false,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    !ehProgramasEProjetosLocation &&
    inclusoesAutorizadas.some(
      (inclusao) => column.dia === String(inclusao.dia),
    ) &&
    categoria.nome === "ALIMENTAÇÃO" &&
    !row.name.includes("repeticao") &&
    value &&
    Number(value) === 0 &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const exibirTooltipSuspensoesAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  suspensoesAutorizadas,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    value &&
    Number(value) > 0 &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    suspensoesAutorizadas &&
    suspensoesAutorizadas.filter(
      (suspensao) =>
        suspensao.dia === column.dia &&
        suspensao.alimentacoes.includes(row.name),
    ).length > 0 &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const exibirTooltipRPLAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];
  return (
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    Number(value) > 0 &&
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("RPL"),
    ).length > 0 &&
    row.name.includes("refeicao") &&
    !row.name.includes("repeticao") &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const exibirTooltipLPRAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    Number(value) > 0 &&
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("LPR"),
    ).length > 0 &&
    row.name.includes("lanche") &&
    !row.name.includes("emergencial")
  );
};

export const exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  kitLanchesAutorizadas,
  value_ = undefined,
  ehChangeInput = false,
) => {
  if (ehChangeInput && !value_) {
    return false;
  }
  const value = ehChangeInput
    ? value_
    : formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ];

  const campoBloqueado =
    (value &&
      categoria.nome.includes("SOLICITAÇÕES") &&
      !formValuesAtualizados[
        `observacoes__dia_${column.dia}__categoria_${categoria.id}`
      ] &&
      !["Mês anterior", "Mês posterior"].includes(value) &&
      kitLanchesAutorizadas &&
      kitLanchesAutorizadas
        .filter((kit) => kit.dia === column.dia)
        .reduce(function (total, kitLanche) {
          return total + parseInt(kitLanche.numero_alunos);
        }, 0) !== Number(value) &&
      row.name.includes("kit_lanche")) ||
    (!value &&
      row.name.includes("kit_lanche") &&
      kitLanchesAutorizadas
        .filter((kit) => kit.dia === column.dia)
        .reduce(function (total, kitLanche) {
          return total + parseInt(kitLanche.numero_alunos);
        }, 0) > 0);
  return campoBloqueado;
};

export const exibirTooltipKitLancheSolAlimentacoes = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  kitLanchesAutorizadas,
  value_ = undefined,
  ehChangeInput = false,
) => {
  if (!value_ && ehChangeInput) return false;
  const value = ehChangeInput
    ? value_
    : formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ];

  const campoBloqueado =
    value &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    kitLanchesAutorizadas.filter((kit) => kit.dia === column.dia).length ===
      0 &&
    row.name.includes("kit_lanche");
  return campoBloqueado;
};

export const exibirTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas =
  (
    formValuesAtualizados,
    row,
    column,
    categoria,
    alteracoesAlimentacaoAutorizadas,
  ) => {
    const value =
      formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ];
    return (
      (value &&
        categoria.nome.includes("SOLICITAÇÕES") &&
        !formValuesAtualizados[
          `observacoes__dia_${column.dia}__categoria_${categoria.id}`
        ] &&
        !["Mês anterior", "Mês posterior"].includes(value) &&
        alteracoesAlimentacaoAutorizadas &&
        alteracoesAlimentacaoAutorizadas
          .filter((alteracao) => alteracao.dia === column.dia)
          .reduce(function (total, alteracaoAlimentacao) {
            return total + parseInt(alteracaoAlimentacao.numero_alunos);
          }, 0) !== Number(value) &&
        row.name.includes("lanche_emergencial")) ||
      (!value &&
        row.name.includes("lanche_emergencial") &&
        alteracoesAlimentacaoAutorizadas &&
        alteracoesAlimentacaoAutorizadas
          .filter((alteracao) => alteracao.dia === column.dia)
          .reduce(function (total, alteracaoAlimentacao) {
            return total + parseInt(alteracaoAlimentacao.numero_alunos);
          }, 0) > 0)
    );
  };

export const exibirTooltipLancheEmergencialNaoAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
  value_ = undefined,
  ehChangeInput = false,
) => {
  if (!value_ && ehChangeInput) return false;
  const value = ehChangeInput
    ? value_
    : formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ];

  return (
    value &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length === 0 &&
    row.name.includes("lanche_emergencial")
  );
};

export const exibirTooltipLancheEmergencialAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    (!value || Number(value) === 0) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    row.name.includes("lanche_emergencial") &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length > 0
  );
};

export const exibirTooltipLancheEmergencialZeroAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
  validacaoDiaLetivo,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    row.name.includes("lanche_emergencial") &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length > 0 &&
    validacaoDiaLetivo(column.dia) &&
    value &&
    Number(value) === 0
  );
};

export const exibirTooltipLancheEmergencialZeroAutorizadoJustificado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
  validacaoDiaLetivo,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    row.name.includes("lanche_emergencial") &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia,
    ).length > 0 &&
    validacaoDiaLetivo(column.dia) &&
    value &&
    Number(value) === 0
  );
};

export const exibirTooltipFrequenciaZeroTabelaEtec = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  ehGrupoETECUrlParam,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    ehGrupoETECUrlParam &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    Number(value) === 0 &&
    row.name === "frequencia"
  );
};

export const exibirTooltipLancheEmergTabelaEtec = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  ehGrupoETECUrlParam,
  inclusoesEtecAutorizadas,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    Number(value) > 0 &&
    ehGrupoETECUrlParam &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    (row.name.includes("refeicao") ||
      row.name.includes("repeticao_refeicao") ||
      row.name.includes("sobremesa") ||
      row.name.includes("repeticao_sobremesa") ||
      row.name.includes("repeticao_2_sobremesa")) &&
    inclusoesEtecAutorizadas
      .filter((inc) => inc.dia === column.dia)[0]
      .alimentacoes.includes("lanche_emergencial")
  );
};

export const exibirTooltipRepeticao = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  diasSobremesaDoce,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const maxRefeicao =
    formValuesAtualizados[
      `refeicao__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const maxSobremesa =
    formValuesAtualizados[
      `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const ehDiaSobremesaDoce = diasSobremesaDoce?.some(
    (data) => data.slice(-2) === column.dia,
  );

  return (
    !ehDiaSobremesaDoce &&
    value &&
    Number(value) > 0 &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    (!!(
      row.name.includes("repeticao_refeicao") &&
      (!maxRefeicao ||
        (Number(maxRefeicao) && Number(value) > Number(maxRefeicao)))
    ) ||
      !!(
        (row.name.includes("repeticao_sobremesa") ||
          row.name.includes("repeticao_2_sobremesa")) &&
        (!maxSobremesa ||
          (Number(maxSobremesa) && Number(value) > Number(maxSobremesa)))
      ))
  );
};

export const exibirTooltipPadraoRepeticaoDiasSobremesaDoce = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    [null, undefined].includes(value) &&
    (row.name === "repeticao_sobremesa" ||
      row.name === "repeticao_2_sobremesa") &&
    diasSobremesaDoce.includes(
      `${new Date(location.state.mesAnoSelecionado).getFullYear()}-${(
        new Date(location.state.mesAnoSelecionado).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${column.dia}`,
    )
  );
};

export const exibirTooltipRepeticaoDiasSobremesaDoceDiferenteZero = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const sobremesaValue =
    formValuesAtualizados[
      row.name === "repeticao_sobremesa"
        ? `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
        : `2_sobremesa_1_oferta__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const observacoesValue =
    formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    value !== "0" &&
    Number(value) !== 0 &&
    (row.name === "repeticao_sobremesa" ||
      row.name === "repeticao_2_sobremesa") &&
    diasSobremesaDoce.includes(
      `${new Date(location.state.mesAnoSelecionado).getFullYear()}-${(
        new Date(location.state.mesAnoSelecionado).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${column.dia}`,
    ) &&
    Number(sobremesaValue) > 0 &&
    !observacoesValue
  );
};

export const exibirTooltipRepeticaoDiasSobremesaDoceDreCodae = (
  semanaSelecionada,
  mesSolicitacao,
  anoSolicitacao,
  diasSobremesaDoce,
  column,
  row,
  categoria,
) => {
  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    !(Number(semanaSelecionada) === 1 && Number(column.dia) > 20) &&
    !(
      [4, 5, 6].includes(Number(semanaSelecionada)) && Number(column.dia) < 10
    ) &&
    (row.name === "repeticao_sobremesa" ||
      row.name === "repeticao_2_sobremesa") &&
    diasSobremesaDoce.includes(
      `${anoSolicitacao}-${mesSolicitacao}-${column.dia}`,
    )
  );
};

export const exibirTooltipInclusaoAlimentacaoAutorizadaDreCodae = (
  semanaSelecionada,
  inclusoesAutorizadas,
  column,
  row,
  categoria,
) => {
  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    !(Number(semanaSelecionada) === 1 && Number(column.dia) > 20) &&
    !(
      [4, 5, 6].includes(Number(semanaSelecionada)) && Number(column.dia) < 10
    ) &&
    row.name === "frequencia" &&
    inclusoesAutorizadas.filter((inclusao) => inclusao.dia === column.dia)
      .length > 0
  );
};

export const exibirTooltipAlteracaoAlimentacaoAutorizadaDreCodae = (
  semanaSelecionada,
  alteracoesAlimentacaoAutorizadas,
  column,
  row,
  categoria,
) => {
  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    !(Number(semanaSelecionada) === 1 && Number(column.dia) > 20) &&
    !(
      [4, 5, 6].includes(Number(semanaSelecionada)) && Number(column.dia) < 10
    ) &&
    ((row.name === "lanche" &&
      alteracoesAlimentacaoAutorizadas.filter(
        (alteracao) =>
          alteracao.dia === column.dia && alteracao.motivo.includes("LPR"),
      ).length > 0) ||
      (row.name === "refeicao" &&
        !row.name.includes("repeticao") &&
        alteracoesAlimentacaoAutorizadas.filter(
          (alteracao) =>
            alteracao.dia === column.dia && alteracao.motivo.includes("RPL"),
        ).length > 0))
  );
};

const todasAlimentacoesSuspensas = (periodo, suspensoesAutorizadas, column) => {
  const tiposAlimentacaoPeriodo = periodo.tipos_alimentacao
    .flatMap((tipo_ali) =>
      tipo_ali.nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll(/ /g, "_"),
    )
    .filter((tipo_ali) => tipo_ali !== "lanche_emergencial");
  const tiposAlimentacaoSuspensasDia = [
    ...new Set(
      suspensoesAutorizadas
        .filter((suspensao) => suspensao.dia === column.dia)
        .flatMap((suspensao) => suspensao.alimentacoes),
    ),
  ];

  return tiposAlimentacaoPeriodo.every((tipo_ali) =>
    tiposAlimentacaoSuspensasDia.includes(tipo_ali),
  );
};

export const exibirTooltipSuspensaoAutorizadaFrequenciaDreCodae = (
  semanaSelecionada,
  suspensoesAutorizadas,
  column,
  row,
  categoria,
  periodo,
) => {
  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    !(Number(semanaSelecionada) === 1 && Number(column.dia) > 20) &&
    !(
      [4, 5, 6].includes(Number(semanaSelecionada)) && Number(column.dia) < 10
    ) &&
    row.name === "frequencia" &&
    suspensoesAutorizadas.filter((suspensao) => suspensao.dia === column.dia)
      .length > 0 &&
    todasAlimentacoesSuspensas(periodo, suspensoesAutorizadas, column)
  );
};

export const exibirTooltipSuspensaoAutorizadaAlimentacaoDreCodae = (
  semanaSelecionada,
  suspensoesAutorizadas,
  column,
  row,
  categoria,
  periodo,
) => {
  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    !(Number(semanaSelecionada) === 1 && Number(column.dia) > 20) &&
    !(
      [4, 5, 6].includes(Number(semanaSelecionada)) && Number(column.dia) < 10
    ) &&
    [
      ...new Set(
        suspensoesAutorizadas
          .filter((suspensao) => suspensao.dia === column.dia)
          .flatMap((suspensao) => suspensao.alimentacoes),
      ),
    ].includes(row.name) &&
    !todasAlimentacoesSuspensas(periodo, suspensoesAutorizadas, column)
  );
};
