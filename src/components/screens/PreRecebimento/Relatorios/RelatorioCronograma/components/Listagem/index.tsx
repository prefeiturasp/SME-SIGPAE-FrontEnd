import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useLayoutEffect,
  useState,
} from "react";
import "./styles.scss";
import { CronogramaRelatorio } from "../../interfaces";
import { imprimirFichaRecebimento } from "src/services/fichaRecebimento.service";
import { Tooltip } from "antd";
import { formataNome } from "../../helpers";

interface Props {
  objetos: CronogramaRelatorio[];
  ativos: string[];
  setAtivos: Dispatch<SetStateAction<string[]>>;
}

const imprimirFicha = async (uuid: string, numero: string) => {
  await imprimirFichaRecebimento(uuid, numero);
};

const Listagem: React.FC<Props> = ({ objetos, ativos, setAtivos }) => {
  const etapaColRef = useRef<HTMLDivElement>(null);
  const [colunaWidth, setColunaWidth] = useState(400);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (etapaColRef.current) {
        const width = etapaColRef.current.offsetWidth;
        setColunaWidth(width - 16);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [objetos]);

  useLayoutEffect(() => {
    if (ativos.length > 0 && etapaColRef.current) {
      const width = etapaColRef.current.offsetWidth;
      setColunaWidth(width - 16);
    }
  }, [ativos]);

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
                              (el: string) => el !== cronograma.uuid,
                            ),
                          )
                        : setAtivos(
                            ativos
                              ? [...ativos, cronograma.uuid]
                              : [cronograma.uuid],
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
                      <div ref={etapaColRef}>Etapa</div>
                      <div>Parte</div>
                      <div>Data programada</div>
                      <div>Quantidade</div>
                      <div>Total de Embalagens</div>
                      <div>Situação</div>
                    </div>

                    {cronograma.etapas.map((etapa) => {
                      const linhas = [];
                      const textoEtapaReposicao = `${etapa.etapa} - ${etapa.parte} - Reposição / Pagamento de Notificação`;

                      if (
                        etapa.fichas_recebimento &&
                        etapa.fichas_recebimento.length > 0
                      ) {
                        etapa.fichas_recebimento.forEach((ficha, index) => {
                          linhas.push(
                            <div
                              key={`${etapa.uuid}-${index}`}
                              className="grid-table body-table"
                            >
                              <div>
                                {ficha.houve_reposicao ? (
                                  <Tooltip
                                    color="#42474a"
                                    overlayStyle={{
                                      maxWidth: "360px",
                                      fontSize: "12px",
                                      fontWeight: "700",
                                    }}
                                    title={textoEtapaReposicao}
                                  >
                                    {formataNome(
                                      textoEtapaReposicao,
                                      colunaWidth,
                                    )}
                                  </Tooltip>
                                ) : (
                                  etapa.etapa
                                )}
                              </div>
                              <div>
                                {ficha.houve_reposicao ? "" : etapa.parte}
                              </div>
                              <div>{etapa.data_programada}</div>
                              <div>{etapa.quantidade}</div>
                              <div>{etapa.total_embalagens}</div>
                              <div>
                                {ficha.situacao === "Ocorrência" ? (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      imprimirFicha(
                                        ficha.uuid,
                                        cronograma.numero,
                                      );
                                    }}
                                    className="link-ocorrencia"
                                  >
                                    {ficha.situacao}
                                  </a>
                                ) : (
                                  ficha.situacao
                                )}
                              </div>
                            </div>,
                          );
                        });
                      }

                      if (
                        !etapa.fichas_recebimento?.length ||
                        etapa.fichas_recebimento.every(
                          (ficha) => ficha.situacao === "Ocorrência",
                        )
                      ) {
                        linhas.push(
                          <div
                            key={`${etapa.uuid}-areceber`}
                            className="grid-table body-table"
                          >
                            <div>{etapa.etapa}</div>
                            <div>{etapa.parte}</div>
                            <div>{etapa.data_programada}</div>
                            <div>{etapa.quantidade}</div>
                            <div>{etapa.total_embalagens}</div>
                            <div>A receber</div>
                          </div>,
                        );
                      }

                      return linhas;
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
