import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import CorrigirLayoutEmbalagemPage from "src/pages/PreRecebimento/CorrigirLayoutEmbalagemPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import {
  mockDetalharLayoutEmbalagem,
  mockDetalharLayoutEmbalagemSemSecundaria,
} from "src/mocks/services/layoutDeEmbalagem.service/Terceirizada/mockDetalharLayoutEmbalagem";
import { mockMeusDadosTerceirizadaAdmEmpresa } from "src/mocks/meusDados/terceirizada";
import { localStorageMock } from "src/mocks/localStorageMock";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

import { debug } from "jest-preview";

describe("Teste <SolicitacoesAlimentacao> (RelatorioSolicitacoesAlimentacao)", () => {
  beforeEach(async () => {
    const search = `?uuid=${mockDetalharLayoutEmbalagem.uuid}`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    mock
      .onGet(`/layouts-de-embalagem/${mockDetalharLayoutEmbalagem.uuid}/`)
      .reply(200, mockDetalharLayoutEmbalagem);

    mock
      .onGet(
        `http://localhost:8000/media/layouts_de_embalagens/a4e26aab-d35a-43ac-af1d-af3ae866984e.pdf`
      )
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

    mock
      .onGet(
        `http://localhost:8000/media/layouts_de_embalagens/49023fda-3280-4bd8-ab04-569a3afa36bf.pdf`
      )
      .reply(200, new Blob(["conteúdo do PDF"], { type: "application/pdf" }));

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
              meusDados: mockMeusDadosTerceirizadaAdmEmpresa,
              setMeusDados: jest.fn(),
            }}
          >
            <CorrigirLayoutEmbalagemPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização da página quando embalagem terciária é null", async () => {
    await waitFor(() => {
      expect(
        screen.getByText("FT023 - BOLACHINHA DE NATA")
      ).toBeInTheDocument();
      expect(screen.getByText("Teste 1")).toBeInTheDocument();
      expect(screen.getByText("Teste 2")).toBeInTheDocument();
    });

    expect(screen.queryAllByText("Embalagem Terciária")).toHaveLength(0);
  });

  it("Testa a renderização da página quando embalagens secundaria e terciaria são null", async () => {
    mock
      .onGet(
        `/layouts-de-embalagem/${mockDetalharLayoutEmbalagemSemSecundaria.uuid}/`
      )
      .reply(200, mockDetalharLayoutEmbalagemSemSecundaria);

    await waitFor(() => {
      expect(
        screen.getByText("FT023 - BOLACHINHA DE NATA")
      ).toBeInTheDocument();
      expect(screen.getByText("Teste 1")).toBeInTheDocument();
    });

    expect(screen.queryAllByText("Embalagem Secundária")).toHaveLength(0);
    expect(screen.queryAllByText("Embalagem Terciária")).toHaveLength(0);

    debug();
  });
});
