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
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockInversaoDiaCardapioAValidarCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoAValidar";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";
import { mockInversaoDiaCardapioCanceladaCEMEI } from "../../../../mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoCancelada";

describe("Teste Relatório Inversão de dia de Cardápio - Escola CEMEI", () => {
  const uuidInversao = mockInversaoDiaCardapioAValidarCEMEI.uuid;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .reply(200, mockInversaoDiaCardapioAValidarCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    const search = `?uuid=${uuidInversao}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

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
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosInversaoDiaCardapio.RelatorioEscola />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título `Inversão de dia de Cardápio`", () => {
    expect(
      screen.getByText(
        `Inversão de dia de Cardápio - Solicitação # ${mockInversaoDiaCardapioAValidarCEMEI.id_externo}`
      )
    ).toBeInTheDocument();
  });

  it("Renderiza dados da inversão", () => {
    expect(
      screen.getByText(`Solicitação no prazo regular`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Tipos de Alimentação para inversão:`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Lanche`)).toBeInTheDocument();

    expect(screen.getByText(`Referência:`)).toBeInTheDocument();
    expect(screen.getByText(`24/09/2025`)).toBeInTheDocument();
    expect(screen.getByText(`30/09/2025`)).toBeInTheDocument();

    expect(screen.getByText(`Alunos`)).toBeInTheDocument();
    expect(screen.getByText(`CEI`)).toBeInTheDocument();
    expect(screen.getByText(`EMEI`)).toBeInTheDocument();
  });

  it("cancela a solicitação", async () => {
    const botaoCancelar = screen.getByText("Cancelar").closest("button");
    fireEvent.click(botaoCancelar);

    await waitFor(() => {
      expect(
        screen.getByText("Cancelamento de Solicitação")
      ).toBeInTheDocument();
    });

    const textareaDiv = screen.getByTestId("textarea-div");
    const textareaElement = textareaDiv.querySelector("textarea");
    fireEvent.change(textareaElement, {
      target: { value: "quero cancelar a solicitação." },
    });

    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/escola-cancela-pedido-48h-antes/`
      )
      .reply(200, mockInversaoDiaCardapioCanceladaCEMEI);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .reply(200, mockInversaoDiaCardapioCanceladaCEMEI);

    await waitFor(() => {
      expect(
        screen.queryByText("Cancelamento de Solicitação")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();

    expect(screen.getByText("Escola cancelou")).toBeInTheDocument();
    expect(screen.getByText("Histórico de justificativas")).toBeInTheDocument();
    expect(
      screen.getByText("08/09/2025 18:10:36 - ESCOLA CANCELOU")
    ).toBeInTheDocument();
  });
});
