import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum, TIPODECARD } from "../../../../constants/shared";
import { dataAtualDDMMYYYY } from "../../../../helpers/utilities";
import { getDREPedidosDeKitLanche } from "src/services/kitLanche";
import { getLotesSimples } from "src/services/lote.service";
import HTTP_STATUS from "http-status-codes";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd, Spin } from "antd";
import { formatarOpcoesLote } from "src/helpers/utilities";
import { meusDados } from "src/services/perfil.service";
import { CardPendenteAcao } from "../../components/CardPendenteAcao";

const TEMPO_DEBOUNCE_BUSCA = 1500;

const CARDS = [
  {
    chave: "prioritario",
    prazo: "PRIORITARIO",
    titulo: "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
    tipoDeCard: TIPODECARD.PRIORIDADE,
  },
  {
    chave: "limite",
    prazo: "LIMITE",
    titulo: "Solicitações no prazo limite",
    tipoDeCard: TIPODECARD.NO_LIMITE,
  },
  {
    chave: "regular",
    prazo: "REGULAR",
    titulo: "Solicitações no prazo regular",
    tipoDeCard: TIPODECARD.REGULAR,
  },
];

const novoCardData = () => ({
  pedidos: [],
  count: 0,
  page: 1,
  escolasSolicitantes: 0,
  buscando: true,
  busca: "",
});

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      filtros: this.props.filtros || {
        lote: undefined,
      },
      lotes: [],
      prioritario: novoCardData(),
      limite: novoCardData(),
      regular: novoCardData(),
    };
    this.buscaTimeouts = {};
    this.onBusca = this.onBusca.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
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
    CARDS.forEach(({ chave }) =>
      this.filtrarPrazo(chave, {
        filtros: paramsFromPrevPage,
        busca: "",
        page: 1,
      }),
    );
    if (this.props.filtros) {
      this.props.change("lote", this.props.filtros.lote);
    }
  }

  filtrarPrazo(chave, { filtros, busca, page }) {
    const prazo = CARDS.find((card) => card.chave === chave).prazo;
    const params = { ...filtros, page, prazo };
    if (busca) {
      params.busca = busca;
    }
    this.setState({ [chave]: { ...this.state[chave], buscando: true, busca } });
    getDREPedidosDeKitLanche(FiltroEnum.SEM_FILTRO, params).then((data) => {
      this.setState({
        [chave]: {
          pedidos: data.results || [],
          count: data.count || 0,
          escolasSolicitantes: data.escolas_solicitantes || 0,
          page,
          buscando: false,
          busca,
        },
      });
    });
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

  onBusca(chave, termo) {
    this.setState({ [chave]: { ...this.state[chave], busca: termo } });
    clearTimeout(this.buscaTimeouts[chave]);
    this.buscaTimeouts[chave] = setTimeout(() => {
      if (termo.length === 0 || termo.length > 2) {
        this.filtrarPrazo(chave, {
          filtros: this.state.filtros,
          busca: termo,
          page: 1,
        });
      }
    }, TEMPO_DEBOUNCE_BUSCA);
  }

  onPageChange(chave, page) {
    this.filtrarPrazo(chave, {
      filtros: this.state.filtros,
      busca: this.state[chave].busca,
      page,
    });
  }

  componentWillUnmount() {
    Object.values(this.buscaTimeouts).forEach((timeout) =>
      clearTimeout(timeout),
    );
  }

  render() {
    const { lotes } = this.state;
    return (
      <div>
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
                      this.setState({ filtros: filtros_ });
                      CARDS.forEach(({ chave }) =>
                        this.filtrarPrazo(chave, {
                          filtros: filtros_,
                          busca: this.state[chave].busca,
                          page: 1,
                        }),
                      );
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
              {CARDS.map(({ chave, titulo, tipoDeCard }) => {
                const card = this.state[chave];
                return (
                  <div className="row pt-3" key={chave}>
                    <div className="col-12">
                      <Spin spinning={card.buscando}>
                        <CardPendenteAcao
                          titulo={titulo}
                          tipoDeCard={tipoDeCard}
                          pedidos={card.pedidos}
                          totalSolicitacoes={card.count}
                          escolasSolicitantes={card.escolasSolicitantes}
                          page={card.page}
                          onPageChange={(page) =>
                            this.onPageChange(chave, page)
                          }
                          busca={card.busca}
                          onBusca={(termo) => this.onBusca(chave, termo)}
                        />
                      </Spin>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
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
