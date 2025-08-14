import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TIPO_SOLICITACAO } from "src/services/constants";
import { TIPO_PERFIL } from "../../../constants/shared";
import { CorpoRelatorio } from "src/components/SolicitacaoDeKitLanche/Relatorio/componentes/CorpoRelatorio";
import { mockKitLancheAvulsa } from "src/mocks/SolicitacaokitLanche/mockKitLancheAvulsa";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";

import preview from "jest-preview";

describe("Teste Relatorio - Visão ESCOLA", () => {
  const solicitacaoUuid = mockKitLancheAvulsa.uuid;
  beforeEach(async () => {
    mock
      .onGet(`/solicitacoes-kit-lanche-avulsa/${solicitacaoUuid}/`)
      .reply(200, mockKitLancheAvulsa);

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
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);

    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_lidos: 0 });

    window.localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CorpoRelatorio
            solicitacaoKitLanche={mockKitLancheAvulsa}
            solicitacoesSimilares={mockKitLancheAvulsa.solicitacoes_similares}
            prazoDoPedidoMensagem={""}
            tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_NORMAL}
            meusDados={mockMeusDadosEscolaEMEFPericles}
          />
        </MemoryRouter>
      );
    });
  });

  it("AAAA", async () => {
    preview.debug();
    expect(screen.getAllByText(/Nº DA SOLICITAÇÃO/i)).toHaveLength(1);
  });
});
