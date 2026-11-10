import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Maio2025/diasCalendario";
import { mockStateSolicitacoesDeAlimentacaoCEMEIMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Maio2025/stateSolicitacoesAlimentacao";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

const SOLICITACAO_UUID = "1cca86e3-b010-4643-bb89-9fa85f016c22";
const CATEGORIA_ID = 5;
const DIA = "02";
const NAME_KIT_LANCHE = "kit_lanche";

const kitLancheAutorizado = [
  {
    dia: DIA,
    numero_alunos: 20,
    kit_lanche_id_externo: "A07ED",
    quantidade_alunos: 20,
  },
];

let kitLanchesAtual = [];

const registrarMocks = () => {
  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
  mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
  mock.onGet("/dias-letivos/calendario/").reply(200, []);
  mock.onGet("/dias-suspensao-atividades/lista-dias/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/").reply(200, []);
  mock
    .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
    .reply(() => [200, { results: kitLanchesAtual }]);
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/log-alunos-matriculados-faixa-etaria-dia/").reply(200, []);
  mock.onGet("/log-quantidade-dietas-autorizadas-cei/").reply(200, []);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioCEMEIMaio2025);
  mock
    .onGet("/medicao-inicial/medicao/feriados-no-mes/")
    .reply(200, { results: [] });
};

const renderPage = async ({ kitLanches = [] } = {}) => {
  kitLanchesAtual = kitLanches;

  window.history.pushState({}, "", `?uuid=${SOLICITACAO_UUID}`);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: mockStateSolicitacoesDeAlimentacaoCEMEIMaio2025,
          },
        ]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <PeriodoLancamentoMedicaoInicialCEIPage />
      </MemoryRouter>,
    );
  });
};

const queryDivObservacoes = () =>
  screen.queryByTestId(`div-botao-add-obs-${DIA}-${CATEGORIA_ID}-observacoes`);

describe("Lançamento UE - Solicitações de Alimentação - Infantil - CEI da CEMEI", () => {
  beforeAll(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");
  });

  beforeEach(() => {
    registrarMocks();
  });

  it("exibe a linha Kit Lanche e o botão Adicionar em Observações quando há kit lanche autorizado no dia", async () => {
    await renderPage({ kitLanches: kitLancheAutorizado });

    expect(
      await screen.findByTestId(
        `${NAME_KIT_LANCHE}__dia_${DIA}__categoria_${CATEGORIA_ID}`,
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      const div = queryDivObservacoes();
      expect(div).toBeInTheDocument();
      expect(within(div).getByText("Adicionar")).toBeInTheDocument();
    });
  });

  it("não exibe o botão Adicionar quando não há kit lanche, inclusão nem correção no dia", async () => {
    await renderPage({ kitLanches: [] });

    await screen.findByText("Observações");
    const div = queryDivObservacoes();
    expect(div === null || within(div).queryByText("Adicionar") === null).toBe(
      true,
    );
  });

  it("ao lançar quantidade diferente da autorizada, o botão fica vermelho", async () => {
    await renderPage({ kitLanches: kitLancheAutorizado });

    const inputKit = await screen.findByTestId(
      `${NAME_KIT_LANCHE}__dia_${DIA}__categoria_${CATEGORIA_ID}`,
    );
    fireEvent.change(inputKit, { target: { value: "5" } });

    const botao = await waitFor(() =>
      within(queryDivObservacoes()).getByText("Adicionar").closest("button"),
    );
    await waitFor(() =>
      expect(botao.className).toContain("red-button-outline"),
    );
  });
});
