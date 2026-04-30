import {
  exibeToastPeloStatus,
  confereSolicitacoesSelecionadas,
  arquivaDesarquivaGuias,
  enviarSolicitacoesMarcadas,
} from "../utils";
import {
  toastSuccess,
  toastError,
  toastInfo,
} from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { arquivaGuias, desarquivaGuias } from "src/services/logistica.service";
import { enviaSolicitacoesDaGrade } from "src/services/disponibilizacaoDeSolicitacoes.service";

jest.mock("src/components/Shareable/Toast/dialogs");
jest.mock("src/services/logistica.service");
jest.mock("src/services/disponibilizacaoDeSolicitacoes.service");

describe("exibeToastPeloStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe toastSuccess para status 200", () => {
    exibeToastPeloStatus(HTTP_STATUS.OK, {});
    expect(toastSuccess).toHaveBeenCalledWith(
      "Requisições de entrega enviadas com sucesso",
    );
  });

  it("exibe toastError de transicao de estado para status 400", () => {
    exibeToastPeloStatus(HTTP_STATUS.BAD_REQUEST, {
      detail: "Erro de transição de estado",
    });
    expect(toastError).toHaveBeenCalledWith("Erro de transição de estado");
  });

  it("exibe toastError com detail para status 400", () => {
    exibeToastPeloStatus(HTTP_STATUS.BAD_REQUEST, {
      detail: "Erro genérico",
    });
    expect(toastError).toHaveBeenCalledWith("Erro genérico");
  });

  it("exibe toastInfo para status 428", () => {
    exibeToastPeloStatus(HTTP_STATUS.PRECONDITION_REQUIRED, {});
    expect(toastInfo).toHaveBeenCalledWith(
      "Nenhuma requisição de entrega a enviar",
    );
  });

  it("exibe toastError com detail para outros status", () => {
    exibeToastPeloStatus(500, {
      detail: "Erro do servidor",
    });
    expect(toastError).toHaveBeenCalledWith("Erro do servidor");
  });

  it("exibe toastError generico para outros status sem detail", () => {
    exibeToastPeloStatus(500, {});
    expect(toastError).toHaveBeenCalledWith("Erro do Servidor Interno");
  });
});

describe("confereSolicitacoesSelecionadas", () => {
  it("retorna true quando lista vazia", () => {
    expect(confereSolicitacoesSelecionadas([])).toBe(true);
  });

  it("retorna true quando ha solicitacao com status diferente de Aguardando envio", () => {
    const selecionados = [
      { status: "Enviado" },
      { status: "Aguardando envio" },
    ];
    expect(confereSolicitacoesSelecionadas(selecionados)).toBe(true);
  });

  it("retorna false quando todas as solicitacoes estao Aguardando envio", () => {
    const selecionados = [
      { status: "Aguardando envio" },
      { status: "Aguardando envio" },
    ];
    expect(confereSolicitacoesSelecionadas(selecionados)).toBe(false);
  });

  it("retorna true quando ha uma solicitacao com status diferente", () => {
    const selecionados = [{ status: "Confirmada" }];
    expect(confereSolicitacoesSelecionadas(selecionados)).toBe(true);
  });
});

