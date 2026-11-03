import axios from "src/services/_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import {
  buscarOcorrenciasDiretor,
  createFormularioDiretor,
  createFormularioSupervisao,
  createRascunhoFormularioSupervisao,
  deleteFormularioSupervisao,
  exportarPDFRelatorioFiscalizacao,
  exportarPDFRelatorioNotificacao,
  getEquipamentos,
  getFormularioSupervisao,
  getInsumos,
  getMobiliarios,
  getPeriodosVisita,
  getReparosEAdaptacoes,
  getRespostasFormularioSupervisao,
  getRespostasNaoSeAplicaFormularioSupervisao,
  getTiposOcorrenciaPorEditalDiretor,
  getTiposOcorrenciaPorEditalNutrisupervisao,
  getUtensiliosCozinha,
  getUtensiliosMesa,
  updateFormularioSupervisao,
  updateRascunhoFormularioSupervisao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";

jest.mock("src/constants/config", () => ({
  API_URL: "http://api.test",
}));

jest.mock("src/services/_base", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("src/services/service-helpers", () => ({
  ErrorHandlerFunction: jest.fn(),
}));

const API_URL_MOCK = "http://api.test";

const UUID_FORMULARIO = "00000000-0000-4000-8000-000000000001";
const UUID_EDITAL = "00000000-0000-4000-8000-000000000002";
const UUID_ESCOLA = "00000000-0000-4000-8000-000000000003";
const UUID_MEDICAO = "00000000-0000-4000-8000-000000000004";

const formularioMock = {
  uuid: UUID_FORMULARIO,
  escola: UUID_ESCOLA,
};

const paramsEdital = {
  edital_uuid: UUID_EDITAL,
};

const paramsTiposOcorrenciaNutrisupervisao = {
  edital_uuid: UUID_EDITAL,
  escola_uuid: UUID_ESCOLA,
};

const respostaMock = {
  uuid: UUID_FORMULARIO,
  status: "RASCUNHO",
};

const respostaAxiosMock = {
  data: respostaMock,
  status: 200,
};

const respostaListagemOcorrencias = {
  status: 200,
  data: {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        uuid: UUID_FORMULARIO,
        data: "10/01/2026",
        categoria: {
          uuid: "00000000-0000-4000-8000-000000000005",
          nome: "FUNCIONÁRIOS",
          posicao: 1,
          gera_notificacao: false,
        },
        tipo_ocorrencia: "00000000-0000-4000-8000-000000000006",
        titulo: "UNIFORME DOS MANIPULADORES",
        descricao: "Funcionários utilizavam uniforme completo?",
        grupo: 1,
        respostas: [
          {
            uuid: "00000000-0000-4000-8000-000000000007",
            parametrizacao: "00000000-0000-4000-8000-000000000008",
            titulo: "Qual item do uniforme faltou?",
            posicao: 1,
            resposta: "Touca",
          },
        ],
      },
    ],
  },
};

