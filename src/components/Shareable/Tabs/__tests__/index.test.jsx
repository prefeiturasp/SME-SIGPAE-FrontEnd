import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Tabs from "../index";

describe("Testes do componente Tabs", () => {
  const tabs = ["Produtos", "Marcas", "Fabricantes"];

  const setup = () => {
    return render(
      <Tabs tabs={tabs}>
        {({ activeIndex }) => (
          <div data-testid="active-index">{activeIndex}</div>
        )}
      </Tabs>,
    );
  };

  it("deve renderizar todas as abas", () => {
    setup();

    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Marcas")).toBeInTheDocument();
    expect(screen.getByText("Fabricantes")).toBeInTheDocument();
  });

  it("deve iniciar com a primeira aba ativa", () => {
    setup();

    expect(screen.getByText("Produtos")).toHaveClass("active");
    expect(screen.getByText("Marcas")).toHaveClass("inactive");
    expect(screen.getByText("Fabricantes")).toHaveClass("inactive");
  });

  it("deve informar o índice da primeira aba para os filhos", () => {
    setup();

    expect(screen.getByTestId("active-index")).toHaveTextContent("0");
  });

  it("deve ativar a aba selecionada ao clicar", async () => {
    setup();

    await userEvent.click(screen.getByText("Marcas"));

    expect(screen.getByText("Produtos")).toHaveClass("inactive");
    expect(screen.getByText("Marcas")).toHaveClass("active");
    expect(screen.getByText("Fabricantes")).toHaveClass("inactive");
  });

  it("deve atualizar o índice ativo ao clicar em uma aba", async () => {
    setup();

    await userEvent.click(screen.getByText("Marcas"));

    expect(screen.getByTestId("active-index")).toHaveTextContent("1");
  });

  it("deve ativar a terceira aba ao clicar nela", async () => {
    setup();

    await userEvent.click(screen.getByText("Fabricantes"));

    expect(screen.getByText("Produtos")).toHaveClass("inactive");
    expect(screen.getByText("Marcas")).toHaveClass("inactive");
    expect(screen.getByText("Fabricantes")).toHaveClass("active");

    expect(screen.getByTestId("active-index")).toHaveTextContent("2");
  });

  it("deve permitir trocar de aba mais de uma vez", async () => {
    setup();

    await userEvent.click(screen.getByText("Marcas"));

    expect(screen.getByText("Marcas")).toHaveClass("active");
    expect(screen.getByTestId("active-index")).toHaveTextContent("1");

    await userEvent.click(screen.getByText("Fabricantes"));

    expect(screen.getByText("Fabricantes")).toHaveClass("active");
    expect(screen.getByText("Marcas")).toHaveClass("inactive");
    expect(screen.getByTestId("active-index")).toHaveTextContent("2");

    await userEvent.click(screen.getByText("Produtos"));

    expect(screen.getByText("Produtos")).toHaveClass("active");
    expect(screen.getByText("Fabricantes")).toHaveClass("inactive");
    expect(screen.getByTestId("active-index")).toHaveTextContent("0");
  });
});
