import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockGetMotivoAlteracaoUE } from "src/mocks/services/dietaEspecial.service/mockGetMotivoAlteracaoUE";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockEscolaSimplissima } from "src/mocks/services/escola.service/CEMEI/mockEscolaSimplissima";
import { AlteracaoUEPage } from "src/pages/Escola/DietaEspecial/AlteracaoUEPage";
import { mockRelatorioGestaoDietasEspeciais } from "src/mocks/services/dietaEspecial.service/relatorioGestaoDietaEspecial";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import mock from "src/services/_mock";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      data-testid={placeholder}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));
jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea data-testid="ckeditor-mock" name="observacoes" required={false} />
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe("Teste de interface Solicitação de alteração de U.E da dieta especial", () => {
  let store;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock.onGet("/motivo-alteracao-ue/").reply(200, mockGetMotivoAlteracaoUE);
    mock.onGet("/dados-alunos-eol/").reply(200, mockGetMotivoAlteracaoUE);
    mock.onGet("/escolas-simplissima/").reply(200, mockEscolaSimplissima);
    mock
      .onGet("/solicitacoes-dieta-especial/")
      .reply(200, mockRelatorioGestaoDietasEspeciais);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    store = mockStore({
      form: { tema: "", tipo: null, data_inicial: null, data_final: null },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Provider store={store}>
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosEscolaCEMEI,
                setMeusDados: jest.fn(),
              }}
            >
              <AlteracaoUEPage />
              <ToastContainer />
            </MeusDadosContext.Provider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Solicitação de alteração de U.E da dieta especial`", () => {
    expect(
      screen.queryAllByText("Solicitação de alteração de U.E da dieta especial")
    ).toHaveLength(2);
  });

  const setCodigoEol = (id, valor) => {
    const codigoEOL = screen.getByTestId(id);
    fireEvent.change(codigoEOL, {
      target: { value: valor },
    });
  };

  it("Preenche código EOL do aluno, clicar em limpar e verifica valor em tela", async () => {
    setCodigoEol("codigo-eol-aluno", "4899926");

    const botaoLimpar = screen.getByTestId("botao-limpar");
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(screen.queryByText("4899926")).not.toBeInTheDocument();
    });
  });

  const setMotivo = async () => {
    const campoDre = screen.getByTestId("motivo-alteracao");
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: "bf20e71f-3c6d-486e-b92f-f17f321d378a" },
    });
  };

  const setData = async (placeholder, valor) => {
    const input = screen.getByTestId(placeholder);
    fireEvent.change(input, { target: { value: valor } });
  };

  it("Preenche todo o formulário, realiza envio do mesmo e recebe sucesso", async () => {
    mock
      .onPost("/solicitacoes-dieta-especial/alteracao-ue/")
      .reply(201, { detail: "Solicitação de alteração criada com sucesso." });

    await act(async () => {
      setCodigoEol("codigo-eol-aluno", "4899926");
    });

    await act(async () => {
      setCodigoEol("codigo-eol-escola", "019659");
    });

    setMotivo();
    setData("De", "01/09/2025");
    setData("Até", "31/09/2025");

    const botao = screen.getByTestId("botao-enviar");
    fireEvent.click(botao);
    await waitFor(() => {
      expect(
        screen.getByText("Solicitação de alteração criada com sucesso")
      ).toBeInTheDocument();
    });
  });
});
