import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockListaInformacoesNutricionais } from "mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { getInformacoesNutricionaisOrdenadas } from "services/produto.service";
import {
  cadastraAnaliseFichaTecnica,
  cadastraRascunhoAnaliseFichaTecnica,
  getFichaTecnicaComAnalise,
  imprimirFichaTecnica,
} from "services/fichaTecnica.service";
import { getTerceirizadaUUID } from "services/terceirizada.service";
import { debug } from "jest-preview";
import { mockMeusDadosFornecedor } from "mocks/services/perfil.service/mockMeusDados";
import Analisar from "../components/Analisar";
import {
  mockFichaTecnicaComDetalhe,
  mockFichaTecnicaComDetalheSemAnalise,
} from "mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";

jest.mock("services/terceirizada.service.js");
jest.mock("services/produto.service.js");
jest.mock("services/fichaTecnica.service.ts");
jest.setTimeout(20000);

beforeEach(() => {
  getInformacoesNutricionaisOrdenadas.mockResolvedValue({
    data: mockListaInformacoesNutricionais,
    status: 200,
  });

  getTerceirizadaUUID.mockResolvedValue({
    data: mockEmpresa,
    status: 200,
  });

  jest.mocked(getFichaTecnicaComAnalise).mockResolvedValue({
    data: mockFichaTecnicaComDetalheSemAnalise,
    status: 200,
  });

  jest.mocked(cadastraAnaliseFichaTecnica).mockResolvedValue({
    status: 200,
  });
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
          <Analisar somenteLeitura={somenteLeitura} />
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
    expect(getFichaTecnicaComAnalise).toHaveBeenCalled();

    jest.mocked(cadastraRascunhoAnaliseFichaTecnica).mockResolvedValue({
      data: mockFichaTecnicaComDetalhe,
      status: 200,
    });

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
    expect(getFichaTecnicaComAnalise).toHaveBeenCalled();

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
    jest.mocked(getFichaTecnicaComAnalise).mockResolvedValue({
      data: mockFichaTecnicaComDetalhe,
      status: 200,
    });

    await setup(true);
    expect(
      screen.getByText(`Solicitada correção em 23/01/2025 - 11:02`)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`Indicações de Correções CODAE`)[0]
    ).toBeInTheDocument();
    expect(getFichaTecnicaComAnalise).toHaveBeenCalled();
  });

  it("carrega no modo Detalhar e imprime a ficha", async () => {
    await setup(true);
    expect(getFichaTecnicaComAnalise).toHaveBeenCalled();

    jest.mocked(imprimirFichaTecnica).mockResolvedValue();

    const btnImprimir = screen.getByText("Ficha em PDF").closest("button");
    fireEvent.click(btnImprimir);

    expect(btnImprimir).toBeInTheDocument();
  });
});
