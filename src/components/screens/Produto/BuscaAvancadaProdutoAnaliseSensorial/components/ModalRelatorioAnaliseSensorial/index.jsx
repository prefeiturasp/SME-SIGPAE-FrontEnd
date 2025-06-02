import React, { Fragment, useState } from "react";
import { Modal, Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { getRelatorioEmAnaliseSensorial } from "src/services/relatorios";
import { getProdutosRelatorioAnaliseSensorial } from "src/services/produto.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getTituloRelatorio } from "./helpers";
import { Paginacao } from "src/components/Shareable/Paginacao";

const ModalRelatorioAnaliseSensorial = ({
  showModal,
  closeModal,
  produtos,
  setProdutos,
  filtros,
  produtosCount,
  pageSize,
}) => {
  const [carregando, setCarregando] = useState(false);
  const [page, setPage] = useState(1);

  const nextPage = (page) => {
    setCarregando(true);
    setPage(page);
    const params = gerarParametrosConsulta({
      ...filtros,
      page: page,
      page_size: pageSize,
    });
    getProdutosRelatorioAnaliseSensorial(params).then((response) => {
      setProdutos(response.data.results);
      setCarregando(false);
    });
  };
  return (
    <Modal
      visible={showModal}
      title="Relatório de produtos em análise sensorial"
      onCancel={closeModal}
      width={"95%"}
      footer={[
        <Paginacao
          className="mt-3 mb-3"
          key={0}
          current={page}
          total={produtosCount}
          showSizeChanger={false}
          onChange={(page) => {
            nextPage(page);
          }}
          pageSize={pageSize}
        />,
        <Botao
          key={0}
          texto="Voltar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.BLUE_OUTLINE}
          icon={BUTTON_ICON.ARROW_LEFT}
          onClick={closeModal}
        />,
        <Botao
          key={1}
          type={BUTTON_TYPE.BUTTON}
          texto="Imprimir"
          style={BUTTON_STYLE.BLUE}
          icon={BUTTON_ICON.PRINT}
          onClick={() => {
            const params = gerarParametrosConsulta({ ...filtros });
            getRelatorioEmAnaliseSensorial(params);
          }}
        />,
      ]}
    >
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="body-modal">
          <div className="header-modal">
            {filtros && getTituloRelatorio(filtros)}
          </div>
          <div className="section-produtos-itens">
            <div className="item-produto-modal">
              <div className="item-header-produto-modal">
                <div className="item-grid-produto">
                  <div>Nome do Produto</div>
                  <div>Marca</div>
                  <div>Fabricante</div>
                  <div>Data de cadastro do produto</div>
                  <div>Data solicitação análise sensorial</div>
                </div>

                {produtos !== null &&
                  produtos.map((produto, index) => {
                    const dataSolicitacao =
                      produto.ultima_homologacao.log_solicitacao_analise.criado_em.split(
                        " "
                      )[0];
                    const infoAdicionais =
                      produto.ultima_homologacao.log_solicitacao_analise
                        .justificativa;
                    return (
                      <Fragment key={index}>
                        <div className="item-grid-produto item-prod-detalhe">
                          <div>{produto.nome}</div>
                          <div>{produto.marca.nome}</div>
                          <div>{produto.fabricante.nome}</div>
                          <div>{produto.criado_em.split(" ")[0]}</div>
                          <div>{dataSolicitacao}</div>
                        </div>

                        <div className="row mt-3">
                          <div className="col">
                            <div className="ms-3">
                              <label>Empresa solicitante (Terceirizada)</label>
                              <br />
                              <b>
                                {
                                  produto.ultima_homologacao.rastro_terceirizada
                                    .nome_fantasia
                                }
                              </b>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="row mt-3">
                          <div className="col-6">
                            <div className="ms-3">
                              <label>Informações adicionais</label>
                              <br />
                              <b
                                dangerouslySetInnerHTML={{
                                  __html: infoAdicionais,
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-3">
                            <label>Data / Hora entrega do produto</label>
                            <br />
                            <b>
                              {produto.ultima_homologacao.resposta_analise.data}
                            </b>
                            <br />
                            <b>
                              {produto.ultima_homologacao.resposta_analise.hora}
                            </b>
                          </div>
                          <div className="col-3">
                            <label>Amostra(s) recebidas por:</label>
                            <br />
                            <b>
                              {
                                produto.ultima_homologacao.resposta_analise
                                  .responsavel_produto
                              }
                            </b>
                            <br />
                            <b>
                              RF:{" "}
                              {
                                produto.ultima_homologacao.resposta_analise
                                  .registro_funcional
                              }
                            </b>
                          </div>
                        </div>
                        <hr />
                        <div className="row mt-3">
                          <div className="col-3">
                            <div className="ms-3">
                              <label>Número de protocolo AS.</label>
                              <br />
                              <b>
                                {
                                  produto.ultima_homologacao
                                    .protocolo_analise_sensorial
                                }
                              </b>
                            </div>
                          </div>
                          <div className="col-3">
                            <label>Data resposta terceirizada</label>
                            <br />
                            <b>
                              {
                                produto.ultima_homologacao.resposta_analise.criado_em.split(
                                  " "
                                )[0]
                              }
                            </b>
                          </div>
                          <div className="col-6">
                            <label>Observação</label>
                            <br />
                            <b>
                              {
                                produto.ultima_homologacao.resposta_analise
                                  .observacao
                              }
                            </b>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalRelatorioAnaliseSensorial;
