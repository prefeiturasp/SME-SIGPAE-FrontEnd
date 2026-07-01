import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ListaRelatorios } from "../index";

const mockNavigate = jest.fn();
const mockBotao = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  Botao: (props: any) => mockBotao(props),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_STYLE: {
    GREEN: "green",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
  },
}));

jest.mock("src/configs/constants", () => ({
  SUPERVISAO: "supervisao",
  TERCEIRIZADAS: "terceirizadas",
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS: "relatorio-fiscalizacao-terceirizadas",
  RELATORIO_FISCALIZACAO: "relatorio-fiscalizacao",
}));

describe("ListaRelatorios", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockBotao.mockImplementation(
      ({ texto, type, onClick, style, className }) => (
        <button
          type={type}
          onClick={onClick}
          className={className}
          data-style={style}
        >
          {texto}
        </button>
      ),
    );
  });

  it("renderiza o botão para cadastrar um novo relatório", () => {
    render(<ListaRelatorios />);

    const botao = screen.getByRole("button", {
      name: "Cadastrar Novo Relatório de Fiscalização",
    });

    expect(botao).toBeInTheDocument();
    expect(botao).toHaveAttribute("type", "button");
    expect(botao).toHaveClass("ms-3");
    expect(botao).toHaveAttribute("data-style", "green");
  });

  it("navega para o cadastro de relatório de fiscalização", () => {
    render(<ListaRelatorios />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cadastrar Novo Relatório de Fiscalização",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/supervisao/terceirizadas/relatorio-fiscalizacao-terceirizadas/relatorio-fiscalizacao",
    );
  });
});
