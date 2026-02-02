import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalEncerrarContrato } from "src/components/screens/Cadastros/EditaisContratosRefatorado/Cadastro/components/ModalEncerrarContrato.tsx";

const mockContrato = {
  numero: "123/2023",
  id: 1,
};

const mockCloseModal = jest.fn();
const mockEncerrarContrato = jest.fn().mockResolvedValue(undefined);

const renderComponent = () => {
  return render(
    <ModalEncerrarContrato
      showModal={true}
      closeModal={mockCloseModal}
      encerrarContrato={mockEncerrarContrato}
      contrato={mockContrato}
    />,
  );
};
describe("Teste do componente ModalEncerrarContrato", () => {
  it("deve exibir o número do contrato corretamente no corpo do modal", () => {
    renderComponent();

    expect(screen.getByText(/Encerrar Contrato/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrato 123\/2023/i)).toBeInTheDocument();
  });

  it("deve chamar a função closeModal ao clicar no botão 'Não'", () => {
    renderComponent();

    const btnNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(btnNao);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve chamar encerrarContrato com o objeto contrato correto ao clicar em 'Sim'", async () => {
    renderComponent();
    const btnSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(btnSim);
    expect(mockEncerrarContrato).toHaveBeenCalledWith(mockContrato);
  });

  it("não deve renderizar nada quando showModal for false", () => {
    render(
      <ModalEncerrarContrato
        showModal={false}
        closeModal={mockCloseModal}
        encerrarContrato={mockEncerrarContrato}
        contrato={mockContrato}
      />,
    );
    expect(screen.queryByText(/Encerrar Contrato/i)).not.toBeInTheDocument();
  });
});
