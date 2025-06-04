import React from "react";
import "src/components/Shareable/style.scss";

export const Rascunhos = ({
  rascunhos,
  removerRascunho,
  form,
  carregarRascunho,
  values,
}) => {
  return (
    <div>
      {rascunhos.map((inclusao, key) => {
        const { id_externo, uuid } = inclusao;
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
                {inclusao.status}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {inclusao.criado_em}
              <span
                data-testid="botao-remover-rascunho"
                onClick={() => removerRascunho(id_externo, uuid, values)}
              >
                <i className="fas fa-trash" />
              </span>
              <span
                data-testid="botao-carregar-rascunho"
                onClick={() => carregarRascunho(form, inclusao, values)}
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>{inclusao.data}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
