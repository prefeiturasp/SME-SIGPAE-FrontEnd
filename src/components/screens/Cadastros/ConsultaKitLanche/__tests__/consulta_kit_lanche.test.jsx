import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockConsultaKitLanches } from "src/mocks/services/kitLanche.service/consultaKitLanches";
import { mockConsultaKitLanchesPage2 } from "src/mocks/services/kitLanche.service/consultaKitLanchesPage2";
import { ConsultaKitLanchePage } from "src/pages/Cadastros/ConsultaKitLanchePage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste Consulta de Kit Lanche", () => {
  let container;

  beforeEach(async () => {
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);

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
      ({ container } = renderWithProvider(
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
            <ConsultaKitLanchePage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      ));
    });
  });

  it("Deve renderizar a página de Consulta de Kit Lanche", () => {
    expect(screen.queryAllByText("Consulta de Kits")).toHaveLength(2);
  });

  it("Pesquisa por número do edital deve funcionar", async () => {
    const campoNumeroEdital = screen.getByTestId("numero-edital-autocomplete");
    const inputElement = campoNumeroEdital.querySelector("input");
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, {
      target: { value: "PARCEIRA" },
    });
    await waitFor(() => {
      expect(inputElement.value).toBe("PARCEIRA");
    });

    const botaoConsultar = screen.getByText("Consultar").closest("button");
    mock
      .onGet("/kit-lanches/consulta-kits/")
      .replyOnce(200, mockConsultaKitLanches);
    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(screen.getByText("EDITAL MODELO IMR")).toBeInTheDocument();
    });

    const item = container.querySelector(".ant-pagination-item-2");
    expect(item).toBeInTheDocument();

    mock
      .onGet("/kit-lanches/consulta-kits/")
      .replyOnce(200, mockConsultaKitLanchesPage2);

    fireEvent.click(item);
    await waitFor(() => {
      expect(screen.getByText("gdgdgdgds")).toBeInTheDocument();
    });

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    await waitFor(() => {
      expect(inputElement.value).toBe("");
    });
  });
});
