import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMotivosDRENaoValida } from "src/mocks/InclusaoAlimentacao/mockMotivosDRENaoValida";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import { mockInversaoDiaCardapioAutorizadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoAutorizada";
import { mockInversaoDiaCardapioConferidaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoConferida";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

describe("Teste Relatório Inversão CEMEI - Visão Terceirizada", () => {
  const uuidInversao = mockInversaoDiaCardapioAutorizadaCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioAutorizadaCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    const search = `?uuid=${uuidInversao}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosTerceirizada,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosInversaoDiaCardapio.RelatorioTerceirizada />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título `Inversão de dia de Cardápio`", () => {
    expect(
      screen.getByText(
        `Inversão de dia de Cardápio - Solicitação # ${mockInversaoDiaCardapioAutorizadaCEMEI.id_externo}`
      )
    ).toBeInTheDocument();
  });

  it("marca conferência", async () => {
    mock
      .onPatch(`/inversoes-dia-cardapio/${uuidInversao}/marcar-conferida/`)
      .reply(200, mockInversaoDiaCardapioConferidaCEMEI);

    const botaoMarcarConferencia = screen
      .getByText("Marcar Conferência")
      .closest("button");
    fireEvent.click(botaoMarcarConferencia);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deseja marcar essa solicitação como conferida? A ação não poderá ser desfeita."
        )
      ).toBeInTheDocument();
    });

    const botaoConfirmar = screen.getByText("Confirmar").closest("button");
    fireEvent.click(botaoConfirmar);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioConferidaCEMEI);

    await waitFor(() => {
      expect(screen.getByText("Solicitação Conferida")).toBeInTheDocument();
    });

    expect(screen.queryByText("Marcar Conferência")).not.toBeInTheDocument();
  });
});
