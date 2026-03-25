import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import DadosLiquidacao from "../../components/DadosLiquidacao";
import { mockDadosLiquidacao } from "src/mocks/services/relatorioFinanceiro.service/mockGetDadosLiquidacao";

describe("Testes de comportamentos tabela Dados para Liquidacao", () => {
  const setup = (dados = mockDadosLiquidacao) =>
    render(<DadosLiquidacao dados={dados} />);

  it("deve renderizar o título da tabela", () => {
    setup();

    expect(screen.getByText("DADOS PARA LIQUIDAÇÃO")).toBeInTheDocument();
  });

  it("deve renderizar múltiplas linhas com os dados do mock", () => {
    setup();

    expect(screen.getByText("568")).toBeInTheDocument();
    expect(screen.getByText("PRINCIPAL")).toBeInTheDocument();

    expect(screen.getByText("333")).toBeInTheDocument();
    expect(screen.getByText("SECUNDÁRIA")).toBeInTheDocument();
  });

  it("deve renderizar 'Visualizar Unidades' para cada item", () => {
    setup();

    const visualizar = screen.getAllByText("Visualizar Unidades");
    expect(visualizar.length).toBe(2);
  });

  it("deve fechar o modal ao clicar em fechar", async () => {
    setup();

    fireEvent.click(screen.getAllByText("Visualizar Unidades")[0]);

    fireEvent.click(screen.getByText("Fechar").closest("button"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("deve abrir modal com dados corretos ao clicar 'Visualizar Unidades' e fechar modal", async () => {
    setup();

    fireEvent.click(screen.getAllByText("Visualizar Unidades")[0]);

    let modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();

    expect(within(modal).getByText(/Nº do Empenho:/i)).toBeInTheDocument();
    expect(within(modal).getByText(/568/)).toBeInTheDocument();
    expect(within(modal).getByText(/PRINCIPAL/)).toBeInTheDocument();
    expect(within(modal).getByText(/Total de UEs:/i)).toBeInTheDocument();

    const botaoFechar = screen.getByText("Fechar").closest("button");
    fireEvent.click(botaoFechar);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Visualizar Unidades")[1]);

    modal = screen.getByRole("dialog");

    expect(within(modal).getByText(/333/)).toBeInTheDocument();
    expect(within(modal).getByText(/SECUNDÁRIA/)).toBeInTheDocument();
    expect(within(modal).getByText(/2/i)).toBeInTheDocument();
  });

  it("deve renderizar lista de unidades corretamente", () => {
    setup();

    fireEvent.click(screen.getAllByText("Visualizar Unidades")[1]);

    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText("CIEJA LELIA GONZALEZ")).toBeInTheDocument();
    expect(
      within(modal).getByText("CMCT LENINE SOARES DE JESUS, PROF."),
    ).toBeInTheDocument();
  });

  it("deve renderizar corretamente quando não houver dados", () => {
    setup([]);

    expect(screen.getByText("DADOS PARA LIQUIDAÇÃO")).toBeInTheDocument();
    expect(screen.queryByText("Visualizar Unidades")).not.toBeInTheDocument();
  });
});
