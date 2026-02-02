import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - MANHA - Usuário EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
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
      .reply(200, { results: ["18", "20", "21"] });

    const search = `?uuid=a0e68ec3-6fa9-4078-9e78-34f6a270d5ab&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
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
              state: mockStateMANHAEMEFAbril2025,
            },
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
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Abril / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Abril / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `MANHA` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "MANHA");
  });

  it("renderiza label `Semanas do Período para Lançamento da Medição Inicial`", () => {
    expect(
      screen.getByText("Semanas do Período para Lançamento da Medição Inicial"),
    ).toBeInTheDocument();
  });

  it("renderiza label `Semana 1`", async () => {
    expect(screen.getByText("Semana 1")).toBeInTheDocument();
  });

  it("renderiza label `Semana 5`", async () => {
    expect(screen.getByText("Semana 5")).toBeInTheDocument();
  });

  it("renderiza label `ALIMENTAÇÃO`", async () => {
    expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
  });

  it("exibe, no dia 1, o número de matriculados 308", async () => {
    const inputElementMatriculadosDia01 = screen.getByTestId(
      "matriculados__dia_01__categoria_1",
    );
    expect(inputElementMatriculadosDia01).toHaveAttribute("value", "308");
  });

  it("exibe, no dia 1, o número de frequentes 300", async () => {
    const inputElementFrequenciaDia01 = screen.getByTestId(
      "frequencia__dia_01__categoria_1",
    );
    expect(inputElementFrequenciaDia01).toHaveAttribute("value", "300");
  });

  it("exibe, no dia 1, o número de lanches 299", async () => {
    const inputElementLancheDia01 = screen.getByTestId(
      "lanche__dia_01__categoria_1",
    );
    expect(inputElementLancheDia01).toHaveAttribute("value", "299");
  });

  it("exibe borda vermelha (erro) nos lanches das dietas", async () => {
    // 299 + 1 + 1 + 1 > 300

    const inputElementLancheDia01DietasTipoA = screen.getByTestId(
      "lanche__dia_01__categoria_2",
    );
    expect(inputElementLancheDia01DietasTipoA).toHaveClass("invalid-field");

    const inputElementLancheDia01DietasTipoAEnteral = screen.getByTestId(
      "lanche__dia_01__categoria_3",
    );
    expect(inputElementLancheDia01DietasTipoAEnteral).toHaveClass(
      "invalid-field",
    );

    const inputElementLancheDia01DietasTipoB = screen.getByTestId(
      "lanche__dia_01__categoria_4",
    );
    expect(inputElementLancheDia01DietasTipoB).toHaveClass("invalid-field");
  });

  it("deixa de exibir o erro se a soma dos lanches não ultrapassa a frequência", async () => {
    const inputElementLancheDia01 = screen.getByTestId(
      "lanche__dia_01__categoria_1",
    );
    await waitFor(() => {
      fireEvent.change(inputElementLancheDia01, {
        target: { value: "297" },
      });
    });

    // 297 + 1 + 1 + 1 <= 300

    const inputElementLancheDia01DietasTipoA = screen.getByTestId(
      "lanche__dia_01__categoria_2",
    );
    expect(inputElementLancheDia01DietasTipoA).not.toHaveClass("invalid-field");

    const inputElementLancheDia01DietasTipoAEnteral = screen.getByTestId(
      "lanche__dia_01__categoria_3",
    );
    expect(inputElementLancheDia01DietasTipoAEnteral).not.toHaveClass(
      "invalid-field",
    );

    const inputElementLancheDia01DietasTipoB = screen.getByTestId(
      "lanche__dia_01__categoria_4",
    );
    expect(inputElementLancheDia01DietasTipoB).not.toHaveClass("invalid-field");
  });
});
