import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import AjusteSaldoLaudoPage from "src/pages/Recebimento/AjusteSaldoLaudo/AjusteSaldoLaudoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { mockListaSimplesTerceirizadas } from "src/mocks/services/terceirizada.service/mockListaSimplesTerceirizadas";
import { mockGetListaCompletaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import {
  mockGetListagemAjustes,
  mockGetListagemAjustesFiltrados,
} from "../../../mocks/services/ajusteSaldo.service/mockGetListagemAjustes";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

import { debug } from "jest-preview";

describe("Testar Listagem dos Ajustes de Saldo", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet(`/cadastro-produtos-edital/lista-completa-logistica/`)
      .reply(200, mockGetListaCompletaProdutosLogistica);

    mock
      .onGet(`/terceirizadas/lista-simples/`)
      .reply(200, mockListaSimplesTerceirizadas);

    mock.onGet(`/ajuste-saldo-laudo/`).reply(200, mockGetListagemAjustes);

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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <AjusteSaldoLaudoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Testa a renderização dos elementos da página", async () => {
    expect(
      screen.getByText("Ajustes de Saldo Cadastrados"),
    ).toBeInTheDocument();

    expect(screen.getByText("Nº do Cronograma")).toBeInTheDocument();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Fornecedor")).toBeInTheDocument();
    expect(screen.getByText("Nº do Laudo")).toBeInTheDocument();
    expect(screen.getByText("Quantidade a ser Descontada")).toBeInTheDocument();

    const botaoCadastro = screen
      .getByText("Cadastrar Saldo do Laudo")
      .closest("button");
    expect(botaoCadastro).toBeInTheDocument();

    debug();
  });

  it("Testa o funcionamento dos filtros", async () => {
    mock
      .onGet(`/ajuste-saldo-laudo/`)
      .reply(200, mockGetListagemAjustesFiltrados);

    const inputFiltro = screen.getByPlaceholderText(
      "Digite o Nº do Cronograma",
    );
    fireEvent.change(inputFiltro, { target: { value: "039" } });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    expect(botaoFiltrar).toBeInTheDocument();
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("039/2023")).toBeInTheDocument();
      expect(screen.queryByText("156/2024A")).not.toBeInTheDocument();
    });
  });
});
