import React, { Component } from "react";

export class Rascunhos extends Component {
  render() {
    const {
      unifiedSolicitationList,
      OnDeleteButtonClicked,
      OnEditButtonClicked,
      form,
    } = this.props;
    const allDaysInfo = unifiedSolicitationList.map(
      (solicitacaoUnificada, index) => {
        const { id_externo, uuid } = solicitacaoUnificada;
        let backgroundColor = "#DADADA";
        return (
          <div key={id_externo} className="draft bg-white border rounded mt-3">
            <div className="mt-2">
              <label className="bold ms-3">
                Solicitação Unificada {`# ${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                RASCUNHO
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {solicitacaoUnificada.solicitacao_kit_lanche.criado_em}
              <span
                data-testid={`botao-excluir-rascunho-${index}`}
                onClick={() => OnDeleteButtonClicked(id_externo, uuid)}
              >
                <i className="fas fa-trash" />
              </span>
              <span
                disabled={!this.props.schoolsLoaded}
                data-testid={`botao-editar-rascunho-${index}`}
                onClick={() => OnEditButtonClicked(solicitacaoUnificada, form)}
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                {solicitacaoUnificada.lista_kit_lanche_igual
                  ? "Pedido Múltiplo - "
                  : solicitacaoUnificada.escolas_quantidades.length > 1
                    ? solicitacaoUnificada.escolas_quantidades.length +
                      " escolas - "
                    : solicitacaoUnificada.escolas_quantidades.length +
                      " escola - "}
                {solicitacaoUnificada.solicitacao_kit_lanche.data}
              </p>
            </div>
          </div>
        );
      },
    );
    return <div>{allDaysInfo}</div>;
  }
}
