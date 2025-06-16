import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardLegendas from "../../CardLegendas";

afterEach(() => cleanup());

describe("CardLegendas", () => {
  test("Renderiza todas as legendas corretamente", () => {
    render(<CardLegendas />);

    expect(screen.getByText("Legenda")).toBeInTheDocument();

    expect(screen.getByText("Solicitação Autorizada")).toBeInTheDocument();
    expect(
      screen.getByText("Solicitação Aguardando Autorização")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitação Aguardando Resposta da Empresa")
    ).toBeInTheDocument();
    expect(screen.getByText("Solicitação Negada")).toBeInTheDocument();
    expect(screen.getByText("Solicitação Cancelada")).toBeInTheDocument();
  });
});
