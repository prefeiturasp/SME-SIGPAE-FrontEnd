import { deepCopy, ehEscolaTipoCEUGESTAO } from "helpers/utilities";

export const repeticaoSobremesaDoceComValorESemObservacao = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location
) => {
  return (
    values[`repeticao_sobremesa__dia_${dia}__categoria_${categoria.id}`] &&
    !values[`observacoes__dia_${dia}__categoria_${categoria.id}`] &&
    diasSobremesaDoce.includes(
      `${new Date(location.state.mesAnoSelecionado).getFullYear()}-${(
        new Date(location.state.mesAnoSelecionado).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dia}`
    )
  );
};

export const botaoAddObrigatorioDiaNaoLetivoComInclusaoAutorizada = (
  values,
  dia,
  categoria,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo
) => {
  if (
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria.id}`)
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
  values
) => {
  const alimentacoes = ["lanche_4h", "lanche", "refeicao", "sobremesa"];
  let erro = false;
  alimentacoes.forEach((alimentacao) => {
    if (
      `${alimentacao}__dia_${dia}__categoria_${categoria.id}` in
        dadosValoresInclusoesAutorizadasState &&
      Number(
        values[`${alimentacao}__dia_${dia}__categoria_${categoria.id}`]
      ) === 0 &&
      !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]
    ) {
      erro = true;
    }
  });
  return erro;
};

export const campoComInclusaoContinuaValorMaiorQueAutorizadoESemObservacao = (
  dia,
  categoria,
  dadosValoresInclusoesAutorizadasState,
  values
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
          ]
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
  suspensoesAutorizadas
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
      formValuesAtualizados[
        `${alimentacao}__dia_${column.dia}__categoria_${categoria.id}`
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
  alteracoesAlimentacaoAutorizadas
) => {
  let erro = false;
  if (
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("RPL")
    ).length > 0 &&
    formValuesAtualizados[
      `refeicao__dia_${column.dia}__categoria_${categoria.id}`
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
  alteracoesAlimentacaoAutorizadas
) => {
  let erro = false;
  if (
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("LPR")
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
  kitLanchesAutorizadas
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

export const camposLancheEmergencialSolicitacoesAlimentacaoESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas
) => {
  let erro = false;
  const lancheEmergencialValue =
    formValuesAtualizados[
      `lanche_emergencial__dia_${column.dia}__categoria_${categoria.id}`
    ];
  if (
    alteracoesAlimentacaoAutorizadas &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    lancheEmergencialValue &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia
    ).length === 0
  ) {
    erro = true;
  }
  if (
    alteracoesAlimentacaoAutorizadas &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    lancheEmergencialValue &&
    Number(lancheEmergencialValue) === 0
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
  ehGrupoETECUrlParam
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
  const existeRefeicaoOuSobremesaValue =
    (refeicaoValue && refeicaoValue > 0) ||
    (repeticaoRefeicaoValue && repeticaoRefeicaoValue > 0) ||
    (sobremesaValue && sobremesaValue > 0) ||
    (repeticaoSobremesaValue && repeticaoSobremesaValue > 0);
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
  feriadosNoMes
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
        location
      ) ||
      campoComInclusaoContinuaValorMaiorQueAutorizadoESemObservacao(
        dia,
        categoria,
        dadosValoresInclusoesAutorizadasState,
        formValuesAtualizados
      ) ||
      campoFrequenciaValor0ESemObservacao(
        dia,
        categoria,
        formValuesAtualizados
      ) ||
      campoComSuspensaoAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        suspensoesAutorizadas
      ) ||
      campoRefeicaoComRPLAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas
      ) ||
      campoLancheComLPRAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas
      ) ||
      camposKitLancheSolicitacoesAlimentacaoESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        kitLanchesAutorizadas
      ) ||
      camposLancheEmergencialSolicitacoesAlimentacaoESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas
      ) ||
      camposLancheEmergTabelaEtec(
        formValuesAtualizados,
        column,
        categoria,
        inclusoesEtecAutorizadas,
        ehGrupoETECUrlParam
      )
    );
  }
};

export const botaoAdicionarObrigatorio = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location
) => {
  return (
    repeticaoSobremesaDoceComValorESemObservacao(
      values,
      dia,
      categoria,
      diasSobremesaDoce,
      location
    ) || campoFrequenciaValor0ESemObservacao(dia, categoria, values)
  );
};

export const validarFormulario = (
  values,
  diasSobremesaDoce,
  location,
  categoriasDeMedicao,
  dadosValoresInclusoesAutorizadasState,
  weekColumns
) => {
  const categoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO")
  );
  let erro = false;

  const values_ = deepCopy(values);
  Object.keys(values_).forEach((value) => {
    if (
      !weekColumns
        .map((wc) => wc.dia)
        .includes(
          value.includes("__dia_") &&
            value.split("__dia_")[1].split("__categoria")[0]
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
          location
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
            values_
          )
        ) {
          erro = `Dia ${dia} está com valor maior que o autorizado. Justifique nas observações`;
        }
      });
  });

  let arrayDiasInclusoesAutorizadasEmValues = [];
  let keysFromValues = Object.keys(values_);

  for (const key in Object.fromEntries(
    Object.entries(dadosValoresInclusoesAutorizadasState)
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
  feriadosNoMes
) => {
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`]
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
    if (
      !inputName.includes("numero_de_alunos") &&
      Number(allValues[inputName]) > Number(maxFrequencia)
    ) {
      return `Número apontado de alimentação é maior que número de alunos frequentes. Ajuste o apontamento. `;
    }
  }

  const existeAlteracaoAlimentacaoRPL =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("RPL")
    ).length > 0;

  const existeAlteracaoAlimentacaoLPR =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("LPR")
    ).length > 0;

  const maxMatriculados = Number(
    allValues[`matriculados__dia_${dia}__categoria_${categoria}`]
  );

  const maxNumeroDeAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`]
  );

  const alimentacoesDoDia = Object.keys(allValues).filter(
    (key) =>
      String(key).includes(`dia_${dia}__categoria_${categoria}`) &&
      !String(key).includes("numero_de_alunos") &&
      !String(key).includes("frequencia")
  );

  if (
    `${rowName}__dia_${dia}__categoria_${categoria}` ===
      `frequencia__dia_${dia}__categoria_${categoria}` &&
    Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
      String(key).includes(`__dia_${dia}__categoria_${categoria}`)
    ) &&
    !(["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0) &&
    alimentacoesDoDia.some((ali) => allValues[ali])
  ) {
    if (!value || (value && Number(value) !== 0 && validacaoDiaLetivo(dia))) {
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
    !ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola)
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
    !allValues[`refeicao__dia_${dia}__categoria_${categoria}`]
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
    !allValues[`lanche__dia_${dia}__categoria_${categoria}`] &&
    !allValues[`lanche_4h__dia_${dia}__categoria_${categoria}`]
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
        ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola))
        ? maxNumeroDeAlunos
        : maxMatriculados) &&
    inputName.includes("frequencia")
  ) {
    const complemento =
      location.state &&
      (location.state.grupo === "Programas e Projetos" ||
        ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola))
        ? "em Número de Alunos"
        : "de alunos matriculados";
    return `A quantidade de alunos frequentes não pode ser maior do que a quantidade ${complemento}.`;
  }
  return undefined;
};

const validaFrequenciaDietasCEUGESTAO = (
  location,
  categoria,
  dia,
  value,
  rowName,
  medicaoUuid,
  maxDietasAutorizadas
) => {
  if (rowName !== "frequencia") return false;
  const totalFrequencia = location.state.frequenciasDietasCEUGESTAO
    .filter(
      (campoFrequencia) =>
        campoFrequencia.categoria_medicao === categoria &&
        Number(campoFrequencia.dia) === Number(dia) &&
        campoFrequencia.medicao_uuid !== medicaoUuid
    )
    .reduce(function (total, cf) {
      return total + Number(cf.valor);
    }, 0);
  if (Number(value) + totalFrequencia > maxDietasAutorizadas) {
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
  medicaoUuid
) => {
  const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO")
  ).id;
  const maxDietasAutorizadas = Number(
    allValues[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`]
  );
  const maxMatriculados = Number(
    allValues[`matriculados__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`]
  );
  const maxFrequenciaAlimentacao = Number(
    allValues[`frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;
  if (
    value &&
    Number(value) > maxDietasAutorizadas &&
    inputName.includes("frequencia")
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos com dietas autorizadas.";
  } else if (
    value &&
    Number(value) +
      Number(
        allValues[`frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
      ) >
      maxMatriculados &&
    inputName.includes("frequencia")
  ) {
    return "O apontamento informado ultrapassou o número de frequentes informados no dia. É preciso subtrair o aluno com Dieta Especial Autorizada do lançamento na planilha de Alimentação.";
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
    Number(value) +
      Number(
        allValues[`refeicao__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
      ) >
      maxFrequenciaAlimentacao &&
    inputName.includes("refeicao")
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Refeição na planilha de Alimentação.";
  } else if (
    value &&
    Number(value) +
      Number(
        allValues[`lanche__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
      ) >
      maxFrequenciaAlimentacao &&
    (inputName.includes("lanche_4h") || inputName.includes("lanche"))
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
  }
  if (ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola)) {
    return validaFrequenciaDietasCEUGESTAO(
      location,
      categoria,
      dia,
      value,
      rowName,
      medicaoUuid,
      maxDietasAutorizadas
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
  validacaoSemana
) => {
  const maxNumeroAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`]
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`]
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
  dadosValoresInclusoesAutorizadasState
) => {
  return (
    `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
      dadosValoresInclusoesAutorizadasState &&
    Number(
      formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ]
    ) >
      Number(
        dadosValoresInclusoesAutorizadasState[
          `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
        ]
      ) &&
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
  suspensoesAutorizadas
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    (!["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0) &&
    suspensoesAutorizadas &&
    suspensoesAutorizadas.filter(
      (suspensao) =>
        suspensao.dia === column.dia &&
        suspensao.alimentacoes.includes(row.name)
    ).length > 0
  );
};

