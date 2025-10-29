import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { ToastContainer } from "react-toastify";
import { mockGetDadosUsuarioEOL } from "src/mocks/services/permissoes.service/mockGetDadosUsuarioEOL";
import AtualizacaoEmail from "../index";
import mock from "src/services/_mock";

describe("Testes da interface de AtualizacaoEmailEOL", () => {
  beforeEach(async () => {
    mock
      .onGet(`/dados-usuario-eol-completo/${mockGetDadosUsuarioEOL.rf}/`)
      .reply(200, mockGetDadosUsuarioEOL);
    mock
      .onPatch(
        `/cadastro-com-coresso/${mockGetDadosUsuarioEOL.rf}/alterar-email/`,
      )
      .reply(200, {});

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
            <AtualizacaoEmail />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza os campos iniciais do formulário", () => {
    expect(screen.getByText("Pesquisar RF")).toBeInTheDocument();
    expect(screen.getByText("Nome do Usuário")).toBeInTheDocument();
    expect(screen.getByText("Cargo")).toBeInTheDocument();
    expect(screen.getByText("CPF")).toBeInTheDocument();
  });

  it("reseta formulário ao clicar em Limpar", async () => {
    const inputRF = screen.getByTestId("input-rf");
    fireEvent.change(inputRF, { target: { value: "12345" } });

    const botaoLimpar = screen.getByTestId("botao-limpar");
    act(() => {
      fireEvent.click(botaoLimpar);
    });

    await waitFor(() => {
      expect(inputRF).not.toHaveValue("12345");
    });
  });

  it("busca dados do usuário no EOL e preenche os campos", async () => {
    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: mockGetDadosUsuarioEOL.rf },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    await waitFor(() => {
      expect(screen.getByTestId("input-nome-usuario")).toHaveValue(
        "EDNA INES NATALI DEMETRIO",
      );
      expect(screen.getByTestId("input-cargo")).toHaveValue(
        "PROF.ENS.FUND.II E MED.-MATEMATICA",
      );
      expect(screen.getByTestId("input-email")).toHaveValue(
        "edna.demetrio@sme.prefeitura.sp.gov.br",
      );
      expect(screen.getByTestId("input-cpf").value).toEqual(
        expect.stringContaining("***"),
      );
    });
  });

  it("chama API para alterar email com sucesso", async () => {
    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: mockGetDadosUsuarioEOL.rf },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    const emailField = screen.getByPlaceholderText("@sme.prefeitura.sp.gov.br");
    fireEvent.change(emailField, {
      target: { value: "teste@sme.prefeitura.sp.gov.br" },
    });

    fireEvent.click(screen.getByTestId("botao-salvar"));

    await waitFor(() => {
      expect(
        screen.getByText("E-mail atualizado com sucesso no EOL!"),
      ).toBeInTheDocument();
    });
  });

  it("campo RF deve estar desativado ao preencher RF e buscar", async () => {
    const campoRf = screen.getByTestId("input-rf");
    fireEvent.change(campoRf, {
      target: { value: mockGetDadosUsuarioEOL.rf },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    await waitFor(() => {
      expect(campoRf).toBeDisabled();
    });
  });
});
