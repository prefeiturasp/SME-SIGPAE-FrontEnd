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
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockInversaoDiaCardapioAutorizadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoAutorizada";
import { mockInversaoDiaCardapioValidadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoValidada";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";
import { mockInversaoDiaCardapioNegadaCEMEI } from "../../../../mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoNegada";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ data }) => <textarea data-testid="mock-ckeditor" value={data} />,
}));

describe("Teste Relatório Inversão CEMEI - Visão CODAE - Prazo Regular", () => {
  process.env.IS_TEST = true;

  const uuidInversao = mockInversaoDiaCardapioValidadaCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioValidadaCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    const search = `?uuid=${uuidInversao}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosInversaoDiaCardapio.RelatorioCODAE />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título `Inversão de dia de Cardápio`", () => {
    expect(
      screen.getByText(
        `Inversão de dia de Cardápio - Solicitação # ${mockInversaoDiaCardapioValidadaCEMEI.id_externo}`
      )
    ).toBeInTheDocument();
  });

  it("autoriza a solicitação", async () => {
    mock
      .onPatch(`/inversoes-dia-cardapio/${uuidInversao}/codae-autoriza-pedido/`)
      .reply(200, mockInversaoDiaCardapioAutorizadaCEMEI);

    const botaoAutorizar = screen.getByText("Autorizar").closest("button");
    fireEvent.click(botaoAutorizar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja autorizar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("mock-ckeditor");
    fireEvent.change(textarea, {
      target: { value: "autorizado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioAutorizadaCEMEI);

    await waitFor(() => {
      expect(
        screen.queryByText("Deseja autorizar a solicitação?")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE autorizou")).toBeInTheDocument();
    expect(
      screen.getByText("09/09/2025 13:39:45 - Informações da CODAE")
    ).toBeInTheDocument();
  });

  it("nega a solicitação", async () => {
    mock
      .onPatch(`/inversoes-dia-cardapio/${uuidInversao}/codae-cancela-pedido/`)
      .reply(200, mockInversaoDiaCardapioNegadaCEMEI);

    const botaoNegar = screen.getByText("Negar").closest("button");
    fireEvent.click(botaoNegar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja negar a solicitação?")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("mock-ckeditor");
    fireEvent.change(textarea, {
      target: { value: "negado." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    expect(botaoSim).not.toBeDisabled();
    fireEvent.click(botaoSim);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioNegadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação negada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Autorizar")).not.toBeInTheDocument();

    expect(screen.getByText("CODAE negou")).toBeInTheDocument();
  });
});
