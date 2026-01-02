import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { ModalEditarEmail } from "../ModalEditarEmail";
import { updateEmailsTerceirizadasPorModulo } from "src/services/terceirizada.service";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import { mockEmpresas } from "src/mocks/terceirizada.service/mockGetListaSimples";

describe("Testes de comportamentos - Modal Editar Email", () => {
  const closeModal = jest.fn();
  const buscarTerceirizadas = jest.fn();
  const email = {
    uuid: "3c15538d-9f03-48d6-9446-fa5f95a9557e",
    email: "teste@gmail.com",
    modulo: "Gestão de Alimentação",
  };

  const defaultProps = {
    showModal: true,
    closeModal,
    titulo: "Editar E-mail",
    tituloBotaoCorfirma: "Salvar",
    empresas: mockEmpresas.results,
    terceirizada: mockEmpresas.results[0],
    emailDict: email,
    endpoint: updateEmailsTerceirizadasPorModulo,
    buscarTerceirizadas,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => {
      render(
        <MemoryRouter>
          <ModalEditarEmail {...defaultProps} />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("verifica se o componente foi renderizado corretamente", () => {
    expect(screen.getByText("Editar E-mail")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("deve verificar se o campo Empresa está desabilitado", () => {
    const selectEmpresa = screen.getByTestId("campo-empresa");
    const inputInterno = selectEmpresa.querySelector("input");
    expect(inputInterno).toBeDisabled();
  });

  it("deve verificar se o campo Email está preenchido com o valor inicial", () => {
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    expect(inputEmail.value).toBe(email.email);
  });

  it("deve verificar se o botão Salvar está desabilitado inicialmente", () => {
    const botaoSalvar = screen.getByText("Salvar").closest("button");
    expect(botaoSalvar).toBeDisabled();
  });

  it("deve habilitar o botão Salvar quando o email for alterado", async () => {
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );

    fireEvent.change(inputEmail, {
      target: { value: "novoemail@gmail.com" },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    await waitFor(() => {
      expect(botaoSalvar).not.toBeDisabled();
    });
  });

  it("deve manter o botão Salvar desabilitado quando o email não for alterado", async () => {
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );

    // Alterar para valor diferente e voltar para o original
    fireEvent.change(inputEmail, {
      target: { value: "outroemail@gmail.com" },
    });

    fireEvent.change(inputEmail, {
      target: { value: email.email },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
    });
  });

  it("deve desabilitar o botão Salvar quando houver erro de validação", async () => {
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );

    // Inserir email inválido
    fireEvent.change(inputEmail, {
      target: { value: "email-invalido" },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
    });
  });

  it("deve fechar o modal ao clicar no botão Cancelar", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve fechar o modal ao clicar no botão X (close)", async () => {
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve realizar a edição com sucesso ao clicar em Salvar", async () => {
    mock.onPatch(`/emails-terceirizadas-modulos/${email.uuid}/`).reply(200, {});

    // Alterar o email para habilitar o botão Salvar
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    fireEvent.change(inputEmail, {
      target: { value: "novoemail@gmail.com" },
    });

    // Aguardar o botão ficar habilitado
    await waitFor(() => {
      const botaoSalvar = screen.getByText("Salvar").closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
      expect(buscarTerceirizadas).toHaveBeenCalledWith(1, email.modulo);
    });
  });

  it("deve exibir mensagem de erro quando email já existe", async () => {
    mock.onPatch(`/emails-terceirizadas-modulos/${email.uuid}/`).reply(400, {
      email: ["E-mail já existe para esta empresa"],
    });

    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    fireEvent.change(inputEmail, {
      target: { value: "email_existente@gmail.com" },
    });

    await waitFor(() => {
      const botaoSalvar = screen.getByText("Salvar").closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
      expect(
        screen.getByText("E-mail já cadastrado para esta empresa"),
      ).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro específica do servidor", async () => {
    mock.onPatch(`/emails-terceirizadas-modulos/${email.uuid}/`).reply(400, {
      email: ["Formato de email inválido"],
    });

    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    fireEvent.change(inputEmail, {
      target: { value: "email_existente@gmail.com" },
    });

    await waitFor(() => {
      const botaoSalvar = screen.getByText("Salvar").closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
      expect(screen.getByText("Formato de email inválido")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de erro genérica quando não houver erro específico", async () => {
    mock.onPatch(`/emails-terceirizadas-modulos/${email.uuid}/`).reply(400, {
      detail: "Erro desconhecido",
    });

    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    fireEvent.change(inputEmail, {
      target: { value: "novoemail@gmail.com" },
    });

    await waitFor(() => {
      const botaoSalvar = screen.getByText("Salvar").closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve testar diferentes status de erro (500 Internal Server Error)", async () => {
    mock.onPatch(`/emails-terceirizadas-modulos/${email.uuid}/`).reply(500, {});

    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );
    fireEvent.change(inputEmail, {
      target: { value: "novoemail@gmail.com" },
    });

    await waitFor(() => {
      const botaoSalvar = screen.getByText("Salvar").closest("button");
      expect(botaoSalvar).not.toBeDisabled();
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve testar validação de campo obrigatório", async () => {
    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail de contato",
    );

    // Limpar o campo
    fireEvent.change(inputEmail, {
      target: { value: "" },
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");

    await waitFor(() => {
      expect(botaoSalvar).toBeDisabled();
    });
  });
});
