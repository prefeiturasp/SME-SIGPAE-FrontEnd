import HTTP_STATUS from "http-status-codes";
import { jwtDecode } from "jwt-decode";
import { getError } from "src/helpers/utilities";
import { toastError } from "../components/Shareable/Toast/dialogs";
import { API_URL, JWT_AUTH, REFRESH_TOKEN_TIMEOUT } from "../constants/config";
import axios, { apiLoggedOut } from "./_base";
import { criarUsuarioCES } from "./ces.service";
import { ErrorHandlerFunction } from "./service-helpers";

export const TOKEN_ALIAS = "TOKEN_JWT";
export const TOKEN_REFRESH_ALIAS = "TOKEN_REFRESH_JWT";

const postLogin = async (login_, password) => {
  const url = JWT_AUTH;
  const response = await axios
    .post(
      url,
      { login: login_, password: password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

const atualizarCargo = async () => {
  const url = `${API_URL}/usuarios/atualizar-cargo/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

const atualizaLocalStorage = (result_) => {
  localStorage.setItem(
    "registro_funcional",
    JSON.stringify(result_.registro_funcional),
  );
  localStorage.setItem("tipo_perfil", JSON.stringify(result_.tipo_usuario));
  localStorage.setItem(
    "perfil",
    JSON.stringify(result_.vinculo_atual.perfil.nome),
  );
  localStorage.setItem(
    "visao_perfil",
    JSON.stringify(result_.vinculo_atual.perfil.visao),
  );
  localStorage.setItem(
    "tipo_gestao",
    JSON.stringify(result_.vinculo_atual.instituicao.tipo_gestao),
  );
  localStorage.setItem(
    "nome_instituicao",
    JSON.stringify(result_.vinculo_atual.instituicao.nome),
  );
  localStorage.setItem(
    "uuid_instituicao",
    JSON.stringify(result_.vinculo_atual.instituicao.uuid),
  );
  localStorage.setItem(
    "tipo_servico",
    JSON.stringify(result_.vinculo_atual.instituicao.tipo_servico),
  );
  localStorage.setItem(
    "modulo_gestao",
    JSON.stringify(result_.vinculo_atual.instituicao.modulo_gestao),
  );
  localStorage.setItem(
    "eh_cei",
    JSON.stringify(result_.vinculo_atual.instituicao.eh_cei),
  );
  localStorage.setItem(
    "eh_cemei",
    JSON.stringify(result_.vinculo_atual.instituicao.eh_cemei),
  );
  localStorage.setItem(
    "eh_emebs",
    JSON.stringify(result_.vinculo_atual.instituicao.eh_emebs),
  );
  localStorage.setItem(
    "dre_nome",
    result_.vinculo_atual.instituicao.diretoria_regional &&
      result_.vinculo_atual.instituicao.diretoria_regional.nome,
  );
  localStorage.setItem(
    "lotes",
    result_.vinculo_atual.instituicao.lotes &&
      JSON.stringify(result_.vinculo_atual.instituicao.lotes),
  );
  localStorage.setItem(
    "acesso_modulo_medicao_inicial",
    JSON.stringify(
      result_.vinculo_atual.instituicao.acesso_modulo_medicao_inicial,
    ),
  );
  localStorage.setItem(
    "dre_acesso_modulo_medicao_inicial",
    JSON.stringify(
      result_.vinculo_atual.instituicao.diretoria_regional &&
        result_.vinculo_atual.instituicao.diretoria_regional
          .acesso_modulo_medicao_inicial,
    ),
  );
  localStorage.setItem(
    "possui_escolas_com_acesso_ao_medicao_inicial",
    JSON.stringify(
      result_.vinculo_atual.instituicao
        .possui_escolas_com_acesso_ao_medicao_inicial,
    ),
  );
};

const login = async (login, password) => {
  localStorage.removeItem(TOKEN_ALIAS);
  localStorage.removeItem(TOKEN_REFRESH_ALIAS);

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

      await atualizarCargo();

      if (!json.last_login) {
        localStorage.setItem("senhaAtual", password);
        window.location.href = "/login?componenteRenderizado=primeiroAcesso";
      }

      const url = `${API_URL}/usuarios/meus-dados/`;
      const response = await axios.get(url).catch(ErrorHandlerFunction);

      if (response.status === HTTP_STATUS.OK) {
        const result_ = response.data;

        criarUsuarioCES(result_.registro_funcional);
        atualizaLocalStorage(result_);
        window.location.href = "/";
      } else {
        toastError(getError(response.data));
      }
    } else {
      toastError(`${json.detail}`);
    }
    return isValid;
  } catch {
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
      refreshToken().then((json) => {
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
  if (process.env.IS_TEST) return true;
  try {
    const decoded = jwtDecode(json.token);
    const test2 =
      decoded.user_id !== undefined &&
      decoded.exp !== undefined &&
      decoded.iat !== undefined &&
      decoded.jti !== undefined &&
      decoded.token_type === "access";
    const test1 = json.token.length >= 203 ? true : false;
    return test1 && test2;
  } catch {
    return false;
  }
};

const refreshToken = async () => {
  const response = await apiLoggedOut
    .post("/api-token-refresh/", {
      refresh: localStorage.getItem(TOKEN_REFRESH_ALIAS),
    })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

const needsToRefreshToken = (token) => {
  if (process.env.IS_TEST) return false;
  const secondsLeft = calculateTokenSecondsLeft(token);
  if (secondsLeft < REFRESH_TOKEN_TIMEOUT) {
    return true;
  } else return false;
};

export const isTokenExpired = (token) => {
  if (process.env.IS_TEST) return false;
  try {
    const secondsLeft = calculateTokenSecondsLeft(token);
    if (secondsLeft <= 0) {
      return true;
    } else return false;
  } catch {
    return true;
  }
};

export const calculateTokenSecondsLeft = (token) => {
  if (process.env.IS_TEST) return 1000;
  const decoded = jwtDecode(token);
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
  needsToRefreshToken,
  refreshToken,
};

export default authService;
