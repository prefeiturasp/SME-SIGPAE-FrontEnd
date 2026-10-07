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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioCEMEIMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Maio2025/diasCalendario";
import { mockStateSolicitacoesDeAlimentacaoCEMEIMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEMEI/Maio2025/stateSolicitacoesAlimentacao";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { PeriodoLancamentoMedicaoInicialCEIPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialCEIPage";
import mock from "src/services/_mock";

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";
const SOLICITACAO_UUID = "1cca86e3-b010-4643-bb89-9fa85f016c22";
const MEDICAO_UUID = "4713f074-24f0-4719-8785-5fc2b2ac08d6";

const state = {
  ...mockStateSolicitacoesDeAlimentacaoCEMEIMaio2025,
  periodo: GRUPO_EXTRAORDINARIO,
  grupo: GRUPO_EXTRAORDINARIO,
  tiposAlimentacao: [{ nome: "Lanche Emergencial" }],
  status_periodo: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
  status_solicitacao: "MEDICAO_CORRECAO_SOLICITADA_CODAE",
};

const renderPage = async (handlerCorrige) => {
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
    .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
    .reply(200, { results: [] });
  mock
    .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
    .reply(200, {
      results: [
        {
          dia: "01",
          numero_alunos: 12,
          inclusao_id_externo: "DAC2D",
          motivo: "Lanche Emergencial",
        },
      ],
    });
  mock
    .onGet("/medicao-inicial/categorias-medicao/")
    .reply(200, mockCategoriasMedicao);
  mock.onGet("/log-alunos-matriculados-faixa-etaria-dia/").reply(200, []);
  mock.onGet("/log-quantidade-dietas-autorizadas-cei/").reply(200, []);
  mock.onGet("/medicao-inicial/valores-medicao/").reply(200, []);
  mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, [
    {
      dia: "01",
      categoria_medicao: 5,
      medicao: MEDICAO_UUID,
      habilitado_correcao: true,
      uuid: "dpc-1",
    },
  ]);
  mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioCEMEIMaio2025);
  mock
    .onGet("/medicao-inicial/medicao/feriados-no-mes/")
    .reply(200, { results: [] });
  mock.onPatch(/escola-corrige-medicao/).reply(handlerCorrige);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
  localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
  localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
  localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  localStorage.setItem("eh_cemei", "true");

  window.history.pushState({}, "", `?uuid=${SOLICITACAO_UUID}`);

  await act(async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/", state }]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PeriodoLancamentoMedicaoInicialCEIPage />
        <ToastContainer />
      </MemoryRouter>,
    );
  });
};

describe("Lançamento UE - Solicitações de Alimentação Extraordinárias - EMEI da CEMEI", () => {
  it("renderiza as linhas Lanche Emergencial e Observações, sem Kit Lanche", async () => {
    await renderPage(() => [200, { valores_medicao: [] }]);

    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.queryByText("Kit Lanche")).not.toBeInTheDocument();
  });

  it("não exibe tooltip de lanche emergencial autorizado/não autorizado", async () => {
    await renderPage(() => [200, { valores_medicao: [] }]);

    const input = screen.getByTestId("lanche_emergencial__dia_01__categoria_5");
    const celula = input.closest(".field-values-input");
    expect(celula.querySelector(".icone-info-warning")).toBeNull();
  });

  it("salva as correções e devolve a medição para CODAE", async () => {
    let corrigeConfig = null;
    await renderPage((config) => {
      corrigeConfig = config;
      return [200, { valores_medicao: [] }];
    });

    const input = screen.getByTestId("lanche_emergencial__dia_01__categoria_5");
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

    await waitFor(() => expect(corrigeConfig).not.toBeNull());
    expect(corrigeConfig.url).toContain(
      `${MEDICAO_UUID}/escola-corrige-medicao/`,
    );
  });
});
