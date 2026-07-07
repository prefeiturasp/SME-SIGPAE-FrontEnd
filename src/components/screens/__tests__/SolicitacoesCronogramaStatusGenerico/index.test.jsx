import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { SolicitacoesCronogramaStatusGenerico } from "../../SolicitacoesCronogramaStatusGenerico";

jest.mock("antd", () => ({
  Spin: ({ children }) => <>{children}</>,
}));

jest.mock("src/components/Shareable/CardListarSolicitacoesCronograma", () => ({
  __esModule: true,
  default: ({ solicitacoes }) => (
    <div data-testid="card-listar-solicitacoes">
      {solicitacoes?.map((solicitacao) => (
        <div
          key={solicitacao.link}
          data-testid="solicitacao-formatada"
          data-ponto-a-ponto={String(solicitacao.ponto_a_ponto)}
          data-programa-leve-leite={String(solicitacao.programa_leve_leite)}
        >
          {solicitacao.texto}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ onChange, total, pageSize, current }) => (
    <button
      type="button"
      data-testid="paginacao"
      data-total={total}
      data-page-size={pageSize}
      data-current={current}
      onClick={() => onChange(2)}
    >
      Paginar
    </button>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => {
  return ({ input, placeholder, inputOnChange }) => (
    <input
      placeholder={placeholder}
      value={input?.value || ""}
      onChange={(event) => {
        input?.onChange?.(event);
        inputOnChange?.(event);
      }}
    />
  );
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("SolicitacoesCronogramaStatusGenerico", () => {
  const propsPadrao = {
    getSolicitacoesComFiltros: jest.fn(),
    params: {
      status: "EM_ANALISE",
      offset: 0,
      limit: 10,
    },
    limit: 10,
    titulo: "Solicitações",
    icone: "fa-calendar",
    cardType: "tipo-mock",
  };

  const responseCronograma = {
    status: 200,
    data: {
      results: [
        {
          total: 1,
          dados: [
            {
              uuid: "11111111-1111-4111-8111-111111111111",
              numero: "151/2024A",
              produto: "CAQUI",
              empresa: "Fornecedor Teste",
              log_mais_recente: "06/07/2026",
              programa_leve_leite: false,
              ponto_a_ponto: true,
            },
          ],
        },
      ],
    },
  };

  const responseSolicitacaoAlteracao = {
    status: 200,
    data: {
      results: [
        {
          total: 1,
          dados: [
            {
              uuid: "22222222-2222-4222-8222-222222222222",
              cronograma: "072/2023",
              empresa: "Empresa do Luis Zimmermann",
              log_mais_recente: "02/01/2024",
              programa_leve_leite: false,
              ponto_a_ponto: true,
            },
          ],
        },
      ],
    },
  };

  test("Deve carregar solicitações ao montar a tela", async () => {
    const getSolicitacoes = jest.fn().mockResolvedValue(responseCronograma);

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        alteracao={false}
      />,
    );

    const solicitacao = await screen.findByTestId("solicitacao-formatada");

    expect(getSolicitacoes).toHaveBeenCalledTimes(1);
    expect(solicitacao).toHaveTextContent(
      "151/2024A - CAQUI - Fornecedor Teste",
    );
    expect(solicitacao).toHaveAttribute("data-ponto-a-ponto", "true");
  });

  test("Deve formatar solicitações de alteração preservando o campo ponto_a_ponto", async () => {
    const getSolicitacoes = jest
      .fn()
      .mockResolvedValue(responseSolicitacaoAlteracao);

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        alteracao={true}
      />,
    );

    const solicitacao = await screen.findByTestId("solicitacao-formatada");

    expect(solicitacao).toHaveTextContent(
      "072/2023 - Empresa do Luis Zimmermann",
    );
    expect(solicitacao).toHaveAttribute("data-ponto-a-ponto", "true");
    expect(solicitacao).toHaveAttribute("data-programa-leve-leite", "false");
  });

  test("Deve filtrar quando algum campo possuir mais de dois caracteres", async () => {
    jest.useFakeTimers();

    const getSolicitacoes = jest
      .fn()
      .mockResolvedValue(responseSolicitacaoAlteracao);

    const getSolicitacoesComFiltros = jest.fn().mockResolvedValue({
      status: 200,
      data: {
        results: [
          {
            total: 1,
            dados: [
              {
                uuid: "33333333-3333-4333-8333-333333333333",
                cronograma: "073/2023",
                empresa: "Fornecedor Filtrado",
                log_mais_recente: "03/01/2024",
                programa_leve_leite: false,
                ponto_a_ponto: true,
              },
            ],
          },
        ],
      },
    });

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        getSolicitacoesComFiltros={getSolicitacoesComFiltros}
        alteracao={true}
      />,
    );

    await screen.findByText("072/2023 - Empresa do Luis Zimmermann");

    fireEvent.change(
      screen.getByPlaceholderText("Pesquisar por Nome do Fornecedor"),
      {
        target: { value: "Fornecedor" },
      },
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getSolicitacoesComFiltros).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByText("073/2023 - Fornecedor Filtrado"),
    ).toBeInTheDocument();
  });

  test("Deve limpar o filtro e buscar novamente sem filtros quando o campo voltar a ter menos de três caracteres", async () => {
    jest.useFakeTimers();

    const getSolicitacoes = jest
      .fn()
      .mockResolvedValue(responseSolicitacaoAlteracao);

    const getSolicitacoesComFiltros = jest.fn().mockResolvedValue({
      status: 200,
      data: {
        results: [
          {
            total: 1,
            dados: [
              {
                uuid: "44444444-4444-4444-8444-444444444444",
                cronograma: "074/2023",
                empresa: "Fornecedor Filtrado",
                log_mais_recente: "04/01/2024",
                programa_leve_leite: false,
                ponto_a_ponto: true,
              },
            ],
          },
        ],
      },
    });

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        getSolicitacoesComFiltros={getSolicitacoesComFiltros}
        alteracao={true}
      />,
    );

    await screen.findByText("072/2023 - Empresa do Luis Zimmermann");

    fireEvent.change(
      screen.getByPlaceholderText("Pesquisar por Nome do Fornecedor"),
      {
        target: { value: "Fornecedor" },
      },
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getSolicitacoesComFiltros).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(
      screen.getByPlaceholderText("Pesquisar por Nome do Fornecedor"),
      {
        target: { value: "" },
      },
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getSolicitacoes).toHaveBeenCalledTimes(2);
    });
  });

  test("Deve buscar a próxima página ao alterar a paginação", async () => {
    const getSolicitacoes = jest
      .fn()
      .mockResolvedValue(responseSolicitacaoAlteracao);

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        alteracao={true}
      />,
    );

    await screen.findByText("072/2023 - Empresa do Luis Zimmermann");

    fireEvent.click(screen.getByTestId("paginacao"));

    await waitFor(() => {
      expect(getSolicitacoes).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByTestId("paginacao")).toHaveAttribute(
      "data-current",
      "2",
    );
  });

  test("Deve exibir mensagem de erro quando a busca de solicitações falhar", async () => {
    const getSolicitacoes = jest.fn().mockResolvedValue({
      status: 500,
      data: "Erro ao carregar solicitações",
    });

    render(
      <SolicitacoesCronogramaStatusGenerico
        {...propsPadrao}
        getSolicitacoes={getSolicitacoes}
        alteracao={true}
      />,
    );

    expect(
      await screen.findByText("Erro ao carregar solicitações"),
    ).toBeInTheDocument();

    expect(getSolicitacoes).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByTestId("card-listar-solicitacoes"),
    ).not.toBeInTheDocument();
  });
});
