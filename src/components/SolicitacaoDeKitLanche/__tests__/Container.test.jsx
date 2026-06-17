import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { visaoPorComboSomenteDatas } from "src/constants/shared";
import Container from "../CODAE/PainelPedidos/Container";

const mockPainelPedidos = jest.fn();

jest.mock("../CODAE/PainelPedidos", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: (props) => {
      mockPainelPedidos(props);

      return React.createElement("div", {
        "data-testid": "painel-pedidos",
      });
    },
  };
});

describe("PainelPedidos Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o PainelPedidos", () => {
    render(<Container filtros={{}} />);

    expect(screen.getByTestId("painel-pedidos")).toBeInTheDocument();
    expect(mockPainelPedidos).toHaveBeenCalledTimes(1);
  });

  it("repassa os filtros de DRE e lote para o PainelPedidos", () => {
    const filtros = {
      diretoria_regional: "8f1da4a7-11b6-4a09-9eaa-6633d066f26b",
      lote: "4e72e8e5-f0d3-4315-998e-2dfc7b8fff45",
    };

    render(<Container filtros={filtros} />);

    const props = mockPainelPedidos.mock.calls[0][0];

    expect(props).toEqual(
      expect.objectContaining({
        visaoPorCombo: visaoPorComboSomenteDatas,
        pedidosAutorizados: [],
        pedidosReprovados: [],
        filtros,
      }),
    );
  });
});
