import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act } from "@testing-library/react";
import { renderWithProvider } from "src/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mockMeusDadosEscolaCEMEISuzanaCampos } from "src/mocks/meusDados/escolaCEMEISuzanaCampos";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockConsultakits } from "src/mocks/SolicitacaoKitLancheCEMEI/mockGetConsultaKits";
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativasCEMEISuzana";
import { mockConsultaRascunhos } from "src/mocks/SolicitacaoKitLancheCEMEI/mockGetSolictacaoRascunho";
import { SolicitacaoKitLancheCEMEI } from "src/components/SolicitacaoKitLancheCEMEI/index";
import { localStorageMock } from "src/mocks/localStorageMock";

describe("Teste de Solicitação de Kit Lanche CEMEI", () => {
  const escolaUuid =
    mockMeusDadosEscolaCEMEISuzanaCampos.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaCEMEISuzanaCampos);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 31 });
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock.onGet("/kit-lanches/consulta-kits/").reply(200, mockConsultakits);
    mock
      .onGet("/solicitacoes-dieta-especial-ativas-inativas/")
      .reply((config) => {
        if (config.params.incluir_alteracao_ue === true) {
          return [200, mockDietasAtivasInativas];
        }
      });
    mock.onGet(`/dias-uteis/?escola_uuid=${escolaUuid}/`).reply(200, {
      proximos_cinco_dias_uteis: "2025-08-04",
      proximos_dois_dias_uteis: "2025-07-31",
    });
    mock
      .onGet("/solicitacao-kit-lanche-cemei/?status=RASCUNHO/")
      .reply(200, mockConsultaRascunhos);

    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", true);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SolicitacaoKitLancheCEMEI
            meusDados={mockMeusDadosEscolaCEMEISuzanaCampos}
          />
        </MemoryRouter>
      );
    });
  });
});
