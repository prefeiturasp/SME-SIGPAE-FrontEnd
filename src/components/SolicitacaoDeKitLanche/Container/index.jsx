import React, { Component } from "react";
import { getDiasUteis } from "../../../services/diasUteis.service";
import { dataParaUTC } from "../../../helpers/utilities";
import SolicitacaoDeKitLanche from "./base";
import { meusDados } from "services/perfil.service";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      proximos_dois_dias_uteis: null,
      proximos_cinco_dias_uteis: null,
      enumKits: null
    };
  }

  componentDidMount() {
    meusDados().then(response => {
      this.setState({
        meusDados: response
      });
    });

    getDiasUteis().then(response => {
      const proximos_cinco_dias_uteis = dataParaUTC(
        new Date(response.data.proximos_cinco_dias_uteis)
      );
      const proximos_dois_dias_uteis = dataParaUTC(
        new Date(response.data.proximos_dois_dias_uteis)
      );
      this.setState({
        proximos_dois_dias_uteis,
        proximos_cinco_dias_uteis
      });
    });
  }

  render() {
    const { meusDados } = this.state;
    return meusDados ? (
      <SolicitacaoDeKitLanche {...this.state} {...this.props} />
    ) : (
      <div>Carregando...</div>
    );
  }
}

export default Container;
