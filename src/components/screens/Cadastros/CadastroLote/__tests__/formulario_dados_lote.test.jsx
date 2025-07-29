import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import Container from "../Container";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import loadLote from "src/reducers/lote.reducer";
import { Provider } from "react-redux";
import { mockSubPrefeituras } from "src/mocks/lote.service/mockSubPrefeituras";
import { mockTiposGestao } from "src/mocks/lote.service/mockTiposGestao";
import { mockDiretoriasRegionaisSimplissima } from "src/mocks/lote.service/mockDiretoriasRegionaisSimplissima";

describe("Verifica os comportamentos do formulário de dados do cadastro de lote", () => {
  beforeEach(async () => {
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriasRegionaisSimplissima);
    mock.onGet("/tipos-gestao/").reply(200, mockTiposGestao);
    mock.onGet("/subprefeituras/").reply(200, mockSubPrefeituras);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    const rootReducer = combineReducers({
      loteForm: formReducer,
      cadastroProduto: loadLote,
    });
    const store = createStore(rootReducer, {});

    await act(async () => {
      render(
        <Provider store={store}>
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
              <Container />
            </MeusDadosContext.Provider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  it("Verifica se a interface foi renderizada", () => {
    expect(screen.getByText(/dados do lote/i)).toBeInTheDocument();
    expect(
      screen.getByText(/consulta de lotes cadastrados/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/salvar/i)).toBeInTheDocument();
    expect(screen.getByText(/limpar campos/i)).toBeInTheDocument();
  });

  const setCampoSelecao = (id, valor) => {
    const dreSelect = screen.getByTestId(id);
    const inputElement = dreSelect.querySelector("select");
    fireEvent.change(inputElement, {
      target: {
        value: valor,
      },
    });
  };

  const setCampoTexto = (id, valor) => {
    const campoTexto = screen.getByTestId(id);
    fireEvent.focus(campoTexto);
    fireEvent.change(campoTexto, {
      target: { value: valor },
    });
  };

  it("Preenche o formulário de dados do lote e salva", async () => {
    const opcaoDiretoria = mockDiretoriasRegionaisSimplissima.results.find(
      (e) => e.nome === "DIRETORIA REGIONAL DE EDUCACAO BUTANTA"
    ).uuid;
    setCampoSelecao("diretoria-regional-select", opcaoDiretoria);
    setCampoTexto("iniciais-dre-input", "DRETESTE");
    setCampoTexto("numero-lote-input", "123");

    const opcaoTipo = mockTiposGestao.results.find(
      (e) => e.nome === "TERC TOTAL"
    ).uuid;
    setCampoSelecao("tipo-gestao-select", opcaoTipo);

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText(/deseja criar um novo lote?/i)
      ).toBeInTheDocument();
    });
  });

  it("Preenche o campo de número e utiliza botão limpar campos", async () => {
    const campoTexto = screen.getByTestId("numero-lote-input");
    fireEvent.change(campoTexto, {
      target: { value: "123" },
    });

    const botaoLimpar = screen.getByText(/limpar campos/i).closest("button");
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(campoTexto).toHaveValue("");
    });
  });
});
