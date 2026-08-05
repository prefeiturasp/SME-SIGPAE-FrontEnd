import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import { Calendario } from "src/components/Shareable/Calendario";
import HTTP_STATUS from "http-status-codes";

import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";

jest.mock("moment/dist/locale/pt-br", () => {});
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

    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, { results: [] });

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

  const renderCalendario = (extraProps = {}) =>
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
          {...extraProps}
        />
        <ToastContainer />
      </MemoryRouter>,
    );

  it("renderiza corretamente após carregar dados", async () => {
    renderCalendario();

    expect(
      await screen.findByText((content) => content.includes("sobremesa")),
    ).toBeInTheDocument();

    expect(
      await screen.findByText((content) =>
        content.includes("cadastrar um dia para"),
      ),
    ).toBeInTheDocument();

    expect(await screen.findByText(/julho 2025/i)).toBeInTheDocument();
  });

  it("exibe label azul com prefixo 'Sob. AF - ' quando tipo.nome === 'Sobremesa AF'", async () => {
    mockGetObjetos.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: [
        {
          uuid: "evt-1",
          data: "29/07/2025",
          tipo_unidade: { iniciais: "ESC", uuid: "123" },
          tipo: { nome: "Sobremesa AF" },
          edital_numero: "Edital 001",
          edital: "999",
          criado_por: "tester",
          criado_em: "2025-07-29",
        },
      ],
    });

    renderCalendario();

    const eventoTitulo = await screen.findByText("Sob. AF - ESC");
    expect(eventoTitulo).toBeInTheDocument();
    expect(eventoTitulo.closest(".rbc-event-sobremesa-af")).toBeInTheDocument();
  });

  it("exibe feriado com label laranja quando backend retorna feriados no mes", async () => {
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, {
        results: [{ feriado: "Independência do Brasil", dia: "29" }],
      });

    renderCalendario();

    const feriadoLabel = await screen.findByText("FERIADO");
    expect(feriadoLabel).toBeInTheDocument();
    expect(feriadoLabel.closest(".rbc-event-feriado")).toBeInTheDocument();
  });

  it("busca tipos de sobremesa doce quando isSobremesaDoce é true", async () => {
    mock.onGet("/medicao-inicial/tipos-sobremesa-doce/").reply(200, [
      { uuid: "tip-uuid-1", nome: "Sobremesa Doce" },
      { uuid: "tip-uuid-2", nome: "Sobremesa AF" },
    ]);

    renderCalendario({ isSobremesaDoce: true });

    expect(
      await screen.findByText((content) => content.includes("sobremesa")),
    ).toBeInTheDocument();
  });
});
