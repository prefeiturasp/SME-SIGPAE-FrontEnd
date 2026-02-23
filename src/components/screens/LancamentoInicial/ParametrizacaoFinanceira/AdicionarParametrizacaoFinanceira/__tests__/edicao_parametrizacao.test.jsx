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
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockGetTiposUnidadeEscolarTiposAlimentacao } from "src/mocks/services/cadastroTipoAlimentacao.service/mockGetTiposUnidadeEscolarTiposAlimentacao";
import { mockGetDadosParametrizacaoFinanceira } from "src/mocks/services/parametrizacao_financeira.service/mockGetDadosParametrizacaoFinanceira";
import AdicionarParametrizacaoFinanceira from "../index";
import mock from "src/services/_mock";

describe("Testes formulário de edição - Parametrização Financeira", () => {
  const faixasEtarias = mockFaixasEtarias.results;
  const uuid = mockGetDadosParametrizacaoFinanceira.uuid;

  beforeEach(async () => {
    mock.onGet("/editais/lista-numeros/").reply(200, mockListaNumeros);
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);
    mock
      .onGet("/tipos-unidade-escolar-agrupados/")
      .reply(200, mockGetTiposUnidadeEscolarTiposAlimentacao);
    mock
      .onGet(
        `/medicao-inicial/parametrizacao-financeira/dados-parametrizacao-financeira/${uuid}/`,
      )
      .reply(200, mockGetDadosParametrizacaoFinanceira);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            `/medicao-inicial/parametrizacao-financeira?uuid=${uuid}`,
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <AdicionarParametrizacaoFinanceira />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("deve exibir botão 'criar cópia' e possibilitar clique", async () => {
    const botaoCriarCopia = screen.getByTestId("botao-criar-copia");
    expect(botaoCriarCopia).toBeInTheDocument();
    fireEvent.click(botaoCriarCopia);

    await waitFor(() => {
      expect(
        screen.getByText("Copiar Parametrização Financeira"),
      ).toBeInTheDocument();
    });
  });

  it("deve confirmar bloqueio de edição por vigência", async () => {
    [
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario`,
      `tabelas[Preço das Alimentações - Período Integral].${faixasEtarias[0].__str__}.valor_unitario_reajuste`,
    ].forEach((campo) => {
      const inputValorUnitario = screen.getByTestId(campo);
      expect(inputValorUnitario).toBeDisabled();
    });
  });
});
