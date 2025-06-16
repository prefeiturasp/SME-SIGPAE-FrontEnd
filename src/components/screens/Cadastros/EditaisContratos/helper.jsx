export const normalizaLabelValueDRE = (response) => {
  let dres = response.results.map((elemento) => {
    return {
      label: elemento.nome,
      value: elemento.uuid,
      uuid: elemento.uuid,
    };
  });
  return dres;
};

export const normalizaLabelValueLote = (response) => {
  let lotes = response.map((elemento) => {
    return {
      label: elemento.nome,
      value: elemento.uuid,
      uuid: elemento.uuid,
    };
  });
  return lotes;
};

export const normalizaLabelValueEmpresa = (response) => {
  let empresas = response.map((empresa) => {
    return {
      label: empresa.nome_fantasia,
      value: empresa.uuid,
      uuid: empresa.uuid,
    };
  });
  return empresas;
};

export const normalizaLabelValueEmpresaSocial = (response) => {
  let empresas = response.map((empresa) => {
    return {
      label: empresa.razao_social,
      value: empresa.uuid,
      uuid: empresa.uuid,
    };
  });
  return empresas;
};

export const renderizarLabelLote = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione um ou mais lotes...";
  }
  if (selected.length === options.length) {
    return "Todos os lotes foram selecionados";
  }
  if (selected.length === 1) {
    return `${selected.length} lote selecionado`;
  }
  return `${selected.length} lotes selecionados`;
};

export const renderizarLabelDiretoria = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione uma ou mais diretorias ...";
  }
  if (selected.length === options.length) {
    return "Todas as diretorias foram selecionadas";
  }
  if (selected.length === 1) {
    return `${selected.length} diretoria selecionada`;
  }
  return `${selected.length} diretorias selecionadas`;
};

export const renderizarLabelEmpresa = (selected, options) => {
  if (selected.length === 0) {
    return "Selecione uma ou mais empresas ...";
  }
  if (selected.length === options.length) {
    return "Todas as empresas foram selecionadas";
  }
  if (selected.length === 1) {
    return `${selected.length} empresa selecionada`;
  }
  return `${selected.length} empresas selecionadas`;
};

export const montaEstadoEditais = (response) => {
  let editais = response.data.results.map((edital) => {
    return {
      ativo: false,
      uuid: edital.uuid,
      tipo_contratacao: edital.tipo_contratacao,
      edital_numero: edital.numero,
      processo_administrativo: edital.processo,
      resumo: edital.objeto,
      contratos: edital.contratos,
    };
  });
  return editais;
};