const casosDeTeste = [
  {
    nome: "getPeriodosVisita",
    metodo: "get",
    executar: () => getPeriodosVisita(),
    argumentosEsperados: [`${API_URL_MOCK}/imr/periodos-de-visita/`],
  },
  {
    nome: "createRascunhoFormularioSupervisao",
    metodo: "post",
    executar: () => createRascunhoFormularioSupervisao(formularioMock),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/rascunho-formulario-supervisao/`,
      formularioMock,
    ],
  },
  {
    nome: "updateRascunhoFormularioSupervisao",
    metodo: "put",
    executar: () => updateRascunhoFormularioSupervisao(formularioMock),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/rascunho-formulario-supervisao/${UUID_FORMULARIO}/`,
      formularioMock,
    ],
  },
  {
    nome: "createFormularioSupervisao",
    metodo: "post",
    executar: () => createFormularioSupervisao(formularioMock),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/`,
      formularioMock,
    ],
  },
  {
    nome: "updateFormularioSupervisao",
    metodo: "put",
    executar: () => updateFormularioSupervisao(formularioMock),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/`,
      formularioMock,
    ],
  },
  {
    nome: "deleteFormularioSupervisao",
    metodo: "delete",
    executar: () =>
      deleteFormularioSupervisao({
        uuid: UUID_FORMULARIO,
      }),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/rascunho-formulario-supervisao/${UUID_FORMULARIO}/`,
    ],
  },
  {
    nome: "getFormularioSupervisao",
    metodo: "get",
    executar: () => getFormularioSupervisao(UUID_FORMULARIO),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/`,
    ],
  },
  {
    nome: "getRespostasFormularioSupervisao",
    metodo: "get",
    executar: () => getRespostasFormularioSupervisao(UUID_FORMULARIO),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/respostas/`,
    ],
  },
  {
    nome: "getRespostasNaoSeAplicaFormularioSupervisao",
    metodo: "get",
    executar: () =>
      getRespostasNaoSeAplicaFormularioSupervisao(UUID_FORMULARIO),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/respostas_nao_se_aplica/`,
    ],
  },
  {
    nome: "createFormularioDiretor",
    metodo: "post",
    executar: () => createFormularioDiretor(formularioMock),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-diretor/`,
      formularioMock,
    ],
  },
  {
    nome: "getTiposOcorrenciaPorEditalNutrisupervisao",
    metodo: "get",
    executar: () =>
      getTiposOcorrenciaPorEditalNutrisupervisao(
        paramsTiposOcorrenciaNutrisupervisao,
      ),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/tipos-ocorrencias/`,
      {
        params: paramsTiposOcorrenciaNutrisupervisao,
      },
    ],
  },
  {
    nome: "getTiposOcorrenciaPorEditalDiretor",
    metodo: "get",
    executar: () => getTiposOcorrenciaPorEditalDiretor(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-diretor/tipos-ocorrencias/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getUtensiliosCozinha",
    metodo: "get",
    executar: () => getUtensiliosCozinha(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/utensilios-cozinha/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getUtensiliosMesa",
    metodo: "get",
    executar: () => getUtensiliosMesa(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/utensilios-mesa/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getEquipamentos",
    metodo: "get",
    executar: () => getEquipamentos(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/equipamentos/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getMobiliarios",
    metodo: "get",
    executar: () => getMobiliarios(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/mobiliarios/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getReparosEAdaptacoes",
    metodo: "get",
    executar: () => getReparosEAdaptacoes(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/reparos-e-adaptacoes/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "getInsumos",
    metodo: "get",
    executar: () => getInsumos(paramsEdital),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/insumos/`,
      {
        params: paramsEdital,
      },
    ],
  },
  {
    nome: "exportarPDFRelatorioFiscalizacao",
    metodo: "get",
    executar: () =>
      exportarPDFRelatorioFiscalizacao({
        uuid: UUID_FORMULARIO,
      }),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/relatorio-pdf/`,
    ],
  },
  {
    nome: "exportarPDFRelatorioNotificacao",
    metodo: "get",
    executar: () => exportarPDFRelatorioNotificacao(UUID_FORMULARIO),
    argumentosEsperados: [
      `${API_URL_MOCK}/imr/formulario-supervisao/${UUID_FORMULARIO}/gerar-relatorio-notificacoes/`,
    ],
  },
];

describe("relatorioFiscalizacaoTerceirizadas services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(casosDeTeste)(
    "$nome",
    ({ executar, metodo, argumentosEsperados }) => {
      it("deve realizar a requisição e retornar os dados e o status", async () => {
        axios[metodo].mockResolvedValueOnce(respostaAxiosMock);

        const resultado = await executar();

        expect(axios[metodo]).toHaveBeenCalledTimes(1);
        expect(axios[metodo]).toHaveBeenCalledWith(...argumentosEsperados);
        expect(resultado).toEqual({
          data: respostaMock,
          status: 200,
        });
      });

      it("deve tratar o erro e retornar undefined quando a requisição falhar", async () => {
        const erro = new Error("Erro ao realizar requisição");

        axios[metodo].mockRejectedValueOnce(erro);
        ErrorHandlerFunction.mockReturnValueOnce(undefined);

        const resultado = await executar();

        expect(axios[metodo]).toHaveBeenCalledTimes(1);
        expect(axios[metodo]).toHaveBeenCalledWith(...argumentosEsperados);
        expect(ErrorHandlerFunction).toHaveBeenCalledTimes(1);
        expect(ErrorHandlerFunction).toHaveBeenCalledWith(erro);
        expect(resultado).toBeUndefined();
      });
    },
  );

  describe("buscarOcorrenciasDiretor", () => {
    it.each([
      {
        cenario: "com paginação",
        parametros: {
          solicitacao_medicao_inicial: UUID_MEDICAO,
          page: 1,
          page_size: 10,
        },
      },
      {
        cenario: "sem informar a paginação",
        parametros: {
          solicitacao_medicao_inicial: UUID_MEDICAO,
        },
      },
    ])(
      "consulta as ocorrências da medição $cenario e retorna os dados e o status",
      async ({ parametros }) => {
        axios.get.mockResolvedValueOnce(respostaListagemOcorrencias);

        const resultado = await buscarOcorrenciasDiretor(parametros);

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
          `${API_URL_MOCK}/imr/formulario-diretor/`,
          { params: parametros },
        );
        expect(resultado).toEqual(respostaListagemOcorrencias);
        expect(ErrorHandlerFunction).not.toHaveBeenCalled();
      },
    );

    it("retorna a listagem vazia sem tratar como erro", async () => {
      const respostaVazia = {
        status: 200,
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
      };
      axios.get.mockResolvedValueOnce(respostaVazia);

      const resultado = await buscarOcorrenciasDiretor({
        solicitacao_medicao_inicial: UUID_MEDICAO,
      });

      expect(resultado).toEqual(respostaVazia);
      expect(ErrorHandlerFunction).not.toHaveBeenCalled();
    });

    it("preserva os dados e o status de erro retornados pelo tratamento da requisição", async () => {
      const respostaErro = {
        status: 403,
        data: {
          detail: "Você não tem permissão para executar essa ação.",
        },
      };
      const erro = new Error("Falha ao consultar as ocorrências");
      erro.response = respostaErro;
      axios.get.mockRejectedValueOnce(erro);
      ErrorHandlerFunction.mockReturnValueOnce(respostaErro);

      const resultado = await buscarOcorrenciasDiretor({
        solicitacao_medicao_inicial: UUID_MEDICAO,
      });

      expect(ErrorHandlerFunction).toHaveBeenCalledTimes(1);
      expect(ErrorHandlerFunction).toHaveBeenCalledWith(erro);
      expect(resultado).toEqual(respostaErro);
    });

    it("retorna undefined quando o tratamento do erro não fornece resposta", async () => {
      const erro = new Error("Falha ao consultar as ocorrências");
      axios.get.mockRejectedValueOnce(erro);
      ErrorHandlerFunction.mockReturnValueOnce(undefined);

      const resultado = await buscarOcorrenciasDiretor({
        solicitacao_medicao_inicial: UUID_MEDICAO,
      });

      expect(ErrorHandlerFunction).toHaveBeenCalledTimes(1);
      expect(ErrorHandlerFunction).toHaveBeenCalledWith(erro);
      expect(resultado).toBeUndefined();
    });
  });
});
