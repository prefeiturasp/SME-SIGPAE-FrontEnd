import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockGetFichaRecebimentoDetalhada } from "src/mocks/services/fichaRecebimento.service/mockGetFichaRecebimentoDetalhada";
import { mockCronogramaCadastroRecebimento } from "src/mocks/cronograma.service/mockGetCronogramaCadastroRecebimento";
import Detalhar from "../../../components/Detalhar";
import mock from "src/services/_mock";

describe("Detalhes da Ficha de Recebimento - Erro ao carregar dados do cronograma", () => {
  beforeEach(async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: `?uuid=${mockGetFichaRecebimentoDetalhada.uuid}`,
      },
      writable: true,
    });
  });

  const setup = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Detalhar />
          <ToastContainer />
        </MemoryRouter>
      );
    });
  };

  it("Recebe retorno de erro endpoint de dados do cronograma.", async () => {
    mock
      .onGet(`/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhada.uuid}/`)
      .reply(200, mockGetFichaRecebimentoDetalhada);
    mock
      .onGet(
        `/cronogramas/${mockGetFichaRecebimentoDetalhada.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`
      )
      .reply(400, {});

    await setup();

    expect(
      screen.getByText("Erro ao carregar dados do cronograma.")
    ).toBeInTheDocument();
  });

  it("Recebe retorno de erro endpoint de ficha detalhada.", async () => {
    mock
      .onGet(
        `/cronogramas/${mockGetFichaRecebimentoDetalhada.dados_cronograma.uuid}/dados-cronograma-ficha-recebimento/`
      )
      .reply(200, mockCronogramaCadastroRecebimento);
    mock
      .onGet(`/fichas-de-recebimento/${mockGetFichaRecebimentoDetalhada.uuid}/`)
      .reply(400, {});

    await setup();

    expect(
      screen.getByText("Erro ao carregar ficha de recebimento.")
    ).toBeInTheDocument();
  });
});
