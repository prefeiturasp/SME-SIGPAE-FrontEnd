import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ModalCadastrarProdutosEdital from "..";
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
  const renderizarModal = async (outrosProps = {}) => {
    const props = {
      closeModal: jest.fn(),
      showModal: true,
      changePage: jest.fn(),
      onFinish: jest.fn(),
      ...outrosProps,
    };

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
  };

  beforeEach(() => {
    localStorage.setItem("perfil", PERFIL.COORDENADOR_GESTAO_PRODUTO);
  });

  const dadosProdutoEdital = {
    uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    nome: "Laranja Abobora",
    status: "Ativo",
  };

  it("Verifica se o modal foi renderizado corretamente", async () => {
    await renderizarModal();
    expect(screen.getByText("Cadastrar Produto")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("Verifica se o formulário renderiza corretamente uma edição", async () => {
    await renderizarModal({
      produto: dadosProdutoEdital,
    });
    expect(screen.getByText("Editar Produto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Laranja Abobora")).toBeInTheDocument();
  });

  it("Verifica preenchimento do campo de nome", async () => {
    await renderizarModal();
    const campoNome = screen.getByTestId("produto-nome-input");
    fireEvent.change(campoNome, {
      target: { value: "alcatra" },
    });
    expect(campoNome.value).toBe("alcatra");
  });

  it("Verifica opção e seleciona ativo campo status", async () => {
    await renderizarModal();
    const campoStatus = screen.getByTestId("produto-status-select");
    const selectElement = campoStatus.querySelector("select");
    fireEvent.change(selectElement, {
      target: { value: "Ativo" },
    });
    expect(selectElement.value).toBe("Ativo");
  });

  const setNomeProdutoEdital = () => {
    const campoNome = screen.getByTestId("produto-nome-input");
    fireEvent.change(campoNome, {
      target: { value: "Laranja Abobora" },
    });
  };

  it("Preenche o formulário com um novo produto e verifica retorno de cadastro com sucesso", async () => {
    mock.onPost("/cadastro-produtos-edital/").reply(201, {});
    await renderizarModal();
    setNomeProdutoEdital();

    const campoStatus = screen.getByTestId("produto-status-select");
    const selectElement = campoStatus.querySelector("select");
    fireEvent.change(selectElement, {
      target: { value: "Ativo" },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    expect(botaoSalvar).toBeInTheDocument();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Cadastro de Produto Proveniente de Edital Efetuado com sucesso."
        )
      ).toBeInTheDocument();
    });
  });

  it("Edita o nome de um produto e verifica retorno de cadastro com sucesso", async () => {
    mock
      .onPatch(`/cadastro-produtos-edital/${dadosProdutoEdital.uuid}/`)
      .reply(200, {});
    await renderizarModal({ produto: dadosProdutoEdital });
    setNomeProdutoEdital();

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    expect(botaoSalvar).toBeInTheDocument();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText("Alterações salvas com sucesso.")
      ).toBeInTheDocument();
    });
  });
});
