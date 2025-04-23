import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL } from "constants/shared";
import { MemoryRouter } from "react-router-dom";
import mock from "services/_mock";
import { AcompanhamentoDeLancamentosPage } from "pages/LancamentoMedicaoInicial/AcompanhamentoDeLancamentosPage";

import { APIMockVersion } from "mocks/apiVersionMock";
import { mockGetMesesAnosMedicaoInicial } from "mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import { mockGetDiretoriaRegionalSimplissima } from "mocks/services/diretoriaRegional.service/mockGetDiretoriaRegionalSimplissima";
import { mockGetTiposUnidadeEscolar } from "mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockMeusDadosSuperUsuarioMedicao } from "mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { mockGetEscolaTercTotal } from "mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockGetDashboardMedicaoInicial } from "mocks/services/dashboard.service/mockGetDashboardMedicaoInicial";
import { mockGetGrupoUnidadeEscolar } from "mocks/services/escola.service/mockGetGrupoUnidadeEscolar";

describe("Medição Inicial - Página de Acompanhamento de Lançamentos", () => {
  beforeEach(async () => {
    mock.onGet("/api-version/").reply(200, APIMockVersion);
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockGetDiretoriaRegionalSimplissima);
    mock
      .onGet("/downloads/quantidade-nao-vistos/")
      .reply(200, { quantidade_nao_vistos: 136 });
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
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/dashboard/")
      .reply(200, mockGetDashboardMedicaoInicial);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);

    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AcompanhamentoDeLancamentosPage />
        </MemoryRouter>
      );
    });
  });

  async function selecionaDRE() {
    await waitFor(() => {
      expect(
        screen.getByText("Selecione a DRE para visualizar os resultados")
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() =>
      screen.getByText("DIRETORIA REGIONAL DE EDUCACAO IPIRANGA")
    );
    await act(async () => {
      fireEvent.click(
        screen.getByText("DIRETORIA REGIONAL DE EDUCACAO IPIRANGA")
      );
    });
  }

  it("Testa a renderização inicial da tela", async () => {
    selecionaDRE();

    await waitFor(() =>
      expect(
        screen.getByTestId("MEDICAO_APROVADA_PELA_CODAE")
      ).toBeInTheDocument()
    );
  });

  it("Testa a seleção de mês de referência e se o grupo 3 está habilitado no modal de Relatório Consolidado", async () => {
    selecionaDRE();

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
        screen.getByText("Impressão de Relatório Consolidado")
      ).toBeInTheDocument();
    });

    const grupo3Wrapper = screen
      .getByText("Grupo 3 (CEU EMEI, EMEI)")
      .closest("label");
    expect(grupo3Wrapper).not.toHaveClass("ant-radio-wrapper-disabled");
  });
});
