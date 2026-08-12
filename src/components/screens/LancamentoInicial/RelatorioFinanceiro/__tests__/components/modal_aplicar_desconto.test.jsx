import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import mock from "src/services/_mock";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import {
  mockRelatorioFinanceiroFaixaEtaria,
  mockRelatorioFinanceiroTipoAlimentacao,
} from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";

import ModalAplicarDesconto from "../../components/ModalAplicarDesconto";

describe("Teste de funcionalidade e comportamentos do ModalAplicarDesconto", () => {
  const setup = (props) =>
    render(
      <MemoryRouter>
        <ModalAplicarDesconto {...props} />
      </MemoryRouter>,
    );

  const getOptions = (testId) =>
    within(screen.getByTestId(testId))
      .getAllByRole("option")
      .map((option) => option.textContent);

  const getUnidadesEducacionais = (tipo, quantidade = 3) =>
    mockEscolasParaFiltros
      .filter(({ nome }) => nome.includes(tipo))
      .slice(0, quantidade)
      .map(({ uuid, nome }) => ({
        value: uuid,
        label: nome,
      }));

  const getGrupoUnidadeEscolar = (grupo) =>
    mockGetGrupoUnidadeEscolar.results.find(({ nome }) => nome.includes(grupo));

  const getTiposAlimentacao = (tipo) =>
    mockGetTiposUnidadeEscolarTiposAlimentacao.results.find(
      ({ iniciais }) => iniciais === tipo,
    ).periodos_escolares[0].tipos_alimentacao;

  const setMultiSelect = async (testId, label) => {
    const input = screen.getByTestId(testId).querySelector("input");

    if (!input) {
      throw new Error("Input do react-select não encontrado");
    }

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    fireEvent.click(await screen.findByText(label));
  };

  const setSelect = (testId, value) => {
    const select = screen.getByTestId(testId).querySelector("select");

    fireEvent.change(select, {
      target: { value },
    });
  };

  const setInput = (testId, value) => {
    fireEvent.change(screen.getByTestId(testId), {
      target: { value },
    });
  };

  const createDefaultProps = ({
    relatorioFinanceiro,
    relatorioConsolidado,
    unidadesEducacionais,
    faixasEtarias = [],
    tiposAlimentacao = [],
  }) => ({
    showModal: true,
    setShowModal: jest.fn(),
    relatorioFinanceiro,
    onSave: jest.fn(),
    descontos: [],
    unidadesEducacionais,
    faixasEtarias,
    relatorioConsolidado,
    tiposAlimentacao,
  });

  const mockAplicarDescontos = (relatorioUuid) => {
    mock
      .onPut(
        `/medicao-inicial/desconto-financeiro/aplicar-descontos/${relatorioUuid}/`,
      )
      .reply(200, {});
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mock
      .onGet("/medicao-inicial/clausulas-de-descontos/")
      .reply(200, mockClausulasDeDesconto);
  });

  describe("comportamento geral", () => {
    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroFaixaEtaria.uuid,
      relatorioConsolidado: mockRelatorioFinanceiroFaixaEtaria,
      unidadesEducacionais: getUnidadesEducacionais("CEI"),
      faixasEtarias: mockFaixasEtarias.results,
    });

    beforeEach(() => {
      mockAplicarDescontos(mockRelatorioFinanceiroFaixaEtaria.uuid);
    });

    it("deve renderizar o modal", () => {
      setup(defaultProps);

      expect(screen.getByText("Aplicar Descontos")).toBeInTheDocument();
      expect(
        screen.getByText(/Informe abaixo os descontos/i),
      ).toBeInTheDocument();
    });

    it("não deve renderizar quando showModal=false", () => {
      setup({
        ...defaultProps,
        showModal: false,
      });

      expect(screen.queryByText("Aplicar Descontos")).not.toBeInTheDocument();
    });

    it("deve fechar ao clicar no botão close", () => {
      setup(defaultProps);

      fireEvent.click(
        screen.getByRole("button", {
          name: /close/i,
        }),
      );

      expect(
        screen.getByText("Cancelar Aplicação de descontos"),
      ).toBeInTheDocument();
    });

    it("deve adicionar um novo desconto", () => {
      setup(defaultProps);

      fireEvent.click(screen.getByTestId("botao-adicionar"));

      expect(screen.getByTestId("botao_remover_1")).toBeInTheDocument();
    });

    it("deve abrir modal de cancelamento ao clicar no botão cancelar", async () => {
      setup({
        ...defaultProps,
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

      fireEvent.click(
        screen.getByRole("button", {
          name: /Sim/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Cancelar Aplicação de descontos"),
        ).not.toBeInTheDocument();
      });
    });

    it("não deve renderizar conteúdo interno quando fechado", () => {
      setup({
        ...defaultProps,
        showModal: false,
      });

      expect(screen.queryByTestId("botao-cancelar")).not.toBeInTheDocument();
    });

    it("deve permitir adicionar e remover descontos", () => {
      setup(defaultProps);

      const botaoAdicionar = screen.getByTestId("botao-adicionar");

      fireEvent.click(botaoAdicionar);
      fireEvent.click(botaoAdicionar);

      expect(screen.getAllByTestId(/botao_remover_/i)).toHaveLength(3);

      fireEvent.click(screen.getByTestId("botao_remover_0"));

      expect(screen.getAllByTestId(/botao_remover_/i)).toHaveLength(2);
    });
  });

  describe("Grupo 1 - CEI", () => {
    const unidadesEducacionais = getUnidadesEducacionais("CEI");

    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroFaixaEtaria.uuid,
      relatorioConsolidado: mockRelatorioFinanceiroFaixaEtaria,
      unidadesEducacionais,
      faixasEtarias: mockFaixasEtarias.results,
    });

    beforeEach(() => {
      mockAplicarDescontos(mockRelatorioFinanceiroFaixaEtaria.uuid);
    });

    it("deve renderizar os campos do formulário grupo CEI", () => {
      setup(defaultProps);

      expect(screen.getByText(/Unidades Educacionais/i)).toBeInTheDocument();
      expect(screen.getByText(/Faixa Etária/i)).toBeInTheDocument();
      expect(screen.getByText(/Cláusula de Desconto/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantidade/i)).toBeInTheDocument();
    });
  });

  describe("Grupo 2 - CEMEI", () => {
    const unidadesEducacionais = getUnidadesEducacionais("CEMEI");
    const tiposAlimentacao = getTiposAlimentacao("CEMEI");
    const grupoCEMEI = getGrupoUnidadeEscolar("Grupo 2");

    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroTipoAlimentacao.uuid,
      relatorioConsolidado: {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoCEMEI,
      },
      unidadesEducacionais,
      faixasEtarias: mockFaixasEtarias.results,
      tiposAlimentacao,
    });

    it("deve carregar opção CEI e EMEI dos tipos de lançamento", async () => {
      setup(defaultProps);

      await setMultiSelect(
        "unidades_educacionais_0",
        unidadesEducacionais[0].label,
      );

      expect(getOptions("tipo_lancamento_0")).toEqual(
        expect.arrayContaining([
          "ALIMENTAÇÕES - CEI",
          "DIETA ESPECIAL TIPO A - CEI",
          "DIETA ESPECIAL TIPO B - CEI",
          "ALIMENTAÇÕES - EMEI",
          "DIETA ESPECIAL TIPO A - EMEI",
          "DIETA ESPECIAL TIPO B - EMEI",
        ]),
      );
    });

    it("deve exibir os campos com base no tipo de lançamento", async () => {
      setup(defaultProps);

      setSelect("tipo_lancamento_0", "CEI|ALIMENTACOES");

      await waitFor(() => {
        expect(
          screen.getByText(/Faixa Etária para Desconto/i),
        ).toBeInTheDocument();
      });

      expect(screen.queryByText("Alimentações")).not.toBeInTheDocument();

      setSelect("tipo_lancamento_0", "EMEI|ALIMENTACOES");

      await waitFor(() => {
        expect(screen.getByText("Alimentações")).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/Faixa Etária para Desconto/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Grupo 3 - EMEI", () => {
    const unidadesEducacionais = getUnidadesEducacionais("EMEI");
    const tiposAlimentacao = getTiposAlimentacao("EMEI");
    const grupoEMEI = getGrupoUnidadeEscolar("Grupo 3");

    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroTipoAlimentacao.uuid,
      relatorioConsolidado: {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoEMEI,
      },
      unidadesEducacionais,
      tiposAlimentacao,
    });

    beforeEach(() => {
      mockAplicarDescontos(mockRelatorioFinanceiroTipoAlimentacao.uuid);
    });

    it("deve renderizar os campos do formulário grupo EMEI", () => {
      setup(defaultProps);

      expect(screen.getByText(/Unidades Educacionais/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Faixa Etária para Desconto/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Alimentações")).toBeInTheDocument();
      expect(screen.getByText(/Cláusula de Desconto/i)).toBeInTheDocument();
      expect(screen.getByText(/Quantidade/i)).toBeInTheDocument();
    });

    it("deve carregar tipos alimentação com base no tipo lançamento", async () => {
      setup(defaultProps);

      await setMultiSelect(
        "unidades_educacionais_0",
        unidadesEducacionais[0].label,
      );

      setSelect("tipo_lancamento_0", "ALIMENTACOES");

      expect(getOptions("tipo_alimentacao_0")).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
        "Refeição",
        "Sobremesa",
        "Lanche Emergencial",
        "Kit Lanche",
      ]);

      setSelect("tipo_lancamento_0", "DIETAS_TIPO_A");

      expect(getOptions("tipo_alimentacao_0")).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
        "Refeição",
      ]);

      setSelect("tipo_lancamento_0", "DIETAS_TIPO_B");

      expect(getOptions("tipo_alimentacao_0")).toEqual([
        "Selecione as alimentações",
        "Lanche 4h",
        "Lanche",
      ]);
    });

    it("deve preencher o formulário e carregar valores", async () => {
      setup(defaultProps);

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

  describe("Grupo 4 - EMEF", () => {
    const unidadesEducacionais = getUnidadesEducacionais("EMEF");
    const tiposAlimentacao = getTiposAlimentacao("EMEF");

    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroTipoAlimentacao.uuid,
      relatorioConsolidado: mockRelatorioFinanceiroTipoAlimentacao,
      unidadesEducacionais,
      tiposAlimentacao,
    });

    it("deve carregar opção de refeição EJA", async () => {
      setup(defaultProps);

      await setMultiSelect(
        "unidades_educacionais_0",
        unidadesEducacionais[0].label,
      );

      setSelect("tipo_lancamento_0", "ALIMENTACOES");

      expect(getOptions("tipo_alimentacao_0")).toEqual(
        expect.arrayContaining(["Refeição", "Refeição - EJA"]),
      );

      setSelect("tipo_lancamento_0", "DIETAS_TIPO_A");

      expect(getOptions("tipo_alimentacao_0")).toEqual(
        expect.arrayContaining(["Refeição", "Refeição - EJA"]),
      );
    });
  });

  describe("Grupo 5 - EMEBS", () => {
    const unidadesEducacionais = getUnidadesEducacionais("EMEBS");
    const tiposAlimentacao = getTiposAlimentacao("EMEBS");
    const grupoEMEBS = getGrupoUnidadeEscolar("Grupo 5");

    const defaultProps = createDefaultProps({
      relatorioFinanceiro: mockRelatorioFinanceiroTipoAlimentacao.uuid,
      relatorioConsolidado: {
        ...mockRelatorioFinanceiroTipoAlimentacao,
        grupo_unidade_escolar: grupoEMEBS,
      },
      unidadesEducacionais,
      tiposAlimentacao,
    });

    beforeEach(() => {
      mockAplicarDescontos(mockRelatorioFinanceiroTipoAlimentacao.uuid);
    });

    it("deve carregar tipos de lançamento com base no grupo EMEBS", () => {
      setup(defaultProps);

      expect(getOptions("tipo_lancamento_0")).toEqual([
        "Selecione o tipo",
        "ALIMENTAÇÕES - INFANTIL",
        "DIETA ESPECIAL TIPO A - INFANTIL",
        "DIETA ESPECIAL TIPO B - INFANTIL",
        "ALIMENTAÇÕES - FUNDAMENTAL",
        "DIETA ESPECIAL TIPO A - FUNDAMENTAL",
        "DIETA ESPECIAL TIPO B - FUNDAMENTAL",
      ]);
    });
  });
});
