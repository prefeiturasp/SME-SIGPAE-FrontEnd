import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { Botao } from "../components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { HeaderLogo } from "src/components/Shareable/HeaderLogo";
import { InfoSenhaServidorMunicipal } from "src/components/Shareable/InfoSenhaServidorMunicipal";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { atualizarSenha } from "src/services/perfil.service";
import "./style.scss";
import RequisitosSenha from "src/components/Shareable/RequisitosSenha";
import InputPassword from "src/components/Shareable/Input/InputPassword";

class RecuperarSenhaPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numero: false,
      tamanho: false,
      letra: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onSenhaChanged(value) {
    const numbers = /[0-9]/g;
    const letters = /[a-zA-Z]/g;
    this.setState({
      numero: value.match(numbers),
      tamanho: value.length >= 8,
      letra: value.match(letters),
    });
  }

  handleSubmit(payLoad) {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const confirmationKey = urlParams.get("confirmationKey");
    atualizarSenha(uuid, confirmationKey, payLoad).then((response) => {
      if (response.status === HTTP_STATUS.OK) {
        this.props.reset();
        toastSuccess("Senha atualizada com sucesso!");
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      } else {
        toastError(response.detail);
      }
    });
  }

  render() {
    const { senha1, senha2, pristine, handleSubmit } = this.props;
    const { letra, numero, tamanho } = this.state;
    const urlParams = new URLSearchParams(window.location.search);
    const visao_perfil = urlParams.get("visao");
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <HeaderLogo />
        <div className="container pt-3">
          <div className="card">
            <div className="card-body alinha-centro">
              <div className="">
                <div className="card-title fw-bold">Alterar Senha</div>
                <Field
                  component={InputPassword}
                  className="input-login"
                  esconderAsterisco
                  label="Senha"
                  name="senha1"
                  placeholder={"Digite sua Senha"}
                  onChange={(event) => this.onSenhaChanged(event.target.value)}
                  maxlength={20}
                  pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                  title="Pelo menos 8 caracteres, uma letra e um número"
                  helpText="Pelo menos 8 caracteres, uma letra e um número"
                  required
                  validate={required}
                />
                <Field
                  component={InputPassword}
                  className="input-login"
                  esconderAsterisco
                  label="Repetir Senha"
                  name="senha2"
                  placeholder={"Digite sua Senha"}
                  onChange={(event) => this.onSenhaChanged(event.target.value)}
                  maxlength={20}
                  pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                  title="Pelo menos 8 caracteres, uma letra e um número"
                  helpText="Pelo menos 8 caracteres, uma letra e um número"
                  required
                  validate={required}
                />
                {visao_perfil && visao_perfil !== "EMPRESA" && (
                  <InfoSenhaServidorMunicipal />
                )}
                <RequisitosSenha
                  letra={letra}
                  numero={numero}
                  tamanho={tamanho}
                />
                <div className="pt-3 text-center">
                  <Botao
                    texto="Confirmar senha"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    disabled={senha1 !== senha2 || pristine}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
const formName = "recuperarSenha";

RecuperarSenhaPage = reduxForm({
  form: formName,
})(RecuperarSenhaPage);

const selector = formValueSelector(formName);

const mapStateToProps = (state) => {
  return {
    senha1: selector(state, "senha1"),
    senha2: selector(state, "senha2"),
  };
};

export default connect(mapStateToProps)(RecuperarSenhaPage);
