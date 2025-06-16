export const formatarEscolasParaMultiselect = (lista) => {
  return lista.map((element) => {
    return {
      value: element.uuid,
      label: `${element.codigo_eol} - ${element.nome} - ${
        element.lote ? element.lote.nome : ""
      }`,
    };
  });
};

export const renderizarLabelEscola = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione algumas escolas...";
  }
  if (selected.length === options.length) {
    return "Todas as escolas foram selecionadas";
  }
  if (selected.length === 1) {
    return `${selected.length} escola selecionada`;
  }
  return `${selected.length} escolas selecionadas`;
};

export const renderizarLabelSubprefeitura = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione algumas subprefeituras...";
  }
  if (selected.length === options.length) {
    return "Todas as subprefeituras foram selecionadas";
  }
  if (selected.length === 1) {
    return `${selected.length} subprefeitura selecionada`;
  }
  return `${selected.length} subprefeituras selecionadas`;
};
