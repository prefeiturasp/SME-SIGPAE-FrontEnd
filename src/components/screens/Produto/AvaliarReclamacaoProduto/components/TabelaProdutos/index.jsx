import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

import ModalJustificativa from "src/components/Shareable/ModalJustificativa";
import { ModalPadrao } from "src/components/Shareable/ModalPadrao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Reclamacao from "src/components/screens/Produto/Reclamacao/components/Reclamacao";
import { getNumeroProtocoloAnaliseSensorial } from "../../../../../../services/produto.service";

import { CODAEPedeAnaliseSensorialProdutoReclamacao } from "../../../../../../services/reclamacaoProduto.service";

import { RECLAMACAO_PRODUTO_STATUS } from "src/constants/shared";
import {
  CODAEAceitaReclamacao,
  CODAEQuestionaNutrisupervisor,
  CODAEQuestionaTerceirizada,
  CODAEQuestionaUE,
  CODAERecusaReclamacao,
} from "src/services/reclamacaoProduto.service";
import { ordenaPorCriadoEm } from "./helpers";
import { corrigeLinkAnexo } from "src/helpers/utilities";

const {
  AGUARDANDO_AVALIACAO,
  CODAE_ACEITOU,
  CODAE_RECUSOU,
  AGUARDANDO_RESPOSTA_UE,
  RESPONDIDO_UE,
  AGUARDANDO_RESPOSTA_NUTRISUPERVISOR,
  AGUARDANDO_ANALISE_SENSORIAL,
  AGUARDANDO_RESPOSTA_TERCEIRIZADA,
  RESPONDIDO_TERCEIRIZADA,
  ANALISE_SENSORIAL_RESPONDIDA,
  RESPONDIDO_NUTRISUPERVISOR,
} = RECLAMACAO_PRODUTO_STATUS;

