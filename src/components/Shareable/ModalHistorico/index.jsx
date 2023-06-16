import { Modal } from "antd";
import React, { Component } from "react";
import { truncarString, usuarioEhCogestorDRE } from "helpers/utilities";

import "./styles.scss";
import { medicaoInicialExportarOcorrenciasPDF } from "services/relatorios";
import { BUTTON_STYLE } from "../Botao/constants";
import Botao from "../Botao";

export default class ModalHistorico extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      logSelecionado: null,
      solicitacaoMedicaoInicial: null,
      statusValidosDownload: ["Enviado pela UE", "Corrigido para DRE"]
    };
  }

  itemLogAtivo = (index, ativo) => {
    let { logs, logSelecionado } = this.state;
    logs.forEach(log => {
      log.ativo = false;
    });
    if (!ativo) {
      logs[index].ativo = !ativo;
      logSelecionado = logs[index];
    } else {
      logSelecionado = null;
    }

    this.setState({ logs, logSelecionado });
  };

  retornaIniciais = log => {
    const nome = log.usuario.nome.split(" ");
    let iniciais = "";
    nome.forEach((n, index) => {
      if (index <= 1) {
        iniciais = iniciais.concat(n.charAt(0)).toUpperCase();
      }
    });
    return iniciais;
  };

  componentDidMount = async () => {
    const { logs } = this.props;
    this.setState({ logs });
  };

  componentDidUpdate = async () => {
    const { getHistorico } = this.props;
    if (
      this.state.logs.length < getHistorico().length ||
      this.state.logs[0].criado_em !== getHistorico()[0].criado_em ||
      this.state.logs[this.state.logs.length - 1].criado_em !==
        getHistorico()[getHistorico().length - 1].criado_em
    ) {
      this.setState({ logs: getHistorico(), logSelecionado: null });
    }
  };

  getPdfUrl = log => {
    let urlArquivoPDF = "";
    if (
      this.state.statusValidosDownload.includes(log.status_evento_explicacao)
    ) {
      log.anexos.forEach(anexo => {
        if (anexo.nome.includes("pdf")) {
          urlArquivoPDF = anexo.arquivo_url;
        }
      });
    }
    return urlArquivoPDF;
  };

  getTitulo = log => {
    if (log) {
      if (log.status_evento_explicacao === "Correção solicitada") {
        return "Devolvido para ajustes pela DRE";
      }
      if (usuarioEhCogestorDRE()) {
        if (log.status_evento_explicacao === "Enviado pela UE") {
          return "Recebido para análise";
        }
      }
      return log.status_evento_explicacao;
    }
  };

  render() {
    const { visible, onOk, onCancel } = this.props;
    const { logs, logSelecionado } = this.state;
    return (
      <Modal
        title={this.props.titulo ? this.props.titulo : "Histórico"}
        open={visible}
        onOk={onOk}
        okText={"Fechar"}
        cancelText={"Cancelar"}
        onCancel={onCancel}
        width={800}
        maskClosable={false}
        cancelButtonProps={{ style: { background: "white", onHover: "none" } }}
        okButtonProps={{
          style: { background: "#198459", borderColor: "#198459" }
        }}
      >
        <section className="body-modal-produto">
          <div>Usuário</div>
          <div>Ações</div>
          <article className="list-logs">
            <section className="body-logs">
              {logs.map((log, index) => {
                const { ativo } = log;
                const iniciais = this.retornaIniciais(log);
                const tipoUsuario = (log.usuario.tipo_usuario =
                  log.usuario.nome);

                return (
                  <div
                    key={index}
                    className={`${ativo && "ativo-item"} grid-item-log`}
                    onClick={() => {
                      this.itemLogAtivo(index, ativo);
                    }}
                  >
                    <div className="usuario">
                      <div>{iniciais}</div>
                    </div>
                    <div className="descricao">
                      <div
                        className="descicao-titulo"
                        title={log.status_evento_explicacao}
                      >
                        {truncarString(this.getTitulo(log), 19)}
                      </div>
                      <div className="break-column" />
                      <div className="descicao-entidade">{tipoUsuario}</div>
                    </div>
                    <div className="descricao">
                      <div className="hora">{log.criado_em.split(" ")[0]}</div>
                      <div className="hora">{log.criado_em.split(" ")[1]}</div>
                    </div>
                  </div>
                );
              })}
            </section>
          </article>
          <article className="detail-log">
            <div />

            <div className="container-historico">
              <header>
                <div />
                {logSelecionado !== null ? (
                  <div className="descricao-do-log">
                    <div className="header-log">
                      <div className="usuario">
                        <div>{this.retornaIniciais(logSelecionado)}</div>
                      </div>
                      <div className="nome-fantasia-empresa">
                        {logSelecionado.usuario.nome}
                      </div>
                      <div>
                        <div>{logSelecionado.criado_em.split(" ")[0]}</div>
                        <div>{logSelecionado.criado_em.split(" ")[1]}</div>
                      </div>
                    </div>
                    <div className="body-log-item">
                      <header>{this.getTitulo(logSelecionado)}</header>
                      <section>
                        <article>
                          {logSelecionado.usuario.tipo_usuario ===
                          "terceirizada" ? (
                            <div>CPF: {logSelecionado.usuario.cpf}</div>
                          ) : (
                            <div>
                              RF: {logSelecionado.usuario.registro_funcional}
                            </div>
                          )}
                          <div className="criado-em">
                            <div>Data:</div>
                            <div>{logSelecionado.criado_em.split(" ")[0]}</div>
                          </div>
                        </article>
                        <article className="preenchimento">
                          {logSelecionado.justificativa !== "" && (
                            <>
                              {logSelecionado.status_evento_explicacao ===
                                "CODAE cancelou solicitação de correção" ||
                              logSelecionado.status_evento_explicacao ===
                                "Terceirizada cancelou solicitação de correção" ? (
                                <div>Nome do Produto: </div>
                              ) : logSelecionado.status_evento_explicacao !==
                                "Vínculo do Edital ao Produto" ? (
                                <div>Justificativa: </div>
                              ) : null}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: logSelecionado.justificativa
                                }}
                              />
                            </>
                          )}
                        </article>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </header>
              {logSelecionado !== null &&
                this.state.statusValidosDownload.includes(
                  logSelecionado.status_evento_explicacao
                ) && (
                  <footer className="footer-historico">
                    <article>
                      <Botao
                        className="download-ocorrencias"
                        style={BUTTON_STYLE.GREEN}
                        texto="Download do formulário"
                        onClick={() => {
                          const urlArquivoPDF = this.getPdfUrl(logSelecionado);
                          medicaoInicialExportarOcorrenciasPDF(urlArquivoPDF);
                        }}
                      />
                    </article>
                  </footer>
                )}
            </div>
          </article>
        </section>
      </Modal>
    );
  }
}
