import React from "react";

export const HistoricoAlteracao = ({ inclusaoDeAlimentacao }) => {
  const quantidadesComEncerramento = (
    inclusaoDeAlimentacao.quantidades_periodo || []
  ).filter((qtd) => qtd.encerrado_a_partir_de);

  if (quantidadesComEncerramento.length === 0) {
    return null;
  }

  const logsAlteracao = (inclusaoDeAlimentacao.logs || []).filter(
    (log) => log.status_evento_explicacao === "Escola alterou",
  );

  return (
    <>
      <hr />
      <p>
        <strong>Histórico de alteração</strong>
        {logsAlteracao.map((log, logKey) => {
          const quantidadesDessaAlteracao = quantidadesComEncerramento.filter(
            (qtd) => qtd.cancelado_justificativa === log.justificativa,
          );
          return (
            <div key={logKey}>
              <div>
                {log.criado_em} - {log.status_evento_explicacao} a data fim
              </div>
              {quantidadesDessaAlteracao.map((qtd, qtdKey) => (
                <div key={qtdKey}>
                  <div className="mt-2">
                    {qtd.periodo_escolar.nome} -{" "}
                    {qtd.tipos_alimentacao.map((ta) => ta.nome).join(", ")} -{" "}
                    {qtd.numero_alunos} - Encerramento previsto para:{" "}
                    {qtd.encerrado_a_partir_de}
                  </div>
                  {log.justificativa && (
                    <div className="mt-2">
                      <span className="color-red fw-bold">Justificativa:</span>{" "}
                      {log.justificativa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </p>
    </>
  );
};
