import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { truncarString, usuarioEhCogestorDRE } from "src/helpers/utilities";

import "./styles.scss";
import {
  documentoAnaliseSensorial,
  medicaoInicialExportarOcorrenciasPDF,
  medicaoInicialExportarOcorrenciasXLSX,
} from "src/services/relatorios";
import { BUTTON_ICON, BUTTON_STYLE } from "../Botao/constants";
import Botao from "../Botao";

const ModalHistorico = ({
  visible,
  onOk,
  onCancel,
  getHistorico,
  titulo,
  logs: logsProps,
  motivoNegacao,
  justificativaNegacao,
  printHistorico,
}) => {
  const [logs, setLogs] = useState([]);
  const [logSelecionado, setLogSelecionado] = useState(null);
  const statusValidosDownload = [
    "Enviado pela UE",
    "Corrigido para DRE",
    "Corrigido para CODAE",
    "Terceirizada respondeu a análise",
  ];

  useEffect(() => {
    setLogs(logsProps);
  }, [logsProps]);

  useEffect(() => {
    const historico = getHistorico();
    if (
      logs.length !== historico.length ||
      logs[0]?.criado_em !== historico[0]?.criado_em ||
      logs[logs.length - 1]?.criado_em !==
        historico[historico.length - 1]?.criado_em
    ) {
      setLogs(historico);
      setLogSelecionado(null);
    }
  }, []);

  const itemLogAtivo = (index, ativo) => {
    logs.forEach((log) => {
      log.ativo = false;
    });

    if (!ativo) {
      logs[index].ativo = !ativo;
      setLogSelecionado(logs[index]);
    } else {
      setLogSelecionado(null);
    }

    setLogs(logs);
  };

  const retornaIniciais = (log) => {
    const nome = log.usuario.nome.split(" ");
    let iniciais = "";
    nome.forEach((n, index) => {
      if (index <= 1) {
        iniciais = iniciais.concat(n.charAt(0)).toUpperCase();
      }
    });
    return iniciais;
  };

  const getAnexo = (log, ehExcel = false) => {
    let urlArquivo = "";

    if (statusValidosDownload.includes(log.status_evento_explicacao)) {
      const tipoSolicitacao = log.tipo_solicitacao_explicacao;

      switch (tipoSolicitacao) {
        case "Solicitação de medição inicial": {
          const anexoPDF = log.anexos.find((anexo) =>
            anexo.nome.includes(ehExcel ? "xls" : "pdf"),
          );
          if (anexoPDF) {
            return anexoPDF;
          }
          break;
        }

        case "Homologação de Produto":
          if (log.anexos.length > 0) {
            urlArquivo = log.anexos[0];
          }
          break;

        default:
          break;
      }
    }

    return urlArquivo;
  };

  const getTitulo = (log) => {
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

  const customStyle =
    logSelecionado?.status_evento_explicacao &&
    statusValidosDownload.includes(logSelecionado.status_evento_explicacao)
      ? { maxHeight: "200px" }
      : { maxHeight: "250px" };

  return (
    <Modal
      title={titulo ? titulo : "Histórico"}
      open={visible}
      onOk={onOk}
      okText={"Fechar"}
      cancelText={"Cancelar"}
      onCancel={onCancel}
      width={800}
      maskClosable={false}
      cancelButtonProps={{ style: { background: "white", onHover: "none" } }}
      okButtonProps={{
        style: { background: "#198459", borderColor: "#198459" },
      }}
      footer={[
        <Botao
          key="imprimir"
          texto="Imprimir"
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="me-3"
          onClick={() => {
            if (printHistorico) {
              printHistorico();
            }
          }}
        />,
        <Botao
          key="fechar"
          type="button"
          className="me-2"
          style={BUTTON_STYLE.GREEN}
          onClick={onOk}
          texto={"Fechar"}
        />,
      ]}
    >
      <section className="body-modal-produto">
        <div>Usuário</div>
        <div>Ações</div>
        <article className="list-logs">
          <section className="body-logs">
            {logs.map((log, index) => {
              const { ativo } = log;
              const iniciais = retornaIniciais(log);
              const tipoUsuario = log.usuario.nome;

              return (
                <div
                  key={index}
                  className={`${ativo && "ativo-item"} grid-item-log`}
                  onClick={() => {
                    itemLogAtivo(index, ativo);
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
                      {truncarString(getTitulo(log), 19)}
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
                      <div>{retornaIniciais(logSelecionado)}</div>
                    </div>
                    <div className="nome-fantasia-empresa">
                      {logSelecionado.usuario.nome}
                    </div>
                    <div>
                      <div>{logSelecionado.criado_em.split(" ")[0]}</div>
                      <div>{logSelecionado.criado_em.split(" ")[1]}</div>
                    </div>
                  </div>
                  <div className="body-log-item" style={customStyle}>
                    <header>{getTitulo(logSelecionado)}</header>
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
                      {motivoNegacao &&
                        [
                          "CODAE negou a Alteração de UE",
                          "CODAE negou cancelamento",
                        ].includes(logSelecionado.status_evento_explicacao) && (
                          <article>
                            <>
                              <div>Motivo:</div>
                              <div>
                                <p>{motivoNegacao}</p>
                              </div>
                            </>
                          </article>
                        )}
                      <article className="preenchimento">
                        {logSelecionado.justificativa !== "" && (
                          <>
                            {logSelecionado.status_evento_explicacao ===
                              "CODAE cancelou solicitação de correção" ||
                            logSelecionado.status_evento_explicacao ===
                              "Terceirizada cancelou solicitação de correção" ? (
                              <div>Nome do Produto: </div>
                            ) : ![
                                "Vínculo do Edital ao Produto",
                                "CODAE Atualizou o protocolo",
                              ].includes(
                                logSelecionado.status_evento_explicacao,
                              ) ? (
                              <div>Justificativa: </div>
                            ) : null}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: logSelecionado.justificativa,
                              }}
                            />
                          </>
                        )}
                        {logSelecionado.justificativa === "" &&
                          justificativaNegacao &&
                          [
                            "CODAE negou a Alteração de UE",
                            "CODAE negou cancelamento",
                          ].includes(
                            logSelecionado.status_evento_explicacao,
                          ) && (
                            <>
                              <div>Justificativa: </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: justificativaNegacao,
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
              statusValidosDownload.includes(
                logSelecionado.status_evento_explicacao,
              ) && (
                <footer className="footer-historico">
                  <article>
                    {logSelecionado.status_evento_explicacao ===
                    "Terceirizada respondeu a análise" ? (
                      <Botao
                        className="download-documento-entrega"
                        style={BUTTON_STYLE.GREEN}
                        texto="Download do documento de entrega"
                        onClick={() => {
                          const anexo = getAnexo(logSelecionado);
                          documentoAnaliseSensorial(anexo.arquivo_url);
                        }}
                      />
                    ) : (
                      getAnexo(logSelecionado) && (
                        <div className="row">
                          <div className="col-6">
                            <Botao
                              className="download-ocorrencias"
                              style={BUTTON_STYLE.GREEN}
                              icon={BUTTON_ICON.FILE_PDF}
                              texto="Formulário PDF"
                              onClick={() => {
                                const anexo = getAnexo(logSelecionado);
                                medicaoInicialExportarOcorrenciasPDF(
                                  anexo.arquivo_url,
                                );
                              }}
                            />
                          </div>
                          <div className="col-6">
                            <Botao
                              className="download-ocorrencias"
                              style={BUTTON_STYLE.GREEN}
                              icon={BUTTON_ICON.FILE_EXCEL}
                              texto="Formulário Excel"
                              onClick={() => {
                                const anexo = getAnexo(logSelecionado, true);
                                medicaoInicialExportarOcorrenciasXLSX(
                                  anexo.arquivo_url,
                                  anexo.nome,
                                );
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </article>
                </footer>
              )}
          </div>
        </article>
      </section>
    </Modal>
  );
};

export default ModalHistorico;
