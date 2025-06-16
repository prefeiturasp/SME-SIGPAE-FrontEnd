import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosDILOGABASTECIMENTO } from "src/mocks/meusDados/CODAE/DILOGABASTECIMENTO";
import { mockDashboardDILOGABASTECIMENTO } from "src/mocks/services/fichaTecnica.service/DILOGABASTECIMENTO/dashboard.ts";
import { mockDashboardFiltradoDILOGABASTECIMENTO } from "src/mocks/services/fichaTecnica.service/DILOGABASTECIMENTO/dashboardFiltradoPorNumeroFicha.ts";
import { PainelFichasTecnicasPage } from "src/pages/PreRecebimento/PainelFichasTecnicasPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste Painel Ficha Técnica - Usuário DILOG_ABASTECIMENTO", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosDILOGABASTECIMENTO);
    mock
      .onGet("/ficha-tecnica/dashboard/")
      .reply(200, mockDashboardDILOGABASTECIMENTO);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem("perfil", PERFIL.DILOG_ABASTECIMENTO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {" "}
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosDILOGABASTECIMENTO,
              setMeusDados: jest.fn(),
            }}
          >
            <PainelFichasTecnicasPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Fichas Técnicas`", () => {
    // sidebar, breadcrumb e título
    expect(screen.getAllByText("Fichas Técnicas").length).toBe(3);
  });

  it("Renderiza paineis", () => {
    expect(screen.getByText("Pendentes de Aprovação")).toBeInTheDocument();
    expect(
      screen.getByText("FT071 - BANANA NANICA - JP Alimentos")
    ).toBeInTheDocument();

    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(
      screen.getByText("FT069 - BANANA PRATA - JP Alimentos")
    ).toBeInTheDocument();

    expect(screen.getByText("Enviados para Correção")).toBeInTheDocument();
    expect(
      screen.getByText("FT031 - SDDSDS - JP Alimentos")
    ).toBeInTheDocument();
  });

  it("Renderiza hrefs de detalhe, sem poder editar em todos os cards", () => {
    const linkPendenteAprovacao = screen.getByRole("link", {
      name: /FT071 - BANANA NANICA - JP Alimentos/i,
    });
    expect(linkPendenteAprovacao).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica")
    );

    const linkAprovados = screen.getByRole("link", {
      name: /FT069 - BANANA PRATA - JP Alimentos/i,
    });
    expect(linkAprovados).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica")
    );

    const linkEnviadosParaCorrecao = screen.getByRole("link", {
      name: /FT031 - SDDSDS - JP Alimentos/i,
    });
    expect(linkEnviadosParaCorrecao).toHaveAttribute(
      "href",
      expect.stringContaining("detalhar-ficha-tecnica")
    );
  });

  it("testa busca por nº da ficha técnica", async () => {
    const divInputBuscaPorNumeroFichaTecnica = screen.getByTestId(
      "div-input-numero-ficha"
    );
    const inputElement =
      divInputBuscaPorNumeroFichaTecnica.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "FT070" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardFiltradoDILOGABASTECIMENTO);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("FT006 - BOLO INDIVIDUAL - JP Alimentos")
      ).not.toBeInTheDocument();
    });
  });

  it("testa busca por nome do produto", async () => {
    const divInputBuscaPorNomeProduto = screen.getByTestId(
      "div-input-nome-produto"
    );
    const inputElement = divInputBuscaPorNomeProduto.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "CARAMBOLA AMARELA" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardFiltradoDILOGABASTECIMENTO);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("FT006 - BOLO INDIVIDUAL - JP Alimentos")
      ).not.toBeInTheDocument();
    });
  });

  it("testa busca por nome do fornecedor", async () => {
    const divInputBuscaPorNomeFornecedor = screen.getByTestId(
      "div-input-nome-empresa"
    );
    const inputElement = divInputBuscaPorNomeFornecedor.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "JP Alimentos" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardFiltradoDILOGABASTECIMENTO);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("FT006 - BOLO INDIVIDUAL - JP Alimentos")
      ).not.toBeInTheDocument();
    });
  });
});
