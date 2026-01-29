import React from "react";

export const Rascunhos = ({ ...props }) => {
  const { rascunhos, removerRascunho, carregarRascunho, form, values } = props;

  return rascunhos?.map((alteracaoDeCardapio, key) => {
    const { uuid, id_externo } = alteracaoDeCardapio;
    let backgroundColor =
      alteracaoDeCardapio.status === "SALVO" ? "#82B7E8" : "#DADADA";
    return (
      <div key={key} className="bg-white border rounded mt-3">
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
          Salvo em: {alteracaoDeCardapio.criado_em}
          <span
            data-testid="botao-remover-rascunho"
            onClick={() => removerRascunho(id_externo, uuid, form)}
          >
            <i className="fas fa-trash" />
          </span>
          <span
            data-testid="botao-carregar-rascunho"
            role="button"
            tabIndex={0}
            onClick={() => carregarRascunho(alteracaoDeCardapio, form, values)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                carregarRascunho(alteracaoDeCardapio, form, values);
              }
            }}
          >
            <i className="fas fa-edit" />
          </span>
        </div>
        <div className="ms-3">
          <p>
            {alteracaoDeCardapio.data
              ? `Dia: ${alteracaoDeCardapio.data}`
              : alteracaoDeCardapio.data_inicial ===
                  alteracaoDeCardapio.data_final
                ? `Dia: ${
                    alteracaoDeCardapio.data_inicial ||
                    alteracaoDeCardapio.alterar_dia
                  }`
                : `De ${alteracaoDeCardapio.data_inicial} a ${alteracaoDeCardapio.data_final}`}
          </p>
        </div>
      </div>
    );
  });
};
