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
import UnidadesMedidaPage from "../UnidadesMedidaPage";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";

import { mockGetNomesEAbreviacoesUnidadesMedida } from "src/mocks/services/qualidade.service/mockGetNomesEAbreviacoesUnidadesMedida";
import { mockGetUnidadesMedida } from "src/mocks/services/qualidade.service/mockGetUnidadesMedida";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { debug } from "jest-preview";

describe("Teste da página TiposEmbalagensCadastrados", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet("/unidades-medida-logistica/lista-nomes-abreviacoes/")
      .reply(200, mockGetNomesEAbreviacoesUnidadesMedida);

    mock.onGet("/unidades-medida-logistica/").reply(200, mockGetUnidadesMedida);

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
            <UnidadesMedidaPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("valida se a listagem está renderizando corretamente", async () => {
    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    expect(botaoFiltrar).toBeInTheDocument();

    fireEvent.click(botaoFiltrar);

    debug();

    await waitFor(() => {
      expect(screen.getByText("DECIGRAMA")).toBeInTheDocument();
      expect(screen.getByText("dg")).toBeInTheDocument();
    });
  });
});
