export const backgroundLabelPeriodo = (periodos) => {
  const periodosComStyles = periodos.map((periodo) => {
    switch (periodo.nome) {
      case "MANHA":
        periodo["background"] = "#fff7cb";
        periodo["borderColor"] = "#ffd79b";
        break;

      case "TARDE":
        periodo["background"] = "#ffeed6";
        periodo["borderColor"] = "#ffbb8a";
        break;

      case "NOITE":
        periodo["background"] = "#e4f1ff";
        periodo["borderColor"] = "#82b7e8";
        break;

      case "INTEGRAL":
        periodo["background"] = "#ebedff";
        periodo["borderColor"] = "#b2baff";
        break;

      default:
        periodo["background"] = "#eaffe3";
        periodo["borderColor"] = "#79cf91";
        break;
    }
    return periodo;
  });
  return periodosComStyles;
};

export const formataPayload = (values) => {
  let payload = {};
  payload["escola"] = values.escola;
  payload["dias_motivos_da_inclusao_cei"] = values.dias_motivos_da_inclusao_cei;
  if (values.uuid) {
    payload["uuid"] = values.uuid;
  }
  let faixas = [];
  values.periodos_e_faixas
    .filter((periodo_faixa) => periodo_faixa.checked === true)
    .forEach((periodo_faixa) => {
      if (periodo_faixa.nome !== "INTEGRAL") {
        periodo_faixa.faixas_etarias.forEach((faixa_etaria) => {
          if (faixa_etaria.quantidade_alunos) {
            faixas.push({
              periodo: periodo_faixa.uuid,
              periodo_externo: periodo_faixa.uuid,
              quantidade_alunos: faixa_etaria.quantidade_alunos,
              faixa_etaria: faixa_etaria.faixa_etaria.uuid,
              matriculados_quando_criado: faixa_etaria.count,
            });
          }
        });
      } else {
        periodo_faixa.periodos
          .filter((periodo) => periodo.checked)
          .forEach((periodo) => {
            periodo.faixas_etarias.forEach((faixa_etaria) => {
              if (faixa_etaria.quantidade_alunos) {
                faixas.push({
                  periodo: periodo.uuid,
                  periodo_externo: periodo_faixa.uuid,
                  quantidade_alunos: faixa_etaria.quantidade_alunos,
                  faixa_etaria: faixa_etaria.faixa_etaria.uuid,
                  matriculados_quando_criado: faixa_etaria.count,
                });
              }
            });
          });
      }
    });
  payload["quantidade_alunos_por_faixas_etarias"] = faixas;
  return payload;
};

export const validarForm = (values) => {
  let erro = "";
  if (!values.quantidade_alunos_por_faixas_etarias.length) {
    erro =
      "Necessário selecionar ao menos período e preencher uma faixa etária";
  }
  return erro;
};
