import HTTP_STATUS from "http-status-codes";
import axios from "src/services/_base";
import { getDashboardPainelGerencialSupervisao } from "src/services/imr/painelGerencial";
import { ErrorHandlerFunction } from "src/services/service-helpers";

jest.mock("src/constants/config", () => ({
  API_URL: "http://api.test",
  ENVIRONMENT: "development",
}));

jest.mock("src/services/_base", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("src/services/service-helpers", () => ({
  ErrorHandlerFunction: jest.fn(),
}));

const filtros = Object.freeze({
  diretoria_regional: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
  mes: 9,
  ano: 2026,
});

const dadosDashboard = {
  results: [
    {
      status: "EM_PREENCHIMENTO",
      label: "Em preenchimento pela Supervisão",
      total: 2,
    },
    {
      status: "NUTRIMANIFESTACAO_A_VALIDAR",
      label: "Enviados pela Supervisão",
      total: 2,
    },
    {
      status: "COM_COMENTARIOS_DE_CODAE",
      label: "Devolvidos com comentários",
      total: 2,
    },
    {
      status: "CORRIGIDO_PELA_SUPERVISAO",
      label: "Corrigidos pela Supervisão",
      total: 2,
    },
    {
      status: "VALIDADO_POR_CODAE",
      label: "Validados pela CODAE",
      total: 2,
    },
  ],
};

const mockConsulta = jest.mocked(axios.get);
const mockTratarErro = jest.mocked(ErrorHandlerFunction);

describe("Service do dashboard de supervisão", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.replaceProperty(
      jest.requireMock("src/constants/config"),
      "ENVIRONMENT",
      "development",
    );
    mockConsulta.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: dadosDashboard,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    { ambiente: "development", novoPainel: true },
    { ambiente: "homolog", novoPainel: true },
    { ambiente: "test", novoPainel: true },
    { ambiente: "production", novoPainel: false },
  ])(
    "preserva os filtros e envia novo_painel=$novoPainel em $ambiente",
    async ({ ambiente, novoPainel }) => {
      jest.replaceProperty(
        jest.requireMock("src/constants/config"),
        "ENVIRONMENT",
        ambiente,
      );

      await getDashboardPainelGerencialSupervisao(filtros);

      expect(mockConsulta).toHaveBeenCalledTimes(1);
      expect(mockConsulta).toHaveBeenCalledWith(
        "http://api.test/imr/formulario-supervisao/dashboard/",
        { params: { ...filtros, novo_painel: novoPainel } },
      );
      expect(filtros).not.toHaveProperty("novo_painel");
    },
  );

  it.each([
    { ambiente: "development", flagInformada: false, flagEsperada: true },
    { ambiente: "production", flagInformada: true, flagEsperada: false },
  ])(
    "prioriza o ambiente $ambiente quando a flag recebida é diferente",
    async ({ ambiente, flagInformada, flagEsperada }) => {
      jest.replaceProperty(
        jest.requireMock("src/constants/config"),
        "ENVIRONMENT",
        ambiente,
      );

      await getDashboardPainelGerencialSupervisao({
        ...filtros,
        novo_painel: flagInformada,
      });

      expect(mockConsulta).toHaveBeenCalledWith(
        "http://api.test/imr/formulario-supervisao/dashboard/",
        { params: { ...filtros, novo_painel: flagEsperada } },
      );
    },
  );

  it("retorna os dados e o status recebidos da API", async () => {
    const resposta = await getDashboardPainelGerencialSupervisao(filtros);

    expect(resposta).toEqual({
      status: HTTP_STATUS.OK,
      data: dadosDashboard,
    });
    expect(mockTratarErro).not.toHaveBeenCalled();
  });

  it("encaminha a falha HTTP ao tratamento e retorna o erro tratado", async () => {
    const respostaErro = {
      status: HTTP_STATUS.FORBIDDEN,
      data: { detail: "Usuário sem permissão para consultar o painel." },
    };
    const erro = Object.assign(new Error("Acesso negado"), {
      response: respostaErro,
    });
    mockConsulta.mockRejectedValue(erro);
    mockTratarErro.mockReturnValue(respostaErro);

    const resposta = await getDashboardPainelGerencialSupervisao(filtros);

    expect(mockTratarErro).toHaveBeenCalledTimes(1);
    expect(mockTratarErro).toHaveBeenCalledWith(erro);
    expect(resposta).toEqual(respostaErro);
  });

  it("encaminha a falha de conexão ao tratamento existente", async () => {
    const erro = new Error("Network Error");
    const respostaErro = {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: "Error during request",
    };
    mockConsulta.mockRejectedValue(erro);
    mockTratarErro.mockReturnValue(respostaErro);

    const resposta = await getDashboardPainelGerencialSupervisao(filtros);

    expect(mockTratarErro).toHaveBeenCalledWith(erro);
    expect(resposta).toEqual(respostaErro);
  });
});
