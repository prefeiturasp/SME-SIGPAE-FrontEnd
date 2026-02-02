import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import {
  FiltroEnum,
  TIPODECARD,
  TIPO_SOLICITACAO,
} from "../../../../constants/shared";
import { dataAtualDDMMYYYY, safeConcatOn } from "../../../../helpers/utilities";
import { getDREPedidosDeKitLanche } from "src/services/kitLanche";
import { getLotesSimples } from "src/services/lote.service";
import HTTP_STATUS from "http-status-codes";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { formatarOpcoesLote } from "src/helpers/utilities";
import { meusDados } from "src/services/perfil.service";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  ordenarPedidosDataMaisRecente,
} from "./../../../../helpers/painelPedidos";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      pedidosCarregados: 0,
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: [],
      filtros: this.props.filtros || {
        lote: undefined,
      },
      lotes: [],
    };
  }

  filtrar(filtro, filtros) {
    let pedidosPrioritarios = [];
    let pedidosNoPrazoLimite = [];
    let pedidosNoPrazoRegular = [];
    this.setState({ pedidosCarregados: 0 });

    Promise.all([
      getDREPedidosDeKitLanche(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
        filtros,
      ),
      getDREPedidosDeKitLanche(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_CEI,
        filtros,
      ),
      getDREPedidosDeKitLanche(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
        filtros,
      ),
    ]).then(([response, responseCei, responseCEMEI]) => {
      const results = safeConcatOn(
        "results",
        response,
        responseCei,
        responseCEMEI,
      );
      pedidosPrioritarios = ordenarPedidosDataMaisRecente(
        filtraPrioritarios(results),
      );
      pedidosNoPrazoLimite = ordenarPedidosDataMaisRecente(
        filtraNoLimite(results),
      );
      pedidosNoPrazoRegular = ordenarPedidosDataMaisRecente(
        filtraRegular(results),
      );
      this.setState((prevState) => ({
        pedidosPrioritarios,
        pedidosNoPrazoLimite,
        pedidosNoPrazoRegular,
        pedidosCarregados: prevState.pedidosCarregados + 1,
      }));
    });
  }

  componentDidMount() {
    meusDados().then((response) => {
      if (response) {
        this.setState({ meusDados: response });
        this.getLotesAsync(response.vinculo_atual.instituicao.uuid);
      }
    });
    const paramsFromPrevPage = this.props.filtros || {
      lote: undefined,
    };
    this.filtrar(FiltroEnum.SEM_FILTRO, paramsFromPrevPage);
    if (this.props.filtros) {
      this.props.change("lote", this.props.filtros.lote);
    }
  }

  async getLotesAsync(uuid) {
    const response = await getLotesSimples({ diretoria_regional__uuid: uuid });
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const lotes_ = formatarOpcoesLote(response.data.results).map((lote) => {
        return <Option key={lote.value}>{lote.label}</Option>;
      });
      this.setState({
        lotes: [
          <Option value="" key={0}>
            Filtrar por Lote
          </Option>,
        ].concat(lotes_),
      });
    }
  }

  setFiltros(filtros) {
    this.setState({ filtros: filtros });
  }

  render() {
    const {
      pedidosCarregados,
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular,
      lotes,
    } = this.state;
    const { valorDoFiltro } = this.props;
    const todosOsPedidosForamCarregados = pedidosCarregados;
    return (
      <div>
        {!todosOsPedidosForamCarregados ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-3 font-10 my-auto">
                    Data: {dataAtualDDMMYYYY()}
                  </div>
                  <div className="offset-6 col-3">
                    <Field
                      component={ASelect}
                      showSearch
                      onChange={(value) => {
                        const filtros_ = {
                          lote: value || undefined,
                        };
                        this.setFiltros(filtros_);
                        this.filtrar(FiltroEnum.SEM_FILTRO, filtros_);
                      }}
                      onBlur={(e) => {
                        e.preventDefault();
                      }}
                      name="lote"
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                    >
                      {lotes}
                    </Field>
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-12">
                    <CardPendenteAcao
                      titulo={
                        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                      }
                      tipoDeCard={TIPODECARD.PRIORIDADE}
                      pedidos={pedidosPrioritarios}
                      ultimaColunaLabel={"Data do Evento"}
                    />
                  </div>
                </div>
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo limite"}
                        tipoDeCard={TIPODECARD.NO_LIMITE}
                        pedidos={pedidosNoPrazoLimite}
                        ultimaColunaLabel={"Data do Evento"}
                      />
                    </div>
                  </div>
                )}
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardPendenteAcao
                        titulo={"Solicitações no prazo regular"}
                        tipoDeCard={TIPODECARD.REGULAR}
                        pedidos={pedidosNoPrazoRegular}
                        ultimaColunaLabel={"Data do Evento"}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const PainelPedidosForm = reduxForm({
  form: "painelPedidos",
  enableReinitialize: true,
})(PainelPedidos);
const selector = formValueSelector("painelPedidos");
const mapStateToProps = (state) => {
  return {
    valorDoFiltro: selector(state, "visao_por"),
  };
};

export default connect(mapStateToProps)(PainelPedidosForm);
