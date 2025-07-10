import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalHistoricoProtocoloPadrao from "../index";

const mockHistory = [
  {
    action: "CREATE",
    user: {
      nome: "João Silva",
      email: "joao.silva@example.com",
      username: "12345678901",
    },
    updated_at: "2023-01-01 10:00:00",
    changes: [
      {
        field: "nome_protocolo",
        from: "",
        to: "Protocolo Teste",
      },
      {
        field: "status",
        from: "",
        to: "NAO_LIBERADO",
      },
    ],
  },
  {
    action: "UPDATE",
    user: {
      nome: "Maria Souza",
      email: "maria.souza@example.com",
      username: "98765432109",
    },
    created_at: "2023-01-02 11:00:00",
    changes: [
      {
        field: "substituicoes",
        changes: [
          {
            tipo: { from: "I", to: "S" },
            alimento: { from: { nome: "Arroz" }, to: { nome: "Feijão" } },
            substitutos: {
              from: [{ uuid: "1", nome: "Arroz" }],
              to: [{ uuid: "2", nome: "Feijão" }],
            },
          },
        ],
      },
    ],
  },
  {
    action: "UPDATE_VINCULOS",
    user: {
      email: "admin@example.com",
    },
    updated_at: "2023-01-03 12:00:00",
    changes: [
      {
        field: "editais",
        from: ["Edital 1"],
        to: ["Edital 1", "Edital 2"],
      },
      {
        field: "outras informacoes",
        from: "Info antiga",
        to: "Info nova",
      },
    ],
  },
];

const mockProps = {
  visible: true,
  onOk: jest.fn(),
  onCancel: jest.fn(),
  history: mockHistory,
};

describe("ModalHistoricoProtocoloPadrao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar o modal corretamente quando visible é true", () => {
    render(<ModalHistoricoProtocoloPadrao {...mockProps} />);

    expect(screen.getByText("Histórico")).toBeTruthy();
    expect(screen.getByText("Fechar")).toBeTruthy();
    expect(screen.getByText("Usuário")).toBeTruthy();
    expect(screen.getByText("Ações")).toBeTruthy();
  });

  test("não deve renderizar o modal quando visible é false", () => {
    const { container } = render(
      <ModalHistoricoProtocoloPadrao {...mockProps} visible={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("deve renderizar a lista de históricos corretamente", () => {
    render(<ModalHistoricoProtocoloPadrao {...mockProps} />);

    const historicoItems = document.querySelectorAll(".grid-item-log");
    expect(historicoItems.length).toBe(mockHistory.length);

    expect(screen.getByText("CRIAÇÃO")).toBeTruthy();
    expect(screen.getByText("EDIÇÃO")).toBeTruthy();
    expect(screen.getByText("VÍNCULO DO EDITAL AO PROTOCOLO")).toBeTruthy();

    expect(screen.getByText("JS")).toBeTruthy();
    expect(screen.getByText("MS")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
  });

  test("deve exibir os detalhes do histórico quando um item é clicado", () => {
    render(<ModalHistoricoProtocoloPadrao {...mockProps} />);

    const primeiroItem = document.querySelectorAll(".grid-item-log")[0];
    fireEvent.click(primeiroItem);

    const nomeUsuario = document.querySelector(".nome-fantasia-empresa .w-100");
    expect(nomeUsuario.textContent).toBe("João Silva");

    expect(screen.getByText("CPF: 123.456.789-01")).toBeTruthy();

    expect(screen.getByText("Nome Protocolo")).toBeTruthy();
    expect(screen.getByText("Protocolo Teste")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByText("NÃO LIBERADO")).toBeTruthy();
  });

  test("deve fechar o modal quando o botão Fechar é clicado", () => {
    render(<ModalHistoricoProtocoloPadrao {...mockProps} />);

    fireEvent.click(screen.getByText("Fechar"));

    expect(mockProps.onOk).toHaveBeenCalledTimes(1);
  });
});
