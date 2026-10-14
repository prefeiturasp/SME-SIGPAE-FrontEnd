import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/diasCalendarioMarco2025";
import { mockStateSolicitacoesDeAlimentacaoMarco2025EMEBS } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEBS/stateSolicitacoesDeAlimentacaoMarco2025";
import { mockMeusDadosEscolaEMEBS } from "src/mocks/meusDados/escola/EMEBS";
import { mockGetVinculosTipoAlimentacaoPorEscolaEMEBS } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEBS/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";
const SOLICITACAO_UUID = "916a9e70-d853-4c19-bbfb-63b35b66d185";

const state = {
  ...mockStateSolicitacoesDeAlimentacaoMarco2025EMEBS,
  periodo: GRUPO_EXTRAORDINARIO,
  grupo: GRUPO_EXTRAORDINARIO,
  tiposAlimentacao: [{ nome: "Lanche Emergencial" }],
};

const escolaUuid = mockMeusDadosEscolaEMEBS.vinculo_atual.instituicao.uuid;

const renderPage = async (handlerPost) => {
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaEMEBS);
  mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
  mock.onGet("/dias-letivos/calendario/").reply(200, []);
  mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/").reply(200, []);
  mock
    .onGet(
      `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
    )
    .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaEMEBS);
  mock
    .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, { results: [] });
  mock.onGet("/medicao-inicial/lanches-emergenciais-diarios/").reply(200, []);
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
  mock
    .onGet("/matriculados-no-mes/")
    .reply(200, [
      { infantil_ou_fundamental: "INFANTIL", quantidade_alunos: 10 },
    ]);
  mock.onGet("/log-quantidade-dietas-autorizadas/").reply(200, [
    {
      infantil_ou_fundamental: "INFANTIL",
      classificacao: "TIPO A",
      quantidade: 5,
    },
  ]);
  mock
    .onGet(
      "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
    )
    .reply(200, {
      results: {
        alimentacoes_lancamentos_especiais: [],
        permissoes_por_dia: [],
        data_inicio_permissoes: null,
      },
    });
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioMarco2025EMEBS);
  mock
    .onGet("/medicao-inicial/medicao/feriados-no-mes/")
    .reply(200, { results: ["04"] });
  mock.onPost("medicao-inicial/medicao/").reply(handlerPost);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("eh_emebs", "true");

  window.history.pushState(
    {},
    "",
    `?uuid=${SOLICITACAO_UUID}&ehGrupoSolicitacoesDeAlimentacao=true&ehGrupoETEC=false&ehPeriodoEspecifico=false`,
  );

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/", state }]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosEscolaEMEBS,
            setMeusDados: jest.fn(),
          }}
        >
          <PeriodoLancamentoMedicaoInicialPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Lançamento UE - Solicitações de Alimentação Extraordinárias - EMEBS", () => {
  it("renderiza as linhas Lanche Emergencial e Observações, sem Kit Lanche", async () => {
    await renderPage(() => [201, { valores_medicao: [] }]);

    await waitFor(() =>
      expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument(),
    );
    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.queryByText("Kit Lanche")).not.toBeInTheDocument();
  });

  it("exibe as abas de turma para EMEBS (Infantil/Fundamental)", async () => {
    await renderPage(() => [201, { valores_medicao: [] }]);

    await waitFor(() =>
      expect(
        screen.getByText("Alunos do Fundamental (acima de 6 anos)"),
      ).toBeInTheDocument(),
    );
  });

  it("salva os lançamentos enviando infantil_ou_fundamental da turma selecionada", async () => {
    let postConfig = null;
    await renderPage((config) => {
      postConfig = config;
      return [201, { valores_medicao: [] }];
    });

    fireEvent.click(screen.getByText("Semana 2"));

    await waitFor(() =>
      expect(
        screen.getByTestId("lanche_emergencial__dia_03__categoria_5"),
      ).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByTestId("lanche_emergencial__dia_03__categoria_5"),
      { target: { value: "5" } },
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /salvar lançamentos/i }),
      ).not.toBeDisabled(),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /salvar lançamentos/i }),
    );

    await waitFor(() => expect(postConfig).not.toBeNull());

    const body =
      typeof postConfig.data === "string"
        ? JSON.parse(postConfig.data)
        : postConfig.data;
    expect(body.infantil_ou_fundamental).toBe("FUNDAMENTAL");
  });
});
