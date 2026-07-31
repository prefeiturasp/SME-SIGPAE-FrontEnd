import axios from "src/services/_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import {
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
});
