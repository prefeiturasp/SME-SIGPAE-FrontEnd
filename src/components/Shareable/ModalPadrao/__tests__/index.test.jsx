import HTTP_STATUS from "http-status-codes";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalPadrao } from "../index";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/CKEditorField", () => (props) => (
  <textarea
    data-testid="justificativa"
    value={props.input.value || ""}
    onChange={(e) => props.input.onChange(e.target.value)}
  />
));

jest.mock("src/components/Shareable/AutoCompleteField", () => (props) => (
  <input
    data-testid="nome_terceirizada"
    value={props.input.value || ""}
    onChange={(e) => props.input.onChange(e.target.value)}
  />
));

describe("Testes de comportamentos - ModalPadrao", () => {
  const closeModal = jest.fn();
  const loadSolicitacao = jest.fn();
  const endpoint = jest.fn();

  const defaultProps = {
    showModal: true,
    closeModal,
    endpoint,
    uuid: "123",
    modalTitle: "Título do Modal",
    labelJustificativa: "Justificativa",
    textAreaPlaceholder: "Digite aqui",
    toastSuccessMessage: "Operação realizada com sucesso.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props = {}) =>
    render(
      <>
        <MemoryRouter>
          <ModalPadrao {...defaultProps} {...props} />
        </MemoryRouter>
        <ToastContainer />
      </>,
    );

  it("deve renderizar o modal", () => {
    setup();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Título do Modal")).toBeInTheDocument();
  });

  it("não deve renderizar quando showModal = false", () => {
    setup({ showModal: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em Cancelar", () => {
    setup();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(closeModal).toHaveBeenCalled();
  });

  it("deve fechar o modal ao clicar no botão de fechar do header", () => {
    setup();

    fireEvent.click(screen.getByLabelText(/close/i));

    expect(closeModal).toHaveBeenCalled();
  });

  it("deve enviar justificativa com sucesso", async () => {
    endpoint.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    setup();

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: { value: "Minha justificativa" },
    });

    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(endpoint).toHaveBeenCalledWith("123", "Minha justificativa");
      expect(closeModal).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("deve chamar loadSolicitacao quando informado", async () => {
    endpoint.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    setup({
      loadSolicitacao,
    });

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: { value: "Justificativa" },
    });

    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(endpoint).toHaveBeenCalledWith("123", "Justificativa");
      expect(loadSolicitacao).toHaveBeenCalledWith("123");
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("deve enviar uuid da terceirizada quando eAnalise = true", async () => {
    endpoint.mockResolvedValue({
      status: HTTP_STATUS.OK,
    });

    setup({
      eAnalise: true,
      terceirizadas: [
        {
          uuid: "empresa-1",
          nome_fantasia: "Empresa Teste",
        },
      ],
    });

    fireEvent.change(screen.getByTestId("nome_terceirizada"), {
      target: { value: "Empresa Teste" },
    });

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: { value: "Justificativa" },
    });

    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(endpoint).toHaveBeenCalledWith(
        "123",
        "Justificativa",
        "empresa-1",
      );
    });
  });

  it("deve renderizar número do protocolo", () => {
    setup({
      protocoloAnalise: "123456",
      tipoModal: "analise",
    });

    expect(screen.getByText(/Número Protocolo: 123456/i)).toBeInTheDocument();
  });

  it("deve renderizar dados do produto ao cancelar análise sensorial", () => {
    setup({
      cancelaAnaliseSensorial: {
        produto: {
          nome: "Arroz",
          marca: {
            nome: "Marca Teste",
          },
          fabricante: {
            nome: "Fabricante Teste",
          },
        },
      },
    });

    expect(screen.getByDisplayValue("Arroz")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Marca Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fabricante Teste")).toBeInTheDocument();
  });
});
