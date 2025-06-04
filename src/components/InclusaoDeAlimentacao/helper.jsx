import {
  usuarioEhEscolaCMCT,
  usuarioEhEscolaCIEJA,
} from "src/helpers/utilities";

export const formatarTiposDeAlimentacao = (tiposAlimentacao) => {
  return tiposAlimentacao.map((element) => {
    return { value: element.uuid, label: element.nome };
  });
};

export const formatarPeriodosEspecificosEMEF = (periodos) => {
  periodos.forEach((periodo) => {
    periodo["checked"] = false;
    periodo["tipos_alimentacao_selecionados"] = [];
    periodo["numero_alunos"] = null;
    periodo["multiselect"] = "multiselect-wrapper-disabled";
    periodo["dias_semana"] = [];

    // Filtrar o array 'tipos_alimentacao' para remover o objeto com nome 'Lanche Emergencial'
    if (periodo["tipos_alimentacao"]) {
      periodo["tipos_alimentacao"] = periodo["tipos_alimentacao"].filter(
        (tipo) => tipo.nome !== "Lanche Emergencial"
      );
    }
  });
  return periodos;
};

export const formatarPeriodos = (periodos) => {
  periodos.forEach((periodo) => {
    periodo["checked"] = false;
    periodo["tipos_alimentacao_selecionados"] = [];
    periodo["numero_alunos"] = null;
    periodo["multiselect"] = "multiselect-wrapper-disabled";
    periodo["dias_semana"] = [];
  });
  return periodos;
};

export const extrairTiposALimentacao = (tiposAlimentacao) => {
  let uuidsTiposAlimentacao = [];
  tiposAlimentacao.forEach((tipoAlimentacao) => {
    uuidsTiposAlimentacao.push(tipoAlimentacao.uuid);
  });
  return uuidsTiposAlimentacao;
};

export const formatarDiasSemana = (diasSemana) => {
  let paraStringDiasSemana = [];
  diasSemana.forEach((diaSemana) => {
    paraStringDiasSemana.push(diaSemana.toString());
  });
  return paraStringDiasSemana;
};

export const formatarSubmissaoSolicitacaoContinua = (values) => {
  values.motivo = values.inclusoes[0].motivo;
  values.data_inicial = values.inclusoes[0].data_inicial;
  values.data_final = values.inclusoes[0].data_final;
  return values;
};

export const formatarSubmissaoSolicitacaoNormal = (values) => {
  values.quantidades_periodo
    .filter((qp) => qp.checked)
    .forEach((quantidade_periodo) => {
      if (
        quantidade_periodo.nome !== "NOITE" ||
        !quantidade_periodo["periodo_escolar"]
      ) {
        quantidade_periodo["periodo_escolar"] = quantidade_periodo.uuid;
      }
      if (
        usuarioEhEscolaCMCT() ||
        usuarioEhEscolaCIEJA() ||
        quantidade_periodo.nome === "NOITE"
      ) {
        if (
          quantidade_periodo.tipos_alimentacao_selecionados ===
          "refeicao_e_sobremesa"
        ) {
          quantidade_periodo["tipos_alimentacao"] =
            quantidade_periodo.tipos_alimentacao
              .filter((ta) => ["Refeição", "Sobremesa"].includes(ta.nome))
              .map((ta) => ta.uuid);
        } else {
          quantidade_periodo["tipos_alimentacao"] = [
            quantidade_periodo.tipos_alimentacao_selecionados,
          ];
        }
      } else {
        quantidade_periodo["tipos_alimentacao"] =
          quantidade_periodo.tipos_alimentacao_selecionados;
      }
      delete quantidade_periodo.grupo_inclusao_normal;
      delete quantidade_periodo.inclusao_alimentacao_continua;
    });
  values.quantidades_periodo = values.quantidades_periodo.filter(
    (qp) => qp.checked
  );
  return values;
};

const retornaQuantidadeDeAlunosNoPeriodoEscolar = (
  periodoUuid,
  periodosQuantidadeAlunos
) => {
  let quantidadeAlunos = null;
  periodosQuantidadeAlunos.forEach((periodo) => {
    if (periodo.periodo_escolar.uuid === periodoUuid) {
      quantidadeAlunos = periodo.quantidade_alunos;
    }
  });
  return quantidadeAlunos;
};

export const abstraiPeriodosComAlunosMatriculados = (
  periodos,
  periodosQuantidadeAlunos,
  ehAlteracao
) => {
  periodos.forEach((periodo) => {
    periodo["maximo_alunos"] = retornaQuantidadeDeAlunosNoPeriodoEscolar(
      periodo.uuid,
      periodosQuantidadeAlunos
    );
    if (!ehAlteracao) {
      periodo["tipos_alimentacao"] = periodo.tipos_alimentacao.filter(
        (tipo_alimentacao) => tipo_alimentacao.nome !== "Lanche Emergencial"
      );
    }
  });
  return periodos;
};

export const exibeMotivoETEC = () => {
  return (
    localStorage.getItem("nome_instituicao") &&
    (localStorage.getItem("nome_instituicao").startsWith(`"EMEF `) ||
      localStorage.getItem("nome_instituicao").startsWith(`"CEU EMEF `) ||
      localStorage.getItem("nome_instituicao").startsWith(`"CEU GESTAO `))
  );
};

export const renderizaSelectSimples = (nomePeriodo) => {
  return (
    usuarioEhEscolaCMCT() || usuarioEhEscolaCIEJA() || nomePeriodo === "NOITE"
  );
};
