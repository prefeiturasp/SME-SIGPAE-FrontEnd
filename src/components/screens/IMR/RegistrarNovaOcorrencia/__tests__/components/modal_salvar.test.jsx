import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ModalSalvar } from "../../components/ModalSalvar";

describe("Testes de comportamentos componente - ModalSalvar", () => {
  const handleClose = jest.fn();
  const salvar = jest.fn();

  const values = {
    categoria: "categoria_teste",
    tipo_ocorrencia: "tipo_teste",
    datas: ["2026-04-29"],
    ocorrencias: [],
    solicitacao_medicao_inicial: "123e4567-e89b-42d3-a456-426614174000",
  };

  const setup = (show = true) =>
    render(
      <MemoryRouter>
        <ModalSalvar
          show={show}
          handleClose={handleClose}
          salvar={salvar}
          values={values}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto do modal quando show = true", () => {
    setup(true);

    expect(
      screen.getByText("Salvar Registro da Ocorrência"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja salvar o registro da ocorrência/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Você ainda poderá editar o registro até o envio da Medição Inicial/i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Salvar Registro da Ocorrência"),
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
    expect(salvar).not.toHaveBeenCalled();
  });

  it("deve clicar em 'Sim', chamar salvar com values e depois handleClose", async () => {
    salvar.mockResolvedValue();

    setup(true);

    const botaoSim = screen.getByRole("button", {
      name: /Sim/i,
    });
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(salvar).toHaveBeenCalledTimes(1);
      expect(salvar).toHaveBeenCalledWith(values);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
