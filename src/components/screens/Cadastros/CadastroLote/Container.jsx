import { agregarDefault, formatarParaMultiselect } from "helpers/utilities";
import React, { Component } from "react";
import { getDiretoriaregionalSimplissima } from "services/diretoriaRegional.service";
import {
  getEscolasSimplissima,
  getSubprefeituras,
  getTiposGestao,
} from "services/escola.service";
import { meusDados } from "services/perfil.service";
import CadastroLote from ".";
import { formatarEscolasParaMultiselect } from "./helper";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      lotes: [],
      diretoriasRegionais: [],
      escolas: [],
      tiposGestao: [],
      subprefeituras: [],
    };
  }

  componentDidMount() {
    meusDados().then((response) => {
      this.setState({
        meusDados: response,
      });
    });

    getDiretoriaregionalSimplissima().then((response) => {
      this.setState({
        diretoriasRegionais: agregarDefault(response.data.results),
      });
    });

    getTiposGestao().then((response) => {
      this.setState({
        tiposGestao: agregarDefault(response.data.results),
      });
    });

    getSubprefeituras().then((response) => {
      this.setState({
        subprefeituras: formatarParaMultiselect(response.results),
      });
    });
  }

  getEscolasPorDre = async (dre_uuid) => {
    this.setState({
      escolas: [],
    });
    getEscolasSimplissima({ diretoria_regional__uuid: dre_uuid }).then(
      (response) => {
        this.setState({
          escolas: formatarEscolasParaMultiselect(response.results),
        });
      }
    );
  };

  render() {
    return (
      <CadastroLote
        {...this.state}
        {...this.props}
        getEscolasPorDre={this.getEscolasPorDre}
      />
    );
  }
}

export default Container;
