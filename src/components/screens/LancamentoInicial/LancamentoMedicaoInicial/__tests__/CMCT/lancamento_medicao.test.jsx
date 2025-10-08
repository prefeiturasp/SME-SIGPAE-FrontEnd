import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosEscolaCMCT } from "src/mocks/meusDados/escolaCMCT";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockEscolaSimplesCMCT } from "src/mocks/services/escola.service/CMCT/escolaSimples";
import { mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CMCT/periodosSolicitacoesAutorizadasEscola";
import { mockPanoramaEscolaCMCTSetembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CMCT/Setembro2025/panoramaEscola";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CMCT", () => {
  const escolaUuid = mockMeusDadosEscolaCMCT.vinculo_atual.instituicao.uuid;
  const solicitacaoMedicaoInicialUuid =
    mockSolicitacaoMedicaoInicialCMCTSetembro2025[0].uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCMCT);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, mockPanoramaEscolaCMCTSetembro2025);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCMCT);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/solicitacoes-lancadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialCMCTSetembro2025);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6" },
    });
    mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
      results: [
        { dia: "02", numero_alunos: 100, kit_lanche_id_externo: "2EB2A" },
      ],
    });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, {
        results: [
          {
            dia: "02",
            numero_alunos: 100,
            inclusao_id_externo: "6DA39",
            motivo: "Lanche Emergencial",
          },
        ],
      });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicialUuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, { results: [] });
    mock
      .onGet(
        "/escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/",
      )
      .reply(
        200,
        mockEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscolaCMCT,
      );

    const search = `?mes=11&ano=2024`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });

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
              meusDados: mockMeusDadosEscolaCMCT,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getByText("Lançamento Medição Inicial")).toBeInTheDocument();
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza período `Manhã`", () => {
    expect(screen.getByText("Manhã")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação`", () => {
    expect(screen.getByText("Solicitações de Alimentação")).toBeInTheDocument();
  });

  it("Verifica a ordem dos cards", () => {
    const textos = [
      "Manhã",
      "Noite",
      "Programas e Projetos",
      "Solicitações de Alimentação",
    ];

    const elementos = textos.map((texto) => screen.getByText(texto));

    for (let i = 0; i < elementos.length - 1; i++) {
      const posicao = elementos[i].compareDocumentPosition(elementos[i + 1]);
      expect(posicao & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });
});
