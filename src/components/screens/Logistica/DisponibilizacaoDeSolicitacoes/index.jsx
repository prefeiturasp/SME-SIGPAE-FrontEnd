import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getSolicitacoesDisponibilizadas } from "src/services/disponibilizacaoDeSolicitacoes.service";
import "./style.scss";
import { Button } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Spin } from "antd";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Modal } from "react-bootstrap";
import {
  enviaSolicitacaoRemessa,
  enviaSolicitacoesDaGrade,
} from "../../../../services/disponibilizacaoDeSolicitacoes.service";
import {
  toastError,
  toastInfo,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export const DisponibilizacaoDeSolicitacoes = (props) => {
  const [solicitacoes, setSolicitacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [numeroSolicitacao, setNumeroSolicitacao] = useState(null);
  const [solicitacaoUuid, setSolicitacaoUuid] = useState(null);
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    if (props.requisicoes && props.requisicoes.length > 0) {
      setSolicitacoes(props.requisicoes);
      setLoading(false);
    } else {
      getSolicitacoesDisponibilizadas()
        .then((response) => {
          if (response.status === HTTP_STATUS.OK) {
            setSolicitacoes(response.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []);

  const exibeToastPeloStatus = (status) => {
    if (status === HTTP_STATUS.OK && solicitacaoUuid) {
      toastSuccess("Requisição de entrega enviada com sucesso");
    } else if (status === HTTP_STATUS.OK && !solicitacaoUuid) {
      toastSuccess("Requisições de entrega enviadas com sucesso");
    } else if (status === HTTP_STATUS.BAD_REQUEST) {
      toastError("Erro de transição de estado");
    } else {
      toastInfo("Nenhuma requisição de entrega a enviar");
    }
  };

  const enviarSolicitacoes = async () => {
    const arrayUuidSolicitacoes = [];
    solicitacoes.forEach((solicitacao) => {
      if (solicitacao.status === "Aguardando envio") {
        arrayUuidSolicitacoes.push(solicitacao.uuid);
      }
    });
    const response = await enviaSolicitacoesDaGrade(arrayUuidSolicitacoes);
    if (response.status === HTTP_STATUS.OK && response.data.length === 0) {
      atualizaStatusdaSolicitacao(response.data);
      setShowModal(false);
      response.status = 500;
    } else if (response.status === HTTP_STATUS.OK && response.data.length > 0) {
      setSolicitacoes(null);
      setShowModal(false);
    } else {
      response.status = 500;
    }
    setLoading(false);
    exibeToastPeloStatus(response.status);
  };

  const atualizaStatusdaSolicitacao = (dataSolicitacao) => {
    let arraySolicitacoes = [];
    solicitacoes.forEach((solicitacao) => {
      if (solicitacao.uuid === dataSolicitacao.uuid) {
        arraySolicitacoes = solicitacoes.filter(
          (item) => item.uuid !== dataSolicitacao.uuid
        );
      }
    });
    if (arraySolicitacoes.length) setSolicitacoes(arraySolicitacoes);
    else setSolicitacoes(null);
  };

  const enviarSolicitacao = async () => {
    const response = await enviaSolicitacaoRemessa(solicitacaoUuid);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacaoUuid(null);
      setNumeroSolicitacao(null);
      atualizaStatusdaSolicitacao(response.data);
      setShowModal(false);
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      setSolicitacaoUuid(null);
      setNumeroSolicitacao(null);
      setShowModal(false);
    } else {
      response.status = 500;
    }
    setLoading(false);
    exibeToastPeloStatus(response.status);
  };

  return (
    solicitacoes && (
      <section className="resultado-busca-requisicao-envia-dilog container-fluid">
        <header>Veja requisições disponibilizadas</header>
        <article>
          <div className="grid-table header-table">
            <div>N° da Requisição de Entrega</div>
            <div>Qtde. de Guias Remessa</div>
            <div>Distribuidor</div>
            <div>Status</div>
            <div>Data de entrega</div>
            <div />
            <div />
          </div>
          {solicitacoes &&
            solicitacoes.map((solicitacao) => {
              const bordas =
                ativos && ativos.includes(solicitacao.uuid)
                  ? "desativar-borda"
                  : "";
              const toggleText =
                ativos && ativos.includes(solicitacao.uuid)
                  ? "Ver menos"
                  : "Ver mais";
              return (
                <>
                  <div className="grid-table body-table">
                    <div className={`${bordas}`}>
                      {solicitacao.numero_solicitacao}
                    </div>
                    <div className={`${bordas}`}>
                      {solicitacao.guias.length}{" "}
                      {solicitacao.guias.length === 1 ? "guia" : "guias"}
                    </div>
                    <div className={`${bordas}`}>
                      {solicitacao.distribuidor_nome}
                    </div>
                    <div className={`${bordas}`}>{solicitacao.status}</div>
                    <div className={`${bordas}`}>
                      {solicitacao.guias[0].data_entrega}
                    </div>

                    <div>
                      <Button
                        className="acoes"
                        variant="link"
                        onClick={() => {
                          ativos && ativos.includes(solicitacao.uuid)
                            ? setAtivos(
                                ativos.filter((el) => el !== solicitacao.uuid)
                              )
                            : setAtivos(
                                ativos
                                  ? [...ativos, solicitacao.uuid]
                                  : [solicitacao.uuid]
                              );
                        }}
                      >
                        {toggleText}
                      </Button>
                    </div>

                    <div>
                      <Button
                        className="acoes"
                        variant="link"
                        onClick={() => {
                          setShowModal(true);
                          setNumeroSolicitacao(solicitacao.numero_solicitacao);
                          setSolicitacaoUuid(solicitacao.uuid);
                        }}
                      >
                        enviar
                      </Button>
                    </div>
                  </div>
                  {ativos &&
                    ativos.includes(solicitacao.uuid) &&
                    solicitacao.guias.map((guia) => {
                      return (
                        <>
                          <section className="resultado-busca-detalhe pb-3 pt-3">
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-3 justify-content-center align-self-center">
                                  <span>
                                    {" "}
                                    N° da guia: <b>{guia.numero_guia}</b>
                                  </span>
                                </div>
                                <div className="col-3 justify-content-center align-self-center">
                                  <span>
                                    {" "}
                                    Status da guia: <b>{guia.status}</b>
                                  </span>
                                </div>
                              </div>

                              <hr />

                              <div className="row">
                                <div className="col">
                                  <b>Cód. CODAE da U.E</b>
                                  <br />
                                  {guia.codigo_unidade}
                                </div>
                                <div className="col border-start">
                                  <b>Nome Unidade Educacional</b>
                                  <br />
                                  {guia.nome_unidade}
                                </div>
                              </div>

                              <div className="row mt-3">
                                <div className="col">
                                  <b>Endereço</b>
                                  <br />
                                  {guia.endereco_unidade}, {guia.numero_unidade}{" "}
                                  - {guia.bairro_unidade} - CEP:{" "}
                                  {guia.cep_unidade} - {guia.cidade_unidade} -{" "}
                                  {guia.estado_unidade}
                                </div>
                              </div>

                              <div className="row mt-3">
                                <div className="col">
                                  <b>Contato de entrega</b>
                                  <br />
                                  {guia.contato_unidade}
                                </div>
                                <div className="col border-start">
                                  <b>Telefone</b>
                                  <br />
                                  {guia.telefone_unidade}
                                </div>
                              </div>

                              {guia.alimentos.map((alimento) => {
                                return (
                                  <>
                                    <div className="row mt-3 overflow-auto">
                                      <div className="col-2">
                                        <b>Nome do produto</b>
                                        <br />
                                        {alimento.nome_alimento}
                                      </div>

                                      <div className={"col-2"}>
                                        <b>Quantidade</b>
                                        <br />
                                        {alimento.embalagens[0].qtd_volume}
                                      </div>
                                      <div className="col">
                                        <b>
                                          Embalagem{" "}
                                          {
                                            alimento.embalagens[0]
                                              .tipo_embalagem
                                          }
                                        </b>
                                        <br />
                                        {
                                          alimento.embalagens[0]
                                            .descricao_embalagem
                                        }{" "}
                                        {
                                          alimento.embalagens[0]
                                            .capacidade_embalagem
                                        }{" "}
                                        {alimento.embalagens[0].unidade_medida}
                                      </div>

                                      {alimento.embalagens.length > 1 && (
                                        <>
                                          <div className={"col-2 border-start"}>
                                            <b>Quantidade</b>
                                            <br />
                                            {alimento.embalagens[1].qtd_volume}
                                          </div>
                                          <div className="col">
                                            <b>
                                              Embalagem{" "}
                                              {
                                                alimento.embalagens[1]
                                                  .tipo_embalagem
                                              }
                                            </b>
                                            <br />
                                            {
                                              alimento.embalagens[1]
                                                .descricao_embalagem
                                            }{" "}
                                            {
                                              alimento.embalagens[1]
                                                .capacidade_embalagem
                                            }{" "}
                                            {
                                              alimento.embalagens[1]
                                                .unidade_medida
                                            }
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </section>
                        </>
                      );
                    })}
                </>
              );
            })}

          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setNumeroSolicitacao(null);
              setSolicitacaoUuid(null);
            }}
          >
            <Spin tip="Enviando..." spinning={loading}>
              <Modal.Header closeButton>
                <Modal.Title>Atenção</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!numeroSolicitacao
                  ? `Deseja enviar todas as Solicitações da Grade ?`
                  : `Deseja enviar a Requisição de Entrega n° ${numeroSolicitacao} ? `}
              </Modal.Body>
              <Modal.Footer>
                <Botao
                  texto="SIM"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => {
                    numeroSolicitacao
                      ? enviarSolicitacao()
                      : enviarSolicitacoes();
                    setLoading(true);
                  }}
                  style={BUTTON_STYLE.BLUE}
                  className="ms-3"
                  disabled={loading}
                />
                <Botao
                  texto="NÃO"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => {
                    setShowModal(false);
                    setNumeroSolicitacao(null);
                    setSolicitacaoUuid(null);
                  }}
                  style={BUTTON_STYLE.BLUE}
                  className="ms-3"
                />
              </Modal.Footer>
            </Spin>
          </Modal>
        </article>
        <div className="row mb-3">
          <div className="col-12 text-end pt-3">
            <Botao
              style={BUTTON_STYLE.GREEN_OUTLINE}
              texto="Enviar todos"
              onClick={() => {
                setShowModal(true);
              }}
            />
          </div>
        </div>
      </section>
    )
  );
};
