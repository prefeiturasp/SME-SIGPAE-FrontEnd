import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import { ModalCadastrarNoCalendario } from "src/components/Shareable/Calendario/componentes/ModalCadastrarNoCalendario/index.jsx";

import preview from "jest-preview";
// Mocks
jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, type, disabled, className }) => (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/helpers/utilities", () => ({
  getDDMMYYYfromDate: (date) => date.toLocaleDateString("pt-BR"),
  getYYYYMMDDfromDate: (date) => date.toISOString().split("T")[0],
  getError: (data) => data?.message || "Erro",
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/components/Shareable/MultiSelect", () => ({
  MultiSelect: ({ selected = [], onSelectedChange, options = [], input }) => {
    const name = input?.name || "no-name";
    return (
      <div>
        <label htmlFor={name}>{name}</label>
        <select
          data-testid={`multiselect-${name}`}
          multiple
          value={selected}
          onChange={(e) =>
            onSelectedChange(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
}));

describe("Teste componete ModalCadastrarNoCalendario", () => {
  const mockEvent = {
    uuid: "123",
    start: new Date(2023, 5, 15),
  };

  const criaObjetoSucesso = jest.fn().mockResolvedValue({
    status: HTTP_STATUS.CREATED,
  });

  const criaObjetoFalha = jest.fn().mockResolvedValue({
    status: HTTP_STATUS.BAD_REQUEST,
    data: { message: "Erro ao salvar" },
  });

  const defaultProps = {
    tiposUnidades: [{ uuid: "1234", iniciais: "EMEF" }],
    editais: [{ uuid: "6789", numero: "Edital 001" }],
    event: mockEvent,
    showModal: true,
    closeModal: jest.fn(),
    getObjetosAsync: jest.fn(),
    setObjetoAsync: jest.fn(),
    objetos: [],
    nomeObjetoNoCalendario: "Sobremesa",
    nomeObjetoNoCalendarioMinusculo: "sobremesa",
  };

  const renderModalCadastrarNoCalendario = (props = {}) => {
    return render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ModalCadastrarNoCalendario {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("deve exibir título e informações corretas", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario();
    });
    expect(screen.getByText(/Cadastrar dia de Sobremesa/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Cadastro de sobremesa para o dia/)
    ).toBeInTheDocument();
    expect(screen.getByText("15/06/2023")).toBeInTheDocument();
    expect(screen.getByText(/EMEF/i)).toBeInTheDocument();
    expect(screen.getByText(/Edital 001/i)).toBeInTheDocument();
  });

  it("deve chamar closeModal ao clicar em Cancelar", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario();
    });

    const cancelar = screen.getByText("Cancelar");
    fireEvent.click(cancelar);

    expect(defaultProps.closeModal).toHaveBeenCalled();
  });

  it("deve submeter o formulário com sucesso (novo cadastro)", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario({ setObjetoAsync: criaObjetoSucesso });
    });

    const editalSelect = screen.getByTestId(
      "multiselect-cadastros_calendario[0].editais"
    );
    fireEvent.change(editalSelect, { target: { value: "6789" } });
    const unidadeSelect = screen.getByTestId(
      "multiselect-cadastros_calendario[0].tipo_unidades"
    );
    fireEvent.change(unidadeSelect, { target: { value: "1234" } });

    const cadastrar = screen.getByText("Cadastrar");
    await act(async () => {
      fireEvent.click(cadastrar);
    });

    const { toastSuccess } = require("src/components/Shareable/Toast/dialogs");
    preview.debug();
    expect(toastSuccess).toHaveBeenCalledWith(
      "Dia de Sobremesa criado com sucesso"
    );
    expect(defaultProps.closeModal).toHaveBeenCalled();
    expect(defaultProps.getObjetosAsync).toHaveBeenCalled();
  });

  it("deve mostrar erro ao falhar no cadastro", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario({ setObjetoAsync: criaObjetoFalha });
    });

    const editalSelect = screen.getByTestId(
      "multiselect-cadastros_calendario[0].editais"
    );
    fireEvent.change(editalSelect, { target: { value: "6789" } });
    const unidadeSelect = screen.getByTestId(
      "multiselect-cadastros_calendario[0].tipo_unidades"
    );
    fireEvent.change(unidadeSelect, { target: { value: "1234" } });

    const cadastrar = screen.getByText("Cadastrar");
    await act(async () => {
      fireEvent.click(cadastrar);
    });

    const { toastError } = require("src/components/Shareable/Toast/dialogs");
    expect(toastError).toHaveBeenCalledWith("Erro ao salvar");
    expect(defaultProps.closeModal).not.toHaveBeenCalled();
    expect(defaultProps.getObjetosAsync).not.toHaveBeenCalled();
  });

  it("deve adicionar e remover cadastros", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario();
    });

    const adicionar = screen.getByText("Adicionar");
    await act(async () => {
      fireEvent.click(adicionar);
    });

    const selects = screen.getAllByTestId(
      /multiselect-cadastros_calendario\[\d+\].editais/
    );
    expect(selects.length).toBe(2);

    const remover = screen.getAllByText("Remover")[0];
    await act(async () => {
      fireEvent.click(remover);
    });
    const selectsAposRemover = screen.getAllByTestId(
      /multiselect-cadastros_calendario\[\d+\].editais/
    );
    expect(selectsAposRemover.length).toBe(1);
  });

  it("", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario();
    });
    preview.debug();
    criaObjetoSucesso();
    criaObjetoFalha();
  });
});
