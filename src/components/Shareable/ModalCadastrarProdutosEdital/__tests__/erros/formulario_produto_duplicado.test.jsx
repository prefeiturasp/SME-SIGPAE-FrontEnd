import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ModalCadastrarProdutosEdital from "../../index";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { ToastContainer } from "react-toastify";

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  tipoStatus: () => [
    { uuid: "Ativo", status: "Ativo" },
    { uuid: "Inativo", status: "Inativo" },
  ],
}));

describe("Verifica os comportamentos do formulário de cadastro de produtos do edital", () => {
  const props = {
    closeModal: jest.fn(),
    showModal: true,
    changePage: jest.fn(),
    onFinish: jest.fn(),
  };

  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.COORDENADOR_GESTAO_PRODUTO);
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalCadastrarProdutosEdital {...props} />
          <ToastContainer />
        </MemoryRouter>
      );
    });
  });

  it("Preenche o formulário com um novo produto e verifica retorno de cadastro com sucesso", async () => {
    mock
      .onPost("/cadastro-produtos-edital/")
      .reply(400, ["Item já cadastrado."]);

    const campoNome = screen.getByTestId("produto-nome-input");
    fireEvent.change(campoNome, {
      target: { value: "ABACATE AZUL" },
    });

    const campoStatus = screen.getByTestId("produto-status-select");
    const selectElement = campoStatus.querySelector("select");
    fireEvent.change(selectElement, {
      target: { value: "Ativo" },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    expect(botaoSalvar).toBeInTheDocument();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(screen.getByText("Item já cadastrado.")).toBeInTheDocument();
    });
  });
});
