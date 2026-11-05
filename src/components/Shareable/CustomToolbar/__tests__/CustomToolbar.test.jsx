import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CustomToolbar } from "../index";

describe("Teste <CustomToolbar>", () => {
  let toolbarMock;

  const calculateMonth = (base, offset) =>
    new Date(base.getFullYear(), base.getMonth() + offset, 1);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 11, 15, 10, 0, 0));
    const today = new Date();

    toolbarMock = {
      date: calculateMonth(today, 0),
      onNavigate: jest.fn(),
      onView: jest.fn(),
      view: "month",
    };

    render(<CustomToolbar {...toolbarMock} />);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("verifica se a label do mês e ano é exibida corretamente", () => {
    const expectedMonth = toolbarMock.date.toLocaleString("pt-BR", {
      month: "long",
    });

    const dateLabel = screen.getByText((_, element) => {
      return (
        element.textContent
          ?.toLowerCase()
          .includes(expectedMonth.toLowerCase()) &&
        element.classList.contains("label-month")
      );
    });

    expect(dateLabel).toBeInTheDocument();
  });

  it("verifica se o componente renderizou 2 botões", () => {
    const botoes = screen.getAllByRole("button");
    expect(botoes.length).toBe(3);
  });

  it("verifica se o botão de 'Anterior' chama a função onNavigate corretamente", () => {
    const botaoAnterior = screen.getByRole("button", {
      name: (_, element) =>
        element.querySelector("i.fas.fa-arrow-left") !== null,
    });
    fireEvent.click(botaoAnterior);
    expect(toolbarMock.onNavigate).toHaveBeenCalledWith("prev");

    const expectedDate = calculateMonth(new Date(), -1);
    expect(toolbarMock.date.getMonth()).toBe(expectedDate.getMonth());
  });

  it("verifica se o botão de 'Próximo' chama a função onNavigate corretamente", () => {
    const botaoProximo = screen.getByRole("button", {
      name: (_, element) =>
        element.querySelector("i.fas.fa-arrow-right") !== null,
    });
    fireEvent.click(botaoProximo);
    expect(toolbarMock.onNavigate).toHaveBeenCalledWith("current");

    const expectedDate = calculateMonth(new Date(), 1);
    expect(toolbarMock.date.getMonth()).toBe(expectedDate.getMonth());
  });

  it("verifica se a aba 'Mês' chama a função onView corretamente", () => {
    const abaMes = screen.getByText("Mês");
    fireEvent.click(abaMes);

    expect(toolbarMock.onView).toHaveBeenCalledWith("month");
  });
});
