import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockGetMinhasSolicitacoes } from "src/mocks/SolicitacaokitLanche/mockGetMinhasSolicitacoes";
import { mockKitLanche } from "src/mocks/SolicitacaokitLanche/mockKitLanche";
import { mockDietasAtivasInativas } from "src/mocks/DietaEspecial/mockAtivasInativas";
import SolicitacaoDeKitLanche from "src/components/SolicitacaoDeKitLanche/Container/base";
import { renderWithProvider } from "src/utils/test-utils";
import { localStorageMock } from "src/mocks/localStorageMock";

describe("Teste de Solicitação de Kit Lanche", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 170 });
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
    mock.onGet(`/dias-uteis/?escola_uuid=${escolaUuid}/`).reply(200, {
      proximos_cinco_dias_uteis: "2025-08-04",
      proximos_dois_dias_uteis: "2025-07-31",
    });
    mock
      .onGet("/solicitacoes-kit-lanche-avulsa/minhas-solicitacoes/")
      .reply(200, mockGetMinhasSolicitacoes);
    mock
      .onGet("/solicitacoes-dieta-especial-ativas-inativas/")
      .reply((config) => {
        if (config.params.incluir_alteracao_ue === true) {
          return [200, mockDietasAtivasInativas];
        }
      });
    mock.onGet("/kit-lanches/").reply(200, mockKitLanche);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", false);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SolicitacaoDeKitLanche meusDados={mockMeusDadosEscolaEMEFPericles} />
        </MemoryRouter>
      );
    });
  });

  it("Testa card Matriculados", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Nº de Matriculados/i)).toHaveLength(1);
      expect(screen.getAllByText(/524/i)).toHaveLength(1);
      expect(
        screen.getAllByText(
          /Informação automática disponibilizada pelo Cadastro da Unidade Escolar/i
        )
      ).toHaveLength(1);
    });
  });
});
