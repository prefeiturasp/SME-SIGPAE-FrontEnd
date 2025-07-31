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
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { ToastContainer } from "react-toastify";
import Container from "../../Container";

describe("Verifica comportamento do formulário de cadastro de tipo de alimentação ao receber erro", () => {
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
            count: 3,
            next: null,
            previous: null,
            results: mockGetVinculosTipoAlimentacaoPorEscola.results.filter(
              (e) => e.tipo_unidade_escolar.iniciais === "CCI"
            ),
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

  it("Envia atualização de vinculo e recebe retorno de erro do backend", async () => {
    mock
      .onPut(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/atualizar_lista_de_vinculos/"
      )
      .reply(400, {});
    selecionaTipoUnidade();

    await waitFor(() => {
      const opcao = screen.getAllByRole("checkbox", { name: /lanche 4h/i })[0];
      expect(opcao).toBeInTheDocument();
      fireEvent.click(opcao);
      expect(opcao).toBeChecked();
    });

    const botaoSalvar = screen.getAllByText(/salvar/i)[0].closest("button");
    expect(botaoSalvar).toBeEnabled();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText(/erro ao atualizar tipos de alimentação/i)
      ).toBeInTheDocument();
    });
  });
});
