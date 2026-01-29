import React, { Component } from "react";
import { CardKit } from "./CardKit";
import { getKitLanches } from "../../../../services/kitLanche";
import { TEMPO_PASSEIO } from "../../../../constants/shared";
import "./style.scss";

export class OpcoesKits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kitsLanche: null,
      kitsChecked: [],
    };
    this.onCardChange = this.onCardChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.kitsLanche) {
      getKitLanches().then((response) => {
        this.setState({
          kitsLanche: response.data.results,
        });
      });
    } else {
      this.setState({ kitsLanche: this.props.kitsLanche });
    }
  }

  componentDidUpdate(prevProps) {
    this.iteracaoEntreTempoPasseioECards(prevProps);
  }

  iteracaoEntreTempoPasseioECards(prevProps) {
    if (
      this.props.tempoPasseio === TEMPO_PASSEIO.QUATRO_HORAS &&
      (prevProps.tempoPasseio === TEMPO_PASSEIO.CINCO_A_SETE_HORAS ||
        prevProps.tempoPasseio === TEMPO_PASSEIO.OITO_HORAS_OU_MAIS ||
        prevProps.tempoPasseio === "")
    ) {
      this.setState({ kitsChecked: [] });
      this.props.updateKitsChecked([]);
    } else if (
      this.props.tempoPasseio === TEMPO_PASSEIO.CINCO_A_SETE_HORAS &&
      (prevProps.tempoPasseio === TEMPO_PASSEIO.OITO_HORAS_OU_MAIS ||
        prevProps.tempoPasseio === "")
    ) {
      this.setState({ kitsChecked: [] });
      this.props.updateKitsChecked([]);
    } else if (
      prevProps.kitsChecked &&
      this.props.kitsChecked &&
      this.props.kitsChecked.length !== prevProps.kitsChecked.length
    ) {
      this.setState({ kitsChecked: this.props.kitsChecked });
    }
  }

  onCardChange(uuid) {
    this.setState((prevState) => {
      const kitsChecked = prevState.kitsChecked.includes(uuid)
        ? prevState.kitsChecked.filter((id) => id !== uuid)
        : [...prevState.kitsChecked, uuid];

      this.props.updateKitsChecked(kitsChecked);

      return { kitsChecked };
    });
  }

  render() {
    const { kitsLanche, kitsChecked } = this.state;
    return (
      <div className="kits-options mt-3">
        <p className="label">Selecione a opção desejada</p>
        <div className="row">
          {kitsLanche &&
            kitsLanche.map((kitLanche, key) => {
              return (
                kitLanche.status !== "INATIVO" && (
                  <div key={key} className="col-lg-4 col-md-12">
                    <CardKit
                      onCardChange={this.onCardChange}
                      kitLanche={kitLanche}
                      kitsChecked={kitsChecked}
                      numeroKit={key}
                      checked={kitsChecked.includes(kitLanche.uuid)}
                      {...this.props}
                    />
                  </div>
                )
              );
            })}
        </div>
      </div>
    );
  }
}

export default OpcoesKits;
