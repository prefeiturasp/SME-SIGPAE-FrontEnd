import HTTP_STATUS from "http-status-codes";
import { Field, Form } from "react-final-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputPassword } from "src/components/Shareable/Input/InputPassword";
import { RequisitosSenha } from "src/components/Shareable/RequisitosSenha";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import { atualizarSenhaLogado } from "src/services/perfil.service";

type PrimeiroAcessoProps = {
  setComponenteRenderizado: (_componente: string) => void;
};

type ValuesType = {
  senha: string;
  confirmar_senha: string;
};

export const PrimeiroAcesso = ({ ...props }: PrimeiroAcessoProps) => {
  const { setComponenteRenderizado } = props;

  const onSubmit = async (values: ValuesType) => {
    const values_ = { ...values };
    values_["senha_atual"] = localStorage.getItem("senhaAtual");
    const response = await atualizarSenhaLogado(values_);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Senha atualizada com sucesso!");
      localStorage.removeItem("senhaAtual");
      setComponenteRenderizado("login");
    } else {
      toastError(getError(response.data));
    }
  };

  const getNumero = (values: ValuesType) => {
    return values.senha?.match(/[0-9]/g);
  };

  const getTamanho = (values: ValuesType) => {
    return values.senha?.length >= 8;
  };

  const getLetra = (values: ValuesType) => {
    return values.senha?.match(/[a-zA-Z]/g);
  };

  return (
    <div className="form primeiro-acesso">
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, values, submitting }) => (
          <form onSubmit={handleSubmit}>
            <p className="mb-0">
              Seja bem-vindo(a) ao <strong>SIGPAE</strong>
            </p>
            <p>SISTEMA DE GESTÂO DO PROGRAMA DE ALIMENTAÇÂO ESCOLAR!</p>
            <p className="fw-bold">Atualize sua senha de acesso:</p>
            <div className="row">
              <div className="col-12">
                <Field
                  component={InputPassword}
                  label="Nova Senha"
                  name="senha"
                  placeholder={"Digite uma nova senha de acesso"}
                  validate={required}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Field
                  component={InputPassword}
                  label="Confirmação da Nova Senha"
                  name="confirmar_senha"
                  placeholder={"Confirme a senha digitada"}
                  validate={required}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Botao
                  className="w-100 my-2"
                  style={BUTTON_STYLE.GREEN}
                  texto="Confirmar"
                  disabled={
                    !getLetra(values) ||
                    !getNumero(values) ||
                    !getTamanho(values) ||
                    submitting
                  }
                  type={BUTTON_TYPE.SUBMIT}
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
              letra={getLetra(values)}
              numero={getNumero(values)}
              tamanho={getTamanho(values)}
              ultimasSenhas={null}
            />
          </form>
        )}
      </Form>
    </div>
  );
};
