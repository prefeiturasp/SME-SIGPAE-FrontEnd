import React, { Dispatch, SetStateAction } from "react";
import "./styles.scss";
import { DocsRecebimentoRelatorio } from "../../interfaces";
import { Tooltip } from "antd";
import { truncarString } from "src/helpers/utilities";

interface Props {
  objetos: DocsRecebimentoRelatorio[];
  ativos: string[];
  setAtivos: Dispatch<SetStateAction<string[]>>;
}

const Listagem: React.FC<Props> = ({ objetos, ativos, setAtivos }) => {
  return (
    <div className="listagem-relatorio-documentos">
      <div className="titulo-verde mt-4 mb-3">Resultado da Pesquisa</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma</div>
          <div>Produto</div>
          <div>Empresa</div>
          <div>Nº do Pregão / Chamada Pública</div>
          <div>Nº do Processo SEI</div>
          <div></div>
        </div>

        {objetos.map((objeto) => {
          const icone =
            ativos && ativos.includes(objeto.uuid)
              ? "chevron-up"
              : "chevron-down";
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_cronograma}</div>
                <div className="d-flex justify-content-between">
                  <Tooltip title={objeto.produto}>
                    {truncarString(objeto.produto, 30)}
                  </Tooltip>
                </div>
                <div>{objeto.empresa}</div>
                <div>{objeto.numero_pregao_chamada_publica}</div>
                <div>{objeto.numero_processo_sei}</div>
                <div>
                  <i
                    className={`fas fa-${icone} expand`}
                    data-testid="icone-expandir"
                    onClick={() => {
                      ativos && ativos.includes(objeto.uuid)
                        ? setAtivos(
                            ativos.filter((el: string) => el !== objeto.uuid),
                          )
                        : setAtivos(
                            ativos ? [...ativos, objeto.uuid] : [objeto.uuid],
                          );
                    }}
                  />
                </div>
              </div>
              {ativos && ativos.includes(objeto.uuid) && (
                <div className="sub-item">
                  <div className="row">
                    <div className="col-6">
                      <span className="fw-bold me-1">Dados do Laudo</span>
                    </div>
                  </div>
                  <article className="mt-3">
                    <div className="grid-table header-table">
                      <div>Nº do Laudo</div>
                      <div>Nome do Laboratório</div>
                      <div>Nº do Lote do Laudo</div>
                      <div>Quantidade do Laudo</div>
                      <div>Status</div>
                    </div>

                    {objeto.documentos.map((documento, index) => (
                      <div
                        key={`${documento.uuid}-${index}`}
                        className="grid-table body-table"
                      >
                        <div>{documento.numero_laudo}</div>
                        <div>{documento.nome_laboratorio}</div>
                        <div>{documento.numero_lote_laudo}</div>
                        <div>
                          {documento.quantidade_laudo}{" "}
                          {documento.unidade_medida}
                        </div>
                        <div>{documento.status_documento}</div>
                      </div>
                    ))}
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
