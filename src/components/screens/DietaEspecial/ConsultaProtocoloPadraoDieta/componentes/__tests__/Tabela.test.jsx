import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TabelaProtocolos from "src/components/screens/DietaEspecial/ConsultaProtocoloPadraoDieta/componentes/Tabela";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const uuidProtocolo = "7c65da52-571c-4764-b79a-657c1333d1be";
const mockResultado = {
  results: [
    {
      uuid: uuidProtocolo,
      nome_protocolo: "Protocolo Teste",
      status: "Ativo",
      editais: [{ numero: "01/2024" }, { numero: "02/2024" }],
      orientacoes_gerais: "<b>Orientação 1</b>",
      outras_informacoes: "Info Extra",
      historico: [
        {
          data: "2024-01-01",
          acao: "Criado",
          user: { nome: "Admin", email: "admin@teste.com" },
        },
      ],
      substituicoes: [
        {
          alimento: { nome: "Leite" },
          tipo: "Substituição",
          alimentos_substitutos: [{ nome: "Leite de Soja" }],
          substitutos: [{ nome: "Suco" }],
        },
      ],
    },
  ],
};

describe("Componente TabelaProtocolos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (data = mockResultado) => {
    return render(
      <BrowserRouter>
        <TabelaProtocolos resultado={data} />
      </BrowserRouter>,
    );
  };

  it("deve renderizar a tabela e alternar a expansão ao clicar no ícone", () => {
    renderComponent();

    expect(screen.getByText("Protocolo Teste")).toBeInTheDocument();
    expect(screen.getByText("01/2024, 02/2024")).toBeInTheDocument();

    const expandIcon = document.querySelector(".fa-angle-down");
    expect(expandIcon).toBeInTheDocument();

    fireEvent.click(expandIcon);
    expect(expandIcon).toHaveClass("fa-angle-up");
    expect(screen.getByText("Orientações Gerais")).toBeInTheDocument();

    fireEvent.click(expandIcon);
    expect(expandIcon).toHaveClass("fa-angle-down");
  });

  it("deve abrir e fechar o modal de histórico", () => {
    renderComponent();

    fireEvent.click(document.querySelector(".fa-angle-down"));

    const btnHistorico = screen.getByText("Histórico");
    fireEvent.click(btnHistorico);
  });

  it("deve navegar para as telas de Editar e Criar Cópia", () => {
    renderComponent();
    fireEvent.click(document.querySelector(".fa-angle-down"));

    const btnEditar = screen.getByText("Editar");
    fireEvent.click(btnEditar);
    expect(mockedNavigate).toHaveBeenCalledWith(
      `/dieta-especial/protocolo-padrao/${uuidProtocolo}/editar`,
    );

    const btnCopia = screen.getByText("Criar cópia");
    fireEvent.click(btnCopia);
    expect(mockedNavigate).toHaveBeenCalledWith(
      `/dieta-especial/protocolo-padrao/${uuidProtocolo}/criar-copia`,
    );
  });

  it("deve renderizar corretamente as substituições (listas)", () => {
    renderComponent();
    fireEvent.click(document.querySelector(".fa-angle-down"));

    expect(screen.getByText("Leite")).toBeInTheDocument();
    expect(screen.getByText("Leite de Soja")).toBeInTheDocument();
    expect(screen.getByText("Suco")).toBeInTheDocument();
  });

  it("não deve renderizar 'Outras informações' se o campo estiver vazio", () => {
    const mockVazio = {
      results: [
        {
          ...mockResultado.results[0],
          outras_informacoes: null,
        },
      ],
    };
    renderComponent(mockVazio);
    fireEvent.click(document.querySelector(".fa-angle-down"));

    expect(screen.queryByText("Outras informações")).not.toBeInTheDocument();
  });
});
