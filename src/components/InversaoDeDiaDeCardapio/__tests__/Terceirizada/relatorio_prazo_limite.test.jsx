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
import { mockInversaoDiaCardapioQuestionadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoQuestionada";
import { mockInversaoDiaCardapioRespondidaSimCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoRespondidaSim";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";
import { mockInversaoDiaCardapioRespondidaNaoCEMEI } from "../../../../mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoRespondidaNao";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ data }) => <textarea data-testid="mock-ckeditor" value={data} />,
}));

describe("Teste Relatório Inversão CEMEI - Visão Terceirizada - Prazo Limite", () => {
  process.env.IS_TEST = true;

  const uuidInversao = mockInversaoDiaCardapioQuestionadaCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioQuestionadaCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    const search = `?uuid=${uuidInversao}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
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
        `Inversão de dia de Cardápio - Solicitação # ${mockInversaoDiaCardapioQuestionadaCEMEI.id_externo}`
      )
    ).toBeInTheDocument();
  });

  it("aceita a solicitação", async () => {
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/terceirizada-responde-questionamento/`
      )
      .reply(200, mockInversaoDiaCardapioRespondidaSimCEMEI);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(screen.getByText("Resposta: Sim")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    expect(botaoEnviar).toBeDisabled();

    const textarea = screen.getByTestId("textarea-observacao-questionamento");
    fireEvent.change(textarea, {
      target: { value: "Aceito." },
    });

    expect(botaoEnviar).not.toBeDisabled();

    fireEvent.click(botaoEnviar);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioRespondidaSimCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento respondido com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não")).not.toBeInTheDocument();
    expect(screen.queryByText("Sim")).not.toBeInTheDocument();

    expect(
      screen.getByText("Observação da Terceirizada: Sim")
    ).toBeInTheDocument();
  });

  it("não aceita a solicitação", async () => {
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/terceirizada-responde-questionamento/`
      )
      .reply(200, mockInversaoDiaCardapioRespondidaNaoCEMEI);

    const botaoNao = screen.queryAllByText("Não")[1].closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(screen.getByText("Resposta: Não")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    expect(botaoEnviar).toBeDisabled();

    const textarea = screen.getByTestId("textarea-observacao-questionamento");
    fireEvent.change(textarea, {
      target: { value: "Não aceito." },
    });

    expect(botaoEnviar).not.toBeDisabled();

    fireEvent.click(botaoEnviar);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioRespondidaNaoCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Questionamento respondido com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não")).not.toBeInTheDocument();
    expect(screen.queryByText("Sim")).not.toBeInTheDocument();

    expect(
      screen.getByText("Observação da Terceirizada: Não aceito.")
    ).toBeInTheDocument();
  });
});
