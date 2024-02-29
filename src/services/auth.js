import decode from "jwt-decode";
import CONFIG from "../constants/config";
import { toastError } from "../components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { getError } from "helpers/utilities";
import { criarUsuarioCES } from "./ces.service";
import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

export const TOKEN_ALIAS = "TOKEN_JWT";
export const TOKEN_REFRESH_ALIAS = "TOKEN_REFRESH_JWT";

const postLogin = async (login_, password) => {
  const url = CONFIG.JWT_AUTH;
  const response = await axios
    .post(
      url,
      { login: login_, password: password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

const login = async (login, password) => {
  try {
    const response = await postLogin(login, password);
    if (response.status !== HTTP_STATUS.OK) {
      toastError(getError(response.data));
      return;
    }
    const json = await response.data;
    const isValid = isValidResponse(json);
    if (isValid) {
      localStorage.setItem(TOKEN_ALIAS, json.token);
      localStorage.setItem(TOKEN_REFRESH_ALIAS, json.refresh);

      await fetch(`${CONFIG.API_URL}/usuarios/atualizar-cargo/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${json.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!json.last_login) {
        localStorage.setItem("senhaAtual", password);
        window.location.href = "/login?tab=PRIMEIRO_ACESSO";
      }

      await fetch(`${CONFIG.API_URL}/usuarios/meus-dados/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${json.token}`,
          "Content-Type": "application/json",
        },
      }).then((result) => {
        const response = result.json();
        response.then(async (result_) => {
          if (result.status === HTTP_STATUS.OK) {
            criarUsuarioCES(result_.registro_funcional);

            localStorage.setItem(
              "registro_funcional",
              JSON.stringify(result_.registro_funcional)
            );
            localStorage.setItem(
              "tipo_perfil",
              JSON.stringify(result_.tipo_usuario)
            );
            localStorage.setItem(
              "perfil",
              JSON.stringify(result_.vinculo_atual.perfil.nome)
            );
            localStorage.setItem(
              "visao_perfil",
              JSON.stringify(result_.vinculo_atual.perfil.visao)
            );
            localStorage.setItem(
              "tipo_gestao",
              JSON.stringify(result_.vinculo_atual.instituicao.tipo_gestao)
            );
            localStorage.setItem(
              "nome_instituicao",
              JSON.stringify(result_.vinculo_atual.instituicao.nome)
            );
            localStorage.setItem(
              "tipo_servico",
              JSON.stringify(result_.vinculo_atual.instituicao.tipo_servico)
            );
            localStorage.setItem(
              "modulo_gestao",
              JSON.stringify(result_.vinculo_atual.instituicao.modulo_gestao)
            );
            localStorage.setItem(
              "eh_cei",
              JSON.stringify(result_.vinculo_atual.instituicao.eh_cei)
            );
            localStorage.setItem(
              "eh_cemei",
              JSON.stringify(result_.vinculo_atual.instituicao.eh_cemei)
            );
            localStorage.setItem(
              "eh_emebs",
              JSON.stringify(result_.vinculo_atual.instituicao.eh_emebs)
            );
            localStorage.setItem(
              "dre_nome",
              result_.vinculo_atual.instituicao.diretoria_regional &&
                result_.vinculo_atual.instituicao.diretoria_regional.nome
            );
            localStorage.setItem(
              "lotes",
              result_.vinculo_atual.instituicao.lotes &&
                JSON.stringify(result_.vinculo_atual.instituicao.lotes)
            );
            localStorage.setItem(
              "acesso_modulo_medicao_inicial",
              JSON.stringify(
                result_.vinculo_atual.instituicao.acesso_modulo_medicao_inicial
              )
            );
            localStorage.setItem(
              "dre_acesso_modulo_medicao_inicial",
              JSON.stringify(
                result_.vinculo_atual.instituicao.diretoria_regional &&
                  result_.vinculo_atual.instituicao.diretoria_regional
                    .acesso_modulo_medicao_inicial
              )
            );
            localStorage.setItem(
              "possui_escolas_com_acesso_ao_medicao_inicial",
              JSON.stringify(
                result_.vinculo_atual.instituicao
                  .possui_escolas_com_acesso_ao_medicao_inicial
              )
            );

            window.location.href = "/";
          } else {
            toastError(getError(result_));
          }
        });
      });
    } else {
      toastError(`${json.detail}`);
    }
    return isValid;
  } catch (error) {
    return false;
  }
};

const logout = () => {
  localStorage.removeItem(TOKEN_ALIAS);
  localStorage.removeItem(TOKEN_REFRESH_ALIAS);
  localStorage.removeItem("tipo_perfil");
  localStorage.removeItem("perfil");
  localStorage.removeItem("tipo_gestao");
  localStorage.removeItem("tipo_servico");
  localStorage.removeItem("nome_instituicao");
  localStorage.removeItem("modulo_gestao");
  localStorage.removeItem("eh_cei");
  localStorage.removeItem("eh_cemei");
  localStorage.removeItem("dre_nome");
  localStorage.removeItem("lotes");
  localStorage.removeItem("modalCestas");
  localStorage.removeItem("acesso_modulo_medicao_inicial");
  localStorage.removeItem("dre_acesso_modulo_medicao_inicial");
  localStorage.removeItem("possui_escolas_com_acesso_ao_medicao_inicial");
  window.location.href = "/login";
};

const getToken = () => {
  let token = localStorage.getItem(TOKEN_ALIAS);
  let refresh = localStorage.getItem(TOKEN_REFRESH_ALIAS);
  if (token && refresh) {
    if (isTokenExpired(token)) logout();
    if (needsToRefreshToken(token)) {
      refreshToken(refresh).then((json) => {
        if (isValidResponse(json))
          localStorage.setItem(TOKEN_ALIAS, json.token);
      });
      token = localStorage.getItem(TOKEN_ALIAS);
    }
    return token;
  }
};

const isLoggedIn = () => {
  const token = localStorage.getItem(TOKEN_ALIAS);
  if (token) {
    return true;
  }
  return false;
};

const isValidResponse = (json) => {
  try {
    const decoded = decode(json.token);
    const test2 =
      decoded.user_id !== undefined &&
      decoded.exp !== undefined &&
      decoded.iat !== undefined &&
      decoded.jti !== undefined &&
      decoded.token_type === "access";
    const test1 = json.token.length >= 203 ? true : false;
    return test1 && test2;
  } catch (error) {
    return false;
  }
};

export const refreshToken = async (refresh) => {
  try {
    const response = await fetch(`${CONFIG.API_URL}/api-token-refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`refreshToken ${error}`);
  }
};

const needsToRefreshToken = (token) => {
  const secondsLeft = calculateTokenSecondsLeft(token);
  if (secondsLeft < CONFIG.REFRESH_TOKEN_TIMEOUT) {
    return true;
  } else return false;
};

export const isTokenExpired = (token) => {
  try {
    const secondsLeft = calculateTokenSecondsLeft(token);
    if (secondsLeft <= 0) {
      return true;
    } else return false;
  } catch (err) {
    console.log("Falha ao verificar token expirado");
    return true;
  }
};

export const calculateTokenSecondsLeft = (token) => {
  const decoded = decode(token);
  const dateToken = new Date(decoded.exp * 1000);
  const dateVerify = new Date(Date.now());
  const secondsLeft = (dateToken - dateVerify) / 1000;
  return secondsLeft;
};

const authService = {
  login,
  logout,
  getToken,
  isLoggedIn,
  isValidResponse,
};

export default authService;
