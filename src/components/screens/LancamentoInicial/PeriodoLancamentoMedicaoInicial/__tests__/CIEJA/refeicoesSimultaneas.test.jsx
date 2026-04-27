import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosEscolaCIEJA } from "src/mocks/meusDados/escolaCIEJA";
import { mockGetVinculosTipoAlimentacaoPorEscolaCIEJA } from "src/mocks/services/cadastroTipoAlimentacao.service/CIEJA/mockGetVinculosTipoAlimentacaoPorEscolaCIEJA";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { logDietasAutorizadasMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/logDietasAutorizadasMaio2025";
import { valoresMedicaoMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/valoresMedicaoMaio2025";
import { diasCalendarioMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/diasCalendarioMaio2025";
import { matriculadosMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/matriculadosMaio2025";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import { stateManhaMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CIEJA/stateManhaMaio2025";

import preview from "jest-preview";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, onChange }) => (
    <textarea
      data-testid="ckeditor-mock"
      {...input}
      onChange={(e) => {
        input.onChange(e.target.value);
        onChange && onChange(e.target.value, { getData: () => e.target.value });
      }}
    />
  ),
}));

describe("Teste Refeições Simultâneas - CIEJA", () => {
  const escolaUuid = mockMeusDadosEscolaCIEJA.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    jest.clearAllMocks();

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCIEJA);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCIEJA);
    mock.onGet("medicao-inicial/lanches-emergenciais-diarios/").reply(200, []);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, logDietasAutorizadasMaio2025);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, valoresMedicaoMaio2025);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock.onGet("/dias-calendario/").reply(200, diasCalendarioMaio2025);
    mock.onGet("/matriculados-no-mes/").reply(200, matriculadosMaio2025);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/",
      )
      .reply(200, {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      });
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["01"] });

    const search = `?uuid=a2eed560-2255-4067-a803-4ad6b9f1d26a&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: stateManhaMaio2025,
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCIEJA,
              setMeusDados: jest.fn(),
            }}
          >
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  describe("Testa conteúdo básico da tela", () => {
    it("renderiza label `Mês do Lançamento`", async () => {
      expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
      preview.debug();
    });
  });
});
