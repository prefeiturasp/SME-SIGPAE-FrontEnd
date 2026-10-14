import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockListaInformacoesNutricionais } from "src/mocks/produto.service/mockGetInformacoesNutricionaisOrdenadas";
import { mockEmpresa } from "src/mocks/terceirizada.service/mockGetTerceirizadaUUID";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import { mockFichaTecnicaComDetalhe } from "src/mocks/services/fichaTecnica.service/mockGetFichaTecnicaComAnalise";
import DetalharFichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/DetalharFichaTecnicaPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/Toast/dialogs");

const setup = async () => {
  window.history.pushState({}, "", `?uuid=${mockFichaTecnicaComDetalhe.uuid}`);

  await act(async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          <DetalharFichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("DetalharFichaTecnicaPage - Permissões DILOG_VISUALIZACAO (somente visualização)", () => {
  beforeEach(() => {
    mock
      .onGet(`/informacoes-nutricionais/ordenadas/`)
      .reply(200, mockListaInformacoesNutricionais);
    mock
      .onGet(`/terceirizadas/${mockFichaTecnicaComDetalhe.empresa.uuid}/`)
      .reply(200, mockEmpresa);
    mock
      .onGet(
        `/ficha-tecnica/${mockFichaTecnicaComDetalhe.uuid}/detalhar-com-analise/`,
      )
      .reply(200, mockFichaTecnicaComDetalhe);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);
    localStorage.setItem("perfil", PERFIL.DILOG_VISUALIZACAO);
    localStorage.setItem("meusDados", JSON.stringify(mockMeusDadosFornecedor));
  });

  it("libera a visualização do detalhamento da ficha técnica", async () => {
    await setup();

    expect(
      await screen.findByText("Identificação do Produto"),
    ).toBeInTheDocument();
  });

  it("não exibe botões de ação/edição (apenas visualização)", async () => {
    await setup();

    await screen.findByText("Identificação do Produto");

    expect(screen.queryByText("Enviar Análise")).not.toBeInTheDocument();
    expect(screen.queryByText("Salvar Rascunho")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Atualizar Ficha Técnica"),
    ).not.toBeInTheDocument();
  });
});
