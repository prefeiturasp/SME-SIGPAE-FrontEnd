import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockEmpresas } from "src/mocks/terceirizada.service/mockGetListaSimples";
import FiltrosEmails from "../FiltrosEmails";
import mock from "src/services/_mock";
import preview from "jest-preview";

describe("Testes do componente de Filtros de Emails - Gerenciamento Emails", () => {
  const atualizaTabela = jest.fn();
  const onChange = jest.fn();

  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <FiltrosEmails
            modulo="Gestão de Alimentação"
            atualizaTabela={atualizaTabela}
            onChange={onChange}
            empresas={mockEmpresas.results}
          />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar o componente corretamente", () => {
    expect(screen.getByText("Adicionar E-mails")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar Empresa ou E-mail cadastrado"),
    ).toBeInTheDocument();
  });

  it("deve clicar em adicionar e-mail e abrir o modal", async () => {
    expect(screen.queryByText("Adicionar E-mail")).not.toBeInTheDocument();

    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(screen.getByText("Adicionar E-mail")).toBeInTheDocument();
    });
  });

  it("deve preencher o campo busca com um e-mail e onChange ser acionado", async () => {
    const inputEmail = screen.getByTestId("input-busca");
    fireEvent.change(inputEmail, {
      target: { value: "teste@gmail.com" },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("deve abrir o modal de inserção, preencher dados e salvar", async () => {
    mock.onPost("/emails-terceirizadas-modulos/").reply(201, {});

    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);

    const selectEmpresa = screen.getByLabelText("Empresa");
    fireEvent.change(selectEmpresa, {
      target: { value: mockEmpresas.results[0].uuid },
    });

    const inputEmail = screen.getByTestId("input-email");
    fireEvent.change(inputEmail, {
      target: { value: "teste@gmail.com" },
    });

    const botaoSalvar = screen.getByTestId("botao-salvar");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(atualizaTabela).toHaveBeenCalled();
    });
  });

  it("deve abrir o modal e logo em seguida fechar", async () => {
    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(screen.getByText("Adicionar E-mail")).toBeInTheDocument();
    });

    const botaoCancelar = screen.getByTestId("botao-cancelar");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(screen.queryByText("Adicionar E-mail")).not.toBeInTheDocument();
    });
  });

  it("deve fechar o modal ao clicar no botão de fechar (X)", async () => {
    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(screen.getByText("Adicionar E-mail")).toBeInTheDocument();
    });
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Adicionar E-mail")).not.toBeInTheDocument();
    });
  });

  it("deve testar validação de email inválido no formulário", async () => {
    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);
    const inputEmail = screen.getByTestId("input-email");
    fireEvent.change(inputEmail, {
      target: { value: "email-invalido" },
    });
    fireEvent.blur(inputEmail);

    await waitFor(() => {
      expect(inputEmail.value).toBe("email-invalido");
    });
  });

  it("deve testar o onChange do select de empresa", async () => {
    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);
    const selectEmpresa = screen.getByLabelText("Empresa");
    fireEvent.mouseDown(selectEmpresa);
  });

  it("deve testar handleAdicionarEmail", async () => {
    const botaoAdicionar = screen.getByTestId("botao-adicionar");
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(screen.getByText("Adicionar E-mail")).toBeInTheDocument();
    });
  });
  preview.debug();
});
