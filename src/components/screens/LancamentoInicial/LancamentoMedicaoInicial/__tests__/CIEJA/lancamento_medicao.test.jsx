import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "mocks/localStorageMock";
import { mockAlteracoesAlimentacaoAutorizadasAgosto2024 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/alteracoesAlimentacaoAutorizadasAgosto2024";
import { mockDiasCalendarioAgosto2024 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/diasCalendarioAgosto2024";
import { mockMeusDadosEscolaCIEJA } from "mocks/meusDados/escolaCIEJA";
import { mockGetVinculosTipoAlimentacaoPorEscolaCIEJA } from "mocks/services/cadastroTipoAlimentacao.service/CIEJA/mockGetVinculosTipoAlimentacaoPorEscolaCIEJA";
import { mockEscolaSimplesCIEJA } from "mocks/services/escola.service/CIEJA/escolaSimples";
import { mockInclusaoContinuaPorMesAgosto2024 } from "mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CIEJA/inclusaoContinuaPorMesAgosto2024";
import { mockKitLanchesAutorizadasAgosto2024 } from "mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CIEJA/kitLanchesAutorizadasAgosto2024";
import { mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCIEJAAgosto2024 } from "mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CIEJA/quantidadesAlimentacaoesLancadasPeriodoGrupoAgosto2024";
import { mockSolicitacaoMedicaoInicialCIEJA } from "mocks/services/solicitacaoMedicaoInicial.service/CIEJA/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CIEJA", () => {
  const escolaUuid = mockMeusDadosEscolaCIEJA.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCIEJA);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, []);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCIEJA);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCIEJA);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/"
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialCIEJA);
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioAgosto2024);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock
      .onGet("/periodos-escolares/inclusao-continua-por-mes/")
      .reply(200, mockInclusaoContinuaPorMesAgosto2024);
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, mockKitLanchesAutorizadasAgosto2024);
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, mockAlteracoesAlimentacaoAutorizadasAgosto2024);
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/"
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialCIEJA[0].uuid}/ceu-gestao-frequencias-dietas/`
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/"
      )
      .reply(
        200,
        mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCIEJAAgosto2024
      );

    const search = `?mes=08&ano=2024`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CIEJA ROLANDO BOLDRIN"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {" "}
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCIEJA,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza período `INTERMEDIARIO`", () => {
    expect(screen.getByText("INTERMEDIARIO")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação`", () => {
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });
});
