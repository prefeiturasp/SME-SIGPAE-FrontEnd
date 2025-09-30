import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";
import React from "react";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { escolaInativaDietaEspecial } from "src/services/dietaEspecial.service";
import CancelarDietaModal from "../index";

jest.mock("src/services/dietaEspecial.service");
jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));
jest.mock("src/components/Shareable/CKEditorField", () => (props: any) => {
  return (
    <textarea
      data-testid="input-justificativa"
      onChange={(e) => props.input.onChange(e.target.value)}
    />
  );
});

jest.mock(
  "src/components/Shareable/Input/InputFile/ManagedField",
  () => (props: any) => {
    return (
      <input
        type="file"
        data-testid="input-anexo"
        onChange={(e) => props.input.onChange(e.target.files)}
      />
    );
  }
);

jest.mock("src/helpers/utilities", () => ({
  ...jest.requireActual("src/helpers/utilities"),
  getError: jest.fn(() => "MOCKED_ERROR"),
}));

describe("CancelarDietaModal", () => {
  const dieta = { uuid: "123" };
  const setShowModal = jest.fn();
  const setFiltros = jest.fn();

  const renderModal = (props = {}) =>
    render(
      <CancelarDietaModal
        dieta={dieta}
        showModal={true}
        setShowModal={setShowModal}
        filtros={{}}
        setFiltros={setFiltros}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza modal com título e botões", () => {
    renderModal();
    expect(
      screen.getByText(/Deseja solicitar cancelamento/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
  });

  it("clica em 'Não' fecha o modal", () => {
    renderModal();
    fireEvent.click(screen.getByText("Não"));
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("ao submeter com sucesso chama toastSuccess e fecha modal", async () => {
    (escolaInativaDietaEspecial as jest.Mock).mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: {},
    });

    renderModal();

    fireEvent.change(screen.getByTestId("input-justificativa"), {
      target: { value: "Uma justificativa qualquer" },
    });
    fireEvent.change(screen.getByTestId("input-anexo"), {
      target: {
        files: [
          new File(["dummy"], "arquivo.pdf", { type: "application/pdf" }),
        ],
      },
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(escolaInativaDietaEspecial).toHaveBeenCalledWith(
        "123",
        expect.any(Object)
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Solicitação de cancelamento realizada com sucesso."
      );
      expect(setShowModal).toHaveBeenCalledWith(false);
      expect(setFiltros).toHaveBeenCalled();
    });
  });

  it("ao submeter com erro BAD_REQUEST mostra toastError", async () => {
    (escolaInativaDietaEspecial as jest.Mock).mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { erro: "dados inválidos" },
    });

    renderModal();
    fireEvent.change(screen.getByTestId("input-justificativa"), {
      target: { value: "Texto de erro" },
    });
    fireEvent.change(screen.getByTestId("input-anexo"), {
      target: {
        files: [new File(["abc"], "dummy.pdf", { type: "application/pdf" })],
      },
    });
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("MOCKED_ERROR");
    });
  });

  it("ao submeter com erro genérico mostra toastError", async () => {
    (escolaInativaDietaEspecial as jest.Mock).mockResolvedValue({
      status: 500,
      data: { erro: "falha" },
    });

    renderModal();
    fireEvent.change(screen.getByTestId("input-justificativa"), {
      target: { value: "Texto de erro" },
    });
    fireEvent.change(screen.getByTestId("input-anexo"), {
      target: {
        files: [new File(["abc"], "dummy.pdf", { type: "application/pdf" })],
      },
    });
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao solicitar dieta especial: MOCKED_ERROR"
      );
    });
  });
});
