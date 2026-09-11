import React from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";
import "./styles.scss";

const ListagemSolicitacoes = ({
  guias,
  vincularGuia,
  guiasVinculadas,
  desvincularGuia,
  buscarDetalheGuia,
}) => {
  const guiaVinculada = (guia) =>
    guiasVinculadas.map((guia) => guia.numero_guia).includes(guia.numero_guia);

  return (
    <section className="resultado-guias-ocorrencias">
      <div className="titulo-verde">Guias com Ocorrências</div>
      <article>
        <div className="grid-table header-table">
          <div>Nº da Guia</div>
          <div>Empresa</div>
          <div>Data Prevista Entrega</div>
          <div>Status da Guia</div>
          <div>Ações</div>
        </div>
        {guias.map((guia) => {
          return (
            <>
              <div
                key={guia.uuid}
                className={`grid-table body-table ${
                  guiaVinculada(guia) ? "green-bg" : ""
                }`}
              >
                <div>{guia.numero_guia}</div>
                <div>{guia.nome_distribuidor}</div>
                <div>{guia.data_entrega}</div>
                <div>{guia.status}</div>
                <div className="opcoes-entregas">
                  <span
                    role="button"
                    tabIndex={0}
                    className="link-acoes px-2"
                    onClick={() => buscarDetalheGuia(guia)}
                    onKeyDown={(e) =>
                      acionaComEnterOuEspaco(e, () => buscarDetalheGuia(guia))
                    }
                  >
                    <i className="fas fa-eye green" />
                  </span>
                  {guiaVinculada(guia) ? (
                    <span
                      role="button"
                      tabIndex={0}
                      className="link-acoes"
                      onClick={() => desvincularGuia(guia)}
                      onKeyDown={(e) =>
                        acionaComEnterOuEspaco(e, () => desvincularGuia(guia))
                      }
                    >
                      <i className="fas fa-trash-alt red" />
                    </span>
                  ) : (
                    <span
                      role="button"
                      tabIndex={0}
                      className="link-acoes"
                      onClick={() => vincularGuia(guia)}
                      onKeyDown={(e) =>
                        acionaComEnterOuEspaco(e, () => vincularGuia(guia))
                      }
                    >
                      <i className="fas fa-plus green" />
                    </span>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </article>
    </section>
  );
};

export default ListagemSolicitacoes;
