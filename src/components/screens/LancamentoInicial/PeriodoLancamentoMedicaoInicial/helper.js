export const formatarPayloadPeriodoLancamento = (
  values,
  tabelaAlimentacaoRows,
  tabelaDietaEnteralRows,
  dadosIniciaisFiltered,
  diasDaSemanaSelecionada
) => {
  if (values["periodo_escolar"].includes(" - ")) {
    values["grupo"] = values["periodo_escolar"].split(" - ")[0];
    values["periodo_escolar"] = values["periodo_escolar"].split(" - ")[1];
  }
  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValues = valuesAsArray.filter(([key]) =>
    key.includes("categoria")
  );
  let valoresMedicao = [];

  dadosIniciaisFiltered.forEach(([keyDado]) => {
    if (
      arrayCategoriesValues.filter(([key]) => key.includes(keyDado)).length ===
      0
    ) {
      arrayCategoriesValues.push([keyDado, -1]);
    }
  });

  arrayCategoriesValues.map(arr => {
    const keySplitted = arr[0].split("__");
    const categoria = keySplitted.pop();
    const idCategoria = categoria.match(/\d/g).join("");
    const dia = keySplitted[1].match(/\d/g).join("");
    const nome_campo = keySplitted[0];
    let tipoAlimentacao = tabelaAlimentacaoRows.find(
      alimentacao => alimentacao.name === nome_campo
    );

    if (!tipoAlimentacao) {
      tipoAlimentacao = tabelaDietaEnteralRows.find(
        row => row.name === nome_campo
      );
    }

    return valoresMedicao.push({
      dia: dia,
      valor: ["<p></p>\n", ""].includes(arr[1]) ? 0 : arr[1],
      nome_campo: nome_campo,
      categoria_medicao: idCategoria,
      tipo_alimentacao: tipoAlimentacao.uuid || ""
    });
  });

  valoresMedicao = valoresMedicao.filter(valorMed => {
    return (
      !(valorMed.nome_campo === "observacoes" && valorMed.valor === 0) &&
      diasDaSemanaSelecionada.includes(valorMed.dia)
    );
  });

  Object.entries(values).forEach(([key]) => {
    return key.includes("categoria") && delete values[key];
  });

  return { ...values, valores_medicao: valoresMedicao };
};

export const deveExistirObservacao = (
  categoria,
  values,
  calendarioMesConsiderado
) => {
  let diasNaoLetivos = [];
  const objDiasNaoLetivos = calendarioMesConsiderado.filter(
    obj => !obj.dia_letivo
  );
  objDiasNaoLetivos.map(obj => diasNaoLetivos.push(obj.dia));

  const valuesAsArray = Object.entries(values);
  const arrayCategoriesValuesDiasNaoletivos = valuesAsArray.filter(
    ([key, value]) =>
      key.includes("categoria") &&
      !key.includes("matriculados") &&
      !key.includes("dietas_autorizadas") &&
      !key.includes("frequencia") &&
      !key.includes("observacoes") &&
      !["Mês anterior", "Mês posterior", null].includes(value) &&
      diasNaoLetivos.some(dia => key.includes(dia))
  );
  let dias = [];
  arrayCategoriesValuesDiasNaoletivos.forEach(arr => {
    const keySplitted = arr[0].split("__");
    const dia = keySplitted[1].match(/\d/g).join("");
    dias.push(dia);
  });

  return !dias.every(
    dia =>
      values[`observacoes__dia_${dia}__categoria_${categoria}`] !== undefined
  );
};

export const valorZeroFrequencia = (
  value,
  rowName,
  categoria,
  dia,
  form,
  tabelaAlimentacaoRows,
  tabelaDietaRows,
  tabelaDietaEnteralRows,
  dadosValoresInclusoesAutorizadasState,
  validacaoDiaLetivo
) => {
  if (rowName === "frequencia" && value && Number(value) === 0) {
    let linhasDaTabela = null;
    if (categoria.nome.includes("ENTERAL")) {
      linhasDaTabela = tabelaDietaEnteralRows;
    } else if (categoria.nome.includes("DIETA")) {
      linhasDaTabela = tabelaDietaRows;
    } else {
      linhasDaTabela = tabelaAlimentacaoRows;
      if (
        Object.keys(dadosValoresInclusoesAutorizadasState).some(key =>
          String(key).includes(`__dia_${dia}__categoria_${categoria.id}`)
        ) &&
        !validacaoDiaLetivo(dia)
      ) {
        linhasDaTabela = linhasDaTabela.filter(linha =>
          Object.keys(
            Object.fromEntries(
              Object.entries(dadosValoresInclusoesAutorizadasState).filter(
                ([key]) => key.includes(dia)
              )
            )
          ).some(key => key.includes(linha.name))
        );
      }
    }

    linhasDaTabela.forEach(linha => {
      ![
        "matriculados",
        "frequencia",
        "observacoes",
        "dietas_autorizadas"
      ].includes(linha.name) &&
        form.change(
          `${linha.name}__dia_${dia}__categoria_${categoria.id}`,
          "0"
        );
    });
    return true;
  }
  return;
};
