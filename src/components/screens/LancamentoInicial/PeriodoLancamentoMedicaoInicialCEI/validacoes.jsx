import { deepCopy } from "src/helpers/utilities";
import { format } from "date-fns";
import {
  existeAlteracaoRPL,
  existeAlteracaoLPR,
} from "../PeriodoLancamentoMedicaoInicial/helper";

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
  alteracoesAlimentacaoAutorizadas = null,
) => {
  let erro = false;
  if (
    !ehProgramasEProjetosLocation &&
    !existeAlteracaoRPL(alteracoesAlimentacaoAutorizadas, column.dia) &&
    !existeAlteracaoLPR(alteracoesAlimentacaoAutorizadas, column.dia) &&
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
    !existeAlteracaoLPR(alteracoesAlimentacaoAutorizadas, dia) &&
    !existeAlteracaoRPL(alteracoesAlimentacaoAutorizadas, dia) &&
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
    existeAlteracaoRPL(alteracoesAlimentacaoAutorizadas, dia) &&
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
    existeAlteracaoLPR(alteracoesAlimentacaoAutorizadas, dia) &&
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
  const existeAlteracaoAlimentacaoRPL = existeAlteracaoRPL(
    alteracoesAlimentacaoAutorizadas,
    dia,
  );
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
