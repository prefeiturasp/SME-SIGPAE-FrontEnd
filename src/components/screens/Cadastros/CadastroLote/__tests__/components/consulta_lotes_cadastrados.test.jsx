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
import { mockLotesCadastrados } from "src/mocks/lote.service/mockLotesCadastrados";
import LotesCadastrados from "../../components/LotesCadastrados";

describe("Verifica comportamentos de consulta de lotes cadastrados", () => {
  let fetchSpy;
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    fetchSpy = jest.spyOn(window, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockLotesCadastrados),
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
            <LotesCadastrados />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("Verifica se as colunas da exibição foram renderizadas", async () => {
    await waitFor(() => {
      expect(screen.getByText("Nome/Nº Lote")).toBeInTheDocument();
      expect(screen.getByText("DRE")).toBeInTheDocument();
      expect(screen.getByText("Tipo de Gestão")).toBeInTheDocument();
    });
  });

  it("Verifica se os dados dos lotes são renderizados corretamente após o carregamento", () => {
    const primeiroLote = mockLotesCadastrados.results[0];
    expect(
      screen.getByText(`${primeiroLote.nome} ${primeiroLote.iniciais}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(primeiroLote.diretoria_regional.nome)
    ).toBeInTheDocument();
  });

  it("Verifica se o nome da empresa aparece após expandir um lote", async () => {
    const loteComEmpresa = mockLotesCadastrados.results.find(
      (lote) => lote.terceirizada !== null
    );

    const loteToggle = screen.getByTestId(
      `toggle-expandir-${loteComEmpresa.uuid}`
    );
    fireEvent.click(loteToggle);

    await waitFor(() => {
      expect(
        screen.getByText(loteComEmpresa.terceirizada.nome_fantasia)
      ).toBeInTheDocument();
    });
  });
});
