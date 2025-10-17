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
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockTipoAlimentacao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CEUGESTAO/mockTipoAlimentacao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockInclusoesAutorizadasCMCTProgramasProjetosSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/inclusoesAutorizadas";
import { mockStateCMCTProgramasProjetosSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/stateProgramasProjetos";
import { mockValoresMedicaoCMCTProgramasProjetosSetembro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/valoresMedicaoProgramasProjetos";
import { mockMeusDadosEscolaCMCT } from "src/mocks/meusDados/escolaCMCT";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Programas e Projetos - Usuário CMCT - Corrige Lançamentos", () => {
  const escolaUuid = mockMeusDadosEscolaCMCT.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCMCT);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, ["2025-09-02"]);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, mockInclusoesAutorizadasCMCTProgramasProjetosSetembro2025);
    mock.onGet("/log-quantidade-dietas-autorizadas/").reply(200, []);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoCMCTProgramasProjetosSetembro2025);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, [
      {
        medicao: "9aba3d4e-4839-489f-ba90-31b67822a508",
        criado_em: "17/10/2025 11:24:07",
        uuid: "07a0db76-761f-4852-969a-552b9782580e",
        dia: "03",
        habilitado_correcao: true,
        infantil_ou_fundamental: "N/A",
        categoria_medicao: 1,
      },
    ]);
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock
      .onGet("/escolas-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["07"] });

    mock.onGet("/tipos-alimentacao/").reply(200, mockTipoAlimentacao);

    const search = `?uuid=bd69f3c8-33bb-42b2-86e8-db2f60d2a7d3&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
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
              state: mockStateCMCTProgramasProjetosSetembro2025,
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
              meusDados: mockMeusDadosEscolaCMCT,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Mês do Lançamento` e seu valor", () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Setembro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Setembro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Programas e Projetos` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Programas e Projetos");
  });

  it("Clica em corrige lançamentos e cancela", async () => {
    const botaoSalvarCorrecoes = screen
      .getByText("Salvar Correções")
      .closest("button");
    expect(botaoSalvarCorrecoes).toBeInTheDocument();
    expect(botaoSalvarCorrecoes).toBeEnabled();

    fireEvent.click(botaoSalvarCorrecoes);
    expect(screen.getByText("Não")).toBeInTheDocument();

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(screen.queryByText("Não")).not.toBeInTheDocument();
    });
  });

  it("Corrige lançamentos", async () => {
    const botaoSalvarCorrecoes = screen
      .getByText("Salvar Correções")
      .closest("button");
    expect(botaoSalvarCorrecoes).toBeInTheDocument();
    expect(botaoSalvarCorrecoes).toBeEnabled();

    fireEvent.click(botaoSalvarCorrecoes);
    expect(screen.getByText("Sim")).toBeInTheDocument();

    const botaoSim = screen.getByText("Sim").closest("button");

    mock
      .onPatch(
        "/medicao-inicial/medicao/9aba3d4e-4839-489f-ba90-31b67822a508/escola-corrige-medicao/",
      )
      .reply(200, {});

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(
        screen.getByText("Correções salvas com sucesso!"),
      ).toBeInTheDocument();
    });
  });
});
