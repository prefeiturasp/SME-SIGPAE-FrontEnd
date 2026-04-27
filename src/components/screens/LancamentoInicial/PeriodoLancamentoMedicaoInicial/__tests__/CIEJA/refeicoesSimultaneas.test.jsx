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
import mock from "src/services/_mock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosEscolaCIEJA } from "src/mocks/meusDados/escolaCIEJA";
import { mockGetVinculosTipoAlimentacaoPorEscolaCIEJA } from "src/mocks/services/cadastroTipoAlimentacao.service/CIEJA/mockGetVinculosTipoAlimentacaoPorEscolaCIEJA";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { logDietasAutorizadasMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/logDietasAutorizadasMaio2025";
import { valoresMedicaoMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/valoresMedicaoMaio2025";
import { diasCalendarioMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/diasCalendarioMaio2025";
import { matriculadosMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/matriculadosMaio2025";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { stateManhaMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/stateManhaMaio2025";

import preview from "jest-preview";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, onChange }) => (
    <textarea
      data-testid="ckeditor-mock"
      {...input}
      onChange={(e) => {
        input.onChange(e.target.value);
        onChange && onChange(e.target.value, { getData: () => e.target.value });
      }}
    />
  ),
}));

const preencherCampo = async (
  campo,
  dia,
  idCategoriaAlimentacao,
  valor = "80",
) => {
  const nomeInput = screen.getByTestId(
    `${campo}__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
  );

  await act(async () => {
    fireEvent.change(nomeInput, {
      target: {
        name: nomeInput.getAttribute("name"),
        value: valor,
      },
    });
  });
};

const obterValorDoCampo = (campo, dia, idCategoriaAlimentacao) => {
  const nomeInput = screen.getByTestId(
    `${campo}__dia_${dia}__categoria_${idCategoriaAlimentacao}`,
  );
  return nomeInput.value;
};

describe("Teste Refeições Simultâneas - CIEJA", () => {
  const escolaUuid = mockMeusDadosEscolaCIEJA.vinculo_atual.instituicao.uuid;
  const nomeEscola = mockMeusDadosEscolaCIEJA.vinculo_atual.instituicao.nome;

  beforeEach(async () => {
    jest.clearAllMocks();

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCIEJA);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCIEJA);
    mock.onGet("medicao-inicial/lanches-emergenciais-diarios/").reply(200, []);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, logDietasAutorizadasMaio2025);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, valoresMedicaoMaio2025);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/dias-calendario/").reply(200, diasCalendarioMaio2025);
    mock.onGet("/matriculados-no-mes/").reply(200, matriculadosMaio2025);
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
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["01"] });

    const search = `?uuid=a2eed560-2255-4067-a803-4ad6b9f1d26a&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `${nomeEscola}`);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: stateManhaMaio2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCIEJA,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  describe("Testa conteúdo básico da tela", () => {
    it("renderiza label `Mês do Lançamento`", async () => {
      expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
    });

    it("renderiza valor `Maio / 2025` no input `Mês do Lançamento`", () => {
      const inputElement = screen.getByTestId("input-mes-lancamento");
      expect(inputElement).toHaveAttribute("value", "Maio / 2025");
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
        screen.getByText(
          "Semanas do Período para Lançamento da Medição Inicial",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza as labels `Semana 1`, `Semana 2`, `Semana 3`, `Semana 4` e `Semana 5`", async () => {
      expect(screen.getByText("Semana 1")).toBeInTheDocument();
      expect(screen.getByText("Semana 2")).toBeInTheDocument();
      expect(screen.getByText("Semana 3")).toBeInTheDocument();
      expect(screen.getByText("Semana 4")).toBeInTheDocument();
      expect(screen.getByText("Semana 5")).toBeInTheDocument();
    });

    it("renderiza label `ALIMENTAÇÃO`", async () => {
      expect(screen.getByText("ALIMENTAÇÃO")).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS`", async () => {
      expect(
        screen.getByText(
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
        ),
      ).toBeInTheDocument();
    });

    it("renderiza label `DIETA ESPECIAL - TIPO B`", async () => {
      expect(screen.getByText("DIETA ESPECIAL - TIPO B")).toBeInTheDocument();
    });
  });

  describe("Testa a Alimentação", () => {
    it("Preenche refeição - deve exibir warning, destacar botão de observação e desabilitar o botão salvar quando refeicao for diferente de 0(zero)", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      const dia = "05";
      await preencherCampo("frequencia", dia, 1);
      await preencherCampo("lanche_4h", dia, 1);
      await preencherCampo("refeicao", dia, 1);

      const iconeTooltip = screen.getByTestId("icone-tooltip-warning");
      expect(iconeTooltip).toBeInTheDocument();
      expect(iconeTooltip).toHaveClass("icone-info-warning");

      fireEvent.mouseOver(iconeTooltip);
      const mensagemTooltip = await screen.findByText(
        "Justifique o apontamento de lanche concomitante ao registro de refeição, uma vez que o aluno deve receber apenas um tipo de alimentação.",
      );
      expect(mensagemTooltip).toBeInTheDocument();

      const botaoObservacao = screen.getByTestId(
        `botao-observacao__dia_${dia}__categoria_1`,
      );
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("red-button-outline");
      expect(botaoObservacao).toHaveTextContent("Adicionar");

      const botaoSalvar = screen
        .getByText("Salvar Lançamentos")
        .closest("button");
      expect(botaoSalvar).toBeDisabled();
    });

    it("Preenche refeição - não deve exigir justificativa quando a o valor de refeicao for zero", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      const dia = "05";
      await preencherCampo("frequencia", dia, 1);
      await preencherCampo("lanche_4h", dia, 1);
      await preencherCampo("refeicao", dia, 1, 0);

      const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
      expect(iconeTooltip).not.toBeInTheDocument();
      const botaoObservacao = screen.getByTestId(
        `botao-observacao__dia_${dia}__categoria_1`,
      );
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("green-button-outline-white");
      expect(botaoObservacao).toHaveTextContent("Adicionar");

      const botaoSalvar = screen
        .getByText("Salvar Lançamentos")
        .closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    it("Preenche refeição - não deve exigir justificativa quando a o valor de lanche 4h for zero", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);

      const dia = "05";
      await preencherCampo("frequencia", dia, 1);
      await preencherCampo("lanche_4h", dia, 1, 0);
      await preencherCampo("refeicao", dia, 1);

      const iconeTooltip = screen.queryByTestId("icone-tooltip-warning");
      expect(iconeTooltip).not.toBeInTheDocument();
      const botaoObservacao = screen.getByTestId(
        `botao-observacao__dia_${dia}__categoria_1`,
      );
      expect(botaoObservacao).toBeInTheDocument();
      expect(botaoObservacao).toHaveClass("green-button-outline-white");
      expect(botaoObservacao).toHaveTextContent("Adicionar");

      const botaoSalvar = screen
        .getByText("Salvar Lançamentos")
        .closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    it("Preenche refeição - e inclui observação", async () => {
      const semana2Element = screen.getByText("Semana 2");
      fireEvent.click(semana2Element);
      const dia = "05";
      await preencherCampo("frequencia", dia, 1);
      await preencherCampo("lanche_4h", dia, 1);
      await preencherCampo("refeicao", dia, 1);

      const botaoSalvar = screen
        .getByText("Salvar Lançamentos")
        .closest("button");
      await waitFor(() => {
        expect(botaoSalvar).toBeDisabled();
      });

      const botaoObservacao = screen.getByTestId(
        `botao-observacao__dia_${dia}__categoria_1`,
      );
      expect(botaoObservacao).toHaveTextContent("Adicionar");
      fireEvent.click(botaoObservacao);

      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      expect(screen.getByText("Observação Diária")).toBeInTheDocument();
      expect(screen.getByText("Data do Lançamento")).toBeInTheDocument();
      expect(
        within(modal).getByPlaceholderText("05/05/2025"),
      ).toBeInTheDocument();

      const btnSalvarObservacao = screen.getByTestId("botao-salvar");
      expect(btnSalvarObservacao).toBeDisabled();
      const btnVoltar = screen.getByTestId("botao-voltar");
      expect(btnVoltar).not.toBeDisabled();
      const btnExcluir = screen.queryByTestId("botao-excluir");
      expect(btnExcluir).not.toBeInTheDocument();

      const mensagem = "Minha justificativa para alimentações simultâneas.";
      const ckEditor = screen.getByTestId("ckeditor-mock");
      fireEvent.change(ckEditor, { target: { value: mensagem } });

      await waitFor(() => {
        expect(ckEditor.value).toBe(mensagem);
        expect(btnSalvarObservacao).not.toBeDisabled();
      });

      fireEvent.click(btnSalvarObservacao);

      await waitFor(() => {
        expect(modal).not.toBeInTheDocument();
      });
    });

    it("Refeição e lanche 4h preenchidos com observação - Verifica botão visualizar", async () => {
      preview.debug();
      const dia = "02";
      const botaoSalvar = screen
        .getByText("Salvar Lançamentos")
        .closest("button");

      await waitFor(() => {
        expect(botaoSalvar).not.toBeDisabled();
      });

      const frequencia = obterValorDoCampo("frequencia", dia, 1);
      expect(frequencia).toBe("100");

      const lanche4h = obterValorDoCampo("lanche_4h", dia, 1);
      expect(lanche4h).toBe("60");

      const refeicao = obterValorDoCampo("refeicao", dia, 1);
      expect(refeicao).toBe("40");

      const botaoObservacao = screen.getByTestId(
        `botao-observacao__dia_${dia}__categoria_1`,
      );
      expect(botaoObservacao).toHaveClass("green-button");
      expect(botaoObservacao).toHaveTextContent("Visualizar");
      fireEvent.click(botaoObservacao);

      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      expect(screen.getByText("Observação Diária")).toBeInTheDocument();
      expect(screen.getByText("Data do Lançamento")).toBeInTheDocument();
      expect(
        within(modal).getByPlaceholderText("02/05/2025"),
      ).toBeInTheDocument();

      const btnSalvarObservacao = screen.getByTestId("botao-salvar");
      expect(btnSalvarObservacao).toBeDisabled();
      const btnVoltar = screen.getByTestId("botao-voltar");
      expect(btnVoltar).not.toBeDisabled();
      const btnExcluir = screen.queryByTestId("botao-excluir");
      expect(btnExcluir).not.toBeInTheDocument();

      const mensagem =
        "<p>Minha justificativa para alimentações simultâneas.</p>";
      const ckEditor = screen.getByTestId("ckeditor-mock");

      await waitFor(() => {
        expect(ckEditor.value).toBe(mensagem);
        expect(btnSalvarObservacao).toBeDisabled();
      });

      fireEvent.click(btnVoltar);

      await waitFor(() => {
        expect(modal).not.toBeInTheDocument();
      });
    });
  });
});
