import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardLogo } from "../../CardLogo/CardLogo";

afterEach(() => cleanup());

describe("CardLogo", () => {
  test("Renderiza o título corretamente", () => {
    render(<CardLogo titulo="Menu de Ações" />);
    expect(screen.getByText("Menu de Ações")).toBeInTheDocument();
  });

  test("Renderiza o conteúdo children corretamente", () => {
    render(
      <CardLogo titulo="Teste">
        <span>Ícone</span>
      </CardLogo>
    );
    expect(screen.getByText("Ícone")).toBeInTheDocument();
  });

  test("Dispara onClick quando clicado", () => {
    const onClickMock = jest.fn();
    render(<CardLogo titulo="Clique Aqui" onClick={onClickMock} />);
    fireEvent.click(screen.getByText("Clique Aqui"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("Aplica a classe 'disabled' quando a prop disabled é true", () => {
    const { container } = render(<CardLogo titulo="Desativado" disabled />);
    const card = container.querySelector(".card-logo.disabled");
    expect(card).toBeInTheDocument();
  });
});
