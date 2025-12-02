import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { AcompanhamentoDeLancamentosPage } from "src/pages/LancamentoMedicaoInicial/AcompanhamentoDeLancamentosPage";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockGetTiposUnidadeEscolar } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetDashboardMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetDiretoriaRegionalSimplissima } from "src/mocks/services/diretoriaRegional.service/mockGetDiretoriaRegionalSimplissima";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import {
  mockGetGrupoUnidadeEscolar,
  mockGetGrupoUnidadeEscolarPorDRE,
} from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { localStorageMock } from "src/mocks/localStorageMock";

describe("Medição Inicial - Página de Acompanhamento de Lançamentos", () => {
  beforeEach(async () => {
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockGetDiretoriaRegionalSimplissima);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/",
      )
      .reply(200, mockGetDashboardMedicaoInicial);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/",
      )
      .reply(200, {
        results: {
          total: 1,
          dados: [
            {
              uuid: "cc078b30-09e2-43ca-a3bc-657d5529897f",
              escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
              escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
              mes: "09",
              ano: "2023",
              mes_ano: "Setembro 2023",
              tipo_unidade: "EMEF",
              status: "Aprovado pela DRE",
              log_mais_recente: "14/12/2023 09:58",
              dre_ciencia_correcao_data: null,
              todas_medicoes_e_ocorrencia_aprovados_por_medicao: false,
              escola_cei_com_inclusao_parcial_autorizada: false,
            },
          ],
        },
      });

    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);

    mock
      .onGet(`/grupos-unidade-escolar/por-dre/`)
      .reply(200, mockGetGrupoUnidadeEscolarPorDRE);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AcompanhamentoDeLancamentosPage />
        </MemoryRouter>,
      );
    });
  });

  async function selecionaDRE() {
    await waitFor(() => {
      expect(
        screen.getByText("Selecione a DRE para visualizar os resultados"),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() =>
      screen.getByText("DIRETORIA REGIONAL DE EDUCACAO IPIRANGA"),
    );
    await act(async () => {
      fireEvent.click(
        screen.getByText("DIRETORIA REGIONAL DE EDUCACAO IPIRANGA"),
      );
    });
  }

  it("Testa a renderização inicial da tela", async () => {
    await selecionaDRE();

    await waitFor(() =>
      expect(
        screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE"),
      ).toBeInTheDocument(),
    );
  });

  it("Testa a seleção de mês de referência e se os grupos corretos estão habilitados no modal de Relatório Consolidado", async () => {
    await selecionaDRE();

    await waitFor(() => screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE"));
    const cardAprovadoCODAE = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
    await act(async () => {
      fireEvent.click(cardAprovadoCODAE);
    });

    const labelSelect = screen.getByText("Mês de referência");
    const selectElement = labelSelect.nextElementSibling;
    selectElement.value = "Junho - 2023";

    fireEvent.change(selectElement, {
      target: { value: "06_2023" },
    });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("Resultados")).toBeInTheDocument();
    });

    const botaoRelatorioConsolidado = screen
      .getByText("Relatório Consolidado")
      .closest("button");
    fireEvent.click(botaoRelatorioConsolidado);

    await waitFor(() => {
      expect(
        screen.getByText("Impressão de Relatório Consolidado"),
      ).toBeInTheDocument();
    });

    // Verifica se Grupo 1 está habilitado
    const grupo1Wrapper = screen
      .getByText("Grupo 1 (CCI, CEI, CEI CEU)")
      .closest("label");
    expect(grupo1Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 2 está habilitado
    const grupo2Wrapper = screen
      .getByText("Grupo 2 (CEMEI, CEU CEMEI)")
      .closest("label");
    expect(grupo2Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 3 está habilitado
    const grupo3Wrapper = screen
      .getByText("Grupo 3 (CEU EMEI, EMEI)")
      .closest("label");
    expect(grupo3Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 4 está habilitado
    const grupo4Wrapper = screen
      .getByText("Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)")
      .closest("label");
    expect(grupo4Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 5 está habilitado
    const grupo5Wrapper = screen.getByText("Grupo 5 (EMEBS)").closest("label");
    expect(grupo5Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 6 está habilitado
    const grupo6Wrapper = screen
      .getByText("Grupo 6 (CIEJA, CMCT)")
      .closest("label");
    expect(grupo6Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);
  });

  it("Verifica os grupos habilitados no modal de Relatório Unificado", async () => {
    await selecionaDRE();

    await waitFor(() => screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE"));
    const cardAprovadoCODAE = screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE");
    await act(async () => {
      fireEvent.click(cardAprovadoCODAE);
    });

    const labelSelect = screen.getByText("Mês de referência");
    const selectElement = labelSelect.nextElementSibling;
    selectElement.value = "Junho - 2023";

    fireEvent.change(selectElement, {
      target: { value: "06_2023" },
    });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("Resultados")).toBeInTheDocument();
    });

    const botaoRelatorioConsolidado = screen
      .getByText("Relatório Unificado")
      .closest("button");
    fireEvent.click(botaoRelatorioConsolidado);

    await waitFor(() => {
      expect(
        screen.getByText("Impressão de Relatório Unificado"),
      ).toBeInTheDocument();
    });

    // Verifica se Grupo 1 está desabilitado
    const grupo1Wrapper = screen
      .getByText("Grupo 1 (CCI, CEI, CEI CEU)")
      .closest("label");
    expect(grupo1Wrapper).toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 2 está habilitado
    const grupo2Wrapper = screen
      .getByText("Grupo 2 (CEMEI, CEU CEMEI)")
      .closest("label");
    expect(grupo2Wrapper).toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 3 está habilitado
    const grupo3Wrapper = screen
      .getByText("Grupo 3 (CEU EMEI, EMEI)")
      .closest("label");
    expect(grupo3Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 4 está habilitado
    const grupo4Wrapper = screen
      .getByText("Grupo 4 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)")
      .closest("label");
    expect(grupo4Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 5 está desabilitado
    const grupo5Wrapper = screen.getByText("Grupo 5 (EMEBS)").closest("label");
    expect(grupo5Wrapper).toHaveClass("ant-radio-wrapper-disabled");

    // Verifica se Grupo 6 está desabilitado
    const grupo6Wrapper = screen
      .getByText("Grupo 6 (CIEJA, CMCT)")
      .closest("label");
    expect(grupo6Wrapper).toHaveClass("ant-radio-wrapper-disabled");
  });
});
