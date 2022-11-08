import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum, TIPODECARD, TIPO_SOLICITACAO } from "constants/shared";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  ordenarPedidosDataMaisRecente
} from "../../../../helpers/painelPedidos";
import { dataAtualDDMMYYYY, safeConcatOn } from "../../../../helpers/utilities";
import { Select } from "../../../Shareable/Select";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: [],
      loading: true
    };
  }

  async atualizarDadosDasInclusoes(filtro) {
    const [avulsas, continuas, cei] = await Promise.all([
      codaeListarSolicitacoesDeInclusaoDeAlimentacao(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL
      ),
      codaeListarSolicitacoesDeInclusaoDeAlimentacao(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
      ),
      codaeListarSolicitacoesDeInclusaoDeAlimentacao(
        filtro,
        TIPO_SOLICITACAO.SOLICITACAO_CEI
      )
    ]);
    const inclusoes = safeConcatOn("results", avulsas, continuas, cei);
    const pedidosPrioritarios = ordenarPedidosDataMaisRecente(
      filtraPrioritarios(inclusoes)
    );
    const pedidosNoPrazoLimite = ordenarPedidosDataMaisRecente(
      filtraNoLimite(inclusoes)
    );
    const pedidosNoPrazoRegular = ordenarPedidosDataMaisRecente(
      filtraRegular(inclusoes)
    );
    this.setState({
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular,
      loading: false
    });
  }

  filtrar(filtro) {
    this.atualizarDadosDasInclusoes(filtro);
  }

  async componentDidMount() {
    const filtro = FiltroEnum.SEM_FILTRO;
    this.atualizarDadosDasInclusoes(filtro);
  }

  render() {
    const {
      loading,
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular
    } = this.state;
    const { visaoPorCombo, valorDoFiltro } = this.props;
    return (
      <div>
        {loading ? (
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
                      onChange={event => this.filtrar(event.target.value)}
                      placeholder={"Filtro por"}
                      options={visaoPorCombo}
                    />
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
                      ultimaColunaLabel={"Data da Inclusão"}
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
                        ultimaColunaLabel={"Data da Inclusão"}
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
                        ultimaColunaLabel={"Data da Inclusão"}
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
  enableReinitialize: true
})(PainelPedidos);
const selector = formValueSelector("painelPedidos");
const mapStateToProps = state => {
  return {
    valorDoFiltro: selector(state, "visao_por")
  };
};

export default connect(mapStateToProps)(PainelPedidosForm);
