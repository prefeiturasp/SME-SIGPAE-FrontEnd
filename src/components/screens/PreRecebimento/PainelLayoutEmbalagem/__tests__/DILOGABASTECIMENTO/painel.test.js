import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import { MeusDadosContext } from "context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosDILOGABASTECIMENTO } from "mocks/meusDados/CODAE/DILOGABASTECIMENTO";
import { mockDashboardLayoutDeEmbalagemDILOGABASTECIMENTO } from "mocks/services/layoutDeEmbalagem.service/DILOGABASTECIMENTO/dashboard";
import { mockDashboardLayoutDeEmbalagemFiltradoDILOGABASTECIMENTO } from "mocks/services/layoutDeEmbalagem.service/DILOGABASTECIMENTO/dashboardFiltrado";
import { PainelLayoutEmbalagemPage } from "pages/PreRecebimento/PainelLayoutEmbalagemPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Teste Painel Layout de Embalagens - Usuário DILOG_ABASTECIMENTO", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosDILOGABASTECIMENTO);
    mock
      .onGet("/layouts-de-embalagem/dashboard/")
      .reply(200, mockDashboardLayoutDeEmbalagemDILOGABASTECIMENTO);

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
            <PainelLayoutEmbalagemPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Layout de Embalagens`", () => {
    // sidebar, breadcrumb e título
    expect(screen.getAllByText("Layout de Embalagens").length).toBe(2);
    expect(screen.getByText("Aprovação de Layouts")).toBeInTheDocument();
  });

  it("Renderiza paineis", () => {
    expect(screen.getByText("Pendentes de Aprovação")).toBeInTheDocument();
    expect(
      screen.getByText("FT015 - CAJUINA - JP Alimentos LTDA")
    ).toBeInTheDocument();

    expect(screen.getByText("Aprovados")).toBeInTheDocument();
    expect(
      screen.getByText("FT040 - FORMIGA - JP Alimentos LTDA")
    ).toBeInTheDocument();

    expect(screen.getByText("Enviados para Correção")).toBeInTheDocument();
    expect(
      screen.getByText("FT039 - ARROZ TIPO I - Empresa do Luis Zimm...")
    ).toBeInTheDocument();
  });

  it("Renderiza hrefs de detalhe, sem poder editar em todos os cards", () => {
    const linkPendenteAprovacao = screen.getByRole("link", {
      name: /FT015 - CAJUINA - JP Alimentos LTDA/i,
    });
    expect(linkPendenteAprovacao).toHaveAttribute(
      "href",
      expect.stringContaining("detalhe-layout-embalagem")
    );

    const linkAprovados = screen.getByRole("link", {
      name: /FT040 - FORMIGA - JP Alimentos LTDA/i,
    });
    expect(linkAprovados).toHaveAttribute(
      "href",
      expect.stringContaining("detalhe-layout-embalagem")
    );

    const linkEnviadosParaCorrecao = screen.getByRole("link", {
      name: /FT039 - ARROZ TIPO I - Empresa do Luis Zimm.../i,
    });
    expect(linkEnviadosParaCorrecao).toHaveAttribute(
      "href",
      expect.stringContaining("detalhe-layout-embalagem")
    );
  });

  it("testa busca por nº do cronograma", async () => {
    const divInputBuscaPorNumeroCronograma = screen.getByTestId(
      "div-input-numero-cronograma"
    );
    const inputElement =
      divInputBuscaPorNumeroCronograma.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "003/2024A" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardLayoutDeEmbalagemFiltradoDILOGABASTECIMENTO);
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
        target: { value: "CAJUINA" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardLayoutDeEmbalagemFiltradoDILOGABASTECIMENTO);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("FT006 - BOLO INDIVIDUAL - JP Alimentos")
      ).not.toBeInTheDocument();
    });
  });

  it("testa busca por nome do fornecedor", async () => {
    const divInputBuscaPorNomeFornecedor = screen.getByTestId(
      "div-input-nome-fornecedor"
    );
    const inputElement = divInputBuscaPorNomeFornecedor.querySelector("input");
    await waitFor(() => {
      fireEvent.change(inputElement, {
        target: { value: "JP Alimentos LTDA" },
      });
      mock
        .onGet("/ficha-tecnica/dashboard/")
        .reply(200, mockDashboardLayoutDeEmbalagemFiltradoDILOGABASTECIMENTO);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("FT006 - BOLO INDIVIDUAL - JP Alimentos")
      ).not.toBeInTheDocument();
    });
  });
});
