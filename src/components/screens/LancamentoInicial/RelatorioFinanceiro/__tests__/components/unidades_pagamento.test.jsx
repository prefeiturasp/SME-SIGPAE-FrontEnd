import { render, screen, fireEvent, within } from "@testing-library/react";
import UnidadesPagamento from "../../components/UnidadesPagamento";

describe("Testes de comportamentos tabela de Unidades para Pagamento", () => {
  const onClose = jest.fn();

  const setup = (props) =>
    render(
      <UnidadesPagamento
        show={true}
        onClose={onClose}
        numeroEmpenho={"568"}
        tipoEmpenho={"PRINCIPAL"}
        totalUes={2}
        unidades={[{ nome: "UNIDADE 1" }, { nome: "UNIDADE 2" }]}
        {...props}
      />,
    );

  it("deve renderizar o modal quando show = true", () => {
    setup();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deve não renderizar o modal quando show = false", () => {
    setup({ show: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve renderizar os dados do empenho corretamente", () => {
    setup();

    const modal = screen.getByRole("dialog");

    expect(within(modal).getByText(/Nº do Empenho:/i)).toBeInTheDocument();
    expect(within(modal).getByText(/568/)).toBeInTheDocument();
    expect(within(modal).getByText(/PRINCIPAL/)).toBeInTheDocument();

    const totalUesContainer =
      within(modal).getByText(/Total de UEs:/i).parentElement;
    expect(totalUesContainer).toHaveTextContent("2");
  });

  it("deve renderizar a lista de unidades", () => {
    setup();

    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText("UNIDADE 1")).toBeInTheDocument();
    expect(within(modal).getByText("UNIDADE 2")).toBeInTheDocument();
  });

  it("deve chamar onClose ao clicar no botão 'Fechar'", async () => {
    setup();

    const botaoFechar = screen.getByText("Fechar").closest("button");
    fireEvent.click(botaoFechar);

    expect(onClose).toHaveBeenCalled();
  });

  it("deve chamar onClose ao clicar no botão de fechar do header", () => {
    setup();

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
