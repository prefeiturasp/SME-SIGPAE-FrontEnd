import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetPeriodoEscolar } from "src/mocks/services/dietaEspecial.service/mockGetPeriodoEscolar";
import { EditarDiasLetivosPage } from "src/pages/Cadastros/EditarDiasLetivosSIGPAEPage";
import mock from "src/services/_mock";

describe("Teste Erro API - Unidades Educacionais", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    mock.onGet("/periodos-escolares/").reply(200, mockGetPeriodoEscolar);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade: 0 });
    mock
      .onPost("/escolas-simplissima-com-eol/escolas-com-cod-eol/")
      .reply(400, {});

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
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
            <EditarDiasLetivosPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Erro ao carregar unidades educacionais", async () => {
    const selecionarOpcao = async (dataTestId, optionText) => {
      const selectWrapper = screen.getByTestId(dataTestId);
      const combobox = within(selectWrapper).getByRole("combobox");
      fireEvent.mouseDown(combobox);
      const option = screen.getByText(optionText);
      fireEvent.click(option);
    };

    await selecionarOpcao("select-lotes", "SA - 1");

    const origSetTimeout = global.setTimeout;
    jest.spyOn(global, "setTimeout").mockImplementation((cb, ms) => {
      if (ms === 3000) {
        cb();
        return 1;
      }
      return origSetTimeout(cb, ms);
    });

    await selecionarOpcao("select-tipos-unidades", "CCI/CIPS");

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar unidades educacionais"),
      ).toBeInTheDocument();
    });

    global.setTimeout.mockRestore();
  });
});
