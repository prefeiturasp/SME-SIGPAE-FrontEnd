import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockAlteracaoCardapioAValidar } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioAValidar";
import { mockAlteracaoCardapioCancelada } from "src/mocks/services/alteracaoCardapio.service/EMEF/alteracaoCardapioCancelada";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosAlteracaoDoTipoDeAlimentacao from "src/pages/AlteracaoDeCardapio/RelatorioPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Relatório Alteração do Tipo de Alimentação - Visão Escola - EMEF", () => {
  beforeEach(async () => {
    mock
      .onGet(`/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/`)
      .reply(200, mockAlteracaoCardapioAValidar);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);
    mock
      .onPatch(
        `/alteracoes-cardapio/${mockAlteracaoCardapioAValidar.uuid}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockAlteracaoCardapioCancelada);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    const search = `?ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
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
          <RelatoriosAlteracaoDoTipoDeAlimentacao.RelatorioEscola />
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
