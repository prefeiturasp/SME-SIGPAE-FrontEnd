import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ModalCadastrarItem from "../../ModalCadastrarItem";
import {
  getTiposItems,
  cadastrarItem,
  atualizarItem,
} from "src/services/produto.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";

jest.mock("src/services/produto.service", () => ({
  getTiposItems: jest.fn(),
  cadastrarItem: jest.fn(),
  atualizarItem: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  usuarioEhEmpresaTerceirizada: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/Select", () => ({
  Select: ({ input = {}, options = [] }) => (
    <select
      data-testid="select-tipo"
      value={input.value || ""}
      onChange={(e) => input.onChange(e.target.value)}
    >
      {(options || []).filter(Boolean).map((o) => (
        <option key={o.uuid} value={o.uuid}>
          {o.nome}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => (props) => (
  <input data-testid="input-nome" {...props.input} />
));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, type, disabled, className }) => (
    <button
      data-testid={`botao-${texto}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {texto}
    </button>
  ),
}));

describe("ModalCadastrarItem Component", () => {
  const mockTipos = {
    data: [
      { tipo: "MARCA", tipo_display: "Marca" },
      { tipo: "FABRICANTE", tipo_display: "Fabricante" },
      { tipo: "CATEGORIA", tipo_display: "Categoria" },
    ],
  };

  const defaultProps = {
    showModal: true,
    closeModal: jest.fn(),
    changePage: jest.fn(),
    item: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioEhEmpresaTerceirizada.mockReturnValue(false);
    getTiposItems.mockResolvedValue(mockTipos);
  });

  it("renderiza título correto para cadastro", async () => {
    render(<ModalCadastrarItem {...defaultProps} />);

    expect(screen.getByText("Cadastrar Item")).toBeInTheDocument();
  });

  it("renderiza título correto para edição", async () => {
    render(
      <ModalCadastrarItem
        {...defaultProps}
        item={{ uuid: "1", nome: "TESTE", tipo: "MARCA" }}
      />,
    );
    expect(screen.getByText("Editar Item")).toBeInTheDocument();
  });

  it("carrega tipos ao montar e popula o select", async () => {
    render(<ModalCadastrarItem {...defaultProps} />);

    await waitFor(() => {
      expect(getTiposItems).toHaveBeenCalled();
    });

    const select = screen.getByTestId("select-tipo");
    expect(select.querySelectorAll("option").length).toBe(4);
  });

  it("filtra tipos quando usuário é empresa terceirizada", async () => {
    usuarioEhEmpresaTerceirizada.mockReturnValue(true);
    render(<ModalCadastrarItem {...defaultProps} />);

    await waitFor(() => {
      expect(getTiposItems).toHaveBeenCalled();
    });

    const select = screen.getByTestId("select-tipo");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );

    expect(options).toContain("Marca");
    expect(options).toContain("Fabricante");
    expect(options).not.toContain("Categoria");
  });

  it("envia dados para cadastrarItem quando item não é passado", async () => {
    cadastrarItem.mockResolvedValue({});

    render(<ModalCadastrarItem {...defaultProps} />);

    await waitFor(() => screen.getByTestId("select-tipo"));

    fireEvent.change(screen.getByTestId("select-tipo"), {
      target: { value: "MARCA" },
    });
    fireEvent.change(screen.getByTestId("input-nome"), {
      target: { value: "Novo Item" },
    });

    fireEvent.click(screen.getByTestId("botao-Salvar"));

    await waitFor(() =>
      expect(cadastrarItem).toHaveBeenCalledWith({
        nome: "Novo Item",
        tipo: "MARCA",
      }),
    );

    expect(toastSuccess).toHaveBeenCalledWith("Cadastro realizado com sucesso");
    expect(defaultProps.closeModal).toHaveBeenCalled();
    expect(defaultProps.changePage).toHaveBeenCalled();
  });

  it("envia dados para atualizarItem quando item é passado", async () => {
    atualizarItem.mockResolvedValue({});
    const item = { uuid: "ABC123", nome: "Velho", tipo: "MARCA" };

    render(<ModalCadastrarItem {...defaultProps} item={item} />);

    await waitFor(() => screen.getByTestId("select-tipo"));

    fireEvent.change(screen.getByTestId("input-nome"), {
      target: { value: "Atualizado" },
    });
    fireEvent.click(screen.getByTestId("botao-Salvar"));

    await waitFor(() =>
      expect(atualizarItem).toHaveBeenCalledWith(
        { nome: "Atualizado", tipo: "MARCA" },
        "ABC123",
      ),
    );

    expect(toastSuccess).toHaveBeenCalledWith(
      "Cadastro atualizado com sucesso",
    );
  });

  it("mostra toastError quando cadastro falha", async () => {
    cadastrarItem.mockRejectedValue({
      response: { data: ["Erro ao cadastrar"] },
    });

    render(<ModalCadastrarItem {...defaultProps} />);

    await waitFor(() => screen.getByTestId("select-tipo"));

    fireEvent.change(screen.getByTestId("select-tipo"), {
      target: { value: "MARCA" },
    });
    fireEvent.change(screen.getByTestId("input-nome"), {
      target: { value: "Teste" },
    });

    fireEvent.click(screen.getByTestId("botao-Salvar"));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Erro ao cadastrar"),
    );
  });

  it("botão cancelar chama closeModal", async () => {
    render(<ModalCadastrarItem {...defaultProps} />);

    fireEvent.click(screen.getByTestId("botao-Cancelar"));

    expect(defaultProps.closeModal).toHaveBeenCalled();
  });
});
