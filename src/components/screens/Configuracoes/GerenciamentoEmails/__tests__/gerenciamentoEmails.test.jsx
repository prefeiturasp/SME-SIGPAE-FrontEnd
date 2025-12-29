import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { mockMeusDadosCODAEADMIN } from "src/mocks/meusDados/CODAE/admin";
import { mockEmpresas } from "src/mocks/terceirizada.service/mockGetListaSimples";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { renderWithProvider } from "src/utils/test-utils";
import GerenciamentoEmails from "src/components/screens/Configuracoes/GerenciamentoEmails/GerenciamentoEmails";
import preview from "jest-preview";

describe("Testa a Central de Downloads", () => {
  beforeEach(async () => {
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 306 });
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEADMIN);
    mock
      .onGet("/downloads/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    mock.onGet("/terceirizadas/lista-simples/").reply(200, mockEmpresas);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <GerenciamentoEmails />
        </MemoryRouter>,
      );
    });
  });

  it("Testa renderização", async () => {
    preview.debug();
  });
});
