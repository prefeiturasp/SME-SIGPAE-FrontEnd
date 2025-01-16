import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CustomToolbar } from "../componentes/CustomToolbar";

describe("Teste <CustomToolbar>", () => {
  let toolbarMock;

  beforeEach(() => {
    toolbarMock = {
      date: new Date(2024, 11, 19),
      onNavigate: jest.fn(),
      onView: jest.fn(),
      view: "month",
    };

    render(<CustomToolbar {...toolbarMock} />);
  });

  it("verifica se a label do mês e ano é exibida corretamente", () => {
    const dateLabel = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === "December 2024";
      return hasText(element) && element.classList.contains("label-month");
    });
    expect(dateLabel).toBeInTheDocument();
  });

  it("verifica se o componente renderizou 2 botões", () => {
    const botoes = screen.getAllByRole("button");
    expect(botoes.length).toBe(2);
  });

  it("verifica se o botão de 'Anterior' chama a função onNavigate corretamente", () => {
    const botaoAnterior = screen.getByRole("button", {
      name: (_, element) =>
        element.querySelector("i.fas.fa-arrow-left") !== null,
    });
    fireEvent.click(botaoAnterior);
    expect(toolbarMock.onNavigate).toHaveBeenCalledWith("prev");
    expect(toolbarMock.date.getMonth()).toBe(11); // Dezembro de 2024
  });

  it("verifica se o botão de 'Próximo' chama a função onNavigate corretamente", () => {
    const botaoProximo = screen.getByRole("button", {
      name: (_, element) =>
        element.querySelector("i.fas.fa-arrow-right") !== null,
    });
    fireEvent.click(botaoProximo);
    expect(toolbarMock.onNavigate).toHaveBeenCalledWith("current");
    expect(toolbarMock.date.getMonth()).toBe(1); // Fevereiro de 2025
  });

  it("verifica se a aba 'Mês' chama a função onView corretamente", () => {
    const abaMes = screen.getByText("Mês");
    fireEvent.click(abaMes);

    expect(toolbarMock.onView).toHaveBeenCalledWith("month");
  });
});
