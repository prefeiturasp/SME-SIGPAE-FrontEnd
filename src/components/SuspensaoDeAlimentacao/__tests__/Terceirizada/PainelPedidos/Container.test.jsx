import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Container from "../../../Terceirizada/PainelPedidos/Container";
import PainelPedidos from "../../../Terceirizada/PainelPedidos";
import { visaoPorComboSomenteDatas } from "src/constants/shared";

jest.mock("../../../Terceirizada/PainelPedidos", () =>
  jest.fn(() => <div data-testid="painel-pedidos" />),
);

describe("Container - Suspensão de Alimentação Terceirizada", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o PainelPedidos", () => {
    render(<Container />);

    expect(screen.getByTestId("painel-pedidos")).toBeInTheDocument();
  });

  it("repassa a visão por combo inicial para o PainelPedidos", () => {
    render(<Container />);

    expect(PainelPedidos).toHaveBeenCalledWith(
      expect.objectContaining({
        visaoPorCombo: visaoPorComboSomenteDatas,
      }),
      {},
    );
  });
});
