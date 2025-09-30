import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

const authHeader = {
  "Content-Type": "application/json",
  Authorization: `JWT ${authService.getToken()}`,
};

export const getTiposUnidadeEscolar = async (params = null) => {
  const url = API_URL + "/tipos-unidade-escolar/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getVinculosTipoAlimentacaoPorTipoUnidadeEscolar = async (uuid) => {
  const OBJ_REQUEST = {
    headers: authHeader,
    method: "GET",
  };

  const url = `${API_URL}/vinculos-tipo-alimentacao-u-e-periodo-escolar/tipo_unidade_escolar/${uuid}/`;
  OBJ_REQUEST["method"] = "GET";
  return await fetch(url, OBJ_REQUEST).then((response) => {
    return response.json();
  });
};

export const updateVinculosTipoAlimentacaoPorTipoUnidadeEscolar = async (
  values,
) => {
  try {
    const response = await fetch(
      `${API_URL}/vinculos-tipo-alimentacao-u-e-periodo-escolar/${values.uuid}/`,
      {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(values),
      },
    );
    let json = await response.json();
    const status = await response.status;
    json.status = status;
    return json;
  } catch (err) {
    return err;
  }
};

export const updateListaVinculosTipoAlimentacaoPorTipoUnidadeEscolar = async (
  values,
) => {
  const url = `/vinculos-tipo-alimentacao-u-e-periodo-escolar/atualizar_lista_de_vinculos/`;
  const response = await axios.put(url, values).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getVinculosTipoAlimentacaoPorEscola = async (
  uuid,
  params = null,
) => {
  const url = `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const alteraVinculosTipoAlimentacao = async (uuid, values) => {
  try {
    const response = await fetch(
      `${API_URL}/vinculos-tipo-alimentacao-u-e-periodo-escolar/${uuid}/`,
      {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(values),
      },
    );
    let json = await response.json();
    const status = await response.status;
    json.status = status;
    return json;
  } catch (err) {
    return err;
  }
};

export const getTiposDeAlimentacao = async () => {
  const url = "/tipos-alimentacao/";
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createVinculoTipoAlimentacaoPeriodoEscolar = (payload) => {
  const url = `${API_URL}/combos-vinculos-tipo-alimentacao-u-e-periodo-escolar/`;

  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeader,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const createVinculoSubstituicaoPeriodoEscolar = (payload) => {
  const url = `${API_URL}/substituicoes-combos-vinculos-tipo-alimentacao-u-e-periodo-escolar/`;

  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeader,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const deleteVinculoTipoAlimentacaoPeriodoEscolar = (uuid) => {
  const url = `${API_URL}/combos-vinculos-tipo-alimentacao-u-e-periodo-escolar/${uuid}/`;
  return fetch(url, {
    method: "DELETE",
    headers: authHeader,
  })
    .then((result) => {
      return result.status;
    })
    .catch((error) => {
      return error.json();
    });
};

export const deleteSubstituicaoTipoAlimentacaoPeriodoEscolar = (uuid) => {
  const url = `${API_URL}/substituicoes-combos-vinculos-tipo-alimentacao-u-e-periodo-escolar/${uuid}/`;
  return fetch(url, {
    method: "DELETE",
    headers: authHeader,
  })
    .then((result) => {
      return result.status;
    })
    .catch((error) => {
      return error.json();
    });
};

export const getHorariosCombosPorEscola = async (uuid) => {
  const OBJ_REQUEST = {
    headers: authHeader,
    method: "GET",
  };

  const url = `${API_URL}/horario-do-combo-tipo-de-alimentacao-por-unidade-escolar/escola/${uuid}/`;
  OBJ_REQUEST["method"] = "GET";
  return await fetch(url, OBJ_REQUEST).then((response) => {
    return response.json();
  });
};

export const postHorariosCombosPorEscola = (payload) => {
  const url = `${API_URL}/horario-do-combo-tipo-de-alimentacao-por-unidade-escolar/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeader,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const putHorariosCombosPorEscola = async (payload, uuid) => {
  try {
    const response = await fetch(
      `${API_URL}/horario-do-combo-tipo-de-alimentacao-por-unidade-escolar/${uuid}/`,
      {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(payload),
      },
    );
    let json = await response.json();
    const status = await response.status;
    json.status = status;
    return json;
  } catch (err) {
    return err;
  }
};

export const atualizaQuantidadeDeAlunos = async (payload, uuid) => {
  try {
    const response = await fetch(
      `${API_URL}/quantidade-alunos-por-periodo/${uuid}/`,
      {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(payload),
      },
    );
    let json = await response.json();
    const status = await response.status;
    json.status = status;
    return json;
  } catch (err) {
    return err;
  }
};

export const getVinculosTipoAlimentacaoMotivoInclusaoEspecifico = async (
  params = null,
) => {
  const url =
    "/vinculos-tipo-alimentacao-u-e-periodo-escolar/motivo_inclusao_especifico/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getTiposUnidadeEscolarTiposAlimentacao = async (params = null) => {
  const url = "/tipos-unidade-escolar-agrupados/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
