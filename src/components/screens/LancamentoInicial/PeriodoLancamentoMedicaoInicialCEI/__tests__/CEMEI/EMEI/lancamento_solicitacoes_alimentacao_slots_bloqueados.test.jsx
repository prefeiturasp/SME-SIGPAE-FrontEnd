import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
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

import { debug } from "jest-preview";

describe("Lancamento de Solicitações de Alimentação com Slots Bloqueados - EMEI da CEMEI", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock.onGet("/escola-solicitacoes/kit-lanches-autorizadas/").reply(200, {
      results: [
        { dia: "01", numero_alunos: 20, kit_lanche_id_externo: "F95C2" },
      ],
    });
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
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioCEMEIMaio2025);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["01"] });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    const search = `?uuid=1cca86e3-b010-4643-bb89-9fa85f016c22`;
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
              state: mockStateSolicitacoesDeAlimentacaoCEMEIMaio2025,
            },
          ]}
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
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(3);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Maio / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Maio / 2025");
  });

  it("renderiza valor `Solicitações de Alimentação - Infantil` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute(
      "value",
      "Solicitações de Alimentação - Infantil",
    );
  });

  it("Renderiza tabela de Solicitações de Alimentação com slots bloqueados", () => {
    expect(
      screen.getByText("SOLICITAÇÕES DE ALIMENTAÇÃO - INFANTIL"),
    ).toBeInTheDocument();
    debug();
    expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
    expect(screen.getByText("Kit Lanche")).toBeInTheDocument();

    // ---- testa slots de Lanche Emergencial ----

    const inputLancheEmergencialDia01 = screen.getByTestId(
      "lanche_emergencial__dia_01__categoria_5",
    );
    expect(inputLancheEmergencialDia01).not.toBeDisabled();

    const inputLancheEmergencialDia02 = screen.getByTestId(
      "lanche_emergencial__dia_02__categoria_5",
    );
    expect(inputLancheEmergencialDia02).toBeDisabled();

    // ---- testa slots de Kit Lanche ----

    const inputKitLancheDia01 = screen.getByTestId(
      "kit_lanche__dia_01__categoria_5",
    );
    expect(inputKitLancheDia01).not.toBeDisabled();

    const inputKitLancheDia02 = screen.getByTestId(
      "kit_lanche__dia_02__categoria_5",
    );
    expect(inputKitLancheDia02).toBeDisabled();
  });
});
