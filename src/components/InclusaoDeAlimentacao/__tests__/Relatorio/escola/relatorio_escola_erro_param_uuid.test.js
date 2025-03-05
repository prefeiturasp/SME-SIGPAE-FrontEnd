import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import { APIMockVersion } from "mocks/apiVersionMock";
import { mockInclusaoAlimentacaoRegular } from "mocks/InclusaoAlimentacao/mockInclusaoAlimentacaoRegular";
import { localStorageMock } from "mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockMotivosDRENaoValida } from "mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInclusaoDeAlimentacao from "pages/InclusaoDeAlimentacao/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Relatório Inclusão de Alimentação - Visão Escola", () => {
  beforeEach(async () => {
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/d0f4faf0-519b-4a1a-a1bf-ae39c45d1f64/"
      )
      .reply(200, mockInclusaoAlimentacaoRegular);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    const search = `?ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInclusaoDeAlimentacao.RelatorioEscola />
        </MemoryRouter>
      );
    });
  });

  it("renderiza erro `Parâmetro `uuid` é obrigatório na URL para carregar a página corretamente.`", async () => {
    expect(
      screen.getByText(
        "Parâmetro `uuid` é obrigatório na URL para carregar a página corretamente."
      )
    ).toBeInTheDocument();
  });
});
