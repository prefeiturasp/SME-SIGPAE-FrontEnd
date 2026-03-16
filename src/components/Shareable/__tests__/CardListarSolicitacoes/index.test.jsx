import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CardListarSolicitacoes } from "../../CardListarSolicitacoes";
import { localStorageMock } from "src/mocks/localStorageMock";
import { TIPO_PERFIL } from "src/constants/shared";

jest.mock("src/helpers/terceirizadas", () => ({
  conferidaClass: () => "conferida-mock",
}));

jest.mock("../../CardStatusDeSolicitacao/helper", () => ({
  caminhoURL: () => "/mock-url",
}));

jest.mock("../../CardListarSolicitacoes/tooltipProdutos", () => () => (
  <div data-testid="tooltip-produto">Tooltip mock</div>
));

jest.mock("../../../../configs/constants", () => ({
  GESTAO_PRODUTO_CARDS: {
    HOMOLOGADOS: "HOMOLOGADOS",
    PRODUTOS_SUSPENSOS: "PRODUTOS_SUSPENSOS",
  },
  RELATORIO: "relatorio",
}));

const mockSolicitacoesAbertas = {
  message: [
    {
      uuid_solicitacao: "bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c",
    },
  ],
};

jest.mock("src/services/websocket", () => {
  return {
    Websocket: jest
      .fn()
      .mockImplementation((url, onmessage, onclose, onopen) => {
        const mockSocket = {
          onmessage: null,
          onclose: null,
          onopen: null,
          close: jest.fn(),
          simulateMessage: function () {
            if (this.onmessage) {
              this.onmessage({ data: JSON.stringify(mockSolicitacoesAbertas) });
            }
          },
          simulateClose: function () {
            if (this.onclose) {
              this.onclose();
            }
          },
          simulateOpen: function (event) {
            if (this.onopen) {
              this.onopen(event);
            }
          },
        };

        if (onmessage) {
          mockSocket.onmessage = onmessage;
          mockSocket.simulateMessage();
        }
        if (onclose) mockSocket.onclose = onclose;
        if (onopen) mockSocket.onopen = onopen;

        return { socket: mockSocket };
      }),
  };
});

afterEach(() => cleanup());

describe("CardListarSolicitacoes - Produtos", () => {
  const solicitacoesMock = [
    {
      uuid: "abc123",
      tipo_doc: "TIPO_X",
      descricao: "Descrição da Solicitação",
      escola_nome: "Escola Modelo",
      date: "2024-05-23 10:30",
    },
  ];

  test("Renderiza corretamente os dados básicos", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoes
          titulo="Solicitações Teste"
          tipo="verde"
          solicitacoes={solicitacoesMock}
          icone="fa-file-alt"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Solicitações Teste")).toBeInTheDocument();

    expect(
      screen.getByText("Descrição da Solicitação / Escola Modelo"),
    ).toBeInTheDocument();

    expect(screen.getByText("2024-05-23 10:30")).toBeInTheDocument();
  });

  test("Renderiza TooltipProdutos se o título for HOMOLOGADOS", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoes
          titulo="HOMOLOGADOS"
          tipo="azul"
          solicitacoes={solicitacoesMock}
          icone="fa-check"
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("tooltip-produto")).toBeInTheDocument();
  });
});

describe("CardListarSolicitacoes - Dietas Especiais", () => {
  const defaultProps = {
    titulo: "Recebidas",
    solicitacoes: [
      {
        text: "IP - (Aluno não matriculado) - Antônio José João Mateus / EMEF PERICLES EUGENIO DA SILVA RAMOS",
        conferido: null,
        lote_uuid: "655a63ff-dd0b-4259-86a0-cdd43ac36030",
        date: "21/01/2026",
        link: "/dieta-especial/relatorio?uuid=bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c&ehInclusaoContinua=false&tipoSolicitacao=&card=pendentes-aut",
        tipo_solicitacao_dieta: "ALUNO_NAO_MATRICULADO",
      },
      {
        text: "BT - 8331887 - LORENZO DE OLIVEIRA NASCIMENTO / CR.P.CONV RECANTO DA ALEGRIA II",
        conferido: null,
        lote_uuid: null,
        date: "01/02/2024",
        link: "/dieta-especial/relatorio?uuid=bd4a72dc-41f3-4387-8a5d-b737dd89db7c&ehInclusaoContinua=false&tipoSolicitacao=&card=pendentes-aut",
        tipo_solicitacao_dieta: "ALTERACAO_UE",
      },
    ],
    tipo: "card-pending",
    icone: "fa-exclamation-triangle",
  };

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <CardListarSolicitacoes {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIETA_ESPECIAL);
  });

  it("renderiza titulo e icone", () => {
    renderComponent();

    expect(screen.getByText("Recebidas")).toBeInTheDocument();
    expect(
      document.querySelector(".fa-exclamation-triangle"),
    ).toBeInTheDocument();
  });

  it("renderiza solicitacoes da lista", () => {
    renderComponent();

    expect(screen.getByText(/Antônio José João Mateus/)).toBeInTheDocument();

    expect(
      screen.getByText(/LORENZO DE OLIVEIRA NASCIMENTO/),
    ).toBeInTheDocument();
  });

  it("renderiza datas das solicitacoes", () => {
    renderComponent();

    expect(screen.getByText("21/01/2026")).toBeInTheDocument();
    expect(screen.getByText("01/02/2024")).toBeInTheDocument();
  });

  it("renderiza fallback descricao/escola quando text nao existe", () => {
    renderComponent({
      solicitacoes: [
        {
          descricao: "Descricao Teste",
          escola_nome: "Escola Teste",
          link: "/teste",
          uuid: "1",
          tipo_doc: "DOC",
          date: "01/01/2024",
        },
      ],
    });

    expect(
      screen.getByText("Descricao Teste / Escola Teste"),
    ).toBeInTheDocument();
  });

  it("perfilDietaEspecial retorna true", () => {
    const component = new CardListarSolicitacoes(defaultProps);

    expect(component.perfilDietaEspecial()).toBe(true);
  });

  it("dietasFiltradas filtra corretamente", () => {
    const component = new CardListarSolicitacoes(defaultProps);

    component.state = {
      dietasAbertas: [
        { uuid_solicitacao: "bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c" },
      ],
    };

    const result = component.dietasFiltradas({
      link: "/dieta-especial/relatorio?uuid=bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c",
    });

    expect(result.length).toBe(1);
  });

  it("qtdDietasAbertas retorna quantidade correta", () => {
    const component = new CardListarSolicitacoes(defaultProps);

    component.state = {
      dietasAbertas: [
        { uuid_solicitacao: "bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c" },
      ],
    };

    const result = component.qtdDietasAbertas({
      link: "/dieta-especial/relatorio?uuid=bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c",
    });

    expect(result).toBe(1);
  });

  it("qtdDietasAbertas retorna mais de 9", () => {
    const component = new CardListarSolicitacoes(defaultProps);

    component.state = {
      dietasAbertas: Array.from({ length: 10 }, () => ({
        uuid_solicitacao: "bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c",
      })),
    };

    const result = component.qtdDietasAbertas({
      link: "/dieta-especial/relatorio?uuid=bbf6d9e4-4b95-4dfa-bbc4-e19d5a2d0d7c",
    });

    expect(result).toBe(10);
  });
});
