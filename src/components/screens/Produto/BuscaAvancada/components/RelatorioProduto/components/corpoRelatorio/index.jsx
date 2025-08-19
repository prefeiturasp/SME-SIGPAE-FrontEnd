import React, { Component, Fragment } from "react";
import { Modal } from "antd";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoPartindoTerceirizada } from "src/components/Shareable/FluxoDeStatus/helper";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { STATUS_CODAE_AUTORIZOU_RECLAMACAO } from "src/configs/constants";
import InformativoReclamacao from "src/components/Shareable/InformativoReclamacao";
import { truncarString } from "src/helpers/utilities";
import { getRelatorioProduto } from "src/services/relatorios";
import "../styles.scss";
import MotivoEvento from "src/components/Shareable/MotivoEvento";

export default class CorpoRelatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informacoes: [],
      visible: false,
      logs: [],
      logSelecionado: null,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  UNSAFE_componentWillMount() {
    let { informacoesNutricionais, produto } = this.props;
    const { informacoes } = this.state;

    let informacoesFormatadas = [];
    informacoesNutricionais.forEach((item) => {
      let dict = {
        nome: item.nome,
        ativo: item.ativo,
        informacoes: [],
      };
      item.informacoes_nutricionais.forEach((info) => {
        produto.informacoes_nutricionais.forEach((prodInfo) => {
          if (info.uuid === prodInfo.informacao_nutricional.uuid) {
            dict.informacoes.push({
              nome: info.nome,
              uuid: info.uuid,
              medida: `${prodInfo.quantidade_porcao} ${info.medida}`,
              valor: `${prodInfo.valor_diario} %`,
            });
          }
        });
      });
      if (dict.informacoes.length > 0) {
        informacoesFormatadas.push(dict);
      }
    });

    if (informacoes.length === 0) {
      const logs = produto.todos_logs;
      this.setState({ informacoes: informacoesFormatadas, logs });
    }
  }

  renderInformacaoNutricional = (indice, ativo) => {
    let { informacoes } = this.state;
    informacoes[indice].ativo = !ativo;
    this.setState({ informacoes });
  };

  itemLogAtivo = (index, ativo) => {
    let { logs, logSelecionado } = this.state;
    logs.forEach((log) => {
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

  retornaIniciais = (log) => {
    const nome = log.usuario.nome.split(" ");
    let iniciais = "";
    nome.forEach((n, index) => {
      if (index <= 1) {
        iniciais = iniciais.concat(n.charAt(0)).toUpperCase();
      }
    });
    return iniciais;
  };

  render() {
    const { produto, historico } = this.props;
    const { informacoes, logs, logSelecionado } = this.state;
    const status = produto.ultima_homologacao.status;
    const logsAnaliseSensorial =
      produto.ultima_homologacao.logs &&
      produto.ultima_homologacao.logs.filter(
        (log) =>
          log.status_evento_explicacao === "CODAE pediu análise sensorial"
      );
    const logAnaliseSensorial =
      logsAnaliseSensorial &&
      logsAnaliseSensorial.length > 0 &&
      logsAnaliseSensorial[logsAnaliseSensorial.length - 1];
    return (
      <section className="corpo-reatorio-produto">
        {!!logs.length && (
          <>
            <MotivoEvento
              logs={historico?.logs || []}
              titulo="Motivo da solicitação de correção do produto"
              motivo="Questionamento pela CODAE"
            />
            <MotivoEvento
              logs={historico?.logs || []}
              titulo="Motivo da recusa de homologação"
              motivo="CODAE não homologou"
            />
            <MotivoEvento
              logs={historico.logs || []}
              titulo="Motivo da suspensão"
              motivo="CODAE suspendeu o produto"
            />
          </>
        )}
        {status === STATUS_CODAE_AUTORIZOU_RECLAMACAO && (
          <InformativoReclamacao homologacao={produto.ultima_homologacao} />
        )}
        <article className="flex-botoes-relatorio">
          <div className="row col-12">
            <div className="row col-10 ms-0">
              {logAnaliseSensorial && (
                <>
                  <div className="col-6 ps-0">
                    <p className="text-muted">
                      Solicitação de análise sensorial
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      <span className="text-muted">
                        Protocolo Análise Sensorial:
                      </span>{" "}
                      {produto.ultima_homologacao.protocolo_analise_sensorial}
                    </p>
                  </div>
                </>
              )}

              {logAnaliseSensorial && (
                <section className="texto-wysiwyg row col-12 ms-0">
                  <div className="col-12">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: logAnaliseSensorial.justificativa,
                      }}
                    />
                  </div>
                </section>
              )}
            </div>

            <div className="col-2 d-flex" style={{ alignItems: "flex-end" }}>
              <Botao
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                icon={BUTTON_ICON.PRINT}
                onClick={() => {
                  getRelatorioProduto(produto);
                }}
                className="me-2"
              />
              <Botao
                type={BUTTON_TYPE.BUTTON}
                texto="Histórico"
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={this.showModal}
              />
            </div>
          </div>
          <hr />
        </article>
        <header>
          <div className="label-relatorio">Nome do produto</div>
          <div className="label-relatorio">Marca</div>
          <div className="label-relatorio">Tipo</div>
          <div className="label-relatorio">Data de cadastro</div>

          <div className="value-relatorio">{produto.nome}</div>
          <div className="value-relatorio">{produto.marca.nome}</div>
          <div className="value-relatorio">
            {produto.eh_para_alunos_com_dieta ? "DIETA ESPECIAL" : "COMUM"}
          </div>
          <div className="value-relatorio">
            {produto.ultima_homologacao.data_cadastro}
          </div>
        </header>
        <article>
          <hr />
          <FluxoDeStatus
            listaDeStatus={historico.logs}
            fluxo={fluxoPartindoTerceirizada}
          />
          <hr />
        </article>
        <article className="informacoes-gerais">
          <div className="header-informacao">
            Informação de empresa solicitante (Terceirizada)
          </div>
          <div className="grid-empresa-info">
            <div className="label-relatorio">
              {" "}
              Empresa solicitante (Terceirizada)
            </div>
            <div className="label-relatorio">Telefone </div>
            <div className="label-relatorio">E-mail</div>
            <div className="value-relatorio">
              {produto.ultima_homologacao.rastro_terceirizada.nome_fantasia}
            </div>
            <div className="value-relatorio">
              {
                produto.ultima_homologacao.rastro_terceirizada.contatos[0]
                  .telefone
              }
            </div>
            <div className="value-relatorio">
              {produto.ultima_homologacao.rastro_terceirizada.contatos[0].email}
            </div>
          </div>
        </article>
        <hr />
        <article className="informacoes-gerais">
          <div className="header-informacao">Identificação do Produto</div>
          <div className="info-sem-grid">
            <div className="label-relatorio">
              O produto se destina a alimentação de alunos com dieta especial?
            </div>
            <div className="value-relatorio">
              {produto.eh_para_alunos_com_dieta ? "SIM" : "NÃO"}
            </div>
          </div>

          <div className="grid-marca-fabricante-info info-sem-grid">
            <div className="label-relatorio">Marca</div>
            <div className="label-relatorio">Fabricante</div>
            <div className="value-relatorio">{produto.marca.nome}</div>
            <div className="value-relatorio">{produto.fabricante.nome}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">Componentes do produto</div>
            <div className="value-relatorio">{produto.componentes}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">
              {" "}
              O produto contém ou pode conter ingredientes/aditivos alergênicos?
            </div>
            <div className="value-relatorio">
              {produto.tem_aditivos_alergenicos ? "SIM" : "NÃO"}
            </div>
          </div>

          <div className="info-sem-grid">
            <div className="informativo-importante">
              IMPORTANTE: Relacioná-los conforme dispõe a RDC nº 26 de 02/07/15
            </div>
          </div>
        </article>
        <hr />
        <article className="informacoes-gerais">
          <div className="header-informacao">Informações nutricionais</div>

          <div className="grid-marca-fabricante-info info-sem-grid">
            <div className="label-relatorio">Porção</div>
            <div className="label-relatorio">Unidade caseira</div>
            <div className="value-relatorio">{produto.porcao}</div>
            <div className="value-relatorio">{produto.unidade_caseira}</div>
          </div>

          <div className="listagem-proteinas">
            {informacoes.map((informacao, index) => {
              const icone = informacao.ativo ? "angle-up" : "angle-down";
              const ativo = informacao.ativo;
              return (
                <Fragment key={index}>
                  <nav
                    key={index}
                    className="item-listagem"
                    onClick={() => {
                      this.renderInformacaoNutricional(index, ativo);
                    }}
                  >
                    <div className="header-listagem">
                      <div className="descricao-proteina">
                        {informacao.nome}
                      </div>
                      <i className={`fas fa-${icone}`} />
                    </div>
                  </nav>
                  {informacao.ativo && (
                    <Fragment>
                      <div className="detalhe-item-listagem">
                        <div />
                        <div className="header-item-detalhe">MEDIDA</div>
                        <div className="header-item-detalhe">% VD</div>
                      </div>
                      <div key={index} className="corpo-itens-listagem">
                        {informacao.informacoes.map((info, index) => {
                          return (
                            <div className="detalhe-item-listagem" key={index}>
                              <div>{info.nome}</div>
                              <div>{info.medida}</div>
                              <div>{info.valor}</div>
                            </div>
                          );
                        })}
                      </div>
                    </Fragment>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div className="aviso-importante-nutricional">
            IMPORTANTE: * % VD com base em uma dieta de 2.000 Kcal ou 8.400 KJ.
            Seus valores diários podem ser maiores ou menores dependendo de suas
            necessidades energéticas. (**) VD não estabelecidos
          </div>
        </article>
        <hr />
        <article className="informacoes-gerais">
          <div className="header-informacao">
            Informação do Produto (classificação)
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">Tipo</div>
            <div className="value-relatorio">{produto.tipo}</div>
          </div>

          <div className="grid-marca-fabricante-info info-sem-grid">
            <div className="label-relatorio">Embalagem primária</div>
            <div className="label-relatorio">Prazo de validade</div>
            <div className="value-relatorio">{produto.tipo}</div>
            <div className="value-relatorio">{produto.prazo_validade}</div>
          </div>

          <p>Informações referentes ao volume e unidade de medida</p>
          <table className="table table-ficha-identificacao-produto">
            <thead>
              <tr>
                <th className="col-4">Volume</th>
                <th className="col-4">Unidade de Medida</th>
                <th className="col-4">Embalagem</th>
              </tr>
            </thead>
            <tbody>
              {produto.especificacoes.map(
                (especificacao, especificacaoIndice) => {
                  return (
                    <tr key={especificacaoIndice}>
                      <td className="col-4">{especificacao.volume}</td>
                      <td className="col-4">
                        {especificacao.unidade_de_medida.nome}
                      </td>
                      <td className="col-4">
                        {especificacao.embalagem_produto.nome}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <div className="info-sem-grid">
            <div className="label-relatorio">
              Condições de armazenamento, conservação e prazo máximo para
              consumo após abertura da embalagem
            </div>
            <div className="value-relatorio">{produto.info_armazenamento}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">
              Outras informações que empresa julgar necessário
            </div>
            <div className="value-relatorio">{produto.outras_informacoes}</div>
          </div>

          <div className="info-sem-grid">
            <div className="label-relatorio">
              Nº de registro do produto de órgão competente
            </div>
            <div className="value-relatorio">{produto.numero_registro}</div>
          </div>
        </article>

        <hr />

        <article className="informacoes-gerais">
          <div className="header-informacao label-relatorio">
            Foto do produto
          </div>

          <div>
            {produto.imagens.map((imagem, index) => {
              return (
                <div key={index}>
                  <a
                    href={imagem.arquivo}
                    className="value-important link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {`Anexo ${index + 1}`}
                  </a>
                </div>
              );
            })}
          </div>
        </article>
        <hr />

        <Modal
          title="Histórico"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText={"Fechar"}
          onCancel={this.handleCancel}
          width={800}
          maskClosable={false}
        >
          <section className="body-modal-produto">
            <div>Usuário</div>
            <div>Ações</div>
            <article className="list-logs">
              <section className="body-logs">
                {logs.map((log, index) => {
                  const { ativo } = log;
                  const iniciais = this.retornaIniciais(log);
                  const tipoUsuario =
                    log.usuario.tipo_usuario === "terceirizada"
                      ? "TERCEIRIZADA"
                      : "CODAE";

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
                          {truncarString(log.status_evento_explicacao, 19)}
                        </div>
                        <div className="descicao-entidade">{tipoUsuario}</div>
                      </div>
                      <div className="descricao">
                        <div className="hora">
                          {log.criado_em.split(" ")[0]}
                        </div>
                        <div className="hora">
                          {log.criado_em.split(" ")[1]}
                        </div>
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
                        <header>
                          {logSelecionado.status_evento_explicacao}
                        </header>
                        <section>
                          <article>
                            <div>
                              RF: {logSelecionado.usuario.registro_funcional}
                            </div>
                            <div className="criado-em">
                              <div>Data:</div>
                              <div>
                                {logSelecionado.criado_em.split(" ")[0]}
                              </div>
                            </div>
                          </article>
                          <article>
                            {logSelecionado.justificativa !== "" && (
                              <>
                                <div>Justificativa:</div>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: logSelecionado.justificativa,
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
              </div>
            </article>
          </section>
        </Modal>
      </section>
    );
  }
}
