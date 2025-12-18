import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { mockDiasCalendarioEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/diasCalendario";
import { mockLogQuantidadeDietasAutorizadasEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/logQuantidadeDietasAutorizadas";
import { mockMatriculadosNoMesEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/matriculadosNoMes";
import { mockPermissoesLancamentosEspeciaisMesAnoPorPeriodoEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/permissaoLancamentosEspeciais";
import { mockStateMANHAEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/stateMANHA";
import { mockValoresMedicaoMANHAEMEFAbril2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Abril2025/valoresMedicaoMANHA";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { ToastContainer } from "react-toastify";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Lançamento com Repetição 2ª Sobremesa", () => {
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
      .reply(200, ["2025-04-11"]);
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
      .reply(200, { results: [] });

    mock.onPost("/solicitacoes-dieta-especial/panorama-escola/").reply(200, []);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);

    const search = `?uuid=${escolaUuid}&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockStateMANHAEMEFAbril2025 },
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
            <ToastContainer />
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

  it("renderiza valor `Abril / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Abril / 2025");
  });

  it("renderiza valor `MANHA` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "MANHA");
  });

  const setSemana2 = () => {
    const semana1Element = screen.getByText("Semana 2");
    fireEvent.click(semana1Element);
  };

  const setInput = (id, valor) => {
    const input = screen.getByTestId(id);
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: valor },
    });
    return input;
  };

  it("ao clicar na tab `Semana 2`, preenche oferta/repetição 2ª sobremesa sem a frequência e verifica bloqueio salvar", async () => {
    setSemana2();
    setInput("2_sobremesa_1_oferta__dia_11__categoria_1", "2");
    setInput("repeticao_2_sobremesa__dia_11__categoria_1", "2");

    await waitFor(() => {
      const botao = screen.getByText("Salvar Lançamentos").closest("button");
      expect(botao).toBeDisabled();
    });
  });

  it("ao clicar na tab `Semana 2`, preenche repetição menor do que oferta e verifica comportamento input", async () => {
    setSemana2();
    setInput("frequencia__dia_11__categoria_1", "2");
    setInput("2_sobremesa_1_oferta__dia_11__categoria_1", "2");
    const repeticao = setInput(
      "repeticao_2_sobremesa__dia_11__categoria_1",
      "1",
    );

    await waitFor(() => {
      expect(repeticao).toHaveClass("border-warning");
    });
  });

  it("Preenche oferta/repetição 2ª sobremesa e verifica validação ao tentar salvar lançamento sem observação", async () => {
    setSemana2();
    setInput("frequencia__dia_11__categoria_1", "2");
    setInput("2_sobremesa_1_oferta__dia_11__categoria_1", "2");
    setInput("repeticao_2_sobremesa__dia_11__categoria_1", "2");

    const botao = screen.getByText("Salvar Lançamentos").closest("button");
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Dia 11 é de sobremesa doce. Justifique o lançamento de repetição nas observações",
        ),
      ).toBeInTheDocument();
    });
  });
});
