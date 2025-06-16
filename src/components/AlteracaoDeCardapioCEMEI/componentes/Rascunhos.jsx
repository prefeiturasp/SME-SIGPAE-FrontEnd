import React from "react";
import "src/components/Shareable/style.scss";

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
                {`Alteração do Tipo de Alimentação # ${id_externo}`}
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
              <span
                data-testid={`botao-remover-rascunho-${alteracaoDeCardapio.id_externo}`}
                onClick={() => removerRascunho(id_externo, uuid, form)}
              >
                <i className="fas fa-trash" />
              </span>
              <span
                data-testid={`botao-carregar-rascunho-${alteracaoDeCardapio.id_externo}`}
                onClick={async () =>
                  await carregarRascunho(form, alteracaoDeCardapio)
                }
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                Dia:{" "}
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
