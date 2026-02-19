import { deepCopy } from "src/helpers/utilities";
import { format } from "date-fns";

/**
 * Verifica se deve exibir um tooltip de alerta quando há frequência de dieta registrada
 * mas a frequência de alimentação está zerada para todas as faixas etárias de uma determinada coluna (dia)
 * e não há observação justificando.
 *
 * Esta validação garante que quando há alunos com dieta especial registrados em um dia,
 * mas a frequência geral de alimentação está em zero, uma observação explicativa seja obrigatória.
 *
 * @param {Object} formValuesAtualizados - Objeto contendo todos os valores atualizados do formulário
 * @param {Object} row - Objeto representando a linha atual da tabela
 * @param {string} row.name - Nome do campo da linha (ex: "frequencia", "dietas_autorizadas")
 * @param {string} row.uuid - Identificador único da faixa etária da linha
 * @param {Object} column - Objeto representando a coluna atual da tabela
 * @param {string} column.dia - Dia do mês correspondente à coluna
 * @param {Object} categoria - Objeto da categoria de medição atual
 * @param {number} categoria.id - Identificador da categoria
 * @param {string} categoria.nome - Nome da categoria (deve incluir "DIETA" para ativar validação)
 * @param {Array<Object>} categoriasDeMedicao - Array com todas as categorias de medição disponíveis
 * @param {Array<Object>} faixasEtarias - Array com todas as faixas etárias
 * @param {string} faixasEtarias[].uuid - Identificador único de cada faixa etária
 *
 * @returns {boolean} `true` se o tooltip de alerta deve ser exibido, `false` caso contrário
 *
 * @description
 * O tooltip é exibido quando TODAS as seguintes condições são atendidas:
 * - Existe um valor preenchido no campo atual
 * - O valor não é "Mês anterior" nem "Mês posterior"
 * - O valor preenchido é diferente de zero
 * - A categoria atual é de DIETA
 * - A soma das frequências de alimentação de todas as faixas etárias é zero
 * - O campo não é "dietas_autorizadas"
 * - Não existe observação registrada para o dia/categoria
 *
 * // Retorna true se há dieta registrada mas alimentação zerada sem observação
 */
