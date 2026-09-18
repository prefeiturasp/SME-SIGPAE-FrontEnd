import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { CardPendenteAcao } from "../components/CardPendenteAcao";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <div>{children}</div> : null,
}));

describe("Teste de comportamentos do componente - CardPendenteAcao", () => {
  const pedidos = [
    {
      uuid: "uuid-1",
      id_externo: "PED001",
      data: "01/01/2026",
      escola: {
        uuid: "escola-1",
        nome: "Escola Teste",
        codigo_eol: "123456",
      },
      solicitacao_kit_lanche: {
        data: "01/01/2026",
      },
      solicitacoes_similares: [
        {
          id_externo: "PED002",
          collapsed: false,

          logs: [
            {
              criado_em: "01/01/2026 10:00",
              status_evento_explicacao: "Criado",
            },
          ],

          data: "01/01/2026",
          local: "Parque",
          evento: "Passeio",
          observacao: "Observação teste",
          quantidade_alunos: 10,

          solicitacao_kit_lanche: {
            data: "01/01/2026",
            descricao: "Descrição",
            tempo_passeio_explicacao: "Integral",
            kits: [
              {
                nome: "Kit 1",
              },
            ],
          },
        },
      ],
    },
  ];

  const defaultProps = {
    titulo: "Pendentes",
    tipoDeCard: "warning",
    ultimaColunaLabel: "Data",
    pedidos,
    busca: "",
    onBusca: jest.fn(),
    escolasSolicitantes: 1,
    totalSolicitacoes: 1,
    page: 1,
    onPageChange: jest.fn(),
  };

  const setup = async (props = {}) => {
    let resultado;
    await act(async () => {
      resultado = render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <CardPendenteAcao {...defaultProps} {...props} />{" "}
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
    return resultado;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título", async () => {
    await setup();

    expect(screen.getByText("Pendentes")).toBeInTheDocument();
  });

  it("deve exibir a quantidade de solicitações", async () => {
    await setup();

    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("solicitação")).toBeInTheDocument();
    expect(screen.getByText(/escola solicitante/i)).toBeInTheDocument();
  });

  it("deve expandir o card", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByPlaceholderText("Pesquisar")).toBeInTheDocument();
    expect(screen.getByText("PED001")).toBeInTheDocument();
  });

  it("deve chamar onBusca com o termo digitado na pesquisa", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "PED001",
      },
    });

    expect(defaultProps.onBusca).toHaveBeenCalledWith("PED001");
  });

  it("deve exibir o termo de busca controlado pelo pai", async () => {
    await setup({ busca: "PED001" });

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByPlaceholderText("Pesquisar")).toHaveValue("PED001");
  });

  it("deve renderizar a escola", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("Escola Teste")).toBeInTheDocument();
  });

  it("deve renderizar o código EOL", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("deve renderizar a solicitação similar", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("#PED002")).toBeInTheDocument();
  });

  it("deve manter as solicitações similares colapsadas após atualizar os pedidos", async () => {
    const { rerender } = await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.queryByText("Solicitação Número:")).not.toBeInTheDocument();

    const novosPedidos = [
      {
        ...pedidos[0],
        uuid: "uuid-novo",
        solicitacoes_similares: [
          { ...pedidos[0].solicitacoes_similares[0], collapsed: false },
        ],
      },
      {
        ...pedidos[0],
        uuid: "uuid-novo-2",
        id_externo: "PED003",
        solicitacoes_similares: [],
      },
    ];

    await act(async () => {
      rerender(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <CardPendenteAcao {...defaultProps} pedidos={novosPedidos} />{" "}
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(screen.queryByText("Solicitação Número:")).not.toBeInTheDocument();
  });

  it("deve atualizar os resultados quando os pedidos mudam sem alterar a quantidade", async () => {
    const { rerender } = await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("PED001")).toBeInTheDocument();

    const pedidosAtualizados = [
      {
        ...pedidos[0],
        uuid: "uuid-atualizado",
        id_externo: "PED999",
      },
    ];

    await act(async () => {
      rerender(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <CardPendenteAcao
              {...defaultProps}
              pedidos={pedidosAtualizados}
            />{" "}
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(screen.getByText("PED999")).toBeInTheDocument();
    expect(screen.queryByText("PED001")).not.toBeInTheDocument();
  });

  it("deve renderizar a paginação dentro do card quando há mais de uma página", async () => {
    await setup({ totalSolicitacoes: 15 });

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(document.querySelector(".ant-pagination")).toBeInTheDocument();
  });

  it("não deve renderizar pedidos quando a lista estiver vazia", async () => {
    await setup({
      pedidos: [],
      totalSolicitacoes: 0,
    });

    expect(screen.queryByTestId("botao-expandir")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
