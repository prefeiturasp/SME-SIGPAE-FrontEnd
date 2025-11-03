import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockRelatorioAlunosMatriculadosDREFiltros } from "src/mocks/services/alunosMatriculados.service/DRE/filtros";
import { mockRelatorioAlunosMatriculadosDREResultados } from "src/mocks/services/alunosMatriculados.service/DRE/resultados";
import { mockRelatorioAlunosMatriculadosDREResultadosPagina2 } from "src/mocks/services/alunosMatriculados.service/DRE/resultadosPagina2";
import RelatorioAlunosMatriculadosPage from "src/pages/Relatorios/RelatorioAlunosMatriculadosPage";
import mock from "src/services/_mock";

describe("Teste Relatório Alunos Matriculados - Usuário DRE - Filtros", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet(`/relatorio-alunos-matriculados/filtros/`)
      .reply(200, mockRelatorioAlunosMatriculadosDREFiltros);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <RelatorioAlunosMatriculadosPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar os filtros corretamente", async () => {
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Unidade")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Turma")).toBeInTheDocument();
    expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
  });

  it("Deve filtrar tipos de unidade corretamente", async () => {
    const selectTipoUnidade = screen.getByTestId("select-tipos-unidades");
    const selectControlTipoUnidade =
      within(selectTipoUnidade).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoUnidade);

    const optionCEIDIRET = screen.getByText("CEI DIRET");
    fireEvent.click(optionCEIDIRET);

    const selectUnidadeEducacional = screen.getByTestId(
      "select-unidades-educacionais",
    );
    const selectControlUnidadeEducacional = within(
      selectUnidadeEducacional,
    ).getByRole("combobox");
    fireEvent.mouseDown(selectControlUnidadeEducacional);

    const optionCEIDIRETMONUMENTO = screen.getByText("CEI DIRET MONUMENTO");
    fireEvent.click(optionCEIDIRETMONUMENTO);

    expect(screen.queryByText("EMEI CIDADE DO SOL")).not.toBeInTheDocument();
  });

  it("Consulta dietas, expande faixas etárias, avança página e limpa filtros", async () => {
    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, mockRelatorioAlunosMatriculadosDREResultados);

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText("Relação de alunos matriculados"),
      ).toBeInTheDocument();
    });

    const iconeFaixasEtarias0 = screen.getByTestId("icone-faixas-etarias-0");
    fireEvent.click(iconeFaixasEtarias0);

    // expande faixas etárias

    await waitFor(() => {
      expect(screen.getByText("00 meses")).toBeInTheDocument();
      expect(screen.getByText("04 anos a 06 anos")).toBeInTheDocument();
    });

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );

    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, mockRelatorioAlunosMatriculadosDREResultadosPagina2);

    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.queryByText("CEMEI SUZANA CAMPOS TAUIL"),
      ).not.toBeInTheDocument();
    });

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    await waitFor(() => {
      expect(
        screen.queryByText("Relação de alunos matriculados"),
      ).not.toBeInTheDocument();
    });
  });

  it("Deve renderizar erro ao ir para página 2", async () => {
    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, mockRelatorioAlunosMatriculadosDREResultados);

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText("Relação de alunos matriculados"),
      ).toBeInTheDocument();
    });

    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );

    mock.onGet("/relatorio-alunos-matriculados/filtrar/").replyOnce(400, {});

    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao trocar de página, tente novamente mais tarde",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Deve exibir mensagem quando não há alunos matriculados", async () => {
    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, { results: [], count: 0 });

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não há alunos matriculados para os filtros selecionados.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Deve renderizar erro ao exportar xlsx", async () => {
    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, mockRelatorioAlunosMatriculadosDREResultados);

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText("Relação de alunos matriculados"),
      ).toBeInTheDocument();
    });

    const botaoBaixarExcel = screen.getByText("Baixar EXCEL").closest("button");

    mock.onGet("/relatorio-alunos-matriculados/gerar-xlsx/").replyOnce(400, {});

    fireEvent.click(botaoBaixarExcel);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao exportar xls. Tente novamente mais tarde."),
      ).toBeInTheDocument();
    });
  });

  it("Deve renderizar erro ao exportar pdf", async () => {
    mock
      .onGet("/relatorio-alunos-matriculados/filtrar/")
      .replyOnce(200, mockRelatorioAlunosMatriculadosDREResultados);

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText("Relação de alunos matriculados"),
      ).toBeInTheDocument();
    });

    const botaoBaixarPDF = screen.getByText("Baixar PDF").closest("button");

    mock.onGet("/relatorio-alunos-matriculados/gerar-pdf/").replyOnce(400, {});

    fireEvent.click(botaoBaixarPDF);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao exportar pdf. Tente novamente mais tarde."),
      ).toBeInTheDocument();
    });
  });

  it("Deve renderizar erro ao filtrar", async () => {
    mock.onGet("/relatorio-alunos-matriculados/filtrar/").replyOnce(400, {});

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao filtrar alunos matriculados, tente novamente mais tarde",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Deve filtrar por lote e tipo de turma", () => {
    const selectLotes = screen.getByTestId("select-lotes");
    const selectControlLote = within(selectLotes).getByRole("combobox");
    fireEvent.mouseDown(selectControlLote);

    const optionLOTE7 = screen.getByText("LOTE 07");
    fireEvent.click(optionLOTE7);

    const selectTiposTurmas = screen.getByTestId("select-tipos-turmas");
    const selectControlTipoTurma =
      within(selectTiposTurmas).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoTurma);

    const optionREGULAR = screen.getByText("REGULAR");
    fireEvent.click(optionREGULAR);
  });

  it("Deve renderizar `Não existem resultados para os filtros selecionados.`", async () => {
    const selectTipoUnidade = screen.getByTestId("select-tipos-unidades");
    const selectControlTipoUnidade =
      within(selectTipoUnidade).getByRole("combobox");
    fireEvent.mouseDown(selectControlTipoUnidade);

    const optionEMEFPFOM = screen.getByText("EMEF P FOM");
    fireEvent.click(optionEMEFPFOM);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existem resultados para os filtros selecionados.",
        ),
      ).toBeInTheDocument();
    });
  });
});
