import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import ModalAplicarDesconto from "../../components/ModalAplicarDesconto";
import mock from "src/services/_mock";
import {
  mockRelatorioFinanceiroFaixaEtaria,
  mockRelatorioFinanceiroTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";

describe("Testes de comportamento do componente ModalAplicarDesconto", () => {
  describe("Testes de formulário Grupo 1 (CEI)", () => {
    const setShowModal = jest.fn();
    const onSave = jest.fn();

    const defaultProps = {
      showModal: true,
      setShowModal,
      relatorioFinanceiro: mockRelatorioFinanceiroFaixaEtaria.uuid,
      onSave,
      descontos: [],
      unidadesEducacionais: mockEscolasParaFiltros.map(({ uuid, nome }) => {
        return {
          value: uuid,
          label: nome,
        };
      }),
      faixasEtarias: mockFaixasEtarias.results,
      relatorioConsolidado: mockRelatorioFinanceiroFaixaEtaria,
      tiposAlimentacao: [],
    };

    const setup = (props = {}) =>
      render(
        <MemoryRouter>
          <ModalAplicarDesconto {...defaultProps} {...props} />
        </MemoryRouter>,
      );

    beforeEach(() => {
      jest.clearAllMocks();

      mock
        .onGet("/medicao-inicial/clausulas-de-descontos/")
        .reply(200, mockClausulasDeDesconto);
      mock
        .onPut(
          `/medicao-inicial/desconto-financeiro/aplicar-descontos/${mockRelatorioFinanceiroFaixaEtaria.uuid}/`,
        )
        .reply(200, {});
    });

    it("deve renderizar o modal", () => {
      setup();

      expect(screen.getByText("Aplicar Descontos")).toBeInTheDocument();

      expect(
        screen.getByText(/Informe abaixo os descontos/i),
      ).toBeInTheDocument();
    });

    it("deve renderizar os campos do formulário grupo CEI", () => {
      setup();

      expect(screen.getByText(/Unidades Educacionais/i)).toBeInTheDocument();
      expect(screen.getByText(/Faixa Etária/i)).toBeInTheDocument();
      expect(screen.getByText(/Cláusula de Desconto/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantidade/i)).toBeInTheDocument();
    });

    it("não deve renderizar quando showModal=false", () => {
      setup({
        showModal: false,
      });

      expect(screen.queryByText("Aplicar Descontos")).not.toBeInTheDocument();
    });

    it("deve fechar ao clicar no botão close", () => {
      setup();

      const botaoFechar = screen.getByRole("button", {
        name: /close/i,
      });

      fireEvent.click(botaoFechar);

      expect(
        screen.getByText("Cancelar Aplicação de descontos"),
      ).toBeInTheDocument();
    });

    it("deve adicionar um novo desconto", () => {
      setup();

      const botaoAdicionar = screen.getByTestId("botao-adicionar");

      fireEvent.click(botaoAdicionar);

      expect(screen.getByTestId("botao_remover_1")).toBeInTheDocument();
    });

    it("deve abrir modal de cancelamento ao clicar no botão cancelar", () => {
      setup({
        descontos: [
          {
            uuid: "1",
            unidades_educacionais: [],
            tipo_lancamento: "",
            faixa_etaria: "",
            clausula_desconto: "",
            quantidade: 0,
          },
        ],
      });

      fireEvent.click(screen.getByTestId("botao-cancelar"));

      expect(
        screen.getByText("Cancelar Aplicação de descontos"),
      ).toBeInTheDocument();
    });

    it("não deve renderizar conteúdo interno quando fechado", () => {
      setup({ showModal: false });

      expect(screen.queryByTestId("botao-cancelar")).not.toBeInTheDocument();
    });

    it("deve permitir adicionar múltiplos descontos", () => {
      setup();

      const botaoAdicionar = screen.getByTestId("botao-adicionar");

      fireEvent.click(botaoAdicionar);
      fireEvent.click(botaoAdicionar);

      expect(screen.getAllByTestId(/botao_remover_/i).length).toBeGreaterThan(
        1,
      );
    });
  });

  const setMultiSelect = async (testId, label) => {
    const container = screen.getByTestId(testId);
    const input = container.querySelector("input");

    if (!input) throw new Error("Input do react-select não encontrado");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const option = await screen.findByText(label);
    fireEvent.click(option);
  };

  const setSelect = (id, valor) => {
    const campoSelect = screen.getByTestId(id).querySelector("select");
    fireEvent.change(campoSelect, {
      target: { value: valor },
    });
  };

  const setInput = (id, valor) => {
    const input = screen.getByTestId(id, valor);
    fireEvent.change(input, {
      target: { value: valor },
    });
  };

  describe("Testes de formulário Grupo 3 (EMEI)", () => {
    const setShowModal = jest.fn();
    const onSave = jest.fn();
    const tiposAlimentacao =
      mockGetTiposUnidadeEscolarTiposAlimentacao.results.find(
        (e) => e.iniciais === "EMEI",
      ).periodos_escolares[0].tipos_alimentacao;
    const unidadesEducacionais = mockEscolasParaFiltros
      .filter(({ nome }) => nome.includes("EMEI"))
      .slice(0, 3)
      .map(({ uuid, nome }) => ({
        value: uuid,
        label: nome,
      }));

    const defaultProps = {
      showModal: true,
      setShowModal,
      relatorioFinanceiro: mockRelatorioFinanceiroTipoAlimentacao.uuid,
      onSave,
      descontos: [],
      unidadesEducacionais: unidadesEducacionais,
      faixasEtarias: [],
      relatorioConsolidado: mockRelatorioFinanceiroTipoAlimentacao,
      tiposAlimentacao: tiposAlimentacao,
    };

    const setup = async (props = {}) => {
      render(
        <MemoryRouter>
          <ModalAplicarDesconto {...defaultProps} {...props} />
        </MemoryRouter>,
      );

      await waitFor(() => expect(mock.history.get.length).toBeGreaterThan(0));
    };

    beforeEach(() => {
      jest.clearAllMocks();

      mock
        .onGet("/medicao-inicial/clausulas-de-descontos/")
        .reply(200, mockClausulasDeDesconto);
      mock
        .onPut(
          `/medicao-inicial/desconto-financeiro/aplicar-descontos/${mockRelatorioFinanceiroTipoAlimentacao.uuid}/`,
        )
        .reply(200, {});
    });

    it("deve renderizar os campos do formulário grupo EMEI", () => {
      setup();

      expect(screen.getByText(/Unidades Educacionais/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Faixa Etária para Desconto/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Alimentações")).toBeInTheDocument();
      expect(screen.getByText(/Cláusula de Desconto/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantidade/i)).toBeInTheDocument();
    });

    it("deve carregar tipos alimentação com base no tipo lançamento", async () => {
      setup();

      await setMultiSelect(
        "unidades_educacionais_0",
        unidadesEducacionais[0].label,
      );

      setSelect("tipo_lancamento_0", "ALIMENTACOES");

      const alimentacoes = screen.getByTestId("tipo_alimentacao_0");

      let options = within(alimentacoes).getAllByRole("option");
      expect(options.map((option) => option.textContent)).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
        "Refeição",
        "Sobremesa",
        "Lanche Emergencial",
        "Kit Lanche",
      ]);

      setSelect("tipo_lancamento_0", "DIETAS_TIPO_A");

      options = within(alimentacoes).getAllByRole("option");
      expect(options.map((option) => option.textContent)).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
        "Refeição",
      ]);

      setSelect("tipo_lancamento_0", "DIETAS_TIPO_B");

      options = within(alimentacoes).getAllByRole("option");
      expect(options.map((option) => option.textContent)).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
      ]);
    });

    it("deve preencher o formulário e carregar valores", async () => {
      setup();

      await setMultiSelect(
        "unidades_educacionais_0",
        unidadesEducacionais[0].label,
      );
      setSelect("tipo_lancamento_0", "ALIMENTACOES");
      setSelect("tipo_alimentacao_0", tiposAlimentacao[0].uuid);
      setSelect("clausula_desconto_0", mockClausulasDeDesconto.results[0].uuid);
      setInput("quantidade_0", "10");

      await waitFor(() => {
        expect(screen.getByTestId("valor_unitario_0")).toHaveValue("6,00");
        expect(screen.getByTestId("total_desconto_0")).toHaveValue("13,20");
      });
    });
  });
});
