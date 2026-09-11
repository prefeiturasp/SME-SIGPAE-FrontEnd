import React, { Component } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export class Rascunhos extends Component {
  render() {
    const {
      suspensoesDeAlimentacaoList,
      OnDeleteButtonClicked,
      OnEditButtonClicked,
    } = this.props;
    const allDaysInfo = suspensoesDeAlimentacaoList.map(
      (suspensaoDeAlimentacao, key) => {
        const { id_externo } = suspensaoDeAlimentacao;
        let backgroundColor =
          suspensaoDeAlimentacao.status === "SALVO" ? "#82B7E8" : "#DADADA";
        return (
          <div key={key} className="bg-white draft border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ms-3">{`Suspensão de Alimentação # ${id_externo}`}</label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {suspensaoDeAlimentacao.status}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {suspensaoDeAlimentacao.criado_em}
              <span
                role="button"
                tabIndex={0}
                aria-label="Excluir rascunho"
                onClick={() => OnDeleteButtonClicked(suspensaoDeAlimentacao)}
                onKeyDown={(e) =>
                  acionaComEnterOuEspaco(e, () =>
                    OnDeleteButtonClicked(suspensaoDeAlimentacao),
                  )
                }
              >
                <i className="fas fa-trash" />
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Editar rascunho"
                onClick={() =>
                  OnEditButtonClicked({
                    suspensaoDeAlimentacao,
                  })
                }
                onKeyDown={(e) =>
                  acionaComEnterOuEspaco(e, () =>
                    OnEditButtonClicked({
                      suspensaoDeAlimentacao,
                    }),
                  )
                }
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>{suspensaoDeAlimentacao.data}</p>
            </div>
          </div>
        );
      },
    );
    return <div>{allDaysInfo}</div>;
  }
}
