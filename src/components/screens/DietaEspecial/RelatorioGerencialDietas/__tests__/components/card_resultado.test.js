import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import CardResultado from "../../components/CardResultado";

import mock from "src/services/_mock";

describe("Verifica renderização de componente de Card de Resultados - Relatório Gerencial de Dietas", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <CardResultado titulo="Teste" total={2} classeCor="" />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização de componente", () => {
    expect(screen.getByText("Teste")).toBeInTheDocument();
    expect(screen.getByText("0002")).toBeInTheDocument();
  });
});
