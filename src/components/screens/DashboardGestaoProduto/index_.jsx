import React, { Component } from "react";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import CardStatusDeSolicitacao from "components/Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import CardBody from "components/Shareable/CardBody";
import { GESTAO_PRODUTO } from "configs/constants";
import { formataCards, incluirDados } from "./helper";
import {
  dataAtual,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "helpers/utilities";
import { listarCardsPermitidos } from "helpers/gestaoDeProdutos";
import {
  getDashboardGestaoProdutos,
  getHomologacoesPorTituloMarca,
} from "services/produto.service";
import { TIPO_PERFIL } from "constants/shared";
import CardAtalho from "components/Shareable/CardAtalho";

export default class DashboardGestaoProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      dashboardData: null,
      dashboardDataFiltered: null,
      erro: false,
      ehTerceirizada: false,
      loading: true,
      filtroAtivo: false,
    };
    this.typingTimeout = null;
  }

  ehPerfilTerceirizada = () => {
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    return tipoPerfil === TIPO_PERFIL.TERCEIRIZADA;
  };

  loadDashBoardGestaoProdutos = () => {
    this.setState({
      loading: true,
    });
    getDashboardGestaoProdutos()
      .then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          const cards = listarCardsPermitidos();
          const ehTerceirizada = this.ehPerfilTerceirizada();
          cards.forEach((card) => {
            card.items = incluirDados(
              card.incluir_status,
              response.data.results
            );
          });
          this.setState({
            cards: cards,
            cardsFiltered: cards.concat(),
            ehTerceirizada,
            loading: false,
          });
        } else {
          this.setState({
            erro: true,
            loading: false,
          });
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.setState({ erro: true });
      });
  };

  componentDidMount() {
    this.loadDashBoardGestaoProdutos();
  }

  onPesquisaChanged = (values) => {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(async () => {
      const data = {};
      if (
        (!values.titulo && !values.marca && !values.edital) ||
        (!values.titulo &&
          !values.edital &&
          values.marca &&
          values.marca.length < 3) ||
        (!values.marca &&
          !values.edital &&
          values.titulo &&
          values.titulo.length < 3) ||
        (values.marca &&
          values.titulo &&
          !values.edital &&
          values.titulo.length < 3 &&
          values.marca.length < 3)
      ) {
        if (this.state.filtroAtivo) {
          this.loadDashBoardGestaoProdutos();
          this.setState({ filtroAtivo: false });
        }
        return;
      }
      this.setState({ filtroAtivo: true });
      if (values.titulo && values.titulo.length > 2) {
        data["titulo_produto"] = values.titulo;
      }
      if (values.marca && values.marca.length > 2) {
        data["marca_produto"] = values.marca;
      }
      if (values.edital) {
        data["edital_produto"] = values.edital;
      }
      this.setState({ loading: true });
      const response = await getHomologacoesPorTituloMarca(data);
      if (response.status === HTTP_STATUS.OK) {
        const cards = listarCardsPermitidos();
        const ehTerceirizada = this.ehPerfilTerceirizada();
        cards.forEach((card) => {
          card.items = incluirDados(card.incluir_status, response.data.results);
        });
        this.setState({
          cards: cards,
          cardsFiltered: cards.concat(),
          ehTerceirizada,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
          erro: true,
        });
      }
    }, 1000);
  };

  retornaCenarioPorTitulo = (titulo) => {
    switch (titulo) {
      case "Produtos suspensos":
        return true;
      case "Reclamação de produto":
        return true;
      case "Correções de Produtos":
        return true;
      case "Homologados":
        return true;
      case "Não homologados":
        return true;
      default:
        return false;
    }
  };

  apontaParaFormularioDeAlteracao = (titulo) => {
    const { ehTerceirizada } = this.state;
    return this.retornaCenarioPorTitulo(titulo) && ehTerceirizada;
  };

  render() {
    const { cardsFiltered, erro, loading } = this.state;
    return (
      <div>
        {erro && <div>Erro ao carregar painel gerencial</div>}
        {!erro && !cardsFiltered && <div>Carregando dashboard...</div>}
        {!erro && cardsFiltered && (
          <CardBody
            dataAtual={dataAtual()}
            onChange={this.onPesquisaChanged}
            ehDashboardGestaoProduto={true}
            filtrosDesabilitados={loading}
          >
            {!loading && !erro ? (
              cardsFiltered.map((card, index) => {
                const card2 = cardsFiltered[index + 1]
                  ? cardsFiltered[index + 1]
                  : null;
                return (
                  <div key={index}>
                    {index % 2 === 0 && (
                      <div className="row pt-3">
                        <div className="col-6">
                          <CardStatusDeSolicitacao
                            cardTitle={card.titulo}
                            cardType={card.style}
                            solicitations={formataCards(
                              card.items,
                              this.apontaParaFormularioDeAlteracao(card.titulo),
                              card.titulo
                            )}
                            icon={card.icon}
                            href={`/${GESTAO_PRODUTO}/${card.rota}`}
                            hrefCard={card.href_card}
                          />
                        </div>
                        {card2 && (
                          <div className="col-6">
                            <CardStatusDeSolicitacao
                              cardTitle={card2.titulo}
                              cardType={card2.style}
                              solicitations={formataCards(
                                card2.items,
                                this.apontaParaFormularioDeAlteracao(
                                  card2.titulo
                                ),
                                card2.titulo
                              )}
                              icon={card2.icon}
                              href={`/${GESTAO_PRODUTO}/${card2.rota}`}
                              hrefCard={card2.href_card}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : !erro ? (
              <div className="carregando-conteudo">
                <Spin tip="Carregando dashboard..." />
              </div>
            ) : (
              <div>Erro ao carregar as Solicitações</div>
            )}
          </CardBody>
        )}
        {usuarioEhEscolaTerceirizadaQualquerPerfil() && (
          <div className="row row-shortcuts">
            <div className="col-sm-3 col-12">
              <CardAtalho
                titulo={"Reclamação de Produtos"}
                nome="card-inclusao"
                texto={
                  "Quando houver necessidade de registrar" +
                  " Reclamação de Produtos para os produtos homologados"
                }
                textoLink={"Nova Reclamação"}
                href={"/gestao-produto/nova-reclamacao-de-produto"}
              />
            </div>
            <div className="col-sm-3 col-12">
              <CardAtalho
                titulo={"Responder Questionamentos de CODAE"}
                nome="card-alteracao"
                texto={
                  "Quando houver necessidade de responder os questionamentos " +
                  "da CODAE referente a uma reclamação de produto. "
                }
                textoLink={"Responder Questionamentos"}
                href={"/gestao-produto/responder-questionamento-ue"}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
