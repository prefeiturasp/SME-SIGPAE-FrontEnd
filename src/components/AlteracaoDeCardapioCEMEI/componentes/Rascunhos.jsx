import React from "react";
import "components/Shareable/style.scss";

export const Rascunhos = ({
  rascunhosAlteracaoCardapio,
  removerRascunho,
  form,
  carregarRascunho,
}) => {
  return (
    <div>
      {rascunhosAlteracaoCardapio.map((alteracaoDeCardapio, key) => {
        const { id_externo, uuid } = alteracaoDeCardapio;
        let backgroundColor = "#DADADA";
        return (
          <div key={key} className="draft bg-white border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ms-3">
                {`Alteração de Cardápio # ${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {alteracaoDeCardapio.status}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {alteracaoDeCardapio.criado_em}
              <span onClick={() => removerRascunho(id_externo, uuid, form)}>
                <i className="fas fa-trash" />
              </span>
              <span onClick={() => carregarRascunho(form, alteracaoDeCardapio)}>
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                {alteracaoDeCardapio.alterar_dia
                  ? alteracaoDeCardapio.alterar_dia
                  : alteracaoDeCardapio.data_inicial}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
