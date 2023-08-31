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
      (solicitacaoKitLanche) => {
        const { uuid, id_externo, local } = solicitacaoKitLanche;
        let backgroundColor = "#DADADA";
        return (
          <div className="draft card border rounded mt-3 p-3" key={id_externo}>
            <div className="mt-2">
              <label className="bold ml-3">
                {`Solicitação de Kit Lanche Passeio #${id_externo}`}
              </label>
              <span
                className="ml-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                RASCUNHO
              </span>
              <div className="ml-3">
                <div>
                  <label>
                    Data do evento: <b>{solicitacaoKitLanche.data}</b>
                    <br /> Local do passeio: <b>{local}</b>
                  </label>
                  <div className="icon-draft-card float-right">
                    Salvo em: {solicitacaoKitLanche.criado_em}
                    <span
                      onClick={() => removerRascunho(id_externo, uuid, form)}
                    >
                      <i className="fas fa-trash" />
                    </span>
                    <span
                      onClick={() =>
                        carregarRascunho(form, values, solicitacaoKitLanche)
                      }
                    >
                      <i className="fas fa-edit" />
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
