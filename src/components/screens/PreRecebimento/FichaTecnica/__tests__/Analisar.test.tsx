import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import {
  mockFichaTecnicaComDetalhe,
  mockFichaTecnicaComDetalheSemAnalise,
} from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import DetalharFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/DetalharFichaTecnicaPage";
import AnalisarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AnalisarFichaTecnicaPage";
import mock from "src/services/_mock";
import { toastError } from "src/components/Shareable/Toast/dialogs";

jest.mock("src/components/Shareable/Toast/dialogs");

beforeEach(() => {
  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);

  mock
    .onGet(`/terceirizadas/${mockFichaTecnicaComDetalhe.empresa.uuid}/`)
    .reply(200, mockEmpresa);

  mock
    .onGet(
      `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/detalhar-com-analise/`,
    )
    .reply(200, mockFichaTecnicaComDetalheSemAnalise);

  mock
    .onPost(
      `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/analise-gpcodae/`,
    )
    .reply(201);
});

const setup = async (somenteLeitura = false) => {
  const search = `?uuid=${mockFichaTecnicaComDetalhe.uuid}`;
  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
  });

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
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          {somenteLeitura ? (
            <DetalharFichaTecnicaPage />
          ) : (
            <AnalisarFichaTecnicaPage />
          )}
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Carrega página de Cadastro de Ficha técnica", () => {
  it("cadastra Rascunho de Analise da Ficha", async () => {
    await setup();
    expect(screen.getByText(`Identificação do Produto`)).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0],
    ).toBeInTheDocument();

    mock
      .onPost(
        `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/rascunho-analise-gpcodae/`,
      )
      .reply(201);

    const btnRascunho = screen.getByText("Salvar Rascunho").closest("button");
    expect(btnRascunho).not.toBeDisabled();
    fireEvent.click(btnRascunho);
  });

  it("cadastra Analise da Ficha", async () => {
    await setup();
    expect(screen.getByText(`Identificação do Produto`)).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0],
    ).toBeInTheDocument();

    let tagsPendentes = screen.getAllByText("Pendente de Análise");
    expect(tagsPendentes).toHaveLength(10);

    let botoesCiente = screen.getAllByText("Ciente");
    let botoesConferido = screen.getAllByText("Conferido");
    const btnAnalise = screen.getByText("Enviar Análise").closest("button");
    expect(btnAnalise).toBeDisabled();

    let arrayBotoes = [...botoesCiente, ...botoesConferido];

    arrayBotoes.forEach((span) => {
      fireEvent.click(span.closest("button"));
    });

    let btnCorrecao = screen
      .getAllByText("Solicitar Correção")[0]
      .closest("button");
    fireEvent.click(btnCorrecao);

    let inputFabricanteCorrecoes = screen.getByTestId(
      "fabricante_envasador_correcoes",
    );
    expect(inputFabricanteCorrecoes).toBeInTheDocument();

    let btnCancelar = screen.getAllByText("Cancelar")[0].closest("button");
    fireEvent.click(btnCancelar);

    btnCorrecao = screen
      .getAllByText("Solicitar Correção")[1]
      .closest("button");
    fireEvent.click(btnCorrecao);

    let inputCorrecoes = screen.getByTestId("detalhes_produto_correcoes");
    fireEvent.change(inputCorrecoes, {
      target: { value: "1111111" },
    });

    let btnSalvar = screen
      .getAllByText("Salvar Correções")[0]
      .closest("button");
    fireEvent.click(btnSalvar);

    expect(btnAnalise).not.toBeDisabled();
    fireEvent.click(btnAnalise);
  });

  it("carrega no modo Detalhar", async () => {
    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/detalhar-com-analise/`,
      )
      .reply(200, mockFichaTecnicaComDetalhe);

    await setup(true);
    expect(
      screen.getByText(
        `Solicitada correção em ${mockFichaTecnicaComDetalhe.log_mais_recente}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0],
    ).toBeInTheDocument();
  });

  it("carrega no modo Detalhar e imprime a ficha", async () => {
    window.URL.createObjectURL = jest.fn();
    await setup(true);

    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalhe.uuid}/gerar-pdf-ficha/`,
      )
      .reply(200, new Blob());

    const btnImprimir = screen.getByText("Ficha em PDF").closest("button");
    fireEvent.click(btnImprimir);

    expect(btnImprimir).toBeInTheDocument();
  });

  it("Verifica mensagem de falha ao baixar o PDF: erro 400", async () => {
    window.URL.createObjectURL = jest.fn();
    await setup(true);

    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalhe.uuid}/gerar-pdf-ficha/`,
      )
      .reply(400);

    const btnImprimir = screen.getByText("Ficha em PDF").closest("button");
    fireEvent.click(btnImprimir);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Ocorreu um erro durante a geração do pdf de Ficha Técnica",
      );
    });

    expect(btnImprimir).toBeInTheDocument();
  });

  it("Verifica mensagem de falha ao baixar o PDF: erro 500", async () => {
    window.URL.createObjectURL = jest.fn();
    await setup(true);

    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalhe.uuid}/gerar-pdf-ficha/`,
      )
      .reply(500);

    const btnImprimir = screen.getByText("Ficha em PDF").closest("button");
    fireEvent.click(btnImprimir);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro interno do servidor. Tente novamente em alguns instantes.",
      );
    });

    expect(btnImprimir).toBeInTheDocument();
  });

  it("renderiza tag Leve Leite quando programa é LEVE_LEITE", async () => {
    await setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
  });
});
