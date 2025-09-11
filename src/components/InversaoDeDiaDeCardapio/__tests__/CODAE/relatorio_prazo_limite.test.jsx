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
import { mockInversaoDiaCardapioQuestionadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoQuestionada";
import { mockInversaoDiaCardapioValidadaLimiteCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoValidadaLimite";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ data }) => <textarea data-testid="mock-ckeditor" value={data} />,
}));

describe("Teste Relatório Inversão CEMEI - Visão CODAE - Prazo Regular", () => {
  process.env.IS_TEST = true;

  const uuidInversao = mockInversaoDiaCardapioValidadaLimiteCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioValidadaLimiteCEMEI);
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
        `Inversão de dia de Cardápio - Solicitação # ${mockInversaoDiaCardapioValidadaLimiteCEMEI.id_externo}`
      )
    ).toBeInTheDocument();
  });

  it("questiona a solicitação", async () => {
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/codae-questiona-pedido/`
      )
      .reply(200, mockInversaoDiaCardapioQuestionadaCEMEI);

    const botaoQuestionar = screen.getByText("Questionar").closest("button");
    fireEvent.click(botaoQuestionar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "É possível atender a solicitação com todos os itens previstos no contrato?"
        )
      ).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioQuestionadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento enviado com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Negar")).not.toBeInTheDocument();
    expect(screen.queryByText("Questionar")).not.toBeInTheDocument();

    expect(screen.getByText("Questionamento pela CODAE")).toBeInTheDocument();
    expect(screen.getByText("09/09/2025 17:29:22 - CODAE")).toBeInTheDocument();
    expect(screen.getByText("Observação da CODAE:")).toBeInTheDocument();
  });
});
