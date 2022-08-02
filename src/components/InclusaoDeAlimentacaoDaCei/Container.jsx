import React, { Component } from "react";
import { getMotivosInclusaoNormal } from "../../services/inclusaoDeAlimentacao";
import { meusDados } from "../../services/perfil.service";
import { getDiasUteis } from "../../services/diasUteis.service";
import { dataParaUTC } from "../../helpers/utilities";
import InclusaoDeAlimentacaoDaCei from ".";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      motivos: [],
      periodos: [],
      proximos_dois_dias_uteis: null,
      proximos_cinco_dias_uteis: null
    };
  }

  componentDidMount() {
    meusDados().then(response => {
      const meusDados = response;
      this.setState({
        meusDados,
        periodos: response.vinculo_atual.instituicao.periodos_escolares
      });
    });

    // TODO: precisa ter Cei?
    getMotivosInclusaoNormal().then(response => {
      const motivos = response.data.results;
      this.setState({
        motivos
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
    return <InclusaoDeAlimentacaoDaCei {...this.state} />;
  }
}

export default Container;
