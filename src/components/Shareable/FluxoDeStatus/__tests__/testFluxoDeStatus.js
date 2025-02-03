import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FluxoDeStatus } from "../../FluxoDeStatus";
import { fluxoPartindoEscola } from "../helper";

describe("Teste <FluxoDeStatus>", () => {
  const listaDeStatus = [
    {
      titulo: "Solicitação Realizada",
      status: "prosseguiu",
      status_evento_explicacao: "Solicitação Realizada",
      criado_em: "25/04/2019 às 9:20",
      usuario: { rf: "7972324", nome: "João da Silva" },
    },
    {
      titulo: "DRE não validou",
      status: "reprovado",
      status_evento_explicacao: "DRE não validou",
      criado_em: "25/04/2019 às 9:20",
      usuario: { rf: "7972324", nome: "João da Silva" },
    },
  ];

  beforeEach(() => {
    render(
      <FluxoDeStatus
        listaDeStatus={listaDeStatus}
        fluxo={fluxoPartindoEscola}
      />
    );
  });

  it("renderiza", () => {
    expect(screen.getByText("Solicitação Realizada")).toBeInTheDocument();
  });

  it("renderiza a quantidade de titulos passados", () => {
    const ulElement = screen.getByTestId("progressbar-titles");
    const listItems = ulElement.querySelectorAll("li");
    expect(listItems).toHaveLength(3);
  });

  it("renderiza o primeiro titulo corretamente", () => {
    const ulElement = screen.getByTestId("progressbar-titles");
    const listItems = ulElement.querySelectorAll("li");
    expect(listItems[0]).toHaveTextContent("Solicitação Realizada");
  });

  it("renderiza a classe do primeiro status corretamente", () => {
    const ulElement = screen.getByTestId("progressbar");
    const listItems = ulElement.querySelectorAll("li");
    expect(listItems[0]).toHaveClass("active");
  });

  it("renderiza a classe do segundo status corretamente", () => {
    const ulElement = screen.getByTestId("progressbar");
    const listItems = ulElement.querySelectorAll("li");
    expect(listItems[1]).toHaveClass("disapproved");
  });

  it("renderiza a largura corretamente", () => {
    const ulElement = screen.getByTestId("progressbar");
    const listItems = ulElement.querySelectorAll("li");
    expect(listItems[1]).toHaveStyle("width: 33.333333333333336%");
  });
});
