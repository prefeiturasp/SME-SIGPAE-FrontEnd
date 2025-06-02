import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockListaInformacoesNutricionais } from "mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { debug } from "jest-preview";
import { mockMeusDadosFornecedor } from "mocks/services/perfil.service/mockMeusDados";
import {
  mockFichaTecnicaComDetalhe,
  mockFichaTecnicaComDetalheSemAnalise,
} from "mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import DetalharFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/DetalharFichaTecnicaPage";
import AnalisarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AnalisarFichaTecnicaPage";
import mock from "src/services/_mock";

jest.setTimeout(20000);

beforeEach(() => {
  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);

  mock
    .onGet(`/terceirizadas/${mockFichaTecnicaComDetalhe.empresa.uuid}/`)
    .reply(200, mockEmpresa);

  mock
    .onGet(
      `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/detalhar-com-analise/`
    )
    .reply(200, mockFichaTecnicaComDetalheSemAnalise);

  mock
    .onPost(
      `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/analise-gpcodae/`
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
      </MemoryRouter>
    );
  });
};

describe("Carrega página de Cadastro de Ficha técnica", () => {
  it("cadastra Rascunho de Analise da Ficha", async () => {
    await setup();
    expect(screen.getByText(`Identificação do Produto`)).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0]
    ).toBeInTheDocument();

    mock
      .onPost(
        `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/rascunho-analise-gpcodae/`
      )
      .reply(201);

    const btnRascunho = screen.getByText("Salvar Rascunho").closest("button");
    expect(btnRascunho).not.toBeDisabled();
    fireEvent.click(btnRascunho);

    debug();
  });

  it("cadastra Analise da Ficha", async () => {
    await setup();
    expect(screen.getByText(`Identificação do Produto`)).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0]
    ).toBeInTheDocument();

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

    let btnCancelar = screen.getAllByText("Cancelar")[0].closest("button");
    fireEvent.click(btnCancelar);

    btnCorrecao = screen
      .getAllByText("Solicitar Correção")[0]
      .closest("button");
    fireEvent.click(btnCorrecao);

    debug();

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
        `/ficha-tecnica/${mockFichaTecnicaComDetalheSemAnalise.uuid}/detalhar-com-analise/`
      )
      .reply(200, mockFichaTecnicaComDetalhe);

    await setup(true);
    expect(
      screen.getByText(`Solicitada correção em 23/01/2025 - 11:02`)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0]
    ).toBeInTheDocument();
  });

  it("carrega no modo Detalhar e imprime a ficha", async () => {
    window.URL.createObjectURL = jest.fn();
    await setup(true);

    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalhe.uuid}/gerar-pdf-ficha/`
      )
      .reply(200, new Blob());

    const btnImprimir = screen.getByText("Ficha em PDF").closest("button");
    fireEvent.click(btnImprimir);

    expect(btnImprimir).toBeInTheDocument();
  });
});
