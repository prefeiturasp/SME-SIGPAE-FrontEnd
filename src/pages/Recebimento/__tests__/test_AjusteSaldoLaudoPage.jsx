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
import { EDITAR_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";

import { debug } from "jest-preview";

describe("Testar Listagem dos Ajustes de Saldo", () => {
  beforeEach(async () => {
    mock.resetHistory();

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

  it("Testa os botões de ação (editar e excluir) na listagem", async () => {
    const primeiroAjuste = mockGetListagemAjustes.results[0];

    const linksEditar = screen.getAllByTitle("Editar");
    expect(linksEditar.length).toBe(mockGetListagemAjustes.results.length);

    const linkEditar = linksEditar[0].closest("a");
    expect(linkEditar).toHaveAttribute(
      "href",
      `/${RECEBIMENTO}/${EDITAR_SALDO_LAUDO}?uuid=${primeiroAjuste.uuid}`,
    );

    const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });
    expect(botoesExcluir.length).toBe(mockGetListagemAjustes.results.length);
  });

  it("Abre o modal de confirmação ao clicar em excluir e chama o service ao confirmar", async () => {
    const primeiroAjuste = mockGetListagemAjustes.results[0];
    mock.onDelete(`/ajuste-saldo-laudo/${primeiroAjuste.uuid}/`).reply(204);
    mock.onGet(`/ajuste-saldo-laudo/`).reply(200, {
      ...mockGetListagemAjustes,
      results: mockGetListagemAjustes.results.slice(1),
    });

    const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });
    fireEvent.click(botoesExcluir[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Excluir Ajuste de Saldo do Laudo"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Deseja realmente excluir o Ajuste de Saldo do Laudo?",
        ),
      ).toBeInTheDocument();
    });

    const botaoConfirmar = screen.getByText("Excluir").closest("button");
    await act(async () => {
      fireEvent.click(botaoConfirmar);
    });

    await waitFor(() => {
      expect(
        mock.history.delete.some((call) =>
          call.url.includes(`/ajuste-saldo-laudo/${primeiroAjuste.uuid}/`),
        ),
      ).toBe(true);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Excluir Ajuste de Saldo do Laudo"),
      ).not.toBeInTheDocument();
    });
  });

  it("Fecha o modal de exclusão sem chamar o service ao clicar em Não", async () => {
    const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });
    fireEvent.click(botoesExcluir[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Excluir Ajuste de Saldo do Laudo"),
      ).toBeInTheDocument();
    });

    const botaoNao = screen.getByText("Não").closest("button");
    fireEvent.click(botaoNao);

    await waitFor(() => {
      expect(
        screen.queryByText("Excluir Ajuste de Saldo do Laudo"),
      ).not.toBeInTheDocument();
    });

    expect(mock.history.delete.length).toBe(0);
  });
});
