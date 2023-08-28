import React, { Component } from "react";
import PainelPedidos from ".";
import { visaoPorComboSomenteDatas } from "../../../../constants/shared";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visaoPorCombo: visaoPorComboSomenteDatas,
      filtros: this.props.filtros,
    };
  }

  render() {
    return <PainelPedidos {...this.state} />;
  }
}

export default Container;
