import { useState } from "react";
import { Field, Form } from "react-final-form";
import { Link, useNavigate } from "react-router-dom";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputPassword } from "src/components/Shareable/Input/InputPassword";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required, rfOuCpfOuCodOperador } from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import authService from "src/services/auth";
import { ModalComoAcessar } from "../ModalComoAcessar";

type ComponenteLoginProps = {
  setComponenteRenderizado: (_componente: string) => void;
  setTexto: (_texto: string) => void;
};

export const ComponenteLogin = ({ ...props }: ComponenteLoginProps) => {
  const { setComponenteRenderizado, setTexto } = props;

  const navigate = useNavigate();

  const [showModalComoAcessar, setShowModalComoAcessar] = useState(false);

  const onSubmit = async (values: { login: string; password: string }) => {
    const { login, password } = values;
    await authService.login(login, password, navigate);
  };

  const handleRecuperarSenha = () => {
    setComponenteRenderizado("recuperarSenha");
    setTexto("Recuperação de Senha");
  };

  return (
    <div className="form">
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <p className="como-acessar text-end">
              <button
                type="button"
                onClick={() => setShowModalComoAcessar(true)}
              >
                Como Acessar?
              </button>
            </p>
            <Field
              component={InputText}
              dataTestIdDiv="div-input-login"
              className="input-login"
              esconderAsterisco
              label="Usuário"
              name="login"
              placeholder={"Digite seu RF ou CPF ou Código Operador"}
              required
              type="text"
              maxlength="11"
              validate={composeValidators(required, rfOuCpfOuCodOperador)}
            />
            <Field
              component={InputPassword}
              dataTestIdDiv="div-input-password"
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
              disabled={submitting}
              type={BUTTON_TYPE.SUBMIT}
            />
            <p className="mt-3 text-center">
              <Link
                className="hyperlink"
                to="#"
                data-cy="esqueci-senha"
                onClick={handleRecuperarSenha}
              >
                Esqueci minha senha
              </Link>
            </p>
            <ModalComoAcessar
              showModal={showModalComoAcessar}
              closeModal={() => setShowModalComoAcessar(false)}
            />
          </form>
        )}
      </Form>
    </div>
  );
};
