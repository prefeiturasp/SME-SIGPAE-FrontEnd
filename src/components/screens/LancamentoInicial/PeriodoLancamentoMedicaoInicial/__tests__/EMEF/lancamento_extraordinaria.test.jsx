import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Dezembro2025/diasCalendario";
import { mockStateSolicitacoesDeAlimentacaoEMEFDezembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Dezembro2025/stateSolicitacoesAlimentacao";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

const GRUPO = "Solicitações de Alimentação Extraordinárias";
const SOLICITACAO_UUID = "0dc919b7-aa30-48a0-bdff-e72e448a5094";
const MEDICAO_UUID = "4713f074-24f0-4719-8785-5fc2b2ac08d6";

const state = {
  ...mockStateSolicitacoesDeAlimentacaoEMEFDezembro2025,
  periodo: GRUPO,
  grupo: GRUPO,
  tipos_alimentacao: ["Lanche Emergencial"],
  status_periodo: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
  status_solicitacao: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
  solicitacaoMedicaoInicial: {
    ...mockStateSolicitacoesDeAlimentacaoEMEFDezembro2025.solicitacaoMedicaoInicial,
    status: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
    lanche_emergencial_extraordinario: true,
  },
};

const renderPage = async (handlerCorrige) => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

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
  mock.onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/").reply(200, []);
  mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
  mock
    .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, [
    {
      dia: "02",
      categoria_medicao: 5,
      medicao: MEDICAO_UUID,
      habilitado_correcao: true,
      uuid: "dpc-1",
    },
  ]);
  mock
    .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
    .reply(200, { results: [] });
  mock.onGet("/medicao-inicial/lanches-emergenciais-diarios/").reply(200, []);
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, {
      results: [
        {
          dia: "02",
          numero_alunos: 5,
          inclusao_id_externo: "X1",
          motivo: "Lanche Emergencial",
        },
      ],
    });
  mock
    .onGet("/dias-calendario/")
    .reply(200, mockDiasCalendarioEMEFDezembro2025);
  mock
    .onGet("/medicao-inicial/medicao/feriados-no-mes/")
    .reply(200, { results: [] });
  mock.onPatch(/escola-corrige-medicao/).reply(handlerCorrige);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem(
    "nome_instituicao",
    `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
  );
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

  const search = `?uuid=${SOLICITACAO_UUID}&ehGrupoSolicitacoesDeAlimentacao=true&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
  window.history.pushState({}, "", search);

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

describe("Lançamento UE - Solicitações de Alimentação Extraordinárias", () => {
  it("renderiza as linhas Lanche Emergencial e Observações, sem Kit Lanche", async () => {
    await renderPage(() => [200, { valores_medicao: [] }]);

    expect(screen.getByText("SOLICITAÇÕES DE ALIMENTAÇÃO")).toBeInTheDocument();
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.queryByText("Kit Lanche")).not.toBeInTheDocument();
  });

  it("não exibe tooltip de lanche emergencial autorizado/não autorizado", async () => {
    await renderPage(() => [200, { valores_medicao: [] }]);

    const input = screen.getByTestId("lanche_emergencial__dia_02__categoria_5");
    const celula = input.closest(".field-values-input");
    expect(celula.querySelector(".icone-info-warning")).toBeNull();
  });

  it("salva as correções e devolve a medição para CODAE", async () => {
    let corrigeMedicaoConfig = null;
    await renderPage((config) => {
      corrigeMedicaoConfig = config;
      return [200, { valores_medicao: [] }];
    });

    const input = screen.getByTestId("lanche_emergencial__dia_02__categoria_5");
    fireEvent.change(input, { target: { value: "5" } });

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /salvar correções/i }),
      ).not.toBeDisabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: /salvar correções/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Deseja salvar as correções realizadas/i),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Sim").closest("button"));

    await waitFor(() => expect(corrigeMedicaoConfig).not.toBeNull());
    expect(corrigeMedicaoConfig.url).toContain(
      `${MEDICAO_UUID}/escola-corrige-medicao/`,
    );
  });

  it("botões de Observações ficam GREEN_OUTLINE no bloco extraordinário", async () => {
    await renderPage(() => [200, { valores_medicao: [] }]);

    const botoesAdicionar = screen.getAllByText("Adicionar");
    expect(botoesAdicionar.length).toBeGreaterThan(0);
    botoesAdicionar.forEach((botao) =>
      expect(botao.closest("button").className).toContain(
        "green-button-outline",
      ),
    );
  });
});
