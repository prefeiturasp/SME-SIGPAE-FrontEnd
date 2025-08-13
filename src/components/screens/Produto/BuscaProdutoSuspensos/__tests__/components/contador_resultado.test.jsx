import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import ContadorResultado from "../../components/ContadorResultado";

describe("Verifica comportamentos componente de contador de resultados", () => {
  beforeEach(async () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
            <ContadorResultado
              filtros={{
                nome_edital: "teste",
              }}
              produtosCount={10}
              totalSuspensos={0}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente e seus campos foram renderizados", () => {
    expect(
      screen.getByText("QUANTITATIVO GERAL DE PRODUTO SUSPENSOS")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element.textContent === "Total de itens suspensos: 0"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element.textContent === "Total de itens teste: 10"
      )
    ).toBeInTheDocument();
  });
});
