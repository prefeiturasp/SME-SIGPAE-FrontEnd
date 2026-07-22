import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FluxoDeStatus } from "../index";
import {
  existeAlgumStatusFimDeFluxo,
  tipoDeStatusClasse,
  formatarLogs,
} from "../helper";
import { deepCopy } from "../../../../helpers/utilities";

jest.mock("../helper", () => ({
  existeAlgumStatusFimDeFluxo: jest.fn(),
  tipoDeStatusClasse: jest.fn(),
  formatarLogs: jest.fn(),
}));

jest.mock("../../../../helpers/utilities", () => ({
  deepCopy: jest.fn(),
}));

const listaDeStatusMock = [
  {
    status_evento_explicacao: "Solicitação Realizada",
    criado_em: "01/07/2026 10:00",
    classe: "active",
    usuario: {
      tipo_usuario: "terceirizada",
      cpf: "12345678900",
      nome: "Usuário Terceirizada",
    },
  },
  {
    status_evento_explicacao: "Correção solicitada",
    criado_em: "02/07/2026 11:00",
    classe: "pending",
    usuario: {
      tipo_usuario: "codae",
      registro_funcional: "1234567",
      nome: "Servidor CODAE",
    },
  },
];

const fluxoMock = [
  {
    titulo: "Solicitação Realizada",
    status_evento_explicacao: "Solicitação Realizada",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "Correção solicitada",
    status_evento_explicacao: "Correção solicitada",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "Finalizado",
    status_evento_explicacao: "Finalizado",
    criado_em: "",
    usuario: null,
  },
];

describe("FluxoDeStatus", () => {
  let scrollByMock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    scrollByMock = jest.fn();

    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => 800,
    });

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 400,
    });

    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollByMock,
    });

    deepCopy.mockImplementation((valor) => JSON.parse(JSON.stringify(valor)));

    formatarLogs.mockImplementation((logs) => logs);
    existeAlgumStatusFimDeFluxo.mockReturnValue(true);

    tipoDeStatusClasse.mockImplementation(
      (status) => status.classe || "pending",
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renderiza as novas setas e movimenta o fluxo quando existe overflow", async () => {
    const { container } = render(
      <FluxoDeStatus
        listaDeStatus={listaDeStatusMock}
        fluxo={fluxoMock}
        exibirSetasNavegacao
      />,
    );

    const setaEsquerda = await screen.findByRole("button", {
      name: "Visualizar status anteriores",
    });

    const setaDireita = screen.getByRole("button", {
      name: "Visualizar próximos status",
    });

    expect(container.querySelector(".fluxo-status-wrapper")).toHaveClass(
      "fluxo-status-wrapper-com-setas",
    );

    expect(setaEsquerda.querySelector(".fa-arrow-left")).toBeInTheDocument();

    expect(setaDireita.querySelector(".fa-arrow-right")).toBeInTheDocument();

    fireEvent.click(setaEsquerda);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -300,
      behavior: "smooth",
    });

    fireEvent.click(setaDireita);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: 300,
      behavior: "smooth",
    });
  });

  it("mantém as setas antigas quando o novo formato não é solicitado", async () => {
    const { container } = render(
      <FluxoDeStatus listaDeStatus={listaDeStatusMock} fluxo={fluxoMock} />,
    );

    await waitFor(() => {
      expect(container.querySelector(".fa-chevron-left")).toBeInTheDocument();

      expect(container.querySelector(".fa-chevron-right")).toBeInTheDocument();
    });

    expect(container.querySelector(".fluxo-status-wrapper")).not.toHaveClass(
      "fluxo-status-wrapper-com-setas",
    );

    fireEvent.click(container.querySelector(".fa-chevron-left"));

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -300,
      behavior: "smooth",
    });

    fireEvent.click(container.querySelector(".fa-chevron-right"));

    expect(scrollByMock).toHaveBeenCalledWith({
      left: 300,
      behavior: "smooth",
    });
  });
});
