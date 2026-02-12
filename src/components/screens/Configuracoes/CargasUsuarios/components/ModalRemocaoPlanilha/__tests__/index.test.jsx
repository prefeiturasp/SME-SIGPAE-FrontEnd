import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ModalRemocaoPlanilha from "../";

describe("Testes de comportamentos componente - ModalRemocaoPlanilha", () => {
  const setShow = jest.fn();
  const removerPlanilha = jest.fn();
  const planilha = { id: 1, nome: "arquivo.xlsx" };

  const setup = (props = {}) => {
    render(
      <ModalRemocaoPlanilha
        show={true}
        setShow={setShow}
        planilha={planilha}
        removerPlanilha={removerPlanilha}
        {...props}
      />,
    );
  };

  it("renderiza o modal corretamente", () => {
    setup();

    expect(
      screen.getByText("Deseja remover este arquivo de carga?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Após removido, não será possível executar ou fazer download do arquivo",
      ),
    ).toBeInTheDocument();
  });

  it('botão "Não" deve fechar o modal', () => {
    setup();

    fireEvent.click(screen.getByTestId("botao-cancelar"));

    expect(setShow).toHaveBeenCalledTimes(1);
    expect(setShow).toHaveBeenCalledWith(false);
  });

  it('botão "Sim" deve chamar removerPlanilha com a planilha correta', async () => {
    setup();

    fireEvent.click(screen.getByTestId("botao-remover"));

    await waitFor(() => {
      expect(removerPlanilha).toHaveBeenCalledTimes(1);
      expect(removerPlanilha).toHaveBeenCalledWith(planilha);
    });
  });

  it("não deve renderizar quando show=false", () => {
    setup({ show: false });

    expect(
      screen.queryByText("Deseja remover este arquivo de carga?"),
    ).not.toBeInTheDocument();
  });
});