export const exibirTooltipRPLAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    (!["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0) &&
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("RPL")
    ).length > 0 &&
    row.name.includes("refeicao") &&
    !row.name.includes("repeticao")
  );
};

export const exibirTooltipLPRAutorizadas = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    (!["Mês anterior", "Mês posterior"].includes(value) || Number(value) > 0) &&
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) =>
        alteracao.dia === column.dia && alteracao.motivo.includes("LPR")
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
  kitLanchesAutorizadas
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
        }, 0) > 0)
  );
};

export const exibirTooltipKitLancheSolAlimentacoes = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  kitLanchesAutorizadas
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    kitLanchesAutorizadas.filter((kit) => kit.dia === column.dia).length ===
      0 &&
    row.name.includes("kit_lanche")
  );
};

export const exibirTooltipQtdLancheEmergencialDiferenteSolAlimentacoesAutorizadas =
  (
    formValuesAtualizados,
    row,
    column,
    categoria,
    alteracoesAlimentacaoAutorizadas
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
  alteracoesAlimentacaoAutorizadas
) => {
  const value =
    formValuesAtualizados[
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
      (alteracao) => alteracao.dia === column.dia
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
  validacaoDiaLetivo
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    !value &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    categoria.nome.includes("SOLICITAÇÕES") &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    row.name.includes("lanche_emergencial") &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === column.dia
    ).length > 0 &&
    validacaoDiaLetivo(column.dia)
  );
};

export const exibirTooltipLancheEmergencialZeroAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  alteracoesAlimentacaoAutorizadas,
  validacaoDiaLetivo
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
      (alteracao) => alteracao.dia === column.dia
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
  validacaoDiaLetivo
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
      (alteracao) => alteracao.dia === column.dia
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
  ehGrupoETECUrlParam
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
  inclusoesEtecAutorizadas
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
      row.name.includes("repeticao_sobremesa")) &&
    inclusoesEtecAutorizadas
      .filter((inc) => inc.dia === column.dia)[0]
      .alimentacoes.includes("lanche_emergencial")
  );
};

export const exibirTooltipRepeticao = (
  formValuesAtualizados,
  row,
  column,
  categoria
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

  return (
    value &&
    Number(value) > 0 &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    ((row.name.includes("repeticao_refeicao") &&
      (!maxRefeicao ||
        (Number(maxRefeicao) && Number(value) > Number(maxRefeicao)))) ||
      (row.name.includes("repeticao_sobremesa") &&
        (!maxSobremesa ||
          (Number(maxSobremesa) && Number(value) > Number(maxSobremesa)))))
  );
};
