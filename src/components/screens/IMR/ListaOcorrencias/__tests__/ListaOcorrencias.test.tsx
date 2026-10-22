import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { OcorrenciaDiretorInterface } from "src/interfaces/imr.interface";
import { RespostaListagemOcorrenciasDiretorInterface } from "src/interfaces/responses.interface";
import { buscarOcorrenciasDiretor } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";

import { ListaOcorrencias } from "../index";

const mockNavegar = jest.fn();
const mockParametrosBusca = jest.fn();
const mockFormatarMes = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavegar,
  useSearchParams: () => mockParametrosBusca(),
}));

jest.mock("src/helpers/utilities", () => ({
  formataMesNome: (mes: string) => mockFormatarMes(mes),
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  buscarOcorrenciasDiretor: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

const buscarOcorrenciasSimulado = jest.mocked(buscarOcorrenciasDiretor);
const EDITAL_UUID = "11111111-1111-4111-8111-111111111111";
const SOLICITACAO_UUID = "22222222-2222-4222-8222-222222222222";
const OUTRA_SOLICITACAO_UUID = "33333333-3333-4333-8333-333333333333";
const MENSAGEM_LISTA_VAZIA = "Nenhuma ocorrência registrada para este período.";

const OCORRENCIA: OcorrenciaDiretorInterface = {
  uuid: "44444444-4444-4444-8444-444444444444",
  data: "10/01/2026",
  categoria: {
    uuid: "55555555-5555-4555-8555-555555555555",
    nome: "FUNCIONÁRIOS",
    posicao: 1,
    gera_notificacao: false,
  },
  tipo_ocorrencia: "66666666-6666-4666-8666-666666666666",
  titulo: "UNIFORME DOS MANIPULADORES",
  descricao: "Funcionários utilizavam uniforme completo?",
  grupo: 1,
  respostas: [
    {
      uuid: "77777777-7777-4777-8777-777777777777",
      parametrizacao: "88888888-8888-4888-8888-888888888888",
      titulo: "Qual item do uniforme faltou?",
      posicao: 1,
      resposta: "Touca",
    },
  ],
};

const criarRespostaListagem = (
  ocorrencias: OcorrenciaDiretorInterface[] = [OCORRENCIA],
): RespostaListagemOcorrenciasDiretorInterface => ({
  status: 200,
  data: {
    count: ocorrencias.length,
    next: null,
    previous: null,
    results: ocorrencias,
  },
});

const criarConsultaPendente = () => {
  let concluir: (
    _resposta: RespostaListagemOcorrenciasDiretorInterface,
  ) => void;
  const promessa = new Promise<RespostaListagemOcorrenciasDiretorInterface>(
    (resolver) => {
      concluir = resolver;
    },
  );

  return { promessa, concluir };
};

const configurarParametrosBusca = (solicitacaoUuid = SOLICITACAO_UUID) => {
  const parametrosBusca = new URLSearchParams({
    mes: "1",
    ano: "2026",
    editalUuid: EDITAL_UUID,
    solicitacaoMedicaoInicialUuid: solicitacaoUuid,
  });

  mockParametrosBusca.mockReturnValue([parametrosBusca]);
};

describe("ListaOcorrencias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buscarOcorrenciasSimulado.mockReset();
    configurarParametrosBusca();
    mockFormatarMes.mockReturnValue("Janeiro");
    buscarOcorrenciasSimulado.mockResolvedValue(criarRespostaListagem());
  });

  it("exibe o período da medição sem permitir sua alteração", async () => {
    render(<ListaOcorrencias />);

    await screen.findByRole("table");

    const campoPeriodo = screen.getByRole("combobox");

    expect(mockFormatarMes).toHaveBeenCalledWith("1");
    expect(
      screen.getByText("Período de Lançamento da Medição"),
    ).toBeInTheDocument();
    expect(campoPeriodo).toBeDisabled();
    expect(campoPeriodo).toHaveValue("1/2026");
    expect(
      within(campoPeriodo).getByRole("option", {
        name: "Janeiro / 2026",
      }),
    ).toBeInTheDocument();
    expect(within(campoPeriodo).getAllByRole("option")).toHaveLength(1);
  });

  it("preserva a medição, o edital e o período ao registrar nova ocorrência", async () => {
    render(<ListaOcorrencias />);

    await screen.findByRole("table");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Registrar Nova Ocorrência",
      }),
    );

    expect(mockNavegar).toHaveBeenCalledTimes(1);
    expect(mockNavegar).toHaveBeenCalledWith(
      "/lancamento-inicial/lancamento-medicao-inicial/registrar-ocorrencias/registrar-nova-ocorrencia",
      {
        state: {
          editalUuid: EDITAL_UUID,
          solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
          mes: "1",
          ano: "2026",
        },
      },
    );
  });

  it("informa quando a consulta retorna nenhuma ocorrência", async () => {
    buscarOcorrenciasSimulado.mockResolvedValueOnce(criarRespostaListagem([]));

    render(<ListaOcorrencias />);

    expect(await screen.findByText(MENSAGEM_LISTA_VAZIA)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(toastError).not.toHaveBeenCalled();
  });

  it("consulta outra página mantendo a medição e substitui os resultados anteriores", async () => {
    const ocorrenciasPrimeiraPagina = Array.from(
      { length: 10 },
      (_, indice) => ({
        ...OCORRENCIA,
        grupo: indice + 1,
        respostas: [
          {
            ...OCORRENCIA.respostas[0],
            uuid: `99999999-9999-4999-8999-${String(indice + 1).padStart(12, "0")}`,
          },
        ],
      }),
    );
    const primeiraPagina = criarRespostaListagem(ocorrenciasPrimeiraPagina);
    primeiraPagina.data.count = 11;

    const segundaPagina = criarRespostaListagem([
      {
        ...OCORRENCIA,
        grupo: 11,
        respostas: [
          {
            ...OCORRENCIA.respostas[0],
            uuid: "99999999-9999-4999-8999-000000000011",
            resposta: "Avental",
          },
        ],
      },
    ]);
    segundaPagina.data.count = 11;

    buscarOcorrenciasSimulado
      .mockResolvedValueOnce(primeiraPagina)
      .mockResolvedValueOnce(segundaPagina);

    render(<ListaOcorrencias />);

    const tabela = await screen.findByRole("table");
    expect(within(tabela).getAllByRole("row")).toHaveLength(11);

    fireEvent.click(within(screen.getByRole("list")).getByText("2"));

    expect(
      await screen.findByText("Qual item do uniforme faltou? Avental"),
    ).toBeInTheDocument();
    expect(buscarOcorrenciasSimulado).toHaveBeenLastCalledWith({
      solicitacao_medicao_inicial: SOLICITACAO_UUID,
      page: 2,
      page_size: 10,
    });
    expect(
      screen.queryByText("Qual item do uniforme faltou? Touca"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toHaveValue("1/2026");
  });

  it.each<[number, string]>([
    [
      400,
      "Os dados para consultar as ocorrências são inválidos ou estão incompletos. Volte à medição e tente novamente.",
    ],
    [
      403,
      "Você não tem permissão para consultar as ocorrências desta medição.",
    ],
    [
      404,
      "A medição ou a página de ocorrências solicitada não foi encontrada.",
    ],
    [
      500,
      "Ocorreu uma falha na consulta das ocorrências. Tente novamente mais tarde.",
    ],
  ])(
    "apresenta a mensagem de erro correspondente ao status %s",
    async (status, mensagem) => {
      buscarOcorrenciasSimulado.mockResolvedValueOnce({
        ...criarRespostaListagem([]),
        status,
      });

      render(<ListaOcorrencias />);

      await waitFor(() => expect(toastError).toHaveBeenCalledWith(mensagem));

      expect(toastError).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.queryByText(MENSAGEM_LISTA_VAZIA)).not.toBeInTheDocument();
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    },
  );

  it("apresenta uma mensagem quando a consulta lança uma exceção", async () => {
    buscarOcorrenciasSimulado.mockRejectedValueOnce(
      new Error("Falha na consulta"),
    );

    render(<ListaOcorrencias />);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível carregar as ocorrências.",
      ),
    );

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(MENSAGEM_LISTA_VAZIA)).not.toBeInTheDocument();
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  it("desconsidera uma resposta atrasada de outra medição", async () => {
    const consultaAnterior = criarConsultaPendente();
    buscarOcorrenciasSimulado
      .mockReturnValueOnce(consultaAnterior.promessa)
      .mockResolvedValueOnce(criarRespostaListagem([]));

    const { rerender } = render(<ListaOcorrencias />);

    configurarParametrosBusca(OUTRA_SOLICITACAO_UUID);
    rerender(<ListaOcorrencias />);

    await screen.findByText(MENSAGEM_LISTA_VAZIA);

    await act(async () => {
      consultaAnterior.concluir(criarRespostaListagem());
    });

    expect(buscarOcorrenciasSimulado).toHaveBeenLastCalledWith({
      solicitacao_medicao_inicial: OUTRA_SOLICITACAO_UUID,
      page: 1,
      page_size: 10,
    });
    expect(screen.getByText(MENSAGEM_LISTA_VAZIA)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(toastError).not.toHaveBeenCalled();
  });
});