export const exibirTooltipFrequenciaAlimentacaoZeroESemObservacaoCEI = (
  formValuesAtualizados,
  row,
  column,
  categoria,
  categoriasDeMedicao,
  faixasEtarias,
) => {
  if (!faixasEtarias || faixasEtarias.length === 0) return false;
  const categoriaAlimentacao = categoriasDeMedicao.find((c) =>
    c.nome.includes("ALIMENTAÇÃO"),
  );
  let sumFrequenciasAlimentacao = 0;
  for (const faixa of faixasEtarias) {
    if (
      Number(
        formValuesAtualizados[
          `matriculados__faixa_${faixa.uuid}__dia_${column.dia}__categoria_${categoriaAlimentacao.id}`
        ],
      ) > 0
    ) {
      sumFrequenciasAlimentacao += Number(
        formValuesAtualizados[
          `frequencia__faixa_${faixa.uuid}__dia_${column.dia}__categoria_${categoriaAlimentacao.id}`
        ] ?? 1,
      );
    }
  }

  const value =
    formValuesAtualizados[
      `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ];

  return (
    !!value &&
    !["Mês anterior", "Mês posterior"].includes(value) &&
    Number(value) !== 0 &&
    categoria.nome.includes("DIETA") &&
    sumFrequenciasAlimentacao === 0 &&
    row.name !== "dietas_autorizadas" &&
    !formValuesAtualizados[
      `observacoes__dia_${column.dia}__categoria_${categoria.id}`
    ]
  );
};

/**
 * Esta função verifica se existem alunos com dieta especial frequentes em um dia onde
 * a frequência de alimentação geral está zerada, sem uma observação que justifique essa situação.
 *
 * @param {Object} values - Objeto contendo todos os valores do formulário
 * @param {string} dia - Dia do mês a ser validado (formato: "01", "02", etc.)
 * @param {Object} categoria - Objeto da categoria de medição atual (categoria de dieta)
 * @param {number} categoria.id - Identificador da categoria
 * @param {string} categoria.nome - Nome da categoria (deve incluir "DIETA" para ativar validação)
 * @param {Array<Object>} categorias - Array com todas as categorias de medição disponíveis
 * @param {string} categorias[].nome - Nome da categoria (ex: "ALIMENTAÇÃO")
 * @param {number} categorias[].id - Identificador da categoria
 * @param {Array<Object>} faixasEtarias - Array com todas as faixas etárias
 * @param {string} faixasEtarias[].uuid - Identificador único de cada faixa etária
 *
 * @returns {boolean} `true` se há erro (dietas com frequência mas alimentação zerada sem observação), `false` caso contrário
 *
 * @description
 * A função executa a seguinte lógica:
 * 1. Calcula a soma das frequências de alimentação geral (para faixas com matriculados > 0)
 * 2. Calcula a soma das frequências de dietas (para faixas com dietas autorizadas > 0)
 * 3. Retorna `true` quando TODAS as condições abaixo são atendidas:
 *    - A categoria atual é de DIETA
 *    - A soma das frequências de alimentação geral é zero
 *    - A soma das frequências de dietas é maior que zero
 *    - Não existe observação registrada para o dia/categoria
 *
 */
export const alimentacoesFrequenciaZeroESemObservacaoCEI = (
  values,
  dia,
  categoria,
  categorias,
  faixasEtarias,
) => {
  if (!faixasEtarias || faixasEtarias.length === 0) return false;
  const categoriaAlimentacao = categorias.find(
    (cat) => cat.nome === "ALIMENTAÇÃO",
  );

  if (!categoriaAlimentacao) return false;

  let sumFrequenciasAlimentacao = 0;
  for (const faixa of faixasEtarias) {
    if (
      Number(
        values[
          `matriculados__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoriaAlimentacao.id}`
        ],
      ) > 0
    ) {
      sumFrequenciasAlimentacao += Number(
        values[
          `frequencia__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoriaAlimentacao.id}`
        ] ?? 1,
      );
    }
  }

  let sumFrequenciasAlimentacaoDietas = 0;
  for (const faixa of faixasEtarias) {
    if (
      Number(
        values[
          `dietas_autorizadas__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoria.id}`
        ],
      ) > 0
    ) {
      sumFrequenciasAlimentacaoDietas += Number(
        values[
          `frequencia__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoria.id}`
        ] ?? 0,
      );
    }
  }

  return (
    categoria.nome.includes("DIETA") &&
    sumFrequenciasAlimentacao === 0 &&
    sumFrequenciasAlimentacaoDietas > 0 &&
    !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]
  );
};

export const repeticaoSobremesaDoceComValorESemObservacao = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  return (
    (values[`repeticao_sobremesa__dia_${dia}__categoria_${categoria.id}`] ||
      values[`repeticao_2_sobremesa__dia_${dia}__categoria_${categoria.id}`]) &&
    !values[`observacoes__dia_${dia}__categoria_${categoria.id}`] &&
    diasSobremesaDoce.includes(
      `${new Date(location.state.mesAnoSelecionado).getFullYear()}-${(
        new Date(location.state.mesAnoSelecionado).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dia}`,
    )
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

const campoComInclusaoSemObservacaoCEI = (
  column,
  categoria,
  inclusoesAutorizadas,
  value,
) => {
  const diasSoliciacoes = inclusoesAutorizadas.filter(
    (inclusao) =>
      String(inclusao.dia) === column.dia && categoria.nome === "ALIMENTAÇÃO",
  );
  if (diasSoliciacoes.length > 0 && !value) return true;
  return false;
};

export const campoDietaComInclusaoAutorizadaSemObservacao = (
  formValuesAtualizados,
  column,
  categoria,
  inclusoesAutorizadas,
  logQtdDietasAutorizadasCEI,
) => {
  let erro = false;
  let uuidFaixasDietas = [];
  logQtdDietasAutorizadasCEI &&
    logQtdDietasAutorizadasCEI.forEach(
      (log) =>
        !uuidFaixasDietas.find((faixa) => faixa === log.faixa_etaria.uuid) &&
        uuidFaixasDietas.push(log.faixa_etaria.uuid),
    );
  if (
    categoria.nome !== "ALIMENTAÇÃO" &&
    inclusoesAutorizadas &&
    inclusoesAutorizadas.some(
      (inclusao) => parseInt(column.dia) === parseInt(inclusao.dia),
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
          ],
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
  ehProgramasEProjetosLocation,
) => {
  let erro = false;
  if (
    !ehProgramasEProjetosLocation &&
    categoria.nome === "ALIMENTAÇÃO" &&
    inclusoesAutorizadas &&
    inclusoesAutorizadas.some(
      (inclusao) => column.dia === String(inclusao.dia),
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
        ],
      ) === 0) ||
      (formValuesAtualizados[
        `lanche__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `lanche__dia_${column.dia}__categoria_${categoria.id}`
          ],
        ) === 0) ||
      (formValuesAtualizados[
        `lanche_4h__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `lanche_4h__dia_${column.dia}__categoria_${categoria.id}`
          ],
        ) === 0) ||
      (formValuesAtualizados[
        `refeicao__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `refeicao__dia_${column.dia}__categoria_${categoria.id}`
          ],
        ) === 0) ||
      (formValuesAtualizados[
        `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
      ] !== null &&
        Number(
          formValuesAtualizados[
            `sobremesa__dia_${column.dia}__categoria_${categoria.id}`
          ],
        ) === 0))
  ) {
    erro = true;
  }
  return erro;
};

export const botaoAdicionarObrigatorioTabelaAlimentacao = (
  column,
  categoria,
  inclusoesAutorizadas,
  value,
) => {
  return campoComInclusaoSemObservacaoCEI(
    column,
    categoria,
    inclusoesAutorizadas,
    value,
  );
};

export const botaoAdicionarObrigatorio = (
  values,
  dia,
  categoria,
  diasSobremesaDoce,
  location,
) => {
  return repeticaoSobremesaDoceComValorESemObservacao(
    values,
    dia,
    categoria,
    diasSobremesaDoce,
    location,
  );
};

export const validarFormulario = (
  values,
  location,
  categoriasDeMedicao,
  dadosValoresInclusoesAutorizadasState,
  weekColumns,
) => {
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

  return erro;
};

export const validacoesTabelaAlimentacaoCEI = (
  rowName,
  dia,
  categoria,
  allValues,
  uuidFaixaEtaria,
) => {
  const maxMatriculados = Number(
    allValues[
      `matriculados__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`
    ],
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

export const validacoesTabelaAlimentacaoCEIRecreioNasFerias = (
  rowName,
  dia,
  categoria,
  allValues,
  uuidFaixaEtaria,
  faixaEtaria,
) => {
  if (rowName !== "frequencia") {
    return undefined;
  }

  const keyMax = `participantes__faixa_null__dia_${dia}__categoria_${categoria}`;
  const maxMatriculados = Number(allValues[keyMax]);

  if (!Number.isFinite(maxMatriculados)) {
    return undefined;
  }

  const suffixDiaCategoria = `__dia_${dia}__categoria_${categoria}`;

  const uuidsPreenchidos = faixaEtaria
    .map((f) => f.uuid)
    .filter((uuid) => {
      const valor = allValues[`frequencia__faixa_${uuid}${suffixDiaCategoria}`];
      return valor !== null && valor !== "" && !isNaN(Number(valor));
    });

  const totalFrequenciaNoDia = uuidsPreenchidos.reduce((acc, uuid) => {
    const valor = Number(
      allValues[`frequencia__faixa_${uuid}${suffixDiaCategoria}`],
    );
    return acc + valor;
  }, 0);

  if (totalFrequenciaNoDia > maxMatriculados) {
    const ultimoUuidComValor = uuidsPreenchidos[uuidsPreenchidos.length - 1];

    if (uuidFaixaEtaria === ultimoUuidComValor) {
      return "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos participantes no Recreio nas Férias.";
    }
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
  ehProgramasEProjetosLocation,
  dadosValoresInclusoesAutorizadasState,
  ehGrupoColaboradores,
) => {
  const prefixo = ehGrupoColaboradores ? "participantes" : "matriculados";

  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`],
  );
  const maxMatriculados = Number(
    allValues[`${prefixo}__dia_${dia}__categoria_${categoria}`],
  );
  const maxNumeroDeAlunos = Number(
    allValues[`numero_de_alunos__dia_${dia}__categoria_${categoria}`],
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  if (
    `${rowName}__dia_${dia}__categoria_${categoria}` in
      dadosValoresInclusoesAutorizadasState &&
    Number(allValues[`${rowName}__dia_${dia}__categoria_${categoria}`]) >
      Number(
        dadosValoresInclusoesAutorizadasState[
          `${rowName}__dia_${dia}__categoria_${categoria}`
        ],
      ) &&
    !allValues[`observacoes__dia_${dia}__categoria_${categoria}`]
  ) {
    return `Número de alimentações é maior que a quantidade autorizada (${Number(
      dadosValoresInclusoesAutorizadasState[
        `${rowName}__dia_${dia}__categoria_${categoria}`
      ],
    )}). Corrija o apontamento.`;
  } else if (
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
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("RPL"),
    ).length > 0;

  const existeAlteracaoAlimentacaoLPR =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("LPR"),
    ).length > 0;

  if (ehProgramasEProjetosLocation) {
    if (
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
    const mensagemPadrao =
      "A quantidade de alunos frequentes não pode ser maior do que a quantidade de alunos matriculados no período.";
    return ehGrupoColaboradores
      ? "A frequência não pode ser maior do que o número de Participantes"
      : mensagemPadrao;
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
    const nome = ehGrupoColaboradores ? "participantes" : "alunos";
    return `Lançamento maior que a frequência de ${nome} no dia.`;
  }

  return undefined;
};

