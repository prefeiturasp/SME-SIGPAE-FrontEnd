import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import RelatorioGestaoDietaEspecial from "src/pages/DietaEspecial/RelatorioGestaoDietaEspecial";
import mock from "src/services/_mock";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockAlunos } from "src/mocks/services/perfil.service/alunos";
import { mockRelatorioGestaoDietasEspeciais } from "src/mocks/services/dietaEspecial.service/relatorioGestaoDietaEspecial";

describe("Teste interface de Relatório Gestão de Dieta Especial", () => {
  const _DRE = "8f1da4a7-11b6-4a09-9eaa-6633d066f26b";
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosNutriSupervisao);
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock.onGet("/alergias-intolerancias/").reply(200, alergiasIntolerantes());
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, mockDiretoriaRegionalSimplissima);
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/")
      .reply(200, mockGetEscolaTercTotal);
    mock.onGet("/alunos/").reply(200, { results: mockAlunos });
    mock
      .onPost("/solicitacoes-dieta-especial/relatorio-dieta-especial/")
      .reply(200, mockRelatorioGestaoDietasEspeciais);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);

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
              meusDados: mockMeusDadosNutriSupervisao,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioGestaoDietaEspecial />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza título e breadcrumb `Relatório de Gestão Dieta Especial`", () => {
    expect(
      screen.queryAllByText("Relatório de Gestão Dieta Especial")
    ).toHaveLength(2);
  });

  it("Verifica renderização componente de filtros", () => {
    expect(
      screen.getByText("Diretoria Regional de Educação")
    ).toBeInTheDocument();
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
  });

  const setDre = (valor) => {
    const campoDre = screen.getByTestId("select-dre");
    const select = campoDre.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  it("Seleciona DRE e verifica se campo está preenchido", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await waitFor(() => {
      expect(screen.getByText("BUTANTA")).toBeInTheDocument();
    });
  });

  it("Seleciona DRE, limpa filtros e verifica se campo está vazio", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    const botao = screen.getByText("Limpar Filtros");
    fireEvent.click(botao);

    const select = screen.getByTestId("select-dre");
    expect(select.value).toBeUndefined();
  });

  const consultar = () => {
    const botao = screen.getByText("Consultar");
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);
  };

  it("Seleciona DRE, clica em consultar e verifica exibição de modal", async () => {
    await act(async () => {
      setDre(_DRE);
    });

    await act(async () => {
      consultar();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Relatório de dieta especial")
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("CIEJA ALUNA JESSICA NUNES HERCULANO")
      ).toHaveLength(2);
    });
  });
});
