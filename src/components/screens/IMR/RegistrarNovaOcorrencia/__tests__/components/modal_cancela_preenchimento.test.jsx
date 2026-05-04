import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ModalCancelaPreenchimento } from "../../components/ModalCancelaPreenchimento";

describe("Testes de comportamentos componente - ModalCancelaPreenchimento", () => {
  const handleClose = jest.fn();
  const navigate = jest.fn();
  const form = {
    reset: jest.fn(),
  };

  const setup = (show = true) =>
    render(
      <MemoryRouter>
        <ModalCancelaPreenchimento
          show={show}
          handleClose={handleClose}
          form={form}
          navigate={navigate}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto do modal quando show = true", () => {
    setup(true);

    expect(
      screen.getByText("Cancelar Registro da Ocorrência"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja cancelar o registro da ocorrência/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /As informações inseridas serão apagadas e o registro não será salvo/i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Cancelar Registro da Ocorrência"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    setup(true);

    const botaoFechar = screen.getByRole("button", {
      name: /close/i,
    });
    fireEvent.click(botaoFechar);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("deve clicar em 'Não' e chamar handleClose", () => {
    setup(true);

    const botaoNao = screen.getByRole("button", {
      name: /Não/i,
    });
    fireEvent.click(botaoNao);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(form.reset).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("deve clicar em 'Sim', resetar o form, fechar modal e navegar para página anterior", () => {
    setup(true);

    const botaoSim = screen.getByRole("button", {
      name: /Sim/i,
    });
    fireEvent.click(botaoSim);

    expect(form.reset).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
