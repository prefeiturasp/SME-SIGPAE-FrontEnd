export const montaTipoUnidadeEscolar = (tiposUnidades) => {
  let unidadesEscolares = [{ nome: "Selecione a unidade", uuid: "" }];

  tiposUnidades &&
    tiposUnidades.forEach((tipoUnidade) => {
      unidadesEscolares.push({
        nome: tipoUnidade.iniciais,
        uuid: tipoUnidade.uuid,
      });
    });

  return unidadesEscolares;
};

export const adicionarComboVazio = (combosAtuaisTemp, uuidVinculo) => {
  if (combosAtuaisTemp.length === 0) {
    let combo = [];
    combo.push({
      label: "",
      tipos_alimentacao: [],
      vinculo: uuidVinculo,
      adicionar: true,
    });
    return combo;
  }
  return combosAtuaisTemp;
};

export const podeAdicionarElementoSubstituicao = (combo, alimentacao) => {
  let condicao = true;
  combo.tipos_alimentacao.forEach((tipo_alimentacao) => {
    if (tipo_alimentacao.uuid === alimentacao.uuid) {
      condicao = false;
    }
  });
  return condicao;
};

export const podeAdicionarElemento = (combo, alimentacao) => {
  let condicao = true;
  combo.tipos_alimentacao.forEach((tipo_alimentacao) => {
    if (tipo_alimentacao === alimentacao.uuid) {
      condicao = false;
    }
  });
  return condicao;
};

export const montaLabelCombo = (combo, nome) => {
  if (combo.label === "") {
    combo.label = combo.label.concat(nome);
  } else {
    combo.label = combo.label.concat(` e ${nome}`);
  }
};

// novas modificacoes
const verificaSeComboPossuiSubstituicoes = (combo) => {
  if (combo.substituicoes.length === 0) {
    combo.substituicoes.push({
      uuid: null,
      tipos_alimentacao: [],
      combo: combo.uuid,
      label: "",
      adicionar: true,
    });
  } else {
    combo.substituicoes.forEach((substituicao) => {
      substituicao["adicionar"] = false;
    });
  }
};

const verificaSeVinculoTipoAlimentacaoPossuiTiposDeAlimentacoes = (combo) => {
  if (combo.tipos_alimentacao.length === 0) {
    return false;
  } else {
    verificaSeComboPossuiSubstituicoes(combo);
    return true;
  }
};

const verificaCombosDoTipoDeAlimentacao = (vinculoTipoAlimentacao) => {
  if (vinculoTipoAlimentacao.combos.length === 0) {
    vinculoTipoAlimentacao.combos.push({
      uuid: null,
      tipos_alimentacao: [],
      vinculo: vinculoTipoAlimentacao.uuid,
      substituicoes: [
        {
          uuid: null,
          tipos_alimentacao: [],
          combo: vinculoTipoAlimentacao.uuid,
          label: "",
          adicionar: true,
        },
      ],
      label: "",
      adicionar: true,
    });
    vinculoTipoAlimentacao.periodo_escolar["editado"] = false;
  } else {
    vinculoTipoAlimentacao.combos.forEach((combo) => {
      combo["adicionar"] = false;
      combo["completo"] = false;
      vinculoTipoAlimentacao.periodo_escolar["editado"] =
        verificaSeVinculoTipoAlimentacaoPossuiTiposDeAlimentacoes(combo);
    });
  }
};

export const estruturarDadosTiposDeAlimentacao = (vinculosTiposAlimentacao) => {
  vinculosTiposAlimentacao.forEach((vinculoTipoAlimentacao) => {
    vinculoTipoAlimentacao.periodo_escolar["ativo"] = false;
    verificaCombosDoTipoDeAlimentacao(vinculoTipoAlimentacao);
  });
  return vinculosTiposAlimentacao;
};

export const verificaSeFormularioOuRelatorioEhApresentado = (
  vinculosTiposAlimentacao
) => {
  let arrayComparar = vinculosTiposAlimentacao.filter(
    (vinculo) => vinculo.periodo_escolar.editado === true
  );
  if (arrayComparar.length === vinculosTiposAlimentacao.length) {
    return true;
  } else {
    return false;
  }
};
