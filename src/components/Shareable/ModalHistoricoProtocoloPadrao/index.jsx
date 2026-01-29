import { Modal } from "antd";
import React, { Component } from "react";

import moment from "moment";
import { formatarCPFouCNPJ } from "src/helpers/utilities";
import "./styles.scss";

export default class ModalHistoricoProtocoloPadrao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      histSelecionado: null,
    };
  }

  itemLogAtivo = (index, ativo) => {
    let { history } = this.props;
    let { histSelecionado } = this.state;
    history.forEach((h) => {
      h.ativo = false;
    });

    if (!ativo) {
      history[index].ativo = !ativo;
      histSelecionado = history[index];
    } else {
      histSelecionado = null;
    }

    this.setState({ history, histSelecionado });
  };

  retornaIniciais = (email) => {
    const nome = email.split(" ");
    let iniciais = "";
    nome.forEach((n, index) => {
      if (index <= 1) {
        iniciais = iniciais.concat(n.charAt(0)).toUpperCase();
      }
    });
    return iniciais;
  };

  componentDidMount() {
    const { history } = this.props;
    this.setState({ history });
  }

  filterFieldsProtocolos = (history) => {
    if (history !== undefined && history.changes) {
      const fields = history.changes.filter((change) => {
        return ["nome_protocolo", "status", "orientacoes_gerais"].includes(
          change.field,
        );
      });
      return fields;
    }
    return [];
  };

  findFieldSubstituicoes = (history) => {
    if (history !== undefined && history.changes !== undefined) {
      const field = history.changes.find((change) => {
        return ["substituicoes"].includes(change.field);
      });
      return field;
    }
    return { changes: [] };
  };

  findEditais = (history) => {
    if (history !== undefined && history.changes) {
      const field = history.changes.find((change) => {
        return ["editais"].includes(change.field);
      });
      return field;
    }
  };

  findOutrasInformacoes = (history) => {
    if (history !== undefined && history.changes) {
      const field = history.changes.find((change) => {
        return ["outras informacoes"].includes(change.field);
      });
      return field;
    }
  };

  ajusta_nome = (campo) => {
    if (campo === "nome_protocolo") {
      return "Nome Protocolo";
    } else if (campo === "status") {
      return "Status";
    } else if (campo === "orientacoes_gerais") {
      return "Orientações Gerais";
    }
  };

  ajusta_valor = (campo, valor_campo) => {
    if (campo === "status" && valor_campo === "NAO_LIBERADO") {
      return "NÃO LIBERADO";
    }
    return valor_campo;
  };

  formatar_action = (action_name) => {
    switch (action_name) {
      case "CREATE":
        return "CRIAÇÃO";
      case "UPDATE":
        return "EDIÇÃO";
      case "UPDATE_VINCULOS":
        return "VÍNCULO DO EDITAL AO PROTOCOLO";
      default:
        return action_name;
    }
  };

  render() {
    const { visible, onOk, onCancel, history } = this.props;
    const { histSelecionado } = this.state;
    return (
      <Modal
        title="Histórico"
        visible={visible}
        onOk={onOk}
        okText={"Fechar"}
        onCancel={onCancel}
        width={1050}
        maskClosable={false}
      >
        <section className="body-modal-produto">
          <div>Usuário</div>
          <div>Ações</div>
          <article className="list-logs">
            <section className="body-logs">
              {history.length > 0 &&
                history.map((hist, index) => {
                  const { ativo } = hist;
                  const iniciais = this.retornaIniciais(
                    hist.user.nome ? hist.user.nome : hist.user.email,
                  );
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
                      <div className="descricao d-block">
                        <div className="descicao-titulo" title={hist.action}>
                          {this.formatar_action(hist.action)}
                        </div>
                        <div className="descicao-entidade">
                          {hist.user.username
                            ? hist.user.nome
                            : hist.user.email}
                        </div>
                      </div>
                      <div className="descricao">
                        {hist.updated_at !== undefined && (
                          <>
                            <div className="hora">
                              {
                                moment(hist.updated_at, "YYYY-MM-DD HH:mm:ss")
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[0]
                              }
                            </div>
                            <div className="hora">
                              {
                                moment(hist.updated_at, "YYYY-MM-DD HH:mm:ss")
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[1]
                              }
                            </div>
                          </>
                        )}
                        {hist.created_at !== undefined && (
                          <>
                            <div className="hora">
                              {
                                moment(hist.created_at, "YYYY-MM-DD HH:mm:ss")
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[0]
                              }
                            </div>
                            <div className="hora">
                              {
                                moment(hist.created_at, "YYYY-MM-DD HH:mm:ss")
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[1]
                              }
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </section>
          </article>
          <article className="detail-log">
            <div />

            <div>
              <header>
                <div />
                {histSelecionado !== null ? (
                  <div className="descricao-do-log">
                    <div className="header-log">
                      <div className="usuario">
                        <div>
                          {this.retornaIniciais(
                            histSelecionado.user.nome
                              ? histSelecionado.user.nome
                              : histSelecionado.user.email,
                          )}
                        </div>
                      </div>
                      <div className="nome-fantasia-empresa d-block">
                        {histSelecionado.user.nome &&
                        histSelecionado.user.username ? (
                          <>
                            <div className="w-100">
                              {histSelecionado.user.nome}
                            </div>
                            {histSelecionado.user.username.length === 11 ? (
                              <div className="w-100">{`CPF: ${formatarCPFouCNPJ(
                                histSelecionado.user.username,
                              )}`}</div>
                            ) : histSelecionado.user.username.length === 14 ? (
                              <div className="w-100">{`CNPJ: ${formatarCPFouCNPJ(
                                histSelecionado.user.username,
                              )}`}</div>
                            ) : (
                              <div className="w-100">{`RF: ${histSelecionado.user.username}`}</div>
                            )}
                          </>
                        ) : (
                          histSelecionado.user.email
                        )}
                      </div>
                      <div>
                        {histSelecionado.updated_at !== undefined && (
                          <>
                            <div className="hora">
                              {
                                moment(
                                  histSelecionado.updated_at,
                                  "YYYY-MM-DD HH:mm:ss",
                                )
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[0]
                              }
                            </div>
                            <div className="hora">
                              {
                                moment(
                                  histSelecionado.updated_at,
                                  "YYYY-MM-DD HH:mm:ss",
                                )
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[1]
                              }
                            </div>
                          </>
                        )}
                        {histSelecionado.created_at !== undefined && (
                          <>
                            <div className="hora">
                              {
                                moment(
                                  histSelecionado.created_at,
                                  "YYYY-MM-DD HH:mm:ss",
                                )
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[0]
                              }
                            </div>
                            <div className="hora">
                              {
                                moment(
                                  histSelecionado.created_at,
                                  "YYYY-MM-DD HH:mm:ss",
                                )
                                  .format("DD/MM/YYYY HH:mm:ss")
                                  .split(" ")[1]
                              }
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {histSelecionado !== undefined &&
                      this.filterFieldsProtocolos(histSelecionado).length >
                        0 && (
                        <table className="table table-bordered table-alimentacao">
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "40%" }} />
                          <thead>
                            <tr className="table-head-alimentacao">
                              <th>Campo</th>
                              <th>De</th>
                              <th>Para</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.filterFieldsProtocolos(histSelecionado)
                              .length > 0 &&
                              this.filterFieldsProtocolos(histSelecionado).map(
                                (change, index) => (
                                  <tr
                                    key={`${index}_${change.field}`}
                                    className="table-body-alimentacao"
                                  >
                                    <td>{this.ajusta_nome(change.field)}</td>
                                    <td>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: this.ajusta_valor(
                                            change.field,
                                            change.from,
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: this.ajusta_valor(
                                            change.field,
                                            change.to,
                                          ),
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ),
                              )}
                          </tbody>
                        </table>
                      )}
                    {histSelecionado !== undefined &&
                      this.findFieldSubstituicoes(histSelecionado) !==
                        undefined &&
                      this.findFieldSubstituicoes(histSelecionado).changes
                        .length > 0 && (
                        <table className="table table-bordered table-alimentacao">
                          <tbody>
                            <tr className="table-body-alimentacao">
                              <td>
                                <p className="data-title">
                                  Lista de Substituições
                                </p>
                                {this.findFieldSubstituicoes(
                                  histSelecionado,
                                ).changes.map((change, index) => {
                                  return (
                                    <table
                                      key={`${index}_table`}
                                      className="table table-bordered table-alimentacao"
                                    >
                                      <col style={{ width: "30%" }} />
                                      <col style={{ width: "30%" }} />
                                      <col style={{ width: "40%" }} />
                                      <thead>
                                        <tr
                                          key={`${index}_header`}
                                          className="table-head-alimentacao "
                                        >
                                          <th>Campo</th>
                                          <th>De</th>
                                          <th>Para</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Object.prototype.hasOwnProperty.call(
                                          change,
                                          "tipo",
                                        ) ? (
                                          <tr
                                            key={`${index}_tipo`}
                                            className="table-body-alimentacao"
                                          >
                                            <td>Isenção/Substituição</td>
                                            <td>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: change.tipo.from
                                                    ? change.tipo.from === "I"
                                                      ? "Isento"
                                                      : "Substituir"
                                                    : "",
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: change.tipo.to
                                                    ? change.tipo.to === "I"
                                                      ? "Isento"
                                                      : "Substituir"
                                                    : "",
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        ) : null}
                                        {Object.prototype.hasOwnProperty.call(
                                          change,
                                          "alimento",
                                        ) ? (
                                          <tr
                                            key={`${index}_alimento`}
                                            className="table-body-alimentacao"
                                          >
                                            <td>Alimento</td>
                                            <td>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: change.alimento.from
                                                    ? change.alimento.from.nome
                                                    : "",
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: change.alimento.to
                                                    ? change.alimento.to.nome
                                                    : "",
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        ) : null}
                                        {Object.prototype.hasOwnProperty.call(
                                          change,
                                          "substitutos",
                                        ) ? (
                                          <tr
                                            key={`${index}_substitutos`}
                                            className="table-body-alimentacao"
                                          >
                                            <td>Alimento/Ingrediente</td>
                                            <td>
                                              <ul>
                                                {change.substitutos.from
                                                  ? change.substitutos.from.map(
                                                      (alimento) => {
                                                        return (
                                                          <li
                                                            key={alimento.uuid}
                                                          >
                                                            {alimento.nome}
                                                          </li>
                                                        );
                                                      },
                                                    )
                                                  : ""}
                                              </ul>
                                            </td>
                                            <td>
                                              <ul>
                                                {change.substitutos.to
                                                  ? change.substitutos.to.map(
                                                      (alimento) => {
                                                        return (
                                                          <li
                                                            key={alimento.uuid}
                                                          >
                                                            {alimento.nome}
                                                          </li>
                                                        );
                                                      },
                                                    )
                                                  : ""}
                                              </ul>
                                            </td>
                                          </tr>
                                        ) : null}
                                      </tbody>
                                    </table>
                                  );
                                })}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    {histSelecionado !== undefined &&
                      (this.findEditais(histSelecionado) !== undefined ||
                        this.findOutrasInformacoes(histSelecionado) !==
                          undefined) && (
                        <table className="table table-bordered table-alimentacao">
                          <tbody>
                            <tr className="table-body-alimentacao">
                              <td>
                                <p className="data-title">Editais</p>
                                <table className="table table-bordered table-alimentacao">
                                  <col style={{ width: "30%" }} />
                                  <col style={{ width: "30%" }} />
                                  <col style={{ width: "40%" }} />
                                  <thead>
                                    <tr className="table-head-alimentacao">
                                      <th>Campo</th>
                                      <th>De</th>
                                      <th>Para</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.findEditais(histSelecionado) !==
                                      undefined && (
                                      <tr className="table-body-alimentacao">
                                        <td>Editais</td>
                                        <td>
                                          <ul>
                                            {this.findEditais(histSelecionado)
                                              .from &&
                                              this.findEditais(
                                                histSelecionado,
                                              ).from.map((edital, idx) => {
                                                return (
                                                  <li key={idx}>{edital}</li>
                                                );
                                              })}
                                          </ul>
                                        </td>
                                        <td>
                                          <ul>
                                            {this.findEditais(histSelecionado)
                                              .to &&
                                              this.findEditais(
                                                histSelecionado,
                                              ).to.map((edital, idx) => {
                                                return (
                                                  <li key={idx}>{edital}</li>
                                                );
                                              })}
                                          </ul>
                                        </td>
                                      </tr>
                                    )}
                                    {this.findOutrasInformacoes(
                                      histSelecionado,
                                    ) !== undefined && (
                                      <tr className="table-body-alimentacao">
                                        <td>Outras Informações</td>
                                        <td>
                                          {this.findOutrasInformacoes(
                                            histSelecionado,
                                          ).from && (
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  this.findOutrasInformacoes(
                                                    histSelecionado,
                                                  ).from,
                                              }}
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {this.findOutrasInformacoes(
                                            histSelecionado,
                                          ).to && (
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  this.findOutrasInformacoes(
                                                    histSelecionado,
                                                  ).to,
                                              }}
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                  </div>
                ) : (
                  <div />
                )}
              </header>
            </div>
          </article>
        </section>
      </Modal>
    );
  }
}
