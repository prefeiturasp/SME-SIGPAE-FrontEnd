import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosDILOGABASTECIMENTO } from "src/mocks/meusDados/CODAE/DILOGABASTECIMENTO";
import { mockDashboardDILOGABASTECIMENTO } from "src/mocks/services/fichaTecnica.service/DILOGABASTECIMENTO/dashboard.ts";
import { PainelFichasTecnicasPage } from "src/pages/PreRecebimento/PainelFichasTecnicasPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("PainelFichasTecnicasPage - Permissões DILOG_VISUALIZACAO (somente visualização)", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosDILOGABASTECIMENTO);
    mock
      .onGet("/ficha-tecnica/dashboard/")
      .reply(200, mockDashboardDILOGABASTECIMENTO);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem("perfil", PERFIL.DILOG_VISUALIZACAO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDILOGABASTECIMENTO,
              setMeusDados: jest.fn(),
            }}
          >
            <PainelFichasTecnicasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("libera o acesso ao Painel de Fichas Técnicas", () => {
    expect(screen.getAllByText("Fichas Técnicas").length).toBe(3);

    expect(screen.getByText("Pendentes de Aprovação")).toBeInTheDocument();
    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(screen.getByText("Enviados para Correção")).toBeInTheDocument();
  });

  it("todos os cards apontam para Detalhar (nunca Analisar)", () => {
    const linkPendente = screen.getByRole("link", {
      name: /FT071 - BANANA NANICA - JP Alimentos/i,
    });
    expect(linkPendente).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica"),
    );
    expect(linkPendente).not.toHaveAttribute(
      "href",
      expect.stringContaining("analisar-ficha-tecnica"),
    );

    const linkAprovados = screen.getByRole("link", {
      name: /FT069 - BANANA PRATA - JP Alimentos/i,
    });
    expect(linkAprovados).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica"),
    );

    const linkCorrecao = screen.getByRole("link", {
      name: /FT031 - SDDSDS - JP Alimentos/i,
    });
    expect(linkCorrecao).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica"),
    );
  });
});
