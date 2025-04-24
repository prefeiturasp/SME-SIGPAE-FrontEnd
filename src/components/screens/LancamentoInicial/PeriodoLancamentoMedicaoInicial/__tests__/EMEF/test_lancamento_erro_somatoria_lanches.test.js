import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockCategoriasMedicao } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/matriculadosNoMes";
import { mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/permissaoLancamentosEspeciais";
import { mockStateMANHAEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/stateMANHA";
import { mockValoresMedicaoMANHAEMEFAbril2025 } from "mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/valoresMedicaoMANHA";
import { mockMeusDadosEscolaEMEFPericles } from "mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar.js";
import { PeriodoLancamentoMedicaoInicialPage } from "pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { React } from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - MANHA - Usuário EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasEMEFAbril2025);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoMANHAEMEFAbril2025);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/matriculados-no-mes/")
      .reply(200, mockMatriculadosNoMesEMEFAbril2025);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/"
      )
      .reply(
        200,
        mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEFAbril2025
      );
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFAbril2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["18", "20", "21"] });

    const search = `?uuid=a0e68ec3-6fa9-4078-9e78-34f6a270d5ab&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: mockStateMANHAEMEFAbril2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {" "}
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });
});
