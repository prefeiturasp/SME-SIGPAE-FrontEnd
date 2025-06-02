import React, { Dispatch, SetStateAction } from "react";
import "./styles.scss";
import { CronogramaRelatorio } from "../../interfaces";

interface Props {
  objetos: CronogramaRelatorio[];
  ativos: string[];
  setAtivos: Dispatch<SetStateAction<string[]>>;
}

const Listagem: React.FC<Props> = ({ objetos, ativos, setAtivos }) => {
  return (
    <div className="listagem-relatorio-cronograma">
      <div className="titulo-verde mt-4 mb-3">Resultado da Pesquisa</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma</div>
          <div>Produto</div>
          <div>Empresa</div>
          <div>Quantidade</div>
          <div>Armazém</div>
          <div>Status</div>
          <div></div>
        </div>

        {objetos.map((cronograma) => {
          const icone =
            ativos && ativos.includes(cronograma.uuid)
              ? "chevron-up"
              : "chevron-down";
          return (
            <>
              <div key={cronograma.uuid} className="grid-table body-table">
                <div>{cronograma.numero}</div>
                <div>{cronograma.produto}</div>
                <div>{cronograma.empresa}</div>
                <div>{cronograma.qtd_total_programada}</div>
                <div>{cronograma.armazem}</div>
                <div>{cronograma.status}</div>
                <div>
                  <i
                    className={`fas fa-${icone} expand`}
                    data-testid="icone-expandir"
                    onClick={() => {
                      ativos && ativos.includes(cronograma.uuid)
                        ? setAtivos(
                            ativos.filter(
                              (el: string) => el !== cronograma.uuid
                            )
                          )
                        : setAtivos(
                            ativos
                              ? [...ativos, cronograma.uuid]
                              : [cronograma.uuid]
                          );
                    }}
                  />
                </div>
              </div>
              {ativos && ativos.includes(cronograma.uuid) && (
                <div className="sub-item">
                  <div className="row">
                    <div className="col-6">
                      <span className="fw-bold me-1">Marca:</span>
                      <span>{cronograma.marca}</span>
                    </div>
                    <div className="col-6">
                      <span className="fw-bold me-1">Custo Unitário:</span>
                      <span>{cronograma.custo_unitario_produto}</span>
                    </div>
                  </div>
                  <article className="mt-3">
                    <div className="grid-table header-table">
                      <div>Etapa</div>
                      <div>Parte</div>
                      <div>Data programada</div>
                      <div>Quantidade</div>
                      <div>Total de Embalagens</div>
                      <div>Situação</div>
                    </div>

                    {cronograma.etapas.map((etapa) => {
                      return (
                        <>
                          <div
                            key={etapa.uuid}
                            className="grid-table body-table"
                          >
                            <div>{etapa.etapa}</div>
                            <div>{etapa.parte}</div>
                            <div>{etapa.data_programada}</div>
                            <div>{etapa.quantidade}</div>
                            <div>{etapa.total_embalagens}</div>
                            <div></div>
                          </div>
                        </>
                      );
                    })}
                  </article>
                </div>
              )}
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
