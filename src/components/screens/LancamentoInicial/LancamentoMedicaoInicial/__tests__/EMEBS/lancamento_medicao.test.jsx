import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/diasCalendarioMarco2025";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEBS } from "src/mocks/services/escola.service/EMEBS/escolaSimples";
import { mockQuantidadesAlimentacaoesLancadasPeriodoGrupoMarco2025EMEBS } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEBS/quantidadesAlimentacaoesLancadasPeriodoGrupoAgosto2024";
import { mockPanoramaEscolaEMEBS } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEBS/panoramaEscola";
import { mockSolicitacaoMedicaoInicialEMEBS } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEBS/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEBS", () => {
  const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, mockPanoramaEscolaEMEBS);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEBS);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/"
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialEMEBS);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioMarco2025EMEBS);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
    });
    mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
      results: [
        { dia: "24", numero_alunos: 100, kit_lanche_id_externo: "28125" },
      ],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [
          {
            dia: "24",
            numero_alunos: 38,
            inclusao_id_externo: "BDBFB",
            motivo: "Lanche Emergencial",
          },
        ],
      });
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
        `/medicao-inicial/solicitacao-medicao-inicial/${mockSolicitacaoMedicaoInicialEMEBS[0].uuid}/ceu-gestao-frequencias-dietas/`
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/"
      )
      .reply(
        200,
        mockQuantidadesAlimentacaoesLancadasPeriodoGrupoMarco2025EMEBS
      );

    const search = `?mes=03&ano=2025`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"EMEBS HELEN KELLER"`);
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
              meusDados: mockMeusDadosEscolaEMEBS,
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

  it("Renderiza períodos escolares", () => {
    expect(screen.getByText("INTEGRAL")).toBeInTheDocument();
    expect(screen.getByText("MANHA")).toBeInTheDocument();
    expect(screen.getByText("TARDE")).toBeInTheDocument();
    expect(screen.getByText("NOITE")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação`", () => {
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });
});
