import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Card from "../Card";

jest.mock("../../Shareable/ToggleExpandir", () => ({
  ToggleExpandir: ({ onClick }) => (
    <button data-testid="toggle-button" onClick={onClick}>
      Toggle
    </button>
  ),
}));

afterEach(cleanup);

describe("Card component", () => {
  const questionText = "O que é o SIGPAE?";
  const answerText = "Sistema de Gestão de Processos de Alimentação Escolar";

  test("Renderiza a pergunta corretamente", () => {
    render(<Card question={questionText} answer={answerText} />);

    expect(screen.getByText(questionText)).toBeInTheDocument();
  });

  test("Exibe a resposta ao clicar no botão de expandir", () => {
    render(<Card question={questionText} answer={answerText} />);

    const toggleButton = screen.getByTestId("toggle-button");

    fireEvent.click(toggleButton);

    expect(screen.getByText(answerText)).toBeInTheDocument();
  });

  test("Oculta visualmente a resposta ao clicar novamente no botão (mantém no DOM)", () => {
    render(<Card question={questionText} answer={answerText} />);

    const toggleButton = screen.getByTestId("toggle-button");

    fireEvent.click(toggleButton);
    expect(screen.getByText(answerText)).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByText(answerText)).toBeInTheDocument();
  });
});
