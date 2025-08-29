import "@testing-library/jest-dom";
import { render, screen, act, cleanup } from "@testing-library/react";
import React from "react";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { Calendario } from "src/components/Shareable/Calendario";
import HTTP_STATUS from "http-status-codes";

import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";

jest.mock("moment/dist/locale/pt-br", () => {});
jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
}));

describe("Integração Calendario", () => {
  const mockGetObjetos = jest.fn();
  const mockSetObjeto = jest.fn();
  const mockDeleteObjeto = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);

    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);

    mockGetObjetos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [
        {
          uuid: "evt-1",
          data: "29/07/2025",
          tipo_unidade: { iniciais: "ESC", uuid: "123" },
          edital_numero: "Edital 001",
          edital: "999",
          criado_por: "tester",
          criado_em: "2025-07-29",
          title: "Evento Teste",
        },
      ],
    });
    mockSetObjeto.mockResolvedValue({ status: HTTP_STATUS.CREATED });
    jest.useFakeTimers().setSystemTime(new Date("2025-07-01T12:00:00Z"));
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  const renderCalendario = () =>
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Calendario
          nomeObjeto="Sobremesa"
          nomeObjetoMinusculo="sobremesa"
          getObjetos={mockGetObjetos}
          setObjeto={mockSetObjeto}
          deleteObjeto={mockDeleteObjeto}
          podeEditar={true}
        />
      </MemoryRouter>
    );

  it("renderiza corretamente após carregar dados", async () => {
    await act(async () => {
      renderCalendario();
    });

    expect(
      screen.getByText((content) => content.includes("sobremesa"))
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/Para cadastrar um dia para sobremesa/i)
    ).toBeInTheDocument();

    expect(await screen.findByText(/julho 2025/i)).toBeInTheDocument();
  });
});
