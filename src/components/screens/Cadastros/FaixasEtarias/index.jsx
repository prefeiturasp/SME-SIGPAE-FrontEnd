import React, { Component } from "react";

import { toastError, toastSuccess } from "../../../Shareable/Toast/dialogs";

import {
  criarFaixasEtarias,
  getFaixasEtarias,
} from "../../../../services/faixaEtaria.service";

import FaixasEtariasEditar from "./Editar";
import FaixasEtariasExibir from "./Exibir";
import ModalJustificativa from "./ModalJustificativa";
import ModalAvisoRedefinicao from "./ModalAvisoRedefinicao";

export default class FaixasEtarias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faixasEtarias: [],
      carregando: true,
      editar: false,
      redefinir: false,
      justificativa: undefined,
      mostrarModalJustificativa: false,
      mostrarModalAvisoRedefinicao: false,
    };
    this.onCancelarRedefinicao = this.onCancelarRedefinicao.bind(this);
    this.onFecharModalAvisoRedefinicao =
      this.onFecharModalAvisoRedefinicao.bind(this);
    this.onFecharModalJustificativa =
      this.onFecharModalJustificativa.bind(this);
    this.onFinalizarComJustificativa =
      this.onFinalizarComJustificativa.bind(this);
    this.onFinalizarEdicao = this.onFinalizarEdicao.bind(this);
    this.onRedefinir = this.onRedefinir.bind(this);
  }

  componentDidMount() {
    this.carregarFaixasEtarias();
  }

  carregarFaixasEtarias = async () => {
    const resposta = await getFaixasEtarias();
    if (resposta.status !== 200) {
      toastError(
        `Não foi possível carregar as faixas etárias: ${resposta.status} - ${resposta.data}`,
      );
    }
    this.setState({
      carregando: false,
      faixasEtarias: resposta.data.results,
      editar: resposta.data.results.length === 0,
    });
  };

  criarFaixasEtarias = async (faixasEtarias, justificativa) => {
    const resposta = await criarFaixasEtarias(faixasEtarias, justificativa);
    if (resposta.status === 201) {
      if (this.state.redefinir) {
        toastSuccess(
          "Redefinição de Novas Faixas Etárias Efetuado com Sucesso",
        );
      } else {
        toastSuccess("Cadastro de Faixas Etárias Efetuado com Sucesso");
      }
      this.setState({
        editar: false,
        redefinir: false,
        mostrarModalJustificativa: false,
      });
    } else {
      toastError(
        `Erro ao enviar os dados para o servidor: ${resposta.status} - ${resposta.data}`,
      );
    }
  };

  onCancelarRedefinicao() {
    this.setState({
      mostrarModalAvisoRedefinicao: false,
      editar: false,
      redefinir: false,
    });
  }

  onFecharModalAvisoRedefinicao() {
    this.setState({
      mostrarModalAvisoRedefinicao: false,
    });
  }

  onFecharModalJustificativa() {
    this.setState({
      mostrarModalJustificativa: false,
    });
  }

  onFinalizarComJustificativa(justificativa) {
    this.criarFaixasEtarias(this.state.faixasEtarias, justificativa);
  }

  onFinalizarEdicao(faixasEtarias) {
    if (this.state.redefinir) {
      this.setState({ faixasEtarias, mostrarModalJustificativa: true });
    } else {
      this.setState({ faixasEtarias });
      this.criarFaixasEtarias(faixasEtarias, "Primeiro cadastro");
    }
  }

  onRedefinir() {
    this.setState({
      mostrarModalAvisoRedefinicao: true,
      editar: true,
      redefinir: true,
    });
  }

  render() {
    const {
      carregando,
      editar,
      faixasEtarias,
      mostrarModalAvisoRedefinicao,
      mostrarModalJustificativa,
    } = this.state;
    if (carregando) return "";
    return (
      <div className="card mt-3 faixas-etarias">
        <div className="card-body">
          <ModalJustificativa
            showModal={mostrarModalJustificativa}
            closeModal={this.onFecharModalJustificativa}
            onSubmit={this.onFinalizarComJustificativa}
          />
          <ModalAvisoRedefinicao
            showModal={mostrarModalAvisoRedefinicao}
            closeModal={this.onFecharModalAvisoRedefinicao}
            onCancelar={this.onCancelarRedefinicao}
          />
          {editar ? (
            <FaixasEtariasEditar
              onFinalizar={this.onFinalizarEdicao}
              onCancelar={this.onCancelarRedefinicao}
              redefinir={this.state.redefinir}
            />
          ) : (
            <FaixasEtariasExibir
              faixasEtarias={faixasEtarias}
              onRedefinir={this.onRedefinir}
            />
          )}
        </div>
      </div>
    );
  }
}
