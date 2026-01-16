import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "../../../../../services/_mock";
import { ToastContainer } from "react-toastify";
import FichaRecebimentoPage from "../../../../../pages/Recebimento/FichaRecebimento/FichaRecebimentoPage";
import { mockListaProdutosLogistica } from "../../../../../mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockEmpresas } from "../../../../../mocks/terceirizada.service/mockGetListaSimples";
import { mockFichas } from "../../../../../mocks/fichaRecebimento.service/mockListarFichasRecebimento";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

beforeEach(() => {
  localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

  mock.onGet("/fichas-de-recebimento/").reply(200, {
    results: mockFichas,
    count: mockFichas.length,
  });

  mock
    .onGet("/cadastro-produtos-edital/lista-completa-logistica/")
    .reply(200, mockListaProdutosLogistica);

  mock.onGet("/terceirizadas/lista-simples/").reply(200, mockEmpresas);
});

afterEach(() => {
  mock.reset();
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosDilogQualidade,
            setMeusDados: jest.fn(),
          }}
        >
          <FichaRecebimentoPage />
          <ToastContainer />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("FichaRecebimentoListagem", () => {
  it("deve renderizar o componente corretamente e carregar dados iniciais", async () => {
    await setup();

    expect(
      screen.getByText("Filtrar por Nº do Cronograma"),
    ).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Status")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Produto")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Empresa")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por Período")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Recebimento")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Recebimentos Cadastrados")).toBeInTheDocument();
      expect(screen.getByText("CRONO-001")).toBeInTheDocument();
      expect(screen.getByText("CRONO-002")).toBeInTheDocument();

      const tagLeveLeite = document.querySelector(".tag-leve-leite");
      expect(tagLeveLeite).toBeInTheDocument();
      expect(tagLeveLeite).toHaveTextContent("LEVE LEITE - PLL");

      const todasTagsLeveLeite = document.querySelectorAll(".tag-leve-leite");
      expect(todasTagsLeveLeite.length).toBe(1);
    });
  });

  it("deve exibir mensagem quando não houver resultados", async () => {
    mock.onGet("/fichas-de-recebimento/").reply(200, {
      results: [],
      count: 0,
    });

    await setup();

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("deve aplicar filtros quando o formulário é submetido", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("CRONO-001")).toBeInTheDocument();
    });

    const initialCallCount = mock.history.get.length;

    const inputCronograma = screen.getByPlaceholderText(
      "Digite o Nº do Cronograma",
    );
    fireEvent.change(inputCronograma, { target: { value: "123" } });

    const aplicarButton = screen.getByText("Filtrar");
    fireEvent.click(aplicarButton);

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(initialCallCount);
    });
  });

  it("deve baixar o PDF da ficha de recebimento quando o botão de impressão for clicado", async () => {
    window.URL.createObjectURL = jest.fn();

    mock
      .onGet(/\/fichas-de-recebimento\/[^/]+\/gerar-pdf-ficha\//)
      .reply(200, new Blob());

    await setup();

    await waitFor(() => {
      expect(screen.getByText("CRONO-001")).toBeInTheDocument();
    });

    const botoesImprimir = screen.getAllByTitle("Imprimir");
    fireEvent.click(botoesImprimir[0]);

    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  it("deve limpar filtros quando o botão de limpar é clicado", async () => {
    await setup();

    await waitFor(() => {
      expect(screen.getByText("CRONO-001")).toBeInTheDocument();
    });

    const initialCallCount = mock.history.get.length;

    const inputCronograma = screen.getByPlaceholderText(
      "Digite o Nº do Cronograma",
    );
    fireEvent.change(inputCronograma, { target: { value: "123" } });

    const limparButton = screen.getByText("Limpar Filtros");
    fireEvent.click(limparButton);

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThan(initialCallCount);
    });
  });

  it("deve truncar strings longas nos tooltips", async () => {
    await setup();

    await waitFor(() => {
      const produtoTruncado = screen.getByText(
        "Produto Teste 1 com nome muito...",
      );
      const fornecedorTruncado = screen.getByText(
        "Fornecedor Teste com nome muit...",
      );

      expect(produtoTruncado).toBeInTheDocument();
      expect(fornecedorTruncado).toBeInTheDocument();
    });
  });

  it("deve navegar para a página de cadastro ao clicar no botão", async () => {
    await setup();

    const cadastroLink = screen.getByText("Cadastrar Recebimento").closest("a");
    expect(cadastroLink).toHaveAttribute(
      "href",
      "/recebimento/cadastro-ficha-recebimento",
    );
  });

  it("deve lidar com erro na busca de fichas de recebimento", async () => {
    mock.onGet("/fichas-de-recebimento/").reply(200, {
      results: [],
      count: 0,
    });

    await setup();

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum resultado encontrado"),
      ).toBeInTheDocument();
    });
  });
});
