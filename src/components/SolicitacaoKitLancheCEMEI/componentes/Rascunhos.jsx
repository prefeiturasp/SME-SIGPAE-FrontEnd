import React, { Component } from "react";

export class Rascunhos extends Component {
  render() {
    const {
      rascunhosSolicitacoesKitLanche,
      removerRascunho,
      carregarRascunho,
      form,
      values,
    } = this.props;
    const cardsRascunhos = rascunhosSolicitacoesKitLanche.map(
      (solicitacaoKitLanche, index) => {
        const { uuid, id_externo, local } = solicitacaoKitLanche;
        let backgroundColor = "#DADADA";
        return (
          <div
            className="draft card border rounded mt-3 p-3"
            key={id_externo}
            data-testid={`card-rascunho-cemei-${index}`}
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
                    Data do evento: <b>{solicitacaoKitLanche.data}</b>
                    <br /> Local do passeio: <b>{local}</b>
                  </label>
                  <div className="icon-draft-card float-end">
                    Salvo em: {solicitacaoKitLanche.criado_em}
                    <span
                      onClick={() => removerRascunho(id_externo, uuid, form)}
                    >
                      <i
                        className="fas fa-trash"
                        data-testid={`btn-delete-rascunho-cemei-${index}`}
                      />
                    </span>
                    <span
                      onClick={() =>
                        carregarRascunho(form, values, solicitacaoKitLanche)
                      }
                    >
                      <i
                        className="fas fa-edit"
                        data-testid={`btn-edit-rascunho-cemei-${index}`}
                      />
                    </span>
                  </div>
                </div>
                <label>
                  <b>{solicitacaoKitLanche.alunos_cei_e_ou_emei}</b>
                </label>
              </div>
            </div>
          </div>
        );
      }
    );
    return <div>{cardsRascunhos}</div>;
  }
}
