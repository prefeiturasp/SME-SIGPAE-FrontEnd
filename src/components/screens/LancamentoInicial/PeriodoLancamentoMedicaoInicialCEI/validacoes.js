import { deepCopy } from "helpers/utilities";

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

const campoComInclusaoSemObservacaoCEI = (
  column,
  categoria,
  inclusoesAutorizadas,
  value
) => {
  const diasSoliciacoes = inclusoesAutorizadas.filter(
    (inclusao) =>
      String(inclusao.dia) === column.dia && categoria.nome === "ALIMENTAÇÃO"
  );
  if (diasSoliciacoes.length > 0 && !value) return true;
  return false;
};

export const campoDietaComInclusaoAutorizadaSemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  inclusoesAutorizadas,
  logQtdDietasAutorizadasCEI
) => {
  let erro = false;
  let uuidFaixasDietas = [];
  logQtdDietasAutorizadasCEI &&
    logQtdDietasAutorizadasCEI.forEach(
      (log) =>
        !uuidFaixasDietas.find((faixa) => faixa === log.faixa_etaria.uuid) &&
        uuidFaixasDietas.push(log.faixa_etaria.uuid)
    );
  if (
    categoria.nome !== "ALIMENTAÇÃO" &&
    inclusoesAutorizadas &&
    inclusoesAutorizadas.some(
      (inclusao) => parseInt(column.dia) === parseInt(inclusao.dia)
    ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  ) {
    uuidFaixasDietas.forEach((uuidFaixa) => {
      if (
        Number(
          formValuesAtualizados[
            `dietas_autorizadas__faixa_${uuidFaixa}__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) > 0 &&
        !formValuesAtualizados[
          `frequencia__faixa_${uuidFaixa}__dia_${column.dia}__categoria_${categoria.id}`
        ]
      ) {
        erro = true;
      }
    });
  }
  return erro;
};

export const campoComInclusaoAutorizadaValorZeroESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  inclusoesAutorizadas,
  ehProgramasEProjetosLocation
) => {
  let erro = false;
  if (
    !ehProgramasEProjetosLocation &&
    categoria.nome === "ALIMENTAÇÃO" &&
    inclusoesAutorizadas &&
    inclusoesAutorizadas.some(
      (inclusao) => column.dia === String(inclusao.dia)
    ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ] &&
    ((formValuesAtualizados[
      `frequencia__dia_${column.dia}__categoria_${categoria.id}`
    ] !== null &&
      Number(
        formValuesAtualizados[
          `frequencia__dia_${column.dia}__categoria_${categoria.id}`
        ]
      ) === 0) ||
      (formValuesAtualizados[
        `lanche__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `lanche__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) === 0) ||
      (formValuesAtualizados[
        `lanche_4h__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `lanche_4h__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) === 0) ||
      (formValuesAtualizados[
        `refeicao__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `refeicao__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) === 0) ||
      (formValuesAtualizados[
        `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) === 0))
  ) {
    erro = true;
  }
  return erro;
};

export const exibirTooltipErroQtdMaiorQueAutorizado = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  inclusoesAutorizadas,
  ehProgramasEProjetosLocation = false
) => {
  return (
    !ehProgramasEProjetosLocation &&
    row.name !== "matriculados" &&
    inclusoesAutorizadas &&
    inclusoesAutorizadas.some(
      (inclusao) => column.dia === String(inclusao.dia)
    ) &&
    Number(
      formValuesAtualizados[
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
      ]
    ) >
      Number(
        inclusoesAutorizadas.find(
          (inclusao) => column.dia === String(inclusao.dia)
        ).numero_alunos
      ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const botaoAdicionarObrigatorioTabelaAlimentacao = (
  column,
  categoria,
  inclusoesAutorizadas,
  value
) => {
  return campoComInclusaoSemObservacaoCEI(
    column,
    categoria,
    inclusoesAutorizadas,
    value
  );
};

export const botaoAdicionarObrigatorio = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location
) => {
  return repeticaoSobremesaDoceComValorESemObservacao(
    values,
    dia,
    categoria,
    diasSobremesaDoce,
    location
  );
};

export const validarFormulario = (
  values,
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

  return erro;
};

export const validacoesTabelaAlimentacaoCEI = (
  rowName,
  dia,
  categoria,
  allValues,
  uuidFaixaEtaria
) => {
  const maxMatriculados = Number(
    allValues[
      `matriculados__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`
    ]
  );
  const inputName = `${rowName}__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`;

  if (
    rowName === "frequencia" &&
    Number(allValues[inputName]) > Number(maxMatriculados)
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos matriculados no período.";
  }

  return undefined;
};

export const validacoesTabelaAlimentacaoEmeidaCemei = (
  rowName,
  dia,
  categoria,
  allValues,
  value,
  alteracoesAlimentacaoAutorizadas,
  inclusoesAutorizadas,
  validacaoDiaLetivo,
  ehProgramasEProjetosLocation
) => {
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`]
  );
  const maxMatriculados = Number(
    allValues[`matriculados__dia_${dia}__categoria_${categoria}`]
  );
  const maxNumeroDeAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`]
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  if (
    rowName === "frequencia" &&
    !allValues[`frequencia__dia_${dia}__categoria_${categoria}`] &&
    !validacaoDiaLetivo(dia) &&
    inclusoesAutorizadas.some((inclusao) => dia === String(inclusao.dia)) &&
    !ehProgramasEProjetosLocation
  ) {
    return "Há solicitação de alimentação autorizada para esta data. Insira o número de frequentes.";
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

  if (ehProgramasEProjetosLocation) {
    if (
      rowName === "frequencia" &&
      !allValues[`frequencia__dia_${dia}__categoria_${categoria}`] &&
      inclusoesAutorizadas.some((inclusao) => dia === String(inclusao.dia)) &&
      ehProgramasEProjetosLocation
    ) {
      return "Foi autorizada inclusão de alimentação contínua nesta data. Informe a frequência de alunos.";
    } else if (
      value &&
      Number(value) > maxNumeroDeAlunos &&
      inputName.includes("frequencia")
    ) {
      return "A quantidade de alunos frequentes não pode ser maior do que a quantidade em Número de Alunos.";
    } else if (
      !inputName.includes("numero_de_alunos") &&
      Number(allValues[inputName]) > Number(maxFrequencia)
    ) {
      return `Número apontado de alimentação é maior que número de alunos frequentes. Ajuste o apontamento. `;
    }
  } else if (
    rowName === "frequencia" &&
    Number(allValues[inputName]) > Number(maxMatriculados) &&
    !ehProgramasEProjetosLocation
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos matriculados no período.";
  } else if (
    value &&
    existeAlteracaoAlimentacaoRPL &&
    inputName.includes("lanche") &&
    !inputName.includes("emergencial") &&
    (!allValues[`refeicao__dia_${dia}__categoria_${categoria}`] ||
      Number(allValues[`refeicao__dia_${dia}__categoria_${categoria}`]) ===
        0) &&
    !ehProgramasEProjetosLocation
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
      Number(allValues[`lanche_4h__dia_${dia}__categoria_${categoria}`]) ===
        0) &&
    !ehProgramasEProjetosLocation
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
  }

  return undefined;
};

export const validacoesTabelasDietasCEI = (
  rowName,
  dia,
  categoria,
  allValues,
  uuidFaixaEtaria
) => {
  const maxDietasAutorizadas = Number(
    allValues[
      `dietas_autorizadas__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`
    ]
  );
  const inputName = `${rowName}__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`;

  if (
    rowName === "frequencia" &&
    Number(allValues[inputName]) > Number(maxDietasAutorizadas)
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos com dietas autorizadas.";
  }

  return undefined;
};

export const validacoesTabelasDietasEmeidaCemei = (
  rowName,
  dia,
  categoria,
  nomeCategoria,
  allValues,
  value,
  categoriasDeMedicao
) => {
  const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO")
  ).id;
  const maxFrequenciaAlimentacao = Number(
    allValues[`frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
  );
  const maxDietasAutorizadas = Number(
    allValues[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`]
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`]
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  if (
    value &&
    Number(value) > maxFrequencia &&
    (inputName.includes("lanche_4h") ||
      inputName.includes("lanche") ||
      inputName.includes("refeicao"))
  ) {
    return "A quantidade não pode ser maior do que a quantidade inserida em Frequência.";
  } else if (
    rowName === "frequencia" &&
    Number(allValues[inputName]) > Number(maxDietasAutorizadas)
  ) {
    return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos com dietas autorizadas.";
  } else if (
    value &&
    Number(value) > 0 &&
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
    Number(value) !== 0 &&
    ((Number(value) +
      Number(
        allValues[`lanche__dia_${dia}__categoria_${idCategoriaAlimentacao}`]
      ) >
      maxFrequenciaAlimentacao &&
      rowName === "lanche") ||
      (Number(value) +
        Number(
          allValues[
            `lanche_4h__dia_${dia}__categoria_${idCategoriaAlimentacao}`
          ]
        ) >
        maxFrequenciaAlimentacao &&
        rowName === "lanche_4h"))
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Lanche na planilha de Alimentação.";
  }

  return undefined;
};

export const exibirTooltipDietasInclusaoDiaNaoLetivoCEI = (
  inclusoesAutorizadas,
  row,
  column,
  categoria,
  formValuesAtualizados
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  const numDietas =
    formValuesAtualizados[
      `dietas_autorizadas__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    categoria.nome !== "ALIMENTAÇÃO" &&
    row.name === "frequencia" &&
    Number(numDietas) > 0 &&
    !value &&
    inclusoesAutorizadas.some(
      (inclusao) => parseInt(inclusao.dia) === parseInt(column.dia)
    ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const campoAlimentacoesAutorizadasDiaNaoLetivoCEINaoPreenchidoESemObservacao =
  (inclusoesAutorizadas, column, categoria, formValuesAtualizados) => {
    if (
      !inclusoesAutorizadas ||
      inclusoesAutorizadas.length === 0 ||
      !inclusoesAutorizadas.find(
        (inclusao) => parseInt(inclusao.dia) === parseInt(column.dia)
      )
    ) {
      return false;
    }

    let campoNaoPreenchido = false;
    inclusoesAutorizadas.forEach((inclusao) => {
      inclusao.faixas_etarias?.forEach((faixa) => {
        if (
          Number(
            formValuesAtualizados[
              `matriculados__faixa_${faixa}__dia_${column.dia}__categoria_${categoria.id}`
            ]
          ) > 0 &&
          !formValuesAtualizados[
            `frequencia__faixa_${faixa}__dia_${column.dia}__categoria_${categoria.id}`
          ]
        ) {
          campoNaoPreenchido = true;
        }
      });
    });

    return (
      categoria.nome === "ALIMENTAÇÃO" &&
      campoNaoPreenchido &&
      !formValuesAtualizados[
        `observacoes__dia_${column.dia}__categoria_${categoria.id}`
      ]
    );
  };

export const exibirTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI = (
  inclusoesAutorizadas,
  row,
  column,
  categoria,
  formValuesAtualizados
) => {
  const value =
    formValuesAtualizados[
      `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];
  const matriculadosFaixaDia =
    formValuesAtualizados[
      `matriculados__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    categoria.nome === "ALIMENTAÇÃO" &&
    row.name === "frequencia" &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    !value &&
    matriculadosFaixaDia &&
    inclusoesAutorizadas.some(
      (inclusao) =>
        parseInt(inclusao.dia) === parseInt(column.dia) &&
        inclusao.faixas_etarias.includes(row.uuid)
    ) &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const exibirTooltipSuspensoesAutorizadasCEI = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  suspensoesAutorizadas
) => {
  const maxMatriculados = Number(
    formValuesAtualizados[
      `matriculados__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
  const value =
    formValuesAtualizados[
      `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    value &&
    Number(value) > 0 &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    Number(value) <= maxMatriculados &&
    row.name === "frequencia" &&
    categoria.nome === "ALIMENTAÇÃO" &&
    suspensoesAutorizadas &&
    suspensoesAutorizadas.filter((suspensao) => suspensao.dia === column.dia)
      .length > 0 &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

export const frequenciaComSuspensaoAutorizadaPreenchidaESemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  suspensoesAutorizadas,
  categoriasDeMedicao
) => {
  if (!Array.isArray(categoriasDeMedicao)) return false;

  const categoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO")
  );

  const frequenciasMesmoDia = Object.fromEntries(
    Object.entries(formValuesAtualizados).filter(
      ([key, value]) =>
        key.includes("frequencia") &&
        key.includes(
          `__dia_${column.dia}__categoria_${categoriaAlimentacao.id}`
        ) &&
        !["Mês anterior", "Mês posterior", null].includes(value)
    )
  );

  return (
    Object.values(frequenciasMesmoDia).reduce((a, b) => a + b, 0) > 0 &&
    categoria.nome === "ALIMENTAÇÃO" &&
    suspensoesAutorizadas &&
    suspensoesAutorizadas.filter((suspensao) => suspensao.dia === column.dia)
      .length > 0 &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};
