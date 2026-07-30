import React from "react";
import { ehFimDeSemana } from "src/helpers/utilities";
import { validacaoSemana } from "../../../PeriodoLancamentoMedicaoInicial/helper";

import "./style.scss";

export const LegendaDiasNaoLetivos = ({ ...props }) => {
  const {
    diasCalendario,
    feriadosNoMes,
    anoSolicitacao,
    mesSolicitacao,
    weekColumns,
    values,
    categoria,
    periodoGrupo,
    semanaSelecionada,
    diasLetivosSIGPAE,
  } = props;

  const diaEhLetivoSIGPAE = (dia) => {
    const diaFormatado = String(dia).padStart(2, "0");
    const mesFormatado = String(mesSolicitacao).padStart(2, "0");
    const dataFormatada = `${diaFormatado}/${mesFormatado}/${anoSolicitacao}`;

    const entrada = diasLetivosSIGPAE.find((d) => d.data === dataFormatada);
    if (!entrada) return false;

    const nomePeriodo =
      periodoGrupo?.periodo_escolar ?? periodoGrupo?.nome_periodo_grupo ?? "";
    const periodoNormalizado = nomePeriodo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();

    return entrada.periodos_escolares.includes(periodoNormalizado);
  };

  const getListaDiasLabels = () => {
    const listaDiasLabels = [];
    feriadosNoMes
      ?.filter((feriadoNoMes) =>
        weekColumns.find((weekColumn) => weekColumn.dia === feriadoNoMes.dia),
      )
      .filter((diaCalendario) => {
        return (
          !["Mês anterior", "Mês posterior"].includes(
            values[
              `frequencia__dia_${diaCalendario.dia}__categoria_${
                categoria?.id
              }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                0,
                5,
              )}`
            ],
          ) &&
          !["Mês anterior", "Mês posterior"].includes(
            values[
              `lanche_emergencial__dia_${diaCalendario.dia}__categoria_${
                categoria?.id
              }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                0,
                5,
              )}`
            ],
          )
        );
      })
      .forEach((diaFeriado) => {
        !validacaoSemana(diaFeriado.dia, semanaSelecionada) &&
          listaDiasLabels.push({
            dia: diaFeriado.dia,
            label: diaEhLetivoSIGPAE(diaFeriado.dia)
              ? "Dia letivo cadastrado por CODAE"
              : `Feriado: ${diaFeriado.feriado}`,
          });
      });

    diasCalendario
      ?.filter((diaCalendario) =>
        weekColumns.find((weekColumn) => weekColumn.dia === diaCalendario.dia),
      )
      .filter((diaCalendario) => {
        return (
          !["Mês anterior", "Mês posterior"].includes(
            values[
              `frequencia__dia_${diaCalendario.dia}__categoria_${
                categoria?.id
              }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                0,
                5,
              )}`
            ],
          ) &&
          !["Mês anterior", "Mês posterior"].includes(
            values[
              `lanche_emergencial__dia_${diaCalendario.dia}__categoria_${
                categoria?.id
              }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                0,
                5,
              )}`
            ],
          )
        );
      })
      .filter(
        (diaCalendario) =>
          !diaCalendario.dia_letivo &&
          !feriadosNoMes.find(
            (diaFeriado) => diaFeriado.dia === diaCalendario.dia,
          ),
      )
      .forEach((diaCalendario) => {
        const dateObj = new Date(
          `${anoSolicitacao}-${mesSolicitacao}-${(
            parseInt(diaCalendario.dia) + 1
          )
            .toString()
            .padStart(2, "0")}`,
        );
        !ehFimDeSemana(dateObj) &&
          !validacaoSemana(diaCalendario.dia, semanaSelecionada) &&
          listaDiasLabels.push({
            dia: diaCalendario.dia,
            label: diaEhLetivoSIGPAE(diaCalendario.dia)
              ? "Dia letivo cadastrado por CODAE"
              : "Dia não letivo",
          });
      });

    diasLetivosSIGPAE
      ?.filter((entradaSIGPAE) => {
        const diaFormatado = entradaSIGPAE.data.substring(0, 2);
        const mesFormatado = entradaSIGPAE.data.substring(3, 5);
        const anoFormatado = entradaSIGPAE.data.substring(6, 10);

        if (mesFormatado !== String(mesSolicitacao).padStart(2, "0"))
          return false;
        if (anoFormatado !== String(anoSolicitacao)) return false;

        const nomePeriodo =
          periodoGrupo?.periodo_escolar ??
          periodoGrupo?.nome_periodo_grupo ??
          "";
        const periodoNormalizado = nomePeriodo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .trim();

        if (!entradaSIGPAE.periodos_escolares.includes(periodoNormalizado))
          return false;
        if (!weekColumns.find((col) => col.dia === diaFormatado)) return false;
        if (listaDiasLabels.find((l) => l.dia === diaFormatado)) return false;

        return true;
      })
      .forEach((entradaSIGPAE) => {
        const dia = entradaSIGPAE.data.substring(0, 2);
        !validacaoSemana(dia, semanaSelecionada) &&
          listaDiasLabels.push({
            dia,
            label: "Dia letivo cadastrado por CODAE",
          });
      });

    return listaDiasLabels.sort((obj1, obj2) => (obj1.dia > obj2.dia ? 1 : -1));
  };

  return (
    <div className="legenda-dias-nao-letivos mb-3">
      {getListaDiasLabels() &&
        getListaDiasLabels().map((diaLabel, index) => {
          return (
            <div key={index} className="d-flex">
              <div key={index} className="me-1 my-auto" />* {diaLabel.dia} -{" "}
              {diaLabel.label}
            </div>
          );
        })}
    </div>
  );
};
