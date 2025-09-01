import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { mockAlunos } from "src/mocks/services/perfil.service/alunos";
import FormFiltros from "../../components/FormFiltros";
import mock from "src/services/_mock";

describe("Verifica comportamento de formulários de filtros - Relatório Gestão de Dietas Especiais", () => {
  const onSubmit = jest.fn();
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
            <FormFiltros onSubmit={onSubmit} setCarregando={jest.fn()} />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Verifica renderização componente", () => {
    expect(
      screen.getByText("Diretoria Regional de Educação")
    ).toBeInTheDocument();
    expect(screen.getByText("Unidade Escolar")).toBeInTheDocument();
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

  const setMultiSelect = async (label, value) => {
    const selectLabel = screen.getByText(label);
    const dropdown =
      selectLabel.closest(".select") ||
      selectLabel.closest(".final-form-multi-select");

    fireEvent.mouseDown(dropdown);

    const listbox = await screen.findByRole("listbox");
    const option = within(listbox).getByText(value);

    fireEvent.click(option);
  };

  it("Seleciona campos  e verifica se campo está preenchido", async () => {
    await act(async () => {
      setDre("8f1da4a7-11b6-4a09-9eaa-6633d066f26b");
    });

    setMultiSelect("Classificação da dieta", "Tipo A");

    const botao = screen.getByText("Consultar");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
