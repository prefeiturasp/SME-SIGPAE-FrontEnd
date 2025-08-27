import "@testing-library/jest-dom";
import { act, render, cleanup } from "@testing-library/react";
import React from "react";
import { ModalConfirmarExclusao } from "src/components/Shareable/Calendario/componentes/ModalConfirmarExclusao/index.jsx";
import { MemoryRouter } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, style, className, type, disabled }) => (
    <button
      onClick={onClick}
      data-style={style}
      data-type={type}
      className={className}
      disabled={disabled}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/helpers/utilities", () => ({
  getDDMMYYYfromDate: (date) => date.toLocaleDateString("pt-BR"),
  getError: (data) => data?.message || "Erro",
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

describe("Teste <ModalConfirmarExclusao>", () => {
  const mockEvent = {
    uuid: "12345",
    title: "Unidade Teste",
    start: new Date(2023, 5, 15),
  };

  const deletaObjetoSucesso = jest.fn().mockResolvedValue({
    status: HTTP_STATUS.NO_CONTENT,
  });

  const deletaObjetoFalha = jest.fn().mockResolvedValue({
    status: HTTP_STATUS.BAD_REQUEST,
    data: { message: "Erro ao excluir" },
  });

  const defaultProps = {
    event: mockEvent,
    showModal: true,
    closeModal: jest.fn(),
    getObjetosAsync: jest.fn(),
    nomeObjetoNoCalendario: "Sobremesa",
    deleteObjetoAsync: deletaObjetoSucesso,
  };

  const renderModalConfirmarExclusao = (props = {}) => {
    return render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ModalConfirmarExclusao {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("", async () => {
    await act(async () => {
      renderModalConfirmarExclusao(deletaObjetoFalha);
    });
  });
});
