import React from "react";
import "components/Shareable/style.scss";
import { TIPO_SOLICITACAO } from "constants/shared";

export const Rascunhos = ({
  rascunhosInclusaoDeAlimentacao,
  removerRascunho,
  form,
  carregarRascunho,
  values,
}) => {
  return (
    <div>
      {rascunhosInclusaoDeAlimentacao.map((inclusaoDeAlimentacao, key) => {
        const { id_externo, uuid } = inclusaoDeAlimentacao;
        let backgroundColor = "#DADADA";
        return (
          <div key={key} className="draft bg-white border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ml-3">
                {`Inclusão de Alimentação # ${id_externo}`}
              </label>
              <span
                className="ml-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {inclusaoDeAlimentacao.status}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {inclusaoDeAlimentacao.criado_em}
              <span
                onClick={() =>
                  removerRascunho(
                    id_externo,
                    uuid,
                    inclusaoDeAlimentacao.quantidades_periodo
                      ? TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
                      : null,
                    form
                  )
                }
              >
                <i className="fas fa-trash" />
              </span>
              <span
                onClick={() =>
                  carregarRascunho(form, values, inclusaoDeAlimentacao)
                }
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ml-3">
              <p>
                {inclusaoDeAlimentacao.data_inicial
                  ? `${inclusaoDeAlimentacao.motivo.nome} -
                    (${inclusaoDeAlimentacao.data_inicial} - ${inclusaoDeAlimentacao.data_final})`
                  : `${
                      inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei
                        ? inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei
                            .length
                        : 0
                    } dia(s)`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
