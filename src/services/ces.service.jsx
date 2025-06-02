import { CES_URL, CES_TOKEN } from "src/constants/config";

export function cesInterceptFetch() {
  const originalFetch = window.fetch;

  window.fetch = function (url, options) {
    const rf = localStorage.getItem("registro_funcional");

    return originalFetch(url, options)
      .then((response) => {
        try {
          // Verifica se há um usuário logado e evita chamadas recursivas
          if (rf && options && !url.includes(CES_URL)) {
            buscarPesquisa(url, JSON.parse(rf), options);
          }
        } catch (error) {
          //
        }

        if (!response.ok) {
          return Promise.reject(response);
        }
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
}

function abrirPesquisa(url) {
  window.open(
    url,
    "_blank",
    "toolbar=no, location=no, directories=no,status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=yes, width=600, height=700"
  );
}

async function buscarPesquisa(endpoint, identificacao_usuario, options) {
  const url = `${CES_URL}/pesquisas/?identificacao_usuario=${identificacao_usuario}&metodo_recurso_acao=${options.method}&recurso_acao=${endpoint}`;
  const headers = {
    method: "GET",
    headers: {
      Authorization: `Token ${CES_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, headers);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (data.url) {
      abrirPesquisa(data.url);
    }
  } catch (error) {
    //
  }
}

export async function criarUsuarioCES(identificacao) {
  const url = `${CES_URL}/usuarios/`;

  const headers = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${CES_TOKEN}`,
    },
    body: JSON.stringify({
      identificacao: identificacao,
    }),
  };

  try {
    const response = await fetch(url, headers);
    await response.json();
  } catch (error) {
    //
  }
}
