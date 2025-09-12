import "@testing-library/jest-dom";
import React from "react";
import mock from "src/services/_mock";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TIPO_PERFIL } from "../../../constants/shared";
import { Relatorio } from "src/components/SolicitacaoDeKitLanche/Relatorio/index";
import { mockKitLancheAvulsa } from "src/mocks/SolicitacaokitLanche/mockKitLancheAvulsa";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as detalheKitLanche from "src/services/relatorios";
import preview from "jest-preview";

describe("Teste Relatorio Kit Lanche Passeio - Visão ESCOLA", () => {
  const solicitacaoUuid = mockKitLancheAvulsa.uuid;

  const mockGetDetalheKitLancheAvulso = jest
    .spyOn(detalheKitLanche, "getDetalheKitLancheAvulso")
    .mockImplementation(jest.fn());

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
          <Relatorio
            uuid={mockKitLancheAvulsa.uuid}
            showNaoAprovaModal={false}
            showAutorizarModal={false}
            showModal={false}
            meusDados={mockMeusDadosEscolaEMEFPericles}
            prazoDoPedidoMensagem={""}
            resposta_sim_nao={null}
            showModalMarcarConferencia={false}
          />
        </MemoryRouter>
      );
    });
  });

  it("Verifica as informações da Escola", async () => {
    preview.debug();
    mockGetDetalheKitLancheAvulso;
  });
});
