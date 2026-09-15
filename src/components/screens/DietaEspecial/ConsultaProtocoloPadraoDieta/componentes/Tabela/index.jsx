import React, { Fragment, useState } from "react";
import DetalhesProtocolo from "../DetalhesProtocolo";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";
import "./style.scss";

export default ({ resultado }) => {
  const [selecionado, setSelecionado] = useState(undefined);

  const selecionaProtocolo = (idx) => {
    if (selecionado === idx) {
      setSelecionado(undefined);
    } else {
      setSelecionado(idx);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-bordered table-alimentacao">
          <thead>
            <tr className="table-head-alimentacao">
              <th>Nome do Protocolo Padrão</th>
              <th>Editais</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {resultado.results.map((protocoloPadrao, idx) => {
              return (
                <Fragment key={idx}>
                  <tr className="table-body-alimentacao">
                    <td>{protocoloPadrao.nome_protocolo}</td>
                    <td>
                      {protocoloPadrao.editais.map((e) => e.numero).join(", ")}
                    </td>
                    <td>
                      <div className="row">
                        <div className="col-12">{protocoloPadrao.status}</div>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <div className="col-4" />
                        <div className="col-8">
                          <i
                            className={
                              selecionado === idx
                                ? "fas fa-angle-up"
                                : "fas fa-angle-down"
                            }
                            role="button"
                            tabIndex={0}
                            aria-expanded={selecionado === idx}
                            aria-label={`Detalhes do protocolo ${protocoloPadrao.nome_protocolo}`}
                            onClick={() => {
                              selecionaProtocolo(idx);
                            }}
                            onKeyDown={(e) =>
                              acionaComEnterOuEspaco(e, () =>
                                selecionaProtocolo(idx),
                              )
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <DetalhesProtocolo
                    protocoloPadrao={protocoloPadrao}
                    idx={idx}
                    selecionado={selecionado}
                  />
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
