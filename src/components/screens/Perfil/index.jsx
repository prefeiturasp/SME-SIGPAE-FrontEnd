import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import {
  meusDados,
  atualizarSenhaLogado,
} from "../../../services/perfil.service";
import { TIPO_PERFIL, ENTER } from "../../../constants/shared";
import { formataCPFCensurado } from "../../../helpers/utilities";
import InputText from "../../Shareable/Input/InputText";
import "./style.scss";
import ModalAlterarSenha from "./components/ModalAlterarSenha";
import { toastSuccess, toastError } from "../../Shareable/Toast/dialogs";
import retornaAvatar from "src/helpers/retornaAvatar";

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      showModal: false,
    };
    this.abrirModal = this.abrirModal.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    meusDados().then((meusDados) => {
      this.setState({ meusDados });
      this.props.change("email", meusDados.email);
      this.props.change("tipo_email", meusDados.tipo_email);
    });
  }

  abrirModal() {
    this.setState({ showModal: true });
  }

  fecharModal() {
    this.setState({ showModal: false });
  }

  onSubmit(validado) {
    if (!validado) {
      toastError("Preencha os requisitos de segurança da senha");
    } else {
      const { senha_atual, senha, confirmar_senha } = this.props;
      const values = {
        senha_atual: senha_atual,
        senha: senha,
        confirmar_senha: confirmar_senha,
      };
      atualizarSenhaLogado(values).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess("Senha atualizada com sucesso!");
          this.props.change("senha_atual", "");
          this.props.change("senha", "");
          this.props.change("confirmar_senha", "");
          this.fecharModal();
        } else {
          toastError(response.data.detail);
        }
      });
    }
  }

  onKeyPress(event) {
    if (event.which === ENTER) {
      event.preventDefault();
    }
  }

  render() {
    const tipo_perfil = localStorage.getItem("tipo_perfil");
    const { meusDados, showModal } = this.state;
    const { handleSubmit, senha } = this.props;
    return (
      <div className="profile">
        {!meusDados ? (
          <div>Carregando...</div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-5 information text-center">
                  <div className="row">
                    <div className="col-12">
                      <div className="avatar">{retornaAvatar()}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="name">{meusDados.nome}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="data">
                        <div>RF: {meusDados.registro_funcional}</div>
                        <div>{meusDados.vinculo_atual.instituicao.nome}</div>
                        {tipo_perfil === TIPO_PERFIL.TERCEIRIZADA && (
                          <div>
                            CPF:{" "}
                            {meusDados.cpf
                              ? formataCPFCensurado(meusDados.cpf)
                              : "Sem CPF"}
                          </div>
                        )}
                        <div>{meusDados.cargo}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-7">
                  <div className="form">
                    <form
                      onSubmit={handleSubmit(this.onSubmit)}
                      onKeyPress={this.onKeyPress}
                    >
                      <div className="row">
                        <div className="col-11">
                          <Field
                            component={InputText}
                            esconderAsterisco
                            label="E-mail"
                            name="email"
                            disabled={true}
                            type="email"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div
                          onClick={this.abrirModal}
                          className="col-12 password"
                        >
                          Alterar senha
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <ModalAlterarSenha
              showModal={showModal}
              closeModal={this.fecharModal}
              onSubmit={this.onSubmit}
              senha={senha}
            />
          </div>
        )}
      </div>
    );
  }
}

Perfil = reduxForm({
  form: "perfil",
  destroyOnUnmount: false,
})(Perfil);

const selector = formValueSelector("perfil");
const mapStateToProps = (state) => {
  return {
    email: selector(state, "email"),
    tipo_email: selector(state, "tipo_email"),
    senha_atual: selector(state, "senha_atual"),
    senha: selector(state, "senha"),
    confirmar_senha: selector(state, "confirmar_senha"),
  };
};

export default connect(mapStateToProps)(Perfil);
