import React, { Dispatch, SetStateAction } from "react";
import "./styles.scss";
import { CronogramaSemanalRelatorio } from "../../interfaces";
import { Tooltip } from "antd";
import {
  acionaComEnterOuEspaco,
  formataMilharDecimal,
  truncarString,
} from "src/helpers/utilities";

interface Props {
  objetos: CronogramaSemanalRelatorio[];
  ativos: string[];
  setAtivos: Dispatch<SetStateAction<string[]>>;
}

const Listagem: React.FC<Props> = ({ objetos, ativos, setAtivos }) => {
  return (
    <div className="listagem-relatorio-cronograma">
      <div className="titulo-verde mt-4 mb-3">Resultado da Pesquisa</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma Semanal</div>
          <div>Empresa</div>
          <div>Produto</div>
          <div>Quantidade Total do Empenho</div>
          <div>Status</div>
          <div></div>
        </div>

        {objetos.map((cronograma, index) => {
          const chave = String(index);
          const expandido = ativos && ativos.includes(chave);
          const icone = expandido ? "chevron-up" : "chevron-down";
          return (
            <React.Fragment key={chave}>
              <div className="grid-table body-table">
                <div>{cronograma.numero}</div>
                <div>{cronograma.empresa}</div>
                <div>
                  <Tooltip title={cronograma.produto}>
                    {truncarString(cronograma.produto, 30)}
                  </Tooltip>
                </div>
                <div>
                  {formataMilharDecimal(cronograma.qtd_total_empenho)}{" "}
                  {cronograma.unidade_medida}
                </div>
                <div>{cronograma.status}</div>
                <div>
                  <i
                    className={`fas fa-${icone} expand`}
                    data-testid="icone-expandir"
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandido}
                    onClick={() => {
                      expandido
                        ? setAtivos(ativos.filter((el: string) => el !== chave))
                        : setAtivos(ativos ? [...ativos, chave] : [chave]);
                    }}
                    onKeyDown={(e) =>
                      acionaComEnterOuEspaco(e, () => {
                        expandido
                          ? setAtivos(
                              ativos.filter((el: string) => el !== chave),
                            )
                          : setAtivos(ativos ? [...ativos, chave] : [chave]);
                      })
                    }
                  />
                </div>
              </div>
              {expandido && (
                <div className="sub-item">
                  <div className="row">
                    <div className="col-6">
                      <span className="fw-bold me-1">Custo Unitário:</span>
                      <span>
                        R${" "}
                        {formataMilharDecimal(
                          cronograma.custo_unitario_produto,
                        )}
                      </span>
                    </div>
                  </div>
                  <article className="mt-3">
                    <div className="grid-table header-table">
                      <div>Quantidade de Entrega</div>
                      <div>Período Programado Inicial</div>
                      <div>Período Programado Final</div>
                    </div>

                    {cronograma.programacoes.map((programacao, idx) => (
                      <div
                        key={`${chave}-${idx}`}
                        className="grid-table body-table"
                      >
                        <div>
                          {formataMilharDecimal(programacao.quantidade)}{" "}
                          {cronograma.unidade_medida}
                        </div>
                        <div>{programacao.data_inicio}</div>
                        <div>{programacao.data_fim}</div>
                      </div>
                    ))}
                  </article>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
