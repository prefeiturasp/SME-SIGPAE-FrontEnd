import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import BotaoCadastrarCategoria from "../Categorias/components/BotaoCadastrarCategoria";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick }) => (
    <button type="button" onClick={onClick}>
      {texto}
    </button>
  ),
}));

describe("BotaoCadastrarCategoria", () => {
  const navegarMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navegarMock);
  });

  it("deve renderizar o botão de cadastrar categoria", () => {
    render(<BotaoCadastrarCategoria />);

    expect(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    ).toBeInTheDocument();
  });

  it("deve navegar para o cadastro de categoria ao clicar no botão", () => {
    render(<BotaoCadastrarCategoria />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    expect(navegarMock).toHaveBeenCalledTimes(1);
    expect(navegarMock).toHaveBeenCalledWith(
      "/ajuda/cadastro-categoria/cadastrar",
    );
  });
});
