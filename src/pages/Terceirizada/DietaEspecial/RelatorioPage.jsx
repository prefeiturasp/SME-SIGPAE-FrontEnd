import React, { Component } from "react";

import { HOME } from "src/constants/config";
import * as constants from "../../configs/constants";
import { statusEnum, TIPO_PERFIL } from "../../constants";

import Botao from "../../components/Shareable/Botao";
import { BUTTON_STYLE } from "../../components/Shareable/Botao/constants";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import Relatorio from "../../../pages/DietaEspecial/Relatorio";
import {
  toastSuccess,
  toastError,
} from "../../components/Shareable/Toast/dialogs";

import "./style.scss";

import {
  getSolicitacaoDietaEspecial,
  terceirizadaTomarCiencia,
} from "../../services/painelNutricionista.service";

export default class RelatorioPage extends Component {
  constructor(props) {
    super(props);
    this.onTerceirizadaTomarCiencia =
      this.onTerceirizadaTomarCiencia.bind(this);
  }

  UNSAFE_componentWillMount = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      const dietaEspecial = await getSolicitacaoDietaEspecial(uuid);
      this.setState({
        dietaEspecial: dietaEspecial.results,
        mostrarBotaoTomarCiencia: true,
      });
    }
  };

  botaoCiencia = (
    <div className="row">
      <div className="col-12">
        <Botao
          style={BUTTON_STYLE.GREEN}
          onClick={this.onTerceirizadaTomarCiencia}
          texto="Ciente"
          className="float-end"
        />
      </div>
    </div>
  );

  onTerceirizadaTomarCiencia = async () => {
    const resposta = await terceirizadaTomarCiencia(this.state.uuid);
    if (resposta.status === 200) {
      toastSuccess(resposta.data.mensagem);
      this.setState({
        mostrarBotaoTomarCiencia: false,
      });
    } else {
      toastError(`Erro ao tomar ciência: ${resposta}`);
    }
  };

  render() {
    const atual = {
      href: "#",
      titulo: "Relatório",
    };
    const anteriores = [
      {
        href: `/${constants.RELATORIOS}`,
        titulo: "Dietas Especiais",
      },
    ];
    const { dietaEspecial, mostrarBotaoTomarCiencia } = this.state;
    const botao =
      localStorage.getItem("tipo_perfil") === TIPO_PERFIL.TERCEIRIZADA &&
      dietaEspecial.status_solicitacao === statusEnum.CODAE_AUTORIZADO &&
      mostrarBotaoTomarCiencia
        ? this.botaoCiencia
        : undefined;
    return (
      <Page>
        <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
        <Relatorio {...this.props} botoes={botao} />
      </Page>
    );
  }
}
