import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import TiposEmbalagensCadastradosPage from "../TiposEmbalagensCadastradosPage";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";

import { mockGetListaNomesTiposEmbalagens } from "src/mocks/services/qualidade.service/mockGetListaNomesTiposEmbalagens";
import { mockGetListaAbreviacoesTiposEmbalagens } from "src/mocks/services/qualidade.service/mockGetListaAbreviacoesTiposEmbalagens";
import { mockGetTiposEmbalagens } from "src/mocks/services/qualidade.service/mockGetTiposEmbalagens";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

describe("Teste da página TiposEmbalagensCadastrados", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet("/tipos-embalagens/lista-nomes-tipos-embalagens/")
      .reply(200, mockGetListaNomesTiposEmbalagens);

    mock
      .onGet("/tipos-embalagens/lista-abreviacoes-tipos-embalagens/")
      .reply(200, mockGetListaAbreviacoesTiposEmbalagens);

    mock.onGet("/tipos-embalagens/").reply(200, mockGetTiposEmbalagens);

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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <TiposEmbalagensCadastradosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("valida se a listagem está renderizando corretamente", async () => {
    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    expect(botaoFiltrar).toBeInTheDocument();

    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("COPO PLASTICO")).toBeInTheDocument();
      expect(screen.getByText("CAIXA DE PAPELAO")).toBeInTheDocument();
    });
  });
});
