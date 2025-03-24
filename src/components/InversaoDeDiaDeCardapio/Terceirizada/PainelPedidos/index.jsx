import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum } from "../../../../constants/shared";
import { getTerceirizadaPedidosDeInversoes } from "../../../../services/inversaoDeDiaDeCardapio.service";
import { CardInversaoPendenciaAprovacao } from "../../components/CardPendenteAcao";
import { TIPODECARD } from "../../../../constants/shared";
import CardHistorico from "../../components/CardHistorico";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  formatarPedidos,
} from "./helper";
import { dataAtualDDMMYYYY } from "../../../../helpers/utilities";
import Select from "../../../Shareable/Select";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidosCarregados: 0,
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: [],
    };
  }

  filtrar(filtro) {
    let pedidosPrioritarios = [];
    let pedidosNoPrazoLimite = [];
    let pedidosNoPrazoRegular = [];
    this.setState({ pedidosCarregados: 0 });
    getTerceirizadaPedidosDeInversoes(filtro).then((response) => {
      pedidosPrioritarios = filtraPrioritarios(response.results);
      pedidosNoPrazoLimite = filtraNoLimite(response.results);
      pedidosNoPrazoRegular = filtraRegular(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosNoPrazoLimite,
        pedidosNoPrazoRegular,
        pedidosCarregados: this.state.pedidosCarregados + 1,
      });
    });
  }

  componentDidMount() {
    this.filtrar(FiltroEnum.SEM_FILTRO);
  }

  onFiltroSelected(value) {
    switch (value) {
      case FiltroEnum.HOJE:
        this.filtrarHoje();
        break;
      default:
        this.filtrar(value);
        break;
    }
  }

  render() {
    const {
      pedidosCarregados,
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular,
    } = this.state;
    const {
      visaoPorCombo,
      valorDoFiltro,
      pedidosAutorizados,
      pedidosReprovados,
    } = this.props;

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
                  <div className="offset-6 col-3 text-end">
                    <Field
                      component={Select}
                      name="visao_por"
                      naoDesabilitarPrimeiraOpcao
                      onChange={(event) =>
                        this.onFiltroSelected(event.target.value)
                      }
                      placeholder={"Filtro por"}
                      options={visaoPorCombo}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-12">
                    <CardInversaoPendenciaAprovacao
                      titulo={
                        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                      }
                      tipoDeCard={TIPODECARD.PRIORIDADE}
                      pedidos={pedidosPrioritarios}
                      ultimaColunaLabel={"Data"}
                    />
                  </div>
                </div>
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardInversaoPendenciaAprovacao
                        titulo={"Solicitações no prazo limite"}
                        tipoDeCard={TIPODECARD.NO_LIMITE}
                        pedidos={pedidosNoPrazoLimite}
                        ultimaColunaLabel={"Data"}
                      />
                    </div>
                  </div>
                )}
                {valorDoFiltro !== "hoje" && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardInversaoPendenciaAprovacao
                        titulo={"Solicitações no prazo regular"}
                        tipoDeCard={TIPODECARD.REGULAR}
                        pedidos={pedidosNoPrazoRegular}
                        ultimaColunaLabel={"Data"}
                      />
                    </div>
                  </div>
                )}
                {pedidosAutorizados.length > 0 && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardHistorico
                        pedidos={formatarPedidos(pedidosAutorizados)}
                        ultimaColunaLabel={"Data(s)"}
                        titulo={
                          "Histórico de Inversões de cardápio Autorizadas"
                        }
                      />
                    </div>
                  </div>
                )}
                {pedidosReprovados.length > 0 && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardHistorico
                        pedidos={formatarPedidos(pedidosReprovados)}
                        ultimaColunaLabel={"Data(s)"}
                        titulo={"Histórico de Inversões de cardápio reprovadas"}
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
