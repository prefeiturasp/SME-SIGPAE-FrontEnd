import { escolaEhCEMEI } from "../../helpers/utilities";

export const montaPeriodoDeAlteracao = (periodo) => {
  const periodoAlteracao = {
    nome: periodo.nome,
    uuid: periodo.uuid,
    tipos_alimentacao: periodo.tipos_alimentacao,
    checado: false,
    style: backgroundLabelPeriodo(periodo.nome),
  };
  return periodoAlteracao;
};

export const construirPeriodosECombos = (periodos) => {
  let periodosCombo = [];
  periodos.forEach((periodo) => {
    let dicionarioPeriodo = {
      checked: false,
      nome: periodo.periodo_escolar.nome,
      uuid: periodo.periodo_escolar.uuid,
      style: backgroundLabelPeriodo(periodo.periodo_escolar.nome),
      tipos_alimentacao: periodo.tipos_alimentacao.map((alimento) => {
        return {
          nome: alimento.nome,
          uuid: alimento.uuid,
          substituicoes: periodo.tipos_alimentacao
            .filter((substituto) => substituto.uuid !== alimento.uuid)
            .map((substituto) => {
              return {
                nome: substituto.nome,
                uuid: substituto.uuid,
              };
            }),
        };
      }),
    };
    periodosCombo.push(dicionarioPeriodo);
  });
  return periodosCombo;
};

const backgroundLabelPeriodo = (nomePeriodo) => {
  switch (nomePeriodo) {
    case "MANHA":
      return {
        background: "#fff7cb",
        borderColor: "#ffd79b",
      };
    case "TARDE":
      return {
        background: "#ffeed6",
        borderColor: "#ffbb8a",
      };
    case "NOITE":
      return {
        background: "#e4f1ff",
        borderColor: "#82b7e8",
      };
    case "INTEGRAL":
      return {
        background: "#ebedff",
        borderColor: "#b2baff",
      };
    default:
      return {
        background: "#eaffe3",
        borderColor: "#79cf91",
      };
  }
};

const getDaysArray = (start, end) => {
  let arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toISOString().split("T")[0]);
  }
  return arr;
};

export const formataValues = (values, ehRPL = false) => {
  if (values.data_inicial && values.data_final) {
    values.datas_intervalo = getDaysArray(
      values.data_inicial.split("/").reverse().join("-"),
      values.data_final.split("/").reverse().join("-")
    ).map((data) => ({ data: data }));
  } else if (values.alterar_dia) {
    values.datas_intervalo = getDaysArray(
      values.alterar_dia.split("/").reverse().join("-"),
      values.alterar_dia.split("/").reverse().join("-")
    ).map((data) => ({ data: data }));
  }
  if (!escolaEhCEMEI() || ehRPL) {
    values.substituicoes.forEach((subs) => {
      if (typeof subs.tipos_alimentacao_para === "string") {
        subs.tipos_alimentacao_para = [subs.tipos_alimentacao_para];
      }
    });
  }
  return values;
};
