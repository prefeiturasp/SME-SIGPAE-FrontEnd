import { Spin } from "antd";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { Paginacao } from "src/components/Shareable/Paginacao";
import withNavigationType from "src/components/Shareable/withNavigationType";

import {
  reset,
  setHomologacoes,
  setPage,
  setUuidHomologacaoAtiva,
} from "src/reducers/responderAnaliseSensorial";

import {
  getHomologacoesDeProdutoAnaliseSensorial,
  flegarHomologacaoPDF,
} from "src/services/produto.service";
import { getRelatorioProdutoAnaliseSensorialRecebimento } from "src/services/relatorios";

import DetalheProduto from "./components/DetalheProduto";
import { ModalResponderAnaliseSensorial } from "./components/ModalResponderAnaliseSensorial";

import "./styles.scss";

class BuscaProdutoAnaliseSensorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loading: false,
    };
    this.pageSize = 10;
  }

  UNSAFE_componentWillMount() {
    const { navigationType, reset, homologacoes } = this.props;
    if (navigationType === "PUSH") reset();
    if (homologacoes === undefined || navigationType === "PUSH") this.refresh();
  }

  pdfGerado = async ({ uuid }) => {
    let { homologacoes, setHomologacoes } = this.props;
    await flegarHomologacaoPDF(uuid);
    setHomologacoes(
      homologacoes.map((hom) => {
        if (hom.uuid === uuid) {
          hom.pdf_gerado = true;
        }
        return hom;
      })
    );
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  ativaDesativaHomologacao = (uuid) => {
    const { uuidHomologacaoAtiva, setUuidHomologacaoAtiva } = this.props;
    setUuidHomologacaoAtiva(uuidHomologacaoAtiva === uuid ? undefined : uuid);
  };

  homologacoesPaginaAtual = () => {
    const { homologacoes } = this.props;
    const pageSize = this.pageSize;
    const page = this.props.page || 1;
    if (homologacoes) {
      return homologacoes.slice((page - 1) * pageSize, page * pageSize);
    }
    return [];
  };

  refresh = async () => {
    this.setState({ loading: true });
    const response = await getHomologacoesDeProdutoAnaliseSensorial();
    this.props.setHomologacoes(response.data);
    this.setState({
      loading: false,
    });
  };

  responder_deve_aparecer = (rastro_terceirizada) => {
    if (rastro_terceirizada === null) {
      return true;
    } else if (
      `"${rastro_terceirizada.nome_fantasia}"` !==
      localStorage.getItem("nome_instituicao")
    ) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { showModal, loading } = this.state;
    const { uuidHomologacaoAtiva, homologacoes, page, setPage } = this.props;
    return (
      <Spin tip="Carregando..." spinning={loading}>
        <div className="card">
          <div className="card-body">
            <header className="cabecalho-page">
              Últimas solicitações de análise sensorial recebidas:
            </header>
            <section className="tabela-produtos">
              <article className="item-produto">
                <div>Nome Produto</div>
                <div>Marca</div>
                <div>Fabricante</div>
                <div>Data pedido de análise</div>
                <div>Documento de Entrega</div>
                <div />
              </article>

              {this.homologacoesPaginaAtual().map((homologacao, index) => {
                const homologacaoAtiva =
                  homologacao.uuid === uuidHomologacaoAtiva;
                const icone = homologacaoAtiva ? "angle-up" : "angle-down";
                const produto = homologacao.produto;
                const dataPedido =
                  homologacao.logs[homologacao.logs.length - 1].criado_em.split(
                    " "
                  )[0];
                return (
                  <Fragment key={index}>
                    <article className="item-produto">
                      <div>{produto.nome}</div>
                      <div>{produto.marca.nome}</div>
                      <div>{produto.fabricante.nome}</div>
                      <div>{dataPedido}</div>
                      <div>{homologacao.pdf_gerado ? "PDF Gerado" : ""}</div>
                      <div>
                        <i
                          className={`fas fa-${icone}`}
                          onClick={() =>
                            this.ativaDesativaHomologacao(homologacao.uuid)
                          }
                        />
                      </div>
                    </article>
                    {homologacaoAtiva && (
                      <Fragment>
                        <DetalheProduto homologacao={homologacao} />
                        <article className="rodape-com-botoes">
                          <Botao
                            texto={"Documento de entrega"}
                            type={BUTTON_TYPE.SUBMIT}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            onClick={() => {
                              this.pdfGerado(homologacao);
                              getRelatorioProdutoAnaliseSensorialRecebimento(
                                homologacao.produto
                              );
                            }}
                          />
                          <Link
                            to={`/pesquisa-desenvolvimento/relatorio-analise-sensorial?uuid=${homologacao.uuid}`}
                          >
                            <Botao
                              texto="Ver produto"
                              icon={undefined}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                          </Link>
                          <Botao
                            texto={"Responder"}
                            type={BUTTON_TYPE.SUBMIT}
                            style={BUTTON_STYLE.GREEN}
                            disabled={this.responder_deve_aparecer(
                              homologacao.ultima_analise.terceirizada
                            )}
                            onClick={this.showModal}
                          />
                        </article>
                      </Fragment>
                    )}
                  </Fragment>
                );
              })}
            </section>

            <ModalResponderAnaliseSensorial
              showModal={showModal}
              closeModal={this.closeModal}
              homologacao={
                homologacoes
                  ? homologacoes.find(
                      (hom) => hom.uuid === uuidHomologacaoAtiva
                    )
                  : undefined
              }
              onSend={this.refresh}
            />
            <Paginacao
              defaultCurrent={page === undefined ? 1 : page}
              total={homologacoes ? homologacoes.length : 0}
              pageSize={this.pageSize}
              onChange={setPage}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uuidHomologacaoAtiva: state.responderAnaliseSensorial.uuidHomologacaoAtiva,
    homologacoes: state.responderAnaliseSensorial.homologacoes,
    page: state.responderAnaliseSensorial.page,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setHomologacoes,
      setPage,
      setUuidHomologacaoAtiva,
      reset,
    },
    dispatch
  );

export default withNavigationType(
  connect(mapStateToProps, mapDispatchToProps)(BuscaProdutoAnaliseSensorial)
);
