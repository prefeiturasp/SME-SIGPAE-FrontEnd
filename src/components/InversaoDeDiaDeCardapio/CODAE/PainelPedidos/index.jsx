import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum, TIPODECARD } from "../../../../constants/shared";
import {
  filtraPrioritarios,
  ordenarPedidosDataMaisRecente
} from "../../../../helpers/painelPedidos";
import { dataAtualDDMMYYYY } from "../../../../helpers/utilities";
import { getCODAEPedidosDeInversoes } from "../../../../services/inversaoDeDiaDeCardapio.service";
import Select from "../../../Shareable/Select";
import {
  filtraNoLimite,
  filtraRegular
} from "../../../SolicitacaoDeKitLanche/Container/helper";
import { CardInversaoPendenciaAprovacao } from "../../components/CardPendenteAcao";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: []
    };
  }

  filtrar(filtro) {
    getCODAEPedidosDeInversoes(filtro).then(response => {
      let pedidosPrioritarios = ordenarPedidosDataMaisRecente(
        filtraPrioritarios(response.results)
      );
      let pedidosNoPrazoLimite = ordenarPedidosDataMaisRecente(
        filtraNoLimite(response.results)
      );
      let pedidosNoPrazoRegular = ordenarPedidosDataMaisRecente(
        filtraRegular(response.results)
      );
      this.setState({
        pedidosPrioritarios,
        pedidosNoPrazoLimite,
        pedidosNoPrazoRegular
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
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular
    } = this.state;
    const { visaoPorCombo } = this.props;
    const todosOsPedidosForamCarregados = true;
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
                  <div className="offset-6 col-3 text-right">
                    <Field
                      component={Select}
                      name="visao_por"
                      naoDesabilitarPrimeiraOpcao
                      onChange={event =>
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
  enableReinitialize: true
})(PainelPedidos);
const selector = formValueSelector("painelPedidos");
const mapStateToProps = state => {
  return {
    valorDoFiltro: selector(state, "visao_por")
  };
};

export default connect(mapStateToProps)(PainelPedidosForm);