export default class TabelaProdutos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostraModalReclamacao: false,
      uuidReclamacao: undefined,
      acao: undefined,
      mostraModalJustificativa: false,
      mostraModalSuspensao: false,
      showModalAnalise: false,
      tipo_resposta: undefined,
      protocoloAnalise: null,
      terceirizada: null,
      escola: null,
      uuisdReclamacaoDisabled: [],
      uuidReclamacaoResposta: undefined,
    };
  }

  ACEITAR_RECLAMACAO = "aceitar";
  ACEITAR_RECLAMACAO_PARCIALMENTE = "aceitar_parcialmente";
  RECUSAR_RECLAMACAO = "rejeitar";
  QUESTIONAR_TERCEIRIZADA = "questionar_terceirizada";
  QUESTIONAR_UE = "questionar_ue";
  QUESTIONAR_NUTRISUPERVISOR = "questionar_nutrisupervisor";
  RESPONDER = "responder";

  defineTitulo = () => {
    switch (this.state.acao) {
      case this.QUESTIONAR_TERCEIRIZADA:
        return "Questionar terceirizada sobre reclamação de produto";
      case this.QUESTIONAR_UE:
        return "Questionar Unidade Educacional sobre reclamação de produto";
      case this.QUESTIONAR_NUTRISUPERVISOR:
        return "Questionar Nutrisupervisor sobre reclamação de produto";
      case this.RESPONDER:
        return "Responder reclamação de produto";
      default:
        return "";
    }
  };

  defineLabelJustificativa = () => {
    switch (this.state.acao) {
      case this.QUESTIONAR_TERCEIRIZADA:
        return "Questionamento";
      case this.QUESTIONAR_UE:
        return "Questionamento";
      case this.QUESTIONAR_NUTRISUPERVISOR:
        return "Questionamento";
      case this.RESPONDER:
        return "Justificativa";
      default:
        return "";
    }
  };

  defineEndpoint = () => {
    switch (this.state.acao) {
      case this.QUESTIONAR_TERCEIRIZADA:
        return CODAEQuestionaTerceirizada;
      case this.QUESTIONAR_UE:
        return CODAEQuestionaUE;
      case this.QUESTIONAR_NUTRISUPERVISOR:
        return CODAEQuestionaNutrisupervisor;
      case this.RESPONDER:
        if (
          this.state.tipo_resposta === this.ACEITAR_RECLAMACAO ||
          this.state.tipo_resposta === this.ACEITAR_RECLAMACAO_PARCIALMENTE
        ) {
          return CODAEAceitaReclamacao;
        }
        if (this.state.tipo_resposta === this.RECUSAR_RECLAMACAO) {
          return CODAERecusaReclamacao;
        }
        break;
      default:
        throw new Error("acao não informada");
    }
  };

  mostraToastSucesso = () => {
    switch (this.state.acao) {
      case this.QUESTIONAR_TERCEIRIZADA:
        return toastSuccess(
          "Questionamento enviado a terceirizada com sucesso"
        );
      case this.QUESTIONAR_UE:
        return toastSuccess(
          "Questionamento enviado a unidade educacional com sucesso"
        );
      case this.QUESTIONAR_NUTRISUPERVISOR:
        return toastSuccess("Questionamento enviado com Sucesso!");
      case this.RESPONDER:
        if (this.state.tipo_resposta === this.ACEITAR_RECLAMACAO) {
          return toastSuccess(
            "Aceite de reclamação de produto enviado com sucesso"
          );
        }
        if (this.state.tipo_resposta === this.RECUSAR_RECLAMACAO) {
          return toastSuccess(
            "Recusa de reclamação de produto enviado com sucesso"
          );
        }
        break;
      default:
        return toastSuccess("Solicitação enviada com sucesso");
    }
  };

  exibiAnexos = (reclamacao) => {
    return (
      <>
        <div key={1}>
          <p className="botao-reclamacao-title">Anexos</p>
        </div>
        <div key={2}>
          {reclamacao.anexos.map((anexo, key) => {
            return (
              <div key={key}>
                <a
                  href={corrigeLinkAnexo(anexo.arquivo)}
                  className="value-important link"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {`Anexo ${key + 1}`}
                </a>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  abreModalJustificativa = (
    acao,
    uuidReclamacao,
    produto,
    terceirizada = null,
    escola = null
  ) => {
    this.setState({
      mostraModalJustificativa: true,
      acao,
      uuidReclamacao,
      produto,
      terceirizada: terceirizada,
      escola: escola,
    });
  };

  abreModalSuspensao = () => {
    this.setState({ mostraModalSuspensao: true });
  };

  fechaModalJustificativa = () => {
    this.setState({ mostraModalJustificativa: false });
  };

  fechaModalSuspensao = () => {
    this.setState({ mostraModalSuspensao: false });
  };

  abreModalAnalise = async (uuidReclamacao) => {
    let response = await getNumeroProtocoloAnaliseSensorial();
    this.setState({
      showModalAnalise: true,
      protocoloAnalise: response.data,
      uuidReclamacao: uuidReclamacao,
    });
  };

  closeModalAnalise = () => {
    this.setState({ showModalAnalise: false });
  };

  onModalJustificativaOuSuspensaoSubmit = async (formValues) => {
    const { uuidReclamacao } = this.state;
    const endpoint = this.defineEndpoint();
    const response = await endpoint(uuidReclamacao, formValues);
    if (response.status === 200) {
      this.props.atualizar();
      this.fechaModalJustificativa();
      this.fechaModalSuspensao();
      this.mostraToastSucesso();

      if (this.state.tipo_resposta === this.RECUSAR_RECLAMACAO) {
        this.setState({
          uuisdReclamacaoDisabled: [
            ...this.state.uuisdReclamacaoDisabled,
            this.state.uuidReclamacaoResposta,
          ],
        });
      } else if (this.state.tipo_resposta === this.ACEITAR_RECLAMACAO) {
        const uuidsReclamacoes = this.props.listaProdutos
          .map((produto) =>
            produto.ultima_homologacao.reclamacoes.map(
              (reclamacao) => reclamacao.uuid
            )
          )
          .flat();
        this.setState({ uuisdReclamacaoDisabled: uuidsReclamacoes });
      } else if (
        this.state.tipo_resposta === this.ACEITAR_RECLAMACAO_PARCIALMENTE
      ) {
        this.setState({
          uuisdReclamacaoDisabled: [
            ...this.state.uuisdReclamacaoDisabled,
            this.state.uuidReclamacaoResposta,
          ],
        });
      }
    } else {
      toastError(response.errors);
    }
    this.props.setLoading(false);
  };

  deveDesabilitarBotao = (uuidReclamacao) => {
    return this.state.uuisdReclamacaoDisabled.includes(uuidReclamacao);
  };

  render() {
    const {
      listaProdutos,
      indiceProdutoAtivo,
      setIndiceProdutoAtivo,
      terceirizadas,
    } = this.props;
    const {
      mostraModalJustificativa,
      mostraModalSuspensao,
      showModalAnalise,
      protocoloAnalise,
      escola,
      terceirizada,
    } = this.state;
    return (
      <section className="resultados-busca-produtos mb-3">
        <section>
          <div className="tabela-produto tabela-header-produto">
            <div>Nome do Produto</div>
            <div>Marca</div>
            <div>Tipo</div>
            <div>Qtde. Reclamações</div>
            <div>Data de cadastro</div>
            <div />
          </div>
        </section>
        {listaProdutos.map((produto, indice) => {
          const isProdutoAtivo = indice === indiceProdutoAtivo;
          const reclamacoesAceitas =
            produto.ultima_homologacao.reclamacoes.find(
              (reclamacao) => reclamacao.status === CODAE_ACEITOU
            );
          const produtoTemReclacaoAceita = reclamacoesAceitas !== undefined;
          return (
            <div key={indice}>
              <div className="tabela-produto tabela-body-produto item-produto">
                <div>{produto.nome}</div>
                <div>{produto.marca.nome}</div>
                <div>
                  {produto.eh_para_alunos_com_dieta ? "D. Especial" : "Comum"}
                </div>
                <div>{produto.ultima_homologacao.reclamacoes.length}</div>
                <div className="com-botao">
                  {produto.criado_em.split(" ")[0]}
                </div>
                <div className="com-botao botoes-produto">
                  <i
                    className={`fas fa-angle-${isProdutoAtivo ? "up" : "down"}`}
                    onClick={() => {
                      setIndiceProdutoAtivo(
                        indice === indiceProdutoAtivo ? undefined : indice
                      );
                    }}
                  />
                </div>
              </div>
              {isProdutoAtivo && (
                <div className="container">
                  <div className="botao-ver-produto mt-4">
                    <Link
                      to={`/gestao-produto/relatorio?uuid=${produto.ultima_homologacao.uuid}`}
                    >
                      <Botao
                        texto="Ver produto"
                        className="ms-3"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                    </Link>
                  </div>
                  <hr />
                  {produto.ultima_homologacao.reclamacoes
                    .sort(ordenaPorCriadoEm)
                    .map((reclamacao, indice) => {
                      const desabilitaQuestionar =
                        produtoTemReclacaoAceita ||
                        ![
                          AGUARDANDO_AVALIACAO,
                          RESPONDIDO_TERCEIRIZADA,
                          ANALISE_SENSORIAL_RESPONDIDA,
                          RESPONDIDO_UE,
                          RESPONDIDO_NUTRISUPERVISOR,
                        ].includes(reclamacao.status);
                      const desabilitaResponder =
                        produtoTemReclacaoAceita ||
                        [
                          CODAE_ACEITOU,
                          CODAE_RECUSOU,
                          AGUARDANDO_ANALISE_SENSORIAL,
                        ].includes(reclamacao.status);
                      const desabilitarAnalise =
                        produtoTemReclacaoAceita ||
                        ![
                          AGUARDANDO_AVALIACAO,
                          RESPONDIDO_TERCEIRIZADA,
                          ANALISE_SENSORIAL_RESPONDIDA,
                          RESPONDIDO_UE,
                          RESPONDIDO_NUTRISUPERVISOR,
                        ].includes(reclamacao.status);
                      const desabilitaQuestionarUE =
                        produtoTemReclacaoAceita ||
                        reclamacao.status ===
                          AGUARDANDO_RESPOSTA_TERCEIRIZADA ||
                        reclamacao.status === AGUARDANDO_RESPOSTA_UE ||
                        reclamacao.status === AGUARDANDO_ANALISE_SENSORIAL ||
                        reclamacao.status === CODAE_RECUSOU ||
                        reclamacao.status ===
                          AGUARDANDO_RESPOSTA_NUTRISUPERVISOR;
                      const desabilitaQuestionarNutrisupervisao =
                        produtoTemReclacaoAceita ||
                        reclamacao.status ===
                          AGUARDANDO_RESPOSTA_TERCEIRIZADA ||
                        reclamacao.status === AGUARDANDO_RESPOSTA_UE ||
                        reclamacao.status === AGUARDANDO_ANALISE_SENSORIAL ||
                        reclamacao.status === CODAE_RECUSOU ||
                        reclamacao.status ===
                          AGUARDANDO_RESPOSTA_NUTRISUPERVISOR;
                      const deveMostrarBarraHorizontal =
                        indice <
                        produto.ultima_homologacao.reclamacoes.length - 1;
                      return [
                        <Reclamacao key={0} reclamacao={reclamacao} />,
                        <div key={2}>
                          {reclamacao.anexos.length > 0
                            ? this.exibiAnexos(reclamacao)
                            : undefined}
                        </div>,
                        <div key={3}>
                          <p className="botao-reclamacao-title mt-4">
                            Questionamentos
                          </p>
                        </div>,
                        <div key={4} className="botao-reclamacao mt-4">
                          <Botao
                            texto="Questionar Terceirizada"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            disabled={desabilitaQuestionar}
                            onClick={() =>
                              this.abreModalJustificativa(
                                this.QUESTIONAR_TERCEIRIZADA,
                                reclamacao.uuid,
                                produto,
                                reclamacao.escola.lote
                                  ? reclamacao.escola.lote.terceirizada
                                  : null
                              )
                            }
                          />
                          {reclamacao.usuario &&
                            reclamacao.usuario.tipo_usuario ===
                              "supervisao_nutricao" && (
                              <Botao
                                texto="Questionar nutricionista supervisor"
                                className="ms-3"
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                disabled={desabilitaQuestionarNutrisupervisao}
                                onClick={() =>
                                  this.abreModalJustificativa(
                                    this.QUESTIONAR_NUTRISUPERVISOR,
                                    reclamacao.uuid,
                                    produto,
                                    null,
                                    reclamacao.escola
                                  )
                                }
                              />
                            )}
                          <Botao
                            texto="Questionar U.E"
                            className="ms-3"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            disabled={desabilitaQuestionarUE}
                            onClick={() =>
                              this.abreModalJustificativa(
                                this.QUESTIONAR_UE,
                                reclamacao.uuid,
                                produto,
                                null,
                                reclamacao.escola
                              )
                            }
                          />
                        </div>,
                        <div key={3}>
                          <p className="botao-reclamacao-title">
                            Solicitar análise e resposta
                          </p>
                        </div>,
                        <div key={4} className="botao-reclamacao mt-4">
                          <Botao
                            texto="Solicitar análise sensorial"
                            className="me-3"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            onClick={() =>
                              this.abreModalAnalise(reclamacao.uuid)
                            }
                            disabled={desabilitarAnalise}
                          />
                          <Botao
                            texto="Responder"
                            className="ms-3 botaoResponder"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN}
                            disabled={
                              desabilitaResponder ||
                              this.deveDesabilitarBotao(reclamacao.uuid)
                            }
                            onClick={() => {
                              this.abreModalJustificativa(
                                this.RESPONDER,
                                reclamacao.uuid,
                                produto
                              );
                              this.setState({
                                uuidReclamacaoResposta: reclamacao.uuid,
                              });
                            }}
                          />
                        </div>,
                        deveMostrarBarraHorizontal && <hr />,
                      ];
                    })}
                </div>
              )}
            </div>
          );
        })}
        <ModalJustificativa
          titulo={this.defineTitulo()}
          labelJustificativa={this.defineLabelJustificativa()}
          showModal={mostraModalJustificativa}
          showModalSuspensao={mostraModalSuspensao}
          abreModalSuspensao={this.abreModalSuspensao}
          closeModal={this.fechaModalJustificativa}
          closeModalSuspensao={this.fechaModalSuspensao}
          onSubmit={this.onModalJustificativaOuSuspensaoSubmit}
          state={this.state}
          comAnexo={this.state.acao === this.RESPONDER}
          terceirizada={terceirizada}
          escola={escola}
          produto={this.state.produto}
          uuidReclamacao={this.state.uuidReclamacao}
        />
        <ModalPadrao
          showModal={showModalAnalise}
          closeModal={this.closeModalAnalise}
          toastSuccessMessage="Solicitação de análise sensorial enviada com sucesso"
          modalTitle="Deseja solicitar a análise sensorial do produto?"
          endpoint={CODAEPedeAnaliseSensorialProdutoReclamacao}
          uuid={this.state.uuidReclamacao}
          protocoloAnalise={protocoloAnalise}
          loadSolicitacao={() => this.props.atualizar()}
          terceirizadas={terceirizadas}
          eAnalise={true}
          labelJustificativa="Informações Adicionais"
          helpText="Solicitamos que seja informado a quantidade e descrição para análise sensorial"
          tipoModal="analise"
        />
      </section>
    );
  }
}
