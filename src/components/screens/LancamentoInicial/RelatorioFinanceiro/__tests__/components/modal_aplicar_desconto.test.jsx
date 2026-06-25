import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockEscolasParaFiltros } from "src/mocks/services/escola.service/escolasParaFiltros";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockClausulasDeDesconto } from "src/mocks/LancamentoInicial/CadastroDeClausulas/clausulasDeDescontos";
import ModalAplicarDesconto from "../../components/ModalAplicarDesconto";
import mock from "src/services/_mock";
import { mockRelatorioFinanceiroFaixaEtaria } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatorioFinanceiroConsolidado";

describe("Testes de comportamento formulário - ModalAplicarDesconto", () => {
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

  it("deve renderizar os campos do formulário", () => {
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

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve adicionar um novo desconto", () => {
    setup();

    const botaoAdicionar = screen.getByTestId("botao-adicionar");

    fireEvent.click(botaoAdicionar);

    expect(screen.getByTestId("botao_remover_1")).toBeInTheDocument();
  });

  it("deve abrir modal de cancelamento ao clicar em cancelar quando não existem descontos", () => {
    setup({
      descontos: [],
    });

    fireEvent.click(screen.getByTestId("botao-cancelar"));

    expect(
      screen.getByText("Cancelar Aplicação de descontos"),
    ).toBeInTheDocument();
  });

  it("deve fechar diretamente ao clicar em cancelar quando existem descontos", () => {
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

    expect(setShowModal).toHaveBeenCalledWith(false);
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

    expect(screen.getAllByTestId(/botao_remover_/i).length).toBeGreaterThan(1);
  });
});
