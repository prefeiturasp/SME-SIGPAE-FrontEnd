import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import React, { useEffect } from "react";
import { Field, useForm } from "react-final-form";
import "./styles.scss";
import { numberToStringDecimal } from "src/helpers/parsers";
import { formataMilharDecimal } from "../../../../../../helpers/utilities";

const pintaTabela = (campo, etapaAtual, etapasAntigas) => {
  const etapaAntiga = etapasAntigas.find(
    (e) => e.etapa === etapaAtual.etapa && e.parte === etapaAtual.parte,
  );
  if (!etapaAntiga) return { paintCell: false, paintRow: true };
  if (etapaAtual[campo] !== etapaAntiga[campo]) {
    return { paintCell: true, paintRow: false };
  }
  return { paintCell: false, paintRow: false };
};

const preencherDadosEtapas = (etapasNovas, etapasAntigas, form) => {
  if (!etapasAntigas || etapasAntigas.length === 0) return;

  const ultimaEtapaAntiga = etapasAntigas[etapasAntigas.length - 1];

  etapasNovas.forEach((etapaNova, index) => {
    const etapaCorrespondente = etapasAntigas.find(
      (antiga) =>
        (antiga.etapa === etapaNova.etapa &&
          antiga.parte === etapaNova.parte) ||
        antiga.etapa === etapaNova.etapa,
    );

    const etapaParaUsar = etapaCorrespondente || ultimaEtapaAntiga;

    form.change(`empenho_${index}`, etapaParaUsar.numero_empenho || "");
    form.change(
      `qtd_total_empenho_${index}`,
      etapaParaUsar.qtd_total_empenho
        ? formataMilharDecimal(etapaParaUsar.qtd_total_empenho)
        : "",
    );
  });
};

export default ({ solicitacao, somenteLeitura }) => {
  const form = useForm();

  useEffect(() => {
    if (
      !somenteLeitura &&
      solicitacao.etapas_novas &&
      solicitacao.etapas_antigas
    ) {
      preencherDadosEtapas(
        solicitacao.etapas_novas,
        solicitacao.etapas_antigas,
        form,
      );
    }
  }, [solicitacao.etapas_novas, solicitacao.etapas_antigas, somenteLeitura]);

  return (
    <>
      <table className="table tabela-form-alteracao mt-2 mb-4">
        <thead className="head-crono">
          <tr>
            <th className="borda-crono">N° do Empenho</th>
            <th className="borda-crono">Qtde Total do Empenho</th>
            <th className="borda-crono">Etapa</th>
            <th className="borda-crono">Parte</th>
            <th className="borda-crono">Data Programada</th>
            <th className="borda-crono">Quantidade</th>
            <th className="borda-crono">Total de Embalagens</th>
          </tr>
        </thead>
        <tbody>
          {solicitacao.etapas_novas.length > 0 &&
            solicitacao.etapas_novas.map((etapa, index) => {
              const etapaAntiga = solicitacao.etapas_antigas.find(
                (e) => e.etapa === etapa.etapa && e.parte === etapa.parte,
              );
              const linhaDiferente = !etapaAntiga;
              const getClass = (campo) => {
                const { paintCell, paintRow } = pintaTabela(
                  campo,
                  etapa,
                  solicitacao.etapas_antigas,
                );
                return paintRow || paintCell ? "fundo-laranja" : "";
              };
              return (
                <tr
                  key={index}
                  className={linhaDiferente ? "fundo-laranja" : ""}
                >
                  {somenteLeitura ? (
                    <td className={`borda-crono ${getClass("numero_empenho")}`}>
                      {etapa.numero_empenho || "----"}
                    </td>
                  ) : (
                    <td className="borda-crono">
                      <Field
                        component={InputText}
                        name={`empenho_${index}`}
                        validate={required}
                        proibeLetras
                      />
                    </td>
                  )}
                  {somenteLeitura ? (
                    <td
                      className={`borda-crono ${getClass("qtd_total_empenho")}`}
                    >
                      {etapa.qtd_total_empenho
                        ? numberToStringDecimal(etapa.qtd_total_empenho)
                        : "----"}
                    </td>
                  ) : (
                    <td className="borda-crono">
                      <Field
                        component={InputText}
                        name={`qtd_total_empenho_${index}`}
                        validate={required}
                        agrupadorMilharComDecimal
                      />
                    </td>
                  )}
                  <td className={`borda-crono ${getClass("etapa")}`}>
                    {etapa.etapa}
                  </td>
                  <td className={`borda-crono ${getClass("parte")}`}>
                    {etapa.parte}
                  </td>
                  <td className={`borda-crono ${getClass("data_programada")}`}>
                    {etapa.data_programada}
                  </td>
                  <td className={`borda-crono ${getClass("quantidade")}`}>
                    {formataMilharDecimal(etapa.quantidade)}
                  </td>
                  <td className={`borda-crono ${getClass("total_embalagens")}`}>
                    {formataMilharDecimal(etapa.total_embalagens)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
