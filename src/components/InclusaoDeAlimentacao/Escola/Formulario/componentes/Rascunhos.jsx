import React from "react";
import { comoTipo } from "helpers/utilities";
import "../../../../Shareable/style.scss";

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
              <label className="bold ms-3">
                {`Inclusão de Alimentação # ${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
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
                    comoTipo(inclusaoDeAlimentacao),
                    form
                  )
                }
              >
                <i className="fas fa-trash" />
              </span>
              <span
                data-testid={`rascunho-${id_externo}`}
                onClick={async () => {
                  await carregarRascunho(form, values, inclusaoDeAlimentacao);
                }}
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                {inclusaoDeAlimentacao.data_inicial
                  ? `${inclusaoDeAlimentacao.motivo.nome} -
                    (${inclusaoDeAlimentacao.data_inicial} - ${inclusaoDeAlimentacao.data_final})`
                  : `${
                      inclusaoDeAlimentacao.inclusoes
                        ? inclusaoDeAlimentacao.inclusoes.length
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
