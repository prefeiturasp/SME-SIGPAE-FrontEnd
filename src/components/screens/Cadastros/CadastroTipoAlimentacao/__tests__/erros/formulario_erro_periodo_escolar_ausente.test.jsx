import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockGetTiposUnidadeEscolar } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolar";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { ToastContainer } from "react-toastify";
import Container from "../../Container";

describe("Verifica comportamento do formulário de cadastro de tipo de alimentação ao não receber períodos escolar", () => {
  let fetchSpy;
  beforeEach(async () => {
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/tipos-unidade-escolar/")
      .reply(200, mockGetTiposUnidadeEscolar);
    fetchSpy = jest.spyOn(window, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
        ok: true,
        status: 200,
      })
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
            <ToastContainer />
            <Container />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  const selecionaTipoUnidade = () => {
    const caretIcon = screen.getByLabelText(/caret-down/i);
    fireEvent.click(caretIcon);
    const opcao = screen.getByText("CCI");
    expect(opcao).toBeInTheDocument();
    fireEvent.click(opcao);
  };

  it("Não recebe períodos e retorna o aviso de que nenhum está associado ao tipo de unidade escolar selecionado", async () => {
    selecionaTipoUnidade();
    await waitFor(() => {
      expect(
        screen.getByText(
          /nenhum período escolar está associado ao tipo de unidade escolar selecionado/i
        )
      ).toBeInTheDocument();
    });
  });
});
