import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalExcluir from "src/components/screens/Cadastros/CadastroGeral/componentes/ModalExcluirItem";
import { deletarItem } from "src/services/produto.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/produto.service");
jest.mock("src/components/Shareable/Toast/dialogs");

describe("Testa componente ModalExcluir", () => {
  const mockProps = {
    closeModal: jest.fn(),
    changePage: jest.fn(),
    showModal: true,
    item: { uuid: "55672287-4987-47a2-b416-7bee46e28ae7" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e a mensagem de confirmação corretamente", () => {
    render(<ModalExcluir {...mockProps} />);

    expect(screen.getByText("Excluir Item")).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja excluir o cadastro do item selecionado/i),
    ).toBeInTheDocument();
  });

  it("deve chamar closeModal quando o botão 'Não' for clicado", () => {
    render(<ModalExcluir {...mockProps} />);

    const botaoNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(botaoNao);

    expect(mockProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve processar a exclusão com sucesso", async () => {
    deletarItem.mockResolvedValueOnce({});

    render(<ModalExcluir {...mockProps} />);

    const botaoSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(botaoSim);

    expect(deletarItem).toHaveBeenCalledWith(
      "55672287-4987-47a2-b416-7bee46e28ae7",
    );

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Cadastro de item excluído com sucesso",
      );
      expect(mockProps.closeModal).toHaveBeenCalled();
      expect(mockProps.changePage).toHaveBeenCalled();
    });
  });

  it("deve exibir toast de erro quando a exclusão falhar", async () => {
    const mensagemErro = "Erro ao deletar item";
    deletarItem.mockRejectedValueOnce({
      response: { data: { detail: mensagemErro } },
    });

    render(<ModalExcluir {...mockProps} />);

    const botaoSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(mensagemErro);
      expect(mockProps.closeModal).toHaveBeenCalled();
      expect(mockProps.changePage).toHaveBeenCalled();
    });
  });

  it("deve desabilitar o botão 'Sim' enquanto o formulário está sendo submetido", async () => {
    deletarItem.mockReturnValueOnce(
      new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<ModalExcluir {...mockProps} />);

    const botaoSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(botaoSim);

    expect(botaoSim).toBeDisabled();
  });
});
