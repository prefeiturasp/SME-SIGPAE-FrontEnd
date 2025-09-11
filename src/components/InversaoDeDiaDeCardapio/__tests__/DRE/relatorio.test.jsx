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
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockInversaoDiaCardapioAValidarCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoAValidar";
import { mockInversaoDiaCardapioNaoValidadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoNaoValidada";
import { mockInversaoDiaCardapioValidadaCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoValidada";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

describe("Teste Relatório Inversão de dia de Cardápio CEMEI - Visão DRE", () => {
  const uuidInversao = mockInversaoDiaCardapioAValidarCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioAValidarCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    const search = `?uuid=${uuidInversao}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatoriosInversaoDiaCardapio.RelatorioDRE />
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

  it("valida solicitação", async () => {
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/diretoria-regional-valida-pedido/`
      )
      .reply(200, mockInversaoDiaCardapioValidadaCEMEI);

    const botaoValidar = screen.getByText("Validar").closest("button");
    fireEvent.click(botaoValidar);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioValidadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Inversão de dia de Cardápio validada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
  });

  it("não valida solicitação", async () => {
    const botaoNaoValidar = screen.getByText("Não Validar").closest("button");
    fireEvent.click(botaoNaoValidar);

    await waitFor(() => {
      expect(
        screen.getByText("Deseja não validar solicitação?")
      ).toBeInTheDocument();
    });

    const uuidMotivoEmDesacordoComContrato =
      mockMotivosDRENaoValida.results.find(
        (motivo) => motivo.nome === "Em desacordo com o contrato"
      ).uuid;

    const selectMotivo = screen.getByTestId("select-motivo-cancelamento");
    const selectMotivoCancelamento = selectMotivo.querySelector("select");
    fireEvent.change(selectMotivoCancelamento, {
      target: { value: uuidMotivoEmDesacordoComContrato },
    });

    const textarea = screen.getByTestId("textarea-justificativa");
    fireEvent.change(textarea, {
      target: { value: "não valido." },
    });

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .replyOnce(200, mockInversaoDiaCardapioNaoValidadaCEMEI);

    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/diretoria-regional-nao-valida-pedido/`
      )
      .reply(200, mockInversaoDiaCardapioNaoValidadaCEMEI);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação não validada com sucesso!")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Não validar")).not.toBeInTheDocument();
    expect(screen.queryByText("Validar")).not.toBeInTheDocument();
  });

  it("erro ao validar solicitação", async () => {
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${uuidInversao}/diretoria-regional-valida-pedido/`
      )
      .reply(400, {});

    const botaoValidar = screen.getByText("Validar").closest("button");
    fireEvent.click(botaoValidar);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Houve um erro ao validar a Inversão de dia de Cardápio. Tente novamente mais tarde."
        )
      ).toBeInTheDocument();
    });
  });
});
