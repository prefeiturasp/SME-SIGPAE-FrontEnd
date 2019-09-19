import React, { Component } from "react";
import { visaoPorComboSomenteDatas } from "../../../../constants/painelPedidos.constants";
import PainelPedidos from "../PainelPedidos";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visaoPorCombo: visaoPorComboSomenteDatas
    };
  }

  render() {
    return <PainelPedidos {...this.state} />;
  }
}

export default Container;
