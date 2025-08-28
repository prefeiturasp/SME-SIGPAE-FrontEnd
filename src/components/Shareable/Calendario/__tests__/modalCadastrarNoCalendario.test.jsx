import "@testing-library/jest-dom";
import { act, render, screen, cleanup } from "@testing-library/react";
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

  it("", async () => {
    await act(async () => {
      renderModalCadastrarNoCalendario();
    });
    preview.debug();
    criaObjetoSucesso();
    criaObjetoFalha();
  });
});
