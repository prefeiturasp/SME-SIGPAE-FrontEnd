import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import AlteracaoDeCardapioPage from "pages/Escola/AlteracaoDeCardapioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Teste Formulário Alteração de Cardápio - EMEF", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

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
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <AlteracaoDeCardapioPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza título da página e o breadcrumb `Alteração do Tipo de Alimentação`", async () => {
    expect(
      screen.queryAllByText("Alteração do Tipo de Alimentação").length
    ).toBe(2);
  });
});
