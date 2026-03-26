import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockListaUnidadesMedidaLogistica } from "src/mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa2 } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import { mockFichaTecnicaFLVCorrigir } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnaliseFLV";
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
      `/ficha-tecnica/${mockFichaTecnicaFLVCorrigir.uuid}/detalhar-com-analise/`,
    )
    .reply(200, mockFichaTecnicaFLVCorrigir);
  mock.onGet(`/fabricantes/lista-nomes/`).reply(200, mockListaFabricantes);
  mock.onGet(new RegExp("^/terceirizadas/.*")).reply(200, mockEmpresa2);
  mock
    .onGet(new RegExp(".*/media/fichas/assinada.pdf$"))
    .reply(200, mockPdfBlob);
  mock
    .onGet(new RegExp(".*/media/fichas_tecnicas/.*\\.pdf$"))
    .reply(200, mockPdfBlob);

  Object.defineProperty(global, "localStorage", { value: localStorageMock });
});

const setup = async () => {
  const search = `?uuid=${mockFichaTecnicaFLVCorrigir.uuid}`;
  window.history.pushState({}, "", search);

  await act(async () => {
    render(
      <MemoryRouter>
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

describe("Teste - Alterar Ficha técnica FLV", () => {
  it("deve renderizar apenas os 5 collapses específicos para FLV", async () => {
    await setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument(),
    );

    // Collapses esperados para FLV
    expect(screen.getAllByText("Proponente").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Fabricante, Produtor, Envasador ou Distribuidor"),
    ).toBeInTheDocument();
    expect(screen.getByText("Detalhes do Produto")).toBeInTheDocument();
    expect(
      screen.getByText("Responsável Técnico e Anexos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Outras Informações")).toBeInTheDocument();

    // Collapses que NÃO devem aparecer para FLV
    expect(
      screen.queryByText("Informações Nutricionais"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Conservação")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Temperatura e Transporte"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Armazenamento")).not.toBeInTheDocument();
    expect(screen.queryByText("Embalagem e Rotulagem")).not.toBeInTheDocument();
    expect(screen.queryByText("Modo de Preparo")).not.toBeInTheDocument();
  });
});
