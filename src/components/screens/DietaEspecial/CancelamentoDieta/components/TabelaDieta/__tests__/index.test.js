import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TabelaDieta from "../index";
import { getSolicitacoesDietaEspecial } from "src/services/dietaEspecial.service";

jest.mock("src/services/dietaEspecial.service");

describe("Componente TabelaDieta", () => {
  const mockDieta = {
    uuid: "12345",
    id_externo: "67890",
    aluno: {
      nome: "Aluno Teste",
      cpf: "123.456.789-00",
      codigo_eol: "1234567",
      data_nascimento: "01/01/2010",
      uuid: "aluno-uuid",
    },
    tipo_solicitacao: "COMUM",
    nome_completo_pescritor: "Dr. Teste",
    registro_funcional_pescritor: "CRM/12345",
    anexos: [
      { arquivo_url: "http://teste.com/anexo1.pdf" },
      { arquivo_url: "http://teste.com/anexo2.pdf" },
    ],
    observacoes: "Observação de teste",
  };

  const mockFiltros = {};
  const mockSetFiltros = jest.fn();

  const mockStore = configureStore([]);
  const store = mockStore({});

  beforeEach(() => {
    getSolicitacoesDietaEspecial.mockResolvedValue({
      data: {
        results: [
          {
            id_externo: "54321",
            status: "INATIVA",
            data_inicial: "01/01/2022",
            data_final: "31/12/2022",
          },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve mostrar CPF quando for dieta de aluno não matriculado", () => {
    const dietaNaoMatriculado = {
      ...mockDieta,
      tipo_solicitacao: "ALUNO_NAO_MATRICULADO",
    };

    render(
      <Provider store={store}>
        <TabelaDieta
          dieta={dietaNaoMatriculado}
          bordas="borda-teste"
          ativos={[mockDieta.uuid]}
          icone="minus"
          filtros={mockFiltros}
          setFiltros={mockSetFiltros}
        />
      </Provider>
    );

    expect(screen.getByText("CPF do Aluno")).toBeInTheDocument();
    expect(screen.getByText(mockDieta.aluno.cpf)).toBeInTheDocument();
  });

  it("deve renderizar os dados do prescritor quando disponíveis", () => {
    render(
      <Provider store={store}>
        <TabelaDieta
          dieta={mockDieta}
          bordas="borda-teste"
          ativos={[mockDieta.uuid]}
          icone="minus"
          filtros={mockFiltros}
          setFiltros={mockSetFiltros}
        />
      </Provider>
    );

    expect(
      screen.getByText(
        "Nome do Prescritor do laudo (médico, nutricionista, fonoaudiólogo)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockDieta.nome_completo_pescritor)
    ).toBeInTheDocument();
  });

  it("deve renderizar os links para os anexos", () => {
    render(
      <Provider store={store}>
        <TabelaDieta
          dieta={mockDieta}
          bordas="borda-teste"
          ativos={[mockDieta.uuid]}
          icone="minus"
          filtros={mockFiltros}
          setFiltros={mockSetFiltros}
        />
      </Provider>
    );

    expect(screen.getByText("Anexos")).toBeInTheDocument();
    expect(screen.getByText("Anexo 1")).toHaveAttribute(
      "href",
      mockDieta.anexos[0].arquivo_url
    );
  });

  it("deve renderizar as observações corretamente", () => {
    render(
      <Provider store={store}>
        <TabelaDieta
          dieta={mockDieta}
          bordas="borda-teste"
          ativos={[mockDieta.uuid]}
          icone="minus"
          filtros={mockFiltros}
          setFiltros={mockSetFiltros}
        />
      </Provider>
    );

    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.getByText(mockDieta.observacoes)).toBeInTheDocument();
  });

  it("deve abrir o modal quando o botão de cancelamento é clicado", () => {
    render(
      <Provider store={store}>
        <TabelaDieta
          dieta={mockDieta}
          bordas="borda-teste"
          ativos={[mockDieta.uuid]}
          icone="minus"
          filtros={mockFiltros}
          setFiltros={mockSetFiltros}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText("Solicitar Cancelamento"));
  });
});
