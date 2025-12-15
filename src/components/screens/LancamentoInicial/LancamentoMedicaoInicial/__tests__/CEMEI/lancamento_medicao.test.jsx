import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockAlteracoesAlimentacaoAutorizadasAgosto2024CEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/alteracoesAlimentacaoAutorizadasAgosto2024";
import { mockDiasCalendarioAgosto2024CEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/diasCalendarioAgosto2024";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesCEMEI } from "src/mocks/services/escola.service/CEMEI/escolaSimples";
import { mockKitLanchesAutorizadasAgosto2024CEMEI } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/CEMEI/kitLanchesAutorizadasAgosto2024";
import { mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CEMEI/quantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024";
import { mockAlunos } from "src/mocks/services/perfil.service/alunos";
import { mockSolicitacaoMedicaoInicialCEMEI } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEMEI/solicitacaoMedicaoInicial";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, []);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCEMEI);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-escola-cemei-com-alunos-emei/",
      )
      .reply(200, {
        results: ["Infantil MANHA", "Infantil TARDE", "Infantil INTEGRAL"],
      });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(200, mockSolicitacaoMedicaoInicialCEMEI);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioAgosto2024CEMEI);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/alunos/").reply(200, mockAlunos);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { INTEGRAL: "93b5620a-d8f9-4ddb-a407-f574fce8acbf" },
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, mockKitLanchesAutorizadasAgosto2024CEMEI);
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, mockAlteracoesAlimentacaoAutorizadasAgosto2024CEMEI);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(
        200,
        mockQuantidadesAlimentacaoesLancadasPeriodoGrupoCEMEIAgosto2024,
      );

    const search = `?mes=08&ano=2024`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
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
              meusDados: mockMeusDadosEscolaCEMEI,
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
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza períodos escolares de CEMEI", () => {
    expect(screen.getByText("Período Integral")).toBeInTheDocument();
    expect(screen.getByText("Período Parcial")).toBeInTheDocument();
    expect(screen.getByText("Infantil Integral")).toBeInTheDocument();
  });

  it("Renderiza período `Programas e Projetos`", () => {
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Renderiza período `Solicitações de Alimentação - Infantil`", () => {
    expect(
      screen.getByText("Solicitações de Alimentação - Infantil"),
    ).toBeInTheDocument();
  });

  it("Verifica a ordem dos cards", () => {
    const textos = [
      "Período Integral",
      "Período Parcial",
      "Infantil Manhã",
      "Infantil Tarde",
      "Infantil Integral",
      "Programas e Projetos",
      "Solicitações de Alimentação - Infantil",
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
