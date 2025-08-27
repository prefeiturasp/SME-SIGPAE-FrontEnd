import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import React from "react";
import { ModalEditar } from "src/components/Shareable/Calendario/componentes/ModalEditar/index.jsx";
import { MemoryRouter } from "react-router-dom";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, style, className, type }) => (
    <button
      onClick={onClick}
      data-style={style}
      data-type={type}
      className={className}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/helpers/utilities", () => ({
  getDDMMYYYfromDate: (date) => date.toLocaleDateString("pt-BR"),
}));

describe("Teste <ModalEditar>", () => {
  const mockEvent = {
    title: "Unidade Teste",
    editais_numeros_virgula: "EDITAL 001, EDITAL 002",
    start: new Date(2023, 5, 15),
    criado_por: { nome: "Sergio" },
    criado_em: "15/06/2023 10:00",
  };

  const defaultProps = {
    event: mockEvent,
    showModal: true,
    closeModal: jest.fn(),
    setShowModalConfirmarExclusao: jest.fn(),
    nomeObjetoNoCalendario: "Sobremesa",
    nomeObjetoNoCalendarioMinusculo: "sobremesa",
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalEditar {...defaultProps} />
        </MemoryRouter>
      );
    });
  });
});
