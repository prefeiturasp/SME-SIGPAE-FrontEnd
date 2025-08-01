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
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockGetVinculosTipoAlimentacaoPorEscolaCEMEI } from "src/mocks/services/cadastroTipoAlimentacao.service/CEMEI/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockRascunhosInversaoDiaCardapioCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/rascunhos";
import { InversaoDeDiaDeCardapioPage } from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

describe("Teste Formulário Inversão de dia de Cardápio - Escola CEMEI", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/dias-uteis/").reply(200, mockDiasUteis);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCEMEI);
    mock
      .onGet("/inversoes-dia-cardapio/minhas-solicitacoes/")
      .reply(200, mockRascunhosInversaoDiaCardapioCEMEI);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

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
            <InversaoDeDiaDeCardapioPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título `Inversão de dia de Cardápio`", () => {
    expect(screen.queryAllByText("Inversão de dia de Cardápio")).toHaveLength(
      2
    );
  });

  it("Carrega rascunho e envia", async () => {
    const botaoCarregarRascunho = screen.getByTestId("botao-carregar-rascunho");
    await act(async () => {
      fireEvent.click(botaoCarregarRascunho);
    });

    expect(screen.getByText("Solicitação # 2E398")).toBeInTheDocument();
    expect(screen.getByText("Atualizar")).toBeInTheDocument();

    mock
      .onPut(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/`
      )
      .reply(200, {
        uuid: mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid,
      });
    mock
      .onPatch(
        `/inversoes-dia-cardapio/${mockRascunhosInversaoDiaCardapioCEMEI.results[0].uuid}/inicio-pedido/`
      )
      .reply(200, {});

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    fireEvent.click(botaoEnviar);

    await waitFor(async () => {
      expect(
        screen.getByText("Inversão de dia de Cardápio enviada com sucesso!")
      ).toBeInTheDocument();
    });
  });
});
