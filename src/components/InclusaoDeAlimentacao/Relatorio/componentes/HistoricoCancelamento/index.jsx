import React from "react";

export const HistoricoCancelamento = ({ ...props }) => {
  const { inclusaoDeAlimentacao } = props;

  return (
    (
      inclusaoDeAlimentacao.inclusoes ||
      inclusaoDeAlimentacao.dias_motivos_da_inclusao_cei ||
      inclusaoDeAlimentacao.quantidades_periodo
    ).find((inclusao) => inclusao.cancelado_justificativa) && (
      <>
        <hr />
        <p>
          <strong>Histórico de cancelamento</strong>
          {(
            inclusaoDeAlimentacao.inclusoes ||
            inclusaoDeAlimentacao.dias_motivos_da_inclusao_cei ||
            inclusaoDeAlimentacao.quantidades_periodo
          )
            .filter((inclusao) => inclusao.cancelado_justificativa)
            .map((inclusao, key) => {
              return (
                <div key={key}>
                  {inclusao.data ||
                    `${
                      inclusao.periodo_escolar.nome
                    } - ${inclusao.tipos_alimentacao
                      .map((ta) => ta.nome)
                      .join(", ")} - ${inclusao.numero_alunos}`}
                  {" - "}
                  justificativa: {inclusao.cancelado_justificativa}
                </div>
              );
            })}
        </p>
      </>
    )
  );
};
