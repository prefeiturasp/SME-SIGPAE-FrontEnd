import "@testing-library/jest-dom";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/matriculadosNoMes";
import { mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/permissaoLancamentosEspeciais";
import { mockStateMANHAEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/stateMANHA";
import { mockValoresMedicaoMANHAEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/valoresMedicaoMANHA";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Lancamento MANHA EMEF - Dias Letivos via API Calendário", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  const renderComponente = async () => {
    cleanup();
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockStateMANHAEMEFAbril2025 },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  };

  beforeEach(async () => {
    mock.onGet("/dias-letivos/calendario/").reply(200, []);
    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, []);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
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
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(
        200,
        mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEFAbril2025,
      );
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFAbril2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: [] });
    mock.onPost("/solicitacoes-dieta-especial/panorama-escola/").reply(200, []);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);

    const search = `?uuid=${escolaUuid}&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);
  });

  it("deve desbloquear os campos de fim de semana quando retornados como letivos pela API", async () => {
    mock
      .onGet("/dias-letivos/calendario/")
      .reply(200, [
        { data: "01/04/2025" },
        { data: "02/04/2025" },
        { data: "03/04/2025" },
        { data: "04/04/2025" },
        { data: "05/04/2025" },
        { data: "06/04/2025" },
        { data: "07/04/2025" },
      ]);

    await renderComponente();

    const inputLancheDia05 = screen.getByTestId("lanche__dia_05__categoria_1");
    expect(inputLancheDia05).not.toBeDisabled();

    const inputLancheDia06 = screen.getByTestId("lanche__dia_06__categoria_1");
    expect(inputLancheDia06).not.toBeDisabled();
  });

  it("deve manter o campo liberado quando o dia suspenso também for letivo pelo SIGPAE", async () => {
    mock
      .onGet("/dias-letivos/calendario/")
      .reply(200, [{ data: "05/04/2025" }]);

    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, [
      {
        data: "05/04/2025",
        editais: ["303030A"],
      },
    ]);

    await renderComponente();

    const inputLancheDia05 = screen.getByTestId("lanche__dia_05__categoria_1");

    expect(inputLancheDia05).not.toBeDisabled();
  });

  it("deve bloquear o campo quando houver suspensão de atividade sem dia letivo pelo SIGPAE", async () => {
    mock.onGet("/dias-letivos/calendario/").reply(200, []);

    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, [
      {
        data: "05/04/2025",
        editais: ["303030A"],
      },
    ]);

    await renderComponente();

    const inputLancheDia05 = screen.getByTestId("lanche__dia_05__categoria_1");

    expect(inputLancheDia05).toBeDisabled();
  });

  it("deve exibir o aviso de suspensão de atividade quando o dia estiver suspenso e bloqueado", async () => {
    mock.onGet("/dias-letivos/calendario/").reply(200, []);

    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, [
      {
        data: "05/04/2025",
        editais: ["303030A"],
      },
    ]);

    await renderComponente();

    expect(
      await screen.findByText(/05\s*-\s*Suspensão de atividade/),
    ).toBeInTheDocument();
  });

  it("deve exibir o aviso de dia letivo cadastrado por CODAE", async () => {
    mock.onGet("/dias-letivos/calendario/").reply(200, [
      {
        data: "05/04/2025",
      },
    ]);

    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, []);

    await renderComponente();

    expect(
      await screen.findByText(/05\s*-\s*Dia letivo cadastrado por CODAE/),
    ).toBeInTheDocument();
  });

  it("não deve exibir aviso de suspensão quando o dia suspenso estiver liberado pela CODAE", async () => {
    mock.onGet("/dias-letivos/calendario/").reply(200, [
      {
        data: "05/04/2025",
      },
    ]);

    mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, [
      {
        data: "05/04/2025",
        editais: ["303030A"],
      },
    ]);

    await renderComponente();

    expect(
      await screen.findByText(/05\s*-\s*Dia letivo cadastrado por CODAE/),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/05\s*-\s*Suspensão de atividade/),
    ).not.toBeInTheDocument();
  });
});