export const validacoesTabelasDietasCEI = (
  rowName,
  dia,
  categoria,
  allValues,
  uuidFaixaEtaria,
) => {
  const maxDietasAutorizadas = Number(
    allValues[
      `dietas_autorizadas__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${categoria}`
    ],
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
  categoriasDeMedicao,
  alteracoesAlimentacaoAutorizadas,
) => {
  const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO"),
  ).id;
  const somaDosValoresPorCampo = (campo) =>
    categoriasDeMedicao.reduce((total, categoria) => {
      const valor = Number(
        allValues[`${campo}__dia_${dia}__categoria_${categoria.id}`],
      );
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);
  const existeAlteracaoAlimentacaoRPL =
    alteracoesAlimentacaoAutorizadas &&
    alteracoesAlimentacaoAutorizadas.filter(
      (alteracao) => alteracao.dia === dia && alteracao.motivo.includes("RPL"),
    ).length > 0;
  const maxFrequenciaAlimentacao = Number(
    allValues[`frequencia__dia_${dia}__categoria_${idCategoriaAlimentacao}`],
  );
  const maxDietasAutorizadas = Number(
    allValues[`dietas_autorizadas__dia_${dia}__categoria_${categoria}`],
  );
  const maxFrequencia = Number(
    allValues[`frequencia__dia_${dia}__categoria_${categoria}`],
  );
  const inputName = `${rowName}__dia_${dia}__categoria_${categoria}`;

  if (
    value &&
    Number(value) > maxFrequencia &&
    (((inputName.includes("lanche_4h") || inputName.includes("lanche")) &&
      !existeAlteracaoAlimentacaoRPL) ||
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
    !existeAlteracaoAlimentacaoRPL &&
    somaDosValoresPorCampo("refeicao") > maxFrequenciaAlimentacao &&
    inputName.includes("refeicao")
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Refeição na planilha de Alimentação.";
  } else if (
    value &&
    Number(value) !== 0 &&
    ((somaDosValoresPorCampo("lanche") >
      (existeAlteracaoAlimentacaoRPL
        ? maxFrequenciaAlimentacao * 2
        : maxFrequenciaAlimentacao) &&
      rowName === "lanche") ||
      (somaDosValoresPorCampo("lanche_4h") >
        (existeAlteracaoAlimentacaoRPL
          ? maxFrequenciaAlimentacao * 2
          : maxFrequenciaAlimentacao) &&
        rowName === "lanche_4h"))
  ) {
    return "O número máximo de alimentações foi excedido. É preciso subtrair o aluno com Dieta Especial Autorizada do apontamento de Lanche na planilha de Alimentação.";
  } else if (
    value &&
    existeAlteracaoAlimentacaoRPL &&
    inputName.includes("lanche") &&
    !inputName.includes("emergencial") &&
    (!allValues[`refeicao__dia_${dia}__categoria_${categoria}`] ||
      Number(allValues[`refeicao__dia_${dia}__categoria_${categoria}`]) === 0)
  ) {
    if (Number(value) > 2 * maxFrequencia) {
      return "Lançamento maior que 2x a frequência de alunos desta dieta no dia.";
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

export const exibirTooltipDietasInclusaoDiaNaoLetivoCEI = (
  inclusoesAutorizadas,
  row,
  column,
  categoria,
  formValuesAtualizados,
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
      (inclusao) => parseInt(inclusao.dia) === parseInt(column.dia),
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
        (inclusao) => parseInt(inclusao.dia) === parseInt(column.dia),
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
            ],
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
  formValuesAtualizados,
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
        inclusao.faixas_etarias.includes(row.uuid),
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
  suspensoesAutorizadas,
) => {
  const maxMatriculados = Number(
    formValuesAtualizados[
      `matriculados__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`
    ],
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
  categoriasDeMedicao,
) => {
  if (!Array.isArray(categoriasDeMedicao)) return false;

  const categoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
    categoria.nome.includes("ALIMENTAÇÃO"),
  );

  const frequenciasMesmoDia = Object.fromEntries(
    Object.entries(formValuesAtualizados).filter(
      ([key, value]) =>
        key.includes("frequencia") &&
        key.includes(
          `__dia_${column.dia}__categoria_${categoriaAlimentacao.id}`,
        ) &&
        !["Mês anterior", "Mês posterior", null].includes(value),
    ),
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

/**
 * Verifica se existe algum campo de dieta com valor maior que zero em dias onde
 * todas as frequências de alimentação das faixas etárias estão zeradas e sem observação registrada.
 *
 * Esta função percorre todos os dias da semana, faixas etárias e categorias de dieta,
 * validando se há inconsistências entre os lançamentos de dieta e a frequência
 * de alimentação. Utiliza o valor em tempo real (value_) para o campo sendo editado
 * e os valores salvos (formValuesAtualizados) para os demais campos.
 *
 * @param {Object} formValuesAtualizados - Objeto com todos os valores do formulário
 * @param {Array} categoriasDeMedicao - Lista de categorias de medição disponíveis
 * @param {Array} weekColumns - Colunas representando os dias da semana atual
 * @param {Array} faixasEtarias - Array com todas as faixas etárias
 * @param {string} faixasEtarias[].uuid - Identificador único de cada faixa etária
 * @param {Array} tabelaDietaCEIRows - Linhas da tabela de dieta comum CEI
 * @param {Array} tabelaDietaEnteralRows - Linhas da tabela de dieta enteral
 * @param {string|number} value_ - Valor em tempo real do campo sendo editado
 * @param {Object} currentRow - Row do campo sendo editado (opcional)
 * @param {string} currentRow.name - Nome do campo da linha
 * @param {string} currentRow.uuid - UUID da faixa etária
 * @param {Object} currentColumn - Column do campo sendo editado (opcional)
 * @param {string} currentColumn.dia - Dia do mês
 * @param {Object} currentCategoria - Categoria do campo sendo editado (opcional)
 * @param {number} currentCategoria.id - ID da categoria
 *
 * @returns {boolean} `true` se encontrar algum campo de dieta com valor > 0 quando frequências de alimentação estão zeradas e sem observação
 *
 * @description
 * A função executa a seguinte lógica para cada dia da semana:
 * 1. Calcula a soma das frequências de alimentação de todas as faixas etárias (somente as que têm matriculados > 0)
 * 2. Se a soma for diferente de zero, pula para o próximo dia
 * 3. Para cada categoria de dieta:
 *    - Se existe observação para o dia/categoria, pula para a próxima categoria
 *    - Para cada campo de dieta (frequencia, lanche, etc) em cada faixa etária:
 *      - Verifica se o campo tem valor > 0
 *      - Se o campo for o campo atual sendo editado, usa value_ (valor em tempo real)
 *      - Caso contrário, usa o valor de formValuesAtualizados
 *      - Retorna true se encontrar valor > 0
 */
export const existeAlgumCampoComFrequenciaAlimentacaoZeroESemObservacaoCEI = (
  formValuesAtualizados,
  categoriasDeMedicao,
  weekColumns,
  faixasEtarias,
  tabelaDietaCEIRows,
  tabelaDietaEnteralRows,
  value_,
  currentRow = null,
  currentColumn = null,
  currentCategoria = null,
) => {
  if (
    !formValuesAtualizados ||
    !categoriasDeMedicao ||
    !weekColumns ||
    !faixasEtarias
  ) {
    return false;
  }

  const categoriaAlimentacao = categoriasDeMedicao.find((c) =>
    c.nome.includes("ALIMENTAÇÃO"),
  );
  if (!categoriaAlimentacao) return false;

  const categoriasDieta = categoriasDeMedicao.filter((c) =>
    c.nome.includes("DIETA"),
  );

  if (!categoriaAlimentacao || !categoriasDieta.length) {
    return false;
  }

  const camposDieta = [
    ...(tabelaDietaCEIRows || []).filter(
      (row) => row.name !== "dietas_autorizadas",
    ),
    ...(tabelaDietaEnteralRows || []).filter(
      (row) => row.name !== "dietas_autorizadas",
    ),
  ];

  for (const column of weekColumns) {
    const dia = column.dia;

    let sumFrequenciasAlimentacao = 0;
    for (const faixa of faixasEtarias) {
      if (
        Number(
          formValuesAtualizados[
            `matriculados__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoriaAlimentacao.id}`
          ],
        ) > 0
      ) {
        sumFrequenciasAlimentacao += Number(
          formValuesAtualizados[
            `frequencia__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoriaAlimentacao.id}`
          ] ?? 1,
        );
      }
    }

    if (sumFrequenciasAlimentacao !== 0) {
      continue;
    }

    for (const categoriaDieta of categoriasDieta) {
      const temObservacao =
        formValuesAtualizados[
          `observacoes__dia_${dia}__categoria_${categoriaDieta.id}`
        ];

      if (temObservacao) {
        continue;
      }

      for (const campoDieta of camposDieta) {
        for (const faixa of faixasEtarias) {
          const ehCampoAtual =
            currentRow &&
            currentColumn &&
            currentCategoria &&
            currentRow.name === campoDieta.name &&
            currentRow.uuid === faixa.uuid &&
            currentColumn.dia === dia &&
            currentCategoria.id === categoriaDieta.id;

          const value = ehCampoAtual
            ? value_
            : formValuesAtualizados[
                `${campoDieta.name}__faixa_${faixa.uuid}__dia_${dia}__categoria_${categoriaDieta.id}`
              ];

          if (
            value &&
            !["Mês anterior", "Mês posterior"].includes(value) &&
            Number(value) > 0
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const verificarMesAnteriorOuPosterior = (column, mesAnoConsiderado) => {
  let result = null;
  const mesAtual = format(mesAnoConsiderado, "MM");
  const anoAtual = format(mesAnoConsiderado, "yyyy");
  if (column.mes !== mesAtual) {
    const dataColumn = new Date(`${column.ano}-${column.mes}-01`);
    const dataAtual = new Date(`${anoAtual}-${mesAtual}-01`);
    if (dataColumn < dataAtual) {
      result = "Mês anterior";
    } else if (dataColumn > dataAtual) {
      result = "Mês posterior";
    }
  }
  return result;
};