describe("arquivaDesarquivaGuias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("arquiva guias com sucesso ATIVA", async () => {
    const mockAtualizaTabela = jest.fn();
    const mockSetModal = jest.fn();
    const mockSetCarregando = jest.fn();
    arquivaGuias.mockResolvedValue({ status: HTTP_STATUS.OK });

    await arquivaDesarquivaGuias(
      [{ numero_guia: "G001" }],
      "123",
      "ATIVA",
      mockAtualizaTabela,
      mockSetModal,
      mockSetCarregando,
    );

    expect(arquivaGuias).toHaveBeenCalledWith({
      guias: ["G001"],
      numero_requisicao: "123",
    });
    expect(mockAtualizaTabela).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalledWith(
      "Guia(s) de Remessa arquivada(s) com sucesso",
    );
    expect(mockSetModal).toHaveBeenCalledWith(false);
    expect(mockSetCarregando).toHaveBeenCalledWith(true);
    expect(mockSetCarregando).toHaveBeenCalledWith(false);
  });

  it("desarquiva guias com sucesso ARQUIVADA", async () => {
    const mockAtualizaTabela = jest.fn();
    const mockSetModal = jest.fn();
    const mockSetCarregando = jest.fn();
    desarquivaGuias.mockResolvedValue({ status: HTTP_STATUS.OK });

    await arquivaDesarquivaGuias(
      [{ numero_guia: "G001" }],
      "123",
      "ARQUIVADA",
      mockAtualizaTabela,
      mockSetModal,
      mockSetCarregando,
    );

    expect(desarquivaGuias).toHaveBeenCalledWith({
      guias: ["G001"],
      numero_requisicao: "123",
    });
    expect(mockAtualizaTabela).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalledWith(
      "Guia(s) de Remessa desarquivada(s) com sucesso",
    );
    expect(mockSetModal).toHaveBeenCalledWith(false);
  });

  it("exibe toastError quando falha ao arquivar", async () => {
    const mockAtualizaTabela = jest.fn();
    const mockSetModal = jest.fn();
    const mockSetCarregando = jest.fn();
    arquivaGuias.mockResolvedValue({ status: 500 });

    await arquivaDesarquivaGuias(
      [{ numero_guia: "G001" }],
      "123",
      "ATIVA",
      mockAtualizaTabela,
      mockSetModal,
      mockSetCarregando,
    );

    expect(toastError).toHaveBeenCalledWith("Erro ao arquivar a guia");
  });
});

describe("enviarSolicitacoesMarcadas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("envia solicitacoes com sucesso e array vazio", async () => {
    const mockSetCarregandoModal = jest.fn();
    const mockAtualizaTabela = jest.fn();
    const mockSetShowModal = jest.fn();
    enviaSolicitacoesDaGrade.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [],
    });

    await enviarSolicitacoesMarcadas(
      [{ uuid: "uuid1" }],
      mockSetCarregandoModal,
      mockAtualizaTabela,
      mockSetShowModal,
    );

    expect(enviaSolicitacoesDaGrade).toHaveBeenCalledWith(["uuid1"]);
    expect(mockAtualizaTabela).toHaveBeenCalled();
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
    expect(mockSetCarregandoModal).toHaveBeenCalledWith(true);
    expect(mockSetCarregandoModal).toHaveBeenCalledWith(false);
    expect(toastInfo).toHaveBeenCalledWith(
      "Nenhuma requisição de entrega a enviar",
    );
  });

  it("envia solicitacoes com sucesso e array com dados", async () => {
    const mockSetCarregandoModal = jest.fn();
    const mockAtualizaTabela = jest.fn();
    const mockSetShowModal = jest.fn();
    enviaSolicitacoesDaGrade.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [{ uuid: "uuid1" }],
    });

    await enviarSolicitacoesMarcadas(
      [{ uuid: "uuid1" }],
      mockSetCarregandoModal,
      mockAtualizaTabela,
      mockSetShowModal,
    );

    expect(mockAtualizaTabela).toHaveBeenCalled();
    expect(mockSetShowModal).toHaveBeenCalledWith(false);
    expect(toastSuccess).toHaveBeenCalledWith(
      "Requisições de entrega enviadas com sucesso",
    );
  });

  it("envia solicitacoes com erro 400", async () => {
    const mockSetCarregandoModal = jest.fn();
    const mockAtualizaTabela = jest.fn();
    const mockSetShowModal = jest.fn();
    enviaSolicitacoesDaGrade.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { detail: "Erro de teste" },
    });

    await enviarSolicitacoesMarcadas(
      [{ uuid: "uuid1" }],
      mockSetCarregandoModal,
      mockAtualizaTabela,
      mockSetShowModal,
    );

    expect(toastError).toHaveBeenCalledWith("Erro de teste");
  });
});
