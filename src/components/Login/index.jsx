import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import { Modal } from "react-bootstrap";
import {
  length,
  required,
  rfOuCpfOuCodOperador,
  semCaracteresEspeciais,
} from "src/helpers/fieldValidators";
import authService from "src/services/auth";
import {
  atualizarSenhaLogado,
  recuperaSenha,
  setUsuario,
} from "src/services/perfil.service";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { InputPassword } from "src/components/Shareable/Input/InputPassword";
import Select from "src/components/Shareable/Select";
import RequisitosSenha from "src/components/Shareable/RequisitosSenha";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { TIPOS_EMAIL_CADASTRO, TABS } from "./constans";
import "./style.scss";
import { validarForm } from "./validar";
import {
  fieldCnpj,
  fieldCpf,
} from "src/components/screens/Cadastros/CadastroEmpresa/helper";
import { composeValidators, deepCopy } from "src/helpers/utilities";
import { Form, Field as FieldFF } from "react-final-form";
import { getError } from "../../helpers/utilities";

const TOOLTIP_CPF = `Somente números`;
const TOOLTIP_CNPJ = `Somente números`;
const TOOLTIP_RF = `Somente números`;
const TOOLTIP_SENHA = `Pelo menos 8 caracteres, uma letra e um número" e ícone de "olho" onde ao clicar irá mostrar e ocular a senha.`;

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarCadastro: false,
      termos: false,
      habilitarCampos: false,
      email_recuperacao: "",
      bloquearBotao: false,
      width: null,
      componenteAtivo: this.COMPONENTE.LOGIN,
      tab: TABS.ESCOLA,
      showModal: false,
    };
    this.emailInput = React.createRef();
  }

  COMPONENTE = {
    LOGIN: 0,
    RECUPERAR_SENHA: 1,
    CADASTRAR: 2,
    RECUPERACAO_SENHA_OK: 3,
    RECUPERACAO_SENHA_NAO_OK: 4,
    PRIMEIRO_ACESSO: 5,
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab") || TABS.ESCOLA;
    this.setState({
      tab,
      componenteAtivo:
        tab === TABS.TERCEIRIZADAS
          ? this.COMPONENTE.CADASTRAR
          : tab === TABS.PRIMEIRO_ACESSO
          ? this.COMPONENTE.PRIMEIRO_ACESSO
          : this.COMPONENTE.LOGIN,
    });
  }

  componentDidUpdate() {
    if (this.emailInput.current && !this.state.width) {
      const width = this.emailInput.current.offsetWidth;
      this.setState({ width });
    }
  }

  onTermosClicked() {
    const termos = !this.state.termos;
    this.props.change("termos", termos);
    this.setState({ termos });
  }

  handleSubmit = async (values) => {
    const { login, password } = values;
    if (login && password) {
      await authService.login(login, password);
    }
  };

  handleAtualizarSenhaPrimeiroAcesso = async (values) => {
    if (values.senha !== values.confirmar_senha) {
      return;
    }
    const values_ = deepCopy(values);
    values_["senha_atual"] = localStorage.getItem("senhaAtual");
    const response = await atualizarSenhaLogado(values_);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Senha atualizada com sucesso!");
      localStorage.removeItem("senhaAtual");
      this.setState({ componenteAtivo: this.COMPONENTE.LOGIN });
    } else {
      toastError(response.data.detail);
    }
  };

  handleRecuperaSenha = (values) => {
    recuperaSenha(values.recuperar_login).then((resp) => {
      if (resp.status === HTTP_STATUS.OK) {
        this.setState({
          componenteAtivo: this.COMPONENTE.RECUPERACAO_SENHA_OK,
          email_recuperacao: resp.data.email,
        });
      } else {
        this.setState({
          componenteAtivo: this.COMPONENTE.RECUPERACAO_SENHA_NAO_OK,
        });
      }
    });
  };

  handleSubmitCadastro = (values) => {
    const erro = validarForm(values, this.state);
    if (erro) {
      toastError(erro);
    } else {
      this.setState({ bloquearBotao: true });
      const newValues = Object.assign({}, values);
      if (this.state.tab === TABS.DRE_CODAE) {
        if (newValues["tipo_email"] === 0 || newValues["tipo_email"] === "0") {
          newValues["email"] = newValues["email"] + "@sme.prefeitura.sp.gov.br";
        }
        if (newValues["tipo_email"] === 1 || newValues["tipo_email"] === "1") {
          newValues["email"] = newValues["email"] + "@prefeitura.sp.gov.br";
        }
      }
      setUsuario(newValues).then((response) => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(
            `Cadastro efetuado com sucesso!${
              this.state.tab === TABS.ESCOLA ||
              this.state.tab === TABS.DRE_CODAE
                ? " Confirme seu e-mail para poder se logar."
                : ""
            }`
          );
          this.setState({
            bloquearBotao: false,
            componenteAtivo: this.COMPONENTE.LOGIN,
          });
        } else {
          toastError(getError(response.data.detail));
          this.setState({ bloquearBotao: false });
        }
      });
    }
  };

  switchTab(tab) {
    this.setState({ tab });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  renderLogin() {
    const { handleSubmit, submitting } = this.props;
    const { bloquearBotao, showModal } = this.state;
    return (
      <div className="form">
        <Modal
          show={showModal}
          onHide={this.closeModal.bind(this)}
          dialogClassName="modal-como-acessar"
        >
          <Modal.Header closeButton>
            <Modal.Title>Como acessar o SIGPAE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-4">
                <div className="flex-card">
                  <div className="titulo">Servidor Municipal</div>
                  <div className="icone">
                    <i className="fas fa-chalkboard-teacher" />
                  </div>
                  <div className="texto">
                    Acesse com seu <strong>RF</strong> de 7 dígitos
                  </div>
                  <div className="rodape">
                    A <strong>senha</strong> é a mesma de acesso ao Plateia e ao
                    SGP
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="flex-card">
                  <div className="titulo">Fornecedor ou Distribuidor</div>
                  <div className="icone">
                    <i className="fas fa-truck" />
                  </div>
                  <div className="texto">
                    Acesse com seu <strong>CPF</strong> de 11 dígitos
                  </div>
                  <div className="rodape">
                    A <strong>senha</strong> é a cadastrada no primeiro acesso
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="flex-card">
                  <div className="titulo">Rede Parceira</div>
                  <div className="icone">
                    <i className="fas fa-hotel" />
                  </div>
                  <div className="texto">
                    Acesse com seu <strong>CPF</strong> de 11 dígitos
                  </div>
                  <div className="rodape">
                    A <strong>senha</strong> é a cadastrada no primeiro acesso
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <form className="login" onSubmit={handleSubmit(this.handleSubmit)}>
          <p className="como-acessar text-end">
            <span onClick={() => this.openModal()}>Como Acessar?</span>
          </p>
          <Field
            component={InputText}
            className="input-login"
            esconderAsterisco
            label="Usuário"
            name="login"
            placeholder={"Digite seu RF ou CPF ou Código Operador"}
            required
            type="text"
            maxlength="11"
            validate={[required, rfOuCpfOuCodOperador]}
          />
          <Field
            component={InputPassword}
            className="input-login"
            esconderAsterisco
            label="Senha"
            name="password"
            placeholder={"Digite sua Senha"}
            required
            validate={required}
          />
          <Botao
            className="col-12 btn-acessar"
            style={BUTTON_STYLE.GREEN}
            texto="Acessar"
            disabled={submitting || bloquearBotao}
            type={BUTTON_TYPE.SUBMIT}
          />
          <p className="mt-3 text-center">
            <Link
              className="hyperlink"
              to="#"
              data-cy="esqueci-senha"
              onClick={() =>
                this.setState({
                  componenteAtivo: this.COMPONENTE.RECUPERAR_SENHA,
                })
              }
            >
              Esqueci minha senha
            </Link>
          </p>
        </form>
      </div>
    );
  }

  renderCadastro() {
    const { handleSubmit } = this.props;
    const { bloquearBotao, tab } = this.state;
    return (
      <div className="signup-form">
        <div className="tabs d-md-block d-none">
          <div className="row">
            <div
              onClick={() => this.switchTab(TABS.ESCOLA)}
              className={`tab col-4 ${
                tab === TABS.ESCOLA ? "active" : "inactive"
              }`}
            >
              {TABS.ESCOLA}
            </div>
            <div
              onClick={() => this.switchTab(TABS.DRE_CODAE)}
              className={`tab col-4 ${
                tab === TABS.DRE_CODAE ? "active" : "inactive"
              }`}
            >
              {TABS.DRE_CODAE}
            </div>
            <div
              onClick={() => this.switchTab(TABS.TERCEIRIZADAS)}
              className={`tab col-4 ${
                tab === TABS.TERCEIRIZADAS ? "active" : "inactive"
              }`}
            >
              {TABS.TERCEIRIZADAS}
            </div>
          </div>
        </div>
        <div className="input-group-append d-block d-md-none col-md-6 col-12">
          <Field
            component={Select}
            name="tipo_cadastro"
            label="Tipo de Cadastro"
            options={[
              {
                nome: "ESCOLA",
              },
              {
                nome: "DRE/CODAE",
              },
              {
                nome: "EMPRESA",
              },
            ]}
            onChange={(evt) => {
              this.switchTab(evt.target.value);
            }}
            naoDesabilitarPrimeiraOpcao
          />
        </div>
        <div className="form">
          <form onSubmit={handleSubmit(this.handleSubmitCadastro)}>
            {tab === TABS.DRE_CODAE && (
              <div className="row">
                <div className="input-group email-sme">
                  <div ref={this.emailInput} className="col-12 col-md-6">
                    <Field
                      component={InputText}
                      placeholder={"Início do seu E-mail SME"}
                      label="E-mail"
                      name="email"
                      required
                      type="text"
                      validate={[required, semCaracteresEspeciais]}
                    />
                  </div>
                  <div className="input-group-append d-none d-md-flex col-md-6">
                    <Field
                      component={Select}
                      name="tipo_email"
                      options={TIPOS_EMAIL_CADASTRO}
                      required
                      validate={required}
                      naoDesabilitarPrimeiraOpcao
                      width={this.state.width}
                    />
                  </div>
                  <div className="input-group-append d-block d-md-none col-md-6">
                    <Field
                      component={Select}
                      name="tipo_email"
                      label="Tipo de e-mail"
                      options={TIPOS_EMAIL_CADASTRO}
                      required
                      validate={required}
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                </div>
              </div>
            )}
            {(tab === TABS.TERCEIRIZADAS || tab === TABS.ESCOLA) && (
              <div className="row">
                <div className="col-12">
                  <Field
                    component={InputText}
                    placeholder={"seu_email@dominio.com"}
                    label="E-mail"
                    name="email"
                    required
                    type="email"
                    validate={[required]}
                  />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-12 col-md-6">
                <Field
                  {...fieldCpf}
                  component={InputText}
                  label="CPF"
                  name="cpf"
                  placeholder={"Digite seu CPF"}
                  tooltipText={TOOLTIP_CPF}
                  required
                  type="text"
                  validate={required}
                />
              </div>
              {(tab === TABS.ESCOLA || tab === TABS.DRE_CODAE) && (
                <div className="col-12 col-md-6">
                  <Field
                    component={InputText}
                    label="Nº RF"
                    name="registro_funcional"
                    placeholder={"Digite seu RF"}
                    tooltipText={TOOLTIP_RF}
                    required
                    type="text"
                    pattern="\d*"
                    title="somente números"
                    maxlength="7"
                    validate={[required, length(7)]}
                  />
                </div>
              )}
              {tab === TABS.TERCEIRIZADAS && (
                <div className="col-12 col-md-6">
                  <Field
                    {...fieldCnpj}
                    component={InputText}
                    label="CNPJ"
                    name="cnpj"
                    placeholder={"Digite o CNPJ da Empresa"}
                    tooltipText={TOOLTIP_CNPJ}
                    required
                    type="text"
                    validate={[required]}
                  />
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <Field
                  component={InputPassword}
                  label="Senha"
                  name="password"
                  placeholder={"******"}
                  tooltipText={TOOLTIP_SENHA}
                  required
                  validate={required}
                  pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                  title="Pelo menos 8 caracteres, uma letra e um número"
                />
              </div>
              <div className="col-12 col-md-6">
                <Field
                  component={InputPassword}
                  label="Confirme sua senha"
                  name="confirmar_password"
                  placeholder={"******"}
                  required
                  validate={required}
                />
              </div>
            </div>
            <div className="alinha-direita mt-3 ms-4">
              <Botao
                style={BUTTON_STYLE.GREEN_OUTLINE}
                texto="Cancelar"
                className="col-md-2 ms-3"
                disabled={bloquearBotao}
                onClick={() =>
                  this.setState({ componenteAtivo: this.COMPONENTE.LOGIN })
                }
              />
              <Botao
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                texto="Cadastrar"
                className="col-md-2 ms-3"
                disabled={bloquearBotao}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
  renderRecuperacaoOK() {
    return (
      <div className="mt-4">
        <center>
          <div className="mt-3">
            <div className="alerta-verde mt-2">
              <i className="far fa-check-circle" />
              <p>E-mail de recuperação enviado com sucesso</p>
            </div>
            <p className="mt-1">
              {`O link de recuperação de senha foi enviado para
            ${this.state.email_recuperacao}`}
            </p>
            <p className="mt-2">Verifique sua caixa de entrada ou spam</p>
          </div>
        </center>
        <center className="mt-4">
          <Botao
            className="col-sm-4 col-8"
            style={BUTTON_STYLE.GREEN}
            texto="Voltar ao Início"
            type={BUTTON_TYPE.SUBMIT}
            onClick={() =>
              this.setState({ componenteAtivo: this.COMPONENTE.LOGIN })
            }
          />
        </center>
      </div>
    );
  }

  renderRecuperacaoNOK() {
    return (
      <div className="mt-4">
        <center className="mt-4">
          <div className="mt-3">
            <div className="alerta-vermelho mt-2">
              <i className="far fa-times-circle" />
              <p>Usuário não encontrado</p>
            </div>
            <p className="mt-1">
              Não encontramos o usuário informado. Procure o responsável pelo
              sistema na sua Unidade
            </p>
          </div>
        </center>
        <center>
          <Botao
            className="col-sm-4 col-6"
            style={BUTTON_STYLE.GREEN}
            texto="Voltar ao Início"
            type={BUTTON_TYPE.SUBMIT}
            onClick={() =>
              this.setState({ componenteAtivo: this.COMPONENTE.LOGIN })
            }
          />
        </center>
      </div>
    );
  }

  renderEsqueciSenha() {
    return (
      <div className="form">
        <div className="texto-simples mt-3">
          <span className="texto-simples-verde fw-bold">
            Servidor Municipal: &nbsp;
          </span>
          Digite seu <strong>RF</strong>.
        </div>
        <div className="texto-simples mt-3">
          <span className="texto-simples-verde fw-bold">
            Fornecedor ou Distribuidor: &nbsp;
          </span>
          Digite seu <strong>CPF</strong>.
        </div>
        <div className="texto-simples mt-3">
          <span className="texto-simples-verde fw-bold">
            Rede Parceira: &nbsp;
          </span>
          Digite seu <strong>CPF</strong>.
        </div>
        <Form
          onSubmit={this.handleRecuperaSenha}
          initialValues={{}}
          validate={() => {}}
          render={({ values }) => {
            return (
              <>
                <form className="login mt-3">
                  <FieldFF
                    component={InputText}
                    className="input-login"
                    esconderAsterisco
                    label="Usuário"
                    name="recuperar_login"
                    placeholder={"Digite seu RF ou CPF ou Código Operador"}
                    required
                    type="number"
                    maxlength="11"
                    validate={composeValidators(required, rfOuCpfOuCodOperador)}
                  />
                </form>

                <div className="alinha-direita">
                  <Botao
                    className="col-md-3 ms-3"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    texto="Cancelar"
                    type={BUTTON_TYPE.SUBMIT}
                    onClick={() =>
                      this.setState({ componenteAtivo: this.COMPONENTE.LOGIN })
                    }
                  />
                  <Botao
                    className="col-md-3 ms-3"
                    style={BUTTON_STYLE.GREEN}
                    texto="Continuar"
                    type={BUTTON_TYPE.SUBMIT}
                    onClick={() => this.handleRecuperaSenha(values)}
                    disabled={
                      !values.recuperar_login ||
                      (values.recuperar_login.length !== 7 &&
                        values.recuperar_login.length !== 11)
                    }
                  />
                </div>
              </>
            );
          }}
        />

        <p className="texto-simples mt-4">
          Você receberá um e-mail com as orientações para redefinição da sua
          senha.
        </p>
        <p className="texto-simples mt-4">
          Caso você não tenha cadastro ou não tenha mais acesso ao e-mail
          cadastrado, procure o responsável pelo SIGPAE na sua unidade.
        </p>
      </div>
    );
  }

  renderPrimeiroAcesso() {
    return (
      <div className="form primeiro-acesso">
        <Form
          onSubmit={this.handleAtualizarSenhaPrimeiroAcesso}
          initialValues={{}}
          validate={() => {}}
          render={({ handleSubmit, values }) => {
            const letra = values.senha
              ? values.senha.match(/[a-zA-Z]/g)
              : false;
            const numero = values.senha ? values.senha.match(/[0-9]/g) : false;
            const tamanho = values.senha ? values.senha.length >= 8 : false;
            return (
              <form onSubmit={handleSubmit}>
                <p className="mb-0">
                  Seja bem-vindo(a) ao <strong>SIGPAE</strong>
                </p>
                <p>SISTEMA DE GESTÂO DO PROGRAMA DE ALIMENTAÇÂO ESCOLAR!</p>
                <p className="fw-bold">Atualize sua senha de acesso:</p>
                <div className="row">
                  <div className="col-12">
                    <FieldFF
                      component={InputPassword}
                      label="Nova Senha"
                      name="senha"
                      placeholder={"Digite uma nova senha de acesso"}
                      onChange={(event) =>
                        this.onSenhaChanged(event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <FieldFF
                      component={InputPassword}
                      label="Confirmação da Nova Senha"
                      name="confirmar_senha"
                      placeholder={"Confirme a senha digitada"}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Botao
                      className="w-100 my-2"
                      style={BUTTON_STYLE.GREEN}
                      texto="Confirmar"
                      disabled={!letra || !numero || !tamanho}
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        this.handleAtualizarSenhaPrimeiroAcesso(values);
                      }}
                    />
                    {values.senha &&
                      values.confirmar_senha &&
                      values.senha !== values.confirmar_senha && (
                        <div className="error-or-warning-message mb-3">
                          <div className="error-message">
                            As senhas não conferem!
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <RequisitosSenha
                  letra={letra}
                  numero={numero}
                  tamanho={tamanho}
                />
              </form>
            );
          }}
        />
      </div>
    );
  }

  renderSwitch(param) {
    switch (param) {
      case this.COMPONENTE.LOGIN:
        return this.renderLogin();
      case this.COMPONENTE.CADASTRAR:
        return this.renderCadastro();
      case this.COMPONENTE.RECUPERAR_SENHA:
        return this.renderEsqueciSenha();
      case this.COMPONENTE.RECUPERACAO_SENHA_OK:
        return this.renderRecuperacaoOK();
      case this.COMPONENTE.RECUPERACAO_SENHA_NAO_OK:
        return this.renderRecuperacaoNOK();
      case this.COMPONENTE.PRIMEIRO_ACESSO:
        return this.renderPrimeiroAcesso();
      default:
        return this.renderLogin();
    }
  }

  renderLogoTexto(texto) {
    return (
      <div className="logo-sigpae">
        <img src="/assets/image/logo-sigpae-com-texto.png" alt="" />
        {texto && <div className="titulo">{texto}</div>}
      </div>
    );
  }

  renderLogoSwitch(param) {
    switch (param) {
      case this.COMPONENTE.RECUPERAR_SENHA:
        return this.renderLogoTexto("Recuperação de Senha");
      case this.COMPONENTE.RECUPERACAO_SENHA_OK:
        return this.renderLogoTexto("Recuperação de Senha");
      case this.COMPONENTE.RECUPERACAO_SENHA_NAO_OK:
        return this.renderLogoTexto("Recuperação de Senha");
      case this.COMPONENTE.PRIMEIRO_ACESSO:
        return this.renderLogoTexto("Primeiro Acesso");
      default:
        return this.renderLogoTexto();
    }
  }

  render() {
    const { componenteAtivo } = this.state;

    return (
      <div>
        <div className="login-bg" />
        <div className="right-half">
          <div className="container my-auto">
            {this.renderLogoSwitch(componenteAtivo)}
            {this.renderSwitch(componenteAtivo)}
            <div className="logo-prefeitura">
              <img src="/assets/image/EDUCAÇÃO_FUNDO_CLARO.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login = reduxForm({
  form: "login",
  destroyOnUnmount: false,
  initialValues: { tipo_email: 0 },
})(Login);

export default Login;
