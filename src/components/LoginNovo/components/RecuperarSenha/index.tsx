import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required, rfOuCpfOuCodOperador } from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import { recuperaSenha } from "src/services/perfil.service";

type RecuperarSenhaProps = {
  setComponenteRenderizado: (_componente: string) => void;
};

export const RecuperarSenha = ({ ...props }: RecuperarSenhaProps) => {
  const { setComponenteRenderizado } = props;

  const [emailRecuperadoMascarado, setEmailRecuperadoMascarado] = useState("");

  const onSubmit = async (values: { recuperar_login: string }) => {
    const { recuperar_login } = values;
    const response = await recuperaSenha(recuperar_login);
    if (response.status === HTTP_STATUS.OK) {
      setEmailRecuperadoMascarado(response.data.email);
    } else {
      setEmailRecuperadoMascarado("erro");
    }
  };

  return (
    <>
      {!emailRecuperadoMascarado && (
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
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

                <Field
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

                <div className="alinha-direita">
                  <Botao
                    className="col-md-3 ms-3"
                    texto="Cancelar"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => setComponenteRenderizado("login")}
                  />
                  <Botao
                    className="col-md-3 ms-3"
                    texto="Continuar"
                    style={BUTTON_STYLE.GREEN}
                    type={BUTTON_TYPE.SUBMIT}
                    disabled={submitting}
                  />
                </div>

                <p className="texto-simples mt-4">
                  Você receberá um e-mail com as orientações para redefinição da
                  sua senha.
                </p>
                <p className="texto-simples mt-4">
                  Caso você não tenha cadastro ou não tenha mais acesso ao
                  e-mail cadastrado, procure o responsável pelo SIGPAE na sua
                  unidade.
                </p>
              </div>
            </form>
          )}
        </Form>
      )}
      {emailRecuperadoMascarado && emailRecuperadoMascarado !== "erro" && (
        <div className="mt-4">
          <center>
            <div className="mt-3">
              <div className="alerta-verde mt-2">
                <i className="far fa-check-circle" />
                <p>E-mail de recuperação enviado com sucesso</p>
              </div>
              <p className="mt-1">
                {`O link de recuperação de senha foi enviado para
                  ${emailRecuperadoMascarado}`}
              </p>
              <p className="mt-2">Verifique sua caixa de entrada ou spam</p>
            </div>
          </center>
          <center className="mt-4">
            <Botao
              className="col-sm-4 col-8"
              texto="Voltar ao Início"
              style={BUTTON_STYLE.GREEN}
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setComponenteRenderizado("login")}
            />
          </center>
        </div>
      )}
      {emailRecuperadoMascarado === "erro" && (
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
              texto="Voltar ao Início"
              style={BUTTON_STYLE.GREEN}
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setComponenteRenderizado("login")}
            />
          </center>
        </div>
      )}
    </>
  );
};
