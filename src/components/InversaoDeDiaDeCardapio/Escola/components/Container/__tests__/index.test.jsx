import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import { MeusDadosContext } from "src/context/MeusDadosContext";
import { getDiasUteis } from "src/services/diasUteis.service";
import { Container } from "../../Container";

jest.mock("src/services/diasUteis.service", () => ({
  getDiasUteis: jest.fn(),
}));

const meusDados = {
  vinculo_atual: {
    instituicao: {
      uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
    },
  },
};

describe("Container da Inversão de Dia de Cardápio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir uma mensagem quando não for possível carregar os dias úteis", async () => {
    getDiasUteis.mockResolvedValue({ status: 500 });

    render(
      <MeusDadosContext.Provider value={{ meusDados }}>
        <Container />
      </MeusDadosContext.Provider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar dias úteis. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });

    expect(getDiasUteis).toHaveBeenCalledWith({
      escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
    });
  });
});
