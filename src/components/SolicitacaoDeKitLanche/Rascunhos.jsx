import React, { Component } from "react";

export class Rascunhos extends Component {
  render() {
    const {
      rascunhosSolicitacoesKitLanche,
      OnDeleteButtonClicked,
      OnEditButtonClicked,
    } = this.props;
    const cardsRascunhos = rascunhosSolicitacoesKitLanche.map(
      (solicitacaoKitLanche, index) => {
        const { uuid, id_externo, local, quantidade_alunos } =
          solicitacaoKitLanche;
        let backgroundColor = "#DADADA";
        return (
          <div
            className="draft card border rounded mt-3 p-3"
            key={id_externo}
            data-testid={`card-rascunho-${index}`}
          >
            <div className="mt-2">
              <label className="bold ms-3">
                {`Solicitação de Kit Lanche Passeio #${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                RASCUNHO
              </span>
              <div className="ms-3">
                <div>
                  <label>
                    Data do evento:{" "}
                    <b>{solicitacaoKitLanche.solicitacao_kit_lanche.data}</b>{" "}
                    Local do passeio: <b>{local}</b>
                  </label>
                  <div className="icon-draft-card float-end">
                    Salvo em:{" "}
                    {solicitacaoKitLanche.solicitacao_kit_lanche.criado_em}
                    <span
                      onClick={() => OnDeleteButtonClicked(id_externo, uuid)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          OnDeleteButtonClicked(id_externo, uuid);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Excluir rascunho"
                    >
                      <i
                        className="fas fa-trash"
                        data-testid={`btn-delete-rascunho-${index}`}
                      />
                    </span>
                    <span
                      onClick={() => OnEditButtonClicked(solicitacaoKitLanche)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          OnEditButtonClicked(solicitacaoKitLanche);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Editar rascunho"
                    >
                      <i
                        className="fas fa-edit"
                        data-testid={`btn-edit-rascunho-${index}`}
                      />
                    </span>
                  </div>
                </div>
                <label>
                  Nº de Alunos participantes: <b>{quantidade_alunos}</b>
                </label>
              </div>
            </div>
          </div>
        );
      },
    );
    return <div>{cardsRascunhos}</div>;
  }
}
