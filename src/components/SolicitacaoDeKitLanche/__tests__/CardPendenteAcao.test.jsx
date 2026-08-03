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
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(
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

  it("deve filtrar pedidos pelo código", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "PED001",
      },
    });

    expect(screen.getByText("PED001")).toBeInTheDocument();
  });

  it("deve ocultar pedidos quando a pesquisa não encontrar resultados", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    fireEvent.change(screen.getByPlaceholderText("Pesquisar"), {
      target: {
        value: "xxxx",
      },
    });

    expect(screen.queryByText("PED001")).not.toBeInTheDocument();
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

  it("não deve renderizar pedidos quando a lista estiver vazia", async () => {
    await setup({
      pedidos: [],
    });

    expect(screen.queryByTestId("botao-expandir")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
