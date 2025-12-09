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
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa2 } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockFichaTecnicaComDetalhe2 } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import AlterarFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/AlterarFichaTecnicaPage";
import mock from "src/services/_mock";

beforeEach(() => {
  const mockPdfBlob = new Blob(["mocked PDF content"], {
    type: "application/pdf",
  });

  mock
    .onGet(`/unidades-medida-logistica/lista-nomes-abreviacoes/`)
    .reply(200, mockListaUnidadesMedidaLogistica);
  mock
    .onGet(`/informacoes-nutricionais/ordenadas/`)
    .reply(200, mockListaInformacoesNutricionais);
  mock
    .onGet(
      `/cadastro-produtos-edital/lista-completa-logistica/d15c948-146c-41a0-aa1e-d39670858e2e.pdf`,
    )
    .reply(200, mockListaProdutosLogistica);
  mock
    .onGet(
      `/ficha-tecnica/${mockFichaTecnicaComDetalhe2.uuid}/detalhar-com-analise/`,
    )
    .reply(200, mockFichaTecnicaComDetalhe2);
  mock.onGet(`/fabricantes/lista-nomes/`).reply(200, mockListaFabricantes);
  mock.onGet(new RegExp("^/terceirizadas/.*")).reply(200, mockEmpresa2);
  mock
    .onGet(`/media/fichas_tecnicas/ad15c948-146c-41a0-aa1e-d39670858e2e.pdf`)
    .reply(200, mockPdfBlob);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
});

const setup = async () => {
  const search = `?uuid=${mockFichaTecnicaComDetalhe2.uuid}`;
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
          <AlterarFichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste - Alterar Ficha técnica", () => {
  it("verifica se indicações de correções renderizam na ficha técnica", async () => {
    await setup();

    expect(screen.getByText("Ficha Técnica FT024")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    const correcoes = screen.getAllByTestId("textarea-div");

    const textarea = correcoes[0].querySelector("textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue("Adicione um Envasador.");
  });

  it("valida se collapses com indicação de correção estão devidamente habilitados para edição", async () => {
    await setup();

    expect(screen.getByText("Ficha Técnica FT024")).toBeInTheDocument();

    const cepInput = screen.getByPlaceholderText("Digite o CEP");
    expect(cepInput).not.toBeDisabled();

    // Collapse 'Conferido' deveria estar com campo desabilitado
    const embalagemInput = screen.getByPlaceholderText(
      "Digite as informações de armazenamento para embalagem primária",
    );
    expect(embalagemInput).toBeDisabled();
  });

  it("abre e fecha seção de adicionar envasador/distribuidor", async () => {
    await setup();

    expect(screen.getByText("Ficha Técnica FT024")).toBeInTheDocument();

    const botaoAdicionar = screen.getByText(
      "+ Adicionar Envasador/Distribuidor",
    );
    expect(botaoAdicionar).toBeInTheDocument();
    fireEvent.click(botaoAdicionar);
    expect(screen.getByTestId("fabricante_1")).toBeInTheDocument();

    const emailInputs = screen.getAllByPlaceholderText("Digite o E-mail");

    fireEvent.change(emailInputs[1], {
      target: { value: "teste@exemplo.com" },
    });

    const botaoExcluir = screen.getByTestId("excluir-envasador");
    fireEvent.click(botaoExcluir);
  });

  it("renderiza tag Leve Leite quando programa é LEVE_LEITE", async () => {
    await setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
  });
});
