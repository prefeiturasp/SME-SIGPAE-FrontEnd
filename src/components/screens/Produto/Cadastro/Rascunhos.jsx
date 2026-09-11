import React, { Component } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export class Rascunhos extends Component {
  render() {
    const { rascunhos, removerRascunho, carregarRascunho } = this.props;
    if (rascunhos && rascunhos.length) {
      const cardsProdutos = rascunhos.map((rascunho, key) => {
        const { produto } = rascunho;
        let backgroundColor = "#DADADA";
        return (
          <div key={key} className="draft bg-white border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ms-3">
                Produto {`# ${produto.id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {"RASCUNHO"}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {produto.criado_em}
              <span
                role="button"
                tabIndex={0}
                onClick={() =>
                  removerRascunho(produto.id_externo, rascunho.uuid)
                }
                onKeyDown={(e) =>
                  acionaComEnterOuEspaco(e, () =>
                    removerRascunho(produto.id_externo, rascunho.uuid),
                  )
                }
              >
                <i className="fas fa-trash" />
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={() =>
                  carregarRascunho({
                    produto,
                  })
                }
                onKeyDown={(e) =>
                  acionaComEnterOuEspaco(e, () =>
                    carregarRascunho({
                      produto,
                    }),
                  )
                }
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>Nome do produto: {produto.nome}</p>
            </div>
          </div>
        );
      });
      return <div>{cardsProdutos}</div>;
    } else {
      return <div />;
    }
  }
}
