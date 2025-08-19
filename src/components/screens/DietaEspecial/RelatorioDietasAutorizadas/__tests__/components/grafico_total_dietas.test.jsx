import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { mockFiltrosRelatorioDietasEspeciais } from "src/mocks/services/dietaEspecial.service/mockGetFiltrosRelatorioDietasEspeciais";
import { mockSolicitacoesGraficos } from "src/mocks/services/relatorios.service/mockGetSolicitacoesGraficos";
import mock from "src/services/_mock";
import { Graficos } from "../../components/Graficos";

jest.mock(
  "../../components/Graficos/components/GraficoDietasAutorizadasDRELote",
  () => ({
    GraficoDietasAutorizadasDRELote: ({ chartData }) => (
      <div data-testid="grafico">{JSON.stringify(chartData)}</div>
    ),
  })
);

describe("Verifica componente de gráficos de dietas autorizadas", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onPost("/solicitacoes-genericas/filtrar-solicitacoes-graficos/")
      .reply(200, mockSolicitacoesGraficos);

    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <Graficos
              valuesForm={{
                status_selecionado: "AUTORIZADAS",
              }}
              values={mockFiltrosRelatorioDietasEspeciais}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica se o componente foi renderizado", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("grafico")).toBeInTheDocument();
      expect(screen.getByTestId("grafico")).toHaveTextContent(
        "Total de Dietas Especiais Autorizadas por DRE e Lote"
      );
    });
  });
});
